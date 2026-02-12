'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  ArrowLeft,
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  Download,
  Calendar,
} from 'lucide-react'
import { getUniversiteStats, getUniversiteConventions } from '@/app/actions/universite-actions'

export default function RapportsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [statsData, setStatsData] = useState({
    totalStagiaires: 0,
    conventionsSignees: 0,
    stagesEnCours: 0
  })
  const [conventions, setConventions] = useState<any[]>([])

  useEffect(() => {
    if (!user || user.role !== 'universite') {
      router.push('/connexion')
      return
    }

    const loadData = async () => {
      try {
        const [stats, convData] = await Promise.all([
          getUniversiteStats(user.id),
          getUniversiteConventions(user.id)
        ])
        setStatsData(stats)
        setConventions(convData)
      } catch (error) {
        console.error("Erreur chargement rapports", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, router])

  if (!user || user.role !== 'universite') {
    return null
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>
  }

  // Calculer les statistiques
  const conventionsSignees = conventions.filter(c => 
    c.status === 'signee' || c.status === 'signee_complete'
  ).length
  
  const conventionsEnAttente = conventions.filter(c => 
    c.status === 'en_attente' || c.status === 'generee'
  ).length

  const tauxSignature = conventions.length > 0 
    ? Math.round((conventionsSignees / conventions.length) * 100) 
    : 0

  const handleDownloadReport = (format: 'pdf' | 'excel') => {
    console.log(`Télécharger rapport en ${format}`)
    // Implémentation à venir
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/universite">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au tableau de bord
            </Button>
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                <BarChart3 className="h-8 w-8" />
                Rapports et Statistiques
              </h1>
              <p className="text-muted-foreground">
                Analyse complète de vos stagiaires et conventions
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDownloadReport('pdf')}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDownloadReport('excel')}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Excel
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Stagiaires total</p>
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-3xl font-bold">{statsData.totalStagiaires}</p>
                <p className="text-xs text-muted-foreground">Étudiants inscrits</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Conventions signées</p>
                  <FileText className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-3xl font-bold">{conventionsSignees}</p>
                <p className="text-xs text-muted-foreground">{tauxSignature}% de signature</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Stages en cours</p>
                  <TrendingUp className="h-4 w-4 text-amber-600" />
                </div>
                <p className="text-3xl font-bold">{statsData.stagesEnCours}</p>
                <p className="text-xs text-muted-foreground">Actuellement actifs</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">En attente</p>
                  <Calendar className="h-4 w-4 text-red-600" />
                </div>
                <p className="text-3xl font-bold">{conventionsEnAttente}</p>
                <p className="text-xs text-muted-foreground">À traiter</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rapports Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Status des Conventions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statut des Conventions</CardTitle>
              <CardDescription>Distribution des conventions par statut</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Signées</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {conventionsSignees}
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${conventions.length > 0 ? (conventionsSignees / conventions.length) * 100 : 0}%`
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">En attente</span>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      {conventionsEnAttente}
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{
                        width: `${conventions.length > 0 ? (conventionsEnAttente / conventions.length) * 100 : 0}%`
                      }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Total: <span className="font-semibold text-foreground">{conventions.length} conventions</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Détail par Département */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Distribution par Département</CardTitle>
              <CardDescription>Nombre de stagiaires par département</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {conventions.length > 0 ? (
                  (() => {
                    const byDepartement: { [key: string]: number } = {}
                    conventions.forEach(c => {
                      if (c.departement) {
                        byDepartement[c.departement] = (byDepartement[c.departement] || 0) + 1
                      }
                    })
                    
                    return Object.entries(byDepartement).map(([dept, count]) => (
                      <div key={dept} className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <span className="font-medium text-foreground">{dept}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))
                  })()
                ) : (
                  <p className="text-center text-muted-foreground py-4">Aucune donnée disponible</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conventions détaillées */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Liste des Conventions</CardTitle>
            <CardDescription>Détail complète de toutes les conventions</CardDescription>
          </CardHeader>
          <CardContent>
            {conventions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune convention enregistrée
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Stagiaire</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Sujet</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Département</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Dates</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conventions.map((conv) => (
                      <tr key={conv.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-foreground">
                              {conv.stagiaire?.prenom} {conv.stagiaire?.nom}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {conv.stagiaire?.formation}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-foreground">{conv.sujet}</td>
                        <td className="py-3 px-4 text-foreground">{conv.departement}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {new Date(conv.dateDebut).toLocaleDateString('fr-FR')} à{' '}
                          {new Date(conv.dateFin).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant="outline"
                            className={
                              conv.status === 'signee_complete' || conv.status === 'signee'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            }
                          >
                            {conv.status === 'signee_complete' ? 'Signée' : 
                             conv.status === 'signee' ? 'Signée' :
                             'En attente'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Export Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Exporter les données</CardTitle>
            <CardDescription>Téléchargez les données brutes pour une analyse personnalisée</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => handleDownloadReport('pdf')}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Télécharger en PDF
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleDownloadReport('excel')}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Télécharger en Excel
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
