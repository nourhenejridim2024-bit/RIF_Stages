'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { mockStagiaires } from '@/lib/mock-data'
import { mockEcoles } from '@/lib/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GraduationCap, Users, BookOpen, BarChart3, ArrowRight, Clock, CheckCircle2 } from 'lucide-react'

export default function EcolePage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== 'ecole') {
      router.push('/connexion')
    }
  }, [user, router])

  if (!user || user.role !== 'ecole') {
    return null
  }

  const stagiairesList = mockStagiaires.filter(s => s.ecoleId === user.id)
  const ecoleInfo = mockEcoles.find(e => e.id === user.id)

  const stats = [
    { label: 'Stagiaires actifs', value: stagiairesList.length.toString(), icon: Users, color: 'text-blue-500' },
    { label: 'En cours', value: '2', icon: Clock, color: 'text-amber-500' },
    { label: 'Complétés', value: '0', icon: CheckCircle2, color: 'text-green-500' },
  ]

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground text-balance">
            Tableau de bord - {ecoleInfo?.nomEcole}
          </h1>
          <p className="text-muted-foreground">
            Gestion des stagiaires et de leurs parcours
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium text-foreground">
                    {stat.label}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Quick Access */}
          <Card className="md:col-span-1 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Accès rapides</CardTitle>
              <CardDescription>Navigation principale</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/ecole/stagiaires" className="block">
                <Button variant="outline" className="w-full justify-between bg-transparent hover:bg-muted/50">
                  <span className="flex items-center">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Stagiaires
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-between bg-transparent hover:bg-muted/50">
                <span className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Rapports
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Recent Stagiaires */}
          <Card className="md:col-span-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Derniers stagiaires</CardTitle>
              <CardDescription>Stagiaires récemment enregistrés</CardDescription>
            </CardHeader>
            <CardContent>
              {stagiairesList.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  Aucun stagiaire pour le moment
                </p>
              ) : (
                <div className="space-y-3">
                  {stagiairesList.slice(0, 3).map((stagiaire) => (
                    <div key={stagiaire.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">
                          {stagiaire.prenom} {stagiaire.nom}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stagiaire.specialite}
                        </p>
                      </div>
                      <Link href={`/ecole/stagiaires/${stagiaire.id}`}>
                        <Button variant="ghost" size="sm">
                          Voir
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
              {stagiairesList.length > 3 && (
                <div className="pt-3">
                  <Link href="/ecole/stagiaires" className="block">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      Voir tous les stagiaires ({stagiairesList.length})
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
