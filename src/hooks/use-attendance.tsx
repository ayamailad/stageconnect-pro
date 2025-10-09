import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"

export interface AttendanceRecord {
  id: string
  intern_id: string
  date: string
  check_in_time: string | null
  check_out_time: string | null
  status: string
  notes: string | null
  created_at: string
  updated_at: string
  intern?: {
    id: string
    first_name: string
    last_name: string
  }
}

export interface Intern {
  id: string
  first_name: string
  last_name: string
  internship?: {
    id: string
    start_date: string
    end_date: string
  }
}

export const useAttendance = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [interns, setInterns] = useState<Intern[]>([])
  const [loading, setLoading] = useState(true)

  // Get supervisor profile ID
  const getSupervisorProfileId = async () => {
    if (!user) return null
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (error) throw error
      return data?.id
    } catch (error) {
      console.error("Error fetching supervisor profile:", error)
      return null
    }
  }

  // Fetch interns assigned to supervisor
  const fetchInterns = async () => {
    try {
      const profileId = await getSupervisorProfileId()
      if (!profileId) return

      const { data, error } = await supabase
        .from("internships")
        .select(`
          id,
          start_date,
          end_date,
          intern:profiles!internships_intern_id_fkey(
            id,
            first_name,
            last_name
          )
        `)
        .eq("supervisor_id", profileId)
        .eq("status", "in_progress")

      if (error) throw error

      const internsData = data
        ?.filter(i => i.intern)
        .map(i => ({
          id: i.intern.id,
          first_name: i.intern.first_name,
          last_name: i.intern.last_name,
          internship: {
            id: i.id,
            start_date: i.start_date,
            end_date: i.end_date
          }
        })) || []

      setInterns(internsData)
    } catch (error: any) {
      console.error("Error fetching interns:", error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible de charger les stagiaires",
        variant: "destructive"
      })
    }
  }

  // Fetch attendance records
  const fetchAttendance = async () => {
    setLoading(true)
    try {
      const profileId = await getSupervisorProfileId()
      if (!profileId) {
        setAttendance([])
        return
      }

      // Get all interns for this supervisor
      const { data: internshipsData, error: internshipsError } = await supabase
        .from("internships")
        .select("intern_id")
        .eq("supervisor_id", profileId)

      if (internshipsError) throw internshipsError

      const internIds = internshipsData?.map(i => i.intern_id) || []

      if (internIds.length === 0) {
        setAttendance([])
        return
      }

      const { data, error } = await supabase
        .from("attendance")
        .select(`
          *,
          intern:profiles!attendance_intern_id_fkey(
            id,
            first_name,
            last_name
          )
        `)
        .in("intern_id", internIds)
        .order("date", { ascending: false })
        .order("created_at", { ascending: false })

      if (error) throw error
      setAttendance(data || [])
    } catch (error: any) {
      console.error("Error fetching attendance:", error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible de charger les présences",
        variant: "destructive"
      })
      setAttendance([])
    } finally {
      setLoading(false)
    }
  }

  // Create attendance record
  const createAttendance = async (attendanceData: {
    intern_id: string
    date: Date
    status: string
    notes?: string
  }) => {
    try {
      // Check if attendance already exists for this intern and date
      const { data: existing } = await supabase
        .from("attendance")
        .select("id")
        .eq("intern_id", attendanceData.intern_id)
        .eq("date", attendanceData.date.toISOString().split('T')[0])
        .maybeSingle()

      if (existing) {
        toast({
          title: "Erreur",
          description: "Une présence existe déjà pour ce stagiaire à cette date",
          variant: "destructive"
        })
        return false
      }

      const { error } = await supabase
        .from("attendance")
        .insert({
          intern_id: attendanceData.intern_id,
          date: attendanceData.date.toISOString().split('T')[0],
          status: attendanceData.status,
          notes: attendanceData.notes || null
        })

      if (error) throw error

      toast({
        title: "Succès",
        description: "Présence enregistrée avec succès"
      })

      await fetchAttendance()
      return true
    } catch (error: any) {
      console.error("Error creating attendance:", error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'enregistrer la présence",
        variant: "destructive"
      })
      return false
    }
  }

  // Update attendance record
  const updateAttendance = async (id: string, updates: {
    status?: string
    notes?: string | null
  }) => {
    try {
      const updateData: any = {}
      
      if (updates.status !== undefined) updateData.status = updates.status
      if (updates.notes !== undefined) updateData.notes = updates.notes

      const { error } = await supabase
        .from("attendance")
        .update(updateData)
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Présence modifiée avec succès"
      })

      await fetchAttendance()
      return true
    } catch (error: any) {
      console.error("Error updating attendance:", error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier la présence",
        variant: "destructive"
      })
      return false
    }
  }

  // Delete attendance record
  const deleteAttendance = async (id: string) => {
    try {
      const { error } = await supabase
        .from("attendance")
        .delete()
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Présence supprimée avec succès"
      })

      await fetchAttendance()
      return true
    } catch (error: any) {
      console.error("Error deleting attendance:", error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer la présence",
        variant: "destructive"
      })
      return false
    }
  }

  useEffect(() => {
    if (user) {
      fetchInterns()
      fetchAttendance()
    }
  }, [user])

  return {
    attendance,
    interns,
    loading,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    refreshAttendance: fetchAttendance
  }
}
