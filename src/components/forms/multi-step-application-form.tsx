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

const MAX_FILE_SIZE = 3 * 1024 * 1024 // 3MB in bytes

const applicationSchema = z.object({
  durationMonths: z.string().min(1, "Durée du stage requise"),
  cv: z.instanceof(File, { message: "CV requis" })
    .refine((file) => file.type === 'application/pdf', "Seuls les fichiers PDF sont acceptés")
    .refine((file) => file.size <= MAX_FILE_SIZE, "La taille du fichier ne doit pas dépasser 3MB")
    .optional(),
  coverLetter: z.instanceof(File, { message: "Lettre de motivation requise" })
    .refine((file) => file.type === 'application/pdf', "Seuls les fichiers PDF sont acceptés")
    .refine((file) => file.size <= MAX_FILE_SIZE, "La taille du fichier ne doit pas dépasser 3MB")
    .optional(),
  internshipAgreement: z.instanceof(File, { message: "Convention de stage requise" })
    .refine((file) => file.type === 'application/pdf', "Seuls les fichiers PDF sont acceptés")
    .refine((file) => file.size <= MAX_FILE_SIZE, "La taille du fichier ne doit pas dépasser 3MB")
    .optional(),
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
      durationMonths: "",
    }
  })

  const sanitizeFilename = (filename: string): string => {
    // Get file extension
    const ext = filename.substring(filename.lastIndexOf('.'))
    // Remove extension, then sanitize filename
    const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'))
    // Replace all non-alphanumeric characters (except hyphens and underscores) with underscores
    const sanitized = nameWithoutExt.replace(/[^a-zA-Z0-9_-]/g, '_')
    return sanitized + ext
  }

  const uploadFile = async (file: File, bucket: string, prefix: string): Promise<string | null> => {
    try {
      const timestamp = Date.now()
      const sanitizedFilename = sanitizeFilename(file.name)
      const path = `${prefix}_${timestamp}_${sanitizedFilename}`
      
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
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error("Vous devez être connecté pour soumettre une candidature")
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (profileError || !profile) {
        throw new Error("Impossible de récupérer votre profil utilisateur")
      }

      // Upload files first
      let cvPath = null
      let coverLetterPath = null
      let internshipAgreementPath = null

      if (data.cv) {
        cvPath = await uploadFile(data.cv, 'applications', 'cv')
        if (!cvPath) {
          throw new Error("Échec de l'upload du CV")
        }
      }

      if (data.coverLetter) {
        coverLetterPath = await uploadFile(data.coverLetter, 'applications', 'cover_letter')
        if (!coverLetterPath) {
          throw new Error("Échec de l'upload de la lettre de motivation")
        }
      }

      if (data.internshipAgreement) {
        internshipAgreementPath = await uploadFile(data.internshipAgreement, 'applications', 'internship_agreement')
        if (!internshipAgreementPath) {
          throw new Error("Échec de l'upload de la convention de stage")
        }
      }

      // Save application to database
      const { error: dbError } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          candidate_name: `${profile.first_name} ${profile.last_name}`,
          candidate_email: profile.email,
          candidate_phone: profile.phone,
          position: 'Stage',
          department: profile.department || 'General',
          duration_months: parseInt(data.durationMonths),
          experience: null,
          motivation: null,
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
                {/* Duration Selection */}
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
                            accept=".pdf"
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
                            accept=".pdf"
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
                            accept=".pdf"
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