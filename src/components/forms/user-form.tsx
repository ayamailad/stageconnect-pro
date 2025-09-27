import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CreateUserData, UpdateUserData, User } from "@/hooks/use-users"

// Schema for creating user
const createUserSchema = z.object({
  first_name: z.string().min(1, "Le prénom est requis").max(50, "Le prénom ne peut pas dépasser 50 caractères"),
  last_name: z.string().min(1, "Le nom est requis").max(50, "Le nom ne peut pas dépasser 50 caractères"),
  email: z.string().email("L'email doit être valide").max(255, "L'email ne peut pas dépasser 255 caractères"),
  phone: z.string().optional(),
  role: z.enum(['admin', 'supervisor', 'intern', 'candidate'], {
    required_error: "Le rôle est requis"
  }),
  department: z.string().optional(),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").max(100, "Le mot de passe ne peut pas dépasser 100 caractères")
})

// Schema for updating user (password is optional)
const updateUserSchema = z.object({
  first_name: z.string().min(1, "Le prénom est requis").max(50, "Le prénom ne peut pas dépasser 50 caractères"),
  last_name: z.string().min(1, "Le nom est requis").max(50, "Le nom ne peut pas dépasser 50 caractères"),
  email: z.string().email("L'email doit être valide").max(255, "L'email ne peut pas dépasser 255 caractères"),
  phone: z.string().optional(),
  role: z.enum(['admin', 'supervisor', 'intern', 'candidate'], {
    required_error: "Le rôle est requis"
  }),
  department: z.string().optional()
})

type CreateUserFormData = z.infer<typeof createUserSchema>
type UpdateUserFormData = z.infer<typeof updateUserSchema>

interface UserFormProps {
  user?: User
  onSubmit: (data: CreateUserData | UpdateUserData) => Promise<boolean>
  onCancel: () => void
  isLoading?: boolean
}

export function UserForm({ user, onSubmit, onCancel, isLoading = false }: UserFormProps) {
  const isEdit = !!user
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(isEdit ? updateUserSchema : createUserSchema),
    defaultValues: isEdit ? {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      department: user.department || ''
    } : {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      role: undefined,
      department: ''
    }
  })

  const handleSubmit = async (data: CreateUserFormData | UpdateUserFormData) => {
    try {
      setSubmitting(true)
      
      // For create form, ensure password is included
      const submitData = isEdit ? 
        data as UpdateUserData : 
        { ...data, password: (data as CreateUserFormData).password } as CreateUserData

      const success = await onSubmit(submitData)
      if (success) {
        form.reset()
        onCancel()
      }
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setSubmitting(false)
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Prénom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Nom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone (optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="+33 1 23 45 67 89" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rôle</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">{getRoleLabel('admin')}</SelectItem>
                  <SelectItem value="supervisor">{getRoleLabel('supervisor')}</SelectItem>
                  <SelectItem value="intern">{getRoleLabel('intern')}</SelectItem>
                  <SelectItem value="candidate">{getRoleLabel('candidate')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Département (optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="Informatique, RH, Marketing..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isEdit && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Minimum 6 caractères" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex space-x-2 pt-4">
          <Button 
            type="submit" 
            className="flex-1"
            disabled={submitting || isLoading}
          >
            {submitting ? 'Enregistrement...' : (isEdit ? 'Modifier' : 'Créer l\'utilisateur')}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={submitting || isLoading}
          >
            Annuler
          </Button>
        </div>
      </form>
    </Form>
  )
}