import { useState } from "react"
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
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase()
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  const handleCreateUser = async (userData: any) => {
    const success = await createUser(userData)
    if (success) {
      setShowCreateDialog(false)
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
      }
    } finally {
      setIsDeleting(false)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive'
      case 'supervisor': return 'default'
      case 'intern': return 'secondary'
      case 'candidate': return 'outline'
      default: return 'secondary'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur'
      case 'supervisor': return 'Superviseur'
      case 'intern': return 'Stagiaire'
      case 'candidate': return 'Candidat'
      default: return role
    }
  }

  const getRoleStats = (role: string) => {
    return users.filter(u => u.role === role).length
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
          <p className="text-muted-foreground text-sm sm:text-base">Gérez les utilisateurs du système</p>
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
            <CardTitle className="text-xs sm:text-sm font-medium">Total Utilisateurs</CardTitle>
            <UsersIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Administrateurs</CardTitle>
            <UsersIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{getRoleStats('admin')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Superviseurs</CardTitle>
            <UsersIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{getRoleStats('supervisor')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Stagiaires</CardTitle>
            <UsersIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{getRoleStats('intern')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>Recherchez et filtrez les utilisateurs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="admin">Administrateur</SelectItem>
                <SelectItem value="supervisor">Superviseur</SelectItem>
                <SelectItem value="intern">Stagiaire</SelectItem>
                <SelectItem value="candidate">Candidat</SelectItem>
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
                  <TableHead className="min-w-[120px] hidden sm:table-cell">Téléphone</TableHead>
                  <TableHead className="min-w-[120px] hidden sm:table-cell">Département</TableHead>
                  <TableHead className="min-w-[120px] hidden sm:table-cell">Date de création</TableHead>
                  <TableHead className="min-w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchTerm || selectedRole !== "all" ? 
                        "Aucun utilisateur ne correspond aux critères de recherche" : 
                        "Aucun utilisateur trouvé"
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
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
                        {user.phone || '-'}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {user.department || '-'}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {new Date(user.created_at).toLocaleDateString('fr-FR')}
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
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
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