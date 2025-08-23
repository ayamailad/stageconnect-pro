import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2, User, Mail, Lock, CreditCard, Phone } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string(),
  cin: z.string().min(8, "Le CIN doit contenir au moins 8 caractères"),
  phone: z.string().min(8, "Le numéro de téléphone doit contenir au moins 8 chiffres")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
})

type RegisterForm = z.infer<typeof registerSchema>

export default function Register() {
  const { register: registerUser, loading } = useAuth()
  const navigate = useNavigate()
  
  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      cin: "",
      phone: ""
    }
  })

  const onSubmit = async (data: RegisterForm) => {
    const success = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
      cin: data.cin,
      phone: data.phone
    })
    if (success) {
      navigate("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-warm">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="card-gradient shadow-brand">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-xl bg-gradient-brand flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">I</span>
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Inscription</CardTitle>
              <CardDescription className="text-muted-foreground">
                Créez votre compte InternFlow
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Nom complet
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Jean Dupont"
                          className="bg-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email" 
                          placeholder="jean@example.com"
                          className="bg-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          CIN
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="12345678"
                            className="bg-background"
                          />
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
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Téléphone
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="22123456"
                            className="bg-background"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Mot de passe
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="password" 
                          placeholder="••••••••"
                          className="bg-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Confirmer le mot de passe
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="password" 
                          placeholder="••••••••"
                          className="bg-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full btn-brand" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création du compte...
                    </>
                  ) : (
                    "Créer mon compte"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Déjà un compte ?{" "}
                <Link 
                  to="/login" 
                  className="text-primary hover:underline font-medium"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}