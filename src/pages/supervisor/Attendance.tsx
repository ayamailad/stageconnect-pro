import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Calendar as CalendarIcon, Search, Clock, CheckCircle, AlertCircle, UserCheck } from "lucide-react"

interface AttendanceRecord {
  id: string
  internName: string
  date: string
  checkIn: string | null
  checkOut: string | null
  status: 'present' | 'late' | 'absent' | 'half_day'
  workHours: number
  notes?: string
}

const mockAttendance: AttendanceRecord[] = [
  // Today's records (2024-08-26)
  {
    id: "1",
    internName: "Emma Dubois",
    date: "2024-08-26",
    checkIn: "08:30",
    checkOut: "17:00",
    status: "present",
    workHours: 8.5,
    notes: ""
  },
  {
    id: "2",
    internName: "Thomas Martin",
    date: "2024-08-26",
    checkIn: "09:15",
    checkOut: "17:00",
    status: "late",
    workHours: 7.75,
    notes: "Retard transport en commun"
  },
  {
    id: "3",
    internName: "Marie Bernard",
    date: "2024-08-26",
    checkIn: null,
    checkOut: null,
    status: "absent",
    workHours: 0,
    notes: "Maladie - certificat médical fourni"
  },
  {
    id: "4",
    internName: "Lucas Petit",
    date: "2024-08-26",
    checkIn: "08:45",
    checkOut: "12:30",
    status: "half_day",
    workHours: 3.75,
    notes: "Formation externe l'après-midi"
  },
  {
    id: "5",
    internName: "Sophie Moreau",
    date: "2024-08-26",
    checkIn: "08:30",
    checkOut: "17:30",
    status: "present",
    workHours: 9,
    notes: "Heures supplémentaires pour finir projet"
  },
  {
    id: "6",
    internName: "Antoine Rousseau",
    date: "2024-08-26",
    checkIn: "08:00",
    checkOut: "17:00",
    status: "present",
    workHours: 9,
    notes: ""
  },
  {
    id: "7",
    internName: "Clara Durand",
    date: "2024-08-26",
    checkIn: "09:30",
    checkOut: "17:00",
    status: "late",
    workHours: 7.5,
    notes: "Problème de transport"
  },
  // Yesterday's records (2024-08-25)
  {
    id: "8",
    internName: "Emma Dubois",
    date: "2024-08-25",
    checkIn: "08:45",
    checkOut: "17:15",
    status: "present",
    workHours: 8.5,
    notes: ""
  },
  {
    id: "9",
    internName: "Thomas Martin",
    date: "2024-08-25",
    checkIn: "08:30",
    checkOut: "12:30",
    status: "half_day",
    workHours: 4,
    notes: "Rendez-vous médical après-midi"
  },
  {
    id: "10",
    internName: "Marie Bernard",
    date: "2024-08-25",
    checkIn: "08:30",
    checkOut: "17:00",
    status: "present",
    workHours: 8.5,
    notes: ""
  },
  {
    id: "11",
    internName: "Lucas Petit",
    date: "2024-08-25",
    checkIn: "08:30",
    checkOut: "17:00",
    status: "present",
    workHours: 8.5,
    notes: ""
  },
  {
    id: "12",
    internName: "Sophie Moreau",
    date: "2024-08-25",
    checkIn: "08:15",
    checkOut: "17:00",
    status: "present",
    workHours: 8.75,
    notes: ""
  },
  {
    id: "13",
    internName: "Antoine Rousseau",
    date: "2024-08-25",
    checkIn: "09:00",
    checkOut: "17:00",
    status: "late",
    workHours: 8,
    notes: "Embouteillages"
  },
  {
    id: "14",
    internName: "Clara Durand",
    date: "2024-08-25",
    checkIn: "08:30",
    checkOut: "17:00",
    status: "present",
    workHours: 8.5,
    notes: ""
  },
  // Friday's records (2024-08-23)
  {
    id: "15",
    internName: "Emma Dubois",
    date: "2024-08-23",
    checkIn: "08:30",
    checkOut: "16:30",
    status: "present",
    workHours: 8,
    notes: "Départ anticipé autorisé"
  },
  {
    id: "16",
    internName: "Thomas Martin",
    date: "2024-08-23",
    checkIn: "08:30",
    checkOut: "17:00",
    status: "present",
    workHours: 8.5,
    notes: ""
  },
  {
    id: "17",
    internName: "Marie Bernard",
    date: "2024-08-23",
    checkIn: "08:30",
    checkOut: "17:00",
    status: "present",
    workHours: 8.5,
    notes: ""
  },
  {
    id: "18",
    internName: "Lucas Petit",
    date: "2024-08-23",
    checkIn: null,
    checkOut: null,
    status: "absent",
    workHours: 0,
    notes: "Congé personnel autorisé"
  },
  {
    id: "19",
    internName: "Sophie Moreau",
    date: "2024-08-23",
    checkIn: "08:30",
    checkOut: "17:00",
    status: "present",
    workHours: 8.5,
    notes: ""
  },
  {
    id: "20",
    internName: "Antoine Rousseau",
    date: "2024-08-23",
    checkIn: "08:45",
    checkOut: "17:00",
    status: "present",
    workHours: 8.25,
    notes: ""
  },
  {
    id: "21",
    internName: "Clara Durand",
    date: "2024-08-23",
    checkIn: "09:45",
    checkOut: "17:00",
    status: "late",
    workHours: 7.25,
    notes: "Panne de réveil"
  },
  // Thursday's records (2024-08-22)
  {
    id: "22",
    internName: "Emma Dubois",
    date: "2024-08-22",
    checkIn: "08:30",
    checkOut: "17:00",
    status: "present",
    workHours: 8.5,
    notes: ""
  },
  {
    id: "23",
    internName: "Thomas Martin",
    date: "2024-08-22",
    checkIn: "08:30",
    checkOut: "17:00",
    status: "present",
    workHours: 8.5,
    notes: ""
  },
  {
    id: "24",
    internName: "Marie Bernard",
    date: "2024-08-22",
    checkIn: "08:15",
    checkOut: "17:00",
    status: "present",
    workHours: 8.75,
    notes: ""
  },
  {
    id: "25",
    internName: "Lucas Petit",
    date: "2024-08-22",
    checkIn: "08:30",
    checkOut: "17:00",
    status: "present",
    workHours: 8.5,
    notes: ""
  },
  {
    id: "26",
    internName: "Sophie Moreau",
    date: "2024-08-22",
    checkIn: "08:30",
    checkOut: "13:00",
    status: "half_day",
    workHours: 4.5,
    notes: "Formation externe après-midi"
  },
  {
    id: "27",
    internName: "Antoine Rousseau",
    date: "2024-08-22",
    checkIn: "08:30",
    checkOut: "17:00",
    status: "present",
    workHours: 8.5,
    notes: ""
  },
  {
    id: "28",
    internName: "Clara Durand",
    date: "2024-08-22",
    checkIn: "08:30",
    checkOut: "17:00",
    status: "present",
    workHours: 8.5,
    notes: ""
  }
]

export default function Attendance() {
  const [attendance] = useState<AttendanceRecord[]>(mockAttendance)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])

  const filteredAttendance = attendance.filter(record => {
    const matchesSearch = record.internName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || record.status === selectedStatus
    const matchesDate = selectedDate === "" || record.date === selectedDate
    return matchesSearch && matchesStatus && matchesDate
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'present': return 'default'
      case 'late': return 'secondary'
      case 'half_day': return 'outline'
      case 'absent': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present': return 'Présent'
      case 'late': return 'En retard'
      case 'half_day': return 'Demi-journée'
      case 'absent': return 'Absent'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4" />
      case 'late': return <Clock className="h-4 w-4" />
      case 'half_day': return <AlertCircle className="h-4 w-4" />
      case 'absent': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  // Calculate stats for today
  const todayRecords = attendance.filter(record => record.date === new Date().toISOString().split('T')[0])
  const presentToday = todayRecords.filter(record => record.status === 'present' || record.status === 'late').length
  const absentToday = todayRecords.filter(record => record.status === 'absent').length
  const lateToday = todayRecords.filter(record => record.status === 'late').length

  // Calculate weekly stats
  const getWeekStart = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff))
  }

  const weekStart = getWeekStart(new Date())
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)

  const weekRecords = attendance.filter(record => {
    const recordDate = new Date(record.date)
    return recordDate >= weekStart && recordDate <= weekEnd
  })

  const averageHoursThisWeek = weekRecords.length > 0 
    ? weekRecords.reduce((sum, record) => sum + record.workHours, 0) / weekRecords.length
    : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Présences</h1>
          <p className="text-muted-foreground">Suivez les présences et horaires des stagiaires</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Présents aujourd'hui</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{presentToday}</div>
            <p className="text-xs text-muted-foreground">
              sur {todayRecords.length} stagiaires
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absents aujourd'hui</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{absentToday}</div>
            <p className="text-xs text-muted-foreground">
              {((absentToday / Math.max(todayRecords.length, 1)) * 100).toFixed(0)}% du total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retards aujourd'hui</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lateToday}</div>
            <p className="text-xs text-muted-foreground">
              {((lateToday / Math.max(todayRecords.length, 1)) * 100).toFixed(0)}% du total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures moy./semaine</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageHoursThisWeek.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">
              Cette semaine
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Registre des présences</CardTitle>
          <CardDescription>Consultez et gérez les présences quotidiennes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom de stagiaire..."
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
                <SelectItem value="present">Présent</SelectItem>
                <SelectItem value="late">En retard</SelectItem>
                <SelectItem value="half_day">Demi-journée</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
              </SelectContent>
            </Select>
            <DatePicker
              date={selectedDate ? new Date(selectedDate) : undefined}
              onSelect={(date) => setSelectedDate(date ? date.toISOString().split('T')[0] : '')}
              placeholder="Sélectionner une date"
              className="w-full sm:w-[200px]"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stagiaire</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Arrivée</TableHead>
                <TableHead>Départ</TableHead>
                <TableHead>Heures travaillées</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.internName}</TableCell>
                  <TableCell>{new Date(record.date).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>
                    {record.checkIn ? (
                      <span className={record.status === 'late' ? "text-orange-600 font-medium" : ""}>
                        {record.checkIn}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {record.checkOut ? (
                      <span>{record.checkOut}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{record.workHours}h</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(record.status)} className="flex items-center gap-1 w-fit">
                      {getStatusIcon(record.status)}
                      {getStatusLabel(record.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {record.notes ? (
                      <span className="text-sm">{record.notes}</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
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