import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, UserPlus, Search, Edit, Calendar, User, Eye } from "lucide-react"
import { useInternships } from "@/hooks/use-internships"
import { useUsers } from "@/hooks/use-users"

export default function Internships() {
  const { internships, loading, updateInternship } = useInternships()
  const { users } = useUsers()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedInternship, setSelectedInternship] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state for assign/edit supervisor
  const [selectedSupervisorId, setSelectedSupervisorId] = useState("")
  const [selectedInternshipId, setSelectedInternshipId] = useState("")

  // Supervisors and available internships
  const supervisors = users.filter(u => u.role === 'supervisor')
  const availableInternships = internships.filter(i => i.status === 'available')

  const handleAssignSupervisor = async () => {
    if (!selectedSupervisorId || !selectedInternshipId) return

    setIsSubmitting(true)
    const success = await updateInternship(selectedInternshipId, { 
      supervisor_id: selectedSupervisorId,
      status: 'assigned'
    })
    setIsSubmitting(false)

    if (success) {
      setIsAssignOpen(false)
      setSelectedSupervisorId("")
      setSelectedInternshipId("")
    }
  }

  const handleEditSupervisor = async () => {
    if (!selectedInternship || !selectedSupervisorId) return

    setIsSubmitting(true)
    const success = await updateInternship(selectedInternship.id, { supervisor_id: selectedSupervisorId })
    setIsSubmitting(false)

    if (success) {
      setIsEditOpen(false)
      setSelectedInternship(null)
      setSelectedSupervisorId("")
    }
  }

  const handleEditClick = (internship: any) => {
    setSelectedInternship(internship)
    setSelectedSupervisorId(internship.supervisor_id || "")
    setIsEditOpen(true)
  }

  const handleViewClick = (internship: any) => {
    setSelectedInternship(internship)
    setIsViewOpen(true)
  }

  const filteredInternships = internships.filter(internship => {
    const supervisorName = internship.supervisor 
      ? `${internship.supervisor.first_name} ${internship.supervisor.last_name}` 
      : ""
    const internName = internship.intern 
      ? `${internship.intern.first_name} ${internship.intern.last_name}` 
      : ""
    const matchesSearch = supervisorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || internship.status === selectedStatus
    return matchesSearch && matchesStatus
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

  

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Stages</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Gérez les offres de stage et les affectations</p>
        </div>
        <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <UserPlus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Affecter un superviseur</span>
              <span className="sm:hidden">Affecter</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Affecter un superviseur</DialogTitle>
              <DialogDescription>
                Sélectionnez un stage disponible et un superviseur
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="assign-internship">Stage disponible</Label>
                <Select value={selectedInternshipId} onValueChange={setSelectedInternshipId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableInternships.map(internship => {
                      const internName = internship.intern 
                        ? `${internship.intern.first_name} ${internship.intern.last_name}`
                        : "Non assigné";
                      return (
                        <SelectItem key={internship.id} value={internship.id}>
                          {internName} - {internship.duration_months} mois
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="assign-supervisor">Superviseur</Label>
                <Select value={selectedSupervisorId} onValueChange={setSelectedSupervisorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un superviseur" />
                  </SelectTrigger>
                  <SelectContent>
                    {supervisors.map(supervisor => (
                      <SelectItem key={supervisor.id} value={supervisor.id}>
                        {supervisor.first_name} {supervisor.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                className="w-full" 
                onClick={handleAssignSupervisor}
                disabled={isSubmitting || !selectedSupervisorId || !selectedInternshipId}
              >
                {isSubmitting ? "Affectation..." : "Affecter"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Supervisor Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le superviseur</DialogTitle>
              <DialogDescription>
                Changez le superviseur affecté à ce stage
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Stage</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedInternship?.start_date} - {selectedInternship?.end_date}
                </p>
              </div>
              <div>
                <Label htmlFor="edit-supervisor">Nouveau superviseur</Label>
                <Select value={selectedSupervisorId} onValueChange={setSelectedSupervisorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un superviseur" />
                  </SelectTrigger>
                  <SelectContent>
                    {supervisors.map(supervisor => (
                      <SelectItem key={supervisor.id} value={supervisor.id}>
                        {supervisor.first_name} {supervisor.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                className="w-full" 
                onClick={handleEditSupervisor}
                disabled={isSubmitting || !selectedSupervisorId}
              >
                {isSubmitting ? "Modification..." : "Modifier"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Détails du stage</DialogTitle>
              <DialogDescription>
                Informations complètes sur le stage
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Superviseur</Label>
                <p className="text-sm">
                  {selectedInternship?.supervisor 
                    ? `${selectedInternship.supervisor.first_name} ${selectedInternship.supervisor.last_name}`
                    : "Non affecté"}
                </p>
              </div>
              <div>
                <Label>Stagiaire</Label>
                <p className="text-sm">
                  {selectedInternship?.intern 
                    ? `${selectedInternship.intern.first_name} ${selectedInternship.intern.last_name}`
                    : "Non affecté"}
                </p>
              </div>
              <div>
                <Label>Période</Label>
                <p className="text-sm">
                  {selectedInternship?.start_date} - {selectedInternship?.end_date}
                </p>
              </div>
              <div>
                <Label>Durée</Label>
                <p className="text-sm">{selectedInternship?.duration_months} mois</p>
              </div>
              <div>
                <Label>Statut</Label>
                <p className="text-sm">
                  <Badge variant={getStatusBadgeVariant(selectedInternship?.status || '')}>
                    {getStatusLabel(selectedInternship?.status || '')}
                  </Badge>
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Stages</CardTitle>
            <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{internships.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Disponibles</CardTitle>
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{internships.filter(i => i.status === 'available').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">En cours</CardTitle>
            <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{internships.filter(i => i.status === 'in_progress').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Terminés</CardTitle>
            <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{internships.filter(i => i.status === 'completed').length}</div>
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
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
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
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Superviseur</TableHead>
                  <TableHead className="min-w-[120px]">Stagiaire</TableHead>
                  <TableHead className="min-w-[140px] hidden md:table-cell">Période</TableHead>
                  <TableHead className="min-w-[100px]">Statut</TableHead>
                  <TableHead className="min-w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : filteredInternships.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Aucun stage trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInternships.map((internship) => (
                    <TableRow key={internship.id}>
                      <TableCell className="font-medium">
                        {internship.supervisor 
                          ? `${internship.supervisor.first_name} ${internship.supervisor.last_name}`
                          : <span className="text-muted-foreground italic">Non assigné</span>
                        }
                      </TableCell>
                      <TableCell>
                        {internship.intern ? (
                          <span className="font-medium">
                            {internship.intern.first_name} {internship.intern.last_name}
                          </span>
                        ) : (
                          <span className="text-muted-foreground italic">Non assigné</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="text-sm">
                          <div>{new Date(internship.start_date).toLocaleDateString('fr-FR')}</div>
                          <div className="text-muted-foreground">
                            au {new Date(internship.end_date).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(internship.status)}>
                          {getStatusLabel(internship.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1 sm:space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditClick(internship)}
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewClick(internship)}
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}