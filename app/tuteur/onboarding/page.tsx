'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  mockStagiaires,
  mockTachesOnboarding,
} from '@/lib/mock-data'
import type { Tuteur, TacheOnboarding } from '@/lib/types'
import {
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Trash2,
} from 'lucide-react'

export default function TuteurOnboardingPage() {
  const { user } = useAuth()
  const tuteur = user as Tuteur
  
  const mesStagiaires = mockStagiaires.filter(s => s.tuteurId === tuteur?.id)
  const [taches, setTaches] = useState<TacheOnboarding[]>(
    mockTachesOnboarding.filter(t => t.tuteurId === tuteur?.id)
  )
  const [selectedStagiaire, setSelectedStagiaire] = useState<string>(
    mesStagiaires[0]?.id || ''
  )
  const [newTask, setNewTask] = useState({ description: '', echeance: '' })
  const [dialogOpen, setDialogOpen] = useState(false)

  const tachesStagiaire = taches.filter(t => t.stagiaireId === selectedStagiaire)
  const tachesTerminees = tachesStagiaire.filter(t => t.status === 'termine').length
  const progress = tachesStagiaire.length > 0 
    ? (tachesTerminees / tachesStagiaire.length) * 100 
    : 0

  const stagiaire = mesStagiaires.find(s => s.id === selectedStagiaire)

  const handleStatusChange = (tacheId: string, newStatus: TacheOnboarding['status']) => {
    setTaches(prev => prev.map(t => 
      t.id === tacheId ? { ...t, status: newStatus } : t
    ))
  }

  const handleAddTask = () => {
    if (!newTask.description || !newTask.echeance) return
    
    const newTache: TacheOnboarding = {
      id: `tache-new-${Date.now()}`,
      tuteurId: tuteur?.id || '',
      stagiaireId: selectedStagiaire,
      description: newTask.description,
      status: 'a_faire',
      echeance: newTask.echeance,
      notes: null,
      ordre: tachesStagiaire.length + 1,
    }
    
    setTaches(prev => [...prev, newTache])
    setNewTask({ description: '', echeance: '' })
    setDialogOpen(false)
  }

  const handleDeleteTask = (tacheId: string) => {
    setTaches(prev => prev.filter(t => t.id !== tacheId))
  }

  const getStatusColor = (status: TacheOnboarding['status']) => {
    switch (status) {
      case 'termine': return 'text-accent'
      case 'en_cours': return 'text-chart-4'
      default: return 'text-muted-foreground'
    }
  }

  const getStatusBg = (status: TacheOnboarding['status']) => {
    switch (status) {
      case 'termine': return 'bg-accent/10 border-accent/30'
      case 'en_cours': return 'bg-chart-4/10 border-chart-4/30'
      default: return 'bg-muted border-border'
    }
  }

  if (mesStagiaires.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Onboarding</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les tâches d'intégration de vos stagiaires
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun stagiaire</h3>
            <p className="text-muted-foreground text-center">
              Vous n'avez pas encore de stagiaire à onboarder.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Onboarding</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les tâches d'intégration de vos stagiaires
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une tâche
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle tâche d'onboarding</DialogTitle>
              <DialogDescription>
                Ajoutez une tâche pour {stagiaire?.prenom} {stagiaire?.nom}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Description de la tâche..."
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Échéance</label>
                <Input
                  type="date"
                  value={newTask.echeance}
                  onChange={(e) => setNewTask(prev => ({ ...prev, echeance: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddTask}>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stagiaire Tabs */}
      {mesStagiaires.length > 1 && (
        <Tabs value={selectedStagiaire} onValueChange={setSelectedStagiaire}>
          <TabsList>
            {mesStagiaires.map((s) => (
              <TabsTrigger key={s.id} value={s.id}>
                {s.prenom} {s.nom}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {/* Progress Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {stagiaire?.prenom} {stagiaire?.nom}
              </CardTitle>
              <CardDescription>{stagiaire?.specialite}</CardDescription>
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {Math.round(progress)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>{tachesTerminees} tâches terminées</span>
            <span>{tachesStagiaire.length - tachesTerminees} restantes</span>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tâches d'onboarding</CardTitle>
          <CardDescription>
            Cochez les tâches au fur et à mesure de leur réalisation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tachesStagiaire.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Aucune tâche définie</p>
              <p className="text-sm">Cliquez sur "Ajouter une tâche" pour commencer</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tachesStagiaire
                .sort((a, b) => a.ordre - b.ordre)
                .map((tache) => (
                <div
                  key={tache.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border transition-colors ${getStatusBg(tache.status)}`}
                >
                  <Checkbox
                    checked={tache.status === 'termine'}
                    onCheckedChange={(checked) => 
                      handleStatusChange(tache.id, checked ? 'termine' : 'a_faire')
                    }
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${tache.status === 'termine' ? 'line-through text-muted-foreground' : ''}`}>
                      {tache.description}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(tache.echeance).toLocaleDateString('fr-FR')}
                      </span>
                      <Badge
                        variant="secondary"
                        className={`${getStatusColor(tache.status)} bg-transparent`}
                      >
                        {tache.status === 'termine' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {tache.status === 'en_cours' && <Clock className="h-3 w-3 mr-1" />}
                        {tache.status === 'a_faire' && <AlertCircle className="h-3 w-3 mr-1" />}
                        {tache.status === 'termine' ? 'Terminé' : tache.status === 'en_cours' ? 'En cours' : 'À faire'}
                      </Badge>
                    </div>
                    {tache.notes && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        {tache.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {tache.status !== 'termine' && tache.status !== 'en_cours' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusChange(tache.id, 'en_cours')}
                        className="text-chart-4 hover:text-chart-4"
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTask(tache.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
