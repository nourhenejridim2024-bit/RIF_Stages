'use client'

import { useAuth } from '@/lib/auth-context'
import { getUniversiteStagiaires, getUniversiteDetailedStats, getCandidaturesExternes, getUniversiteConventions } from '@/app/actions/universite-actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  MapPin, 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  BarChart3,
  TrendingUp,
  UserPlus
} from 'lucide-react'
import Link from 'next/link'

export default function StagiairesUniversitePage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [stagiaires, setStagiaires] = useState<any[]>([])
  const [candidatures, setCandidatures] = useState<any[]>([])
  const [conventions, setConventions] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalStagiaires: 0,
    conventionsSignees: 0,
    conventionsEnAttente: 0,
    stagesEnCours: 0,
    candidaturesNouvelles: 0,
    candidaturesAcceptees: 0,
    candidaturesRefusees: 0,
    candidaturesTotal: 0
  })

  useEffect(() => {
    if (user && user.role === 'universite') {
      const loadData = async () => {
        try {
          const [stagiaireData, statsData, candidaturesData, conventionsData] = await Promise.all([
            getUniversiteStagiaires(user.id),
            getUniversiteDetailedStats(user.id),
            getCandidaturesExternes(),
            getUniversiteConventions(user.id)
          ])
          setStagiaires(stagiaireData)
          setStats(statsData)
          setCandidatures(candidaturesData)
          setConventions(conventionsData)
          setLoading(false)
        } catch (err) {
          console.error(err)
          setLoading(false)
        }
      }
      loadData()
    }
  }, [user])

  if (!user || user.role !== 'universite') return null

  if (loading) return <div className="flex justify-center items-center h-screen">Chargement...</div>

  // Filter by search
  const filteredStagiaires = stagiaires.filter(s =>
    s.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.specialite?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.ecole?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (stagiaire: any) => {
    const convention = stagiaire.conventions && stagiaire.conventions.length > 0 ? stagiaire.conventions[0] : null;
    if (convention) {
      if (convention.status === 'signee_complete') {
        return <Badge className="bg-green-600 text-white">En stage</Badge>
      }
      return <Badge className="bg-blue-600 text-white">Convention {convention.status}</Badge>
    }
    return <Badge variant="outline">À assigner</Badge>
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

      {/* Detailed Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Stagiaires</p>
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-3xl font-bold">{stats.totalStagiaires}</p>
              <p className="text-xs text-muted-foreground">Inscrit</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Conventions</p>
                <FileText className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-3xl font-bold">{stats.conventionsSignees}</p>
              <p className="text-xs text-muted-foreground">Signées</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Candidatures</p>
                <UserPlus className="h-4 w-4 text-amber-600" />
              </div>
              <p className="text-3xl font-bold">{stats.candidaturesTotal}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">En cours</p>
                <TrendingUp className="h-4 w-4 text-red-600" />
              </div>
              <p className="text-3xl font-bold">{stats.stagesEnCours}</p>
              <p className="text-xs text-muted-foreground">Actifs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Tabs */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Chercher un stagiaire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="stagiaires" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stagiaires">Stagiaires ({stagiaires.length})</TabsTrigger>
            <TabsTrigger value="conventions">Conventions ({conventions.length})</TabsTrigger>
            <TabsTrigger value="candidatures">Candidatures ({stats.candidaturesTotal})</TabsTrigger>
            <TabsTrigger value="rapports">Rapports</TabsTrigger>
          </TabsList>

          {/* Stagiaires Tab */}
          <TabsContent value="stagiaires" className="space-y-4">
            {filteredStagiaires.length === 0 ? (
              <Card className="p-12 text-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Aucun stagiaire trouvé</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredStagiaires.map(stagiaire => {
                  const convention = stagiaire.conventions && stagiaire.conventions.length > 0 ? stagiaire.conventions[0] : null

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
                                  {stagiaire.specialite || 'Non renseigné'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  {stagiaire.ecole?.name || 'École inconnue'}
                                </span>
                              </div>
                              {convention && (
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  <span className="text-muted-foreground">
                                    Convention existante
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            {getStatusBadge(stagiaire)}
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
          </TabsContent>

          {/* Conventions Tab */}
          <TabsContent value="conventions" className="space-y-4">
            {conventions.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground mb-4">Aucune convention enregistrée</p>
                <Link href="/universite/conventions">
                  <Button>Gérer les conventions</Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Convention Stats */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-green-600">{stats.conventionsSignees}</p>
                        <p className="text-sm text-muted-foreground">Signées</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-yellow-600">{stats.conventionsEnAttente}</p>
                        <p className="text-sm text-muted-foreground">En attente</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-amber-600">{stats.stagesEnCours}</p>
                        <p className="text-sm text-muted-foreground">En cours</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Conventions List */}
                <div className="grid gap-4">
                  {conventions.map((conv) => (
                    <Card key={conv.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">
                              {conv.stagiaire?.prenom} {conv.stagiaire?.nom}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {conv.stagiaire?.formation}
                            </p>
                            <div className="grid md:grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-xs text-muted-foreground">Sujet</p>
                                <p className="font-medium">{conv.sujet}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Département</p>
                                <p className="font-medium">{conv.departement}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Dates</p>
                                <p className="font-medium">
                                  {new Date(conv.dateDebut).toLocaleDateString('fr-FR')} à{' '}
                                  {new Date(conv.dateFin).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Tuteur</p>
                                <p className="font-medium">{conv.tuteurNom}</p>
                              </div>
                            </div>
                          </div>
                          <Badge
                            className={
                              conv.status === 'signee_complete' || conv.status === 'signee'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {conv.status === 'signee_complete' ? 'Signée' : 
                             conv.status === 'signee' ? 'Signée' :
                             'En attente'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center pt-4">
                  <Link href="/universite/conventions">
                    <Button variant="outline">Voir toutes les conventions</Button>
                  </Link>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Candidatures Tab */}
          <TabsContent value="candidatures" className="space-y-4">
            {candidatures.length === 0 ? (
              <Card className="p-12 text-center">
                <UserPlus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Aucune candidature enregistrée</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Candidatures Stats */}
                <div className="grid md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-blue-600">{stats.candidaturesNouvelles}</p>
                        <p className="text-sm text-muted-foreground">Nouvelles</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-green-600">{stats.candidaturesAcceptees}</p>
                        <p className="text-sm text-muted-foreground">Acceptées</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-red-600">{stats.candidaturesRefusees}</p>
                        <p className="text-sm text-muted-foreground">Refusées</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold">{stats.candidaturesTotal}</p>
                        <p className="text-sm text-muted-foreground">Total</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Candidatures List */}
                <div className="grid gap-4">
                  {candidatures.slice(0, 10).map((cand) => (
                    <Card key={cand.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">
                              {cand.prenom} {cand.nom}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">{cand.email}</p>
                            <div className="grid md:grid-cols-3 gap-2 text-sm">
                              <div>
                                <p className="text-xs text-muted-foreground">Formation</p>
                                <p className="font-medium">{cand.formation}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Niveau</p>
                                <p className="font-medium">{cand.niveau}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Date soumission</p>
                                <p className="font-medium">{new Date(cand.dateSoumission).toLocaleDateString('fr-FR')}</p>
                              </div>
                            </div>
                          </div>
                          <Badge
                            className={
                              cand.status === 'acceptee'
                                ? 'bg-green-100 text-green-800'
                                : cand.status === 'refusee'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }
                          >
                            {cand.status === 'acceptee' ? 'Acceptée' :
                             cand.status === 'refusee' ? 'Refusée' :
                             'Nouvelle'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {candidatures.length > 10 && (
                  <div className="text-center pt-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Affichage des 10 premières candidatures
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total: {candidatures.length} candidatures
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Rapports Tab */}
          <TabsContent value="rapports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Rapports et Statistiques</CardTitle>
                <CardDescription>Résumé complet de votre activité</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Summary Stats */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Stagiaires
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total inscrits</span>
                        <span className="font-semibold">{stats.totalStagiaires}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Avec convention</span>
                        <span className="font-semibold text-green-600">{stats.conventionsSignees}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Stages actifs</span>
                        <span className="font-semibold text-amber-600">{stats.stagesEnCours}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Conventions
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Signées</span>
                        <span className="font-semibold text-green-600">{stats.conventionsSignees}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">En attente</span>
                        <span className="font-semibold text-yellow-600">{stats.conventionsEnAttente}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Taux de signature</span>
                        <span className="font-semibold">
                          {conventions.length > 0 
                            ? Math.round((stats.conventionsSignees / conventions.length) * 100)
                            : 0}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Candidatures
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Nouvelles</span>
                        <span className="font-semibold text-blue-600">{stats.candidaturesNouvelles}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Acceptées</span>
                        <span className="font-semibold text-green-600">{stats.candidaturesAcceptees}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Refusées</span>
                        <span className="font-semibold text-red-600">{stats.candidaturesRefusees}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Performance
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Taux d'acceptation</span>
                        <span className="font-semibold text-green-600">
                          {stats.candidaturesTotal > 0 
                            ? Math.round((stats.candidaturesAcceptees / stats.candidaturesTotal) * 100)
                            : 0}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Candidatures traitées</span>
                        <span className="font-semibold">
                          {stats.candidaturesAcceptees + stats.candidaturesRefusees}/{stats.candidaturesTotal}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Couverts actifs</span>
                        <span className="font-semibold">{stats.stagesEnCours}/{stats.totalStagiaires}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Link href="/universite/rapports" className="flex-1">
                    <Button className="w-full">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Accéder aux rapports détaillés
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )}