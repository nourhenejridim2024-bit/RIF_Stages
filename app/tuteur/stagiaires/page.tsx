'use client'

import { useState, useEffect } from 'react'
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
  Clock,
} from 'lucide-react'

export default function TuteurStagiairesPage() {
  const { user } = useAuth()
  const [mesStagiaires, setMesStagiaires] = useState<any[]>([])
  const [mesCandidats, setMesCandidats] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchAssignments()
    }
  }, [user])

  const fetchAssignments = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/tuteur/stagiaires?tuteurId=${user?.id}`)
      if (res.ok) {
        const data = await res.json()
        setMesStagiaires(data.stagiaires || [])
        setMesCandidats(data.candidatures || [])
      }
    } catch (error) {
      console.error("Failed to fetch assignments", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mes stagiaires</h1>
        <p className="text-muted-foreground mt-1">
          {mesStagiaires.length + mesCandidats.length} stagiaire(s) ou candidat(s) assigné(s)
        </p>
      </div>

      {mesStagiaires.length === 0 && mesCandidats.length === 0 ? (
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
          {/* Candidates Section */}
          {mesCandidats.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                Candidats en attente
              </h2>
              {mesCandidats.map((candidat) => (
                <Card key={candidat.id} className="border-orange-200 bg-orange-50/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                          <span className="text-orange-700 font-semibold">{candidat.prenom.charAt(0)}{candidat.nom.charAt(0)}</span>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{candidat.prenom} {candidat.nom}</CardTitle>
                          <CardDescription>{candidat.formation}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-orange-300 text-orange-700 bg-orange-50">En attente de compte</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {candidat.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {candidat.telephone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Défut prévu: {candidat.dateDebut}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Stagiaires Section */}
          {mesStagiaires.length > 0 && (
            <div className="space-y-4">
              {mesCandidats.length > 0 && <h2 className="text-lg font-semibold flex items-center gap-2 pt-4">
                <GraduationCap className="h-5 w-5 text-primary" />
                Stagiaires actifs
              </h2>}
              {mesStagiaires.map((stagiaire) => {
                const convention = stagiaire.conventions?.[0]
                return (
                  <Card key={stagiaire.id}>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-lg font-semibold text-primary">
                              {stagiaire.name?.split(' ').map((n: string) => n[0]).join('') || stagiaire.email.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              {stagiaire.name}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                              <GraduationCap className="h-4 w-4" />
                              Stagiaire - {stagiaire.email}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/tuteur/onboarding?stagiaire=${stagiaire.id}`}>
                            <ClipboardList className="mr-2 h-4 w-4" />
                            Onboarding
                          </Link>
                        </Button>
                        <Button size="sm" asChild>
                          <Link href={`/tuteur/evaluations?stagiaire=${stagiaire.id}`}>
                            <Award className="mr-2 h-4 w-4" />
                            Évaluer
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
