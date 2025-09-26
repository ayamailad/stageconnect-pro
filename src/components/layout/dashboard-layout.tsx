import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { useAuth } from "@/hooks/use-auth"
import { Navigate } from "react-router-dom"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 bg-background">
          <div className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}