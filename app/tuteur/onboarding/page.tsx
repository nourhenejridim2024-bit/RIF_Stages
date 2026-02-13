'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Trash2,
  Loader2,
} from 'lucide-react'

export default function TuteurOnboardingPage() {
  const { user } = useAuth()
  const [mesStagiaires, setMesStagiaires] = useState<any[]>([])
  const [taches, setTaches] = useState<any[]>([])
  const [selectedStagiaire, setSelectedStagiaire] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isTasksLoading, setIsTasksLoading] = useState(false)
  const [newTask, setNewTask] = useState({ description: '', dateDebut: '', dateFin: '', notes: '' })
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    if (user?.id) {
      fetchStagiaires()
    }
  }, [user])

  useEffect(() => {
    if (selectedStagiaire) {
      fetchTasks()
    }
  }, [selectedStagiaire])

  const fetchStagiaires = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/tuteur/stagiaires?tuteurId=${user?.id}`)
      if (res.ok) {
        const data = await res.json()

        // Merge users and candidatures into a unified list
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

  const fetchTasks = async () => {
    try {
      if (!selectedStagiaire) return;
      setIsTasksLoading(true)
      const [type, id] = selectedStagiaire.split('_')
      const queryParam = type === 'user' ? `stagiaireId=${id}` : `candidatureId=${id}`

      const res = await fetch(`/api/onboarding?${queryParam}`)
      if (res.ok) {
        const data = await res.json()
        setTaches(data || [])
      }
    } catch (error) {
      console.error("Failed to fetch tasks", error)
    } finally {
      setIsTasksLoading(false)
    }
  }

  const stagiaire = mesStagiaires.find(s => s.unifiedId === selectedStagiaire)
  const tachesTerminees = taches.filter(t => t.status === 'termine').length
  const progress = taches.length > 0
    ? (tachesTerminees / taches.length) * 100
    : 0

  const handleStatusChange = async (tacheId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/onboarding/${tacheId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        setTaches(prev => prev.map(t =>
          t.id === tacheId ? { ...t, status: newStatus } : t
        ))
      }
    } catch (error) {
      console.error("Failed to update task status", error)
    }
  }

  const handleAddTask = async () => {
    if (!newTask.description || !selectedStagiaire) return

    const [type, id] = selectedStagiaire.split('_')

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTask,
          stagiaireId: type === 'user' ? id : null,
          candidatureId: type === 'cand' ? id : null,
          tuteurId: user?.id,
          ordre: taches.length
        })
      })

      if (res.ok) {
        const data = await res.json()
        setTaches(prev => [...prev, data])
        setNewTask({ description: '', dateDebut: '', dateFin: '', notes: '' })
        setDialogOpen(false)
      }
    } catch (error) {
      console.error("Failed to add task", error)
    }
  }

  const handleDeleteTask = async (tacheId: string) => {
    try {
      const res = await fetch(`/api/onboarding/${tacheId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setTaches(prev => prev.filter(t => t.id !== tacheId))
      }
    } catch (error) {
      console.error("Failed to delete task", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'termine': return 'text-accent'
      case 'en_cours': return 'text-chart-4'
      default: return 'text-muted-foreground'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'termine': return 'bg-accent/10 border-accent/30'
      case 'en_cours': return 'bg-chart-4/10 border-chart-4/30'
      default: return 'bg-muted border-border'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
        {!isLoading && mesStagiaires.length > 0 && (
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
                  Ajoutez une tâche pour {stagiaire?.prenom || (stagiaire?.name?.split(' ')[0])}
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date de début</label>
                    <Input
                      type="date"
                      value={newTask.dateDebut}
                      onChange={(e) => setNewTask(prev => ({ ...prev, dateDebut: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date de fin</label>
                    <Input
                      type="date"
                      value={newTask.dateFin}
                      onChange={(e) => setNewTask(prev => ({ ...prev, dateFin: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes (optionnel)</label>
                  <Textarea
                    placeholder="Notes ou instructions supplémentaires..."
                    value={newTask.notes}
                    onChange={(e) => setNewTask(prev => ({ ...prev, notes: e.target.value }))}
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
        )}
      </div>

      {mesStagiaires.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun stagiaire</h3>
            <p className="text-muted-foreground text-center">
              Vous n'avez pas encore de stagiaire ou candidat assigné.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stagiaire Tabs */}
          {mesStagiaires.length > 1 && (
            <Tabs value={selectedStagiaire} onValueChange={setSelectedStagiaire}>
              <TabsList className="mb-4">
                {mesStagiaires.map((s) => (
                  <TabsTrigger key={s.unifiedId} value={s.unifiedId}>
                    {s.prenom || s.name || s.email}
                    {s.entityType === 'cand' && <Badge variant="secondary" className="ml-2 text-[10px] h-4">Candidat</Badge>}
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
                  <CardTitle className="text-lg flex items-center gap-2">
                    {stagiaire?.prenom} {stagiaire?.nom}
                    {stagiaire?.entityType === 'cand' && <Badge variant="outline">Candidat assigné</Badge>}
                  </CardTitle>
                  <CardDescription>{stagiaire?.email}</CardDescription>
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
                <span>{taches.length - tachesTerminees} restantes</span>
              </div>
            </CardContent>
          </Card>

          {/* Tasks List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tâches d'onboarding</CardTitle>
              <CardDescription>
                Gérez les étapes d'intégration pour ce profil
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isTasksLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : taches.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Aucune tâche définie</p>
                  <p className="text-sm">Cliquez sur "Ajouter une tâche" pour commencer</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {taches
                    .sort((a, b) => (a.ordre || 0) - (b.ordre || 0))
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
                          <div className="flex flex-col gap-1 mt-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {tache.dateDebut ? new Date(tache.dateDebut).toLocaleDateString('fr-FR') : '...'} - {tache.dateFin ? new Date(tache.dateFin).toLocaleDateString('fr-FR') : '...'}
                              </span>
                            </div>
                            <Badge
                              variant="secondary"
                              className={`${getStatusColor(tache.status)} bg-transparent w-fit`}
                            >
                              {tache.status === 'termine' && <CheckCircle2 className="h-3 w-3 mr-1 text-accent" />}
                              {tache.status === 'en_cours' && <Clock className="h-3 w-3 mr-1 text-chart-4" />}
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
        </>
      )}
    </div>
  )
}
