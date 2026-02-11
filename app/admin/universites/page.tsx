'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockUniversites, mockStagiaires } from '@/lib/mock-data'
import {
  Building2,
  Users,
  Mail,
  Phone,
  GraduationCap,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function UniversitesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/connexion')
    }
  }, [user, router])

  if (!user || user.role !== 'admin') {
    return null
  }

  const filteredUniversites = mockUniversites.filter(
    u =>
      u.nomUniversite.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestion des Universités</h1>
          <p className="text-muted-foreground mt-2">
            Gérez les comptes universitaires et leurs stagiaires
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle université
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-card">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom d'université ou email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Universités Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredUniversites.map(universite => {
          const stagiairesCount = mockStagiaires.filter(
            s => s.universitId === universite.id
          ).length

          return (
            <Card key={universite.id} className="bg-card hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{universite.nomUniversite}</CardTitle>
                    </div>
                    <CardDescription className="text-xs">
                      {universite.prenom} {universite.nom}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir détails
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Users className="mr-2 h-4 w-4" />
                        Gérer stagiaires
                      </DropdownMenuItem>
                      <DropdownMenuItem>Modifier</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{universite.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>Téléphone à ajouter</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{stagiairesCount}</div>
                    <div className="text-xs text-muted-foreground">Stagiaires</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {stagiairesCount > 0 ? '100%' : '0%'}
                    </div>
                    <div className="text-xs text-muted-foreground">Activité</div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex gap-2 pt-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Actif
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Accepté
                  </Badge>
                </div>

                {/* Action Button */}
                <Button variant="outline" className="w-full bg-transparent">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Voir stagiaires ({stagiairesCount})
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredUniversites.length === 0 && (
        <Card className="bg-card">
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune université trouvée</p>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle>Résumé</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-primary">{mockUniversites.length}</div>
              <div className="text-sm text-muted-foreground">Universités partenaires</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{mockStagiaires.length}</div>
              <div className="text-sm text-muted-foreground">Stagiaires totaux</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">4</div>
              <div className="text-sm text-muted-foreground">Comptes actifs</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
