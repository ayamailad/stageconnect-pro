import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2, Mail, Lock } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/integrations/supabase/client"

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères")
})

type LoginForm = z.infer<typeof loginSchema>

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })
  
  // One-time seeding of test users via Edge Function
  useEffect(() => {
    const key = 'testUsersSeeded'
    if (localStorage.getItem(key)) return
    supabase.functions.invoke('create-test-users').then(() => {
      localStorage.setItem(key, '1')
    }).catch(() => {
      // ignore seeding errors in UI
    })
  }, [])

  const onSubmit = async (data: LoginForm) => {
    const success = await login(data.email, data.password)
    if (success) {
      // Role-based redirect
      if (data.email.includes("admin")) {
        navigate("/admin/dashboard")
      } else if (data.email.includes("supervisor")) {
        navigate("/supervisor/dashboard")
      } else if (data.email.includes("intern")) {
        navigate("/intern/dashboard")
      } else {
        navigate("/dashboard")
      }
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
              <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
              <CardDescription className="text-muted-foreground">
                Connectez-vous à votre compte InternFlow
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          placeholder="votre@email.com"
                          className="bg-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <Button 
                  type="submit" 
                  className="w-full btn-brand" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Pas encore de compte ?{" "}
                <Link 
                  to="/register" 
                  className="text-primary hover:underline font-medium"
                >
                  S'inscrire
                </Link>
              </p>
            </div>

            {/* Demo accounts */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Comptes de démonstration :</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Admins: admin1@test.com, admin2@test.com</p>
                <p>Superviseurs: supervisor1@test.com</p>
                <p>Stagiaires: intern1@test.com</p>
                <p>Candidats: candidate1@test.com</p>
                <p>Mot de passe: password123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}