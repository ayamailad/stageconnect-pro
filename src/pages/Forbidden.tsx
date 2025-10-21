import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"

const Forbidden = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <ShieldAlert className="h-24 w-24 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">403</h1>
          <h2 className="text-2xl font-semibold text-foreground">Accès Refusé</h2>
          <p className="text-muted-foreground">
            Vous n'avez pas l'autorisation d'accéder à cette page.
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard">Retour au tableau de bord</Link>
        </Button>
      </div>
    </div>
  )
}

export default Forbidden
