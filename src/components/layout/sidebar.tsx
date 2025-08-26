import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  Settings, 
  BookOpen,
  ClipboardList,
  UserCheck,
  Building,
  GraduationCap,
  Target
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function Sidebar() {
  const { user } = useAuth()
  const location = useLocation()

  const getRoleBasedNavigation = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { icon: LayoutDashboard, label: "Tableau de bord", href: "/admin/dashboard" },
          { icon: Users, label: "Utilisateurs", href: "/admin/users" },
          { icon: FileText, label: "Candidatures", href: "/admin/applications" },
          { icon: GraduationCap, label: "Stages", href: "/admin/internships" },
          { icon: Settings, label: "Paramètres", href: "/admin/settings" }
        ]
      
      case 'supervisor':
        return [
          { icon: LayoutDashboard, label: "Tableau de bord", href: "/supervisor/dashboard" },
          { icon: Users, label: "Mes Stagiaires", href: "/supervisor/interns" },
          { icon: BookOpen, label: "Thèmes", href: "/supervisor/themes" },
          { icon: ClipboardList, label: "Tâches", href: "/supervisor/tasks" },
          { icon: Calendar, label: "Présences", href: "/supervisor/attendance" }
        ]
      
      case 'intern':
        return [
          { icon: LayoutDashboard, label: "Tableau de bord", href: "/intern/dashboard" },
          { icon: Target, label: "Mes Tâches", href: "/intern/tasks" },
          { icon: FileText, label: "Mon Stage", href: "/intern/internship" },
          { icon: Calendar, label: "Pointage", href: "/intern/attendance" },
          { icon: UserCheck, label: "Mon Profil", href: "/intern/profile" }
        ]
      
      default: // candidate
        return [
          { icon: LayoutDashboard, label: "Tableau de bord", href: "/dashboard" },
          { icon: FileText, label: "Ma Candidature", href: "/application" },
          { icon: UserCheck, label: "Mon Profil", href: "/profile" }
        ]
    }
  }

  const navigation = getRoleBasedNavigation()

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border">
      <nav className="flex-1 space-y-2 p-4 pt-6">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href
          
          return (
            <Button
              key={item.href}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-10",
                isActive 
                  ? "bg-primary/10 text-primary hover:bg-primary/15 border border-primary/20" 
                  : "hover:bg-accent"
              )}
              asChild
            >
              <Link to={item.href}>
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          Connecté en tant que{" "}
          <span className="font-medium text-primary capitalize">
            {user?.role === 'admin' ? 'Administrateur' :
             user?.role === 'supervisor' ? 'Superviseur' :
             user?.role === 'intern' ? 'Stagiaire' : 'Candidat'}
          </span>
        </div>
      </div>
    </div>
  )
}