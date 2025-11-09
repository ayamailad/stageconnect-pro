import { useState, useEffect, createContext, useContext, ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import type { User as SupabaseUser, Session } from '@supabase/supabase-js'

interface User {
  id: string
  name: string
  email: string
  role: 'candidate' | 'intern' | 'supervisor' | 'admin'
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
  loading: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  cin: string
  phone: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        let errorMessage = "Email ou mot de passe incorrect"
        
        switch (error.message) {
          case "Invalid login credentials":
            errorMessage = "Email ou mot de passe incorrect"
            break
          case "Email not confirmed":
            errorMessage = "Veuillez confirmer votre email avant de vous connecter"
            break
          case "Too many requests":
            errorMessage = "Trop de tentatives de connexion. Veuillez réessayer plus tard"
            break
          case "signInWithPassword disabled":
            errorMessage = "La connexion par mot de passe est désactivée"
            break
          default:
            errorMessage = error.message
        }

        toast({
          title: "Erreur de connexion",
          description: errorMessage,
          variant: "destructive"
        })
        return false
      }

      if (data.user) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur InternFlow !",
        })
        return true
      }

      return false
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: "Erreur de connexion",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    setLoading(true)
    try {
      const redirectUrl = `${window.location.origin}/dashboard`
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: userData.name.split(' ')[0],
            last_name: userData.name.split(' ').slice(1).join(' ') || '',
            role: 'candidate',
            phone: userData.phone,
            cin: userData.cin
          }
        }
      })

      if (error) {
        let errorMessage = "Une erreur est survenue lors de l'inscription"
        
        switch (error.message) {
          case "User already registered":
            errorMessage = "Un compte existe déjà avec cet email"
            break
          case "Password should be at least 6 characters":
            errorMessage = "Le mot de passe doit contenir au moins 6 caractères"
            break
          case "Unable to validate email address: invalid format":
            errorMessage = "Format d'email invalide"
            break
          case "Password should contain at least one character of each: abcdefghijklmnopqrstuvwxyz, ABCDEFGHIJKLMNOPQRSTUVWXYZ, 0123456789":
            errorMessage = "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre"
            break
          case "Signup is disabled":
            errorMessage = "L'inscription est actuellement désactivée"
            break
          default:
            errorMessage = error.message
        }

        toast({
          title: "Erreur d'inscription",
          description: errorMessage,
          variant: "destructive"
        })
        return false
      }

      if (data.user) {
        toast({
          title: "Inscription réussie",
          description: data.user.email_confirmed_at ? 
            "Votre compte a été créé avec succès !" :
            "Vérifiez votre email pour confirmer votre compte",
        })
        return true
      }

      return false
    } catch (error) {
      console.error('Registration error:', error)
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Use local scope to force logout even if session doesn't exist
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      
      // Only show error if it's not a session_not_found error
      if (error && !error.message.includes('session_not_found')) {
        console.error('Logout error:', error)
        toast({
          title: "Erreur de déconnexion",
          description: "Une erreur s'est produite lors de la déconnexion",
          variant: "destructive"
        })
        return
      }

      // Clear local state
      setUser(null)
      setSession(null)

      toast({
        title: "Déconnexion",
        description: "Vous avez été déconnecté avec succès",
      })
    } catch (error) {
      console.error('Logout error:', error)
      // Still clear local state even on error
      setUser(null)
      setSession(null)
      
      toast({
        title: "Déconnexion",
        description: "Vous avez été déconnecté",
      })
    }
  }

  // Helper function to convert Supabase user to our User type
  const convertSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    try {
      // Try to fetch profile from database first for most accurate data
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single()

      if (!error && profile) {
        const allowedRoles = ['candidate', 'intern', 'supervisor', 'admin'] as const
        return {
          id: supabaseUser.id,
          name: `${profile.first_name} ${profile.last_name}`.trim() || profile.email.split('@')[0],
          email: profile.email,
          role: (allowedRoles as readonly string[]).includes(profile.role)
            ? (profile.role as (typeof allowedRoles)[number])
            : 'candidate',
          avatar: supabaseUser.user_metadata?.avatar_url
        }
      }

      // Fallback to user metadata if profile fetch fails
      const meta = (supabaseUser.user_metadata ?? {}) as Record<string, any>
      const allowedRoles = ['candidate', 'intern', 'supervisor', 'admin'] as const
      const metaRole = typeof meta.role === 'string' && (allowedRoles as readonly string[]).includes(meta.role)
        ? (meta.role as (typeof allowedRoles)[number])
        : 'candidate'

      const nameFromMeta = [meta.first_name, meta.last_name].filter(Boolean).join(' ')
      return {
        id: supabaseUser.id,
        name: nameFromMeta || supabaseUser.email?.split('@')[0] || 'Utilisateur',
        email: supabaseUser.email || '',
        role: metaRole,
        avatar: meta.avatar_url
      }
    } catch (error) {
      console.error('Error converting user:', error)
      return null
    }
  }

  // Set up auth state listener
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        
        if (session?.user) {
          // Defer profile fetching to avoid blocking auth state changes
          setTimeout(async () => {
            const convertedUser = await convertSupabaseUser(session.user)
            setUser(convertedUser)
          }, 0)
        } else {
          setUser(null)
        }
        
        setLoading(false)
      }
    )

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        setTimeout(async () => {
          const convertedUser = await convertSupabaseUser(session.user)
          setUser(convertedUser)
        }, 0)
      } else {
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const value = { user, login, register, logout, loading }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}