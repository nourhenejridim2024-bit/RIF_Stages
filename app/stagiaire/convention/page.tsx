'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  FileCheck,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Calendar,
  User,
  Briefcase,
  PenTool,
  Loader2
} from 'lucide-react'

const statusConfig: Record<string, { label: string; color: string }> = {
  generee: { label: 'Générée', color: 'bg-blue-100 text-blue-800' },
  envoyee: { label: 'En attente de signature', color: 'bg-yellow-100 text-yellow-800' },
  signee_stagiaire: { label: 'Signée par le stagiaire', color: 'bg-orange-100 text-orange-800' },
  signee_complete: { label: 'Signée par toutes les parties', color: 'bg-green-100 text-green-800' },
}

export default function ConventionPage() {
  const { user } = useAuth()
  const [convention, setConvention] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSigning, setIsSigning] = useState(false)

  useEffect(() => {
    if (user?.id) {
      fetchConvention()
    }
  }, [user])

  const fetchConvention = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/conventions?stagiaireId=${user?.id}`)
      if (res.ok) {
        const data = await res.json()
        setConvention(data[0] || null) // Should only be one convention per stagiaire
      }
    } catch (error) {
      console.error('Failed to fetch convention:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSign = async () => {
    if (!convention) return

    try {
      setIsSigning(true)
      // Hypothetical signature logic - in real app we might patch the convention status
      const res = await fetch(`/api/conventions/${convention.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'signee_stagiaire' })
      })

      if (res.ok) {
        await fetchConvention()
      } else {
        // Fallback for demo if patch not implemented
        await new Promise(resolve => setTimeout(resolve, 1000))
        setConvention((prev: any) => prev ? { ...prev, status: 'signee_stagiaire' } : null)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSigning(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!convention) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ma convention</h1>
          <p className="mt-1 text-muted-foreground">
            Consultez et signez votre convention de stage
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Aucune convention n'est disponible pour le moment. Votre convention sera générée
            une fois votre candidature traitée par l'équipe RH.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const isFullySigned = convention.status === 'signee_complete'
  const needsSignature = convention.status === 'generee' || convention.status === 'envoyee'
  const hasSigned = convention.status === 'signee_stagiaire' || isFullySigned

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ma convention</h1>
        <p className="mt-1 text-muted-foreground">
          Consultez et signez votre convention de stage
        </p>
      </div>

      {/* Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className={`p-4 rounded-full ${isFullySigned ? 'bg-green-100' : 'bg-blue-100'}`}>
              {isFullySigned ? (
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              ) : (
                <Clock className="h-8 w-8 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-semibold">
                  Convention de stage
                </h2>
                <Badge className={`${statusConfig[convention.status]?.color || 'bg-gray-100'} border-none`}>
                  {statusConfig[convention.status]?.label || convention.status}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                {isFullySigned
                  ? 'Votre convention a été signée par toutes les parties.'
                  : hasSigned
                    ? 'Vous avez signé la convention. En attente de signature par l\'entreprise.'
                    : 'Votre convention est prête à être consultée et signée.'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Convention details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Entreprise d'accueil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Entreprise</span>
              <span className="font-medium">Groupe RIF</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Département</span>
              <span className="font-medium">{convention.departement}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Tuteur de stage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nom du tuteur</span>
              <span className="font-medium">{convention.tuteurNom}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Période de stage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date de début</span>
              <span className="font-medium">{new Date(convention.dateDebut).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date de fin</span>
              <span className="font-medium">{new Date(convention.dateFin).toLocaleDateString('fr-FR')}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sujet</span>
              <span className="font-medium">{convention.sujet}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground font-semibold">Actions disponibles</CardTitle>
          <CardDescription>Consultez ou signez votre document officiellement.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="flex-1 bg-transparent border-primary/20 text-primary hover:bg-primary/5">
            <Download className="mr-2 h-4 w-4" />
            Télécharger (PDF)
          </Button>

          {needsSignature && !hasSigned && (
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={handleSign}
              disabled={isSigning}
            >
              <PenTool className="mr-2 h-4 w-4" />
              {isSigning ? 'Signature en cours...' : 'Signer la convention'}
            </Button>
          )}

          {hasSigned && !isFullySigned && (
            <Button variant="secondary" className="flex-1" disabled>
              <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
              Déjà signée par vous
            </Button>
          )}

          {isFullySigned && (
            <Button variant="default" className="flex-1 bg-green-600 hover:bg-green-700" disabled>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Convention validée
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
