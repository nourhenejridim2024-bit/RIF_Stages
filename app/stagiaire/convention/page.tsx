'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { mockConventions, mockTuteurs } from '@/lib/mock-data'
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
} from 'lucide-react'

const statusConfig = {
  generee: { label: 'Générée', color: 'bg-blue-100 text-blue-800' },
  envoyee: { label: 'En attente de signature', color: 'bg-yellow-100 text-yellow-800' },
  signee_stagiaire: { label: 'Signée par le stagiaire', color: 'bg-orange-100 text-orange-800' },
  signee_complete: { label: 'Signée par toutes les parties', color: 'bg-green-100 text-green-800' },
}

export default function ConventionPage() {
  const { user } = useAuth()
  const [isSigning, setIsSigning] = useState(false)
  const [signed, setSigned] = useState(false)

  if (!user) return null

  const convention = mockConventions.find(c => c.stagiaireId === user.id)
  const tuteur = convention ? mockTuteurs.find(t => t.nom + ' ' + t.prenom === convention.contenu.tuteurNom || 
    t.prenom + ' ' + t.nom === convention.contenu.tuteurNom) : null

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
            une fois votre candidature acceptée par l'équipe RH.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const handleSign = async () => {
    setIsSigning(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSigning(false)
    setSigned(true)
  }

  const isFullySigned = convention.status === 'signee_complete' || signed
  const needsSignature = convention.status === 'generee' || convention.status === 'envoyee'

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
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-full ${isFullySigned ? 'bg-green-100' : 'bg-blue-100'}`}>
              {isFullySigned ? (
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              ) : (
                <Clock className="h-8 w-8 text-blue-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">
                  Convention de stage
                </h2>
                <Badge className={statusConfig[signed ? 'signee_complete' : convention.status].color}>
                  {statusConfig[signed ? 'signee_complete' : convention.status].label}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {isFullySigned 
                  ? 'Votre convention a été signée par toutes les parties.'
                  : needsSignature
                  ? 'Votre convention est prête à être signée.'
                  : 'Votre convention est en attente de signature par les autres parties.'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Convention details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4" />
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
              <span className="font-medium">{convention.contenu.departement}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Adresse</span>
              <span className="font-medium">Bordeaux, France</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Tuteur de stage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nom</span>
              <span className="font-medium">{convention.contenu.tuteurNom}</span>
            </div>
            {tuteur && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Poste</span>
                  <span className="font-medium">{tuteur.poste}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{tuteur.email}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Période de stage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date de début</span>
              <span className="font-medium">
                {new Date(convention.contenu.dateDebut).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date de fin</span>
              <span className="font-medium">
                {new Date(convention.contenu.dateFin).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Durée</span>
              <span className="font-medium">
                {Math.ceil(
                  (new Date(convention.contenu.dateFin).getTime() - 
                   new Date(convention.contenu.dateDebut).getTime()) / 
                  (1000 * 60 * 60 * 24 * 30)
                )} mois
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sujet</span>
              <span className="font-medium">{convention.contenu.sujet}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gratification</span>
              <span className="font-medium">Selon la réglementation en vigueur</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="flex-1 bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Télécharger la convention (PDF)
          </Button>
          
          {needsSignature && !signed && (
            <Button 
              className="flex-1" 
              onClick={handleSign}
              disabled={isSigning}
            >
              <PenTool className="mr-2 h-4 w-4" />
              {isSigning ? 'Signature en cours...' : 'Signer la convention'}
            </Button>
          )}
          
          {(isFullySigned) && (
            <Button variant="secondary" className="flex-1" disabled>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Convention signée
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Signature timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historique des signatures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <div className="flex-1 w-0.5 bg-border" />
              </div>
              <div className="pb-4">
                <p className="text-sm font-medium">Convention générée</p>
                <p className="text-xs text-muted-foreground">{convention.dateGeneration}</p>
              </div>
            </div>
            
            {(convention.status === 'signee_stagiaire' || convention.status === 'signee_complete' || signed) && (
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <div className="flex-1 w-0.5 bg-border" />
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium">Signée par le stagiaire</p>
                  <p className="text-xs text-muted-foreground">
                    {convention.dateSignature || new Date().toISOString().split('T')[0]}
                  </p>
                </div>
              </div>
            )}
            
            {(convention.status === 'signee_complete' || signed) && (
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Signée par toutes les parties</p>
                  <p className="text-xs text-muted-foreground">{convention.dateSignature}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
