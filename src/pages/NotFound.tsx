import { useLocation, Link } from "react-router-dom"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ArrowLeft } from "lucide-react"

const NotFound = () => {
  const location = useLocation()

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    )
  }, [location.pathname])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-warm">
      <Card className="card-gradient shadow-brand max-w-md w-full animate-fade-in">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-xl bg-gradient-brand flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-foreground">404</span>
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Page Introuvable</CardTitle>
            <CardDescription className="text-muted-foreground">
              Désolé, la page que vous recherchez n'existe pas.
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Il semble que cette page ait été déplacée ou n'existe plus.
          </p>
          
          <div className="flex flex-col gap-3">
            <Button asChild className="btn-brand w-full">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Retour à l'Accueil
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Page Précédente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default NotFound
