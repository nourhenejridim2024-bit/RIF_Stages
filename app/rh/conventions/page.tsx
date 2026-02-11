'use client'

import { useState, useEffect } from 'react'
import { DEPARTEMENTS } from '@/lib/types'
import type { ConventionStatus } from '@/lib/types'

// Empty data as backend is not implemented yet
const mockConventions: any[] = []
const mockStagiaires: any[] = []
const mockTuteurs: any[] = []
const mockCandidatures: any[] = []
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
  FileCheck,
  Download,
  Plus,
  Eye,
  Send,
  Calendar,
  User,
  Building2,
} from 'lucide-react'


const statusConfig: Record<ConventionStatus, { label: string; color: string }> = {
  generee: { label: 'Générée', color: 'bg-blue-100 text-blue-800' },
  envoyee: { label: 'Envoyée', color: 'bg-yellow-100 text-yellow-800' },
  signee_stagiaire: { label: 'Signée (stagiaire)', color: 'bg-orange-100 text-orange-800' },
  signee_complete: { label: 'Signée (toutes parties)', color: 'bg-green-100 text-green-800' },
}

export default function ConventionsPage() {
  const [conventions, setConventions] = useState<any[]>([])
  const [stagiaires, setStagiaires] = useState<any[]>([])
  const [tuteurs, setTuteurs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)

  // Form state
  const [selectedStagiaireId, setSelectedStagiaireId] = useState('')
  const [selectedDepartement, setSelectedDepartement] = useState('')
  const [selectedTuteurNom, setSelectedTuteurNom] = useState('')
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')

  // View state
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentConvention, setCurrentConvention] = useState<any | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      // Fetch conventions
      const convRes = await fetch('/api/conventions')
      if (convRes.ok) {
        const data = await convRes.json()
        setConventions(Array.isArray(data) ? data : [])
      }

      // Fetch validated stagiaires
      const usersRes = await fetch('/api/users?role=stagiaire&validated=true')
      if (usersRes.ok) {
        const data = await usersRes.json()
        setStagiaires(Array.isArray(data) ? data : [])
      }

      // Fetch validated tuteurs
      const tuteursRes = await fetch('/api/users?role=tuteur&validated=true')
      if (tuteursRes.ok) {
        const data = await tuteursRes.json()
        setTuteurs(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Erreur chargement:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!selectedStagiaireId || !selectedDepartement || !dateDebut || !dateFin) return

    try {
      const stagiaire = stagiaires.find(s => s.id === selectedStagiaireId)

      const payload = {
        stagiaireId: selectedStagiaireId,
        departement: selectedDepartement,
        tuteurNom: selectedTuteurNom || 'Non assigné',
        dateDebut,
        dateFin,
        sujet: stagiaire ? `Stage de ${stagiaire.name}` : 'Stage conventionné'
      }

      const res = await fetch('/api/conventions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setIsGenerateDialogOpen(false)
        fetchData()
        // Reset form
        setSelectedStagiaireId('')
        setSelectedDepartement('')
        setSelectedTuteurNom('')
        setDateDebut('')
        setDateFin('')
      } else {
        const err = await res.json()
        alert('Erreur: ' + (err.error || 'Impossible de créer la convention'))
      }
    } catch (e) {
      console.error(e)
      alert('Erreur technique')
    }
  }

  const filteredConventions = conventions.filter(conv => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const stagiaireName = conv.stagiaire?.name?.toLowerCase() || ''
      return (
        stagiaireName.includes(searchLower) ||
        conv.departement.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Conventions de stage</h1>
          <p className="mt-1 text-muted-foreground">
            Générez et gérez les conventions des stagiaires
          </p>
        </div>
        <Button onClick={() => setIsGenerateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle convention
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom ou département..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{conventions.length}</p>
            <p className="text-sm text-muted-foreground">Total conventions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-green-600">
              {conventions.filter(c => c.status === 'signee_complete').length}
            </p>
            <p className="text-sm text-muted-foreground">Entièrement signées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-blue-600">
              {stagiaires.length}
            </p>
            <p className="text-sm text-muted-foreground">Stagiaires validés</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des conventions</CardTitle>
          <CardDescription>
            {filteredConventions.length} convention(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stagiaire</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Tuteur</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConventions.map((convention) => {
                  const stagiaireName = convention.stagiaire?.name || 'Inconnu'
                  const statusLabel = statusConfig[convention.status as ConventionStatus]?.label || convention.status
                  const statusColor = statusConfig[convention.status as ConventionStatus]?.color || 'bg-gray-100'

                  return (
                    <TableRow key={convention.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary">
                              {stagiaireName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{stagiaireName}</p>
                            <p className="text-sm text-muted-foreground">{convention.stagiaire?.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{convention.departement}</TableCell>
                      <TableCell>{convention.tuteurNom}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{new Date(convention.dateDebut).toLocaleDateString('fr-FR')}</p>
                          <p className="text-muted-foreground">
                            au {new Date(convention.dateFin).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColor}>
                          {statusLabel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => { setCurrentConvention(convention); setIsViewDialogOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => { setCurrentConvention(convention); setIsViewDialogOpen(true); setTimeout(() => window.print(), 500); }}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filteredConventions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Aucune convention trouvée
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Generate Dialog */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Générer une convention</DialogTitle>
            <DialogDescription>
              Créez une nouvelle convention pour un stagiaire validé.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Stagiaire</Label>
              <Select value={selectedStagiaireId} onValueChange={setSelectedStagiaireId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un stagiaire" />
                </SelectTrigger>
                <SelectContent>
                  {stagiaires.length > 0 ? (
                    stagiaires.map((stagiaire) => (
                      <SelectItem key={stagiaire.id} value={stagiaire.id}>
                        {stagiaire.name} ({stagiaire.email})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      Aucun stagiaire validé disponible
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Département</Label>
              <Select value={selectedDepartement} onValueChange={setSelectedDepartement}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un département" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTEMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nom du Tuteur</Label>
              <Select value={selectedTuteurNom} onValueChange={setSelectedTuteurNom}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un tuteur" />
                </SelectTrigger>
                <SelectContent>
                  {tuteurs.length > 0 ? (
                    tuteurs.map((tuteur) => (
                      <SelectItem key={tuteur.id} value={tuteur.name}>
                        {tuteur.name} ({tuteur.email})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      Aucun tuteur disponible
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Date de début</Label>
                <Input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Date de fin</Label>
                <Input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleGenerate} disabled={!selectedStagiaireId || !selectedDepartement || !dateDebut || !dateFin}>
              <FileCheck className="mr-2 h-4 w-4" />
              Générer la convention
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la Convention</DialogTitle>
            <DialogDescription>
              Aperçu complet du document de stage.
            </DialogDescription>
          </DialogHeader>

          {currentConvention && (
            <div className="space-y-6 py-4 print:p-8" id="convention-print-content">
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h3 className="text-xl font-bold text-primary">Convention de Stage</h3>
                  <p className="text-sm text-muted-foreground">Réf: {currentConvention.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <Badge className={statusConfig[currentConvention.status as ConventionStatus]?.color || 'bg-gray-100'}>
                  {statusConfig[currentConvention.status as ConventionStatus]?.label || currentConvention.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Stagiaire</Label>
                    <p className="text-lg font-semibold">{currentConvention.stagiaire?.name || 'Inconnu'}</p>
                    <p className="text-sm">{currentConvention.stagiaire?.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Département d'accueil</Label>
                    <p className="font-medium">{currentConvention.departement}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Dates du stage</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium">
                        Du {new Date(currentConvention.dateDebut).toLocaleDateString('fr-FR')} au {new Date(currentConvention.dateFin).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Tuteur Responsable</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4 text-primary" />
                      <p className="font-medium">{currentConvention.tuteurNom}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Sujet du stage</Label>
                    <p className="text-sm italic">"{currentConvention.sujet}"</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Date de génération</Label>
                    <p className="text-sm">{new Date(currentConvention.dateGeneration).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg text-xs space-y-2">
                <p className="font-bold">Conditions générales :</p>
                <p>Cette convention régit les rapports entre l'entreprise et le stagiaire pour la durée mentionnée. Elle doit être signée par toutes les parties avant le début du stage.</p>
              </div>

              <div className="hidden print:flex justify-between pt-12">
                <div className="text-center">
                  <p className="font-bold border-t pt-2 w-32 mx-auto">Cachet Entreprise</p>
                </div>
                <div className="text-center">
                  <p className="font-bold border-t pt-2 w-32 mx-auto">Signature Stagiaire</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="print:hidden">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fermer
            </Button>
            <Button onClick={() => window.print()}>
              <Download className="mr-2 h-4 w-4" />
              Imprimer / Télécharger (PDF)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
