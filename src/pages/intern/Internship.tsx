import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Building, User, FileText, Clock, Target, Award, BookOpen } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

// Mock data
const internshipData = {
  id: 1,
  title: "Stage en Développement Web",
  company: "TechCorp Solutions",
  supervisor: "Marie Dubois",
  startDate: "2024-01-08",
  endDate: "2024-06-30",
  location: "Paris, France",
  description: "Stage de 6 mois en développement web fullstack avec focus sur React et Node.js",
  status: "En cours",
  progress: 35,
  totalHours: 840, // 6 mois * 4 semaines * 35 heures
  completedHours: 294,
  weeklyHours: 35,
  objectives: [
    "Maîtriser React et ses hooks avancés",
    "Développer des APIs REST avec Node.js",
    "Comprendre les bonnes pratiques DevOps",
    "Participer à un projet client réel"
  ],
  skills: [
    { name: "React", level: 75 },
    { name: "TypeScript", level: 60 },
    { name: "Node.js", level: 45 },
    { name: "CSS/Tailwind", level: 80 },
    { name: "Git", level: 70 }
  ],
  evaluations: [
    {
      date: "2024-01-15",
      evaluator: "Marie Dubois",
      type: "Évaluation hebdomadaire",
      note: 16,
      comments: "Très bon début, motivation exemplaire. Besoin d'approfondir les concepts React."
    },
    {
      date: "2024-01-22",
      evaluator: "Jean Martin",
      type: "Évaluation technique",
      note: 14,
      comments: "Bonnes bases en JavaScript. À travailler: asynchrone et promises."
    }
  ]
}

const documents = [
  { name: "Convention de stage", type: "PDF", uploaded: "2024-01-05", status: "Signé" },
  { name: "Rapport mi-parcours", type: "DOCX", uploaded: "2024-03-15", status: "En attente" },
  { name: "Fiche d'évaluation", type: "PDF", uploaded: "2024-01-22", status: "Complété" }
]

export default function InternInternship() {
  const [weeklyReport, setWeeklyReport] = useState("")
  const [reportDialog, setReportDialog] = useState(false)

  const progressPercentage = (internshipData.completedHours / internshipData.totalHours) * 100
  const remainingDays = Math.ceil((new Date(internshipData.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mon Stage</h1>
          <p className="text-muted-foreground">Suivez votre progression et gérez votre stage</p>
        </div>
        
        <Dialog open={reportDialog} onOpenChange={setReportDialog}>
          <DialogTrigger asChild>
            <Button className="btn-brand">
              <FileText className="h-4 w-4 mr-2" />
              Rapport Hebdomadaire
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rapport Hebdomadaire</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Activités de la semaine</Label>
                <Textarea
                  value={weeklyReport}
                  onChange={(e) => setWeeklyReport(e.target.value)}
                  placeholder="Décrivez vos activités, réalisations et difficultés de la semaine..."
                  rows={6}
                />
              </div>
              <Button onClick={() => setReportDialog(false)} className="w-full btn-brand">
                Envoyer le rapport
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Progression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
            <Progress value={progressPercentage} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Jours restants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{remainingDays}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Heures réalisées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{internshipData.completedHours}h</div>
            <div className="text-sm text-muted-foreground">/ {internshipData.totalHours}h</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4" />
              Note moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15/20</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="objectives">Objectifs</TabsTrigger>
          <TabsTrigger value="skills">Compétences</TabsTrigger>
          <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Informations du Stage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Poste</Label>
                  <p className="text-sm">{internshipData.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Entreprise</Label>
                  <p className="text-sm">{internshipData.company}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Superviseur</Label>
                  <p className="text-sm">{internshipData.supervisor}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Localisation</Label>
                  <p className="text-sm flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {internshipData.location}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Période</Label>
                  <p className="text-sm">
                    {format(new Date(internshipData.startDate), "dd MMM yyyy", { locale: fr })} - 
                    {format(new Date(internshipData.endDate), "dd MMM yyyy", { locale: fr })}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Statut</Label>
                  <Badge className="bg-blue-100 text-blue-800 mt-1">
                    {internshipData.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Description du Stage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{internshipData.description}</p>
                
                <div className="mt-4">
                  <Label className="text-sm font-medium">Horaires</Label>
                  <p className="text-sm">{internshipData.weeklyHours}h par semaine</p>
                </div>
                
                <div className="mt-4">
                  <Label className="text-sm font-medium">Progression</Label>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{internshipData.completedHours}h / {internshipData.totalHours}h</span>
                      <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <Progress value={progressPercentage} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="objectives">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Objectifs du Stage
              </CardTitle>
              <CardDescription>
                Objectifs définis en début de stage avec votre superviseur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {internshipData.objectives.map((objective, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary mt-1">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{objective}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      En cours
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Développement des Compétences
              </CardTitle>
              <CardDescription>
                Évolution de vos compétences techniques et soft skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {internshipData.skills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium">{skill.name}</Label>
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Évaluations
              </CardTitle>
              <CardDescription>
                Historique de vos évaluations et feedbacks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {internshipData.evaluations.map((evaluation, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{evaluation.type}</h4>
                        <p className="text-sm text-muted-foreground">
                          Par {evaluation.evaluator} - {format(new Date(evaluation.date), "dd MMM yyyy", { locale: fr })}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {evaluation.note}/20
                      </Badge>
                    </div>
                    <p className="text-sm">{evaluation.comments}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents
              </CardTitle>
              <CardDescription>
                Tous vos documents liés au stage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Uploadé le {format(new Date(doc.uploaded), "dd MMM yyyy", { locale: fr })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {doc.type}
                      </Badge>
                      <Badge className={doc.status === "Signé" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                        {doc.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Voir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}