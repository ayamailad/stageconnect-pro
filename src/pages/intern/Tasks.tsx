import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CheckCircle, Clock, AlertCircle, Plus, Calendar as CalendarIcon, FileText, User } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

// Mock data
const mockTasks = [
  {
    id: 1,
    title: "Analyser les besoins clients",
    description: "Étudier les retours clients et proposer des améliorations",
    status: "En cours",
    priority: "Haute",
    dueDate: "2024-01-15",
    assignedBy: "Marie Dubois",
    estimatedHours: 8,
    completedHours: 3
  },
  {
    id: 2,
    title: "Rédiger rapport hebdomadaire",
    description: "Synthèse des activités de la semaine",
    status: "Terminé",
    priority: "Moyenne",
    dueDate: "2024-01-12",
    assignedBy: "Jean Martin",
    estimatedHours: 2,
    completedHours: 2
  },
  {
    id: 3,
    title: "Formation React avancé",
    description: "Suivre le module de formation sur React et hooks",
    status: "À faire",
    priority: "Basse",
    dueDate: "2024-01-20",
    assignedBy: "Sophie Bernard",
    estimatedHours: 16,
    completedHours: 0
  }
]

const statusColors = {
  "À faire": "bg-gray-100 text-gray-800",
  "En cours": "bg-blue-100 text-blue-800",
  "Terminé": "bg-green-100 text-green-800"
}

const priorityColors = {
  "Basse": "bg-gray-100 text-gray-600",
  "Moyenne": "bg-yellow-100 text-yellow-800", 
  "Haute": "bg-red-100 text-red-800"
}

export default function InternTasks() {
  const [tasks, setTasks] = useState(mockTasks)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState("Tous")
  const [searchTerm, setSearchTerm] = useState("")
  const [newTaskDialog, setNewTaskDialog] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Moyenne",
    dueDate: new Date()
  })

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === "Tous" || task.status === filterStatus
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Terminé": return <CheckCircle className="h-4 w-4 text-green-600" />
      case "En cours": return <Clock className="h-4 w-4 text-blue-600" />
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const updateTaskStatus = (taskId: number, newStatus: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ))
  }

  const createTask = () => {
    const task = {
      id: tasks.length + 1,
      ...newTask,
      status: "À faire",
      assignedBy: "Auto-assigné",
      estimatedHours: 4,
      completedHours: 0,
      dueDate: format(newTask.dueDate, "yyyy-MM-dd")
    }
    setTasks([...tasks, task])
    setNewTask({ title: "", description: "", priority: "Moyenne", dueDate: new Date() })
    setNewTaskDialog(false)
  }

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "Terminé").length,
    inProgress: tasks.filter(t => t.status === "En cours").length,
    pending: tasks.filter(t => t.status === "À faire").length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mes Tâches</h1>
          <p className="text-muted-foreground">Gérez vos tâches et suivez votre progression</p>
        </div>
        
        <Dialog open={newTaskDialog} onOpenChange={setNewTaskDialog}>
          <DialogTrigger asChild>
            <Button className="btn-brand">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Tâche
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une nouvelle tâche</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="Titre de la tâche"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Description détaillée"
                />
              </div>
              <div>
                <Label>Priorité</Label>
                <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basse">Basse</SelectItem>
                    <SelectItem value="Moyenne">Moyenne</SelectItem>
                    <SelectItem value="Haute">Haute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date d'échéance</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(newTask.dueDate, "PPP", { locale: fr })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newTask.dueDate}
                      onSelect={(date) => date && setNewTask({...newTask, dueDate: date})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button onClick={createTask} className="w-full btn-brand">
                Créer la tâche
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Terminées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">À faire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{taskStats.pending}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Rechercher une tâche..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Tous">Tous les statuts</SelectItem>
            <SelectItem value="À faire">À faire</SelectItem>
            <SelectItem value="En cours">En cours</SelectItem>
            <SelectItem value="Terminé">Terminé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tasks List */}
      <div className="grid gap-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(task.status)}
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>
                      {task.priority}
                    </Badge>
                  </div>
                  <CardDescription>{task.description}</CardDescription>
                </div>
                <Badge className={statusColors[task.status as keyof typeof statusColors]}>
                  {task.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>Échéance: {format(new Date(task.dueDate), "dd MMM yyyy", { locale: fr })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Assigné par: {task.assignedBy}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Temps: {task.completedHours}h / {task.estimatedHours}h</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                {task.status !== "Terminé" && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateTaskStatus(task.id, task.status === "À faire" ? "En cours" : "Terminé")}
                  >
                    {task.status === "À faire" ? "Commencer" : "Terminer"}
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedTask(task)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Détails
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Task Details Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-2xl">
          {selectedTask && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTask.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Description</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedTask.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Statut</Label>
                    <Badge className={`${statusColors[selectedTask.status as keyof typeof statusColors]} mt-1`}>
                      {selectedTask.status}
                    </Badge>
                  </div>
                  <div>
                    <Label>Priorité</Label>
                    <Badge className={`${priorityColors[selectedTask.priority as keyof typeof priorityColors]} mt-1`}>
                      {selectedTask.priority}
                    </Badge>
                  </div>
                  <div>
                    <Label>Date d'échéance</Label>
                    <p className="text-sm mt-1">{format(new Date(selectedTask.dueDate), "PPP", { locale: fr })}</p>
                  </div>
                  <div>
                    <Label>Assigné par</Label>
                    <p className="text-sm mt-1">{selectedTask.assignedBy}</p>
                  </div>
                </div>
                <div>
                  <Label>Progression</Label>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{selectedTask.completedHours}h / {selectedTask.estimatedHours}h</span>
                      <span>{Math.round((selectedTask.completedHours / selectedTask.estimatedHours) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(selectedTask.completedHours / selectedTask.estimatedHours) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}