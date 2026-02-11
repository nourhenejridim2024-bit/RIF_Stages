'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  mockStagiaires,
  mockEvaluations,
} from '@/lib/mock-data'
import type { Tuteur, Evaluation } from '@/lib/types'
import {
  Award,
  Star,
  CheckCircle,
  FileText,
  Download,
  Users,
  Brain,
  Handshake,
} from 'lucide-react'

export default function TuteurEvaluationsPage() {
  const { user } = useAuth()
  const tuteur = user as Tuteur
  const searchParams = useSearchParams()
  const stagiaireIdParam = searchParams.get('stagiaire')

  const mesStagiaires = mockStagiaires.filter(s => s.tuteurId === tuteur?.id)
  const [evaluations, setEvaluations] = useState<Evaluation[]>(
    mockEvaluations.filter(e => e.tuteurId === tuteur?.id)
  )
  const [selectedStagiaire, setSelectedStagiaire] = useState<string>(
    stagiaireIdParam || mesStagiaires[0]?.id || ''
  )
  const [showForm, setShowForm] = useState(false)
  const [successDialog, setSuccessDialog] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    competencesTechniques: 3,
    autonomie: 3,
    integrationEquipe: 3,
    commentaires: '',
  })

  const stagiaire = mesStagiaires.find(s => s.id === selectedStagiaire)
  const existingEvaluation = evaluations.find(e => e.stagiaireId === selectedStagiaire)

  const handleSubmitEvaluation = () => {
    const newEvaluation: Evaluation = {
      id: `eval-new-${Date.now()}`,
      stagiaireId: selectedStagiaire,
      tuteurId: tuteur?.id || '',
      competencesTechniques: formData.competencesTechniques,
      autonomie: formData.autonomie,
      integrationEquipe: formData.integrationEquipe,
      commentaires: formData.commentaires,
      date: new Date().toISOString().split('T')[0],
      certificatGenere: false,
    }

    setEvaluations(prev => [...prev, newEvaluation])
    setShowForm(false)
    setSuccessDialog(true)
    setFormData({
      competencesTechniques: 3,
      autonomie: 3,
      integrationEquipe: 3,
      commentaires: '',
    })
  }

  const renderStars = (value: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= value ? 'fill-chart-4 text-chart-4' : 'text-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    )
  }

  const getMoyenne = (eval_: Evaluation) => {
    return ((eval_.competencesTechniques + eval_.autonomie + eval_.integrationEquipe) / 3).toFixed(1)
  }

  if (mesStagiaires.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Évaluations</h1>
          <p className="text-muted-foreground mt-1">
            Évaluez vos stagiaires en fin de stage
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun stagiaire</h3>
            <p className="text-muted-foreground text-center">
              Vous n'avez pas encore de stagiaire à évaluer.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Évaluations</h1>
        <p className="text-muted-foreground mt-1">
          Évaluez vos stagiaires en fin de stage
        </p>
      </div>

      {/* Stagiaire Tabs */}
      {mesStagiaires.length > 1 && (
        <Tabs value={selectedStagiaire} onValueChange={setSelectedStagiaire}>
          <TabsList>
            {mesStagiaires.map((s) => {
              const hasEval = evaluations.some(e => e.stagiaireId === s.id)
              return (
                <TabsTrigger key={s.id} value={s.id} className="relative">
                  {s.prenom} {s.nom}
                  {hasEval && (
                    <CheckCircle className="ml-2 h-4 w-4 text-accent" />
                  )}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>
      )}

      {existingEvaluation && !showForm ? (
        /* Existing Evaluation View */
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-chart-4" />
                  Évaluation de {stagiaire?.prenom} {stagiaire?.nom}
                </CardTitle>
                <CardDescription>
                  Réalisée le {new Date(existingEvaluation.date).toLocaleDateString('fr-FR')}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-lg px-3 py-1 bg-accent/10 text-accent border-accent/30">
                {getMoyenne(existingEvaluation)}/5
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Scores */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Compétences techniques</span>
                </div>
                {renderStars(existingEvaluation.competencesTechniques)}
                <p className="text-sm text-muted-foreground mt-1">
                  {existingEvaluation.competencesTechniques}/5
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-chart-4" />
                  <span className="text-sm font-medium">Autonomie</span>
                </div>
                {renderStars(existingEvaluation.autonomie)}
                <p className="text-sm text-muted-foreground mt-1">
                  {existingEvaluation.autonomie}/5
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Handshake className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">Intégration équipe</span>
                </div>
                {renderStars(existingEvaluation.integrationEquipe)}
                <p className="text-sm text-muted-foreground mt-1">
                  {existingEvaluation.integrationEquipe}/5
                </p>
              </div>
            </div>

            {/* Comments */}
            <div>
              <Label className="text-sm font-medium">Commentaires</Label>
              <div className="mt-2 p-4 rounded-lg bg-muted/50 text-sm">
                {existingEvaluation.commentaires}
              </div>
            </div>

            {/* Certificate */}
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Attestation de fin de stage</p>
                  <p className="text-sm text-muted-foreground">
                    {existingEvaluation.certificatGenere 
                      ? 'Attestation générée' 
                      : 'Attestation disponible'}
                  </p>
                </div>
              </div>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : showForm ? (
        /* Evaluation Form */
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Évaluer {stagiaire?.prenom} {stagiaire?.nom}
            </CardTitle>
            <CardDescription>
              Remplissez le formulaire d'évaluation de fin de stage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Competences Techniques */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary" />
                  Compétences techniques
                </Label>
                <span className="text-sm font-medium">{formData.competencesTechniques}/5</span>
              </div>
              <Slider
                value={[formData.competencesTechniques]}
                onValueChange={([value]) => setFormData(prev => ({ ...prev, competencesTechniques: value }))}
                min={1}
                max={5}
                step={1}
                className="py-4"
              />
              {renderStars(formData.competencesTechniques)}
            </div>

            {/* Autonomie */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-chart-4" />
                  Autonomie
                </Label>
                <span className="text-sm font-medium">{formData.autonomie}/5</span>
              </div>
              <Slider
                value={[formData.autonomie]}
                onValueChange={([value]) => setFormData(prev => ({ ...prev, autonomie: value }))}
                min={1}
                max={5}
                step={1}
                className="py-4"
              />
              {renderStars(formData.autonomie)}
            </div>

            {/* Integration */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Handshake className="h-4 w-4 text-accent" />
                  Intégration dans l'équipe
                </Label>
                <span className="text-sm font-medium">{formData.integrationEquipe}/5</span>
              </div>
              <Slider
                value={[formData.integrationEquipe]}
                onValueChange={([value]) => setFormData(prev => ({ ...prev, integrationEquipe: value }))}
                min={1}
                max={5}
                step={1}
                className="py-4"
              />
              {renderStars(formData.integrationEquipe)}
            </div>

            {/* Commentaires */}
            <div className="space-y-2">
              <Label>Commentaires et appréciation générale</Label>
              <Textarea
                placeholder="Décrivez le parcours du stagiaire, ses points forts, axes d'amélioration..."
                value={formData.commentaires}
                onChange={(e) => setFormData(prev => ({ ...prev, commentaires: e.target.value }))}
                rows={5}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                Annuler
              </Button>
              <Button 
                onClick={handleSubmitEvaluation} 
                className="flex-1"
                disabled={!formData.commentaires.trim()}
              >
                Soumettre l'évaluation
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* No Evaluation Yet - Prompt */
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Évaluation de {stagiaire?.prenom} {stagiaire?.nom}
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Ce stagiaire n'a pas encore été évalué. Complétez l'évaluation 
              de fin de stage pour générer son attestation.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Award className="mr-2 h-4 w-4" />
              Commencer l'évaluation
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Success Dialog */}
      <Dialog open={successDialog} onOpenChange={setSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-accent" />
            </div>
            <DialogTitle className="text-center">Évaluation enregistrée</DialogTitle>
            <DialogDescription className="text-center">
              L'évaluation de {stagiaire?.prenom} {stagiaire?.nom} a été 
              enregistrée avec succès. L'attestation de fin de stage peut 
              maintenant être téléchargée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button onClick={() => setSuccessDialog(false)}>
              Voir l'évaluation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
