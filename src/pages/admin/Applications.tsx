import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Search, Eye, Check, X, Clock } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Application {
  id: string
  candidateName: string
  candidateEmail: string
  position: string
  department: string
  status: 'pending' | 'approved' | 'rejected' | 'interview'
  submittedAt: string
  experience: string
  motivation: string
}

const mockApplications: Application[] = [
  {
    id: "1",
    candidateName: "Alice Johnson",
    candidateEmail: "alice.johnson@email.com",
    position: "Développeur Frontend",
    department: "Informatique",
    status: "pending",
    submittedAt: "2024-03-20",
    experience: "2 ans d'expérience en React et TypeScript",
    motivation: "Passionnée par le développement web moderne et désireuse d'apprendre dans une équipe dynamique."
  },
  {
    id: "2",
    candidateName: "Thomas Martin",
    candidateEmail: "thomas.martin@email.com", 
    position: "Analyste Marketing",
    department: "Marketing",
    status: "interview",
    submittedAt: "2024-03-18",
    experience: "Stage précédent en marketing digital",
    motivation: "Intéressé par l'analyse de données et les stratégies marketing innovantes."
  },
  {
    id: "3",
    candidateName: "Emma Dubois",
    candidateEmail: "emma.dubois@email.com",
    position: "Développeur Backend", 
    department: "Informatique",
    status: "approved",
    submittedAt: "2024-03-15",
    experience: "Formation en informatique, projets personnels en Node.js",
    motivation: "Souhait de développer mes compétences en développement backend et architecture."
  },
  {
    id: "4",
    candidateName: "Lucas Bernard",
    candidateEmail: "lucas.bernard@email.com",
    position: "Assistant RH",
    department: "Ressources Humaines", 
    status: "rejected",
    submittedAt: "2024-03-12",
    experience: "Études en psychologie du travail",
    motivation: "Envie de découvrir les métiers des ressources humaines."
  }
]

export default function Applications() {
  const [applications] = useState<Application[]>(mockApplications)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || app.status === selectedStatus
    const matchesDepartment = selectedDepartment === "all" || app.department === selectedDepartment
    return matchesSearch && matchesStatus && matchesDepartment
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default'
      case 'rejected': return 'destructive'
      case 'interview': return 'secondary'
      case 'pending': return 'outline'
      default: return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Approuvée'
      case 'rejected': return 'Rejetée'
      case 'interview': return 'Entretien'
      case 'pending': return 'En attente'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <Check className="h-4 w-4" />
      case 'rejected': return <X className="h-4 w-4" />
      case 'interview': return <Eye className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const departments = [...new Set(applications.map(app => app.department))]

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Candidatures</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Gérez les candidatures de stage</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Candidatures</CardTitle>
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{applications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">En attente</CardTitle>
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{applications.filter(a => a.status === 'pending').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Approuvées</CardTitle>
            <Check className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{applications.filter(a => a.status === 'approved').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Entretiens</CardTitle>
            <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{applications.filter(a => a.status === 'interview').length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des candidatures</CardTitle>
          <CardDescription>Recherchez et filtrez les candidatures</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, email ou poste..."
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
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="interview">Entretien</SelectItem>
                <SelectItem value="approved">Approuvée</SelectItem>
                <SelectItem value="rejected">Rejetée</SelectItem>
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

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px]">Candidat</TableHead>
                  <TableHead className="min-w-[150px]">Poste</TableHead>
                  <TableHead className="min-w-[120px] hidden lg:table-cell">Département</TableHead>
                  <TableHead className="min-w-[120px]">Statut</TableHead>
                  <TableHead className="min-w-[120px] hidden sm:table-cell">Date de soumission</TableHead>
                  <TableHead className="min-w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{application.candidateName}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground break-all">{application.candidateEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{application.position}</TableCell>
                    <TableCell className="hidden lg:table-cell">{application.department}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(application.status)} className="flex items-center gap-1 w-fit">
                        {getStatusIcon(application.status)}
                        <span className="hidden sm:inline">{getStatusLabel(application.status)}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{new Date(application.submittedAt).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedApplication(application)}>
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Voir détails</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Détails de la candidature</DialogTitle>
                            <DialogDescription>
                              Candidature de {selectedApplication?.candidateName}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedApplication && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Nom du candidat</Label>
                                  <p className="text-sm font-medium">{selectedApplication.candidateName}</p>
                                </div>
                                <div>
                                  <Label>Email</Label>
                                  <p className="text-sm">{selectedApplication.candidateEmail}</p>
                                </div>
                                <div>
                                  <Label>Poste demandé</Label>
                                  <p className="text-sm font-medium">{selectedApplication.position}</p>
                                </div>
                                <div>
                                  <Label>Département</Label>
                                  <p className="text-sm">{selectedApplication.department}</p>
                                </div>
                              </div>
                              <div>
                                <Label>Expérience</Label>
                                <p className="text-sm mt-1">{selectedApplication.experience}</p>
                              </div>
                              <div>
                                <Label>Motivation</Label>
                                <p className="text-sm mt-1">{selectedApplication.motivation}</p>
                              </div>
                              <div className="flex gap-2 pt-4">
                                <Button size="sm" className="flex-1">
                                  <Check className="h-4 w-4 mr-2" />
                                  Approuver
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Programmer entretien
                                </Button>
                                <Button variant="destructive" size="sm" className="flex-1">
                                  <X className="h-4 w-4 mr-2" />
                                  Rejeter
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}