'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getUniversiteStats, getUniversiteStagiaires } from '@/app/actions/universite-actions'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  Users,
  FileText,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  GraduationCap,
} from 'lucide-react'

export default function UniversitePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [statsData, setStatsData] = useState({
    totalStagiaires: 0,
    conventionsSignees: 0,
    stagesEnCours: 0
  })
  const [stagiairesRecents, setStagiairesRecents] = useState<any[]>([])

  useEffect(() => {
    if (!user || user.role !== 'universite') {
      router.push('/connexion')
      return;
    }

    const loadData = async () => {
      try {
        const [stats, stagiaires] = await Promise.all([
          getUniversiteStats(user.id),
          getUniversiteStagiaires(user.id)
        ])
        setStatsData(stats)
        setStagiairesRecents(stagiaires)
      } catch (error) {
        console.error("Erreur chargement dashboard université", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, router])

  if (!user || user.role !== 'universite') {
    return null
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>
  }

  const stats = [
    {
      title: 'Stagiaires actifs',
      value: statsData.totalStagiaires.toString(),
      description: `${statsData.totalStagiaires} étudiants inscrits`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Conventions signées',
      value: statsData.conventionsSignees.toString(),
      description: `${statsData.conventionsSignees} conventions en cours`,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'En cours',
      value: statsData.stagesEnCours.toString(),
      description: 'Stages en cours',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Tableau de bord {user.nom ? `- ${user.nom}` : ''}
              </h1>
              <p className="text-muted-foreground">
                Bienvenue {user.prenom} {user.nom}. Gérez vos stagiaires et conventions.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-bold text-foreground mb-1">
                        {stat.value}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {stat.description}
                      </p>
                    </div>
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <Icon className={`${stat.color} h-5 w-5`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Links */}
          <Card className="lg:col-span-1 border border-border">
            <CardHeader>
              <CardTitle className="text-lg">Actions rapides</CardTitle>
              <CardDescription>Accédez rapidement aux fonctionnalités principales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/universite/stagiaires" className="block">
                <Button variant="outline" className="w-full justify-between bg-transparent hover:bg-muted/50">
                  <span className="flex items-center">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Voir tous les stagiaires
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/universite/conventions" className="block">
                <Button variant="outline" className="w-full justify-between bg-transparent hover:bg-muted/50">
                  <span className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Conventions
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/universite/rapports" className="block">
                <Button variant="outline" className="w-full justify-between bg-transparent hover:bg-muted/50">
                  <span className="flex items-center">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Rapports
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Stagiaires List Preview */}
          <Card className="lg:col-span-2 border border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Derniers Stagiaires</CardTitle>
                <CardDescription>Stagiaires récemment inscrits</CardDescription>
              </div>
              <Link href="/universite/stagiaires">
                <Button variant="ghost" size="sm">
                  Voir tout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stagiairesRecents.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">Aucun stagiaire récent</div>
                ) : stagiairesRecents.slice(0, 5).map((stagiaire) => (
                  <div
                    key={stagiaire.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {stagiaire.prenom} {stagiaire.nom}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {stagiaire.specialite}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Simplification pour le prototype: on considère 'En stage' si une convention est signée */}
                      {/* TODO: Affiner la logique statut avec les vraies données */}
                      {stagiaire.conventions && stagiaire.conventions.length > 0 ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          En stage
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          À assigner
                        </Badge>
                      )}
                      <Link href={`/universite/stagiaires/${stagiaire.id}`}>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
