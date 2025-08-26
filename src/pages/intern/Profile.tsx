import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { User, Mail, Phone, MapPin, School, FileText, Camera, Save, Edit, Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data
const profileData = {
  id: 1,
  firstName: "Alex",
  lastName: "Martin",
  email: "alex.martin@student.univ-paris.fr",
  phone: "+33 6 12 34 56 78",
  avatar: "",
  dateOfBirth: "1999-05-15",
  address: "45 rue de la République, 75011 Paris",
  university: "Université Paris-Saclay",
  degree: "Master Informatique",
  year: "M2",
  specialization: "Développement Web & Mobile",
  bio: "Étudiant passionné de développement web, particulièrement intéressé par les technologies React et Node.js. Recherche activement des opportunités pour appliquer mes connaissances dans un environnement professionnel.",
  skills: [
    { name: "JavaScript", level: "Avancé" },
    { name: "React", level: "Intermédiaire" },
    { name: "Node.js", level: "Intermédiaire" },
    { name: "Python", level: "Avancé" },
    { name: "SQL", level: "Intermédiaire" },
    { name: "Git", level: "Avancé" }
  ],
  languages: [
    { name: "Français", level: "Natif" },
    { name: "Anglais", level: "Courant" },
    { name: "Espagnol", level: "Débutant" }
  ],
  certifications: [
    {
      name: "AWS Cloud Practitioner",
      organization: "Amazon Web Services",
      date: "2023-12-15",
      url: "#"
    },
    {
      name: "React Developer Certification",
      organization: "Meta",
      date: "2023-10-22",
      url: "#"
    }
  ],
  projects: [
    {
      name: "E-commerce React App",
      description: "Application e-commerce complète avec React, Redux et Stripe",
      technologies: ["React", "Redux", "Node.js", "MongoDB"],
      url: "https://github.com/alex/ecommerce-app"
    },
    {
      name: "API REST Blog",
      description: "API REST pour un système de blog avec authentification JWT",
      technologies: ["Node.js", "Express", "PostgreSQL", "JWT"],
      url: "https://github.com/alex/blog-api"
    }
  ]
}

export default function InternProfile() {
  const [profile, setProfile] = useState(profileData)
  const [isEditing, setIsEditing] = useState(false)
  const [newSkillDialog, setNewSkillDialog] = useState(false)
  const [newProjectDialog, setNewProjectDialog] = useState(false)
  const [newSkill, setNewSkill] = useState({ name: "", level: "Débutant" })
  const [newProject, setNewProject] = useState({ name: "", description: "", technologies: "", url: "" })
  const { toast } = useToast()

  const handleSave = () => {
    setIsEditing(false)
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été sauvegardées avec succès.",
    })
  }

  const addSkill = () => {
    if (newSkill.name) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill]
      })
      setNewSkill({ name: "", level: "Débutant" })
      setNewSkillDialog(false)
    }
  }

  const removeSkill = (index: number) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((_, i) => i !== index)
    })
  }

  const addProject = () => {
    if (newProject.name && newProject.description) {
      const project = {
        ...newProject,
        technologies: newProject.technologies.split(',').map(t => t.trim())
      }
      setProfile({
        ...profile,
        projects: [...profile.projects, project]
      })
      setNewProject({ name: "", description: "", technologies: "", url: "" })
      setNewProjectDialog(false)
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Débutant": return "bg-gray-100 text-gray-800"
      case "Intermédiaire": return "bg-blue-100 text-blue-800"
      case "Avancé": return "bg-green-100 text-green-800"
      case "Expert": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mon Profil</h1>
          <p className="text-muted-foreground">Gérez vos informations personnelles et professionnelles</p>
        </div>
        
        <Button 
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={isEditing ? "btn-brand" : ""}
          variant={isEditing ? "default" : "outline"}
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
          <TabsTrigger value="academic">Parcours académique</TabsTrigger>
          <TabsTrigger value="skills">Compétences</TabsTrigger>
          <TabsTrigger value="projects">Projets</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="text-center">
                <div className="relative w-32 h-32 mx-auto">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback className="text-2xl">
                      {profile.firstName[0]}{profile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute bottom-0 right-0 rounded-full p-2"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">{profile.firstName} {profile.lastName}</h3>
                  <p className="text-muted-foreground">{profile.degree} - {profile.year}</p>
                  <p className="text-sm text-muted-foreground">{profile.university}</p>
                </div>
              </CardHeader>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Informations de contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="flex">
                    <Mail className="h-4 w-4 mt-3 mr-2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <div className="flex">
                    <Phone className="h-4 w-4 mt-3 mr-2 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Adresse</Label>
                  <div className="flex">
                    <MapPin className="h-4 w-4 mt-3 mr-2 text-muted-foreground" />
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) => setProfile({...profile, address: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="dateOfBirth">Date de naissance</Label>
                  <DatePicker
                    date={profile.dateOfBirth ? new Date(profile.dateOfBirth) : undefined}
                    onSelect={(date) => setProfile({...profile, dateOfBirth: date ? date.toISOString().split('T')[0] : ''})}
                    disabled={!isEditing}
                    placeholder="Sélectionner votre date de naissance"
                  />
                </div>
                
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="academic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                Parcours académique
              </CardTitle>
              <CardDescription>Vos informations de formation et d'études</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="university">Établissement</Label>
                  <Input
                    id="university"
                    value={profile.university}
                    onChange={(e) => setProfile({...profile, university: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="degree">Diplôme</Label>
                  <Input
                    id="degree"
                    value={profile.degree}
                    onChange={(e) => setProfile({...profile, degree: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="year">Année d'études</Label>
                  <Input
                    id="year"
                    value={profile.year}
                    onChange={(e) => setProfile({...profile, year: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="specialization">Spécialisation</Label>
                  <Input
                    id="specialization"
                    value={profile.specialization}
                    onChange={(e) => setProfile({...profile, specialization: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <Label>Langues</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                  {profile.languages.map((lang, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{lang.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {lang.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Certifications</Label>
                <div className="space-y-2 mt-2">
                  {profile.certifications.map((cert, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{cert.name}</h4>
                          <p className="text-sm text-muted-foreground">{cert.organization}</p>
                        </div>
                        <Badge variant="outline">
                          {new Date(cert.date).getFullYear()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Compétences techniques</CardTitle>
                  <CardDescription>Gérez vos compétences et leur niveau</CardDescription>
                </div>
                
                <Dialog open={newSkillDialog} onOpenChange={setNewSkillDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter une compétence</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="skillName">Compétence</Label>
                        <Input
                          id="skillName"
                          value={newSkill.name}
                          onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                          placeholder="ex: JavaScript, React..."
                        />
                      </div>
                      <div>
                        <Label>Niveau</Label>
                        <Select value={newSkill.level} onValueChange={(value) => setNewSkill({...newSkill, level: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Débutant">Débutant</SelectItem>
                            <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                            <SelectItem value="Avancé">Avancé</SelectItem>
                            <SelectItem value="Expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={addSkill} className="w-full">
                        Ajouter la compétence
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {profile.skills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">{skill.name}</span>
                      <Badge className={`ml-2 text-xs ${getLevelColor(skill.level)}`}>
                        {skill.level}
                      </Badge>
                    </div>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Projets personnels</CardTitle>
                  <CardDescription>Showcase de vos réalisations</CardDescription>
                </div>
                
                <Dialog open={newProjectDialog} onOpenChange={setNewProjectDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un projet
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter un projet</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="projectName">Nom du projet</Label>
                        <Input
                          id="projectName"
                          value={newProject.name}
                          onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                          placeholder="Nom de votre projet"
                        />
                      </div>
                      <div>
                        <Label htmlFor="projectDescription">Description</Label>
                        <Textarea
                          id="projectDescription"
                          value={newProject.description}
                          onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                          placeholder="Description détaillée du projet"
                        />
                      </div>
                      <div>
                        <Label htmlFor="projectTech">Technologies (séparées par des virgules)</Label>
                        <Input
                          id="projectTech"
                          value={newProject.technologies}
                          onChange={(e) => setNewProject({...newProject, technologies: e.target.value})}
                          placeholder="React, Node.js, MongoDB..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="projectUrl">URL (optionnel)</Label>
                        <Input
                          id="projectUrl"
                          value={newProject.url}
                          onChange={(e) => setNewProject({...newProject, url: e.target.value})}
                          placeholder="https://github.com/..."
                        />
                      </div>
                      <Button onClick={addProject} className="w-full">
                        Ajouter le projet
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.projects.map((project, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{project.name}</h4>
                      {project.url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.url} target="_blank" rel="noopener noreferrer">
                            Voir le projet
                          </a>
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
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
                Documents personnels
              </CardTitle>
              <CardDescription>Gérez vos CV, lettres de motivation et autres documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun document téléchargé</h3>
                <p className="text-muted-foreground mb-4">
                  Téléchargez vos documents personnels pour compléter votre profil
                </p>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un document
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}