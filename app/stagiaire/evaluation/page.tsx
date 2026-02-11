'use client'

import { useAuth } from '@/lib/auth-context'
import { mockEvaluations, mockTuteurs } from '@/lib/mock-data'
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
  FileCheck,
} from 'lucide-react'

export default function EvaluationPage() {
  const { user } = useAuth()

  if (!user) return null

  const evaluation = mockEvaluations.find(e => e.stagiaireId === user.id)
  const tuteur = evaluation 
    ? mockTuteurs.find(t => t.id === evaluation.tuteurId)
    : null

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

  const moyenneNote = (
    evaluation.competencesTechniques + 
    evaluation.autonomie + 
    evaluation.integrationEquipe
  ) / 3

  const renderStars = (note: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= note 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-200'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{note}/5</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mon évaluation</h1>
        <p className="mt-1 text-muted-foreground">
          Consultez votre évaluation de fin de stage
        </p>
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">
                {moyenneNote.toFixed(1)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Évaluation globale</h2>
              <p className="text-muted-foreground">
                Moyenne de vos compétences évaluées
              </p>
              <div className="flex items-center gap-2 mt-2">
                {renderStars(Math.round(moyenneNote))}
              </div>
            </div>
            <div className="ml-auto">
              {evaluation.certificatGenere && (
                <Badge className="bg-green-100 text-green-800">
                  <FileCheck className="h-3 w-3 mr-1" />
                  Certificat disponible
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed scores */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Compétences techniques
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStars(evaluation.competencesTechniques)}
            <Progress 
              value={(evaluation.competencesTechniques / 5) * 100} 
              className="h-2 mt-3" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Autonomie
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStars(evaluation.autonomie)}
            <Progress 
              value={(evaluation.autonomie / 5) * 100} 
              className="h-2 mt-3" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Intégration équipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStars(evaluation.integrationEquipe)}
            <Progress 
              value={(evaluation.integrationEquipe / 5) * 100} 
              className="h-2 mt-3" 
            />
          </CardContent>
        </Card>
      </div>

      {/* Comments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Commentaires du tuteur</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">
            {evaluation.commentaires}
          </p>
          
          {tuteur && (
            <div className="flex items-center gap-3 mt-6 pt-4 border-t">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{tuteur.prenom} {tuteur.nom}</p>
                <p className="text-sm text-muted-foreground">{tuteur.poste}</p>
              </div>
              <div className="ml-auto text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(evaluation.date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certificate */}
      {evaluation.certificatGenere && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4" />
              Certificat de stage
            </CardTitle>
            <CardDescription>
              Votre certificat de stage a été généré automatiquement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Télécharger le certificat (PDF)
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
