'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { mockStagiaires, mockConventions } from '@/lib/mock-data'
import Link from 'next/link'
import {
  FileText,
  Download,
  Eye,
  Search,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react'

export default function ConventionsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'universite') {
      router.push('/connexion')
    }
  }, [user, router])

  if (!user || user.role !== 'universite') {
    return null
  }

  const stagiairesUniversite = mockStagiaires.filter(s => s.universitId === user.id)
  const conventions = mockConventions.filter(c =>
    stagiairesUniversite.some(s => s.id === c.stagiaireId)
  )

  const filteredConventions = conventions.filter(conv => {
    const stagiaire = stagiairesUniversite.find(s => s.id === conv.stagiaireId)
    if (!stagiaire) return false
    const searchLower = searchQuery.toLowerCase()
    return (
      stagiaire.prenom.toLowerCase().includes(searchLower) ||
      stagiaire.nom.toLowerCase().includes(searchLower) ||
      conv.contenu.sujet.toLowerCase().includes(searchLower)
    )
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'signee_complete':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle2 className="h-3 w-3 mr-1" />Signée</Badge>
      case 'en_attente':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />En attente</Badge>
      default:
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" />{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/universite">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Conventions de stage</h1>
          <p className="text-muted-foreground">
            Gérez les conventions de stage de vos stagiaires ({conventions.length} au total)
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, stagiaire ou sujet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conventions List */}
        <div className="space-y-4">
          {filteredConventions.length === 0 ? (
            <Card className="border border-border">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-foreground mb-2">
                  {searchQuery ? 'Aucune convention trouvée' : 'Aucune convention'}
                </p>
                <p className="text-muted-foreground text-center">
                  {searchQuery
                    ? 'Essayez de modifier votre recherche'
                    : 'Les conventions de stage apparaîtront ici'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredConventions.map((convention) => {
              const stagiaire = stagiairesUniversite.find(s => s.id === convention.stagiaireId)
              if (!stagiaire) return null

              return (
                <Card key={convention.id} className="border border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-3">
                          <h3 className="text-lg font-semibold text-foreground">
                            {stagiaire.prenom} {stagiaire.nom}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {stagiaire.specialite}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Sujet</p>
                            <p className="text-sm font-medium text-foreground">
                              {convention.contenu.sujet}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Département</p>
                            <p className="text-sm font-medium text-foreground">
                              {convention.contenu.departement}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Dates</p>
                            <p className="text-sm font-medium text-foreground">
                              {new Date(convention.contenu.dateDebut).toLocaleDateString('fr-FR')} à{' '}
                              {new Date(convention.contenu.dateFin).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Tuteur</p>
                            <p className="text-sm font-medium text-foreground">
                              {convention.contenu.tuteurNom}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {getStatusBadge(convention.status)}
                          <span className="text-xs text-muted-foreground">
                            Générée le {new Date(convention.dateGeneration).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                          <Eye className="h-4 w-4" />
                          Voir
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                          <Download className="h-4 w-4" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
