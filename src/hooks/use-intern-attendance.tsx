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
}

export interface InternshipPeriod {
  id: string
  start_date: string
  end_date: string
  supervisor?: {
    id: string
    first_name: string
    last_name: string
  }
  theme?: {
    id: string
    description: string
  }
}

export const useInternAttendance = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [internship, setInternship] = useState<InternshipPeriod | null>(null)
  const [loading, setLoading] = useState(true)

  // Get intern profile ID
  const getInternProfileId = async () => {
    if (!user) return null
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle()

      if (error) throw error
      return data?.id
    } catch (error) {
      console.error("Error fetching intern profile:", error)
      return null
    }
  }

  // Fetch intern's internship period
  const fetchInternship = async () => {
    if (!user) return
    
    try {
      const profileId = await getInternProfileId()
      if (!profileId) return

      const { data, error } = await supabase
        .from("internships")
        .select(`
          id,
          start_date,
          end_date,
          supervisor:profiles!internships_supervisor_id_fkey(
            id,
            first_name,
            last_name
          ),
          theme:themes(
            id,
            description
          )
        `)
        .eq("intern_id", profileId)
        .maybeSingle()

      if (error) throw error

      if (data) {
        setInternship({
          id: data.id,
          start_date: data.start_date,
          end_date: data.end_date,
          supervisor: Array.isArray(data.supervisor) ? data.supervisor[0] : data.supervisor,
          theme: Array.isArray(data.theme) ? data.theme[0] : data.theme
        })
      } else {
        setInternship(null)
      }
    } catch (error: any) {
      console.error("Error fetching internship:", error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible de charger les informations du stage",
        variant: "destructive"
      })
    }
  }

  // Fetch attendance records for intern
  const fetchAttendance = async () => {
    if (!user) {
      setAttendance([])
      setLoading(false)
      return
    }
    
    setLoading(true)
    try {
      const profileId = await getInternProfileId()
      if (!profileId) {
        setAttendance([])
        return
      }

      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("intern_id", profileId)
        .order("date", { ascending: false })

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

  useEffect(() => {
    if (user) {
      fetchInternship()
      fetchAttendance()
    }
  }, [user])

  return {
    attendance,
    internship,
    loading,
    refreshAttendance: fetchAttendance
  }
}
