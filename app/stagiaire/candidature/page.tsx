'use client'

import React from "react"

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { mockCandidatures } from '@/lib/mock-data'
import { DEPARTEMENTS } from '@/lib/types'
import { analyzeCV, extractTextFromCV } from '@/lib/cv-analysis-service'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Upload,
  ArrowLeft,
  ArrowRight,
  FileText,
  User,
  GraduationCap,
  Briefcase,
  XCircle,
  Loader2,
  File,
} from 'lucide-react'

const statusConfig = {
  brouillon: { icon: Clock, color: 'text-muted-foreground', bgColor: 'bg-muted', label: 'Brouillon' },
  soumise: { icon: Clock, color: 'text-primary', bgColor: 'bg-primary/10', label: 'En attente de révision' },
  en_revision: { icon: AlertCircle, color: 'text-orange-500', bgColor: 'bg-orange-50', label: 'En cours de révision' },
  acceptee: { icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-50', label: 'Acceptée' },
  refusee: { icon: XCircle, color: 'text-destructive', bgColor: 'bg-red-50', label: 'Refusée' },
}

export default function CandidaturePage() {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [cvText, setCvText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const [formData, setFormData] = useState({
    // Step 1: Personal info
    dateNaissance: '',
    adresse: '',
    ville: '',
    codePostal: '',
    telephone: '',
    // Step 2: Education
    ecole: '',
    niveau: '',
    specialite: '',
    annee: '',
    // Step 3: Preferences
    dateDebut: '',
    dateFin: '',
    departementSouhaite: '',
    sujetSouhaite: '',
    motivation: '',
  })

  if (!user) return null

  const existingCandidature = mockCandidatures.find(c => c.stagiaireId === user.id)

  // Handle CV file upload
  const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      const file = files[0]
      if (file.size > 5 * 1024 * 1024) {
        alert('Le fichier est trop volumineux (max 5 Mo)')
        return
      }
      
      if (!['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        alert('Veuillez télécharger un fichier PDF, TXT ou Word')
        return
      }
      
      setCvFile(file)
      
      // Read file content
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        setCvText(content)
      }
      reader.readAsText(file)
    }
  }

  const handleCVAnalysis = async () => {
    if (!cvText) {
      alert('Veuillez télécharger un CV')
      return
    }

    setIsAnalyzing(true)
    try {
      console.log('[v0] Starting CV analysis')
      const analysis = await analyzeCV(cvText, `${user.prenom} ${user.nom}`, formData.departementSouhaite || 'Général')
      console.log('[v0] Analysis completed:', analysis)
      
      // Store analysis result in formData or state for later
      // For now, we'll just proceed to next step
      setCurrentStep(4) // Move to review step
    } catch (error) {
      console.error('[v0] CV analysis error:', error)
      alert('Erreur lors de l\'analyse du CV. Veuillez réessayer.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // If candidature exists and is not a draft, show status
  if (existingCandidature && existingCandidature.status !== 'brouillon') {
    const status = statusConfig[existingCandidature.status]
    const StatusIcon = status.icon

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ma candidature</h1>
          <p className="mt-1 text-muted-foreground">
            Suivi de votre candidature au programme de stage RIF
          </p>
        </div>

        {/* Status card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-full ${status.bgColor}`}>
                <StatusIcon className={`h-8 w-8 ${status.color}`} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{status.label}</h2>
                <p className="text-muted-foreground">
                  {existingCandidature.status === 'soumise' && 
                    'Votre candidature est en cours d\'examen par l\'équipe RH.'}
                  {existingCandidature.status === 'acceptee' && 
                    'Félicitations ! Votre candidature a été acceptée.'}
                  {existingCandidature.status === 'refusee' && 
                    'Nous sommes désolés, votre candidature n\'a pas été retenue.'}
                  {existingCandidature.status === 'en_revision' && 
                    'L\'équipe RH examine actuellement votre dossier.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Candidature details */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date de naissance</span>
                <span>{existingCandidature.informationsPersonnelles?.dateNaissance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Adresse</span>
                <span>{existingCandidature.informationsPersonnelles?.adresse}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ville</span>
                <span>
                  {existingCandidature.informationsPersonnelles?.codePostal}{' '}
                  {existingCandidature.informationsPersonnelles?.ville}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Formation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">École</span>
                <span>{existingCandidature.formation?.ecole}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Niveau</span>
                <span>{existingCandidature.formation?.niveau}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Spécialité</span>
                <span>{existingCandidature.formation?.specialite}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Préférences de stage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Période souhaitée</span>
                <span>
                  {existingCandidature.preferencesStage?.dateDebut} au{' '}
                  {existingCandidature.preferencesStage?.dateFin}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Département souhaité</span>
                <span>{existingCandidature.preferencesStage?.departementSouhaite}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sujet souhaité</span>
                <span>{existingCandidature.preferencesStage?.sujetSouhaite}</span>
              </div>
              <div className="pt-2">
                <span className="text-muted-foreground block mb-1">Motivation</span>
                <p className="text-foreground">{existingCandidature.preferencesStage?.motivation}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Historique</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <div className="flex-1 w-0.5 bg-border" />
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium">Candidature soumise</p>
                  <p className="text-xs text-muted-foreground">
                    {existingCandidature.dateSoumission}
                  </p>
                </div>
              </div>
              {existingCandidature.dateDecision && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      existingCandidature.status === 'acceptee' ? 'bg-green-500' : 'bg-destructive'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {existingCandidature.status === 'acceptee' ? 'Candidature acceptée' : 'Candidature refusée'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {existingCandidature.dateDecision}
                    </p>
                    {existingCandidature.commentairesRH && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Note RH: {existingCandidature.commentairesRH}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show form for new candidature or draft
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setShowSuccess(true)
  }

  const steps = [
    { number: 1, title: 'Informations personnelles', icon: User },
    { number: 2, title: 'Formation et CV', icon: GraduationCap },
    { number: 3, title: 'Préférences de stage', icon: Briefcase },
    { number: 4, title: 'Récapitulatif', icon: FileText },
  ]

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardContent className="pt-12 pb-8">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Candidature envoyée !
            </h2>
            <p className="text-muted-foreground mb-6">
              Votre candidature a été soumise avec succès. L'équipe RH l'examinera dans les plus brefs délais.
              Vous recevrez une notification dès qu'une décision sera prise.
            </p>
            <Button onClick={() => window.location.reload()}>
              Voir ma candidature
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Nouvelle candidature</h1>
        <p className="mt-1 text-muted-foreground">
          Complétez le formulaire en 3 étapes pour soumettre votre candidature
        </p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center justify-center gap-4 py-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step.number
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {currentStep > step.number ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span className={`text-sm hidden sm:block ${
                currentStep >= step.number ? 'text-foreground font-medium' : 'text-muted-foreground'
              }`}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 sm:w-24 h-1 mx-2 rounded ${
                currentStep > step.number ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Form steps */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>
            Étape {currentStep} sur 3
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dateNaissance">Date de naissance</Label>
                  <Input
                    id="dateNaissance"
                    type="date"
                    value={formData.dateNaissance}
                    onChange={(e) => handleChange('dateNaissance', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    type="tel"
                    placeholder="06 00 00 00 00"
                    value={formData.telephone}
                    onChange={(e) => handleChange('telephone', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse</Label>
                <Input
                  id="adresse"
                  placeholder="12 rue des Lilas"
                  value={formData.adresse}
                  onChange={(e) => handleChange('adresse', e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="codePostal">Code postal</Label>
                  <Input
                    id="codePostal"
                    placeholder="33000"
                    value={formData.codePostal}
                    onChange={(e) => handleChange('codePostal', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ville">Ville</Label>
                  <Input
                    id="ville"
                    placeholder="Bordeaux"
                    value={formData.ville}
                    onChange={(e) => handleChange('ville', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Education */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ecole">Établissement</Label>
                <Input
                  id="ecole"
                  placeholder="Nom de votre école ou université"
                  value={formData.ecole}
                  onChange={(e) => handleChange('ecole', e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="niveau">Niveau d'études</Label>
                  <Select value={formData.niveau} onValueChange={(v) => handleChange('niveau', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bac+1">Bac+1</SelectItem>
                      <SelectItem value="Bac+2">Bac+2</SelectItem>
                      <SelectItem value="Bac+3">Bac+3</SelectItem>
                      <SelectItem value="Bac+4">Bac+4</SelectItem>
                      <SelectItem value="Bac+5">Bac+5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annee">Année en cours</Label>
                  <Input
                    id="annee"
                    placeholder="2024"
                    value={formData.annee}
                    onChange={(e) => handleChange('annee', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialite">Spécialité</Label>
                <Input
                  id="specialite"
                  placeholder="Informatique, Marketing, Finance..."
                  value={formData.specialite}
                  onChange={(e) => handleChange('specialite', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>CV (PDF, Word ou TXT)</Label>
                <div className="space-y-3">
                  {cvFile ? (
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <File className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{cvFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(cvFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCvFile(null)
                          setCvText('')
                        }}
                      >
                        ✕
                      </Button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleCVUpload}
                        className="hidden"
                      />
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Cliquez ou déposez votre CV ici
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, Word ou TXT uniquement, max 5 Mo
                      </p>
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dateDebut">Date de début souhaitée</Label>
                  <Input
                    id="dateDebut"
                    type="date"
                    value={formData.dateDebut}
                    onChange={(e) => handleChange('dateDebut', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFin">Date de fin souhaitée</Label>
                  <Input
                    id="dateFin"
                    type="date"
                    value={formData.dateFin}
                    onChange={(e) => handleChange('dateFin', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="departementSouhaite">Département souhaité</Label>
                <Select 
                  value={formData.departementSouhaite} 
                  onValueChange={(v) => handleChange('departementSouhaite', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un département" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTEMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sujetSouhaite">Sujet de stage souhaité</Label>
                <Input
                  id="sujetSouhaite"
                  placeholder="Décrivez brièvement le type de mission souhaitée"
                  value={formData.sujetSouhaite}
                  onChange={(e) => handleChange('sujetSouhaite', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivation">Lettre de motivation</Label>
                <Textarea
                  id="motivation"
                  placeholder="Expliquez vos motivations pour ce stage..."
                  rows={6}
                  value={formData.motivation}
                  onChange={(e) => handleChange('motivation', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(s => s - 1)}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Précédent
            </Button>
            
            {currentStep < 3 ? (
              <Button onClick={() => setCurrentStep(s => s + 1)}>
                Suivant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Envoi en cours...' : 'Soumettre ma candidature'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
