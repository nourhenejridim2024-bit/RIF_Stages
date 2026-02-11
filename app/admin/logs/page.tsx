'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  Download,
  RefreshCw,
  Activity,
  User,
  FileText,
  Shield,
  Settings,
  AlertTriangle,
  CheckCircle2,
  Info,
} from 'lucide-react'

interface LogEntry {
  id: string
  timestamp: string
  type: 'info' | 'warning' | 'error' | 'success'
  category: 'auth' | 'candidature' | 'convention' | 'user' | 'system'
  action: string
  user: string
  details: string
  ip?: string
}

const mockLogs: LogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2024-02-03 14:32:15',
    type: 'success',
    category: 'auth',
    action: 'Connexion réussie',
    user: 'admin@rif.fr',
    details: 'Connexion admin réussie',
    ip: '192.168.1.100',
  },
  {
    id: 'log-2',
    timestamp: '2024-02-03 14:28:00',
    type: 'info',
    category: 'candidature',
    action: 'Nouvelle candidature',
    user: 'sophie.bernard@edu.fr',
    details: 'Candidature soumise #cand-3',
  },
  {
    id: 'log-3',
    timestamp: '2024-02-03 12:15:30',
    type: 'success',
    category: 'convention',
    action: 'Convention signée',
    user: 'marie.dupont@edu.fr',
    details: 'Convention #conv-1 signée',
  },
  {
    id: 'log-4',
    timestamp: '2024-02-03 10:45:22',
    type: 'info',
    category: 'user',
    action: 'Profil mis à jour',
    user: 'philippe.moreau@rif.fr',
    details: 'Modification des informations tuteur',
  },
  {
    id: 'log-5',
    timestamp: '2024-02-02 16:30:00',
    type: 'warning',
    category: 'auth',
    action: 'Tentative de connexion échouée',
    user: 'unknown@test.fr',
    details: 'Mot de passe incorrect (3ème tentative)',
    ip: '10.0.0.50',
  },
  {
    id: 'log-6',
    timestamp: '2024-02-02 14:20:10',
    type: 'success',
    category: 'candidature',
    action: 'Candidature acceptée',
    user: 'admin.rh@rif.fr',
    details: 'Candidature #cand-2 acceptée',
  },
  {
    id: 'log-7',
    timestamp: '2024-02-02 11:05:45',
    type: 'info',
    category: 'system',
    action: 'Sauvegarde automatique',
    user: 'Système',
    details: 'Backup base de données réussi',
  },
  {
    id: 'log-8',
    timestamp: '2024-02-01 18:00:00',
    type: 'error',
    category: 'system',
    action: 'Erreur email',
    user: 'Système',
    details: 'Échec envoi notification - serveur SMTP indisponible',
  },
  {
    id: 'log-9',
    timestamp: '2024-02-01 15:30:22',
    type: 'success',
    category: 'user',
    action: 'Utilisateur créé',
    user: 'admin@rif.fr',
    details: 'Nouveau tuteur: Claire Durand',
  },
  {
    id: 'log-10',
    timestamp: '2024-02-01 09:15:00',
    type: 'info',
    category: 'auth',
    action: 'Déconnexion',
    user: 'marie.dupont@edu.fr',
    details: 'Session terminée',
  },
]

const typeConfig = {
  info: { color: 'bg-primary/10 text-primary border-primary/30', icon: Info },
  warning: { color: 'bg-chart-4/10 text-chart-4 border-chart-4/30', icon: AlertTriangle },
  error: { color: 'bg-destructive/10 text-destructive border-destructive/30', icon: AlertTriangle },
  success: { color: 'bg-accent/10 text-accent border-accent/30', icon: CheckCircle2 },
}

const categoryConfig = {
  auth: { label: 'Authentification', icon: Shield },
  candidature: { label: 'Candidature', icon: FileText },
  convention: { label: 'Convention', icon: FileText },
  user: { label: 'Utilisateur', icon: User },
  system: { label: 'Système', icon: Settings },
}

export default function AdminLogsPage() {
  const [logs] = useState<LogEntry[]>(mockLogs)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || log.type === typeFilter
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter
    return matchesSearch && matchesType && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Logs système</h1>
          <p className="text-muted-foreground mt-1">
            Historique des actions sur la plateforme
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{logs.length}</p>
              <p className="text-sm text-muted-foreground">Total logs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <CheckCircle2 className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{logs.filter(l => l.type === 'success').length}</p>
              <p className="text-sm text-muted-foreground">Succès</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-4/10">
              <AlertTriangle className="h-5 w-5 text-chart-4" />
            </div>
            <div>
              <p className="text-2xl font-bold">{logs.filter(l => l.type === 'warning').length}</p>
              <p className="text-sm text-muted-foreground">Alertes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{logs.filter(l => l.type === 'error').length}</p>
              <p className="text-sm text-muted-foreground">Erreurs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans les logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous types</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Succès</SelectItem>
                <SelectItem value="warning">Alerte</SelectItem>
                <SelectItem value="error">Erreur</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                <SelectItem value="auth">Authentification</SelectItem>
                <SelectItem value="candidature">Candidature</SelectItem>
                <SelectItem value="convention">Convention</SelectItem>
                <SelectItem value="user">Utilisateur</SelectItem>
                <SelectItem value="system">Système</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Journal d'activité</CardTitle>
          <CardDescription>
            {filteredLogs.length} entrée(s) trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[160px]">Date/Heure</TableHead>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead className="w-[140px]">Catégorie</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Détails</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Aucun log trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => {
                    const TypeIcon = typeConfig[log.type].icon
                    const CategoryIcon = categoryConfig[log.category].icon
                    return (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-xs">
                          {log.timestamp}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={typeConfig[log.type].color}>
                            <TypeIcon className="mr-1 h-3 w-3" />
                            {log.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                            {categoryConfig[log.category].label}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{log.action}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {log.user}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                          {log.details}
                          {log.ip && (
                            <span className="ml-2 text-xs opacity-60">({log.ip})</span>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
