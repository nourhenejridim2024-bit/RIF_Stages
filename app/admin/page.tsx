'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  mockStagiaires,
  mockTuteurs,
  mockRH,
  mockAdmins,
  mockCandidatures,
  mockConventions,
} from '@/lib/mock-data'
import {
  Users,
  Shield,
  Settings,
  Activity,
  ChevronRight,
  UserCheck,
  UserPlus,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Check,
  X
} from 'lucide-react'

export default function AdminDashboardPage() {
  const [pendingUsers, setPendingUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const totalUsers = mockStagiaires.length + mockTuteurs.length + mockRH.length + mockAdmins.length
  const candidaturesEnAttente = mockCandidatures.filter(c => c.status === 'soumise').length
  const conventionsSignees = mockConventions.filter(c => c.status === 'signee_complete').length

  const fetchPendingUsers = async () => {
    try {
      const res = await fetch('/api/admin/users/pending')
      if (res.ok) {
        const data = await res.json()
        setPendingUsers(data)
      }
    } catch (error) {
      console.error("Failed to fetch pending users", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPendingUsers()
  }, [])

  const handleValidate = async (userId: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch('/api/admin/users/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action })
      })
      if (res.ok) {
        // Refresh list
        fetchPendingUsers()
      }
    } catch (error) {
      console.error("Validation failed", error)
    }
  }

  const stats = [
    {
      label: 'Utilisateurs totaux',
      value: totalUsers,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: '+3 ce mois',
    },
    {
      label: 'Stagiaires actifs',
      value: mockStagiaires.length,
      icon: UserCheck,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      change: `${mockTuteurs.length} tuteurs`,
    },
    {
      label: 'Validations en attente',
      value: pendingUsers.length,
      icon: AlertTriangle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      change: 'Action requise',
    },
    {
      label: 'Conventions signées',
      value: conventionsSignees,
      icon: CheckCircle2,
      color: 'text-chart-5',
      bgColor: 'bg-chart-5/10',
      change: `${mockConventions.length} total`,
    },
  ]

  const recentActivity = [
    { id: 1, action: 'Nouvelle candidature', user: 'Sophie Bernard', time: 'Il y a 2 heures', type: 'candidature' },
    { id: 2, action: 'Convention signée', user: 'Marie Dupont', time: 'Il y a 1 jour', type: 'convention' },
    { id: 3, action: 'Évaluation soumise', user: 'Jean Martin', time: 'Il y a 2 jours', type: 'evaluation' },
    { id: 4, action: 'Nouveau tuteur créé', user: 'Claire Durand', time: 'Il y a 3 jours', type: 'user' },
    { id: 5, action: 'Candidature acceptée', user: 'Jean Martin', time: 'Il y a 5 jours', type: 'candidature' },
  ]

  const usersByRole = [
    { role: 'Stagiaires', count: mockStagiaires.length, color: 'bg-primary' },
    { role: 'Tuteurs', count: mockTuteurs.length, color: 'bg-accent' },
    { role: 'RH', count: mockRH.length, color: 'bg-chart-4' },
    { role: 'Admins', count: mockAdmins.length, color: 'bg-chart-5' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Administration
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez la plateforme RIF-Stages
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/logs">
              <Activity className="mr-2 h-4 w-4" />
              Voir les logs
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/utilisateurs">
              <UserPlus className="mr-2 h-4 w-4" />
              Nouvel utilisateur
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Validations Section */}
      {pendingUsers.length > 0 && (
        <Card className="border-orange-200 bg-orange-50/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2 text-orange-700">
                  <AlertTriangle className="h-5 w-5" />
                  Nouvelles inscriptions à valider
                </CardTitle>
                <CardDescription>Ces utilisateurs attendent votre validation pour accéder à la plateforme.</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">{pendingUsers.length} en attente</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between bg-white p-3 rounded-lg border shadow-sm">
                  <div>
                    <p className="font-medium">{user.name || 'Sans nom'}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{user.email}</span>
                      <span>•</span>
                      <Badge variant="outline" className="capitalize">{user.role?.name}</Badge>
                      <span>•</span>
                      <span className="text-xs">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="destructive" onClick={() => handleValidate(user.id, 'reject')}>
                      <X className="h-4 w-4 mr-1" /> Refuser
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleValidate(user.id, 'approve')}>
                      <Check className="h-4 w-4 mr-1" /> Valider
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Users by Role */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Répartition des utilisateurs</CardTitle>
              <CardDescription>Par rôle dans la plateforme</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/utilisateurs">
                Gérer
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usersByRole.map((item) => (
                <div key={item.role} className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{item.role}</span>
                      <span className="text-sm text-muted-foreground">{item.count}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${(item.count / totalUsers) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium">{totalUsers} utilisateurs</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Activité récente</CardTitle>
              <CardDescription>Dernières actions sur la plateforme</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/logs">
                Tout voir
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-full mt-0.5 ${activity.type === 'candidature' ? 'bg-primary/10' :
                      activity.type === 'convention' ? 'bg-accent/10' :
                        activity.type === 'evaluation' ? 'bg-chart-4/10' :
                          'bg-muted'
                    }`}>
                    {activity.type === 'candidature' && <FileText className="h-3 w-3 text-primary" />}
                    {activity.type === 'convention' && <CheckCircle2 className="h-3 w-3 text-accent" />}
                    {activity.type === 'evaluation' && <Activity className="h-3 w-3 text-chart-4" />}
                    {activity.type === 'user' && <UserPlus className="h-3 w-3 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actions rapides</CardTitle>
          <CardDescription>Accédez rapidement aux fonctionnalités clés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/admin/utilisateurs"
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Utilisateurs</p>
                <p className="text-xs text-muted-foreground">Gérer les comptes</p>
              </div>
            </Link>
            <Link
              href="/admin/roles"
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <Shield className="h-5 w-5 text-accent" />
              <div>
                <p className="font-medium">Rôles</p>
                <p className="text-xs text-muted-foreground">Permissions</p>
              </div>
            </Link>
            <Link
              href="/admin/parametres"
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <Settings className="h-5 w-5 text-chart-4" />
              <div>
                <p className="font-medium">Paramètres</p>
                <p className="text-xs text-muted-foreground">Configuration</p>
              </div>
            </Link>
            <Link
              href="/admin/logs"
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <Activity className="h-5 w-5 text-chart-5" />
              <div>
                <p className="font-medium">Logs</p>
                <p className="text-xs text-muted-foreground">Audit système</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5" />
            État du système
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/10">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-medium">Base de données</p>
                <p className="text-xs text-muted-foreground">Opérationnelle</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/10">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-medium">Authentification</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-chart-4/10">
              <Clock className="h-5 w-5 text-chart-4" />
              <div>
                <p className="text-sm font-medium">Notifications</p>
                <p className="text-xs text-muted-foreground">5 en file</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
