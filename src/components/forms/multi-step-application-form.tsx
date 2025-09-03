import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  FileText, 
  Building, 
  CheckCircle,
  Upload
} from "lucide-react"
import { PersonalInfoStep } from "./steps/personal-info-step"
import { PositionStep } from "./steps/position-step"
import { DocumentsStep } from "./steps/documents-step"
import { ReviewStep } from "./steps/review-step"
import { toast } from "@/hooks/use-toast"
import { demoAccounts, type DemoAccountKey } from "@/lib/demo-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const applicationSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  dateOfBirth: z.date({ required_error: "Date de naissance requise" }),
  address: z.string().min(5, "Adresse complète requise"),
  
  // Position Information
  company: z.string().min(1, "Entreprise requise"),
  position: z.string().min(1, "Poste requis"),
  startDate: z.date({ required_error: "Date de début requise" }),
  endDate: z.date({ required_error: "Date de fin requise" }),
  motivation: z.string().min(50, "La motivation doit contenir au moins 50 caractères"),
  
  // Documents (these would be file objects in real implementation)
  cv: z.string().optional(),
  coverLetter: z.string().optional(),
  transcript: z.string().optional(),
})

type ApplicationFormData = z.infer<typeof applicationSchema>

const steps = [
  { id: 1, title: "Informations personnelles", icon: User, description: "Vos informations de base" },
  { id: 2, title: "Poste recherché", icon: Building, description: "Détails du stage souhaité" },
  { id: 3, title: "Documents", icon: FileText, description: "CV et pièces justificatives" },
  { id: 4, title: "Révision", icon: CheckCircle, description: "Vérifiez vos informations" },
]

export function MultiStepApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      company: "",
      position: "",
      motivation: "",
    }
  })

  const progress = (currentStep / steps.length) * 100

  const loadDemoData = (demoKey: DemoAccountKey) => {
    const demoData = demoAccounts[demoKey]
    form.reset(demoData)
    setCurrentStep(1)
    toast({
      title: "Données de démonstration chargées",
      description: `Profil de ${demoData.firstName} ${demoData.lastName} chargé avec succès.`,
    })
  }

  const nextStep = async () => {
    const currentFields = getCurrentStepFields()
    const isValid = await form.trigger(currentFields)
    
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getCurrentStepFields = (): (keyof ApplicationFormData)[] => {
    switch (currentStep) {
      case 1:
        return ["firstName", "lastName", "email", "phone", "dateOfBirth", "address"]
      case 2:
        return ["company", "position", "startDate", "endDate", "motivation"]
      case 3:
        return [] // Document validation handled separately
      case 4:
        return [] // Review step
      default:
        return []
    }
  }

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Candidature soumise !",
        description: "Votre candidature a été envoyée avec succès. Vous recevrez une confirmation par email.",
      })
      
      // Reset form or redirect
      console.log("Application submitted:", data)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep form={form} />
      case 2:
        return <PositionStep form={form} />
      case 3:
        return <DocumentsStep form={form} />
      case 4:
        return <ReviewStep form={form} />
      default:
        return null
    }
  }

  const currentStepData = steps[currentStep - 1]
  const StepIcon = currentStepData?.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Ma Candidature</h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Postulez pour un stage en remplissant ce formulaire étape par étape
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>Étape {currentStep} sur {steps.length}</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="flex items-center justify-between overflow-x-auto pb-2">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = step.id === currentStep
            const isCompleted = step.id < currentStep
            
            return (
              <div
                key={step.id}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors min-w-fit ${
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : isCompleted 
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs lg:text-sm font-medium hidden sm:block">
                  {step.title}
                </span>
                {isCompleted && <CheckCircle className="h-3 w-3 text-green-600" />}
              </div>
            )
          })}
        </div>
      </div>

      {/* Demo Accounts Selector */}
      <Card className="bg-muted/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Comptes de démonstration</CardTitle>
          <CardDescription className="text-xs">
            Chargez rapidement des données d'exemple pour tester le formulaire
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={(value) => loadDemoData(value as DemoAccountKey)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner un profil de démonstration..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="etudiant_informatique">
                Marie Dubois - Développeur Web Junior
              </SelectItem>
              <SelectItem value="etudiant_marketing">
                Pierre Martin - Assistant Marketing Digital
              </SelectItem>
              <SelectItem value="etudiant_design">
                Sophie Leroy - Designer UX/UI Stagiaire
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Current Step */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {StepIcon && <StepIcon className="h-5 w-5" />}
            <span>{currentStepData?.title}</span>
          </CardTitle>
          <CardDescription>{currentStepData?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Précédent</span>
              </Button>

              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center space-x-2"
                >
                  <span>Suivant</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Envoi...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>Soumettre la candidature</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}