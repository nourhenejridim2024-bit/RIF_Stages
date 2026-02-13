'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
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
  Award,
  Loader2,
} from 'lucide-react'

export default function StagiaireDashboard() {
  const { user } = useAuth()
  const [candidature, setCandidature] = useState<any>(null)
  const [convention, setConvention] = useState<any>(null)
  const [taches, setTaches] = useState<any[]>([])
  const [evaluation, setEvaluation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const [resCand, resConv, resTaches, resEval] = await Promise.all([
        fetch(`/api/stagiaire/candidature?stagiaireId=${user?.id}`),
        fetch(`/api/stagiaire/convention?stagiaireId=${user?.id}`),
        fetch(`/api/onboarding?stagiaireId=${user?.id}`),
        fetch(`/api/evaluation?stagiaireId=${user?.id}`)
      ])

      if (resCand.ok) setCandidature(await resCand.json())
      if (resConv.ok) setConvention(await resConv.json())
      if (resTaches.ok) setTaches(await resTaches.json())
      if (resEval.ok) {
        const data = await resEval.json()
        if (data && data.status === 'envoye') {
          setEvaluation(data)
        } else {
          setEvaluation(null)
        }
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error)
    } finally {
      setIsLoading(true) // Should be false, let's wait for actual data to decide
      setIsLoading(false)
    }
  }

  if (!user || isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const tachesTerminees = taches.filter(t => t.status === 'termine').length
  const onboardingProgress = taches.length > 0 ? (tachesTerminees / taches.length) * 100 : 0

  const getStageStatus = () => {
    if (!candidature) return { step: 1, label: 'Candidature à soumettre' }
    if (candidature.status === 'soumise') return { step: 2, label: 'Candidature en cours de revue' }
    if (candidature.status === 'refusee') return { step: 2, label: 'Candidature refusée' }
    if (!convention || convention.status !== 'signee_complete') return { step: 3, label: 'Convention à finaliser' }
    if (evaluation) return { step: 5, label: 'Stage terminé - Évaluation disponible' }
    return { step: 4, label: 'Stage et Onboarding en cours' }
  }

  const stageStatus = getStageStatus()

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

      {/* Main Stats/Alerts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Onboarding
            </CardTitle>
            <CardDescription>Progression de votre intégration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{Math.round(onboardingProgress)}% complété</span>
              <span className="text-xs text-muted-foreground">{tachesTerminees}/{taches.length} tâches</span>
            </div>
            <Progress value={onboardingProgress} className="h-2 mb-4" />
            <Link href="/stagiaire/onboarding">
              <Button variant="outline" size="sm" className="w-full">
                Voir ma checklist
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {evaluation ? (
          <Card className="border-chart-4 bg-chart-4/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-chart-4">
                <Award className="h-5 w-5" />
                Évaluation disponible
              </CardTitle>
              <CardDescription>Votre bilan de fin de stage est prêt</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-chart-4/20 flex items-center justify-center text-chart-4 font-bold text-xl">
                  {evaluation.globalScore}
                </div>
                <div>
                  <p className="text-sm font-semibold">Note globale sur 5</p>
                  <p className="text-xs text-muted-foreground">Évalué par {evaluation.tuteur?.prenom || 'votre tuteur'}</p>
                </div>
              </div>
              <Link href="/stagiaire/evaluation">
                <Button className="w-full bg-chart-4 hover:bg-chart-4/90">
                  Consulter mon évaluation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-muted-foreground" />
                Évaluation de fin de stage
              </CardTitle>
              <CardDescription>Bilan de compétences</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col h-full justify-between pb-6">
              <p className="text-sm text-muted-foreground mb-4">
                Votre évaluation sera disponible une fois votre stage terminé et validé par votre tuteur.
              </p>
              <Button variant="outline" size="sm" disabled className="w-full">
                À venir
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pathway Overview */}
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
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step < stageStatus.step
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
                    className={`flex-1 h-1 mx-2 rounded ${step < stageStatus.step ? 'bg-primary' : 'bg-muted'
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 text-[10px] sm:text-xs text-muted-foreground">
            <span className="text-center">Candidature</span>
            <span className="text-center">Validation</span>
            <span className="text-center">Convention</span>
            <span className="text-center">Onboarding</span>
            <span className="text-center">Évaluation</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick shortcuts */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {[
          { label: 'Ma candidature', icon: FileText, href: '/stagiaire/candidature' },
          { label: 'Ma convention', icon: FileCheck, href: '/stagiaire/convention' },
          { label: 'Mon Onboarding', icon: ClipboardList, href: '/stagiaire/onboarding' },
          { label: 'Mon Évaluation', icon: Award, href: '/stagiaire/evaluation' },
        ].map((item) => (
          <Link key={item.label} href={item.href}>
            <Card className="hover:border-primary transition-colors cursor-pointer group">
              <CardContent className="p-4 flex flex-col items-center justify-center gap-3">
                <div className="p-2 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-center">{item.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
