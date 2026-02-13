'use client'

import { useState, useEffect } from 'react'
import { DEPARTEMENTS, type CandidatureExterneStatus, type CandidatureExterne } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  FileText,
  Download,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Calendar,
  Clock,
  User,
  FileCheck,
  Building2,
  Loader2,
} from 'lucide-react'

const statusConfig: Record<CandidatureExterneStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  nouvelle: { label: 'Nouvelle', variant: 'outline' },
  en_revision: { label: 'En revision', variant: 'secondary' },
  acceptee: { label: 'Acceptee', variant: 'default' },
  refusee: { label: 'Refusee', variant: 'destructive' },
  compte_cree: { label: 'Compte cree', variant: 'default' },
}

const dureeLabels: Record<string, string> = {
  '1-2': '1 a 2 mois',
  '2-4': '2 a 4 mois',
  '4-6': '4 a 6 mois',
  '6+': 'Plus de 6 mois',
}

const niveauLabels: Record<string, string> = {
  'bac+2': 'Bac+2',
  'bac+3': 'Bac+3 (Licence)',
  'bac+4': 'Bac+4',
  'bac+5': 'Bac+5 (Master)',
  'autre': 'Autre',
}

export default function CandidaturesPage() {
  const [candidatures, setCandidatures] = useState<CandidatureExterne[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedCandidature, setSelectedCandidature] = useState<CandidatureExterne | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [tuteurs, setTuteurs] = useState<any[]>([])
  const [selectedTuteurId, setSelectedTuteurId] = useState<string>('')
  const [isAssigning, setIsAssigning] = useState(false)
  const [actionType, setActionType] = useState<'accept' | 'reject'>('accept')
  const [comment, setComment] = useState('')
  const [departement, setDepartement] = useState('')

  // Charger les candidatures et tuteurs
  useEffect(() => {
    fetchCandidatures()
    fetchTuteurs()
  }, [])

  const fetchTuteurs = async () => {
    try {
      const response = await fetch('/api/rh/tuteurs')
      if (response.ok) {
        const data = await response.json()
        setTuteurs(data)
      }
    } catch (error) {
      console.error('Error fetching tuteurs:', error)
    }
  }

  const fetchCandidatures = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/candidatures')
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des candidatures')
      }
      const data = await response.json()
      setCandidatures(data)
    } catch (error) {
      console.error('Error fetching candidatures:', error)
      alert('Erreur lors du chargement des candidatures')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAssign = (candidature: CandidatureExterne) => {
    setSelectedCandidature(candidature)
    setSelectedTuteurId(candidature.tuteurId || '')
    setIsAssigning(false)
    setIsAssignDialogOpen(true)
  }

  const confirmAssign = async () => {
    if (!selectedCandidature || !selectedTuteurId) return

    try {
      setIsAssigning(true)
      const response = await fetch(`/api/candidatures/${selectedCandidature.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tuteurId: selectedTuteurId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de l\'assignation')
      }

      await fetchCandidatures()
      setIsAssignDialogOpen(false)
      setSelectedCandidature(null)
    } catch (error) {
      console.error('Error assigning tuteur:', error)
      alert(error instanceof Error ? error.message : 'Erreur lors de l\'assignation du tuteur')
    } finally {
      setIsAssigning(false)
    }
  }


  // Statistics
  const stats = {
    nouvelles: candidatures.filter(c => c.status === 'nouvelle').length,
    enRevision: candidatures.filter(c => c.status === 'en_revision').length,
    acceptees: candidatures.filter(c => c.status === 'acceptee').length,
    refusees: candidatures.filter(c => c.status === 'refusee').length,
  }

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
    .sort((a, b) => new Date(b.dateSoumission).getTime() - new Date(a.dateSoumission).getTime())

  const handleView = (candidature: CandidatureExterne) => {
    setSelectedCandidature(candidature)
    setIsViewDialogOpen(true)
  }

  const handleAction = (candidature: CandidatureExterne, action: 'accept' | 'reject') => {
    setSelectedCandidature(candidature)
    setActionType(action)
    setComment('')
    setDepartement('')
    setIsActionDialogOpen(true)
  }

  const confirmAction = async () => {
    if (!selectedCandidature) return

    try {
      const response = await fetch(`/api/candidatures/${selectedCandidature.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: actionType === 'accept' ? 'acceptee' : 'refusee',
          commentairesRH: comment || undefined,
          departementAffecte: actionType === 'accept' ? departement : undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour')
      }

      // Rafraîchir la liste
      await fetchCandidatures()

      setIsActionDialogOpen(false)
      setSelectedCandidature(null)
    } catch (error) {
      console.error('Error updating candidature:', error)
      alert(error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la candidature')
    }
  }

  const markAsReviewing = async (candidature: CandidatureExterne) => {
    try {
      const response = await fetch(`/api/candidatures/${candidature.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'en_revision',
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour')
      }

      // Rafraîchir la liste
      await fetchCandidatures()
    } catch (error) {
      console.error('Error updating candidature:', error)
      alert('Erreur lors de la mise à jour de la candidature')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Gestion des candidatures</h1>
        <p className="mt-1 text-muted-foreground">
          Examinez et traitez les candidatures des candidats
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.nouvelles}</p>
                <p className="text-sm text-muted-foreground">Nouvelles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.enRevision}</p>
                <p className="text-sm text-muted-foreground">En revision</p>
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
                <p className="text-2xl font-bold">{stats.acceptees}</p>
                <p className="text-sm text-muted-foreground">Acceptees</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.refusees}</p>
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
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="nouvelle">Nouvelles</SelectItem>
                  <SelectItem value="en_revision">En revision</SelectItem>
                  <SelectItem value="acceptee">Acceptees</SelectItem>
                  <SelectItem value="refusee">Refusees</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* University Selector Reverted */}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des candidatures</CardTitle>
          <CardDescription>
            {filteredCandidatures.length} candidature(s) trouvee(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidat</TableHead>
                  <TableHead>Formation</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead>Date soumission</TableHead>
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
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <span className="mx-1">•</span>
                        {niveauLabels[candidature.niveau] || candidature.niveau}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{candidature.dateDebut}</p>
                      <p className="text-sm text-muted-foreground">{dureeLabels[candidature.duree] || candidature.duree}</p>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {candidature.dateSoumission}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[candidature.status].variant}>
                        {statusConfig[candidature.status].label}
                      </Badge>
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
                        {(candidature.status === 'acceptee' || candidature.status === 'compte_cree') && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleAssign(candidature)}
                          >
                            <User className="h-4 w-4" />
                            <span className="sr-only">Assigner tuteur</span>
                          </Button>
                        )}
                        {(candidature.status === 'nouvelle' || candidature.status === 'en_revision') && (
                          <>
                            {candidature.status === 'nouvelle' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                                onClick={() => markAsReviewing(candidature)}
                              >
                                <Clock className="h-4 w-4" />
                                <span className="sr-only">En revision</span>
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleAction(candidature, 'accept')}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="sr-only">Accepter</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-red-50"
                              onClick={() => handleAction(candidature, 'reject')}
                            >
                              <XCircle className="h-4 w-4" />
                              <span className="sr-only">Refuser</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCandidatures.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Aucune candidature trouvee
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
            <DialogTitle>Details de la candidature</DialogTitle>
            <DialogDescription>
              Informations completes sur le candidat
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
                <Badge variant={statusConfig[selectedCandidature.status].variant}>
                  {statusConfig[selectedCandidature.status].label}
                </Badge>
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
                    Stage souhaite
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p><span className="text-muted-foreground">Date de debut:</span> {selectedCandidature.dateDebut}</p>
                  <p><span className="text-muted-foreground">Duree:</span> {dureeLabels[selectedCandidature.duree] || selectedCandidature.duree}</p>
                  {selectedCandidature.departementAffecte && (
                    <p><span className="text-muted-foreground">Departement affecte:</span> {selectedCandidature.departementAffecte}</p>
                  )}
                  {selectedCandidature.message && (
                    <div className="pt-2">
                      <p className="text-muted-foreground mb-1">Message:</p>
                      <p className="bg-muted p-3 rounded">{selectedCandidature.message}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {selectedCandidature.commentairesRH && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileCheck className="h-4 w-4" />
                      Notes RH
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm bg-muted p-3 rounded">{selectedCandidature.commentairesRH}</p>
                    {selectedCandidature.dateDecision && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Decision prise le {selectedCandidature.dateDecision}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-2">
                {selectedCandidature.cvUrl && (
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => window.open(selectedCandidature.cvUrl, '_blank')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Telecharger CV
                  </Button>
                )}
                {selectedCandidature.lettreMotivationUrl && (
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => window.open(selectedCandidature.lettreMotivationUrl, '_blank')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Lettre de motivation
                  </Button>
                )}
              </div>

              {(selectedCandidature.status === 'nouvelle' || selectedCandidature.status === 'en_revision') && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="flex-1 text-destructive hover:text-destructive bg-transparent"
                    onClick={() => {
                      setIsViewDialogOpen(false)
                      handleAction(selectedCandidature, 'reject')
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Refuser
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setIsViewDialogOpen(false)
                      handleAction(selectedCandidature, 'accept')
                    }}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Accepter
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'accept' ? 'Accepter la candidature' : 'Refuser la candidature'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'accept'
                ? 'Confirmez l\'acceptation et assignez un departement. Le candidat sera visible pour l\'admin qui pourra creer son compte.'
                : 'Confirmez le refus et ajoutez un commentaire'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {actionType === 'accept' && (
              <div className="space-y-2">
                <Label>Departement d'affectation *</Label>
                <Select value={departement} onValueChange={setDepartement}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionnez un departement" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTEMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Commentaire {actionType === 'reject' ? '(obligatoire)' : '(optionnel)'}</Label>
              <Textarea
                placeholder={actionType === 'accept'
                  ? 'Ajouter une note interne...'
                  : 'Expliquez la raison du refus...'
                }
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActionDialogOpen(false)} className="bg-transparent">
              Annuler
            </Button>
            <Button
              variant={actionType === 'accept' ? 'default' : 'destructive'}
              onClick={confirmAction}
              disabled={(actionType === 'reject' && !comment.trim()) || (actionType === 'accept' && !departement)}
            >
              {actionType === 'accept' ? 'Accepter' : 'Refuser'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Tuteur Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assigner un tuteur</DialogTitle>
            <DialogDescription>
              Assignez un tuteur pour {selectedCandidature?.prenom} {selectedCandidature?.nom}.
              Cela permettra au tuteur de suivre le stagiaire.
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
              <Label>Sélectionner un tuteur *</Label>
              <Select value={selectedTuteurId} onValueChange={setSelectedTuteurId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un tuteur" />
                </SelectTrigger>
                <SelectContent>
                  {tuteurs.map((tuteur: any) => (
                    <SelectItem key={tuteur.id} value={tuteur.id}>
                      {tuteur.name} ({tuteur.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)} className="bg-transparent">
              Annuler
            </Button>
            <Button
              onClick={confirmAssign}
              disabled={isAssigning || !selectedTuteurId}
            >
              {isAssigning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assignation...
                </>
              ) : (
                'Confirmer l\'assignation'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
