'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Award,
  Download,
  AlertCircle,
  Star,
  User,
  Calendar,
  FileText,
  Loader2,
  Printer,
  Timer,
  Briefcase,
  Zap,
  Users,
  Brain,
  ShieldCheck,
} from 'lucide-react'

const criteriaList = [
  { id: 'assiduite', label: 'Assiduité et Ponctualité', icon: Timer },
  { id: 'qualiteTravail', label: 'Qualité du travail rendu', icon: Briefcase },
  { id: 'autonomie', label: "Esprit d'initiative et Autonomie", icon: Zap },
  { id: 'relationnel', label: 'Intégration et Relationnel', icon: Users },
  { id: 'competencesTech', label: 'Compétences techniques', icon: Brain },
  { id: 'apprentissage', label: "Capacité d'apprentissage", icon: ShieldCheck },
  { id: 'discipline', label: 'Respect des consignes et Discipline', icon: AlertCircle },
]

export default function EvaluationPage() {
  const { user } = useAuth()
  const [evaluation, setEvaluation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [companyInfo, setCompanyInfo] = useState<any>(null)

  useEffect(() => {
    if (user?.id) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [resEval, resParam] = await Promise.all([
        fetch(`/api/evaluation?stagiaireId=${user?.id}`),
        fetch('/api/admin/parametres')
      ])

      if (resEval.ok) {
        const data = await resEval.json()
        if (data && data.status === 'envoye') {
          setEvaluation(data)
        } else {
          setEvaluation(null)
        }
      }

      if (resParam.ok) {
        const data = await resParam.json()
        setCompanyInfo(data)
      }
    } catch (error) {
      console.error("Failed to fetch evaluation data", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const renderStars = (note: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= note
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-200'
              }`}
          />
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!evaluation) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mon évaluation</h1>
          <p className="mt-1 text-muted-foreground">
            Consultez votre évaluation de fin de stage
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Votre évaluation n'est pas encore disponible. Elle sera renseignée par votre tuteur
            à la fin de votre stage.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-area, #printable-area * {
            visibility: visible;
          }
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mon évaluation</h1>
          <p className="mt-1 text-muted-foreground">
            Bilan de vos compétences et de votre intégration
          </p>
        </div>
        <Button onClick={handlePrint} className="no-print">
          <Printer className="mr-2 h-4 w-4" />
          Imprimer ma fiche d'évaluation
        </Button>
      </div>

      <div id="printable-area" className="space-y-6">
        {/* Header for Print */}
        <div className="hidden print:block border-b pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-tight">{companyInfo?.nom || 'RIF Tunisie'}</h1>
              <p className="text-sm text-gray-600">{companyInfo?.adresse}</p>
              <p className="text-sm text-gray-600">{companyInfo?.email} | {companyInfo?.tel}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-primary">FICHE D'ÉVALUATION</h2>
              <p className="text-sm text-gray-500">Stage d'intégration</p>
            </div>
          </div>
        </div>

        {/* Global Score Card */}
        <Card className="print:border-none print:shadow-none bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white shadow-lg print:border-4 print:border-black print:text-black print:bg-white">
                <div className="text-center">
                  <span className="text-3xl font-bold block leading-none">
                    {evaluation.globalScore}
                  </span>
                  <span className="text-xs font-medium opacity-80 uppercase">sur 5</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">Bilan Général</h2>
                  <Badge variant="outline" className="print:hidden">
                    Fidélité au profil
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1 print:text-gray-600">
                  Évaluation réalisée par <strong>{evaluation.tuteur?.prenom} {evaluation.tuteur?.nom}</strong>
                </p>
                <div className="flex items-center gap-2 mt-4 print:mt-2">
                  <Calendar className="h-4 w-4 text-primary print:text-black" />
                  <span className="text-sm font-medium">
                    Date de validation : {new Date(evaluation.updatedAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Area (Print Only) */}
        <div className="hidden print:grid grid-cols-2 gap-8 my-8 py-4 border-y border-gray-100">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Stagiaire</h3>
            <p className="text-lg font-semibold">{user?.prenom} {user?.nom}</p>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Tuteur</h3>
            <p className="text-lg font-semibold">{evaluation.tuteur?.prenom} {evaluation.tuteur?.nom}</p>
            <p className="text-sm text-gray-600">{evaluation.tuteur?.email}</p>
          </div>
        </div>

        {/* Criteria Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-2">
          {criteriaList.map((c) => (
            <Card key={c.id} className="print:shadow-none print:border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <c.icon className="h-4 w-4 text-primary print:text-black" />
                  {c.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  {renderStars(evaluation[c.id])}
                  <span className="text-sm font-bold">{evaluation[c.id]}/5</span>
                </div>
                <Progress
                  value={(evaluation[c.id] / 5) * 100}
                  className="h-1.5 mt-3 print:bg-gray-100"
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comments */}
        <Card className="print:shadow-none print:border-gray-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary print:text-black" />
              Observations et appréciations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-foreground leading-relaxed p-4 rounded-lg bg-muted/30 print:bg-gray-50 border border-transparent print:border-gray-100">
              {evaluation.commentaires || "Aucun commentaire spécifique n'a été ajouté par le tuteur."}
            </div>
          </CardContent>
        </Card>

        {/* Footer for Print (Signatures) */}
        <div className="hidden print:grid grid-cols-2 gap-12 mt-24">
          <div className="border-t border-black pt-4 text-center">
            <p className="text-sm font-bold uppercase">Signature du tuteur</p>
            <div className="h-20"></div>
          </div>
          <div className="border-t border-black pt-4 text-center">
            <p className="text-sm font-bold uppercase">Signature du stagiaire</p>
            <div className="h-20"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
