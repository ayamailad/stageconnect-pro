import { UseFormReturn } from "react-hook-form"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Building, 
  FileText, 
  CheckCircle,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Edit
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReviewStepProps {
  form: UseFormReturn<any>
}

export function ReviewStep({ form }: ReviewStepProps) {
  const formData = form.getValues()

  const EditButton = ({ stepNumber, label }: { stepNumber: number, label: string }) => (
    <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
      <Edit className="h-3 w-3 mr-1" />
      {label}
    </Button>
  )

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 p-4 bg-green-50 rounded-lg border border-green-200">
        <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
        <h3 className="font-semibold text-green-900">Candidature prête à être soumise</h3>
        <p className="text-sm text-green-700">
          Vérifiez une dernière fois vos informations avant de soumettre votre candidature.
        </p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <CardTitle className="text-lg">Informations personnelles</CardTitle>
            </div>
            <EditButton stepNumber={1} label="Modifier" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Nom complet</p>
              <p className="font-medium">{formData.firstName} {formData.lastName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Date de naissance</p>
              <p className="font-medium">
                {formData.dateOfBirth ? format(formData.dateOfBirth, "PPP", { locale: fr }) : "Non spécifiée"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">Email</p>
              </div>
              <p className="font-medium">{formData.email}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
              </div>
              <p className="font-medium">{formData.phone}</p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">Adresse</p>
            </div>
            <p className="font-medium">{formData.address}</p>
          </div>
        </CardContent>
      </Card>

      {/* Position Information */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <CardTitle className="text-lg">Informations du stage</CardTitle>
            </div>
            <EditButton stepNumber={2} label="Modifier" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Entreprise</p>
              <p className="font-medium">{formData.company}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Poste</p>
              <p className="font-medium">{formData.position}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">Date de début</p>
              </div>
              <p className="font-medium">
                {formData.startDate ? format(formData.startDate, "PPP", { locale: fr }) : "Non spécifiée"}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">Date de fin</p>
              </div>
              <p className="font-medium">
                {formData.endDate ? format(formData.endDate, "PPP", { locale: fr }) : "Non spécifiée"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Motivation</p>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{formData.motivation || "Aucune motivation saisie"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <CardTitle className="text-lg">Documents</CardTitle>
            </div>
            <EditButton stepNumber={3} label="Modifier" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">CV</span>
              </div>
              {formData.cv ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Téléchargé
                </Badge>
              ) : (
                <Badge variant="destructive">Manquant</Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Lettre de motivation</span>
              </div>
              {formData.coverLetter ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Téléchargé
                </Badge>
              ) : (
                <Badge variant="outline">Optionnel</Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Relevé de notes</span>
              </div>
              {formData.transcript ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Téléchargé
                </Badge>
              ) : (
                <Badge variant="destructive">Manquant</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submission Note */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="space-y-2">
          <h4 className="font-medium text-blue-900">Avant de soumettre</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Assurez-vous que toutes les informations sont correctes</li>
            <li>• Vérifiez que vos documents sont complets et lisibles</li>
            <li>• Une fois soumise, vous recevrez un email de confirmation</li>
            <li>• Vous pourrez suivre l'évolution de votre candidature dans votre tableau de bord</li>
          </ul>
        </div>
      </div>
    </div>
  )
}