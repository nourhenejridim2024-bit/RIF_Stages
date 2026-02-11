'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Mail,
  Phone,
  User,
} from 'lucide-react'
import type { DemandePartenariat } from '@/lib/types'
import { mockDemandesPartenariat } from '@/lib/mock-data'

export function PartenariatRequestsManagement() {
  const [demandes, setDemandes] = useState<DemandePartenariat[]>(
    mockDemandesPartenariat
  )
  const [selectedDemande, setSelectedDemande] = useState<DemandePartenariat | null>(
    null
  )
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isDecisionOpen, setIsDecisionOpen] = useState(false)
  const [decisionType, setDecisionType] = useState<'accepter' | 'refuser' | null>(null)
  const [commentaire, setCommentaire] = useState('')
  const [passwordGenerated, setPasswordGenerated] = useState('')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nouvelle':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'en_revision':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'acceptee':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'refusee':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'compte_cree':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'nouvelle':
        return <Clock className="h-4 w-4" />
      case 'acceptee':
        return <CheckCircle2 className="h-4 w-4" />
      case 'refusee':
        return <XCircle className="h-4 w-4" />
      case 'compte_cree':
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'nouvelle':
        return 'Nouvelle'
      case 'en_revision':
        return 'En révision'
      case 'acceptee':
        return 'Acceptée'
      case 'refusee':
        return 'Refusée'
      case 'compte_cree':
        return 'Compte créé'
      default:
        return status
    }
  }

  const generatePassword = () => {
    const length = 12
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$'
    let password = ''
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setPasswordGenerated(password)
    return password
  }

  const handleViewDetails = (demande: DemandePartenariat) => {
    setSelectedDemande(demande)
    setIsDetailOpen(true)
  }

  const handleOpenDecision = (type: 'accepter' | 'refuser') => {
    setDecisionType(type)
    setIsDecisionOpen(true)
  }

  const handleDecision = async () => {
    if (!selectedDemande) return

    if (decisionType === 'accepter') {
      const tempPassword = generatePassword()
      
      const updatedDemande = {
        ...selectedDemande,
        status: 'compte_cree' as const,
        dateDecision: new Date().toISOString().split('T')[0],
        commentairesAdmin: commentaire || selectedDemande.commentairesAdmin,
        motDePasseTemporaire: tempPassword,
        universiteid: `univ-${Date.now()}`,
      }
      
      setDemandes(prev =>
        prev.map(d => (d.id === selectedDemande.id ? updatedDemande : d))
      )
      setSelectedDemande(updatedDemande)
    } else if (decisionType === 'refuser') {
      const updatedDemande = {
        ...selectedDemande,
        status: 'refusee' as const,
        dateDecision: new Date().toISOString().split('T')[0],
        commentairesAdmin: commentaire,
      }
      
      setDemandes(prev =>
        prev.map(d => (d.id === selectedDemande.id ? updatedDemande : d))
      )
      setSelectedDemande(updatedDemande)
    }

    setCommentaire('')
    setDecisionType(null)
    setIsDecisionOpen(false)
  }

  const markAsReviewing = (demande: DemandePartenariat) => {
    const updated = { ...demande, status: 'en_revision' as const }
    setDemandes(prev =>
      prev.map(d => (d.id === demande.id ? updated : d))
    )
    setSelectedDemande(updated)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Demandes de partenariat</h2>
        <div className="text-sm text-muted-foreground">
          Total: {demandes.length}
        </div>
      </div>

      <div className="grid gap-4">
        {demandes.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Aucune demande de partenariat</p>
          </Card>
        ) : (
          demandes.map(demande => (
            <Card key={demande.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">
                      {demande.nomUniversite}
                    </h3>
                    <div
                      className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(
                        demande.status
                      )}`}
                    >
                      {getStatusIcon(demande.status)}
                      {getStatusLabel(demande.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>
                        {demande.responsablePrenom} {demande.responsableNom}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{demande.responsableEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{demande.responsableTelephone}</span>
                    </div>
                    <div className="text-muted-foreground">
                      Demande du {new Date(demande.dateSoumission).toLocaleDateString('fr-FR')}
                    </div>
                  </div>

                  {demande.commentairesAdmin && (
                    <div className="mt-3 p-3 bg-secondary/50 rounded text-sm">
                      <p className="text-foreground font-medium mb-1">Commentaire admin:</p>
                      <p className="text-muted-foreground">{demande.commentairesAdmin}</p>
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handleViewDetails(demande)}
                >
                  Voir détails
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Détails de la demande</DialogTitle>
            <DialogDescription>
              Informations complètes et actions disponibles
            </DialogDescription>
          </DialogHeader>

          {selectedDemande && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Université</Label>
                  <p className="text-foreground font-medium">
                    {selectedDemande.nomUniversite}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Statut</Label>
                  <div className="mt-1">
                    <div
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(
                        selectedDemande.status
                      )}`}
                    >
                      {getStatusIcon(selectedDemande.status)}
                      {getStatusLabel(selectedDemande.status)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Nom du responsable
                  </Label>
                  <p className="text-foreground font-medium">
                    {selectedDemande.responsableNom}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Prénom du responsable
                  </Label>
                  <p className="text-foreground font-medium">
                    {selectedDemande.responsablePrenom}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <p className="text-foreground font-medium">
                  {selectedDemande.responsableEmail}
                </p>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Téléphone</Label>
                <p className="text-foreground font-medium">
                  {selectedDemande.responsableTelephone}
                </p>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Date de soumission</Label>
                <p className="text-foreground font-medium">
                  {new Date(selectedDemande.dateSoumission).toLocaleDateString('fr-FR')}
                </p>
              </div>

              {selectedDemande.dateDecision && (
                <div>
                  <Label className="text-xs text-muted-foreground">Date de décision</Label>
                  <p className="text-foreground font-medium">
                    {new Date(selectedDemande.dateDecision).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )}

              {selectedDemande.status === 'compte_cree' && selectedDemande.motDePasseTemporaire && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <Label className="text-xs text-green-700 font-medium">
                    Mot de passe temporaire créé
                  </Label>
                  <div className="mt-2 p-2 bg-white rounded border border-green-200 font-mono text-sm">
                    {selectedDemande.motDePasseTemporaire}
                  </div>
                  <p className="text-xs text-green-700 mt-2">
                    À envoyer au responsable pour première connexion
                  </p>
                </div>
              )}

              <DialogFooter className="gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Fermer
                </Button>

                {selectedDemande.status === 'nouvelle' && (
                  <Button
                    variant="outline"
                    onClick={() => markAsReviewing(selectedDemande)}
                  >
                    Marquer en révision
                  </Button>
                )}

                {(selectedDemande.status === 'nouvelle' ||
                  selectedDemande.status === 'en_revision') && (
                  <>
                    <Button
                      variant="destructive"
                      onClick={() => handleOpenDecision('refuser')}
                    >
                      Refuser
                    </Button>
                    <Button
                      onClick={() => handleOpenDecision('accepter')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Accepter
                    </Button>
                  </>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Decision Dialog */}
      <Dialog open={isDecisionOpen} onOpenChange={setIsDecisionOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {decisionType === 'accepter'
                ? 'Accepter la demande'
                : 'Refuser la demande'}
            </DialogTitle>
            <DialogDescription>
              {decisionType === 'accepter'
                ? 'Un compte sera créé pour cette université et un mot de passe temporaire sera généré.'
                : 'Veuillez fournir une raison pour ce refus.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="commentaire">
                {decisionType === 'accepter' ? 'Commentaire (optionnel)' : 'Raison du refus'}
              </Label>
              <Textarea
                id="commentaire"
                placeholder={
                  decisionType === 'accepter'
                    ? 'Ajouter des notes internes...'
                    : 'Expliquez pourquoi cette demande est refusée...'
                }
                value={commentaire}
                onChange={e => setCommentaire(e.target.value)}
                rows={4}
                required={decisionType === 'refuser'}
              />
            </div>

            {decisionType === 'accepter' && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700 font-medium mb-3">
                  Un mot de passe temporaire sera généré:
                </p>
                {passwordGenerated && (
                  <div className="p-2 bg-white rounded border border-blue-200 font-mono text-sm">
                    {passwordGenerated}
                  </div>
                )}
                {!passwordGenerated && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generatePassword}
                    className="mt-2 bg-transparent"
                  >
                    Générer un mot de passe
                  </Button>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDecisionOpen(false)
                setCommentaire('')
                setPasswordGenerated('')
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleDecision}
              className={
                decisionType === 'accepter'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
            >
              {decisionType === 'accepter' ? 'Accepter' : 'Refuser'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
