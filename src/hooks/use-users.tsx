import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

export interface User {
  id: string
  user_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  role: 'admin' | 'supervisor' | 'intern' | 'candidate'
  department?: string
  created_at: string
  updated_at: string
}

export interface CreateUserData {
  first_name: string
  last_name: string
  email: string
  phone?: string
  role: 'admin' | 'supervisor' | 'intern' | 'candidate'
  department?: string
  password: string
}

export interface UpdateUserData {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  role?: 'admin' | 'supervisor' | 'intern' | 'candidate'
  department?: string
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Map the data to ensure proper typing
      const typedUsers = (data || []).map(user => ({
        ...user,
        role: user.role as 'admin' | 'supervisor' | 'intern' | 'candidate'
      }))
      setUsers(typedUsers)
    } catch (error: any) {
      console.error('Error fetching users:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Create new user
  const createUser = async (userData: CreateUserData): Promise<boolean> => {
    try {
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: userData.role,
          phone: userData.phone,
          department: userData.department
        }
      })

      if (authError) throw authError
      if (!authData.user) throw new Error("Failed to create user")

      // The profile will be created automatically by the trigger
      toast({
        title: "Succès",
        description: "Utilisateur créé avec succès",
      })

      // Refresh users list
      await fetchUsers()
      return true
    } catch (error: any) {
      console.error('Error creating user:', error)
      
      let errorMessage = "Impossible de créer l'utilisateur"
      if (error.message?.includes('email_exists') || error.message?.includes('already been registered')) {
        errorMessage = "Un utilisateur avec cet email existe déjà"
      } else if (error.message?.includes('password')) {
        errorMessage = "Le mot de passe ne respecte pas les critères requis"
      } else if (error.message?.includes('email')) {
        errorMessage = "L'adresse email n'est pas valide"
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    }
  }

  // Update user
  const updateUser = async (userId: string, userData: UpdateUserData): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', userId)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Utilisateur modifié avec succès",
      })

      // Refresh users list
      await fetchUsers()
      return true
    } catch (error: any) {
      console.error('Error updating user:', error)
      
      let errorMessage = "Impossible de modifier l'utilisateur"
      if (error.message?.includes('email')) {
        errorMessage = "L'adresse email n'est pas valide ou existe déjà"
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    }
  }

  // Delete user
  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      const profile = users.find(u => u.id === userId)
      if (!profile) throw new Error("Utilisateur non trouvé")

      // Delete the auth user (this will cascade delete the profile via trigger)
      const { error: authError } = await supabase.auth.admin.deleteUser(profile.user_id)

      if (authError) throw authError

      toast({
        title: "Succès",
        description: "Utilisateur supprimé avec succès",
      })

      // Refresh users list
      await fetchUsers()
      return true
    } catch (error: any) {
      console.error('Error deleting user:', error)
      
      let errorMessage = "Impossible de supprimer l'utilisateur"
      if (error.message?.includes('foreign key') || error.message?.includes('constraint')) {
        errorMessage = "Impossible de supprimer cet utilisateur car il est lié à d'autres données"
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    }
  }

  // Load users on mount
  useEffect(() => {
    fetchUsers()
  }, [])

  return {
    users,
    loading,
    createUser,
    updateUser,
    deleteUser,
    refreshUsers: fetchUsers
  }
}