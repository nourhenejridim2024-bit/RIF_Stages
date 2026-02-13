'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
    Eye,
    Calendar,
    User,
    Loader2,
    FileText
} from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

const statusConfig: Record<string, { label: string; color: string }> = {
    generee: { label: 'Générée', color: 'bg-blue-100 text-blue-800' },
    envoyee: { label: 'Envoyée', color: 'bg-yellow-100 text-yellow-800' },
    signee_stagiaire: { label: 'Signée (stagiaire)', color: 'bg-orange-100 text-orange-800' },
    signee_complete: { label: 'Signée (toutes parties)', color: 'bg-green-100 text-green-800' },
}

export default function TuteurConventionsPage() {
    const { user } = useAuth()
    const [conventions, setConventions] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedConvention, setSelectedConvention] = useState<any | null>(null)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

    useEffect(() => {
        if (user?.id) {
            fetchConventions()
        }
    }, [user])

    const fetchConventions = async () => {
        try {
            setIsLoading(true)
            const res = await fetch(`/api/conventions?tuteurId=${user?.id}`)
            if (res.ok) {
                const data = await res.json()
                setConventions(Array.isArray(data) ? data : [])
            }
        } catch (error) {
            console.error('Failed to fetch conventions:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredConventions = conventions.filter(conv => {
        const name = conv.stagiaire?.name || `${conv.stagiaire?.prenom || ''} ${conv.stagiaire?.nom || ''}`
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            conv.departement.toLowerCase().includes(searchTerm.toLowerCase())
    })

    const handlePrint = () => {
        window.print()
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Conventions de mes stagiaires</h1>
                <p className="mt-1 text-muted-foreground">
                    Suivez l'état des conventions de stage de vos stagiaires
                </p>
            </div>

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

            <Card>
                <CardHeader>
                    <CardTitle>Liste des conventions</CardTitle>
                    <CardDescription>
                        {filteredConventions.length} convention(s) trouvée(s)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Stagiaire</TableHead>
                                    <TableHead>Département</TableHead>
                                    <TableHead>Période</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredConventions.map((conv) => {
                                    const stagiaireName = conv.stagiaire?.name || `${conv.stagiaire?.prenom || ''} ${conv.stagiaire?.nom || ''}` || 'Inconnu'
                                    const status = statusConfig[conv.status] || { label: conv.status, color: 'bg-gray-100' }

                                    return (
                                        <TableRow key={conv.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                        {stagiaireName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">{stagiaireName}</p>
                                                        <p className="text-xs text-muted-foreground">{conv.stagiaire?.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm">{conv.departement}</TableCell>
                                            <TableCell className="text-sm">
                                                <p>{new Date(conv.dateDebut).toLocaleDateString('fr-FR')}</p>
                                                <p className="text-xs text-muted-foreground">au {new Date(conv.dateFin).toLocaleDateString('fr-FR')}</p>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`${status.color} border-none`}>
                                                    {status.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedConvention(conv)
                                                        setIsViewDialogOpen(true)
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Détails
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                                {filteredConventions.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            Aucune convention trouvée.
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
                <DialogContent className="max-w-2xl">
                    <DialogHeader className="print:hidden">
                        <DialogTitle>Aperçu de la Convention</DialogTitle>
                        <DialogDescription>
                            Informations détaillées sur le document de stage.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedConvention && (
                        <div className="space-y-6 py-4" id="convention-view">
                            <div className="flex justify-between items-start border-b pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <FileText className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Convention de Stage</h3>
                                        <p className="text-sm text-muted-foreground uppercase">Réf: {selectedConvention.id.split('-')[0]}</p>
                                    </div>
                                </div>
                                <Badge className={`${statusConfig[selectedConvention.status]?.color || 'bg-gray-100'} border-none`}>
                                    {statusConfig[selectedConvention.status]?.label || selectedConvention.status}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stagiaire</label>
                                        <p className="text-lg font-bold">{selectedConvention.stagiaire?.name || `${selectedConvention.stagiaire?.prenom} ${selectedConvention.stagiaire?.nom}`}</p>
                                        <p className="text-sm text-muted-foreground">{selectedConvention.stagiaire?.email}</p>
                                    </div>
                                    <div className="flex items-center gap-4 pt-2">
                                        <div>
                                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Début</label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Calendar className="h-4 w-4 text-primary" />
                                                <span className="text-sm font-medium">{new Date(selectedConvention.dateDebut).toLocaleDateString('fr-FR')}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Fin</label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Calendar className="h-4 w-4 text-primary" />
                                                <span className="text-sm font-medium">{new Date(selectedConvention.dateFin).toLocaleDateString('fr-FR')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Département</label>
                                        <p className="font-semibold text-primary">{selectedConvention.departement}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tuteur Responsable</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <p className="font-medium text-sm">{selectedConvention.tuteurNom}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-muted/30 p-4 rounded-lg">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sujet / Mission</label>
                                <p className="mt-1 text-sm italic">"{selectedConvention.sujet}"</p>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="print:hidden">
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                            Fermer
                        </Button>
                        <Button onClick={handlePrint} className="bg-primary hover:bg-primary/90">
                            <Download className="mr-2 h-4 w-4" />
                            Imprimer Document
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
