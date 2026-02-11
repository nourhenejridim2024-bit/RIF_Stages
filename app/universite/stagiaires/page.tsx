'use client'

import { useAuth } from '@/lib/auth-context'
import { mockStagiaires, mockConventions, mockTachesOnboarding } from '@/lib/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Users, Search, MapPin, GraduationCap, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function StagiairesUniversitePage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')

  if (!user || user.role !== 'universite') return null

  // Get stagiaires linked to this university
  const stagiairesUniversite = mockStagiaires.filter(s => s.universitId === user.id)
  
  // Filter by search
  const filteredStagiaires = stagiairesUniversite.filter(s =>
    s.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.specialite.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getOnboardingProgress = (stagiaireId: string) => {
    const taches = mockTachesOnboarding.filter(t => t.stagiaireId === stagiaireId)
    if (taches.length === 0) return 0
    const completed = taches.filter(t => t.status === 'termine').length
    return Math.round((completed / taches.length) * 100)
  }

  const getStatusBadge = (stagiaireId: string) => {
    const convention = mockConventions.find(c => c.stagiaireId === stagiaireId)
    const progress = getOnboardingProgress(stagiaireId)
    
    if (!convention) {
      return <Badge variant="outline">En attente</Badge>
    }
    if (progress === 100) {
      return <Badge className="bg-green-600 text-white">Complété</Badge>
    }
    return <Badge className="bg-blue-600 text-white">En cours ({progress}%)</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-8 w-8" />
          Stagiaires de votre université
        </h1>
        <p className="mt-2 text-muted-foreground">
          Suivez la progression de vos stagiaires chez RIF
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{stagiairesUniversite.length}</p>
              <p className="text-sm text-muted-foreground">Stagiaires total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {stagiairesUniversite.filter(s => 
                  mockConventions.find(c => c.stagiaireId === s.id)
                ).length}
              </p>
              <p className="text-sm text-muted-foreground">En convention</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {stagiairesUniversite.filter(s => getOnboardingProgress(s.id) > 0).length}
              </p>
              <p className="text-sm text-muted-foreground">Onboarding en cours</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Chercher un stagiaire..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      {/* Stagiaires List */}
      {filteredStagiaires.length === 0 ? (
        <Card className="p-12 text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Aucun stagiaire trouvé</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredStagiaires.map(stagiaire => {
            const convention = mockConventions.find(c => c.stagiaireId === stagiaire.id)
            const progress = getOnboardingProgress(stagiaire.id)
            const tachesTotales = mockTachesOnboarding.filter(t => t.stagiaireId === stagiaire.id).length

            return (
              <Card key={stagiaire.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {stagiaire.prenom} {stagiaire.nom}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {stagiaire.email}
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {stagiaire.specialite}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {stagiaire.ecole}
                          </span>
                        </div>
                        {convention && (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="text-muted-foreground">
                              Convention signée
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Onboarding progress */}
                      {convention && tachesTotales > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Onboarding: {progress}%
                            </span>
                            <span className="text-xs font-medium">
                              {mockTachesOnboarding.filter(t => t.stagiaireId === stagiaire.id && t.status === 'termine').length}/{tachesTotales}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      {getStatusBadge(stagiaire.id)}
                      <Link href={`/universite/stagiaires/${stagiaire.id}`}>
                        <Button size="sm" variant="outline" className="w-full bg-transparent">
                          Détails
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
