import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar,
  User,
  Building,
  Mail,
  Phone
} from "lucide-react"

const Application = () => {
  // Mock application data - in real app this would come from API
  const applicationStatus = "en_attente" // pending, accepted, rejected
  const applicationProgress = 75

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "en_attente":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />En attente</Badge>
      case "acceptee":
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Acceptée</Badge>
      case "rejetee":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejetée</Badge>
      default:
        return <Badge variant="outline">Non soumise</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Ma Candidature</h1>
        <p className="text-muted-foreground text-sm lg:text-base">
          Suivez l'état de votre candidature pour un stage
        </p>
      </div>

      {/* Application Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base lg:text-lg">Statut de la candidature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getStatusBadge(applicationStatus)}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Progression</span>
                  <span className="font-medium">{applicationProgress}%</span>
                </div>
                <Progress value={applicationProgress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base lg:text-lg">Date de soumission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm lg:text-base">15 Mars 2024</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base lg:text-lg">Prochaine étape</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm lg:text-base text-muted-foreground">
              Entretien prévu le 25 Mars 2024
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Application Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Application Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Informations de candidature</span>
            </CardTitle>
            <CardDescription>Détails de votre demande de stage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Building className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium">Entreprise</p>
                  <p className="text-sm text-muted-foreground">TechCorp Solutions</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <User className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium">Poste demandé</p>
                  <p className="text-sm text-muted-foreground">Développeur Full Stack</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium">Durée du stage</p>
                  <p className="text-sm text-muted-foreground">3 mois (Avril - Juin 2024)</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Documents soumis</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <span className="text-sm">CV.pdf</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <span className="text-sm">Lettre de motivation.pdf</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <span className="text-sm">Relevé de notes.pdf</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Contact superviseur</span>
            </CardTitle>
            <CardDescription>Informations de contact du superviseur</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <User className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium">Nom</p>
                  <p className="text-sm text-muted-foreground">Marie Dubois</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">marie.dubois@techcorp.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium">Téléphone</p>
                  <p className="text-sm text-muted-foreground">+33 1 23 45 67 89</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Prochaines étapes</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Candidature soumise</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Première sélection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3 text-yellow-600" />
                  <span>Entretien prévu</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-muted" />
                  <span>Décision finale</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" className="w-full sm:w-auto">
          <FileText className="w-4 h-4 mr-2" />
          Télécharger le dossier
        </Button>
        <Button variant="outline" className="w-full sm:w-auto">
          <Mail className="w-4 h-4 mr-2" />
          Contacter le superviseur
        </Button>
      </div>
    </div>
  )
}

export default Application