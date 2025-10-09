import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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
  Target,
  Menu
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useIsMobile } from "@/hooks/use-mobile"

export function Sidebar() {
  const { user } = useAuth()
  const location = useLocation()
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)

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
          { icon: Calendar, label: "Pointage", href: "/intern/attendance" }
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

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-card border-r border-border">
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
              onClick={() => isMobile && setOpen(false)}
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

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden fixed top-4 left-4 z-50 bg-background/90 backdrop-blur-sm border shadow-lg hover:bg-accent"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="p-0 w-72 max-w-[85vw]">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </>
    )
  }

  return (
    <div className="hidden md:flex w-64 min-w-64 flex-shrink-0">
      <SidebarContent />
    </div>
  )
}