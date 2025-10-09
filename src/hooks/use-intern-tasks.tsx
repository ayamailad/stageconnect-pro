import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"

export interface InternTask {
  id: string
  title: string
  description: string | null
  priority: string
  status: string
  due_date: string | null
  supervisor_id: string
  theme_id: string | null
  created_at: string
  updated_at: string
  estimated_hours: number | null
  completed_hours: number | null
  supervisor?: {
    id: string
    first_name: string
    last_name: string
  }
}

export const useInternTasks = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [tasks, setTasks] = useState<InternTask[]>([])
  const [loading, setLoading] = useState(true)

  // Get intern profile ID
  const getInternProfileId = async () => {
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
      console.error("Error fetching intern profile:", error)
      return null
    }
  }

  // Fetch tasks assigned to the intern
  const fetchTasks = async () => {
    setLoading(true)
    try {
      const profileId = await getInternProfileId()
      if (!profileId) {
        toast({
          title: "Erreur",
          description: "Impossible de charger votre profil",
          variant: "destructive"
        })
        setTasks([])
        return
      }

      const { data, error } = await supabase
        .from("tasks")
        .select(`
          *,
          supervisor:profiles!tasks_supervisor_id_fkey(
            id,
            first_name,
            last_name
          )
        `)
        .eq("intern_id", profileId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (error: any) {
      console.error("Error fetching tasks:", error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible de charger les tâches",
        variant: "destructive"
      })
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  // Update task status
  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus })
        .eq("id", taskId)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Statut de la tâche mis à jour"
      })

      await fetchTasks()
      return true
    } catch (error: any) {
      console.error("Error updating task status:", error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour la tâche",
        variant: "destructive"
      })
      return false
    }
  }

  useEffect(() => {
    if (user) {
      fetchTasks()
    }
  }, [user])

  return {
    tasks,
    loading,
    updateTaskStatus,
    refreshTasks: fetchTasks
  }
}
