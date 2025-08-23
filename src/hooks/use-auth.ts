import { useState, useEffect, createContext, useContext } from "react"
import { useToast } from "@/hooks/use-toast"

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

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    // Temporary mock implementation for development
    const { toast } = useToast()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(false)

    const login = async (email: string, password: string) => {
      setLoading(true)
      try {
        // Mock login - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockUser: User = {
          id: "1",
          name: "John Doe",
          email: email,
          role: email.includes("admin") ? "admin" : 
                email.includes("supervisor") ? "supervisor" :
                email.includes("intern") ? "intern" : "candidate"
        }
        
        setUser(mockUser)
        localStorage.setItem("auth_user", JSON.stringify(mockUser))
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur InternFlow !",
        })
        return true
      } catch (error) {
        toast({
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect",
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
        // Mock registration - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const newUser: User = {
          id: Math.random().toString(),
          name: userData.name,
          email: userData.email,
          role: "candidate"
        }
        
        setUser(newUser)
        localStorage.setItem("auth_user", JSON.stringify(newUser))
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès !",
        })
        return true
      } catch (error) {
        toast({
          title: "Erreur d'inscription",
          description: "Une erreur est survenue lors de l'inscription",
          variant: "destructive"
        })
        return false
      } finally {
        setLoading(false)
      }
    }

    const logout = () => {
      setUser(null)
      localStorage.removeItem("auth_user")
      toast({
        title: "Déconnexion",
        description: "Vous avez été déconnecté avec succès",
      })
    }

    // Check for stored user on mount
    useEffect(() => {
      const stored = localStorage.getItem("auth_user")
      if (stored) {
        setUser(JSON.parse(stored))
      }
    }, [])

    return { user, login, register, logout, loading }
  }
  return context
}