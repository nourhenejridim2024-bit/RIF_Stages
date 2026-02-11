'use client'

import React from "react"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/lib/auth-context'
import { PartnershipRequestModal } from '@/components/partnership-request-modal'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FileText,
  Users,
  ClipboardCheck,
  Award,
  ArrowRight,
  CheckCircle2,
  Building2,
  Upload,
  Loader2,
  X
} from 'lucide-react'

export default function LandingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPartnershipOpen, setIsPartnershipOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [lettreFile, setLettreFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    codePostal: '',
    formation: '',
    niveau: '',
    dateDebut: '',
    duree: '',
    message: '',
  })

  useEffect(() => {
    if (user) {
      // Redirect based on role
      const routes: Record<string, string> = {
        stagiaire: '/stagiaire',
        tuteur: '/tuteur',
        rh: '/rh',
        admin: '/admin',
        universite: '/universite',
      }
      router.push(routes[user.role] || '/stagiaire')
    }
  }, [user, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0])
    }
  }

  const handleLettreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLettreFile(e.target.files[0])
    }
  }

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Erreur lors de l\'upload du fichier')
    }

    const data = await response.json()
    return data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let cvUrl = ''
      let lettreMotivationUrl = ''

      // Upload des fichiers
      if (cvFile) {
        cvUrl = await uploadFile(cvFile)
      }

      if (lettreFile) {
        lettreMotivationUrl = await uploadFile(lettreFile)
      }

      // Préparer les données de la candidature
      const candidatureData = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        adresse: formData.adresse,
        ville: formData.ville,
        codePostal: formData.codePostal,
        formation: formData.formation,
        niveau: formData.niveau,
        dateDebut: formData.dateDebut,
        duree: formData.duree,
        message: formData.message,
        cvUrl,
        lettreMotivationUrl,
      }

      // Appeler l'API pour créer la candidature
      const response = await fetch('/api/candidatures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(candidatureData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la soumission')
      }

      setIsSubmitting(false)
      setIsSuccess(true)
    } catch (error) {
      console.error('Error submitting candidature:', error)
      setIsSubmitting(false)
      alert(error instanceof Error ? error.message : 'Erreur lors de la soumission de la candidature')
    }
  }

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      adresse: '',
      ville: '',
      codePostal: '',
      formation: '',
      niveau: '',
      dateDebut: '',
      duree: '',
      message: '',
    })
    setCvFile(null)
    setLettreFile(null)
    setIsSuccess(false)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    if (isSuccess) {
      resetForm()
    }
  }

  const features = [
    {
      icon: FileText,
      title: 'Candidature simplifiée',
      description: 'Soumettez votre candidature en quelques clics avec notre formulaire guidé en 3 étapes.',
    },
    {
      icon: ClipboardCheck,
      title: 'Onboarding structuré',
      description: 'Checklist d\'intégration complète pour une prise de poste efficace.',
    },
    {
      icon: Users,
      title: 'Suivi personnalisé',
      description: 'Communication directe avec votre tuteur et les RH tout au long du stage.',
    },
    {
      icon: Award,
      title: 'Évaluation et certificat',
      description: 'Évaluation finale et génération automatique du certificat de stage.',
    },
  ]

  const steps = [
    { number: '01', title: 'Candidature', description: 'Remplissez le formulaire et joignez votre CV et lettre de motivation' },
    { number: '02', title: 'Validation', description: 'L\'équipe RH examine et valide votre candidature' },
    { number: '03', title: 'Entretien', description: 'Rencontrez votre futur tuteur et l\'équipe' },
    { number: '04', title: 'Stage', description: 'Commencez votre stage avec un onboarding complet' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="font-semibold text-xl text-foreground">RIF-Stages</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#fonctionnalites" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Fonctionnalités
              </a>
              <a href="#processus" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Processus
              </a>
              <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/connexion">
                <Button variant="ghost" size="sm">
                  Connexion
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => setIsPartnershipOpen(true)}>
                Partenariat
              </Button>
              <Button size="sm" onClick={() => setIsDialogOpen(true)}>
                Postuler
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              Votre stage au sein du groupe RIF
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Plateforme digitale de gestion complète du cycle de vie des stagiaires.
              De la candidature à l'évaluation finale, nous simplifions chaque étape.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="w-full sm:w-auto" onClick={() => setIsDialogOpen(true)}>
                Déposer ma candidature
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Link href="/connexion">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                  J'ai déjà un compte
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary">150+</p>
              <p className="mt-2 text-sm text-muted-foreground">Stagiaires accueillis</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary">25</p>
              <p className="mt-2 text-sm text-muted-foreground">Départements partenaires</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary">95%</p>
              <p className="mt-2 text-sm text-muted-foreground">Taux de satisfaction</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary">48h</p>
              <p className="mt-2 text-sm text-muted-foreground">Délai de réponse moyen</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fonctionnalites" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Une plateforme complète
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Tous les outils nécessaires pour gérer votre stage de A à Z
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="processus" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Comment ça marche ?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Un processus simple et transparent en 4 étapes
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-border -translate-x-1/2" />
                )}
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-xl font-bold">
                    {step.number}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Prêt à rejoindre le groupe RIF ?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Déposez votre candidature dès maintenant et démarrez votre carrière avec nous.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setIsDialogOpen(true)}>
              Commencer ma candidature
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Inscription gratuite
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Réponse sous 48h
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Accompagnement personnalisé
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-sidebar text-sidebar-foreground py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-6 w-6" />
                <span className="font-semibold text-lg">RIF-Stages</span>
              </div>
              <p className="text-sm text-sidebar-foreground/70">
                Plateforme de gestion des stagiaires du groupe RIF.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/70">
                <li><a href="#fonctionnalites" className="hover:text-sidebar-foreground transition-colors">Fonctionnalités</a></li>
                <li><a href="#processus" className="hover:text-sidebar-foreground transition-colors">Processus</a></li>
                <li><Link href="/connexion" className="hover:text-sidebar-foreground transition-colors">Connexion</Link></li>
                <li><button onClick={() => setIsDialogOpen(true)} className="hover:text-sidebar-foreground transition-colors">Postuler</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/70">
                <li>stages@groupe-rif.fr</li>
                <li>+33 5 56 00 00 00</li>
                <li>Bordeaux, France</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/70">
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Mentions légales</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">RGPD</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-sidebar-border text-center text-sm text-sidebar-foreground/50">
            © 2024 Groupe RIF. Tous droits réservés.
          </div>
        </div>
      </footer>

      {/* Candidature Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-accent" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Candidature envoyée !
              </h2>
              <p className="text-muted-foreground mb-6">
                Votre candidature a été soumise avec succès. Notre équipe RH vous contactera dans les 48 heures.
              </p>
              <Button onClick={handleDialogClose}>
                Fermer
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">Déposer ma candidature</DialogTitle>
                <DialogDescription>
                  Remplissez le formulaire ci-dessous et joignez votre CV ainsi que votre lettre de motivation.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                {/* Informations personnelles */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground border-b pb-2">Informations personnelles</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom *</Label>
                      <Input
                        id="nom"
                        value={formData.nom}
                        onChange={(e) => handleInputChange('nom', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prenom">Prénom *</Label>
                      <Input
                        id="prenom"
                        value={formData.prenom}
                        onChange={(e) => handleInputChange('prenom', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telephone">Téléphone *</Label>
                      <Input
                        id="telephone"
                        type="tel"
                        value={formData.telephone}
                        onChange={(e) => handleInputChange('telephone', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Adresse */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground border-b pb-2">Adresse</h3>
                  <div className="space-y-2">
                    <Label htmlFor="adresse">Adresse</Label>
                    <Input
                      id="adresse"
                      value={formData.adresse}
                      onChange={(e) => handleInputChange('adresse', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ville">Ville</Label>
                      <Input
                        id="ville"
                        value={formData.ville}
                        onChange={(e) => handleInputChange('ville', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="codePostal">Code postal</Label>
                      <Input
                        id="codePostal"
                        value={formData.codePostal}
                        onChange={(e) => handleInputChange('codePostal', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Formation et stage */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground border-b pb-2">Formation et stage</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="formation">Formation actuelle *</Label>
                      <Input
                        id="formation"
                        placeholder="Ex: Master Informatique"
                        value={formData.formation}
                        onChange={(e) => handleInputChange('formation', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="niveau">Niveau d'études *</Label>
                      <Select value={formData.niveau} onValueChange={(value) => handleInputChange('niveau', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bac+2">Bac+2</SelectItem>
                          <SelectItem value="bac+3">Bac+3 (Licence)</SelectItem>
                          <SelectItem value="bac+4">Bac+4</SelectItem>
                          <SelectItem value="bac+5">Bac+5 (Master)</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateDebut">Date de début souhaitée *</Label>
                      <Input
                        id="dateDebut"
                        type="date"
                        value={formData.dateDebut}
                        onChange={(e) => handleInputChange('dateDebut', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duree">Durée du stage *</Label>
                      <Select value={formData.duree} onValueChange={(value) => handleInputChange('duree', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2">1 à 2 mois</SelectItem>
                          <SelectItem value="2-4">2 à 4 mois</SelectItem>
                          <SelectItem value="4-6">4 à 6 mois</SelectItem>
                          <SelectItem value="6+">Plus de 6 mois</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground border-b pb-2">Documents</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cv">CV (PDF) *</Label>
                      <div className="relative">
                        <Input
                          id="cv"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleCvChange}
                          className="hidden"
                          required
                        />
                        <label
                          htmlFor="cv"
                          className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                        >
                          {cvFile ? (
                            <span className="text-sm text-foreground flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              {cvFile.name}
                              <button type="button" onClick={(e) => { e.preventDefault(); setCvFile(null) }} className="text-muted-foreground hover:text-destructive">
                                <X className="h-4 w-4" />
                              </button>
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground flex items-center gap-2">
                              <Upload className="h-4 w-4" />
                              Importer CV
                            </span>
                          )}
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lettre">Lettre de motivation (PDF) *</Label>
                      <div className="relative">
                        <Input
                          id="lettre"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleLettreChange}
                          className="hidden"
                          required
                        />
                        <label
                          htmlFor="lettre"
                          className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                        >
                          {lettreFile ? (
                            <span className="text-sm text-foreground flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              {lettreFile.name}
                              <button type="button" onClick={(e) => { e.preventDefault(); setLettreFile(null) }} className="text-muted-foreground hover:text-destructive">
                                <X className="h-4 w-4" />
                              </button>
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground flex items-center gap-2">
                              <Upload className="h-4 w-4" />
                              Importer lettre
                            </span>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Message (optionnel)</Label>
                  <Textarea
                    id="message"
                    placeholder="Présentez-vous brièvement et expliquez vos motivations..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={handleDialogClose} className="flex-1 bg-transparent">
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        Envoyer ma candidature
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Partnership Request Modal */}
      <PartnershipRequestModal
        isOpen={isPartnershipOpen}
        onOpenChange={setIsPartnershipOpen}
      />
    </div>
  )
}
