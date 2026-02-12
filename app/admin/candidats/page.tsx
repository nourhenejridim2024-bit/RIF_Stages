'use client'

import { useState, useEffect } from 'react'
import { mockCandidaturesExternes } from '@/lib/mock-data'
import { DEPARTEMENTS, type CandidatureExterne } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Search,
  Filter,
  Eye,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Send,
  Copy,
  Loader2,
  KeyRound,
  User,
  X,
} from 'lucide-react'

export default function AdminCandidatsPage() {
  const [candidatures, setCandidatures] = useState<CandidatureExterne[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedCandidature, setSelectedCandidature] = useState<CandidatureExterne | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isCreateAccountDialogOpen, setIsCreateAccountDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [tuteurId, setTuteurId] = useState('')

  // Mock tuteurs data (Garder les tuteurs mockés pour l'instant car pas d'API tuteurs)
  const mockTuteurs = [
    { id: 'tut-1', nom: 'Moreau', prenom: 'Philippe', departement: 'Informatique' },
    { id: 'tut-2', nom: 'Durand', prenom: 'Claire', departement: 'Marketing' },
    { id: 'tut-3', nom: 'Bernard', prenom: 'Marc', departement: 'Finance' },
    { id: 'tut-4', nom: 'Lefebvre', prenom: 'Sophie', departement: 'Communication' },
    { id: 'tut-5', nom: 'Girard', prenom: 'Antoine', departement: 'Ressources Humaines' },
  ]

  useEffect(() => {
    fetchCandidatures()
  }, [])

  const fetchCandidatures = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/candidatures')
      if (response.ok) {
        const data = await response.json()
        // Filtrer pour ne garder que les candidatures traitées (acceptee, refusee, compte_cree)
        // L'admin ne s'occupe pas des "nouvelles" ou "en_revision"
        const traites = data.filter((c: CandidatureExterne) =>
          ['acceptee', 'refusee', 'compte_cree'].includes(c.status)
        )
        setCandidatures(traites)
      }
    } catch (error) {
      console.error('Erreur chargement candidatures:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Statistics
  const acceptees = candidatures.filter(c => c.status === 'acceptee').length
  const compteCrees = candidatures.filter(c => c.status === 'compte_cree').length
  const refusees = candidatures.filter(c => c.status === 'refusee').length

  // Filter candidatures
  const filteredCandidatures = candidatures
    .filter(c => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        return (
          c.nom.toLowerCase().includes(searchLower) ||
          c.prenom.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower) ||
          c.formation.toLowerCase().includes(searchLower)
        )
      }

      return true
    })
    .sort((a, b) => {
      // Sort by status (acceptee first) then by date
      if (a.status === 'acceptee' && b.status !== 'acceptee') return -1
      if (a.status !== 'acceptee' && b.status === 'acceptee') return 1
      return new Date(b.dateDecision || b.dateSoumission).getTime() - new Date(a.dateDecision || a.dateSoumission).getTime()
    })

  const handleView = (candidature: CandidatureExterne) => {
    setSelectedCandidature(candidature)
    setIsViewDialogOpen(true)
  }

  const handleCreateAccount = (candidature: CandidatureExterne) => {
    setSelectedCandidature(candidature)
    setTuteurId('')
    setIsSuccess(false)
    setGeneratedPassword('')
    setIsCreateAccountDialogOpen(true)
  }

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  const confirmCreateAccount = async () => {
    if (!selectedCandidature || !tuteurId) return

    setIsCreating(true)

    // Generate password
    const password = generatePassword()
    setGeneratedPassword(password)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Update candidature status
    setCandidatures(prev => prev.map(c => {
      if (c.id === selectedCandidature.id) {
        return {
          ...c,
          status: 'compte_cree',
          compteCreeLe: new Date().toISOString().split('T')[0],
        }
      }
      return c
    }))

    setIsCreating(false)
    setIsSuccess(true)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const filteredTuteurs = mockTuteurs.filter(t =>
    !selectedCandidature?.departementAffecte || t.departement === selectedCandidature.departementAffecte
  )

  const niveauLabels: Record<string, string> = {
    'bac+2': 'Bac+2',
    'bac+3': 'Bac+3 (Licence)',
    'bac+4': 'Bac+4',
    'bac+5': 'Bac+5 (Master)',
    'autre': 'Autre',
  }

  const dureeLabels: Record<string, string> = {
    '1-2': '1 a 2 mois',
    '2-4': '2 a 4 mois',
    '4-6': '4 a 6 mois',
    '6+': 'Plus de 6 mois',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Candidats acceptes</h1>
        <p className="mt-1 text-muted-foreground">
          Creez les comptes des candidats acceptes par les RH
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <UserPlus className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{acceptees}</p>
                <p className="text-sm text-muted-foreground">En attente de compte</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{compteCrees}</p>
                <p className="text-sm text-muted-foreground">Comptes crees</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <X className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{refusees}</p>
                <p className="text-sm text-muted-foreground">Refusees</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, email, formation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="acceptee">En attente de compte</SelectItem>
                  <SelectItem value="compte_cree">Compte cree</SelectItem>
                  <SelectItem value="refusee">Refusee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des candidats acceptes</CardTitle>
          <CardDescription>
            {filteredCandidatures.length} candidat(s) trouve(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidat</TableHead>
                  <TableHead>Formation</TableHead>
                  <TableHead>Departement</TableHead>
                  <TableHead>Date acceptation</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidatures.map((candidature) => (
                  <TableRow key={candidature.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary">
                            {candidature.prenom.charAt(0)}{candidature.nom.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{candidature.prenom} {candidature.nom}</p>
                          <p className="text-sm text-muted-foreground">{candidature.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{candidature.formation}</p>
                      <p className="text-sm text-muted-foreground">{niveauLabels[candidature.niveau] || candidature.niveau}</p>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{candidature.departementAffecte || '-'}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {candidature.dateDecision}
                      </span>
                    </TableCell>
                    <TableCell>
                      {candidature.status === 'acceptee' ? (
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
                          En attente
                        </Badge>
                      ) : candidature.status === 'compte_cree' ? (
                        <Badge variant="default" className="bg-green-600">
                          Compte cree
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          Refusee
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(candidature)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Voir</span>
                        </Button>
                        {candidature.status === 'acceptee' && (
                          <Button
                            size="sm"
                            onClick={() => handleCreateAccount(candidature)}
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Creer compte
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCandidatures.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Aucun candidat accepte trouve
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Details du candidat</DialogTitle>
            <DialogDescription>
              Informations completes sur le candidat accepte
            </DialogDescription>
          </DialogHeader>

          {selectedCandidature && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xl font-semibold text-primary">
                      {selectedCandidature.prenom.charAt(0)}{selectedCandidature.nom.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedCandidature.prenom} {selectedCandidature.nom}</h3>
                    <p className="text-muted-foreground">{selectedCandidature.email}</p>
                  </div>
                </div>
                {selectedCandidature.status === 'compte_cree' ? (
                  <Badge variant="default">Compte cree</Badge>
                ) : (
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
                    En attente
                  </Badge>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Coordonnees
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      {selectedCandidature.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {selectedCandidature.telephone}
                    </p>
                    {selectedCandidature.adresse && (
                      <p className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {selectedCandidature.adresse}, {selectedCandidature.codePostal} {selectedCandidature.ville}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Formation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p><span className="text-muted-foreground">Formation:</span> {selectedCandidature.formation}</p>
                    <p><span className="text-muted-foreground">Niveau:</span> {niveauLabels[selectedCandidature.niveau] || selectedCandidature.niveau}</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Affectation
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p><span className="text-muted-foreground">Departement:</span> {selectedCandidature.departementAffecte}</p>
                  <p><span className="text-muted-foreground">Date de debut:</span> {selectedCandidature.dateDebut}</p>
                  <p><span className="text-muted-foreground">Duree:</span> {dureeLabels[selectedCandidature.duree] || selectedCandidature.duree}</p>
                  {selectedCandidature.commentairesRH && (
                    <div className="pt-2">
                      <p className="text-muted-foreground mb-1">Notes RH:</p>
                      <p className="bg-muted p-3 rounded">{selectedCandidature.commentairesRH}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {selectedCandidature.status === 'acceptee' && (
                <Button
                  className="w-full"
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    handleCreateAccount(selectedCandidature)
                  }}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Creer le compte
                </Button>
              )}

              {selectedCandidature.compteCreeLe && (
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <p className="text-sm text-green-700 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Compte cree le {selectedCandidature.compteCreeLe}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Account Dialog */}
      <Dialog open={isCreateAccountDialogOpen} onOpenChange={setIsCreateAccountDialogOpen}>
        <DialogContent className="max-w-md">
          {isSuccess ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  Compte cree avec succes !
                </DialogTitle>
                <DialogDescription>
                  Le compte a ete cree et les identifiants ont ete envoyes par email.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-mono text-sm">{selectedCandidature?.email}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(selectedCandidature?.email || '')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Mot de passe</p>
                        <p className="font-mono text-sm">{generatedPassword}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(generatedPassword)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    Un email avec ces identifiants a ete envoye a {selectedCandidature?.email}
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button onClick={() => setIsCreateAccountDialogOpen(false)}>
                  Fermer
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Creer un compte stagiaire</DialogTitle>
                <DialogDescription>
                  Creez un compte pour {selectedCandidature?.prenom} {selectedCandidature?.nom}.
                  Un email avec les identifiants sera envoye automatiquement.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {selectedCandidature?.prenom.charAt(0)}{selectedCandidature?.nom.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{selectedCandidature?.prenom} {selectedCandidature?.nom}</p>
                      <p className="text-sm text-muted-foreground">{selectedCandidature?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Assigner un tuteur *</Label>
                  <Select value={tuteurId} onValueChange={setTuteurId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectionnez un tuteur" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredTuteurs.map((tuteur) => (
                        <SelectItem key={tuteur.id} value={tuteur.id}>
                          {tuteur.prenom} {tuteur.nom} - {tuteur.departement}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Tuteurs du departement {selectedCandidature?.departementAffecte}
                  </p>
                </div>

                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-sm text-blue-700 flex items-center gap-2">
                    <KeyRound className="h-4 w-4" />
                    Un mot de passe securise sera genere automatiquement
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateAccountDialogOpen(false)} className="bg-transparent">
                  Annuler
                </Button>
                <Button
                  onClick={confirmCreateAccount}
                  disabled={isCreating || !tuteurId}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creation en cours...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Creer et envoyer
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
