import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Calendar as CalendarIcon, Search, Clock, CheckCircle, AlertCircle, UserCheck, Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { useAttendance } from "@/hooks/use-attendance"
import { useToast } from "@/hooks/use-toast"

export default function Attendance() {
  const { attendance, interns, loading, createAttendance, updateAttendance, deleteAttendance } = useAttendance()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [formData, setFormData] = useState({
    intern_id: "",
    date: undefined as Date | undefined,
    status: "present",
    notes: ""
  })

  const filteredAttendance = attendance.filter(record => {
    const internName = record.intern ? `${record.intern.first_name} ${record.intern.last_name}` : ""
    const matchesSearch = internName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || record.status === selectedStatus
    const matchesDate = selectedDate === "" || record.date === selectedDate
    return matchesSearch && matchesStatus && matchesDate
  })

  const handleCreateAttendance = async () => {
    if (!formData.intern_id || !formData.date) {
      return
    }

    // Validate date is not in the future
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selectedDate = new Date(formData.date)
    selectedDate.setHours(0, 0, 0, 0)
    
    if (selectedDate > today) {
      toast({
        title: "Erreur",
        description: "Vous ne pouvez pas enregistrer une présence pour une date future",
        variant: "destructive"
      })
      return
    }

    // Validate not weekend
    const dayOfWeek = selectedDate.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      toast({
        title: "Erreur",
        description: "Vous ne pouvez pas enregistrer une présence le weekend",
        variant: "destructive"
      })
      return
    }

    // Validate date is within internship period
    const intern = interns.find(i => i.id === formData.intern_id)
    if (intern?.internship) {
      const date = formData.date
      const startDate = new Date(intern.internship.start_date)
      const endDate = new Date(intern.internship.end_date)
      
      if (date < startDate || date > endDate) {
        toast({
          title: "Erreur",
          description: "La date doit être dans la période du stage",
          variant: "destructive"
        })
        return
      }
    }

    const success = await createAttendance({
      intern_id: formData.intern_id,
      date: formData.date,
      status: formData.status,
      notes: formData.notes || undefined
    })

    if (success) {
      setIsCreateDialogOpen(false)
      resetForm()
    }
  }

  const handleEditAttendance = async () => {
    if (!selectedRecord) return

    const success = await updateAttendance(selectedRecord.id, {
      status: formData.status,
      notes: formData.notes || null
    })

    if (success) {
      setIsEditDialogOpen(false)
      setSelectedRecord(null)
      resetForm()
    }
  }

  const handleDeleteAttendance = async (id: string) => {
    await deleteAttendance(id)
  }

  const openEditDialog = (record: any) => {
    setSelectedRecord(record)
    setFormData({
      intern_id: record.intern_id,
      date: new Date(record.date),
      status: record.status,
      notes: record.notes || ""
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      intern_id: "",
      date: undefined,
      status: "present",
      notes: ""
    })
  }

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
          <h1 className="text-3xl font-bold">Présences</h1>
          <p className="text-muted-foreground">Suivez les présences et horaires des stagiaires</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Enregistrer une présence
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Enregistrer une présence</DialogTitle>
              <DialogDescription>
                Enregistrez la présence d'un stagiaire pour une date donnée
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="intern">Stagiaire</Label>
                  <Select value={formData.intern_id} onValueChange={(value) => setFormData({ ...formData, intern_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un stagiaire" />
                    </SelectTrigger>
                      <SelectContent>
                        {interns.map((intern) => (
                          <SelectItem key={intern.id} value={intern.id}>
                            <div className="flex flex-col">
                              <span>{intern.first_name} {intern.last_name}</span>
                              {intern.internship && (
                                <div className="text-xs text-muted-foreground">
                                  {intern.internship.theme && (
                                    <div className="truncate max-w-[300px]">Thème: {intern.internship.theme.description}</div>
                                  )}
                                  <div>
                                    {new Date(intern.internship.start_date).toLocaleDateString('fr-FR')} - {new Date(intern.internship.end_date).toLocaleDateString('fr-FR')}
                                  </div>
                                </div>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                  </Select>
                  {formData.intern_id && (() => {
                    const intern = interns.find(i => i.id === formData.intern_id)
                    if (intern?.internship) {
                      return (
                        <p className="text-sm text-muted-foreground mt-1">
                          Période: {new Date(intern.internship.start_date).toLocaleDateString('fr-FR')} - {new Date(intern.internship.end_date).toLocaleDateString('fr-FR')}
                        </p>
                      )
                    }
                  })()}
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <DatePicker
                    date={formData.date}
                    onSelect={(date) => setFormData({ ...formData, date })}
                    placeholder="Sélectionner la date"
                    disabledDates={(date) => {
                      // Block future dates
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      if (date > today) return true

                      // Block weekends (Saturday = 6, Sunday = 0)
                      const dayOfWeek = date.getDay()
                      if (dayOfWeek === 0 || dayOfWeek === 6) return true

                      // Block dates outside internship period
                      if (formData.intern_id) {
                        const intern = interns.find(i => i.id === formData.intern_id)
                        if (intern?.internship) {
                          const startDate = new Date(intern.internship.start_date)
                          const endDate = new Date(intern.internship.end_date)
                          startDate.setHours(0, 0, 0, 0)
                          endDate.setHours(0, 0, 0, 0)
                          return date < startDate || date > endDate
                        }
                      }
                      return false
                    }}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Statut</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Présent</SelectItem>
                    <SelectItem value="late">En retard</SelectItem>
                    <SelectItem value="half_day">Demi-journée</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Notes additionnelles..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <Button className="w-full" onClick={handleCreateAttendance} disabled={!formData.intern_id || !formData.date}>
                Enregistrer la présence
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier la présence</DialogTitle>
              <DialogDescription>
                Modifiez les détails de la présence
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Stagiaire</Label>
                <Input
                  value={selectedRecord?.intern ? `${selectedRecord.intern.first_name} ${selectedRecord.intern.last_name}` : ""}
                  disabled
                />
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  value={selectedRecord?.date ? new Date(selectedRecord.date).toLocaleDateString('fr-FR') : ""}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="edit_status">Statut</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Présent</SelectItem>
                    <SelectItem value="late">En retard</SelectItem>
                    <SelectItem value="half_day">Demi-journée</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit_notes">Notes</Label>
                <Textarea
                  id="edit_notes"
                  placeholder="Notes additionnelles..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <Button className="w-full" onClick={handleEditAttendance}>
                Modifier la présence
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
              {todayRecords.length > 0 ? ((absentToday / todayRecords.length) * 100).toFixed(0) : 0}% du total
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
              {todayRecords.length > 0 ? ((lateToday / todayRecords.length) * 100).toFixed(0) : 0}% du total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total stagiaires</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interns.length}</div>
            <p className="text-xs text-muted-foreground">
              En stage actuellement
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
              disabledDates={(date) => {
                // Block future dates
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                return date > today
              }}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stagiaire</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendance.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    Aucune présence trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredAttendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {record.intern ? `${record.intern.first_name} ${record.intern.last_name}` : "N/A"}
                    </TableCell>
                    <TableCell>{new Date(record.date).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(record.status)} className="flex items-center gap-1 w-fit">
                        {getStatusIcon(record.status)}
                        {getStatusLabel(record.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate">
                        {record.notes || <span className="text-muted-foreground">-</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(record)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <ConfirmationDialog
                          title="Supprimer la présence"
                          description="Êtes-vous sûr de vouloir supprimer cette présence ? Cette action est irréversible."
                          onConfirm={() => handleDeleteAttendance(record.id)}
                          triggerButton={
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
