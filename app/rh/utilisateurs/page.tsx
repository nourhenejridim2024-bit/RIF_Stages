'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { DEPARTEMENTS } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  UserPlus,
  Users,
  GraduationCap,
  Mail,
  Send,
} from 'lucide-react'

export default function UtilisateursPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddTuteurDialogOpen, setIsAddTuteurDialogOpen] = useState(false)

  const [stagiaires, setStagiaires] = useState<any[]>([])
  const [tuteurs, setTuteurs] = useState<any[]>([])
  const [conventions, setConventions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const usersRes = await fetch('/api/users?validated=true')
        if (usersRes.ok) {
          const users = await usersRes.json()
          if (Array.isArray(users)) {
            setStagiaires(users.filter((u: any) => u.role?.name === 'stagiaire'))
            setTuteurs(users.filter((u: any) => u.role?.name === 'tuteur'))
          }
        }

        const convRes = await fetch('/api/conventions')
        if (convRes.ok) {
          const convs = await convRes.json()
          setConventions(Array.isArray(convs) ? convs : [])
        }
      } catch (error) {
        console.error('Erreur chargement:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredStagiaires = stagiaires.filter(s => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    const name = s.name?.toLowerCase() || ''
    const email = s.email?.toLowerCase() || ''
    return name.includes(searchLower) || email.includes(searchLower)
  })

  const filteredTuteurs = tuteurs.filter(t => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    const name = t.name?.toLowerCase() || ''
    const email = t.email?.toLowerCase() || ''
    return name.includes(searchLower) || email.includes(searchLower)
  })

  const handleRequestAdmin = () => {
    toast.success("Demande envoyée à l'administrateur avec succès.", {
      description: "L'admin sera notifié de votre besoin de nouveaux tuteurs.",
    })
    setIsAddTuteurDialogOpen(false)
  }

  const getTuteurForStagiaire = (stagiaireId: string) => {
    const convention = conventions.find(c => c.stagiaireId === stagiaireId)
    if (!convention) return null
    return { name: convention.tuteurNom }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion des utilisateurs</h1>
          <p className="mt-1 text-muted-foreground">
            Gérez les comptes tuteurs et stagiaires
          </p>
        </div>
        <Button onClick={() => setIsAddTuteurDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un tuteur
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="stagiaires">
        <TabsList>
          <TabsTrigger value="stagiaires" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            Stagiaires ({stagiaires.length})
          </TabsTrigger>
          <TabsTrigger value="tuteurs" className="gap-2">
            <Users className="h-4 w-4" />
            Tuteurs ({tuteurs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stagiaires" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Liste des stagiaires</CardTitle>
              <CardDescription>
                {filteredStagiaires.length} stagiaire(s) validé(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Stagiaire</TableHead>
                      <TableHead>Info</TableHead>
                      <TableHead>Tuteur assigné</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStagiaires.map((stagiaire) => {
                      const tuteur = getTuteurForStagiaire(stagiaire.id)
                      const name = stagiaire.name || 'Sans nom'
                      return (
                        <TableRow key={stagiaire.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-xs font-semibold text-primary">
                                  {name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">{name}</p>
                                <p className="text-sm text-muted-foreground">{stagiaire.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">Validé le {new Date(stagiaire.updatedAt).toLocaleDateString()}</span>
                          </TableCell>
                          <TableCell>
                            {tuteur ? (
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                                  <span className="text-xs font-semibold text-accent-foreground">T</span>
                                </div>
                                <span className="text-sm">{tuteur.name}</span>
                              </div>
                            ) : (
                              <Badge variant="outline">Non assigné</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {filteredStagiaires.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          Aucun stagiaire trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tuteurs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Liste des tuteurs</CardTitle>
              <CardDescription>
                {filteredTuteurs.length} tuteur(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tuteur</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTuteurs.map((tuteur) => (
                      <TableRow key={tuteur.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                              <span className="text-xs font-semibold text-accent-foreground">
                                {(tuteur.name || 'T').charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{tuteur.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{tuteur.email}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isAddTuteurDialogOpen} onOpenChange={setIsAddTuteurDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un tuteur</DialogTitle>
            <DialogDescription>
              Pour ajouter un tuteur, veuillez utiliser le panneau d'administration ou demander au tuteur de s'inscrire directement sur la plateforme.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setIsAddTuteurDialogOpen(false)}>
              Fermer
            </Button>
            <Button className="flex-1 bg-primary text-primary-foreground" onClick={handleRequestAdmin}>
              <Send className="mr-2 h-4 w-4" />
              Demander à l'admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
