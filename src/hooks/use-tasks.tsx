import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"

export interface Task {
  id: string
  title: string
  description: string | null
  priority: string
  status: string
  due_date: string | null
  intern_id: string
  supervisor_id: string
  theme_id: string | null
  created_at: string
  updated_at: string
  intern?: {
    id: string
    first_name: string
    last_name: string
  }
}

export const useTasks = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  // Get supervisor profile ID
  const getSupervisorProfileId = async () => {
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
      console.error("Error fetching supervisor profile:", error)
      return null
    }
  }

  // Fetch tasks
  const fetchTasks = async () => {
    if (!user) {
      setTasks([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const profileId = await getSupervisorProfileId()
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
          intern:profiles!tasks_intern_id_fkey(
            id,
            first_name,
            last_name
          )
        `)
        .eq("supervisor_id", profileId)
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

  // Create task
  const createTask = async (taskData: {
    title: string
    description?: string
    intern_id: string
    theme_id?: string
    priority: string
    status?: string
    due_date?: Date
  }) => {
    try {
      const profileId = await getSupervisorProfileId()
      if (!profileId) {
        toast({
          title: "Erreur",
          description: "Impossible de créer la tâche",
          variant: "destructive"
        })
        return false
      }

      const { error } = await supabase
        .from("tasks")
        .insert({
          title: taskData.title,
          description: taskData.description || null,
          intern_id: taskData.intern_id,
          supervisor_id: profileId,
          theme_id: taskData.theme_id || null,
          priority: taskData.priority,
          status: taskData.status || "todo",
          due_date: taskData.due_date ? taskData.due_date.toISOString().split('T')[0] : null
        })

      if (error) throw error

      toast({
        title: "Succès",
        description: "Tâche créée avec succès"
      })

      await fetchTasks()
      return true
    } catch (error: any) {
      console.error("Error creating task:", error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer la tâche",
        variant: "destructive"
      })
      return false
    }
  }

  // Update task
  const updateTask = async (id: string, updates: {
    title?: string
    description?: string
    intern_id?: string
    theme_id?: string
    priority?: string
    status?: string
    due_date?: Date | null
  }) => {
    try {
      const updateData: any = {}
      
      if (updates.title !== undefined) updateData.title = updates.title
      if (updates.description !== undefined) updateData.description = updates.description
      if (updates.intern_id !== undefined) updateData.intern_id = updates.intern_id
      if (updates.theme_id !== undefined) updateData.theme_id = updates.theme_id
      if (updates.priority !== undefined) updateData.priority = updates.priority
      if (updates.status !== undefined) updateData.status = updates.status
      if (updates.due_date !== undefined) {
        updateData.due_date = updates.due_date ? updates.due_date.toISOString().split('T')[0] : null
      }

      const { error } = await supabase
        .from("tasks")
        .update(updateData)
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Tâche modifiée avec succès"
      })

      await fetchTasks()
      return true
    } catch (error: any) {
      console.error("Error updating task:", error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier la tâche",
        variant: "destructive"
      })
      return false
    }
  }

  // Delete task
  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Tâche supprimée avec succès"
      })

      await fetchTasks()
      return true
    } catch (error: any) {
      console.error("Error deleting task:", error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer la tâche",
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
    createTask,
    updateTask,
    deleteTask,
    refreshTasks: fetchTasks
  }
}
