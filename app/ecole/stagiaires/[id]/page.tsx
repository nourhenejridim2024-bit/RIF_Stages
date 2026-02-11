'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter, useParams } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { mockStagiaires, mockTachesOnboarding } from '@/lib/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Mail, Phone, GraduationCap, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

const mockOnboarding = mockTachesOnboarding; // Declare the mockOnboarding variable

export default function StagiaireDetailPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const stagiaireId = params?.id as string

  useEffect(() => {
    if (!user || user.role !== 'ecole') {
      router.push('/connexion')
    }
  }, [user, router])

  if (!user || user.role !== 'ecole') {
    return null
  }

  const stagiaire = mockStagiaires.find(s => s.id === stagiaireId && s.ecoleId === user.id)

  if (!stagiaire) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/ecole/stagiaires">
            <Button variant="outline" className="mb-4 bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </Link>
          <Card className="border-border/50">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-3" />
              <p className="text-foreground font-medium">Stagiaire non trouvé</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const onboardingTasks = mockTachesOnboarding.filter(t => t.stagiaireId === stagiaireId)
  const completedTasks = onboardingTasks.filter(t => t.statut === 'completee').length
  const progressPercent = onboardingTasks.length > 0 ? (completedTasks / onboardingTasks.length) * 100 : 0

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/ecole/stagiaires">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">
              {stagiaire.prenom} {stagiaire.nom}
            </h1>
            <p className="text-muted-foreground">{stagiaire.specialite}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Infos */}
          <Card className="md:col-span-1 border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email</span>
                </div>
                <p className="text-sm font-medium text-foreground break-all">
                  {stagiaire.email}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Téléphone</span>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {stagiaire.telephone}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Formation</span>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {stagiaire.ecole}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Onboarding Progress */}
          <Card className="md:col-span-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Progression d'onboarding</CardTitle>
              <CardDescription>
                {completedTasks}/{onboardingTasks.length} tâches complétées
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progression générale</span>
                  <span className="font-medium text-foreground">{Math.round(progressPercent)}%</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>

              <div className="space-y-2">
                {onboardingTasks.map((task) => {
                  const Icon = task.statut === 'completee' ? CheckCircle2 : task.statut === 'en_cours' ? Clock : AlertCircle
                  const color = task.statut === 'completee' ? 'text-green-500' : task.statut === 'en_cours' ? 'text-amber-500' : 'text-gray-500'

                  return (
                    <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/20">
                      <Icon className={`h-4 w-4 ${color}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{task.titre}</p>
                        <p className="text-xs text-muted-foreground">{task.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {task.statut === 'completee' ? 'Complétée' : task.statut === 'en_cours' ? 'En cours' : 'À faire'}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
