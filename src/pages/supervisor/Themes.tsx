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
import { BookOpen, Plus, Search, Edit, Trash2, Users } from "lucide-react"

interface Theme {
  id: string
  title: string
  description: string
  category: string
  assignedInterns: number
  totalTasks: number
  completedTasks: number
  status: 'active' | 'draft' | 'completed'
  createdAt: string
}

const mockThemes: Theme[] = [
  {
    id: "1",
    title: "Développement d'application mobile",
    description: "Création d'une application mobile pour la gestion des stocks",
    category: "Développement",
    assignedInterns: 2,
    totalTasks: 8,
    completedTasks: 3,
    status: "active",
    createdAt: "2024-03-01"
  },
  {
    id: "2", 
    title: "Analyse de données clients",
    description: "Étude comportementale et segmentation de la clientèle",
    category: "Data Science",
    assignedInterns: 1,
    totalTasks: 5,
    completedTasks: 5,
    status: "completed",
    createdAt: "2024-02-15"
  },
  {
    id: "3",
    title: "Campagne marketing digital",
    description: "Stratégie et mise en œuvre d'une campagne sur les réseaux sociaux",
    category: "Marketing",
    assignedInterns: 1,
    totalTasks: 6,
    completedTasks: 2,
    status: "active",
    createdAt: "2024-03-10"
  },
  {
    id: "4",
    title: "Optimisation des processus RH",
    description: "Digitalisation et amélioration des processus de recrutement",
    category: "Ressources Humaines",
    assignedInterns: 0,
    totalTasks: 4,
    completedTasks: 0,
    status: "draft",
    createdAt: "2024-03-20"
  }
]

export default function Themes() {
  const [themes] = useState<Theme[]>(mockThemes)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredThemes = themes.filter(theme => {
    const matchesSearch = theme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         theme.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || theme.category === selectedCategory
    return matchesSearch && matchesCategory
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

  const getProgressPercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0
  }

  const categories = [...new Set(themes.map(theme => theme.category))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Thèmes</h1>
          <p className="text-muted-foreground">Gérez les thèmes de stage et les projets</p>
        </div>
        <Dialog>
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
                <Label htmlFor="title">Titre du thème</Label>
                <Input id="title" placeholder="Ex: Développement d'application web" />
              </div>
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Développement</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="data">Data Science</SelectItem>
                    <SelectItem value="rh">Ressources Humaines</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Décrivez les objectifs et le contexte du thème"
                  className="min-h-[120px]"
                />
              </div>
              <Button className="w-full">Créer le thème</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tâches Terminées</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{themes.reduce((sum, t) => sum + t.completedTasks, 0)}</div>
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
                placeholder="Rechercher par titre ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thème</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Stagiaires</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredThemes.map((theme) => (
                <TableRow key={theme.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{theme.title}</div>
                      <div className="text-sm text-muted-foreground">{theme.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{theme.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{theme.assignedInterns}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        {theme.completedTasks}/{theme.totalTasks} tâches
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${getProgressPercentage(theme.completedTasks, theme.totalTasks)}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getProgressPercentage(theme.completedTasks, theme.totalTasks)}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(theme.status)}>
                      {getStatusLabel(theme.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
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