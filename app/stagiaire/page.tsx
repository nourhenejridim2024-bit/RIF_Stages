'use client'

import { useAuth } from '@/lib/auth-context'
import { mockCandidatures, mockConventions, mockTachesOnboarding } from '@/lib/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import {
  FileText,
  FileCheck,
  ClipboardList,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react'

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  brouillon: { label: 'Brouillon', variant: 'secondary' },
  soumise: { label: 'Soumise', variant: 'default' },
  en_revision: { label: 'En révision', variant: 'outline' },
  acceptee: { label: 'Acceptée', variant: 'default' },
  refusee: { label: 'Refusée', variant: 'destructive' },
}

export default function StagiaireDashboard() {
  const { user } = useAuth()

  if (!user) return null

  // Get stagiaire's data
  const candidature = mockCandidatures.find(c => c.stagiaireId === user.id)
  const convention = mockConventions.find(c => c.stagiaireId === user.id)
  const taches = mockTachesOnboarding.filter(t => t.stagiaireId === user.id)

  const tachesTerminees = taches.filter(t => t.status === 'termine').length
  const onboardingProgress = taches.length > 0 ? (tachesTerminees / taches.length) * 100 : 0

  // Determine stage status
  const getStageStatus = () => {
    if (!candidature) return { step: 1, label: 'Pas de candidature' }
    if (candidature.status === 'brouillon') return { step: 1, label: 'Candidature en cours' }
    if (candidature.status === 'soumise') return { step: 2, label: 'Candidature en attente' }
    if (candidature.status === 'refusee') return { step: 2, label: 'Candidature refusée' }
    if (!convention || convention.status !== 'signee_complete') return { step: 3, label: 'Convention à signer' }
    if (onboardingProgress < 100) return { step: 4, label: 'Onboarding en cours' }
    return { step: 5, label: 'Stage en cours' }
  }

  const stageStatus = getStageStatus()

  const quickActions = [
    {
      title: 'Ma candidature',
      description: candidature ? 'Voir le statut de ma candidature' : 'Déposer ma candidature',
      href: '/stagiaire/candidature',
      icon: FileText,
      status: candidature ? statusLabels[candidature.status] : null,
    },
    {
      title: 'Convention',
      description: convention ? 'Consulter ma convention' : 'Non disponible',
      href: '/stagiaire/convention',
      icon: FileCheck,
      disabled: !convention,
    },
    {
      title: 'Onboarding',
      description: taches.length > 0 ? `${tachesTerminees}/${taches.length} tâches complétées` : 'Non disponible',
      href: '/stagiaire/onboarding',
      icon: ClipboardList,
      disabled: taches.length === 0,
      progress: onboardingProgress,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Bonjour, {user.prenom} !
        </h1>
        <p className="mt-1 text-muted-foreground">
          Bienvenue sur votre espace stagiaire RIF-Stages
        </p>
      </div>

      {/* Status overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Statut de votre parcours</CardTitle>
          <CardDescription>{stageStatus.label}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex-1 flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step < stageStatus.step
                      ? 'bg-primary text-primary-foreground'
                      : step === stageStatus.step
                      ? 'bg-primary/20 text-primary border-2 border-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step < stageStatus.step ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    step
                  )}
                </div>
                {step < 5 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${
                      step < stageStatus.step ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 text-xs text-muted-foreground">
            <span>Candidature</span>
            <span>Validation</span>
            <span>Convention</span>
            <span>Onboarding</span>
            <span>Stage</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid gap-4 md:grid-cols-3">
        {quickActions.map((action) => (
          <Card 
            key={action.title} 
            className={action.disabled ? 'opacity-60' : 'hover:shadow-md transition-shadow'}
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">{action.title}</CardTitle>
                  <CardDescription className="text-sm mt-0.5">
                    {action.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {action.status && (
                <Badge variant={action.status.variant} className="mb-3">
                  {action.status.label}
                </Badge>
              )}
              {action.progress !== undefined && (
                <div className="mb-3">
                  <Progress value={action.progress} className="h-2" />
                </div>
              )}
              <Link href={action.href}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full bg-transparent"
                  disabled={action.disabled}
                >
                  Accéder
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming tasks & info */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Next tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Prochaines étapes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {!candidature && (
                <li className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Déposer votre candidature</p>
                    <p className="text-xs text-muted-foreground">
                      Complétez le formulaire en 3 étapes
                    </p>
                  </div>
                </li>
              )}
              {candidature?.status === 'acceptee' && convention?.status !== 'signee_complete' && (
                <li className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Signer votre convention</p>
                    <p className="text-xs text-muted-foreground">
                      Votre convention est prête à être signée
                    </p>
                  </div>
                </li>
              )}
              {taches.filter(t => t.status === 'a_faire' || t.status === 'en_cours').slice(0, 3).map((tache) => (
                <li key={tache.id} className="flex items-start gap-3">
                  <ClipboardList className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{tache.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Échéance: {new Date(tache.echeance).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </li>
              ))}
              {!candidature && taches.length === 0 && (
                <li className="text-sm text-muted-foreground">
                  Aucune tâche en attente pour le moment
                </li>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Important dates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Dates importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {convention && (
                <>
                  <li className="flex items-center justify-between">
                    <span className="text-sm">Début du stage</span>
                    <span className="text-sm font-medium">
                      {new Date(convention.contenu.dateDebut).toLocaleDateString('fr-FR')}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-sm">Fin du stage</span>
                    <span className="text-sm font-medium">
                      {new Date(convention.contenu.dateFin).toLocaleDateString('fr-FR')}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-sm">Département</span>
                    <span className="text-sm font-medium">
                      {convention.contenu.departement}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-sm">Tuteur</span>
                    <span className="text-sm font-medium">
                      {convention.contenu.tuteurNom}
                    </span>
                  </li>
                </>
              )}
              {!convention && (
                <li className="text-sm text-muted-foreground">
                  Les dates seront affichées une fois votre candidature acceptée
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
