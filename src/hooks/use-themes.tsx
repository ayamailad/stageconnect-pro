import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types"

type Theme = Tables<"themes">
type ThemeInsert = TablesInsert<"themes">
type ThemeUpdate = TablesUpdate<"themes">

interface ThemeWithStats extends Theme {
  assignedInterns: number
  totalTasks: number
  completedTasks: number
}

export const useThemes = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [themes, setThemes] = useState<ThemeWithStats[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch supervisor profile ID
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

  // Fetch themes with statistics
  const fetchThemes = async () => {
    setLoading(true)
    try {
      const profileId = await getSupervisorProfileId()
      if (!profileId) {
        toast({
          title: "Erreur",
          description: "Impossible de charger votre profil",
          variant: "destructive"
        })
        setThemes([])
        return
      }

      // Fetch themes
      const { data: themesData, error: themesError } = await supabase
        .from("themes")
        .select("*")
        .eq("supervisor_id", profileId)
        .order("created_at", { ascending: false })

      if (themesError) throw themesError

      // Fetch internships and tasks for each theme to calculate stats
      const themesWithStats = await Promise.all(
        (themesData || []).map(async (theme) => {
          // Count assigned interns (internships linked to this theme)
          const { count: internsCount, error: internsError } = await supabase
            .from("internships")
            .select("*", { count: "exact", head: true })
            .eq("theme_id", theme.id)

          if (internsError) console.error("Error counting interns:", internsError)

          // Get all interns for this theme to count their tasks
          const { data: internships, error: internshipsError } = await supabase
            .from("internships")
            .select("intern_id")
            .eq("theme_id", theme.id)

          if (internshipsError) console.error("Error fetching internships:", internshipsError)

          const internIds = (internships || []).map(i => i.intern_id).filter(Boolean)

          // Count total tasks for interns of this theme
          let totalTasks = 0
          let completedTasks = 0

          if (internIds.length > 0) {
            const { count: totalCount, error: totalError } = await supabase
              .from("tasks")
              .select("*", { count: "exact", head: true })
              .in("intern_id", internIds)

            if (!totalError) totalTasks = totalCount || 0

            const { count: completedCount, error: completedError } = await supabase
              .from("tasks")
              .select("*", { count: "exact", head: true })
              .in("intern_id", internIds)
              .eq("status", "completed")

            if (!completedError) completedTasks = completedCount || 0
          }

          return {
            ...theme,
            assignedInterns: internsCount || 0,
            totalTasks,
            completedTasks
          }
        })
      )

      setThemes(themesWithStats)
    } catch (error: any) {
      console.error("Error fetching themes:", error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible de charger les thèmes",
        variant: "destructive"
      })
      setThemes([])
    } finally {
      setLoading(false)
    }
  }

  // Create theme
  const createTheme = async (themeData: Omit<ThemeInsert, "supervisor_id">) => {
    try {
      const profileId = await getSupervisorProfileId()
      if (!profileId) {
        toast({
          title: "Erreur",
          description: "Impossible de créer le thème",
          variant: "destructive"
        })
        return false
      }

      const { error } = await supabase
        .from("themes")
        .insert({
          ...themeData,
          supervisor_id: profileId
        })

      if (error) throw error

      toast({
        title: "Succès",
        description: "Thème créé avec succès"
      })

      await fetchThemes()
      return true
    } catch (error: any) {
      console.error("Error creating theme:", error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le thème",
        variant: "destructive"
      })
      return false
    }
  }

  // Update theme
  const updateTheme = async (id: string, updates: ThemeUpdate) => {
    try {
      const { error } = await supabase
        .from("themes")
        .update(updates)
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Thème modifié avec succès"
      })

      await fetchThemes()
      return true
    } catch (error: any) {
      console.error("Error updating theme:", error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier le thème",
        variant: "destructive"
      })
      return false
    }
  }

  // Delete theme
  const deleteTheme = async (id: string) => {
    try {
      // Check if theme has assigned internships
      const { count, error: countError } = await supabase
        .from("internships")
        .select("*", { count: "exact", head: true })
        .eq("theme_id", id)

      if (countError) throw countError

      if (count && count > 0) {
        toast({
          title: "Impossible de supprimer",
          description: "Ce thème a des stages assignés. Veuillez d'abord les réassigner.",
          variant: "destructive"
        })
        return false
      }

      const { error } = await supabase
        .from("themes")
        .delete()
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Thème supprimé avec succès"
      })

      await fetchThemes()
      return true
    } catch (error: any) {
      console.error("Error deleting theme:", error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le thème",
        variant: "destructive"
      })
      return false
    }
  }

  useEffect(() => {
    if (user) {
      fetchThemes()
    }
  }, [user])

  return {
    themes,
    loading,
    createTheme,
    updateTheme,
    deleteTheme,
    refreshThemes: fetchThemes
  }
}
