'use client'

import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import {
  mockStagiaires,
  mockTachesOnboarding,
  mockEvaluations,
  mockConventions,
} from '@/lib/mock-data'
import type { Tuteur } from '@/lib/types'
import {
  Users,
  ClipboardList,
  Award,
  Calendar,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react'

export default function TuteurDashboardPage() {
  const { user } = useAuth()
  const tuteur = user as Tuteur

  // Get stagiaires assigned to this tutor
  const mesStagiaires = mockStagiaires.filter(s => s.tuteurId === tuteur?.id)
  
  // Get onboarding tasks
  const mesTaches = mockTachesOnboarding.filter(t => t.tuteurId === tuteur?.id)
  const tachesTerminees = mesTaches.filter(t => t.status === 'termine').length
  const tachesEnCours = mesTaches.filter(t => t.status === 'en_cours').length
  const tachesAFaire = mesTaches.filter(t => t.status === 'a_faire').length
  const progressOnboarding = mesTaches.length > 0 ? (tachesTerminees / mesTaches.length) * 100 : 0

  // Get evaluations done by this tutor
  const mesEvaluations = mockEvaluations.filter(e => e.tuteurId === tuteur?.id)
  const stagiairesEvalues = mesEvaluations.map(e => e.stagiaireId)
  const stagiairesNonEvalues = mesStagiaires.filter(s => !stagiairesEvalues.includes(s.id))

  const stats = [
    {
      label: 'Stagiaires encadrés',
      value: mesStagiaires.length,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Tâches onboarding',
      value: `${tachesTerminees}/${mesTaches.length}`,
      icon: ClipboardList,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Évaluations faites',
      value: mesEvaluations.length,
      icon: Award,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
    },
    {
      label: 'À évaluer',
      value: stagiairesNonEvalues.length,
      icon: Calendar,
      color: 'text-chart-5',
      bgColor: 'bg-chart-5/10',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Bonjour, {tuteur?.prenom}
        </h1>
        <p className="text-muted-foreground mt-1">
          Gérez vos stagiaires et suivez leur progression
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Mes Stagiaires */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Mes stagiaires</CardTitle>
              <CardDescription>Stagiaires que vous encadrez</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/tuteur/stagiaires">
                Voir tout
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {mesStagiaires.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>Aucun stagiaire assigné</p>
              </div>
            ) : (
              <div className="space-y-3">
                {mesStagiaires.map((stagiaire) => {
                  const convention = mockConventions.find(c => c.stagiaireId === stagiaire.id)
                  const tachesStagiaire = mesTaches.filter(t => t.stagiaireId === stagiaire.id)
                  const tachesTermineesStagiaire = tachesStagiaire.filter(t => t.status === 'termine').length
                  const progress = tachesStagiaire.length > 0 
                    ? (tachesTermineesStagiaire / tachesStagiaire.length) * 100 
                    : 0

                  return (
                    <div
                      key={stagiaire.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {stagiaire.prenom.charAt(0)}{stagiaire.nom.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{stagiaire.prenom} {stagiaire.nom}</p>
                          <p className="text-sm text-muted-foreground">{stagiaire.specialite}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-medium">{Math.round(progress)}%</p>
                          <p className="text-xs text-muted-foreground">Onboarding</p>
                        </div>
                        <Badge variant={convention ? 'default' : 'secondary'}>
                          {convention ? 'Actif' : 'En attente'}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progression Onboarding */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Onboarding</CardTitle>
              <CardDescription>Progression des tâches</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/tuteur/onboarding">
                Gérer
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Overall Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progression globale</span>
                  <span className="font-medium">{Math.round(progressOnboarding)}%</span>
                </div>
                <Progress value={progressOnboarding} className="h-2" />
              </div>

              {/* Status Breakdown */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-accent/10">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <div>
                    <p className="text-lg font-bold">{tachesTerminees}</p>
                    <p className="text-xs text-muted-foreground">Terminées</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-chart-4/10">
                  <Clock className="h-4 w-4 text-chart-4" />
                  <div>
                    <p className="text-lg font-bold">{tachesEnCours}</p>
                    <p className="text-xs text-muted-foreground">En cours</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-bold">{tachesAFaire}</p>
                    <p className="text-xs text-muted-foreground">À faire</p>
                  </div>
                </div>
              </div>

              {/* Recent Tasks */}
              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Tâches récentes</p>
                <div className="space-y-2">
                  {mesTaches.slice(0, 4).map((tache) => (
                    <div
                      key={tache.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="truncate flex-1 mr-2">{tache.description}</span>
                      <Badge
                        variant={
                          tache.status === 'termine'
                            ? 'default'
                            : tache.status === 'en_cours'
                            ? 'secondary'
                            : 'outline'
                        }
                        className="shrink-0"
                      >
                        {tache.status === 'termine'
                          ? 'Fait'
                          : tache.status === 'en_cours'
                          ? 'En cours'
                          : 'À faire'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Évaluations à faire */}
      {stagiairesNonEvalues.length > 0 && (
        <Card className="border-chart-5/30 bg-chart-5/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-chart-5" />
              Évaluations en attente
            </CardTitle>
            <CardDescription>
              {stagiairesNonEvalues.length} stagiaire(s) à évaluer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {stagiairesNonEvalues.map((stagiaire) => (
                <Button key={stagiaire.id} variant="outline" asChild>
                  <Link href={`/tuteur/evaluations?stagiaire=${stagiaire.id}`}>
                    Évaluer {stagiaire.prenom} {stagiaire.nom}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
