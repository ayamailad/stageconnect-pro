import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { BookOpen, Plus, Search, Edit, Trash2, Users, Loader2, Check, ChevronsUpDown, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { useThemes } from "@/hooks/use-themes"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"

export default function Themes() {
  const { themes, internships, loading, createTheme, updateTheme, deleteTheme } = useThemes()
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTheme, setEditingTheme] = useState<any>(null)
  const [formData, setFormData] = useState({
    description: "",
    status: "active",
    selectedInternships: [] as string[]
  })

  const filteredThemes = themes.filter(theme => {
    const matchesSearch = theme.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'completed': return 'secondary'
      case 'draft': return 'outline'
      default: return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actif'
      case 'completed': return 'Terminé'
      case 'draft': return 'Brouillon'
      default: return status
    }
  }

  const handleCreateTheme = async () => {
    if (!formData.description) {
      return
    }

    const success = await createTheme({
      description: formData.description,
      status: formData.status,
      internshipIds: formData.selectedInternships
    })

    if (success) {
      setIsCreateDialogOpen(false)
      setFormData({ description: "", status: "active", selectedInternships: [] })
    }
  }

  const handleEditTheme = async () => {
    if (!editingTheme || !formData.description) {
      return
    }

    const success = await updateTheme(editingTheme.id, {
      description: formData.description,
      status: formData.status,
      internshipIds: formData.selectedInternships
    })

    if (success) {
      setIsEditDialogOpen(false)
      setEditingTheme(null)
      setFormData({ description: "", status: "active", selectedInternships: [] })
    }
  }

  const handleDeleteTheme = async (id: string) => {
    await deleteTheme(id)
  }

  const openEditDialog = (theme: any) => {
    setEditingTheme(theme)
    // Get internships from the member_internship_ids array stored in the theme
    const assignedInternships = theme.member_internship_ids || []
    
    setFormData({
      description: theme.description || "",
      status: theme.status || "active",
      selectedInternships: assignedInternships
    })
    setIsEditDialogOpen(true)
  }

  const toggleInternshipSelection = (internshipId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedInternships: prev.selectedInternships.includes(internshipId)
        ? prev.selectedInternships.filter(id => id !== internshipId)
        : [...prev.selectedInternships, internshipId]
    }))
  }

  const getInternshipLabel = (internship: any) => {
    const internName = internship.intern 
      ? `${internship.intern.first_name} ${internship.intern.last_name}`
      : 'Stagiaire non assigné'
    const startDate = new Date(internship.start_date).toLocaleDateString('fr-FR')
    const endDate = new Date(internship.end_date).toLocaleDateString('fr-FR')
    return `${internName} - Stage ${internship.duration_months} mois (${startDate} - ${endDate})`
  }

  const getSelectedInternshipsLabel = () => {
    if (formData.selectedInternships.length === 0) return "Sélectionner les membres"
    if (formData.selectedInternships.length === 1) {
      const internship = internships.find(i => i.id === formData.selectedInternships[0])
      return internship?.intern 
        ? `${internship.intern.first_name} ${internship.intern.last_name}`
        : "1 sélectionné"
    }
    return `${formData.selectedInternships.length} membres sélectionnés`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Thèmes</h1>
          <p className="text-muted-foreground">Gérez les thèmes de stage et les projets</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Créer un thème
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un nouveau thème</DialogTitle>
              <DialogDescription>
                Définissez un nouveau thème de stage
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="create-description">Description</Label>
                <Textarea 
                  id="create-description" 
                  placeholder="Décrivez le thème"
                  className="min-h-[120px]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="create-status">Statut</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Membres (Stages assignés)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {getSelectedInternshipsLabel()}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Rechercher un stagiaire..." />
                      <CommandEmpty>Aucun stagiaire trouvé</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className="h-[200px]">
                          {internships
                            .filter(i => !i.theme_id || i.theme_id === null)
                            .map((internship) => (
                              <CommandItem
                                key={internship.id}
                                onSelect={() => toggleInternshipSelection(internship.id)}
                                className="cursor-pointer"
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.selectedInternships.includes(internship.id)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {getInternshipLabel(internship)}
                              </CommandItem>
                            ))}
                        </ScrollArea>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <Button className="w-full" onClick={handleCreateTheme}>
                Créer le thème
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier le thème</DialogTitle>
              <DialogDescription>
                Modifiez les informations du thème
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea 
                  id="edit-description" 
                  placeholder="Décrivez le thème"
                  className="min-h-[120px]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Statut</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Membres (Stages assignés)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {getSelectedInternshipsLabel()}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Rechercher un stagiaire..." />
                      <CommandEmpty>Aucun stagiaire trouvé</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className="h-[200px]">
                          {internships
                            .filter(i => !i.theme_id || i.theme_id === editingTheme?.id)
                            .map((internship) => (
                              <CommandItem
                                key={internship.id}
                                onSelect={() => toggleInternshipSelection(internship.id)}
                                className="cursor-pointer"
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.selectedInternships.includes(internship.id)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {getInternshipLabel(internship)}
                              </CommandItem>
                            ))}
                        </ScrollArea>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <Button className="w-full" onClick={handleEditTheme}>
                Enregistrer les modifications
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Thèmes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{themes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thèmes Actifs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{themes.filter(t => t.status === 'active').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stagiaires Assignés</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{themes.reduce((sum, t) => sum + t.assignedInterns, 0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des thèmes</CardTitle>
          <CardDescription>Gérez vos thèmes de stage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredThemes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun thème trouvé</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Stagiaires</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredThemes.map((theme) => (
                  <TableRow key={theme.id}>
                    <TableCell>
                      <div className="font-medium">{theme.description}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{theme.assignedInterns}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(theme.status)}>
                        {getStatusLabel(theme.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(theme)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(theme)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <ConfirmationDialog
                          title="Supprimer le thème"
                          description="Êtes-vous sûr de vouloir supprimer ce thème ? Cette action est irréversible."
                          onConfirm={() => handleDeleteTheme(theme.id)}
                          isDestructive
                          triggerButton={
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}