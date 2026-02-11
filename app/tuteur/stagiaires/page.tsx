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
  mockCandidatures,
} from '@/lib/mock-data'
import type { Tuteur } from '@/lib/types'
import {
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  FileText,
  ClipboardList,
  Award,
  ChevronRight,
} from 'lucide-react'

export default function TuteurStagiairesPage() {
  const { user } = useAuth()
  const tuteur = user as Tuteur

  const mesStagiaires = mockStagiaires.filter(s => s.tuteurId === tuteur?.id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mes stagiaires</h1>
        <p className="text-muted-foreground mt-1">
          {mesStagiaires.length} stagiaire(s) sous votre encadrement
        </p>
      </div>

      {mesStagiaires.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun stagiaire assigné</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Vous n'avez pas encore de stagiaire sous votre encadrement. 
              Les RH vous assigneront des stagiaires prochainement.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {mesStagiaires.map((stagiaire) => {
            const candidature = mockCandidatures.find(c => c.stagiaireId === stagiaire.id)
            const convention = mockConventions.find(c => c.stagiaireId === stagiaire.id)
            const taches = mockTachesOnboarding.filter(t => t.stagiaireId === stagiaire.id)
            const tachesTerminees = taches.filter(t => t.status === 'termine').length
            const progressOnboarding = taches.length > 0 ? (tachesTerminees / taches.length) * 100 : 0
            const evaluation = mockEvaluations.find(e => e.stagiaireId === stagiaire.id)

            return (
              <Card key={stagiaire.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-lg font-semibold text-primary">
                          {stagiaire.prenom.charAt(0)}{stagiaire.nom.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-xl">
                          {stagiaire.prenom} {stagiaire.nom}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <GraduationCap className="h-4 w-4" />
                          {stagiaire.ecole} - {stagiaire.specialite}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={convention?.status === 'signee_complete' ? 'default' : 'secondary'}>
                        {convention?.status === 'signee_complete' ? 'Convention signée' : 'En cours'}
                      </Badge>
                      {evaluation && (
                        <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                          Évalué
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Contact Info */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${stagiaire.email}`} className="text-primary hover:underline">
                        {stagiaire.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{stagiaire.telephone}</span>
                    </div>
                  </div>

                  {/* Stage Info */}
                  {convention && (
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Période</p>
                            <p className="text-sm font-medium">
                              {new Date(convention.contenu.dateDebut).toLocaleDateString('fr-FR')} - {new Date(convention.contenu.dateFin).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Sujet</p>
                            <p className="text-sm font-medium">{convention.contenu.sujet}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Département</p>
                            <p className="text-sm font-medium">{convention.contenu.departement}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Progress Section */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Onboarding Progress */}
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <ClipboardList className="h-4 w-4 text-primary" />
                          <span className="font-medium text-sm">Onboarding</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {tachesTerminees}/{taches.length}
                        </span>
                      </div>
                      <Progress value={progressOnboarding} className="h-2 mb-2" />
                      <p className="text-xs text-muted-foreground">
                        {Math.round(progressOnboarding)}% complété
                      </p>
                    </div>

                    {/* Evaluation Status */}
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="h-4 w-4 text-chart-4" />
                        <span className="font-medium text-sm">Évaluation</span>
                      </div>
                      {evaluation ? (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Moyenne</span>
                            <span className="font-medium">
                              {((evaluation.competencesTechniques + evaluation.autonomie + evaluation.integrationEquipe) / 3).toFixed(1)}/5
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Évalué le {new Date(evaluation.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Non évalué</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/tuteur/onboarding?stagiaire=${stagiaire.id}`}>
                        <ClipboardList className="mr-2 h-4 w-4" />
                        Onboarding
                      </Link>
                    </Button>
                    {!evaluation && (
                      <Button size="sm" asChild>
                        <Link href={`/tuteur/evaluations?stagiaire=${stagiaire.id}`}>
                          <Award className="mr-2 h-4 w-4" />
                          Évaluer
                        </Link>
                      </Button>
                    )}
                    {evaluation && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/tuteur/evaluations?stagiaire=${stagiaire.id}`}>
                          <Award className="mr-2 h-4 w-4" />
                          Voir évaluation
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
