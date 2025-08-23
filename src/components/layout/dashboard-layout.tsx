import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { useAuth } from "@/hooks/use-auth"
import { Navigate } from "react-router-dom"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}