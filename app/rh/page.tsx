'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { type CandidatureExterne } from '@/lib/types'
import {
  FileText,
  Users,
  FileCheck,
  UserPlus,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Calendar,
  Loader2
} from 'lucide-react'

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  nouvelle: { label: 'En attente', variant: 'outline' },
  en_revision: { label: 'En révision', variant: 'secondary' },
  acceptee: { label: 'Acceptée', variant: 'default' },
  refusee: { label: 'Refusée', variant: 'destructive' },
  compte_cree: { label: 'Compte créé', variant: 'default' },
}

export default function RHDashboard() {
  const { user } = useAuth()
  const [candidatures, setCandidatures] = useState<CandidatureExterne[]>([])
  const [stagiaires, setStagiaires] = useState<any[]>([])
  const [conventions, setConventions] = useState<any[]>([])
  const [tuteurs, setTuteurs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)

      // Fetch data in parallel
      const [candRes, usersRes, convRes] = await Promise.all([
        fetch('/api/candidatures'),
        fetch('/api/users?validated=true'),
        fetch('/api/conventions')
      ])

      if (candRes.ok) setCandidatures(await candRes.json())

      if (usersRes.ok) {
        const users = await usersRes.json()
        if (Array.isArray(users)) {
          setStagiaires(users.filter((u: any) => u.role?.name === 'stagiaire'))
          setTuteurs(users.filter((u: any) => u.role?.name === 'tuteur'))
        }
      }

      if (convRes.ok) setConventions(await convRes.json())

    } catch (error) {
      console.error('Erreur chargement données dashboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Stats
  const totalCandidatures = candidatures.length
  const candidaturesEnAttente = candidatures.filter(c => c.status === 'nouvelle').length
  const candidaturesAcceptees = candidatures.filter(c => ['acceptee', 'compte_cree'].includes(c.status)).length
  const candidaturesRefusees = candidatures.filter(c => c.status === 'refusee').length
  const tauxAcceptation = totalCandidatures > 0
    ? Math.round((candidaturesAcceptees / totalCandidatures) * 100)
    : 0

  // Recent candidatures
  const recentCandidatures = candidatures
    .sort((a, b) => new Date(b.dateSoumission || '').getTime() - new Date(a.dateSoumission || '').getTime())
    .slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Tableau de bord RH
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gérez les candidatures et les stagiaires du groupe RIF
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total candidatures
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCandidatures}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Toutes les candidatures
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En attente
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{candidaturesEnAttente}</div>
            <p className="text-xs text-muted-foreground mt-1">
              À traiter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Stagiaires actifs
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stagiaires.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              En stage actuellement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taux d'acceptation
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{tauxAcceptation}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {candidaturesAcceptees} acceptées / {totalCandidatures}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-start gap-4 space-y-0">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base">Candidatures</CardTitle>
              <CardDescription>
                {candidaturesEnAttente} en attente de traitement
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/rh/candidatures">
              <Button variant="outline" className="w-full bg-transparent">
                Gérer les candidatures
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-start gap-4 space-y-0">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileCheck className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base">Conventions</CardTitle>
              <CardDescription>
                {conventions.length} conventions générées
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/rh/conventions">
              <Button variant="outline" className="w-full bg-transparent">
                Voir les conventions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-start gap-4 space-y-0">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base">Utilisateurs</CardTitle>
              <CardDescription>
                {tuteurs.length} tuteurs, {stagiaires.length} stagiaires
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/rh/utilisateurs">
              <Button variant="outline" className="w-full bg-transparent">
                Gérer les utilisateurs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent candidatures */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Candidatures récentes</CardTitle>
            <CardDescription>Les dernières candidatures soumises</CardDescription>
          </div>
          <Link href="/rh/candidatures">
            <Button variant="ghost" size="sm">
              Voir tout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCandidatures.map((candidature) => (
              <div
                key={candidature.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {candidature.prenom.charAt(0)}{candidature.nom.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{candidature.prenom} {candidature.nom}</p>
                    <p className="text-sm text-muted-foreground">
                      {candidature.formation}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(candidature.dateSoumission).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={statusLabels[candidature.status]?.variant || 'outline'}>
                    {statusLabels[candidature.status]?.label || candidature.status}
                  </Badge>
                </div>
              </div>
            ))}
            {recentCandidatures.length === 0 && (
              <p className="text-center text-muted-foreground py-4">Aucune candidature récente</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
