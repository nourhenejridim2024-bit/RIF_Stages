# Guide Complet - Tous les Rôles RIF-Stages

## Vue d'ensemble du système

L'application RIF-Stages gère 5 rôles distincts :

1. **Stagiaire** - Candidat postulant pour un stage
2. **Tuteur** - Responsable encadrant le stagiaire en entreprise
3. **RH** - Gestionnaire des ressources humaines (recrutement)
4. **Admin** - Administrateur système
5. **Université** - Responsable universitaire gérant les stagiaires

---

## 1. Connexion par Rôle

### Stagiaire
- **Email**: `marie.dupont@edu.fr`
- **Mot de passe**: `demo123`
- **Accès à**: Page candidature, suivi convention, évaluations

### Tuteur
- **Email**: `philippe.moreau@rif.fr`
- **Mot de passe**: `demo123`
- **Accès à**: Gestion des stagiaires, onboarding, évaluations

### RH
- **Email**: `admin.rh@rif.fr`
- **Mot de passe**: `demo123`
- **Accès à**: Gestion candidatures, analyse CV avec scores, conventions

### Admin
- **Email**: `admin@rif.fr`
- **Mot de passe**: `demo123`
- **Accès à**: Gestion utilisateurs, universités, partenariats, logs

### Université - ESPRIT
- **Email**: `contact@esprit.tn`
- **Mot de passe**: `ESPRIT2024!`
- **Accès à**: Gestion de 13 stagiaires, suivi conventions, onboarding

### Université - Bordeaux
- **Email**: `pierre.dubois@univ-bordeaux.fr`
- **Mot de passe**: `TempPass123!`
- **Accès à**: Gestion de 3 stagiaires

### Université - ISETN
- **Email**: `responsable@isetn.tn`
- **Mot de passe**: `ISETN2024!`
- **Accès à**: Gestion stagiaires

### Université - UVT
- **Email**: `contact@uvt.tn`
- **Mot de passe**: `UVT2024!`
- **Accès à**: Gestion stagiaires

---

## 2. Fonctionnalités par Rôle

### STAGIAIRE

**Accès**: `/stagiaire`

**Pages disponibles**:
- Dashboard: Vue d'ensemble du statut
- Candidature (`/stagiaire/candidature`):
  - Remplir formulaire étape par étape
  - Télécharger CV (PDF, Word, TXT)
  - Envoi automatique pour analyse IA
- Convention (`/stagiaire/convention`): Voir la convention signée
- Évaluations (`/stagiaire/evaluation`): Consulter les évaluations du tuteur
- Onboarding (`/stagiaire/onboarding`): Suivre les tâches d'intégration

**Données de test**:
- Marie Dupont (stg-1): Convention signée, onboarding en cours
- Jean Martin (stg-2): Convention signée, onboarding complet
- Sophie Bernard (stg-3): Candidature en cours

---

### TUTEUR

**Accès**: `/tuteur`

**Pages disponibles**:
- Dashboard: Vue des stagiaires assignés
- Stagiaires (`/tuteur/stagiaires`): Liste des stagiaires à encadrer
- Onboarding (`/tuteur/onboarding`): 
  - Gérer les tâches d'onboarding
  - Marquer comme complétées
  - Ajouter des notes
- Évaluations (`/tuteur/evaluations`): Évaluer les compétences

**Données de test**:
- Philippe Moreau (tut-1): 2 stagiaires (Marie, Karim)
- Claire Durand (tut-2): 2 stagiaires (Jean, Ahmed)

---

### RH (Ressources Humaines)

**Accès**: `/rh`

**Pages disponibles**:
- Dashboard: KPIs et statistiques
- Candidatures (`/rh/candidatures`): Gérer toutes les candidatures
- Analyse CV (`/rh/candidatures-analyse`):
  - Voir le score de chaque CV (0-100)
  - Analyse IA: compétences, expérience, formation
  - Filtrer par score (excellent ≥80, bon 60-79, faible <60)
- Conventions (`/rh/conventions`): Créer et gérer les conventions
- Utilisateurs (`/rh/utilisateurs`): Gérer les utilisateurs
- Statistiques (`/rh/statistiques`): Rapports et graphiques

**Analyse CV exemple**:
- Marie Dupont: Score 82/100 - Excellent
- Lucas Chen: Score 88/100 - Excellent
- Sophie Bernard: Score 65/100 - Bon

---

### ADMIN

**Accès**: `/admin`

**Pages disponibles**:
- Dashboard: Vue d'ensemble système
- Candidats acceptés (`/admin/candidats`): Gérer les candidatures acceptées
- Universités (`/admin/universites`): 
  - Voir tous les comptes universitaires
  - Nombre de stagiaires par université
  - Détails des responsables
- Utilisateurs (`/admin/utilisateurs`): Gestion complète des utilisateurs
- Rôles & Permissions (`/admin/roles`): Configurer les permissions
- Paramètres (`/admin/parametres`): Configuration système
- Partenariats (`/admin/partenariats`): Gérer les demandes de partenariat
- Logs (`/admin/logs`): Historique des actions

**Données de test**:
- 4 universités avec contacts
- 16 stagiaires répartis
- 2 demandes de partenariat

---

### UNIVERSITÉ

**Accès**: `/universite`

**Pages disponibles**:
- Dashboard: Statistiques et raccourcis
- Stagiaires (`/universite/stagiaires`):
  - Liste de tous les stagiaires de l'université
  - Filtrage et recherche
  - Badges de statut (En stage, À assigner)
- Détail Stagiaire (`/universite/stagiaires/[id]`):
  - Profil complet
  - Onboarding (visualisation des tâches)
  - Convention
  - Progression
- Conventions (`/universite/conventions`):
  - Liste des conventions signées
  - Téléchargement des documents
  - Statut et dates

**Données de test ESPRIT** (13 stagiaires):
1. Amira Ben Amor - Génie Logiciel
2. Ahmed Khlifi - Réseaux
3. Yasmin Salem - IA et Data Science
4. Karim Oueslati - Sécurité
5. Nadia Triki - Web Développement
6. Hamza Makhlouf - Cloud Computing
7. Layla Gharsallah - Génie Logiciel
8. Omar Berrada - Génie Logiciel
9. Rima Jebali - Réseaux
10. Bilel Mansouri - IA et Data Science
11. Hana Wafi - Web Développement
12. Samir Zouari - Cloud Computing
13. Zineb Brahmi - Sécurité

---

## 3. Flux Complets à Tester

### Flux Candidature → Convention → Onboarding

**Sequence**:
1. **Stagiaire** remplir candidature + upload CV
2. **RH** reçoit notification, voit score IA du CV
3. **RH** accepte candidature, génère convention
4. **Stagiaire** voit convention, la signe
5. **Tuteur** crée tâches d'onboarding
6. **Stagiaire** voit et suit son onboarding
7. **Université** suit la progression

### Test Analyse CV

1. Connectez-vous en RH (`admin.rh@rif.fr`)
2. Allez à `/rh/candidatures-analyse`
3. Consultez les 3 candidatures avec scores:
   - Score 82: Bon niveau
   - Score 88: Excellent niveau
   - Score 65: À développer

---

## 4. Vérifications de Sécurité

- Chaque rôle ne peut voir que ses données
- Stagiaires: Uniquement leurs candidatures
- Tuteurs: Uniquement leurs stagiaires
- RH: Toutes les candidatures
- Admin: Tous les utilisateurs et configurations
- Université: Uniquement ses stagiaires

---

## 5. Données Mock Complètes

**Universités**: 4 (Bordeaux, ESPRIT, ISETN, UVT)
**Stagiaires**: 16 répartis par université
**Tuteurs**: 2 avec stagiaires assignés
**Candidatures**: 5 avec analyses CV
**Conventions**: 2 signées et complètes
**Évaluations**: 1 d'exemple

---

## 6. Points Clés du Système

✓ Dashboard universite affiche les 13 stagiaires ESPRIT
✓ Analyse IA génère des scores pour chaque CV
✓ Système de permissions par rôle
✓ Suivi complet de l'onboarding
✓ Convention digitale avec signatures
✓ Gestion multi-université

---

## 7. Próximas Améliorations

- Notifications en temps réel
- Export de rapports PDF
- Intégration calendrier
- Messagerie interne
- Galerie de conventions templates
