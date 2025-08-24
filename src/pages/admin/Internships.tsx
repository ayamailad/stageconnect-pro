import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { GraduationCap, Plus, Search, Edit, Calendar, User } from "lucide-react"

interface Internship {
  id: string
  title: string
  department: string
  supervisor: string
  intern: string | null
  startDate: string
  endDate: string
  status: 'available' | 'assigned' | 'in_progress' | 'completed'
  description: string
  requirements: string
}

const mockInternships: Internship[] = [
  {
    id: "1",
    title: "Stage Développement Frontend",
    department: "Informatique",
    supervisor: "Jean Dupont",
    intern: "Emma Dubois",
    startDate: "2024-04-01",
    endDate: "2024-07-31",
    status: "in_progress",
    description: "Développement d'interfaces utilisateur modernes avec React et TypeScript",
    requirements: "Connaissances en JavaScript, React, notions de TypeScript"
  },
  {
    id: "2",
    title: "Stage Marketing Digital",
    department: "Marketing",
    supervisor: "Sophie Martin",
    intern: null,
    startDate: "2024-05-01",
    endDate: "2024-08-31",
    status: "available",
    description: "Analyse de performance des campagnes digitales et création de contenu",
    requirements: "Formation en marketing, maîtrise des réseaux sociaux"
  },
  {
    id: "3",
    title: "Stage Analyse de Données",
    department: "Data Science",
    supervisor: "Pierre Durand",
    intern: "Thomas Martin",
    startDate: "2024-03-01",
    endDate: "2024-06-30",
    status: "completed",
    description: "Analyse de données clients et création de dashboards",
    requirements: "Python, SQL, notions de statistiques"
  },
  {
    id: "4",
    title: "Stage Assistant RH",
    department: "Ressources Humaines",
    supervisor: "Marie Leroy",
    intern: null,
    startDate: "2024-06-01",
    endDate: "2024-09-30",
    status: "assigned",
    description: "Support dans le recrutement et la gestion administrative",
    requirements: "Formation en RH ou psychologie du travail"
  }
]

export default function Internships() {
  const [internships] = useState<Internship[]>(mockInternships)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.supervisor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || internship.status === selectedStatus
    const matchesDepartment = selectedDepartment === "all" || internship.department === selectedDepartment
    return matchesSearch && matchesStatus && matchesDepartment
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'available': return 'outline'
      case 'assigned': return 'secondary'
      case 'in_progress': return 'default'
      case 'completed': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible'
      case 'assigned': return 'Assigné'
      case 'in_progress': return 'En cours'
      case 'completed': return 'Terminé'
      default: return status
    }
  }

  const departments = [...new Set(internships.map(internship => internship.department))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stages</h1>
          <p className="text-muted-foreground">Gérez les offres de stage et les affectations</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Créer un stage
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle offre de stage</DialogTitle>
              <DialogDescription>
                Définissez les détails du stage
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Titre du stage</Label>
                  <Input id="title" placeholder="Ex: Stage Développement Web" />
                </div>
                <div>
                  <Label htmlFor="department">Département</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un département" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="informatique">Informatique</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="rh">Ressources Humaines</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="supervisor">Superviseur</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un superviseur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jean">Jean Dupont</SelectItem>
                      <SelectItem value="sophie">Sophie Martin</SelectItem>
                      <SelectItem value="pierre">Pierre Durand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Durée</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Durée du stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 mois</SelectItem>
                      <SelectItem value="2">2 mois</SelectItem>
                      <SelectItem value="3">3 mois</SelectItem>
                      <SelectItem value="6">6 mois</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Décrivez les missions et objectifs du stage"
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <Label htmlFor="requirements">Prérequis</Label>
                <Textarea 
                  id="requirements" 
                  placeholder="Compétences et formations requises"
                  className="min-h-[80px]"
                />
              </div>
              <Button className="w-full">Créer le stage</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stages</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{internships.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{internships.filter(i => i.status === 'available').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{internships.filter(i => i.status === 'in_progress').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminés</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{internships.filter(i => i.status === 'completed').length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des stages</CardTitle>
          <CardDescription>Gérez les offres de stage et les affectations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par titre, département ou superviseur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="available">Disponible</SelectItem>
                <SelectItem value="assigned">Assigné</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Département" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les départements</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Superviseur</TableHead>
                <TableHead>Stagiaire</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInternships.map((internship) => (
                <TableRow key={internship.id}>
                  <TableCell className="font-medium">{internship.title}</TableCell>
                  <TableCell>{internship.department}</TableCell>
                  <TableCell>{internship.supervisor}</TableCell>
                  <TableCell>
                    {internship.intern ? (
                      <span className="font-medium">{internship.intern}</span>
                    ) : (
                      <span className="text-muted-foreground italic">Non assigné</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(internship.startDate).toLocaleDateString('fr-FR')}</div>
                      <div className="text-muted-foreground">
                        au {new Date(internship.endDate).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(internship.status)}>
                      {getStatusLabel(internship.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {internship.status === 'available' && (
                        <Button variant="outline" size="sm">
                          <User className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}