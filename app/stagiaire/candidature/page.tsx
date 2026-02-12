"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { mockCandidatures } from "@/lib/mock-data";
import { DEPARTEMENTS } from "@/lib/types";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  CheckCircle2,
  Upload,
  ArrowLeft,
  ArrowRight,
  Loader2,
  File,
  User,
  GraduationCap,
  Briefcase,
} from "lucide-react";

type CVAnalysis = {
  score: number;
  competences: string[];
  experience: string;
  formation: string;
  points_forts: string[];
  points_amelioration: string[];
  resume: string;
  date_analyse: string;
};

export default function CandidaturePage() {
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cvAnalysis, setCvAnalysis] = useState<CVAnalysis | null>(null);

  const [formData, setFormData] = useState({
    dateNaissance: "",
    adresse: "",
    ville: "",
    codePostal: "",
    telephone: "",
    ecole: "",
    niveau: "",
    specialite: "",
    annee: "",
    dateDebut: "",
    dateFin: "",
    departementSouhaite: "",
    sujetSouhaite: "",
    motivation: "",
  });

  if (!user) return null;

  const existingCandidature = mockCandidatures.find(
    (c) => c.stagiaireId === user.id
  );

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCvFile(file);
    setCvAnalysis(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setCvText((event.target?.result as string) || "");
    };
    reader.readAsText(file);
  };

  const handleCVAnalysis = async () => {
    if (!cvText) return alert("Veuillez télécharger un CV");

    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/cv/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvText,
          candidateName: `${user.prenom} ${user.nom}`,
          departement: formData.departementSouhaite || "Général",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erreur analyse");

      setCvAnalysis(data.analysis);
      setCurrentStep(4);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    alert("Candidature envoyée !");
  };

  const steps = [
    { number: 1, title: "Informations personnelles", icon: User },
    { number: 2, title: "Formation & CV", icon: GraduationCap },
    { number: 3, title: "Préférences", icon: Briefcase },
    { number: 4, title: "Récapitulatif", icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nouvelle candidature</h1>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>
            Étape {currentStep} sur 4
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* STEP 2 CV */}
          {currentStep === 2 && (
            <>
              <Label>CV</Label>

              {cvFile ? (
                <div className="flex items-center gap-3 p-3 bg-muted rounded">
                  <File className="h-4 w-4" />
                  <span>{cvFile.name}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setCvFile(null);
                      setCvText("");
                      setCvAnalysis(null);
                    }}
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <input type="file" onChange={handleCVUpload} />
              )}

              <Button
                onClick={handleCVAnalysis}
                disabled={!cvText || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  "Analyser mon CV"
                )}
              </Button>

              {cvAnalysis && (
                <Alert>
                  <AlertDescription>
                    Score: <Badge>{cvAnalysis.score}/100</Badge>
                    <div className="mt-2 text-sm">
                      {cvAnalysis.resume}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <>
              {cvAnalysis ? (
                <>
                  <Badge>{cvAnalysis.score}/100</Badge>
                  <p>{cvAnalysis.resume}</p>
                  <div className="flex gap-2 flex-wrap">
                    {cvAnalysis.competences.map((c) => (
                      <Badge key={c} variant="secondary">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </>
              ) : (
                <Alert>
                  <AlertDescription>
                    Aucun CV analysé.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}

          {/* NAVIGATION */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((s) => s - 1)}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Précédent
            </Button>

            {currentStep < 4 ? (
              <Button onClick={() => setCurrentStep((s) => s + 1)}>
                Suivant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                Soumettre
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
