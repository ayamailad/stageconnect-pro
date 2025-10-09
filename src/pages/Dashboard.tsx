import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Calendar,
  Target,
  BookOpen
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useInternTasks } from "@/hooks/use-intern-tasks"
import { useInternAttendance } from "@/hooks/use-intern-attendance"
import { useNavigate } from "react-router-dom"
import { useMemo } from "react"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { tasks, loading: tasksLoading } = useInternTasks()
  const { attendance, internship, loading: attendanceLoading } = useInternAttendance()

  // Mock data - remplacer par de vraies données API
  const mockStats = {
    candidate: {
      applicationStatus: "En attente",
      submittedAt: "15 Mars 2024",
      expectedResponse: "Dans 3-5 jours"
    },
    intern: {
      currentTheme: "Développement Web Full-Stack",
      supervisor: "Dr. Marie Dubois",
      tasksCompleted: 8,
      totalTasks: 12,
      attendanceRate: 95
    },
    supervisor: {
      totalInterns: 5,
      activeThemes: 3,
      pendingTasks: 7,
      completedTasks: 23
    },
    admin: {
      totalUsers: 156,
      pendingApplications: 12,
      activeInternships: 45,
      completionRate: 87
    }
  }

  const renderCandidateDashboard = () => (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Bienvenue, {user?.name} !</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Suivez le statut de votre candidature</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Statut de Candidature
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Statut</span>
              <Badge variant="secondary" className="bg-warning/10 text-warning">
                {mockStats.candidate.applicationStatus}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Soumise le</span>
              <span className="text-muted-foreground">{mockStats.candidate.submittedAt}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Réponse attendue</span>
              <span className="text-primary font-medium">{mockStats.candidate.expectedResponse}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Prochaines Étapes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm">Candidature soumise</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-warning" />
                <span className="text-sm">En attente de révision</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Entretien (si sélectionné)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderInternDashboard = () => {
    const completedTasks = tasks.filter(t => t.status === 'completed').length
    const totalTasks = tasks.length
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    
    const presentDays = attendance.filter(a => a.status === 'present').length
    const totalDays = attendance.length
    const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0

    // Chart data for tasks
    const tasksChartData = [
      { name: 'Terminées', value: completedTasks, fill: 'hsl(var(--success))' },
      { name: 'En cours', value: totalTasks - completedTasks, fill: 'hsl(var(--muted))' }
    ]

    // Chart data for attendance
    const attendanceChartData = [
      { name: 'Présent', value: presentDays, fill: 'hsl(var(--success))' },
      { name: 'Absent', value: totalDays - presentDays, fill: 'hsl(var(--destructive))' }
    ]

    // Recent attendance chart data (last 7 days)
    const recentAttendance = useMemo(() => {
      return attendance
        .slice(0, 7)
        .reverse()
        .map(a => ({
          date: new Date(a.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
          status: a.status === 'present' ? 1 : 0
        }))
    }, [attendance])

    return (
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Bienvenue, {user?.name} !</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Voici votre progression de stage</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="card-gradient">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-base sm:text-lg">Mon Stage</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Informations générales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              {attendanceLoading ? (
                <p className="text-sm text-muted-foreground">Chargement...</p>
              ) : internship ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Thème</p>
                    <p className="font-medium">{internship.theme?.description || 'Non assigné'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Superviseur</p>
                    <p className="font-medium">
                      {internship.supervisor?.first_name} {internship.supervisor?.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Période</p>
                    <p className="font-medium text-xs">
                      {new Date(internship.start_date).toLocaleDateString('fr-FR')} - {new Date(internship.end_date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Aucun stage assigné</p>
              )}
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Mes Tâches
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              {tasksLoading ? (
                <p className="text-sm text-muted-foreground">Chargement...</p>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {completedTasks}/{totalTasks}
                      </div>
                      {totalTasks > 0 && (
                        <Badge variant="secondary" className="bg-success/10 text-success mt-1">
                          {completionRate}%
                        </Badge>
                      )}
                    </div>
                    {totalTasks > 0 && (
                      <ChartContainer
                        config={{
                          completed: { label: "Terminées", color: "hsl(var(--success))" },
                          pending: { label: "En cours", color: "hsl(var(--muted))" }
                        }}
                        className="h-[80px] w-[80px]"
                      >
                        <PieChart>
                          <Pie
                            data={tasksChartData}
                            dataKey="value"
                            innerRadius={25}
                            outerRadius={35}
                          >
                            {tasksChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ChartContainer>
                    )}
                  </div>
                  <Button 
                    className="w-full btn-brand" 
                    size="sm"
                    onClick={() => navigate('/intern/tasks')}
                  >
                    Voir Mes Tâches
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Présence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              {attendanceLoading ? (
                <p className="text-sm text-muted-foreground">Chargement...</p>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {attendanceRate}%
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {presentDays}/{totalDays} jours
                      </div>
                    </div>
                    {totalDays > 0 && (
                      <ChartContainer
                        config={{
                          present: { label: "Présent", color: "hsl(var(--success))" },
                          absent: { label: "Absent", color: "hsl(var(--destructive))" }
                        }}
                        className="h-[80px] w-[80px]"
                      >
                        <PieChart>
                          <Pie
                            data={attendanceChartData}
                            dataKey="value"
                            innerRadius={25}
                            outerRadius={35}
                          >
                            {attendanceChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ChartContainer>
                    )}
                  </div>
                  <Button 
                    className="w-full btn-brand" 
                    size="sm"
                    onClick={() => navigate('/intern/attendance')}
                  >
                    Voir Présence
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent attendance chart */}
        {recentAttendance.length > 0 && (
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Présence des 7 derniers jours</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  status: { label: "Présence", color: "hsl(var(--primary))" }
                }}
                className="h-[200px] w-full"
              >
                <BarChart data={recentAttendance}>
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis hide domain={[0, 1]} />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value) => [value === 1 ? 'Présent' : 'Absent', 'Statut']}
                  />
                  <Bar 
                    dataKey="status" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  const renderSupervisorDashboard = () => (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Tableau de Bord Superviseur</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Gérez vos stagiaires et leurs projets</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { title: "Stagiaires", value: mockStats.supervisor.totalInterns, icon: Users, color: "text-blue-600" },
          { title: "Thèmes Actifs", value: mockStats.supervisor.activeThemes, icon: BookOpen, color: "text-green-600" },
          { title: "Tâches en Attente", value: mockStats.supervisor.pendingTasks, icon: Clock, color: "text-warning" },
          { title: "Tâches Terminées", value: mockStats.supervisor.completedTasks, icon: CheckCircle, color: "text-success" }
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="card-gradient hover:shadow-brand transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-primary">{stat.value}</p>
                  </div>
                  <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const renderAdminDashboard = () => (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Tableau de Bord Administrateur</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Vue d'ensemble de la plateforme</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { title: "Utilisateurs Total", value: mockStats.admin.totalUsers, icon: Users, color: "text-blue-600" },
          { title: "Candidatures en Attente", value: mockStats.admin.pendingApplications, icon: FileText, color: "text-warning" },
          { title: "Stages Actifs", value: mockStats.admin.activeInternships, icon: TrendingUp, color: "text-success" },
          { title: "Taux de Réussite", value: `${mockStats.admin.completionRate}%`, icon: CheckCircle, color: "text-primary" }
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="card-gradient hover:shadow-brand transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-primary">{stat.value}</p>
                  </div>
                  <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const renderDashboardContent = () => {
    switch (user?.role) {
      case 'candidate':
        return renderCandidateDashboard()
      case 'intern':
        return renderInternDashboard()
      case 'supervisor':
        return renderSupervisorDashboard()
      case 'admin':
        return renderAdminDashboard()
      default:
        return renderCandidateDashboard()
    }
  }

  return (
    <div className="space-y-6">
      {renderDashboardContent()}
    </div>
  )
}