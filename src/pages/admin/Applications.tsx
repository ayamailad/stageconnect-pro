import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Search, Eye, Check, X, Clock, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { useApplications, type Application } from "@/hooks/use-applications"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function Applications() {
  const { 
    applications, 
    loading, 
    approveApplication, 
    rejectApplication, 
    scheduleInterview,
    deleteApplication,
    getApplicationStats 
  } = useApplications()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.candidate_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || app.status === selectedStatus
    const matchesDepartment = selectedDepartment === "all" || app.department === selectedDepartment
    return matchesSearch && matchesStatus && matchesDepartment
  })

  // Handle approve action
  const handleApprove = async (applicationId: string) => {
    setActionLoading(applicationId)
    await approveApplication(applicationId)
    setActionLoading(null)
  }

  // Handle reject action
  const handleReject = async (applicationId: string) => {
    setActionLoading(applicationId)
    await rejectApplication(applicationId)
    setActionLoading(null)
  }

  // Handle schedule interview action
  const handleScheduleInterview = async (applicationId: string) => {
    setActionLoading(applicationId)
    await scheduleInterview(applicationId)
    setActionLoading(null)
  }

  // Handle delete action
  const handleDelete = async (applicationId: string) => {
    setActionLoading(applicationId)
    await deleteApplication(applicationId)
    setActionLoading(null)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default'
      case 'rejected': return 'destructive'
      case 'interview': return 'secondary'
      case 'pending': return 'outline'
      default: return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Approuvée'
      case 'rejected': return 'Rejetée'
      case 'interview': return 'Entretien'
      case 'pending': return 'En attente'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <Check className="h-4 w-4" />
      case 'rejected': return <X className="h-4 w-4" />
      case 'interview': return <Eye className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const departments = [...new Set(applications.map(app => app.department))]
  const stats = getApplicationStats()

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-64 mt-2" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Candidatures</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Gérez les candidatures de stage</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Candidatures</CardTitle>
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">En attente</CardTitle>
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Approuvées</CardTitle>
            <Check className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Entretiens</CardTitle>
            <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{stats.interview}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des candidatures</CardTitle>
          <CardDescription>Recherchez et filtrez les candidatures</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, email ou poste..."
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
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="interview">Entretien</SelectItem>
                <SelectItem value="approved">Approuvée</SelectItem>
                <SelectItem value="rejected">Rejetée</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Département" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les départements</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px]">Candidat</TableHead>
                  <TableHead className="min-w-[150px]">Poste</TableHead>
                  <TableHead className="min-w-[120px] hidden lg:table-cell">Département</TableHead>
                  <TableHead className="min-w-[120px]">Statut</TableHead>
                  <TableHead className="min-w-[120px] hidden sm:table-cell">Date de soumission</TableHead>
                  <TableHead className="min-w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{application.candidate_name}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground break-all">{application.candidate_email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{application.position}</TableCell>
                    <TableCell className="hidden lg:table-cell">{application.department}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(application.status)} className="flex items-center gap-1 w-fit">
                        {getStatusIcon(application.status)}
                        <span className="hidden sm:inline">{getStatusLabel(application.status)}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{new Date(application.submitted_at).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedApplication(application)}>
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                              <span className="hidden sm:inline">Détails</span>
                            </Button>
                          </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Détails de la candidature</DialogTitle>
                            <DialogDescription>
                              Candidature de {selectedApplication?.candidate_name}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedApplication && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Nom du candidat</Label>
                                  <p className="text-sm font-medium">{selectedApplication.candidate_name}</p>
                                </div>
                                <div>
                                  <Label>Email</Label>
                                  <p className="text-sm">{selectedApplication.candidate_email}</p>
                                </div>
                                <div>
                                  <Label>Poste demandé</Label>
                                  <p className="text-sm font-medium">{selectedApplication.position}</p>
                                </div>
                                <div>
                                  <Label>Département</Label>
                                  <p className="text-sm">{selectedApplication.department}</p>
                                </div>
                              </div>
                              <div>
                                <Label>Expérience</Label>
                                <p className="text-sm mt-1">{selectedApplication.experience}</p>
                              </div>
                              <div>
                                <Label>Motivation</Label>
                                <p className="text-sm mt-1">{selectedApplication.motivation}</p>
                              </div>
                              <div className="flex gap-2 pt-4">
                                <Button 
                                  size="sm" 
                                  className="flex-1"
                                  disabled={selectedApplication.status !== 'pending' || actionLoading === selectedApplication.id}
                                  onClick={() => handleApprove(selectedApplication.id)}
                                >
                                  {actionLoading === selectedApplication.id ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                  ) : (
                                    <Check className="h-4 w-4 mr-2" />
                                  )}
                                  Approuver
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex-1"
                                  disabled={selectedApplication.status !== 'pending' || actionLoading === selectedApplication.id}
                                  onClick={() => handleScheduleInterview(selectedApplication.id)}
                                >
                                  {actionLoading === selectedApplication.id ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
                                  ) : (
                                    <Eye className="h-4 w-4 mr-2" />
                                  )}
                                  Programmer entretien
                                </Button>
                                <ConfirmationDialog
                                  title="Confirmer le rejet"
                                  description={`Êtes-vous sûr de vouloir rejeter la candidature de ${selectedApplication.candidate_name} ? Cette action ne peut pas être annulée.`}
                                  onConfirm={() => handleReject(selectedApplication.id)}
                                  isDestructive={true}
                                  triggerButton={
                                    <Button 
                                      variant="destructive" 
                                      size="sm" 
                                      className="flex-1"
                                      disabled={selectedApplication.status !== 'pending' || actionLoading === selectedApplication.id}
                                    >
                                      {actionLoading === selectedApplication.id ? (
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                      ) : (
                                        <X className="h-4 w-4 mr-2" />
                                      )}
                                      Rejeter
                                    </Button>
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </DialogContent>
                        </Dialog>
                        
                        {application.status === 'pending' && (
                            <ConfirmationDialog
                              title="Supprimer la candidature"
                              description={`Êtes-vous sûr de vouloir supprimer définitivement la candidature de ${application.candidate_name} ? Cette action ne peut pas être annulée.`}
                              onConfirm={() => handleDelete(application.id)}
                              isDestructive={true}
                              triggerButton={
                              <Button 
                                variant="outline" 
                                size="sm"
                                disabled={actionLoading === application.id}
                              >
                                {actionLoading === application.id ? (
                                  <div className="h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
                                ) : (
                                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                )}
                              </Button>
                            }
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}