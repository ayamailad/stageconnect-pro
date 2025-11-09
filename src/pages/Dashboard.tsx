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
import { useUsers } from "@/hooks/use-users"
import { useApplications } from "@/hooks/use-applications"
import { useInternships } from "@/hooks/use-internships"
import { useTasks } from "@/hooks/use-tasks"
import { useAttendance } from "@/hooks/use-attendance"
import { useThemes } from "@/hooks/use-themes"
import { useNavigate } from "react-router-dom"
import { useMemo } from "react"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { tasks, loading: tasksLoading } = useInternTasks()
  const { attendance, internship, loading: attendanceLoading } = useInternAttendance()
  const { users, loading: usersLoading } = useUsers()
  const { applications, loading: applicationsLoading, getApplicationStats } = useApplications()
  const { internships, loading: internshipsLoading } = useInternships()
  const { tasks: supervisorTasks, loading: supervisorTasksLoading } = useTasks()
  const { attendance: supervisorAttendance, interns, loading: supervisorAttendanceLoading } = useAttendance()
  const { themes, loading: themesLoading } = useThemes()

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

  const renderSupervisorDashboard = () => {
    const totalInterns = interns.length
    const activeThemes = themes.filter(t => t.status === 'active').length
    const pendingTasks = supervisorTasks.filter(t => t.status !== 'completed').length
    const completedTasks = supervisorTasks.filter(t => t.status === 'completed').length
    const totalTasks = supervisorTasks.length
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // Tasks chart data
    const tasksChartData = [
      { name: 'À faire', value: supervisorTasks.filter(t => t.status === 'todo').length, fill: 'hsl(var(--muted))' },
      { name: 'En cours', value: supervisorTasks.filter(t => t.status === 'in_progress').length, fill: 'hsl(var(--primary))' },
      { name: 'Terminées', value: completedTasks, fill: 'hsl(var(--success))' }
    ].filter(item => item.value > 0)

    // Themes chart data
    const themesChartData = [
      { name: 'Actif', value: themes.filter(t => t.status === 'active').length, fill: 'hsl(var(--success))' },
      { name: 'Inactif', value: themes.filter(t => t.status !== 'active').length, fill: 'hsl(var(--muted))' }
    ].filter(item => item.value > 0)

    // Attendance by intern
    const attendanceByIntern = useMemo(() => {
      return interns.slice(0, 5).map(intern => {
        const internAttendance = supervisorAttendance.filter(a => a.intern_id === intern.id)
        const presentCount = internAttendance.filter(a => a.status === 'present').length
        const totalCount = internAttendance.length
        const rate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0
        
        return {
          name: `${intern.first_name} ${intern.last_name}`,
          rate
        }
      })
    }, [interns, supervisorAttendance])

    // Absences by intern
    const absencesByIntern = useMemo(() => {
      return interns.slice(0, 5).map(intern => {
        const internAttendance = supervisorAttendance.filter(a => a.intern_id === intern.id)
        const absentCount = internAttendance.filter(a => a.status === 'absent').length
        
        return {
          name: `${intern.first_name} ${intern.last_name}`,
          absences: absentCount
        }
      }).filter(item => item.absences > 0)
    }, [interns, supervisorAttendance])

    return (
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Tableau de Bord Superviseur</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Gérez vos stagiaires et leurs projets</p>
        </div>

        {(supervisorTasksLoading || supervisorAttendanceLoading || themesLoading) ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { title: "Stagiaires", value: totalInterns, icon: Users, color: "text-blue-600" },
                { title: "Thèmes Actifs", value: activeThemes, icon: BookOpen, color: "text-green-600" },
                { title: "Tâches en Attente", value: pendingTasks, icon: Clock, color: "text-warning" },
                { title: "Tâches Terminées", value: completedTasks, icon: CheckCircle, color: "text-success" }
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

            {/* Charts section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Tasks breakdown chart */}
              {tasksChartData.length > 0 && (
                <Card className="card-gradient">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Tâches par Statut</CardTitle>
                    <CardDescription>
                      {completedTasks}/{totalTasks} tâches terminées ({completionRate}%)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        todo: { label: "À faire", color: "hsl(var(--muted))" },
                        in_progress: { label: "En cours", color: "hsl(var(--primary))" },
                        completed: { label: "Terminées", color: "hsl(var(--success))" }
                      }}
                      className="h-[250px] w-full"
                    >
                      <PieChart>
                        <Pie
                          data={tasksChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {tasksChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              )}

              {/* Absences by intern bar chart */}
              {absencesByIntern.length > 0 && (
                <Card className="card-gradient">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Absences des Stagiaires</CardTitle>
                    <CardDescription>Nombre d'absences par stagiaire</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        absences: { label: "Absences", color: "hsl(var(--destructive))" }
                      }}
                      className="h-[250px] w-full"
                    >
                      <BarChart data={absencesByIntern}>
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis />
                        <ChartTooltip 
                          content={<ChartTooltipContent />}
                          formatter={(value) => [`${value}`, 'Absences']}
                        />
                        <Bar 
                          dataKey="absences" 
                          fill="hsl(var(--destructive))" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </div>
    )
  }

  const renderAdminDashboard = () => {
    const applicationStats = getApplicationStats()
    const activeInternships = internships.filter(i => i.status === 'in_progress' || i.status === 'assigned').length
    const completedInternships = internships.filter(i => i.status === 'completed').length
    const completionRate = internships.length > 0 
      ? Math.round((completedInternships / internships.length) * 100) 
      : 0

    // Applications chart data
    const applicationsChartData = [
      { name: 'En attente', value: applicationStats.pending, fill: 'hsl(var(--warning))' },
      { name: 'Approuvées', value: applicationStats.approved, fill: 'hsl(var(--success))' },
      { name: 'Rejetées', value: applicationStats.rejected, fill: 'hsl(var(--destructive))' },
      { name: 'Entretien', value: applicationStats.interview, fill: 'hsl(var(--primary))' }
    ].filter(item => item.value > 0)

    // Internships chart data
    const internshipsChartData = [
      { name: 'Disponible', value: internships.filter(i => i.status === 'available').length, fill: 'hsl(var(--muted))' },
      { name: 'Assigné', value: internships.filter(i => i.status === 'assigned').length, fill: 'hsl(var(--primary))' },
      { name: 'En cours', value: internships.filter(i => i.status === 'in_progress').length, fill: 'hsl(var(--success))' },
      { name: 'Terminé', value: completedInternships, fill: 'hsl(var(--secondary))' }
    ].filter(item => item.value > 0)

    return (
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Tableau de Bord Administrateur</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Vue d'ensemble de la plateforme</p>
        </div>

        {(usersLoading || applicationsLoading || internshipsLoading) ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { title: "Utilisateurs Total", value: users.length, icon: Users, color: "text-blue-600" },
                { title: "Candidatures en Attente", value: applicationStats.pending, icon: FileText, color: "text-warning" },
                { title: "Stages Actifs", value: activeInternships, icon: TrendingUp, color: "text-success" },
                { title: "Taux de Réussite", value: `${completionRate}%`, icon: CheckCircle, color: "text-primary" }
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

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Applications Chart */}
              {applicationsChartData.length > 0 && (
                <Card className="card-gradient">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Répartition des Candidatures</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Total: {applicationStats.total} candidatures
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        pending: { label: "En attente", color: "hsl(var(--warning))" },
                        approved: { label: "Approuvées", color: "hsl(var(--success))" },
                        rejected: { label: "Rejetées", color: "hsl(var(--destructive))" },
                        interview: { label: "Entretien", color: "hsl(var(--primary))" }
                      }}
                      className="h-[250px] w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={applicationsChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {applicationsChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              )}

              {/* Internships Chart */}
              {internshipsChartData.length > 0 && (
                <Card className="card-gradient">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Répartition des Stages</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Total: {internships.length} stages
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        available: { label: "Disponible", color: "hsl(var(--muted))" },
                        assigned: { label: "Assigné", color: "hsl(var(--primary))" },
                        in_progress: { label: "En cours", color: "hsl(var(--success))" },
                        completed: { label: "Terminé", color: "hsl(var(--secondary))" }
                      }}
                      className="h-[250px] w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={internshipsChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {internshipsChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Users by Role Chart */}
            {users.length > 0 && (
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Utilisateurs par Rôle</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Distribution des {users.length} utilisateurs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      count: { label: "Nombre", color: "hsl(var(--primary))" }
                    }}
                    className="h-[250px] w-full"
                  >
                    <BarChart data={[
                      { role: 'Admin', count: users.filter(u => u.role === 'admin').length },
                      { role: 'Superviseur', count: users.filter(u => u.role === 'supervisor').length },
                      { role: 'Stagiaire', count: users.filter(u => u.role === 'intern').length },
                      { role: 'Candidat', count: users.filter(u => u.role === 'candidate').length }
                    ]}>
                      <XAxis dataKey="role" tick={{ fontSize: 12 }} />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    )
  }

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