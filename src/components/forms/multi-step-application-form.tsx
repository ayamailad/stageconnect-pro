import { useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, Cloud } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

const applicationSchema = z.object({
  candidateName: z.string().min(2, "Nom complet requis").max(100, "Nom trop long"),
  candidateEmail: z.string().email("Email invalide").max(255, "Email trop long"),
  candidatePhone: z.string().optional(),
  position: z.string().min(2, "Poste souhaité requis").max(100, "Poste trop long"),
  department: z.string().min(2, "Département requis").max(100, "Département trop long"),
  durationMonths: z.string().min(1, "Durée du stage requise"),
  experience: z.string().optional(),
  motivation: z.string().optional(),
  cv: z.instanceof(File, { message: "CV requis" }).optional(),
  coverLetter: z.instanceof(File, { message: "Lettre de motivation requise" }).optional(),
  internshipAgreement: z.instanceof(File, { message: "Convention de stage requise" }).optional(),
})

type ApplicationFormData = z.infer<typeof applicationSchema>

interface FileUploadAreaProps {
  onFileSelect: (file: File | undefined) => void
  accept: string
  label: string
  file?: File
}

function FileUploadArea({ onFileSelect, accept, label, file }: FileUploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const validFile = files.find(f => accept.split(',').some(type => f.name.toLowerCase().endsWith(type.trim().substring(1))))
    
    if (validFile) {
      onFileSelect(validFile)
    } else {
      toast({
        title: "Fichier non supporté",
        description: `Veuillez sélectionner un fichier ${accept}`,
        variant: "destructive",
      })
    }
  }, [accept, onFileSelect])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    onFileSelect(file)
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
        ${isDragOver 
          ? 'border-primary bg-primary/5' 
          : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
        }`}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      onClick={() => document.getElementById(`file-${label}`)?.click()}
    >
      <Cloud className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
      <p className="text-sm font-medium mb-2">
        <span className="text-primary">Cliquez pour choisir</span> ou glissez-déposez
      </p>
      <p className="text-xs text-muted-foreground">
        {accept.replace(/\./g, '').toUpperCase()}
      </p>
      {file && (
        <p className="text-xs text-primary mt-2 font-medium">
          Fichier sélectionné: {file.name}
        </p>
      )}
      <input
        id={`file-${label}`}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

export function MultiStepApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    mode: "onChange",
    defaultValues: {
      candidateName: "",
      candidateEmail: "",
      candidatePhone: "",
      position: "",
      department: "",
      durationMonths: "",
      experience: "",
      motivation: "",
    }
  })

  const uploadFile = async (file: File, bucket: string, path: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Upload error:', error)
        return null
      }

      return data.path
    } catch (error) {
      console.error('Upload exception:', error)
      return null
    }
  }

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true)
    try {
      // Upload files first
      let cvPath = null
      let coverLetterPath = null
      let internshipAgreementPath = null

      if (data.cv) {
        const timestamp = Date.now()
        cvPath = await uploadFile(data.cv, 'applications', `cv_${timestamp}_${data.cv.name}`)
        if (!cvPath) {
          throw new Error("Échec de l'upload du CV")
        }
      }

      if (data.coverLetter) {
        const timestamp = Date.now()
        coverLetterPath = await uploadFile(data.coverLetter, 'applications', `cover_letter_${timestamp}_${data.coverLetter.name}`)
        if (!coverLetterPath) {
          throw new Error("Échec de l'upload de la lettre de motivation")
        }
      }

      if (data.internshipAgreement) {
        const timestamp = Date.now()
        internshipAgreementPath = await uploadFile(data.internshipAgreement, 'applications', `internship_agreement_${timestamp}_${data.internshipAgreement.name}`)
        if (!internshipAgreementPath) {
          throw new Error("Échec de l'upload de la convention de stage")
        }
      }

      // Save application to database
      const { error: dbError } = await supabase
        .from('applications')
        .insert({
          candidate_name: data.candidateName,
          candidate_email: data.candidateEmail,
          candidate_phone: data.candidatePhone || null,
          position: data.position,
          department: data.department,
          duration_months: parseInt(data.durationMonths),
          experience: data.experience || null,
          motivation: data.motivation || null,
          cv_file_path: cvPath,
          cover_letter_path: coverLetterPath,
          internship_agreement_path: internshipAgreementPath,
          status: 'pending'
        })

      if (dbError) {
        console.error('Database error:', dbError)
        throw new Error("Erreur lors de la sauvegarde de la candidature")
      }
      
      toast({
        title: "Candidature soumise !",
        description: "Votre candidature a été envoyée avec succès. Vous recevrez une confirmation par email.",
      })
      
      // Reset form
      form.reset()
    } catch (error: any) {
      console.error('Submission error:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la soumission. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="space-y-2 mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Ma Candidature</h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Postulez pour un stage en remplissant ce formulaire
          </p>
        </div>

        {/* Application Form */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Formulaire de candidature</span>
            </CardTitle>
            <CardDescription>Complétez les informations ci-dessous pour soumettre votre candidature</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="candidateName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom complet</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre nom complet" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="candidateEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="votre.email@exemple.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="candidatePhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone (optionnel)</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre numéro de téléphone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="durationMonths"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Durée du stage</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez la durée" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1 mois</SelectItem>
                            <SelectItem value="2">2 mois</SelectItem>
                            <SelectItem value="3">3 mois</SelectItem>
                            <SelectItem value="4">4 mois</SelectItem>
                            <SelectItem value="5">5 mois</SelectItem>
                            <SelectItem value="6">6 mois</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Poste souhaité</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Développeur Frontend" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Département</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Informatique" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Experience */}
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expérience professionnelle (optionnel)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Décrivez brièvement votre expérience professionnelle..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Motivation */}
                <FormField
                  control={form.control}
                  name="motivation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivation (optionnel)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Pourquoi souhaitez-vous faire ce stage chez nous ?"
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* File Uploads */}
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="cv"
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        <FormLabel>CV</FormLabel>
                        <FormControl>
                          <FileUploadArea
                            onFileSelect={onChange}
                            accept=".pdf,.doc,.docx"
                            label="cv"
                            file={value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coverLetter"
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        <FormLabel>Lettre de motivation</FormLabel>
                        <FormControl>
                          <FileUploadArea
                            onFileSelect={onChange}
                            accept=".pdf,.doc,.docx"
                            label="cover-letter"
                            file={value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="internshipAgreement"
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        <FormLabel>Convention de stage</FormLabel>
                        <FormControl>
                          <FileUploadArea
                            onFileSelect={onChange}
                            accept=".pdf,.doc,.docx"
                            label="internship-agreement"
                            file={value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-w-[200px] bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        <span>Soumettre la candidature</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}