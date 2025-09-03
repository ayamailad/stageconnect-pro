import { useState } from "react"
import { UseFormReturn } from "react-hook-form"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  X,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DocumentsStepProps {
  form: UseFormReturn<any>
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  uploaded: boolean
}

export function DocumentsStep({ form }: DocumentsStepProps) {
  const [uploadedFiles, setUploadedFiles] = useState<{
    cv?: UploadedFile
    coverLetter?: UploadedFile
    transcript?: UploadedFile
  }>({})

  const handleFileUpload = (type: 'cv' | 'coverLetter' | 'transcript', file: File) => {
    // Simulate file upload
    const uploadedFile: UploadedFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploaded: true
    }

    setUploadedFiles(prev => ({
      ...prev,
      [type]: uploadedFile
    }))

    // Update form value
    form.setValue(type, uploadedFile.id)
  }

  const removeFile = (type: 'cv' | 'coverLetter' | 'transcript') => {
    setUploadedFiles(prev => {
      const updated = { ...prev }
      delete updated[type]
      return updated
    })
    form.setValue(type, undefined)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const FileUploadCard = ({ 
    type, 
    title, 
    description, 
    required = false 
  }: { 
    type: 'cv' | 'coverLetter' | 'transcript'
    title: string
    description: string
    required?: boolean
  }) => {
    const uploadedFile = uploadedFiles[type]
    
    return (
      <Card className={cn(
        "transition-colors border-2 border-dashed",
        uploadedFile ? "border-green-200 bg-green-50/50" : "border-gray-300 hover:border-gray-400"
      )}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium">{title}</h3>
                  {required && <Badge variant="destructive" className="text-xs">Requis</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>

            {uploadedFile ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{uploadedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(uploadedFile.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(type)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = '.pdf,.doc,.docx'
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0]
                      if (file) handleFileUpload(type, file)
                    }
                    input.click()
                  }}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Remplacer le fichier
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-col items-center justify-center py-6 space-y-2 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Glissez votre fichier ici</p>
                    <p className="text-xs text-muted-foreground">
                      Formats acceptés: PDF, DOC, DOCX (max 10 MB)
                    </p>
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = '.pdf,.doc,.docx'
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0]
                      if (file) handleFileUpload(type, file)
                    }
                    input.click()
                  }}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Sélectionner un fichier
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-blue-900">
            Documents requis pour votre candidature
          </p>
          <p className="text-sm text-blue-700">
            Assurez-vous que tous vos documents sont à jour et au bon format (PDF recommandé).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <FileUploadCard
          type="cv"
          title="Curriculum Vitae (CV)"
          description="Votre CV complet et à jour"
          required
        />

        <FileUploadCard
          type="coverLetter"
          title="Lettre de motivation"
          description="Lettre personnalisée pour cette candidature (optionnel si déjà saisie à l'étape précédente)"
        />

        <FileUploadCard
          type="transcript"
          title="Relevé de notes"
          description="Vos derniers relevés de notes ou diplômes"
          required
        />
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">Récapitulatif des documents</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>CV</span>
            {uploadedFiles.cv ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Téléchargé
              </Badge>
            ) : (
              <Badge variant="destructive">Requis</Badge>
            )}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Lettre de motivation</span>
            {uploadedFiles.coverLetter ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Téléchargé
              </Badge>
            ) : (
              <Badge variant="outline">Optionnel</Badge>
            )}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Relevé de notes</span>
            {uploadedFiles.transcript ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Téléchargé
              </Badge>
            ) : (
              <Badge variant="destructive">Requis</Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}