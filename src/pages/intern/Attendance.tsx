import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Clock, Calendar as CalendarIcon, CheckCircle, AlertCircle } from "lucide-react"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay, parseISO, isWithinInterval } from "date-fns"
import { fr } from "date-fns/locale"
import { useInternAttendance } from "@/hooks/use-intern-attendance"
import { Skeleton } from "@/components/ui/skeleton"

export default function InternAttendance() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const { attendance, internship, loading } = useInternAttendance()

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Check if date is within internship period
  const isInInternshipPeriod = (date: Date) => {
    if (!internship) return false
    const start = parseISO(internship.start_date)
    const end = parseISO(internship.end_date)
    return isWithinInterval(date, { start, end })
  }

  // Get attendance for a specific date
  const getAttendanceForDate = (date: Date) => {
    return attendance.find(att => 
      isSameDay(parseISO(att.date), date)
    )
  }

  // Calculate weekly stats
  const weeklyStats = useMemo(() => {
    if (!internship) return null
    
    const weekAttendance = attendance.filter(att => {
      const attDate = parseISO(att.date)
      return isWithinInterval(attDate, { start: weekStart, end: weekEnd })
    })

    const presentDays = weekAttendance.filter(att => att.status === 'present').length
    const workDays = weekDays.filter(day => {
      const isWeekend = day.getDay() === 0 || day.getDay() === 6
      return !isWeekend && isInInternshipPeriod(day)
    }).length

    let totalHours = 0
    weekAttendance.forEach(att => {
      if (att.check_in_time && att.check_out_time) {
        const checkIn = new Date(`2000-01-01T${att.check_in_time}`)
        const checkOut = new Date(`2000-01-01T${att.check_out_time}`)
        const hours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60)
        totalHours += hours
      }
    })

    return {
      hoursWorked: totalHours,
      expectedHours: workDays * 7, // Assuming 7 hours per day
      presentDays,
      totalDays: workDays,
      attendanceRate: workDays > 0 ? Math.round((presentDays / workDays) * 100) : 0
    }
  }, [attendance, weekStart, weekEnd, weekDays, internship])

  const formatTime = (hours: number) => {
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return `${h}h ${m.toString().padStart(2, '0')}`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Présent</Badge>
      case "absent":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Absent</Badge>
      case "late":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Retard</Badge>
      case "justified":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Justifié</Badge>
      default:
        return <Badge variant="outline">-</Badge>
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  if (!internship) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Pointage</h1>
          <p className="text-muted-foreground">Consultez vos présences durant votre stage</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun stage assigné</h3>
              <p className="text-muted-foreground">
                Vous n'avez pas encore de stage assigné. Veuillez contacter votre superviseur.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pointage</h1>
          <p className="text-muted-foreground">Consultez vos présences durant votre stage</p>
          {internship && (
            <p className="text-sm text-muted-foreground mt-1">
              Période: {format(parseISO(internship.start_date), "dd MMM yyyy", { locale: fr })} - {format(parseISO(internship.end_date), "dd MMM yyyy", { locale: fr })}
            </p>
          )}
        </div>
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
              const attRecord = getAttendanceForDate(day)
              const isWeekend = day.getDay() === 0 || day.getDay() === 6
              const inPeriod = isInInternshipPeriod(day)
              
              let dailyHours = 0
              if (attRecord?.check_in_time && attRecord?.check_out_time) {
                const checkIn = new Date(`2000-01-01T${attRecord.check_in_time}`)
                const checkOut = new Date(`2000-01-01T${attRecord.check_out_time}`)
                dailyHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60)
              }
              
              return (
                <div 
                  key={day.toISOString()} 
                  className={`p-4 border rounded-lg ${isToday(day) ? 'border-primary bg-primary/5' : ''} ${isWeekend || !inPeriod ? 'bg-muted/30' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="min-w-0">
                        <h4 className="font-medium capitalize">
                          {format(day, "EEEE dd MMM", { locale: fr })}
                          {isToday(day) && <span className="text-primary ml-2">(Aujourd'hui)</span>}
                        </h4>
                        {isWeekend && <p className="text-sm text-muted-foreground">Week-end</p>}
                        {!inPeriod && !isWeekend && <p className="text-sm text-muted-foreground">Hors période de stage</p>}
                      </div>
                      
                      {!isWeekend && inPeriod && (
                        <>
                          {attRecord ? getStatusBadge(attRecord.status) : <Badge variant="outline">Non pointé</Badge>}
                          
                          {attRecord && (
                            <div className="flex items-center gap-4 text-sm flex-wrap">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {attRecord.check_in_time && attRecord.check_out_time ? (
                                  <span>{attRecord.check_in_time.substring(0, 5)} - {attRecord.check_out_time.substring(0, 5)}</span>
                                ) : (
                                  <span>-</span>
                                )}
                              </div>
                              
                              {dailyHours > 0 && (
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">{formatTime(dailyHours)}</span>
                                </div>
                              )}
                              
                              {attRecord.notes && (
                                <div className="text-muted-foreground">
                                  {attRecord.notes}
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
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
            className="rounded-md border pointer-events-auto"
            locale={fr}
            disabled={(date) => !isInInternshipPeriod(date)}
            modifiers={{
              present: (date) => {
                const att = getAttendanceForDate(date)
                return att?.status === "present"
              },
              absent: (date) => {
                const att = getAttendanceForDate(date)
                return att?.status === "absent"
              },
              late: (date) => {
                const att = getAttendanceForDate(date)
                return att?.status === "late"
              },
              justified: (date) => {
                const att = getAttendanceForDate(date)
                return att?.status === "justified"
              }
            }}
            modifiersClassNames={{
              present: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
              absent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
              late: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
              justified: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}