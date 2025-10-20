import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Target, Award, Shield, CheckCircle, Star } from "lucide-react"
import heroImage from "@/assets/hero-image.jpg"

export default function Landing() {
  const features = [
    {
      icon: Users,
      title: "Gestion Complète",
      description: "Gérez candidats, stagiaires, superviseurs et administrateurs en un seul endroit"
    },
    {
      icon: Target,
      title: "Suivi en Temps Réel",
      description: "Suivez les progrès, les tâches et les présences en temps réel"
    },
    {
      icon: Award,
      title: "Évaluation Intégrée",
      description: "Système d'évaluation et de feedback intégré pour un suivi optimal"
    },
    {
      icon: Shield,
      title: "Sécurisé & Fiable",
      description: "Plateforme sécurisée avec gestion des rôles et permissions"
    }
  ]

  const stats = [
    { number: "500+", label: "Stages Gérés" },
    { number: "100+", label: "Entreprises Partenaires" },
    { number: "95%", label: "Taux de Satisfaction" },
    { number: "24/7", label: "Support Disponible" }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <Badge variant="secondary" className="px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20">
                  <Star className="w-4 h-4 mr-1" />
                  Nouvelle Plateforme
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Gérez vos{" "}
                  <span className="bg-gradient-to-r from-primary to-brand-secondary bg-clip-text text-transparent">
                    stages
                  </span>{" "}
                  avec simplicité
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  InternFlow révolutionne la gestion des stages avec une plateforme moderne, 
                  intuitive et complète pour tous les acteurs de l'écosystème.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="btn-brand text-lg px-8 py-6">
                  <Link to="/register">
                    Commencer Maintenant
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6 border-2 border-primary/20 hover:bg-primary/5">
                  <Link to="/login">Se Connecter</Link>
                </Button>
              </div>

              <div className="flex items-center space-x-6 pt-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-primary">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-slide-up">
              <div className="relative rounded-2xl overflow-hidden shadow-brand">
                <img 
                  src={heroImage} 
                  alt="InternFlow Platform" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, hsl(45, 25%, 98%), hsl(45, 15%, 96%))' }}>
        <div className="container">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
              Pourquoi choisir{" "}
              <span className="bg-gradient-to-r from-primary to-brand-secondary bg-clip-text text-transparent">
                InternFlow
              </span>
              ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Une plateforme complète conçue pour simplifier et optimiser 
              la gestion des stages à tous les niveaux
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="card-gradient hover:shadow-brand transition-all duration-300 hover:-translate-y-1 animate-scale-in">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 rounded-lg bg-gradient-brand flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container">
          <Card className="card-brand text-center p-12 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
                Prêt à transformer votre{" "}
                <span className="bg-gradient-to-r from-primary to-brand-secondary bg-clip-text text-transparent">
                  gestion de stages
                </span>
                ?
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Rejoignez des centaines d'organisations qui font confiance à InternFlow 
                pour gérer leurs programmes de stages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Configuration rapide</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Support dédié</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Sécurité garantie</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="btn-brand text-lg px-8 py-6">
                  <Link to="/register">
                    Créer un Compte Gratuit
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6 border-2 border-primary/20 hover:bg-primary/5">
                  <Link to="/login">Déjà inscrit ? Se connecter</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}