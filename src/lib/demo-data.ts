export const demoAccounts = {
  etudiant_informatique: {
    firstName: "Marie",
    lastName: "Dubois",
    email: "marie.dubois@etudiant.fr",
    phone: "0123456789",
    dateOfBirth: new Date("2001-03-15"),
    address: "123 Rue de la République, 75001 Paris",
    company: "TechCorp Solutions",
    position: "Développeur Web Junior",
    startDate: new Date("2024-06-01"),
    endDate: new Date("2024-08-31"),
    motivation: "Passionnée par le développement web et les nouvelles technologies, je souhaite mettre en pratique mes connaissances académiques dans un environnement professionnel stimulant. Cette opportunité de stage me permettra d'acquérir une expérience concrète et de contribuer aux projets innovants de votre entreprise.",
    cv: "CV_Marie_Dubois.pdf",
    coverLetter: "Lettre_Motivation_Marie.pdf",
    transcript: "Releve_Notes_2024.pdf"
  },
  
  etudiant_marketing: {
    firstName: "Pierre",
    lastName: "Martin",
    email: "pierre.martin@etudiant.fr",
    phone: "0987654321",
    dateOfBirth: new Date("2000-11-22"),
    address: "456 Avenue des Champs, 69002 Lyon",
    company: "Agence Creative Plus",
    position: "Assistant Marketing Digital",
    startDate: new Date("2024-07-01"),
    endDate: new Date("2024-09-30"),
    motivation: "Étudiant en marketing digital, je suis motivé par les stratégies de communication innovantes et l'analyse des données. Ce stage représente une opportunité unique d'appliquer mes compétences théoriques dans le domaine du marketing numérique et de découvrir les enjeux actuels du secteur.",
    cv: "CV_Pierre_Martin.pdf",
    coverLetter: "Lettre_Motivation_Pierre.pdf",
    transcript: "Bulletin_Universitaire.pdf"
  },

  etudiant_design: {
    firstName: "Sophie",
    lastName: "Leroy",
    email: "sophie.leroy@etudiant.fr",
    phone: "0654321098",
    dateOfBirth: new Date("2002-01-08"),
    address: "789 Boulevard Saint-Michel, 13001 Marseille",
    company: "Studio Design Moderne",
    position: "Designer UX/UI Stagiaire",
    startDate: new Date("2024-05-15"),
    endDate: new Date("2024-07-31"),
    motivation: "Créative et passionnée par l'expérience utilisateur, je souhaite approfondir mes compétences en design d'interface et découvrir les méthodologies de conception centrées sur l'utilisateur. Ce stage me permettra de travailler sur des projets réels et d'enrichir mon portfolio professionnel.",
    cv: "CV_Sophie_Leroy.pdf",
    coverLetter: "Portfolio_Sophie.pdf",
    transcript: "Resultats_Scolaires.pdf"
  }
}

export type DemoAccountKey = keyof typeof demoAccounts