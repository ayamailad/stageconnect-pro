import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { ClipboardList, Plus, Search, Edit, CheckCircle, Clock, AlertCircle, Calendar, Eye, Trash2, Loader2 } from "lucide-react"
import { useTasks } from "@/hooks/use-tasks"
import { useThemes } from "@/hooks/use-themes"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"

export default function Tasks() {
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks()
  const { themes, internships } = useThemes()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    theme_id: "",
    intern_id: "",
    priority: "medium",
    status: "todo",
    due_date: undefined as Date | undefined
  })

  // Get available interns based on selected theme
  const getAvailableInterns = () => {
    if (!formData.theme_id) return []
    
    const selectedTheme = themes.find(t => t.id === formData.theme_id)
    if (!selectedTheme || !selectedTheme.member_internship_ids) return []
    
    // Get internships that are part of this theme
    const themeInternships = internships.filter(i => 
      selectedTheme.member_internship_ids.includes(i.id)
    )
    
    // Return unique interns
    return themeInternships
      .filter(i => i.intern)
      .map(i => i.intern!)
      .filter((intern, index, self) => 
        index === self.findIndex(t => t.id === intern.id)
      )
  }

  const filteredTasks = tasks.filter(task => {
    const internName = task.intern ? `${task.intern.first_name} ${task.intern.last_name}` : ""
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || task.status === selectedStatus
    const matchesPriority = selectedPriority === "all" || task.priority === selectedPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleCreateTask = async () => {
    if (!formData.title || !formData.intern_id) {
      return
    }

    // Validate due date is within internship period
    if (formData.due_date) {
      const selectedInternship = internships.find(i => i.intern_id === formData.intern_id)
      if (selectedInternship) {
        const dueDate = formData.due_date
        const startDate = new Date(selectedInternship.start_date)
        const endDate = new Date(selectedInternship.end_date)
        
        if (dueDate < startDate || dueDate > endDate) {
          return
        }
      }
    }

    const success = await createTask({
        title: formData.title,
        description: formData.description,
        intern_id: formData.intern_id,
        theme_id: formData.theme_id,
        priority: formData.priority,
        status: formData.status,
        due_date: formData.due_date
    })

    if (success) {
      setIsCreateDialogOpen(false)
      resetForm()
    }
  }

  const handleEditTask = async () => {
    if (!selectedTask || !formData.title || !formData.intern_id) {
      return
    }

    // Validate due date is within internship period
    if (formData.due_date) {
      const selectedInternship = internships.find(i => i.intern_id === formData.intern_id)
      if (selectedInternship) {
        const dueDate = formData.due_date
        const startDate = new Date(selectedInternship.start_date)
        const endDate = new Date(selectedInternship.end_date)
        
        if (dueDate < startDate || dueDate > endDate) {
          return
        }
      }
    }

    const success = await updateTask(selectedTask.id, {
        title: formData.title,
        description: formData.description,
        intern_id: formData.intern_id,
        theme_id: formData.theme_id,
        priority: formData.priority,
        status: formData.status,
        due_date: formData.due_date
    })

    if (success) {
      setIsEditDialogOpen(false)
      setSelectedTask(null)
      resetForm()
    }
  }

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id)
  }

  const openEditDialog = (task: any) => {
    setSelectedTask(task)
    
    setFormData({
      title: task.title || "",
      description: task.description || "",
      theme_id: task.theme_id || "",
      intern_id: task.intern_id,
      priority: task.priority,
      status: task.status,
      due_date: task.due_date ? new Date(task.due_date) : undefined
    })
    setIsEditDialogOpen(true)
  }

  const openViewDialog = (task: any) => {
    setSelectedTask(task)
    setIsViewDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      theme_id: "",
      intern_id: "",
      priority: "medium",
      status: "todo",
      due_date: undefined
    })
  }

  // Reset intern selection when theme changes (only in create mode)
  useEffect(() => {
    if (!isEditDialogOpen) {
      setFormData(prev => ({ ...prev, intern_id: "" }))
    }
  }, [formData.theme_id, isEditDialogOpen])

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default'
      case 'in_progress': return 'secondary'
      case 'review': return 'outline'
      case 'todo': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé'
      case 'in_progress': return 'En cours'
      case 'review': return 'En révision'
      case 'todo': return 'À faire'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'in_progress': return <Clock className="h-4 w-4" />
      case 'review': return <AlertCircle className="h-4 w-4" />
      case 'todo': return <ClipboardList className="h-4 w-4" />
      default: return <ClipboardList className="h-4 w-4" />
    }
  }

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'secondary'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Élevée'
      case 'medium': return 'Moyenne'
      case 'low': return 'Faible'
      default: return priority
    }
  }

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false
    const task = tasks.find(t => t.due_date === dueDate)
    return new Date(dueDate) < new Date() && task?.status !== 'completed'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tâches</h1>
          <p className="text-muted-foreground">Gérez les tâches assignées aux stagiaires</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Créer une tâche
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle tâche</DialogTitle>
              <DialogDescription>
                Assignez une nouvelle tâche à un stagiaire
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre de la tâche</Label>
                <Input 
                  id="title" 
                  placeholder="Ex: Créer la base de données"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="theme">Thème</Label>
                  <Select value={formData.theme_id} onValueChange={(value) => setFormData({ ...formData, theme_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un thème" />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((theme) => (
                        <SelectItem key={theme.id} value={theme.id}>
                          {theme.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="assignee">Assigné à</Label>
                  <Select 
                    value={formData.intern_id} 
                    onValueChange={(value) => setFormData({ ...formData, intern_id: value })}
                    disabled={!formData.theme_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.theme_id ? "Sélectionner un stagiaire" : "Sélectionnez d'abord un thème"} />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableInterns().map((intern) => (
                        <SelectItem key={intern.id} value={intern.id}>
                          {intern.first_name} {intern.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priorité</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Faible</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="high">Élevée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dueDate">Date d'échéance</Label>
                  <DatePicker
                    date={formData.due_date}
                    onSelect={(date) => setFormData({ ...formData, due_date: date })}
                    placeholder="Sélectionner la date d'échéance"
                    disabledDates={(date) => {
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      
                      if (date < today) return true
                      
                      if (formData.intern_id) {
                        const selectedInternship = internships.find(i => i.intern_id === formData.intern_id)
                        if (selectedInternship) {
                          const startDate = new Date(selectedInternship.start_date)
                          const endDate = new Date(selectedInternship.end_date)
                          return date < startDate || date > endDate
                        }
                      }
                      
                      return false
                    }}
                  />
                  {formData.intern_id && (() => {
                    const internship = internships.find(i => i.intern_id === formData.intern_id)
                    if (internship) {
                      return (
                        <p className="text-sm text-muted-foreground mt-1">
                          Période du stage: {new Date(internship.start_date).toLocaleDateString('fr-FR')} - {new Date(internship.end_date).toLocaleDateString('fr-FR')}
                        </p>
                      )
                    }
                  })()}
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Décrivez la tâche en détail..."
                  className="min-h-[100px]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <Button className="w-full" onClick={handleCreateTask} disabled={!formData.title || !formData.intern_id}>
                Créer la tâche
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier la tâche</DialogTitle>
              <DialogDescription>
                Modifiez les détails de la tâche
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Titre de la tâche</Label>
                <Input 
                  id="edit-title" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-theme">Thème</Label>
                  <Select value={formData.theme_id} onValueChange={(value) => setFormData({ ...formData, theme_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un thème" />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((theme) => (
                        <SelectItem key={theme.id} value={theme.id}>
                          {theme.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-assignee">Assigné à</Label>
                  <Select 
                    value={formData.intern_id} 
                    onValueChange={(value) => setFormData({ ...formData, intern_id: value })}
                    disabled={!formData.theme_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un stagiaire" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableInterns().map((intern) => (
                        <SelectItem key={intern.id} value={intern.id}>
                          {intern.first_name} {intern.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-priority">Priorité</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Faible</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="high">Élevée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-status">Statut</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">À faire</SelectItem>
                      <SelectItem value="in_progress">En cours</SelectItem>
                      <SelectItem value="review">En révision</SelectItem>
                      <SelectItem value="completed">Terminé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-dueDate">Date d'échéance</Label>
                  <DatePicker 
                    date={formData.due_date}
                    onSelect={(date) => setFormData({ ...formData, due_date: date })}
                    placeholder="Sélectionner la date d'échéance" 
                  />
                  {formData.intern_id && (() => {
                    const internship = internships.find(i => i.intern_id === formData.intern_id)
                    if (internship) {
                      return (
                        <p className="text-sm text-muted-foreground mt-1">
                          Période du stage: {new Date(internship.start_date).toLocaleDateString('fr-FR')} - {new Date(internship.end_date).toLocaleDateString('fr-FR')}
                        </p>
                      )
                    }
                  })()}
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
              <Button className="w-full" onClick={handleEditTask} disabled={!formData.title || !formData.intern_id}>
                Enregistrer les modifications
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails de la tâche</DialogTitle>
            </DialogHeader>
            {selectedTask && (
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Titre</Label>
                  <p className="text-lg font-medium">{selectedTask.title}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Assigné à</Label>
                    <p className="font-medium">
                      {selectedTask.intern ? `${selectedTask.intern.first_name} ${selectedTask.intern.last_name}` : "Non assigné"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Priorité</Label>
                    <div className="mt-1">
                      <Badge variant={getPriorityBadgeVariant(selectedTask.priority)}>
                        {getPriorityLabel(selectedTask.priority)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Statut</Label>
                    <div className="mt-1">
                      <Badge variant={getStatusBadgeVariant(selectedTask.status)} className="flex items-center gap-1 w-fit">
                        {getStatusIcon(selectedTask.status)}
                        {getStatusLabel(selectedTask.status)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Date d'échéance</Label>
                    <p className="font-medium">
                      {selectedTask.due_date ? new Date(selectedTask.due_date).toLocaleDateString('fr-FR') : "Non définie"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Heures estimées</Label>
                    <p className="font-medium">{selectedTask.estimated_hours || 0}h</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Heures complétées</Label>
                    <p className="font-medium">{selectedTask.completed_hours || 0}h</p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="text-sm whitespace-pre-wrap">{selectedTask.description || "Aucune description"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Créée le</Label>
                  <p className="text-sm">{new Date(selectedTask.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tâches</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.filter(t => t.status === 'in_progress').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminées</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.filter(t => t.status === 'completed').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En retard</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.filter(t => isOverdue(t.due_date)).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des tâches</CardTitle>
          <CardDescription>Suivez et gérez les tâches assignées</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par titre, description ou assigné..."
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
                <SelectItem value="todo">À faire</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="review">En révision</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les priorités</SelectItem>
                <SelectItem value="high">Élevée</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="low">Faible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tâche</TableHead>
                <TableHead>Thème</TableHead>
                <TableHead>Assigné à</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Aucune tâche trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks.map((task) => {
                  const theme = themes.find(t => t.id === task.theme_id)
                  
                  return (
                    <TableRow key={task.id} className={isOverdue(task.due_date) ? "bg-destructive/5" : ""}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2">{task.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{theme?.description || "Aucun thème"}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {task.intern ? `${task.intern.first_name} ${task.intern.last_name}` : "Non assigné"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityBadgeVariant(task.priority)}>
                          {getPriorityLabel(task.priority)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {task.due_date ? (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className={isOverdue(task.due_date) ? "text-destructive font-medium" : ""}>
                              {new Date(task.due_date).toLocaleDateString('fr-FR')}
                            </span>
                            {isOverdue(task.due_date) && (
                              <AlertCircle className="h-4 w-4 text-destructive" />
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Non définie</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(task.status)} className="flex items-center gap-1 w-fit">
                          {getStatusIcon(task.status)}
                          {getStatusLabel(task.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => openViewDialog(task)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(task)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <ConfirmationDialog
                            title="Supprimer la tâche"
                            description="Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible."
                            onConfirm={() => handleDeleteTask(task.id)}
                            triggerButton={
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}