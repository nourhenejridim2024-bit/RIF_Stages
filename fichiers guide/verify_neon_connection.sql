-- Script pour vérifier la connexion et insérer un test dans Neon
-- Exécutez ce script dans le SQL Editor de Neon pour vérifier

-- 1. Vérifier que la table existe
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_name = 'CandidatureExterne';

-- 2. Compter les enregistrements
SELECT COUNT(*) as total_candidatures FROM "CandidatureExterne";

-- 3. Voir tous les enregistrements (s'il y en a)
SELECT id, nom, prenom, email, status, "dateSoumission" 
FROM "CandidatureExterne" 
ORDER BY "dateSoumission" DESC;

-- 4. Insérer un enregistrement de test directement dans Neon
INSERT INTO "CandidatureExterne" (
  id, nom, prenom, email, telephone, formation, niveau, 
  "dateDebut", duree, "cvUrl", "lettreMotivationUrl", 
  status, "dateSoumission", "createdAt", "updatedAt"
) VALUES (
  gen_random_uuid()::text,
  'Test',
  'Neon',
  'test@neon.com',
  '0600000000',
  'Test Formation',
  'bac+5',
  '2026-03-01',
  '4-6',
  '/uploads/test.pdf',
  '/uploads/lettre.pdf',
  'nouvelle',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- 5. Vérifier l'insertion
SELECT * FROM "CandidatureExterne" WHERE email = 'test@neon.com';
