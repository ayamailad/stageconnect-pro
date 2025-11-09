import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Clock, AlertCircle, Calendar as CalendarIcon, FileText, User, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useInternTasks } from "@/hooks/use-intern-tasks"

const statusMap = {
  "todo": "À faire",
  "in_progress": "En cours",
  "completed": "Terminé"
}

const statusColors = {
  "À faire": "bg-gray-100 text-gray-800",
  "En cours": "bg-blue-100 text-blue-800",
  "Terminé": "bg-green-100 text-green-800"
}

const priorityMap = {
  "low": "Basse",
  "medium": "Moyenne",
  "high": "Haute"
}

const priorityColors = {
  "Basse": "bg-gray-100 text-gray-600",
  "Moyenne": "bg-yellow-100 text-yellow-800", 
  "Haute": "bg-red-100 text-red-800"
}

export default function InternTasks() {
  const { tasks: dbTasks, loading, updateTaskStatus: updateStatus } = useInternTasks()
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState("Tous")
  const [searchTerm, setSearchTerm] = useState("")

  // Transform database tasks to display format
  const tasks = dbTasks.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description || "",
    status: statusMap[task.status as keyof typeof statusMap],
    priority: priorityMap[task.priority as keyof typeof priorityMap],
    dueDate: task.due_date || "",
    assignedBy: task.supervisor ? `${task.supervisor.first_name} ${task.supervisor.last_name}` : "Non assigné",
    estimatedHours: task.estimated_hours || 0,
    completedHours: task.completed_hours || 0
  }))

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

  const handleUpdateTaskStatus = async (taskId: string, currentStatus: string) => {
    let newStatus = ""
    if (currentStatus === "À faire") {
      newStatus = "in_progress"
    } else if (currentStatus === "En cours") {
      newStatus = "completed"
    }
    
    if (newStatus) {
      await updateStatus(taskId, newStatus)
    }
  }

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "Terminé").length,
    inProgress: tasks.filter(t => t.status === "En cours").length,
    pending: tasks.filter(t => t.status === "À faire").length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mes Tâches</h1>
        <p className="text-muted-foreground">Gérez vos tâches et suivez votre progression</p>
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
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>Échéance: {format(new Date(task.dueDate), "dd MMM yyyy", { locale: fr })}</span>
              </div>
              
              <div className="flex gap-2 mt-4">
                {task.status !== "Terminé" && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleUpdateTaskStatus(task.id, task.status)}
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
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}