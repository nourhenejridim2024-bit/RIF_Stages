# 🎓 Rif-Stages-Plateforme

## 📌 Présentation

**Rif-Stages-Plateforme** est une application web moderne permettant la gestion digitale des stages académiques.  
La plateforme facilite l’interaction entre **stagiaires**, **universités**, **entreprises**, et **administrateurs**.

Elle permet de centraliser les candidatures, conventions, validations et suivis administratifs dans un seul système.

---

## 🧠 Objectifs du projet

Ce projet vise à :

✔ Simplifier la gestion des stages  
✔ Réduire les procédures manuelles  
✔ Offrir une expérience utilisateur claire et fluide  
✔ Centraliser les documents et validations  
✔ Améliorer la communication entre acteurs académiques

---

## 🚀 Fonctionnalités principales

### 👨‍🎓 Stagiaire
- Authentification / Connexion
- Soumission de candidature
- Upload de CV et documents
- Suivi de l’état des demandes
- Accès aux conventions
- Onboarding
- Évaluation

---

### 🏫 Université
- Gestion des stagiaires
- Consultation des conventions
- Suivi des validations
- Tableau de bord

---

### 🏢 Entreprise / RH
- Consultation des candidatures
- Gestion des stagiaires
- Suivi des stages

---

### 🛠 Administrateur
- Gestion des utilisateurs
- Validation des comptes
- Logs système
- Gestion globale de la plateforme

---

## 🧩 Stack Technique

- **Frontend** : Next.js + React + TypeScript  
- **Backend** : API Routes Next.js  
- **ORM** : Prisma  
- **Base de données** : PostgreSQL  
- **UI** : Tailwind / composants modernes  
- **Gestion d’état** : React Hooks  
- **Versioning** : Git + GitHub

---

## ⚙️ Prérequis

Avant de lancer le projet, assurez-vous d’avoir :

✔ Node.js installé  
✔ npm installé  
✔ PostgreSQL configuré  
✔ Variables d’environnement définies

---

## ▶️ Installation du projet

### 1️⃣ Cloner le dépôt

```bash
git clone https://github.com/TON_USERNAME/Rif-Stages-Plateforme.git
cd Rif-Stages-Plateforme
2️⃣ Installer les dépendances
npm install
3️⃣ Générer Prisma Client
npx prisma generate
4️⃣ Lancer le serveur de développement
npm run dev
Application accessible sur :

http://localhost:3000
🗄 Configuration Base de Données
Créer un fichier .env :

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/rif_stages"
Puis exécuter :

npx prisma migrate dev
🧪 Développement
Commandes utiles :

npm run dev        # Mode développement
npm run build      # Build production
npm start          # Lancer en production
npx prisma studio  # Interface base de données
🔧 Problèmes fréquents & Solutions
✔ Prisma non généré
npx prisma generate
✔ Conflit de dépendances
npm audit fix
✔ Next.js warning lockfiles
Supprimer le lockfile inutile :

garder package-lock.json si npm

supprimer pnpm-lock.yaml si non utilisé

🔁 Workflow Git recommandé
Mettre à jour le projet :

git fetch
git pull
Sauvegarder les modifications :

git add .
git commit -m "Description des changements"
git push origin main
🤝 Collaboration
Pour récupérer les modifications d’un autre dépôt :

git remote add nom_remote URL_DU_DEPOT
git fetch nom_remote
git merge nom_remote/main
