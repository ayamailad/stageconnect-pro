import { Navigate } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />
  }

  return <>{children}</>
}
