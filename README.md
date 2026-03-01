# 🎓 Rif-Stages-Plateforme

Plateforme digitale de gestion des stages académiques.
<img width="1871" height="830" alt="image" src="https://github.com/user-attachments/assets/8a7be831-fdfe-42fa-bc35-307e1755d88d" />

---

## 📌 Aperçu du projet

**Rif-Stages-Plateforme** est une application web développée avec **Next.js** et **Prisma** permettant la gestion complète du cycle de stage :

✔ Gestion des utilisateurs  
✔ Candidatures de stage  
✔ Génération et suivi des conventions  
✔ Validation des comptes  
✔ Suivi académique  
✔ Évaluations  

La plateforme connecte les **stagiaires**, **universités**, **entreprises**, **tuteur**, et **administrateurs** dans un environnement unique.

---

## 🧠 Problématique adressée

La gestion traditionnelle des stages implique souvent :

❌ Documents papier  
❌ Procédures longues  
❌ Suivi difficile  
❌ Manque de centralisation  

Cette plateforme vise à **digitaliser**, **simplifier** et **sécuriser** ces processus.

---

## 👥 Acteurs du système

### 🛠 Administrateur
- Gestion globale des utilisateurs
- Validation des comptes
- Gestion des rôles
- Logs système
- Supervision de la plateforme
Dashboard :
<img width="1882" height="900" alt="image" src="https://github.com/user-attachments/assets/27a76aa3-59f8-4126-b787-5ca925bb47fc" />
candidats acceptes :
<img width="1861" height="897" alt="image" src="https://github.com/user-attachments/assets/561c6310-6ace-49cc-b98a-f79bfa304460" />
universites :
<img width="1865" height="902" alt="image" src="https://github.com/user-attachments/assets/01a85afc-91ae-4ede-b19b-d1794272b7db" />
Utilisateurs :
<img width="1872" height="905" alt="image" src="https://github.com/user-attachments/assets/c8862e4e-eb45-4b84-a0eb-3c7f7ba75804" />
Rôles et Permissions :
<img width="1867" height="906" alt="image" src="https://github.com/user-attachments/assets/04729e93-f7c5-4a19-a787-416683e8fe07" />
Paramètres : 
<img width="1871" height="902" alt="image" src="https://github.com/user-attachments/assets/38f06318-2aea-4993-9447-0b21d7975c78" />
Logs système : 
<img width="1861" height="901" alt="image" src="https://github.com/user-attachments/assets/22b945d0-0fa3-4dd2-9f0c-e962662dd83d" />


---
### 👨‍🎓 Stagiaire
- Création de compte
- Authentification
- Soumission de candidature
- Upload de CV / documents
- Suivi des demandes
- Accès aux conventions
- Onboarding
- Évaluation

---

### 🏫 Université
- Consultation des stagiaires
- Gestion des conventions
- Suivi des stages
- Tableau de bord académique
<img width="1876" height="901" alt="image" src="https://github.com/user-attachments/assets/339e9c7f-5ee4-4af6-a2f9-4834234a789a" />

---

### 🏢 Entreprise / RH
- Consultation des candidatures
- Suivi des stagiaires
- Gestion des stages
<img width="1878" height="897" alt="image" src="https://github.com/user-attachments/assets/ba0f6d6f-9917-462e-a763-76bd53a20730" />
les utilisateurs :
<img width="1875" height="896" alt="image" src="https://github.com/user-attachments/assets/737ab7f5-75d1-423b-a0f8-25b8d452a150" />
convention :
<img width="1875" height="880" alt="image" src="https://github.com/user-attachments/assets/2ce745c1-4c55-4ad0-9fa8-12e294abf0d5" />

---



### 🛠 Tuteur
- Gestion globale des stagiaires 
- Omboarding
- Évaluation 

<img width="1890" height="895" alt="image" src="https://github.com/user-attachments/assets/c68005b6-03dc-4d6c-b02d-5916d327e363" />

---

## 🧩 Architecture Technique

La plateforme suit une architecture moderne **full-stack JavaScript / TypeScript** :

```

Client (Navigateur)
↓
Next.js (Frontend + API)
↓
Prisma ORM
↓
PostgreSQL Database

````

---

## 🧱 Stack Technologique

| Couche | Technologie |
|--------|-------------|
| Frontend | Next.js + React |
| Langage | TypeScript |
| Backend | Next.js API Routes |
| ORM | Prisma |
| Base de données | PostgreSQL |
| UI | Tailwind CSS / composants |
| Authentification | Sessions / JWT selon implémentation |
| Versioning | Git + GitHub |

---

## 🔐 Sécurité & Bonnes pratiques

La plateforme applique plusieurs principes :

✔ Séparation des rôles utilisateur  
✔ Validation côté serveur  
✔ Protection des routes  
✔ Gestion des sessions  
✔ Requêtes sécurisées vers la base  

⚠ Les variables sensibles sont stockées dans `.env`

---

## ⚙️ Prérequis

Avant installation :

✔ Node.js  
✔ npm  
✔ PostgreSQL  
✔ Git  

Vérifier :

```bash
node -v
npm -v
psql --version
git --version
````

---

## ▶️ Installation

### 1️⃣ Cloner le dépôt

```bash
git clone https://github.com/TON_USERNAME/Rif-Stages-Plateforme.git
cd Rif-Stages-Plateforme
```

---

### 2️⃣ Installer les dépendances

```bash
npm install
```

---

### 3️⃣ Configurer l’environnement

Créer un fichier `.env` :

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/rif_stages"
```

---

### 4️⃣ Générer Prisma Client

```bash
npx prisma generate
```

---

### 5️⃣ Appliquer les migrations

```bash
npx prisma migrate dev
```

---

### 6️⃣ Lancer le projet

```bash
npm run dev
```

Application disponible sur :

```
http://localhost:3000
```

---

## 🗂 Structure Simplifiée du Projet

```
Rif-Stages-Plateforme/
│
├── app/                # Pages & routing Next.js
├── components/         # Composants UI réutilisables
├── lib/                # Services & logique métier
├── prisma/             # Schéma & migrations DB
├── public/             # Assets statiques
├── styles/             # Styles globaux
├── package.json        # Dépendances
└── tsconfig.json       # Config TypeScript
```

---

## 🧪 Commandes utiles

| Action          | Commande              |
| --------------- | --------------------- |
| Dev mode        | `npm run dev`         |
| Build           | `npm run build`       |
| Start prod      | `npm start`           |
| Prisma generate | `npx prisma generate` |
| Prisma studio   | `npx prisma studio`   |

---

## 🔧 Résolution de problèmes fréquents

### ✔ Prisma Client Error

```bash
npx prisma generate
```

---

### ✔ Base de données non connectée

Vérifier `.env` + PostgreSQL actif.

---

### ✔ Problèmes dépendances

```bash
npm audit fix
```

---

### ✔ Warning lockfiles

Supprimer lockfiles inutiles :

* garder `package-lock.json` (npm)
* supprimer `pnpm-lock.yaml` si non utilisé

---

## 🔁 Workflow Git recommandé

Toujours mettre à jour avant travail :

```bash
git fetch
git pull
```

Sauvegarder correctement :

```bash
git add .
git commit -m "Message clair"
git push origin main
```

---

## 🤝 Collaboration en équipe

Ajouter un dépôt distant :

```bash
git remote add nom URL
git fetch nom
git merge nom/main
```

Comparer les changements :

```bash
git diff main nom/main
```

---

