'use client'

import { useEffect, useState } from 'react'
import { mockCandidatures } from '@/lib/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import {
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  TrendingUp,
  Zap,
  GraduationCap,
  FileText,
} from 'lucide-react'

interface CVAnalysisModalProps {
  candidatureId: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onClose?: () => void
}

export function CVAnalysisModal({
  candidatureId,
  isOpen,
  onOpenChange,
  onClose,
}: CVAnalysisModalProps) {
  const candidature = mockCandidatures.find(c => c.id === candidatureId)
  const analysis = candidature?.analyseCV

  if (!analysis) {
    return null
  }

  const scoreColor = analysis.score >= 75 ? '#10b981' : analysis.score >= 50 ? '#f59e0b' : '#ef4444'
  
  const chartData = [
    { name: 'Score', value: analysis.score },
    { name: 'Restant', value: 100 - analysis.score },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Analyse du CV
          </DialogTitle>
          <DialogDescription>
            Rapport détaillé d'analyse par IA
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Score Section */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-2" style={{ borderColor: scoreColor }}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2" style={{ color: scoreColor }}>
                    {analysis.score}
                  </div>
                  <p className="text-sm text-muted-foreground">Score global</p>
                  <div className="mt-3 w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${analysis.score}%`,
                        backgroundColor: scoreColor,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <GraduationCap className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                  <p className="text-sm font-medium">{analysis.formation}</p>
                  <p className="text-xs text-muted-foreground">Niveau d'études</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                  <p className="text-sm font-medium">{analysis.experience}</p>
                  <p className="text-xs text-muted-foreground">Expérience</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Competences */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              Compétences identifiées ({analysis.competences.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.competences.map((competence, idx) => (
                <Badge key={idx} variant="secondary">
                  {competence}
                </Badge>
              ))}
            </div>
          </div>

          {/* Points forts */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Points forts
            </h3>
            <ul className="space-y-2">
              {analysis.points_forts.map((point, idx) => (
                <li key={idx} className="flex gap-2 text-sm">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Points d'amélioration */}
          {analysis.points_amelioration.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                Points d'amélioration
              </h3>
              <ul className="space-y-2">
                {analysis.points_amelioration.map((point, idx) => (
                  <li key={idx} className="flex gap-2 text-sm">
                    <span className="text-orange-500 mt-0.5">!</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Résumé */}
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-foreground">{analysis.resume}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Analysé le: {analysis.date_analyse}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
