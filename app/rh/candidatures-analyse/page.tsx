'use client'

import { Card, CardContent } from '@/components/ui/card'

export default function AnalysePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Analyse IA</h1>
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Module d'analyse IA en cours de développement.
            L'analyse des CV réels sera disponible ici.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
