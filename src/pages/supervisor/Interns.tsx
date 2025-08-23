import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Clock,
  BookOpen,
  Star,
  Phone,
  Mail,
  MapPin,
  GraduationCap
} from "lucide-react"

interface Intern {
  id: string
  name: string
  email: string
  phone: string
  theme: string
  startDate: string
  duration: number // in months
  progress: number // percentage
  status: 'active' | 'completed' | 'paused'
  tasksCompleted: number
  totalTasks: number
  avatar?: string
  university: string
  cin: string
}

const mockInterns: Intern[] = [
  {
    id: "1",
    name: "Sarah Martin",
    email: "sarah.martin@email.com",
    phone: "+212 6 12 34 56 78",
    theme: "Développement Web Full-Stack",
    startDate: "2024-01-15",
    duration: 3,
    progress: 75,
    status: "active",
    tasksCompleted: 12,
    totalTasks: 16,
    university: "Université Hassan II",
    cin: "BE123456"
  },
  {
    id: "2",
    name: "Ahmed Benali",
    email: "ahmed.benali@email.com", 
    phone: "+212 6 87 65 43 21",
    theme: "Intelligence Artificielle",
    startDate: "2024-02-01",
    duration: 2,
    progress: 45,
    status: "active",
    tasksCompleted: 8,
    totalTasks: 18,
    university: "ENSIAS",
    cin: "BH987654"
  },
  {
    id: "3",
    name: "Fatima Zahra",
    email: "fatima.zahra@email.com",
    phone: "+212 6 55 44 33 22",
    theme: "Data Science",
    startDate: "2023-11-15",
    duration: 3,
    progress: 100,
    status: "completed",
    tasksCompleted: 20,
    totalTasks: 20,
    university: "Université Mohammed V",
    cin: "BK456789"
  }
]

const getStatusBadge = (status: Intern['status']) => {
  const variants = {
    active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", 
    paused: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
  }
  
  const labels = {
    active: "En cours",
    completed: "Terminé",
    paused: "En pause"
  }
  
  return (
    <Badge className={variants[status]}>
      {labels[status]}
    </Badge>
  )
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

export default function SupervisorInterns() {
  const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null)

  const stats = {
    total: mockInterns.length,
    active: mockInterns.filter(i => i.status === 'active').length,
    completed: mockInterns.filter(i => i.status === 'completed').length,
    averageProgress: Math.round(mockInterns.reduce((acc, i) => acc + i.progress, 0) / mockInterns.length)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-brand-secondary bg-clip-text text-transparent">
            Mes Stagiaires
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos stagiaires et suivez leur progression
          </p>
        </div>
        <Button className="bg-gradient-brand hover:bg-gradient-brand/90">
          <UserCheck className="mr-2 h-4 w-4" />
          Ajouter un Stagiaire
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="gradient-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stagiaires</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-primary">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card className="gradient-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Cours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{stats.active}</div>
          </CardContent>
        </Card>
        
        <Card className="gradient-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminés</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
          </CardContent>
        </Card>
        
        <Card className="gradient-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression Moyenne</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-primary">{stats.averageProgress}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Interns Table */}
      <Card className="gradient-border">
        <CardHeader>
          <CardTitle>Liste des Stagiaires</CardTitle>
          <CardDescription>
            Cliquez sur un stagiaire pour voir ses détails
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stagiaire</TableHead>
                <TableHead>Thème</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead>Tâches</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInterns.map((intern) => (
                <TableRow 
                  key={intern.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedIntern(intern)}
                >
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={intern.avatar} />
                        <AvatarFallback className="bg-gradient-brand text-white">
                          {getInitials(intern.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{intern.name}</div>
                        <div className="text-sm text-muted-foreground">{intern.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate">{intern.theme}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Progress value={intern.progress} className="w-[60px]" />
                      <div className="text-sm text-muted-foreground">{intern.progress}%</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {intern.tasksCompleted}/{intern.totalTasks}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(intern.status)}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Voir Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Intern Details Dialog */}
      <Dialog open={!!selectedIntern} onOpenChange={() => setSelectedIntern(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={selectedIntern?.avatar} />
                <AvatarFallback className="bg-gradient-brand text-white">
                  {selectedIntern && getInitials(selectedIntern.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-xl font-bold">{selectedIntern?.name}</div>
                <div className="text-sm text-muted-foreground">{selectedIntern?.email}</div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedIntern && (
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedIntern.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedIntern.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedIntern.university}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedIntern.theme}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Début: {new Date(selectedIntern.startDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Durée: {selectedIntern.duration} mois</span>
                  </div>
                </div>
              </div>

              {/* Progress Section */}
              <div className="space-y-3">
                <h3 className="font-semibold">Progression du Stage</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Progression globale</span>
                    <span className="text-sm font-medium">{selectedIntern.progress}%</span>
                  </div>
                  <Progress value={selectedIntern.progress} className="h-2" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold text-emerald-600">{selectedIntern.tasksCompleted}</div>
                      <div className="text-sm text-muted-foreground">Tâches terminées</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold text-amber-600">{selectedIntern.totalTasks - selectedIntern.tasksCompleted}</div>
                      <div className="text-sm text-muted-foreground">Tâches restantes</div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-4">
                <Button className="bg-gradient-brand hover:bg-gradient-brand/90">
                  Assigner une Tâche
                </Button>
                <Button variant="outline">
                  Voir les Tâches
                </Button>
                <Button variant="outline">
                  Historique des Présences
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}