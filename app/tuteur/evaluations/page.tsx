'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Award,
  Star,
  CheckCircle,
  Loader2,
  Brain,
  Timer,
  ShieldCheck,
  Zap,
  Users,
  Briefcase,
  AlertCircle,
  Save,
  Send,
  Edit3,
} from 'lucide-react'

const criteriaList = [
  { id: 'assiduite', label: 'Assiduité et Ponctualité', icon: Timer },
  { id: 'qualiteTravail', label: 'Qualité du travail rendu', icon: Briefcase },
  { id: 'autonomie', label: "Esprit d'initiative et Autonomie", icon: Zap },
  { id: 'relationnel', label: 'Intégration et Relationnel', icon: Users },
  { id: 'competencesTech', label: 'Compétences techniques', icon: Brain },
  { id: 'apprentissage', label: "Capacité d'apprentissage", icon: ShieldCheck },
  { id: 'discipline', label: 'Respect des consignes et Discipline', icon: AlertCircle },
]

export default function TuteurEvaluationsPage() {
  const { user } = useAuth()
  const [mesStagiaires, setMesStagiaires] = useState<any[]>([])
  const [selectedStagiaire, setSelectedStagiaire] = useState<string>('') // Format: type_id
  const [evaluation, setEvaluation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEvalLoading, setIsEvalLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [successDialog, setSuccessDialog] = useState(false)
  const [dialogMessage, setDialogMessage] = useState('')

  // Form state
  const [formData, setFormData] = useState<any>({
    assiduite: 3,
    qualiteTravail: 3,
    autonomie: 3,
    relationnel: 3,
    competencesTech: 3,
    apprentissage: 3,
    discipline: 3,
    commentaires: '',
  })

  useEffect(() => {
    if (user?.id) {
      fetchStagiaires()
    }
  }, [user])

  useEffect(() => {
    if (selectedStagiaire) {
      fetchEvaluation()
    }
  }, [selectedStagiaire])

  const fetchStagiaires = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/tuteur/stagiaires?tuteurId=${user?.id}`)
      if (res.ok) {
        const data = await res.json()
        const unified = [
          ...(data.stagiaires || []).map((s: any) => ({ ...s, entityType: 'user', unifiedId: `user_${s.id}` })),
          ...(data.candidatures || []).map((c: any) => ({ ...c, entityType: 'cand', unifiedId: `cand_${c.id}` }))
        ]
        setMesStagiaires(unified)
        if (unified.length > 0 && !selectedStagiaire) {
          setSelectedStagiaire(unified[0].unifiedId)
        }
      }
    } catch (error) {
      console.error("Failed to fetch stagiaires", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchEvaluation = async () => {
    try {
      const [type, id] = selectedStagiaire.split('_')
      const queryParam = type === 'user' ? `stagiaireId=${id}` : `candidatureId=${id}`

      setIsEvalLoading(true)
      const res = await fetch(`/api/evaluation?${queryParam}`)
      if (res.ok) {
        const data = await res.json()
        setEvaluation(data || null)
        if (data) {
          setFormData({
            assiduite: data.assiduite,
            qualiteTravail: data.qualiteTravail,
            autonomie: data.autonomie,
            relationnel: data.relationnel,
            competencesTech: data.competencesTech,
            apprentissage: data.apprentissage,
            discipline: data.discipline,
            commentaires: data.commentaires || '',
          })
          setShowForm(false)
        } else {
          resetFormData()
          setShowForm(true)
        }
      }
    } catch (error) {
      console.error("Failed to fetch evaluation", error)
    } finally {
      setIsEvalLoading(false)
    }
  }

  const resetFormData = () => {
    setFormData({
      assiduite: 3,
      qualiteTravail: 3,
      autonomie: 3,
      relationnel: 3,
      competencesTech: 3,
      apprentissage: 3,
      discipline: 3,
      commentaires: '',
    })
  }

  const calculateGlobalScore = () => {
    const scores = [
      formData.assiduite,
      formData.qualiteTravail,
      formData.autonomie,
      formData.relationnel,
      formData.competencesTech,
      formData.apprentissage,
      formData.discipline
    ]
    const sum = scores.reduce((a, b) => a + Number(b), 0)
    return (sum / scores.length).toFixed(1)
  }

  const handleSubmitEvaluation = async (status: 'brouillon' | 'envoye') => {
    try {
      setIsSubmitting(true)
      const [type, id] = selectedStagiaire.split('_')

      const res = await fetch('/api/evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          stagiaireId: type === 'user' ? id : null,
          candidatureId: type === 'cand' ? id : null,
          tuteurId: user?.id,
          globalScore: parseFloat(calculateGlobalScore()),
          status: status
        })
      })

      if (res.ok) {
        const data = await res.json()
        setEvaluation(data)
        setShowForm(false)
        setDialogMessage(status === 'envoye'
          ? "L'évaluation a été envoyée au stagiaire. Elle est maintenant visible sur son interface."
          : "L'évaluation a été enregistrée en tant que brouillon.")
        setSuccessDialog(true)
      } else {
        const err = await res.json()
        alert(`Erreur: ${err.error || 'Une erreur est survenue'}`)
      }
    } catch (error) {
      console.error("Failed to save evaluation", error)
      alert("Une erreur de réseau est survenue lors de l'enregistrement.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (value: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${star <= value ? 'fill-chart-4 text-chart-4' : 'text-muted-foreground/30'
              }`}
          />
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const currentEntity = mesStagiaires.find(s => s.unifiedId === selectedStagiaire)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Évaluations</h1>
        <p className="text-muted-foreground mt-1">
          Évaluez vos stagiaires et candidats sur leurs compétences et leur comportement
        </p>
      </div>

      {mesStagiaires.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun stagiaire ou candidat</h3>
            <p className="text-muted-foreground text-center">
              Vous n'avez pas encore de profils assignés à évaluer.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs value={selectedStagiaire} onValueChange={setSelectedStagiaire}>
            <TabsList className="flex-wrap h-auto bg-muted/50 p-1">
              {mesStagiaires.map((s) => (
                <TabsTrigger key={s.unifiedId} value={s.unifiedId} className="relative">
                  {s.prenom} {s.nom}
                  {s.entityType === 'cand' && (
                    <Badge variant="outline" className="ml-2 scale-75 origin-left bg-blue-50 text-blue-600 border-blue-200">
                      Candidat
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {isEvalLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : evaluation && !showForm ? (
            <Card className={evaluation.status === 'brouillon' ? 'border-amber-200 bg-amber-50/20' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className={`h-5 w-5 ${evaluation.status === 'envoye' ? 'text-chart-4' : 'text-amber-500'}`} />
                      Évaluation de {currentEntity?.prenom} {currentEntity?.nom}
                      {evaluation.status === 'brouillon' ? (
                        <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
                          Brouillon
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                          Envoyée au stagiaire
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Dernière mise à jour le {new Date(evaluation.updatedAt).toLocaleDateString('fr-FR')}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Score Global</p>
                    <Badge variant="outline" className="text-xl px-4 py-1 bg-chart-4/10 text-chart-4 border-chart-4/30">
                      {evaluation.globalScore}/5
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {criteriaList.map((c) => (
                    <div key={c.id} className="p-4 rounded-lg bg-white border shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <c.icon className="h-4 w-4 text-primary" />
                        <span className="text-xs font-semibold uppercase tracking-wider">{c.label}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        {renderStars(evaluation[c.id])}
                        <span className="text-sm font-bold">{evaluation[c.id]}/5</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Commentaires</Label>
                  <div className="p-4 rounded-lg bg-muted/30 text-sm italic min-h-[100px] border">
                    {evaluation.commentaires || "Aucun commentaire laissé."}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button onClick={() => setShowForm(true)} variant="outline">
                    <Edit3 className="mr-2 h-4 w-4" />
                    Modifier l'évaluation
                  </Button>
                  {evaluation.status === 'brouillon' && (
                    <Button onClick={() => handleSubmitEvaluation('envoye')} className="bg-chart-4 hover:bg-chart-4/90">
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer au stagiaire
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {evaluation ? 'Modifier' : 'Nouvelle'} évaluation pour {currentEntity?.prenom} {currentEntity?.nom}
                    </CardTitle>
                    <CardDescription>
                      Notez chaque critère de 1 à 5
                    </CardDescription>
                  </div>
                  {evaluation && (
                    <Badge variant="outline" className={evaluation.status === 'envoye' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}>
                      Mode édition ({evaluation.status})
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid gap-8 sm:grid-cols-2">
                  {criteriaList.map((c) => (
                    <div key={c.id} className="space-y-4 p-4 rounded-xl border bg-card/50">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2 font-semibold">
                          <c.icon className="h-5 w-5 text-primary" />
                          {c.label}
                        </Label>
                        <Badge variant="secondary" className="text-sm">{formData[c.id]}/5</Badge>
                      </div>
                      <Slider
                        value={[formData[c.id]]}
                        onValueChange={([val]) => setFormData((prev: any) => ({ ...prev, [c.id]: val }))}
                        min={1}
                        max={5}
                        step={1}
                        className="py-2"
                      />
                      <div className="flex justify-between">
                        {renderStars(formData[c.id])}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label>Commentaires et appréciation générale</Label>
                  <Textarea
                    placeholder="Points forts, axes d'amélioration, bilan global..."
                    value={formData.commentaires}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, commentaires: e.target.value }))}
                    rows={5}
                    className="resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-6 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Score calculé automatiquement</p>
                    <p className="text-2xl font-bold text-primary">{calculateGlobalScore()}/5</p>
                  </div>
                  <div className="flex gap-3">
                    {evaluation && (
                      <Button variant="ghost" onClick={() => setShowForm(false)}>
                        Annuler
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => handleSubmitEvaluation('brouillon')}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Enregistrer le brouillon
                    </Button>
                    <Button
                      onClick={() => handleSubmitEvaluation('envoye')}
                      className="bg-chart-4 hover:bg-chart-4/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                      Envoyer au stagiaire
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <Dialog open={successDialog} onOpenChange={setSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-chart-4/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-chart-4" />
            </div>
            <DialogTitle className="text-center">Action réussie</DialogTitle>
            <DialogDescription className="text-center">
              {dialogMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button onClick={() => setSuccessDialog(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
