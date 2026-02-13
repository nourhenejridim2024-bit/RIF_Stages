'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  ClipboardList,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  User,
  Calendar,
  Loader2,
} from 'lucide-react'

const statusConfig: any = {
  a_faire: { label: 'À faire', icon: Circle, color: 'text-muted-foreground' },
  en_cours: { label: 'En cours', icon: Clock, color: 'text-orange-500' },
  termine: { label: 'Terminé', icon: CheckCircle2, color: 'text-green-600' },
}

export default function OnboardingPage() {
  const { user } = useAuth()
  const [taches, setTaches] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [tuteur, setTuteur] = useState<any>(null)

  useEffect(() => {
    if (user?.id) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      setIsLoading(true)

      // Fetch tasks
      const resTasks = await fetch(`/api/onboarding?stagiaireId=${user?.id}`)
      if (resTasks.ok) {
        const data = await resTasks.json()
        setTaches(data || [])
      }

      // Try to find the tutor if tasks exist
      const resTuteur = await fetch(`/api/tuteur/info?stagiaireId=${user?.id}`)
      if (resTuteur.ok) {
        const data = await resTuteur.json()
        setTuteur(data.tuteur)
      }
    } catch (error) {
      console.error("Failed to fetch onboarding data", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (taches.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mon onboarding</h1>
          <p className="mt-1 text-muted-foreground">
            Suivez votre progression d'intégration
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Votre checklist d'onboarding n'est pas encore disponible. Elle sera créée par votre
            tuteur une fois votre convention signée et votre stage commencé.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const tachesTerminees = taches.filter(t => t.status === 'termine').length
  const tachesEnCours = taches.filter(t => t.status === 'en_cours').length
  const progress = taches.length > 0 ? (tachesTerminees / taches.length) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mon onboarding</h1>
          <p className="mt-1 text-muted-foreground">
            Suivez votre progression d'intégration
          </p>
        </div>
        {tuteur && (
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Tuteur assigné</p>
              <p className="text-sm font-semibold">{tuteur.prenom} {tuteur.nom}</p>
            </div>
          </div>
        )}
      </div>

      {/* Progress overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Progression globale</h2>
              <p className="text-sm text-muted-foreground">
                {tachesTerminees} sur {taches.length} tâches complétées
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-primary">{Math.round(progress)}%</span>
            </div>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between mt-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>{tachesTerminees} terminées</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span>{tachesEnCours} en cours</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-muted-foreground" />
              <span>{taches.length - tachesTerminees - tachesEnCours} à faire</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Checklist d'intégration
          </CardTitle>
          <CardDescription>
            Tâches à réaliser durant votre stage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {taches.sort((a, b) => (a.ordre || 0) - (b.ordre || 0)).map((tache) => {
              const status = statusConfig[tache.status] || statusConfig.a_faire
              const StatusIcon = status.icon

              return (
                <div
                  key={tache.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border ${tache.status === 'termine'
                    ? 'bg-green-50/50 border-green-200'
                    : tache.status === 'en_cours'
                      ? 'bg-orange-50/50 border-orange-200'
                      : 'bg-card border-border'
                    }`}
                >
                  <div className="mt-0.5">
                    <StatusIcon className={`h-5 w-5 ${status.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`font-medium ${tache.status === 'termine' ? 'text-green-800' : 'text-foreground'
                        }`}>
                        {tache.description}
                      </p>
                      <Badge
                        variant={tache.status === 'termine' ? 'default' : 'secondary'}
                        className="shrink-0"
                      >
                        {status.label}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-1 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Période: {tache.dateDebut ? new Date(tache.dateDebut).toLocaleDateString('fr-FR') : '...'} au {tache.dateFin ? new Date(tache.dateFin).toLocaleDateString('fr-FR') : '...'}
                      </span>
                    </div>
                    {tache.notes && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        Note: {tache.notes}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
