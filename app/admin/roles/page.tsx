'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Shield,
  Users,
  FileText,
  Settings,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
} from 'lucide-react'
import type { UserRole } from '@/lib/types'

interface Permission {
  id: string
  label: string
  description: string
}

interface RolePermissions {
  role: UserRole
  label: string
  description: string
  color: string
  icon: typeof Shield
  permissions: Record<string, boolean>
}

const allPermissions: Permission[] = [
  { id: 'view_candidatures', label: 'Voir les candidatures', description: 'Accès en lecture aux candidatures' },
  { id: 'manage_candidatures', label: 'Gérer les candidatures', description: 'Accepter, refuser, modifier les candidatures' },
  { id: 'view_conventions', label: 'Voir les conventions', description: 'Accès en lecture aux conventions' },
  { id: 'manage_conventions', label: 'Gérer les conventions', description: 'Générer et modifier les conventions' },
  { id: 'view_users', label: 'Voir les utilisateurs', description: 'Accès en lecture aux profils utilisateurs' },
  { id: 'manage_users', label: 'Gérer les utilisateurs', description: 'Créer, modifier, supprimer des utilisateurs' },
  { id: 'view_evaluations', label: 'Voir les évaluations', description: 'Accès en lecture aux évaluations' },
  { id: 'manage_evaluations', label: 'Gérer les évaluations', description: 'Créer et modifier les évaluations' },
  { id: 'view_onboarding', label: 'Voir l\'onboarding', description: 'Accès aux tâches d\'onboarding' },
  { id: 'manage_onboarding', label: 'Gérer l\'onboarding', description: 'Créer et modifier les tâches d\'onboarding' },
  { id: 'view_statistics', label: 'Voir les statistiques', description: 'Accès aux tableaux de bord et rapports' },
  { id: 'manage_settings', label: 'Paramètres système', description: 'Modifier la configuration de la plateforme' },
]

const initialRoles: RolePermissions[] = [
  {
    role: 'admin',
    label: 'Administrateur',
    description: 'Accès complet à toutes les fonctionnalités',
    color: 'bg-chart-5/10 text-chart-5 border-chart-5/30',
    icon: Shield,
    permissions: Object.fromEntries(allPermissions.map(p => [p.id, true])),
  },
  {
    role: 'rh',
    label: 'Ressources Humaines',
    description: 'Gestion des candidatures, conventions et utilisateurs',
    color: 'bg-chart-4/10 text-chart-4 border-chart-4/30',
    icon: Users,
    permissions: {
      view_candidatures: true,
      manage_candidatures: true,
      view_conventions: true,
      manage_conventions: true,
      view_users: true,
      manage_users: true,
      view_evaluations: true,
      manage_evaluations: false,
      view_onboarding: true,
      manage_onboarding: false,
      view_statistics: true,
      manage_settings: false,
    },
  },
  {
    role: 'tuteur',
    label: 'Tuteur',
    description: 'Encadrement des stagiaires et évaluations',
    color: 'bg-accent/10 text-accent border-accent/30',
    icon: Users,
    permissions: {
      view_candidatures: false,
      manage_candidatures: false,
      view_conventions: true,
      manage_conventions: false,
      view_users: false,
      manage_users: false,
      view_evaluations: true,
      manage_evaluations: true,
      view_onboarding: true,
      manage_onboarding: true,
      view_statistics: false,
      manage_settings: false,
    },
  },
  {
    role: 'stagiaire',
    label: 'Stagiaire',
    description: 'Accès limité à son propre dossier',
    color: 'bg-primary/10 text-primary border-primary/30',
    icon: FileText,
    permissions: {
      view_candidatures: true,
      manage_candidatures: false,
      view_conventions: true,
      manage_conventions: false,
      view_users: false,
      manage_users: false,
      view_evaluations: true,
      manage_evaluations: false,
      view_onboarding: true,
      manage_onboarding: false,
      view_statistics: false,
      manage_settings: false,
    },
  },
]

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<RolePermissions[]>(initialRoles)
  const [hasChanges, setHasChanges] = useState(false)

  const handlePermissionChange = (roleIndex: number, permissionId: string, value: boolean) => {
    setRoles(prev => {
      const updated = [...prev]
      updated[roleIndex] = {
        ...updated[roleIndex],
        permissions: {
          ...updated[roleIndex].permissions,
          [permissionId]: value,
        },
      }
      return updated
    })
    setHasChanges(true)
  }

  const handleSave = () => {
    setHasChanges(false)
  }

  const getPermissionCount = (role: RolePermissions) => {
    return Object.values(role.permissions).filter(Boolean).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Rôles et Permissions</h1>
          <p className="text-muted-foreground mt-1">
            Configurez les permissions pour chaque rôle
          </p>
        </div>
        {hasChanges && (
          <Button onClick={handleSave}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Enregistrer les modifications
          </Button>
        )}
      </div>

      {/* Roles Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {roles.map((role) => (
          <Card key={role.role}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${role.color.split(' ')[0]}`}>
                  <role.icon className={`h-5 w-5 ${role.color.split(' ')[1]}`} />
                </div>
                <div>
                  <p className="font-medium">{role.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {getPermissionCount(role)}/{allPermissions.length} permissions
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{role.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permissions Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Matrice des permissions</CardTitle>
          <CardDescription>
            Activez ou désactivez les permissions pour chaque rôle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {roles.map((role, roleIndex) => (
              <AccordionItem key={role.role} value={role.role}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={role.color}>
                      <role.icon className="mr-1 h-3 w-3" />
                      {role.label}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {getPermissionCount(role)} permissions actives
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    {allPermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          {permission.id.startsWith('view') ? (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          ) : permission.id.startsWith('manage') ? (
                            <Edit className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Settings className="h-4 w-4 text-muted-foreground" />
                          )}
                          <div>
                            <Label className="font-medium">{permission.label}</Label>
                            <p className="text-sm text-muted-foreground">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={role.permissions[permission.id]}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(roleIndex, permission.id, checked)
                          }
                          disabled={role.role === 'admin'}
                        />
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Légende</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Permissions de lecture</span>
            </div>
            <div className="flex items-center gap-2">
              <Edit className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Permissions de gestion</span>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Permissions système</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
