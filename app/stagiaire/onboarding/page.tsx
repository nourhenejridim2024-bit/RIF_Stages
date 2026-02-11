'use client'

import { useAuth } from '@/lib/auth-context'
import { mockTachesOnboarding, mockTuteurs, mockConventions } from '@/lib/mock-data'
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
} from 'lucide-react'

const statusConfig = {
  a_faire: { label: 'À faire', icon: Circle, color: 'text-muted-foreground' },
  en_cours: { label: 'En cours', icon: Clock, color: 'text-orange-500' },
  termine: { label: 'Terminé', icon: CheckCircle2, color: 'text-green-600' },
}

export default function OnboardingPage() {
  const { user } = useAuth()

  if (!user) return null

  const taches = mockTachesOnboarding.filter(t => t.stagiaireId === user.id)
  const convention = mockConventions.find(c => c.stagiaireId === user.id)
  const tuteur = convention 
    ? mockTuteurs.find(t => t.nom + ' ' + t.prenom === convention.contenu.tuteurNom || 
        t.prenom + ' ' + t.nom === convention.contenu.tuteurNom)
    : null

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
  const progress = (tachesTerminees / taches.length) * 100

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mon onboarding</h1>
        <p className="mt-1 text-muted-foreground">
          Suivez votre progression d'intégration
        </p>
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

      {/* Tutor info */}
      {tuteur && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Votre tuteur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary">
                  {tuteur.prenom.charAt(0)}{tuteur.nom.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium">{tuteur.prenom} {tuteur.nom}</p>
                <p className="text-sm text-muted-foreground">{tuteur.poste}</p>
                <p className="text-sm text-muted-foreground">{tuteur.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Checklist d'intégration
          </CardTitle>
          <CardDescription>
            Tâches à réaliser durant votre première semaine
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {taches.sort((a, b) => a.ordre - b.ordre).map((tache) => {
              const status = statusConfig[tache.status]
              const StatusIcon = status.icon

              return (
                <div
                  key={tache.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border ${
                    tache.status === 'termine' 
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
                      <p className={`font-medium ${
                        tache.status === 'termine' ? 'text-green-800' : 'text-foreground'
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
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Échéance: {new Date(tache.echeance).toLocaleDateString('fr-FR')}
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
