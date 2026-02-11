export type UserRole = 'stagiaire' | 'tuteur' | 'rh' | 'admin' | 'universite' | 'ecole'

export interface User {
  id: string
  email: string
  role: UserRole
  nom: string
  prenom: string
  createdAt: string
}

export interface Stagiaire extends User {
  role: 'stagiaire'
  ecole: string
  specialite: string
  telephone: string
  tuteurId?: string
  universitId?: string
  ecoleId?: string
}

export interface Tuteur extends User {
  role: 'tuteur'
  departement: string
  poste: string
  stagiairesIds: string[]
}

export interface RH extends User {
  role: 'rh'
}

export interface Admin extends User {
  role: 'admin'
}

export interface Universite extends User {
  role: 'universite'
  nomUniversite: string
  telephone?: string
  nombreStagiaires?: number
}

export interface Ecole extends User {
  role: 'ecole'
  nomEcole: string
  niveau: string // 'college' | 'lycee' | 'bts'
  telephone?: string
  adresse?: string
  ville?: string
}

export type CandidatureStatus = 
  | 'brouillon'
  | 'soumise'
  | 'en_revision'
  | 'acceptee'
  | 'refusee'

export interface Candidature {
  id: string
  stagiaireId: string
  status: CandidatureStatus
  dateSoumission: string | null
  cvUrl: string | null
  cvFile?: {
    name: string
    size: number
    type: string
    base64: string
  }
  informationsPersonnelles: {
    dateNaissance: string
    adresse: string
    ville: string
    codePostal: string
  } | null
  formation: {
    ecole: string
    niveau: string
    specialite: string
    annee: string
  } | null
  preferencesStage: {
    dateDebut: string
    dateFin: string
    departementSouhaite: string
    sujetSouhaite: string
    motivation: string
  } | null
  commentairesRH: string | null
  dateDecision: string | null
  analyseCV?: {
    score: number
    competences: string[]
    experience: string
    formation: string
    points_forts: string[]
    points_amelioration: string[]
    resume: string
    date_analyse: string
  }
}

export type ConventionStatus = 
  | 'generee'
  | 'envoyee'
  | 'signee_stagiaire'
  | 'signee_complete'

export interface Convention {
  id: string
  candidatureId: string
  stagiaireId: string
  status: ConventionStatus
  dateGeneration: string
  dateSignature: string | null
  contenu: {
    dateDebut: string
    dateFin: string
    departement: string
    tuteurNom: string
    sujet: string
  }
}

export interface TacheOnboarding {
  id: string
  tuteurId: string
  stagiaireId: string
  description: string
  status: 'a_faire' | 'en_cours' | 'termine'
  echeance: string
  notes: string | null
  ordre: number
}

export interface Evaluation {
  id: string
  stagiaireId: string
  tuteurId: string
  competencesTechniques: number
  autonomie: number
  integrationEquipe: number
  commentaires: string
  date: string
  certificatGenere: boolean
}

export interface Notification {
  id: string
  userId: string
  type: 'candidature' | 'convention' | 'onboarding' | 'evaluation' | 'systeme'
  contenu: string
  lu: boolean
  date: string
  lien?: string
}

// Candidature externe (formulaire public - sans compte)
export type CandidatureExterneStatus = 
  | 'nouvelle'
  | 'en_revision'
  | 'acceptee'
  | 'refusee'
  | 'compte_cree'

export interface CandidatureExterne {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  adresse?: string
  ville?: string
  codePostal?: string
  formation: string
  niveau: string
  dateDebut: string
  duree: string
  message?: string
  cvUrl: string
  lettreMotivationUrl: string
  status: CandidatureExterneStatus
  dateSoumission: string
  departementAffecte?: string
  commentairesRH?: string
  dateDecision?: string
  compteCreeLe?: string
}

export const TACHES_ONBOARDING_DEFAUT = [
  'Accueil et présentation de l\'équipe',
  'Configuration des accès systèmes',
  'Visite des locaux',
  'Présentation du projet/mission',
  'Définition des objectifs du stage',
  'Formation aux règles de sécurité',
  'Installation du poste de travail',
  'Réunion avec le responsable RH',
  'Planning des réunions hebdomadaires',
  'Remise du badge et accès',
]

export const DEPARTEMENTS = [
  'Informatique',
  'Ressources Humaines',
  'Finance',
  'Marketing',
  'Commercial',
  'Production',
  'Recherche & Développement',
  'Juridique',
  'Communication',
]

// Demande de partenariat universitaire
export type DemandePartenariatStatus = 
  | 'nouvelle'
  | 'en_revision'
  | 'acceptee'
  | 'refusee'
  | 'compte_cree'

export interface DemandePartenariat {
  id: string
  nomUniversite: string
  responsableNom: string
  responsablePrenom: string
  responsableEmail: string
  responsableTelephone: string
  dateSoumission: string
  status: DemandePartenariatStatus
  commentairesAdmin?: string
  dateDecision?: string
  universiteid?: string
  motDePasseTemporaire?: string
}

export interface Universite extends User {
  role: 'universite'
  nomUniversite: string
}
