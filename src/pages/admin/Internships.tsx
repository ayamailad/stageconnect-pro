import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { GraduationCap, Plus, Search, Edit, Calendar, User, Trash2 } from "lucide-react"
import { useInternships } from "@/hooks/use-internships"
import { useUsers } from "@/hooks/use-users"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"

export default function Internships() {
  const { internships, loading, createInternship, updateInternship, assignIntern, deleteInternship } = useInternships()
  const { users } = useUsers()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedInternship, setSelectedInternship] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state for create/edit
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    supervisor_id: "",
    start_date: "",
    end_date: "",
    duration_months: 3,
    description: "",
    requirements: ""
  })

  // Supervisors and interns
  const supervisors = users.filter(u => u.role === 'supervisor')
  const interns = users.filter(u => u.role === 'intern')

  const resetForm = () => {
    setFormData({
      title: "",
      department: "",
      supervisor_id: "",
      start_date: "",
      end_date: "",
      duration_months: 3,
      description: "",
      requirements: ""
    })
  }

  const handleCreateSubmit = async () => {
    if (!formData.title || !formData.department || !formData.supervisor_id || 
        !formData.start_date || !formData.end_date || !formData.description) {
      return
    }

    setIsSubmitting(true)
    const success = await createInternship(formData)
    setIsSubmitting(false)

    if (success) {
      setIsCreateOpen(false)
      resetForm()
    }
  }

  const handleEditSubmit = async () => {
    if (!selectedInternship) return

    setIsSubmitting(true)
    const success = await updateInternship(selectedInternship, formData)
    setIsSubmitting(false)

    if (success) {
      setIsEditOpen(false)
      setSelectedInternship(null)
      resetForm()
    }
  }

  const handleEditClick = (internship: any) => {
    setSelectedInternship(internship.id)
    setFormData({
      title: internship.title,
      department: internship.department,
      supervisor_id: internship.supervisor_id || "",
      start_date: internship.start_date,
      end_date: internship.end_date,
      duration_months: internship.duration_months,
      description: internship.description,
      requirements: internship.requirements || ""
    })
    setIsEditOpen(true)
  }

  const handleDeleteClick = (internshipId: string) => {
    setSelectedInternship(internshipId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedInternship) return

    setIsSubmitting(true)
    const success = await deleteInternship(selectedInternship)
    setIsSubmitting(false)

    if (success) {
      setDeleteDialogOpen(false)
      setSelectedInternship(null)
    }
  }

  const handleAssignClick = (internshipId: string) => {
    setSelectedInternship(internshipId)
    setIsAssignOpen(true)
  }

  const handleAssignIntern = async (internId: string) => {
    if (!selectedInternship) return

    setIsSubmitting(true)
    const success = await assignIntern(selectedInternship, internId)
    setIsSubmitting(false)

    if (success) {
      setIsAssignOpen(false)
      setSelectedInternship(null)
    }
  }

  const filteredInternships = internships.filter(internship => {
    const supervisorName = internship.supervisor 
      ? `${internship.supervisor.first_name} ${internship.supervisor.last_name}` 
      : ""
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supervisorName.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Stages</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Gérez les offres de stage et les affectations</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Créer un stage</span>
              <span className="sm:hidden">Créer</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle offre de stage</DialogTitle>
              <DialogDescription>
                Définissez les détails du stage
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="create-title">Titre du stage</Label>
                  <Input 
                    id="create-title" 
                    placeholder="Ex: Stage Développement Web"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="create-department">Département</Label>
                  <Input 
                    id="create-department" 
                    placeholder="Ex: Informatique"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="create-supervisor">Superviseur</Label>
                  <Select value={formData.supervisor_id} onValueChange={(value) => setFormData({ ...formData, supervisor_id: value })}>
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
                <div>
                  <Label htmlFor="create-start">Date de début</Label>
                  <Input 
                    id="create-start" 
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="create-end">Date de fin</Label>
                  <Input 
                    id="create-end" 
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="create-duration">Durée (mois)</Label>
                  <Select value={formData.duration_months.toString()} onValueChange={(value) => setFormData({ ...formData, duration_months: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 mois</SelectItem>
                      <SelectItem value="2">2 mois</SelectItem>
                      <SelectItem value="3">3 mois</SelectItem>
                      <SelectItem value="6">6 mois</SelectItem>
                      <SelectItem value="12">12 mois</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="create-description">Description</Label>
                <Textarea 
                  id="create-description" 
                  placeholder="Décrivez les missions et objectifs du stage"
                  className="min-h-[100px]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="create-requirements">Prérequis</Label>
                <Textarea 
                  id="create-requirements" 
                  placeholder="Compétences et formations requises"
                  className="min-h-[80px]"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleCreateSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Création..." : "Créer le stage"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier le stage</DialogTitle>
              <DialogDescription>
                Modifiez les détails du stage
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="edit-title">Titre du stage</Label>
                  <Input 
                    id="edit-title" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-department">Département</Label>
                  <Input 
                    id="edit-department" 
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-supervisor">Superviseur</Label>
                  <Select value={formData.supervisor_id} onValueChange={(value) => setFormData({ ...formData, supervisor_id: value })}>
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
                <div>
                  <Label htmlFor="edit-start">Date de début</Label>
                  <Input 
                    id="edit-start" 
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-end">Date de fin</Label>
                  <Input 
                    id="edit-end" 
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-duration">Durée (mois)</Label>
                  <Select value={formData.duration_months.toString()} onValueChange={(value) => setFormData({ ...formData, duration_months: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 mois</SelectItem>
                      <SelectItem value="2">2 mois</SelectItem>
                      <SelectItem value="3">3 mois</SelectItem>
                      <SelectItem value="6">6 mois</SelectItem>
                      <SelectItem value="12">12 mois</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea 
                  id="edit-description" 
                  className="min-h-[100px]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-requirements">Prérequis</Label>
                <Textarea 
                  id="edit-requirements" 
                  className="min-h-[80px]"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleEditSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Modification..." : "Modifier le stage"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Assign Intern Dialog */}
        <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Affecter un stagiaire</DialogTitle>
              <DialogDescription>
                Sélectionnez un stagiaire à affecter à ce stage
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Select onValueChange={handleAssignIntern} disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un stagiaire" />
                </SelectTrigger>
                <SelectContent>
                  {interns.map(intern => (
                    <SelectItem key={intern.id} value={intern.id}>
                      {intern.first_name} {intern.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Supprimer le stage"
          description="Êtes-vous sûr de vouloir supprimer ce stage ? Cette action est irréversible."
          confirmText="Supprimer"
          cancelText="Annuler"
          onConfirm={handleDeleteConfirm}
          isDestructive
          isLoading={isSubmitting}
        />
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
                  <TableHead className="min-w-[180px]">Titre</TableHead>
                  <TableHead className="min-w-[120px] hidden lg:table-cell">Département</TableHead>
                  <TableHead className="min-w-[120px] hidden sm:table-cell">Superviseur</TableHead>
                  <TableHead className="min-w-[120px]">Stagiaire</TableHead>
                  <TableHead className="min-w-[140px] hidden md:table-cell">Période</TableHead>
                  <TableHead className="min-w-[100px]">Statut</TableHead>
                  <TableHead className="min-w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : filteredInternships.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Aucun stage trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInternships.map((internship) => (
                    <TableRow key={internship.id}>
                      <TableCell className="font-medium">{internship.title}</TableCell>
                      <TableCell className="hidden lg:table-cell">{internship.department}</TableCell>
                      <TableCell className="hidden sm:table-cell">
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
                          {internship.status === 'available' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleAssignClick(internship.id)}
                            >
                              <User className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteClick(internship.id)}
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
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