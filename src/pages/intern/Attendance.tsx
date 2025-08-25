import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Clock, Calendar as CalendarIcon, CheckCircle, XCircle, Plus, Download } from "lucide-react"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay } from "date-fns"
import { fr } from "date-fns/locale"

// Mock data
const attendanceData = [
  { date: "2024-01-08", checkIn: "08:30", checkOut: "17:00", break: 60, status: "Présent", note: "" },
  { date: "2024-01-09", checkIn: "08:45", checkOut: "17:15", break: 60, status: "Présent", note: "Réunion projet" },
  { date: "2024-01-10", checkIn: "09:00", checkOut: "17:00", break: 45, status: "Présent", note: "" },
  { date: "2024-01-11", checkIn: "", checkOut: "", break: 0, status: "Absent", note: "Maladie" },
  { date: "2024-01-12", checkIn: "08:30", checkOut: "16:30", break: 60, status: "Présent", note: "Départ anticipé - formation" }
]

const weeklyStats = {
  hoursWorked: 31.5,
  expectedHours: 35,
  presentDays: 4,
  totalDays: 5,
  averageArrival: "08:41"
}

export default function InternAttendance() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [newAttendanceDialog, setNewAttendanceDialog] = useState(false)
  const [newAttendance, setNewAttendance] = useState({
    date: new Date(),
    checkIn: "",
    checkOut: "",
    break: 60,
    note: ""
  })

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const getAttendanceForDate = (date: Date) => {
    return attendanceData.find(att => 
      isSameDay(new Date(att.date), date)
    )
  }

  const calculateDailyHours = (checkIn: string, checkOut: string, breakMinutes: number) => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(`2024-01-01T${checkIn}:00`)
    const end = new Date(`2024-01-01T${checkOut}:00`)
    const totalMinutes = (end.getTime() - start.getTime()) / (1000 * 60) - breakMinutes
    return totalMinutes / 60
  }

  const formatTime = (hours: number) => {
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return `${h}h ${m}m`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Présent":
        return <Badge className="bg-green-100 text-green-800">Présent</Badge>
      case "Absent":
        return <Badge className="bg-red-100 text-red-800">Absent</Badge>
      case "Retard":
        return <Badge className="bg-yellow-100 text-yellow-800">Retard</Badge>
      default:
        return <Badge variant="outline">-</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pointage</h1>
          <p className="text-muted-foreground">Gérez vos heures de présence et suivez votre assiduité</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Dialog open={newAttendanceDialog} onOpenChange={setNewAttendanceDialog}>
            <DialogTrigger asChild>
              <Button className="btn-brand">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter Pointage
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un pointage</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(newAttendance.date, "PPP", { locale: fr })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newAttendance.date}
                        onSelect={(date) => date && setNewAttendance({...newAttendance, date})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Arrivée</Label>
                    <Input
                      type="time"
                      value={newAttendance.checkIn}
                      onChange={(e) => setNewAttendance({...newAttendance, checkIn: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Départ</Label>
                    <Input
                      type="time"
                      value={newAttendance.checkOut}
                      onChange={(e) => setNewAttendance({...newAttendance, checkOut: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label>Pause (minutes)</Label>
                  <Input
                    type="number"
                    value={newAttendance.break}
                    onChange={(e) => setNewAttendance({...newAttendance, break: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Note</Label>
                  <Textarea
                    value={newAttendance.note}
                    onChange={(e) => setNewAttendance({...newAttendance, note: e.target.value})}
                    placeholder="Note optionnelle..."
                  />
                </div>
                <Button onClick={() => setNewAttendanceDialog(false)} className="w-full btn-brand">
                  Enregistrer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Weekly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Heures cette semaine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(weeklyStats.hoursWorked)}</div>
            <div className="text-sm text-muted-foreground">/ {formatTime(weeklyStats.expectedHours)} attendues</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Jours présents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyStats.presentDays}</div>
            <div className="text-sm text-muted-foreground">/ {weeklyStats.totalDays} jours</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Assiduité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((weeklyStats.presentDays / weeklyStats.totalDays) * 100)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Arrivée moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyStats.averageArrival}</div>
          </CardContent>
        </Card>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Semaine du {format(weekStart, "dd MMM", { locale: fr })} au {format(weekEnd, "dd MMM yyyy", { locale: fr })}</CardTitle>
              <CardDescription>Consultez et modifiez vos heures de pointage</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setCurrentWeek(new Date(currentWeek.getTime() - 7 * 24 * 60 * 60 * 1000))}
              >
                ← Semaine précédente
              </Button>
              <Button 
                variant="outline"
                onClick={() => setCurrentWeek(new Date())}
              >
                Aujourd'hui
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setCurrentWeek(new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000))}
              >
                Semaine suivante →
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weekDays.map((day) => {
              const attendance = getAttendanceForDate(day)
              const isWeekend = day.getDay() === 0 || day.getDay() === 6
              const dailyHours = attendance ? calculateDailyHours(attendance.checkIn, attendance.checkOut, attendance.break) : 0
              
              return (
                <div 
                  key={day.toISOString()} 
                  className={`p-4 border rounded-lg ${isToday(day) ? 'border-primary bg-primary/5' : ''} ${isWeekend ? 'bg-gray-50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="min-w-0">
                        <h4 className="font-medium">
                          {format(day, "EEEE dd MMM", { locale: fr })}
                          {isToday(day) && <span className="text-primary ml-2">(Aujourd'hui)</span>}
                        </h4>
                        {isWeekend && <p className="text-sm text-muted-foreground">Week-end</p>}
                      </div>
                      
                      {!isWeekend && (
                        <>
                          {attendance ? getStatusBadge(attendance.status) : <Badge variant="outline">Non renseigné</Badge>}
                          
                          {attendance && (
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {attendance.checkIn && attendance.checkOut ? (
                                  <span>{attendance.checkIn} - {attendance.checkOut}</span>
                                ) : (
                                  <span>-</span>
                                )}
                              </div>
                              
                              {dailyHours > 0 && (
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">{formatTime(dailyHours)}</span>
                                </div>
                              )}
                              
                              {attendance.note && (
                                <div className="text-muted-foreground">
                                  {attendance.note}
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    {!isWeekend && (
                      <Button variant="outline" size="sm">
                        {attendance ? "Modifier" : "Ajouter"}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle>Vue mensuelle</CardTitle>
          <CardDescription>Aperçu de votre assiduité sur le mois</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
            components={{
              Day: ({ date, ...props }) => {
                const attendance = getAttendanceForDate(date)
                const hasAttendance = !!attendance
                const isPresent = attendance?.status === "Présent"
                
                return (
                  <div className="relative">
                    <button
                      {...props}
                      className={`
                        w-full h-full p-2 text-center rounded
                        ${hasAttendance ? (isPresent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800') : ''}
                        ${isToday(date) ? 'ring-2 ring-primary' : ''}
                        hover:bg-muted
                      `}
                    >
                      {date.getDate()}
                    </button>
                    {hasAttendance && (
                      <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${isPresent ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    )}
                  </div>
                )
              }
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}