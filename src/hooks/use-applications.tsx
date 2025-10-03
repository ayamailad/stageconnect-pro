import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

export interface Application {
  id: string
  candidate_name: string
  candidate_email: string
  candidate_phone?: string
  position: string
  department: string
  status: 'pending' | 'approved' | 'rejected' | 'interview'
  submitted_at: string
  reviewed_at?: string
  reviewed_by?: string
  experience?: string
  motivation?: string
  duration_months: number
  internship_id?: string
  cv_file_path?: string
  cover_letter_path?: string
  internship_agreement_path?: string
  created_at: string
  updated_at: string
}

export interface UpdateApplicationData {
  status?: 'pending' | 'approved' | 'rejected' | 'interview'
  reviewed_at?: string
  reviewed_by?: string
}

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Fetch all applications
  const fetchApplications = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('submitted_at', { ascending: false })

      if (error) throw error

      const typedApplications = (data || []).map(app => ({
        ...app,
        status: app.status as 'pending' | 'approved' | 'rejected' | 'interview'
      }))
      setApplications(typedApplications)
    } catch (error: any) {
      console.error('Error fetching applications:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les candidatures",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Update application status
  const updateApplicationStatus = async (
    applicationId: string, 
    status: 'approved' | 'rejected' | 'interview'
  ): Promise<boolean> => {
    try {
      // Get current user profile to set reviewed_by
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Utilisateur non authentifié")

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!profile) throw new Error("Profil utilisateur non trouvé")

      const updateData: UpdateApplicationData = {
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: profile.id
      }

      const { error } = await supabase
        .from('applications')
        .update(updateData)
        .eq('id', applicationId)

      if (error) throw error

      const statusLabels = {
        approved: 'approuvée',
        rejected: 'rejetée', 
        interview: 'programmée pour entretien'
      }

      toast({
        title: "Succès",
        description: `Candidature ${statusLabels[status]} avec succès`,
      })

      // Refresh applications list
      await fetchApplications()
      return true
    } catch (error: any) {
      console.error('Error updating application status:', error)
      
      let errorMessage = "Impossible de mettre à jour la candidature"
      if (error.message?.includes('not authenticated')) {
        errorMessage = "Vous devez être connecté pour effectuer cette action"
      } else if (error.message?.includes('not found')) {
        errorMessage = "Candidature non trouvée"
      } else if (error.message?.includes('permission')) {
        errorMessage = "Vous n'avez pas les permissions nécessaires"
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    }
  }

  // Approve application and change role to intern
  const approveApplication = async (applicationId: string): Promise<boolean> => {
    try {
      // Get current user profile to set reviewed_by
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Utilisateur non authentifié")

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!profile) throw new Error("Profil utilisateur non trouvé")

      // Get the application to find the candidate user_id
      const { data: application, error: appError } = await supabase
        .from('applications')
        .select('user_id')
        .eq('id', applicationId)
        .single()

      if (appError || !application?.user_id) throw new Error("Candidature non trouvée")

      // Update application status
      const { error: updateError } = await supabase
        .from('applications')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: profile.id
        })
        .eq('id', applicationId)

      if (updateError) throw updateError

      // Change candidate role to intern using user_id
      console.log('Updating role for user_id:', application.user_id)
      const { data: roleData, error: roleError } = await supabase
        .from('profiles')
        .update({ role: 'intern' })
        .eq('user_id', application.user_id)
        .select()
      
      console.log('Role update result:', roleData, roleError)

      if (roleError) {
        console.error('Error updating role:', roleError)
        throw new Error("Impossible de mettre à jour le rôle")
      }

      toast({
        title: "Succès",
        description: "Candidature approuvée et candidat promu stagiaire",
      })

      // Refresh applications list
      await fetchApplications()
      return true
    } catch (error: any) {
      console.error('Error approving application:', error)
      
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'approuver la candidature",
        variant: "destructive",
      })
      return false
    }
  }

  // Reject application - delete files, profile, auth, send email
  const rejectApplication = async (applicationId: string): Promise<boolean> => {
    try {
      // Call edge function to handle rejection
      const { data, error } = await supabase.functions.invoke('reject-application', {
        body: { applicationId }
      })

      if (error) throw error

      toast({
        title: "Succès",
        description: "Candidature rejetée et candidat notifié par email",
      })

      // Refresh applications list
      await fetchApplications()
      return true
    } catch (error: any) {
      console.error('Error rejecting application:', error)
      
      toast({
        title: "Erreur",
        description: error.message || "Impossible de rejeter la candidature",
        variant: "destructive",
      })
      return false
    }
  }

  // Delete application (for admin)
  const deleteApplication = async (applicationId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', applicationId)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Candidature supprimée avec succès",
      })

      // Refresh applications list
      await fetchApplications()
      return true
    } catch (error: any) {
      console.error('Error deleting application:', error)
      
      let errorMessage = "Impossible de supprimer la candidature"
      if (error.message?.includes('foreign key') || error.message?.includes('constraint')) {
        errorMessage = "Impossible de supprimer cette candidature car elle est liée à d'autres données"
      } else if (error.message?.includes('not found')) {
        errorMessage = "Candidature non trouvée"
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    }
  }

  // Get applications statistics
  const getApplicationStats = () => {
    return {
      total: applications.length,
      pending: applications.filter(a => a.status === 'pending').length,
      approved: applications.filter(a => a.status === 'approved').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
      interview: applications.filter(a => a.status === 'interview').length
    }
  }

  // Load applications on mount
  useEffect(() => {
    fetchApplications()
  }, [])

  return {
    applications,
    loading,
    approveApplication,
    rejectApplication,
    deleteApplication,
    refreshApplications: fetchApplications,
    getApplicationStats
  }
}