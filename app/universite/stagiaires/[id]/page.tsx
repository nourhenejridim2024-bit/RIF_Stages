'use client'

import { useAuth } from '@/lib/auth-context'
import { mockStagiaires, mockConventions, mockTachesOnboarding } from '@/lib/mock-data'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, CheckCircle2, Clock, Circle, AlertCircle, User, Mail, Phone, BookOpen, Briefcase } from 'lucide-react'
import Link from 'next/link'

const statusConfig = {
  a_faire: { label: 'À faire', icon: Circle, color: 'text-muted-foreground' },
  en_cours: { label: 'En cours', icon: Clock, color: 'text-orange-500' },
  termine: { label: 'Terminé', icon: CheckCircle2, color: 'text-green-600' },
}

export default function StagiaireDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const stagiaireId = params.id as string

  if (!user || user.role !== 'universite') return null

  const stagiaire = mockStagiaires.find(s => s.id === stagiaireId && s.universitId === user.id)
  
  if (!stagiaire) {
    return (
      <div className="space-y-4">
        <Link href="/universite/stagiaires">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Stagiaire non trouvé ou vous n'avez pas accès à cet enregistrement.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const convention = mockConventions.find(c => c.stagiaireId === stagiaireId)
  const taches = mockTachesOnboarding.filter(t => t.stagiaireId === stagiaireId)
  const tachesTerminees = taches.filter(t => t.status === 'termine').length
  const tachesEnCours = taches.filter(t => t.status === 'en_cours').length
  const progress = taches.length > 0 ? (tachesTerminees / taches.length) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/universite/stagiaires">
          <Button variant="outline" size="sm" className="mb-4 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux stagiaires
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">
          {stagiaire.prenom} {stagiaire.nom}
        </h1>
        <p className="text-muted-foreground mt-2">
          Suivi du stagiaire et progression d'onboarding
        </p>
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informations stagiaire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Nom complet</p>
                  <p className="font-medium">{stagiaire.prenom} {stagiaire.nom}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{stagiaire.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{stagiaire.telephone}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Formation</p>
                  <p className="font-medium">{stagiaire.specialite}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">École</p>
                  <p className="font-medium">{stagiaire.ecole}</p>
                </div>
              </div>
              {convention && (
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Convention</p>
                    <p className="font-medium text-green-600">Signée le {convention.dateSignature}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Progress */}
      {!convention && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            La convention n'a pas encore été signée. L'onboarding débutera une fois la convention finalisée.
          </AlertDescription>
        </Alert>
      )}

      {convention && taches.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Progression d'onboarding</CardTitle>
              <CardDescription>
                Suivi des tâches d'intégration du stagiaire
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Progress */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">Progression globale</h3>
                    <p className="text-sm text-muted-foreground">
                      {tachesTerminees} sur {taches.length} tâches complétées
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              {/* Status Overview */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Terminées</span>
                  </div>
                  <p className="text-2xl font-bold">{tachesTerminees}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-orange-500" />
                    <span className="font-medium">En cours</span>
                  </div>
                  <p className="text-2xl font-bold">{tachesEnCours}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Circle className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">À faire</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {taches.length - tachesTerminees - tachesEnCours}
                  </p>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                <h3 className="font-semibold">Tâches d'onboarding</h3>
                {taches.map(tache => {
                  const StatusIcon = statusConfig[tache.status].icon
                  return (
                    <div 
                      key={tache.id}
                      className="flex items-center gap-3 p-4 border border-border rounded-lg"
                    >
                      <StatusIcon className={`h-5 w-5 ${statusConfig[tache.status].color}`} />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{tache.titre}</p>
                        <p className="text-sm text-muted-foreground">
                          {tache.description}
                        </p>
                      </div>
                      <Badge variant={tache.status === 'termine' ? 'default' : 'outline'}>
                        {statusConfig[tache.status].label}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {convention && taches.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Aucune tâche d'onboarding n'a été créée pour ce stagiaire. 
            Contactez le tuteur ou l'équipe RH pour initialiser l'onboarding.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
