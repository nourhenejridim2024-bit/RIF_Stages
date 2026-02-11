'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { mockStagiaires, mockEcoles } from '@/lib/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Search, GraduationCap } from 'lucide-react'

export default function StagiairesEcolePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'ecole') {
      router.push('/connexion')
    }
  }, [user, router])

  if (!user || user.role !== 'ecole') {
    return null
  }

  const stagiairesList = mockStagiaires.filter(s => s.ecoleId === user.id)
  const ecoleInfo = mockEcoles.find(e => e.id === user.id)

  const filtered = stagiairesList.filter(stagiaire =>
    `${stagiaire.prenom} ${stagiaire.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stagiaire.specialite.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stagiaire.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'acceptee': return 'bg-green-100 text-green-800'
      case 'en_revision': return 'bg-amber-100 text-amber-800'
      case 'soumise': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/ecole">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Stagiaires - {ecoleInfo?.nomEcole}
            </h1>
            <p className="text-sm text-muted-foreground">
              Total: {stagiairesList.length} stagiaires
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, spécialité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Stagiaires List */}
        {filtered.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="pt-6 text-center">
              <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                {searchTerm ? 'Aucun stagiaire ne correspond à votre recherche' : 'Aucun stagiaire'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((stagiaire) => (
              <Card key={stagiaire.id} className="border-border/50 hover:border-border transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {stagiaire.prenom[0]}{stagiaire.nom[0]}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {stagiaire.prenom} {stagiaire.nom}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {stagiaire.specialite}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {stagiaire.email}
                      </Badge>
                      <Link href={`/ecole/stagiaires/${stagiaire.id}`}>
                        <Button size="sm" variant="outline">
                          Détails
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
