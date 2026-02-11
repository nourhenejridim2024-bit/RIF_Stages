'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { mockStagiaires, mockConventions } from '@/lib/mock-data'
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

  useEffect(() => {
    if (!user || user.role !== 'universite') {
      router.push('/connexion')
    }
  }, [user, router])

  if (!user || user.role !== 'universite') {
    return null
  }

  const stagiairesUniversite = mockStagiaires.filter(s => s.universitId === user.id)
  const totalStagiaires = stagiairesUniversite.length
  const conventionsSignees = mockConventions.filter(c => stagiairesUniversite.some(s => s.id === c.stagiaireId))

  const stats = [
    {
      title: 'Stagiaires actifs',
      value: totalStagiaires.toString(),
      description: `${totalStagiaires} étudiants inscrits`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Conventions signées',
      value: conventionsSignees.length.toString(),
      description: `${conventionsSignees.length} conventions en cours`,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'En cours',
      value: stagiairesUniversite.filter(s => s.tuteurId).length.toString(),
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
                Tableau de bord {user.nomUniversite ? `- ${user.nomUniversite}` : ''}
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
              <Button variant="outline" className="w-full justify-between bg-transparent hover:bg-muted/50">
                <span className="flex items-center">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Rapports
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Stagiaires List Preview */}
          <Card className="lg:col-span-2 border border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Stagiaires</CardTitle>
                <CardDescription>Liste des {totalStagiaires} stagiaires inscrits</CardDescription>
              </div>
              <Link href="/universite/stagiaires">
                <Button variant="ghost" size="sm">
                  Voir tout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stagiairesUniversite.slice(0, 5).map((stagiaire) => (
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
                      {stagiaire.tuteurId ? (
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
                {totalStagiaires > 5 && (
                  <div className="text-center pt-2">
                    <Link href="/universite/stagiaires">
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        + {totalStagiaires - 5} stagiaires supplémentaires
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        {totalStagiaires === 0 && (
          <Card className="mt-6 border border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-amber-900">Aucun stagiaire enregistré</CardTitle>
              <CardDescription className="text-amber-800">
                Votre université n\'a pas encore de stagiaire inscrits. Les stagiaires seront affichés ici une fois qu\'ils seront assignés à votre établissement.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  )
}
