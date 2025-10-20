import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users as UsersIcon, UserPlus, Search, Edit, Trash2, Loader2 } from "lucide-react"
import { useUsers } from "@/hooks/use-users"
import { UserForm } from "@/components/forms/user-form"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import type { User } from "@/hooks/use-users"

export default function Users() {
  const { users, loading, createUser, updateUser, deleteUser } = useUsers()

  // Filtres
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("all")

  // Dialogs
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1) // pages 1-based
  const [pageSize, setPageSize] = useState(5)

  // Filtrage mémoïsé
  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return users.filter((user) => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase()
      const matchesSearch =
        fullName.includes(term) || user.email.toLowerCase().includes(term)
      const matchesRole = selectedRole === "all" || user.role === selectedRole
      return matchesSearch && matchesRole
    })
  }, [users, searchTerm, selectedRole])

  // Recalage de la page en cas de changement des filtres ou du pageSize
  const totalItems = filteredUsers.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  if (currentPage > totalPages) {
    // Si on filtre et que la page courante dépasse, on revient à la dernière page disponible
    setCurrentPage(totalPages)
  }

  const firstIndex = (currentPage - 1) * pageSize
  const lastIndex = firstIndex + pageSize
  const pageItems = filteredUsers.slice(firstIndex, lastIndex)

  const canPrevious = currentPage > 1
  const canNext = currentPage < totalPages

  const handleCreateUser = async (userData: any) => {
    const success = await createUser(userData)
    if (success) {
      setShowCreateDialog(false)
      // Optionnel: revenir page 1 pour voir les nouveaux éléments
      setCurrentPage(1)
    }
    return success
  }

  const handleUpdateUser = async (userData: any) => {
    if (!editingUser) return false
    const success = await updateUser(editingUser.id, userData)
    if (success) {
      setEditingUser(null)
    }
    return success
  }

  const handleDeleteUser = async () => {
    if (!deletingUser) return
    try {
      setIsDeleting(true)
      const success = await deleteUser(deletingUser.id)
      if (success) {
        setDeletingUser(null)
        // Si on supprime le dernier élément de la dernière page, on recale la page
        const newTotal = totalItems - 1
        const newTotalPages = Math.max(1, Math.ceil(newTotal / pageSize))
        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages)
        }
      }
    } finally {
      setIsDeleting(false)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "supervisor":
        return "default"
      case "intern":
        return "secondary"
      case "candidate":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrateur"
      case "supervisor":
        return "Superviseur"
      case "intern":
        return "Stagiaire"
      case "candidate":
        return "Candidat"
      default:
        return role
    }
  }

  const getRoleStats = (role: string) => {
    return users.filter((u) => u.role === role).length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Chargement des utilisateurs...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Utilisateurs</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Gérez les utilisateurs du système
          </p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <UserPlus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Ajouter un utilisateur</span>
              <span className="sm:hidden">Ajouter</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter un utilisateur</DialogTitle>
              <DialogDescription>
                Créez un nouveau compte utilisateur
              </DialogDescription>
            </DialogHeader>
            <UserForm
              onSubmit={handleCreateUser}
              onCancel={() => setShowCreateDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Total Utilisateurs
            </CardTitle>
            <UsersIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Administrateurs
            </CardTitle>
            <UsersIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">
              {getRoleStats("admin")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Superviseurs
            </CardTitle>
            <UsersIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">
              {getRoleStats("supervisor")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Stagiaires
            </CardTitle>
            <UsersIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">
              {getRoleStats("intern")}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>Recherchez, filtrez et paginez</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1) // reset page on search
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedRole}
              onValueChange={(v) => {
                setSelectedRole(v)
                setCurrentPage(1) // reset page on filter
              }}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Tous les rôles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="admin">Administrateur</SelectItem>
                <SelectItem value="supervisor">Superviseur</SelectItem>
                <SelectItem value="intern">Stagiaire</SelectItem>
                <SelectItem value="candidate">Candidat</SelectItem>
              </SelectContent>
            </Select>

            {/* Choix pageSize optionnel */}
            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                setPageSize(Number(v))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="10 / page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 / page</SelectItem>
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="20">20 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Nom</TableHead>
                  <TableHead className="min-w-[200px]">Email</TableHead>
                  <TableHead className="min-w-[120px]">Rôle</TableHead>
                  <TableHead className="min-w-[120px] hidden sm:table-cell">
                    Téléphone
                  </TableHead>
                  <TableHead className="min-w-[120px] hidden sm:table-cell">
                    Département
                  </TableHead>
                  <TableHead className="min-w-[120px] hidden sm:table-cell">
                    Date de création
                  </TableHead>
                  <TableHead className="min-w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {searchTerm || selectedRole !== "all"
                        ? "Aucun utilisateur ne correspond aux critères de recherche"
                        : "Aucun utilisateur trouvé"}
                    </TableCell>
                  </TableRow>
                ) : (
                  pageItems.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {`${user.first_name} ${user.last_name}`}
                      </TableCell>
                      <TableCell className="break-all">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {user.phone || "-"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {user.department || "-"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {new Date(user.created_at).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1 sm:space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingUser(user)}
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingUser(user)}
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Footer */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-sm text-muted-foreground">
              {totalItems === 0
                ? "0 résultat"
                : `Affichage ${firstIndex + 1}–${Math.min(
                    lastIndex,
                    totalItems
                  )} sur ${totalItems} · Page ${currentPage}/${totalPages}`}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={!canPrevious}
              >
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={!canNext}
              >
                Suivant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'utilisateur
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <UserForm
              user={editingUser}
              onSubmit={handleUpdateUser}
              onCancel={() => setEditingUser(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
        title="Confirmer la suppression"
        description={`Êtes-vous sûr de vouloir supprimer l'utilisateur "${deletingUser?.first_name} ${deletingUser?.last_name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={handleDeleteUser}
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  )
}
