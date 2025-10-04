import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

export interface Internship {
  id: string
  title: string
  department: string
  supervisor_id: string | null
  intern_id: string | null
  start_date: string
  end_date: string
  duration_months: number
  status: 'available' | 'assigned' | 'in_progress' | 'completed'
  description: string
  requirements: string | null
  created_at: string
  updated_at: string
  supervisor?: {
    id: string
    first_name: string
    last_name: string
  }
  intern?: {
    id: string
    first_name: string
    last_name: string
  }
}

export interface CreateInternshipData {
  title: string
  department: string
  supervisor_id: string
  start_date: string
  end_date: string
  duration_months: number
  description: string
  requirements?: string
}

export interface UpdateInternshipData {
  title?: string
  department?: string
  supervisor_id?: string
  intern_id?: string | null
  start_date?: string
  end_date?: string
  duration_months?: number
  status?: 'available' | 'assigned' | 'in_progress' | 'completed'
  description?: string
  requirements?: string
}

export function useInternships() {
  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Fetch all internships
  const fetchInternships = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('internships')
        .select(`
          *,
          supervisor:profiles!internships_supervisor_id_fkey(id, first_name, last_name),
          intern:profiles!internships_intern_id_fkey(id, first_name, last_name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      const typedInternships = (data || []).map(internship => ({
        ...internship,
        status: internship.status as 'available' | 'assigned' | 'in_progress' | 'completed',
        supervisor: Array.isArray(internship.supervisor) ? internship.supervisor[0] : internship.supervisor,
        intern: Array.isArray(internship.intern) ? internship.intern[0] : internship.intern
      }))
      
      setInternships(typedInternships)
    } catch (error: any) {
      console.error('Error fetching internships:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les stages",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Create new internship
  const createInternship = async (internshipData: CreateInternshipData): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('internships')
        .insert({
          ...internshipData,
          status: 'available'
        })

      if (error) throw error

      toast({
        title: "Succès",
        description: "Stage créé avec succès",
      })

      await fetchInternships()
      return true
    } catch (error: any) {
      console.error('Error creating internship:', error)
      
      let errorMessage = "Impossible de créer le stage"
      if (error.message?.includes('foreign key')) {
        errorMessage = "Le superviseur sélectionné n'existe pas"
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    }
  }

  // Update internship
  const updateInternship = async (internshipId: string, internshipData: UpdateInternshipData): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('internships')
        .update(internshipData)
        .eq('id', internshipId)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Stage modifié avec succès",
      })

      await fetchInternships()
      return true
    } catch (error: any) {
      console.error('Error updating internship:', error)
      
      let errorMessage = "Impossible de modifier le stage"
      if (error.message?.includes('foreign key')) {
        errorMessage = "Le superviseur ou stagiaire sélectionné n'existe pas"
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    }
  }

  // Assign intern to internship
  const assignIntern = async (internshipId: string, internId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('internships')
        .update({ 
          intern_id: internId,
          status: 'assigned'
        })
        .eq('id', internshipId)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Stagiaire affecté avec succès",
      })

      await fetchInternships()
      return true
    } catch (error: any) {
      console.error('Error assigning intern:', error)
      
      toast({
        title: "Erreur",
        description: "Impossible d'affecter le stagiaire",
        variant: "destructive",
      })
      return false
    }
  }

  // Delete internship
  const deleteInternship = async (internshipId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('internships')
        .delete()
        .eq('id', internshipId)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Stage supprimé avec succès",
      })

      await fetchInternships()
      return true
    } catch (error: any) {
      console.error('Error deleting internship:', error)
      
      let errorMessage = "Impossible de supprimer le stage"
      if (error.message?.includes('foreign key') || error.message?.includes('constraint')) {
        errorMessage = "Impossible de supprimer ce stage car il est lié à d'autres données (candidatures, tâches, etc.)"
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    }
  }

  useEffect(() => {
    fetchInternships()
  }, [])

  return {
    internships,
    loading,
    createInternship,
    updateInternship,
    assignIntern,
    deleteInternship,
    refreshInternships: fetchInternships
  }
}
