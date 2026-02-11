'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Settings,
  Building2,
  Mail,
  Bell,
  Shield,
  Database,
  CheckCircle2,
  Save,
} from 'lucide-react'

export default function AdminParametresPage() {
  const [hasChanges, setHasChanges] = useState(false)
  
  const [settings, setSettings] = useState({
    // General
    companyName: 'Groupe RIF',
    companyEmail: 'contact@rif.fr',
    companyAddress: '123 Avenue des Entreprises, 33000 Bordeaux',
    
    // Notifications
    emailNotifications: true,
    newCandidatureNotif: true,
    conventionSignedNotif: true,
    evaluationNotif: true,
    
    // Security
    sessionTimeout: '30',
    maxLoginAttempts: '5',
    requireStrongPassword: true,
    
    // System
    maintenanceMode: false,
    debugMode: false,
    dataRetentionDays: '365',
  })

  const handleChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    setHasChanges(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
          <p className="text-muted-foreground mt-1">
            Configurez les paramètres de la plateforme
          </p>
        </div>
        {hasChanges && (
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        )}
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informations générales
          </CardTitle>
          <CardDescription>
            Paramètres de l'entreprise et de la plateforme
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nom de l'entreprise</Label>
              <Input
                id="companyName"
                value={settings.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyEmail">Email de contact</Label>
              <Input
                id="companyEmail"
                type="email"
                value={settings.companyEmail}
                onChange={(e) => handleChange('companyEmail', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyAddress">Adresse</Label>
            <Textarea
              id="companyAddress"
              value={settings.companyAddress}
              onChange={(e) => handleChange('companyAddress', e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configurez les notifications par email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <Label className="font-medium">Notifications par email</Label>
              <p className="text-sm text-muted-foreground">
                Activer l'envoi d'emails automatiques
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleChange('emailNotifications', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Nouvelles candidatures</Label>
                <p className="text-sm text-muted-foreground">
                  Notifier les RH des nouvelles candidatures
                </p>
              </div>
              <Switch
                checked={settings.newCandidatureNotif}
                onCheckedChange={(checked) => handleChange('newCandidatureNotif', checked)}
                disabled={!settings.emailNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Conventions signées</Label>
                <p className="text-sm text-muted-foreground">
                  Notifier de la signature des conventions
                </p>
              </div>
              <Switch
                checked={settings.conventionSignedNotif}
                onCheckedChange={(checked) => handleChange('conventionSignedNotif', checked)}
                disabled={!settings.emailNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Évaluations</Label>
                <p className="text-sm text-muted-foreground">
                  Notifier des nouvelles évaluations
                </p>
              </div>
              <Switch
                checked={settings.evaluationNotif}
                onCheckedChange={(checked) => handleChange('evaluationNotif', checked)}
                disabled={!settings.emailNotifications}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Sécurité
          </CardTitle>
          <CardDescription>
            Paramètres de sécurité et d'authentification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Expiration de session (minutes)</Label>
              <Select
                value={settings.sessionTimeout}
                onValueChange={(value) => handleChange('sessionTimeout', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 heure</SelectItem>
                  <SelectItem value="120">2 heures</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Tentatives de connexion max</Label>
              <Select
                value={settings.maxLoginAttempts}
                onValueChange={(value) => handleChange('maxLoginAttempts', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 tentatives</SelectItem>
                  <SelectItem value="5">5 tentatives</SelectItem>
                  <SelectItem value="10">10 tentatives</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <Label className="font-medium">Mots de passe forts</Label>
              <p className="text-sm text-muted-foreground">
                Exiger des mots de passe complexes (8+ caractères, majuscules, chiffres)
              </p>
            </div>
            <Switch
              checked={settings.requireStrongPassword}
              onCheckedChange={(checked) => handleChange('requireStrongPassword', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="h-5 w-5" />
            Système
          </CardTitle>
          <CardDescription>
            Paramètres système avancés
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border border-destructive/30 bg-destructive/5">
            <div>
              <Label className="font-medium text-destructive">Mode maintenance</Label>
              <p className="text-sm text-muted-foreground">
                Désactive l'accès à la plateforme pour les utilisateurs
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => handleChange('maintenanceMode', checked)}
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <Label className="font-medium">Mode debug</Label>
              <p className="text-sm text-muted-foreground">
                Afficher les informations de débogage
              </p>
            </div>
            <Switch
              checked={settings.debugMode}
              onCheckedChange={(checked) => handleChange('debugMode', checked)}
            />
          </div>
          <div className="space-y-2">
            <Label>Rétention des données (jours)</Label>
            <Select
              value={settings.dataRetentionDays}
              onValueChange={(value) => handleChange('dataRetentionDays', value)}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="90">90 jours</SelectItem>
                <SelectItem value="180">180 jours</SelectItem>
                <SelectItem value="365">1 an</SelectItem>
                <SelectItem value="730">2 ans</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Durée de conservation des logs et données archivées
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
