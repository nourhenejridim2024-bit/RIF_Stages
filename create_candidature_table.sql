-- Créer la table CandidatureExterne manuellement dans Neon
-- Exécutez ce script dans le SQL Editor de votre console Neon

CREATE TABLE IF NOT EXISTS "CandidatureExterne" (
  "id" TEXT PRIMARY KEY,
  "nom" TEXT NOT NULL,
  "prenom" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "telephone" TEXT NOT NULL,
  "adresse" TEXT,
  "ville" TEXT,
  "codePostal" TEXT,
  "formation" TEXT NOT NULL,
  "niveau" TEXT NOT NULL,
  "dateDebut" TEXT NOT NULL,
  "duree" TEXT NOT NULL,
  "message" TEXT,
  "cvUrl" TEXT NOT NULL,
  "lettreMotivationUrl" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'nouvelle',
  "dateSoumission" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "departementAffecte" TEXT,
  "commentairesRH" TEXT,
  "dateDecision" TIMESTAMP,
  "compteCreeLe" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Créer les index pour améliorer les performances
CREATE INDEX IF NOT EXISTS "CandidatureExterne_status_idx" ON "CandidatureExterne"("status");
CREATE INDEX IF NOT EXISTS "CandidatureExterne_email_idx" ON "CandidatureExterne"("email");

-- Vérifier que la table a été créée
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'CandidatureExterne'
ORDER BY ordinal_position;
