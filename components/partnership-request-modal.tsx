'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, CheckCircle2, Building2 } from 'lucide-react'

interface PartnershipRequestModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function PartnershipRequestModal({
  isOpen,
  onOpenChange,
}: PartnershipRequestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    nomUniversite: '',
    responsableNom: '',
    responsablePrenom: '',
    responsableEmail: '',
    responsableTelephone: '',
    message: '',
  })

  const handleInputChange = (
    field: string,
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSuccess(true)
  }

  const resetForm = () => {
    setFormData({
      nomUniversite: '',
      responsableNom: '',
      responsablePrenom: '',
      responsableEmail: '',
      responsableTelephone: '',
      message: '',
    })
    setIsSuccess(false)
  }

  const handleClose = () => {
    onOpenChange(false)
    if (isSuccess) {
      resetForm()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <DialogTitle>Demande de Partenariat</DialogTitle>
          </div>
          <DialogDescription>
            Remplissez ce formulaire pour demander un partenariat avec RIF-Stages.
            Un administrateur examinera votre demande.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Demande envoyée avec succès !
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Votre demande de partenariat a été reçue. Un administrateur l'examinera
              et vous contactera sous peu à {formData.responsableEmail}
            </p>
            <Button onClick={handleClose} className="w-full">
              Fermer
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nomUniversite">Nom de l'université *</Label>
              <Input
                id="nomUniversite"
                placeholder="Ex: Université de Bordeaux"
                value={formData.nomUniversite}
                onChange={e =>
                  handleInputChange('nomUniversite', e.target.value)
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="responsablePrenom">Prénom du responsable *</Label>
                <Input
                  id="responsablePrenom"
                  placeholder="Prénom"
                  value={formData.responsablePrenom}
                  onChange={e =>
                    handleInputChange('responsablePrenom', e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsableNom">Nom du responsable *</Label>
                <Input
                  id="responsableNom"
                  placeholder="Nom"
                  value={formData.responsableNom}
                  onChange={e =>
                    handleInputChange('responsableNom', e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsableEmail">Email du responsable *</Label>
              <Input
                id="responsableEmail"
                type="email"
                placeholder="responsable@universite.fr"
                value={formData.responsableEmail}
                onChange={e =>
                  handleInputChange('responsableEmail', e.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsableTelephone">
                Numéro de téléphone *
              </Label>
              <Input
                id="responsableTelephone"
                type="tel"
                placeholder="05 XX XX XX XX"
                value={formData.responsableTelephone}
                onChange={e =>
                  handleInputChange('responsableTelephone', e.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message (optionnel)</Label>
              <Textarea
                id="message"
                placeholder="Parlez-nous de votre université et de vos objectifs de partenariat..."
                value={formData.message}
                onChange={e =>
                  handleInputChange('message', e.target.value)
                }
                rows={4}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClose()}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  'Envoyer la demande'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
