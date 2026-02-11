## Guide d'utilisation - Système de Demande de Partenariat

### Vue d'ensemble
Le système permet aux universités de demander un partenariat avec RIF-Stages. Les demandes sont examinées par un administrateur qui peut les accepter ou les refuser.

### Flux utilisateur

#### 1. Page d'accueil
- Un nouveau bouton **"Partenariat"** est ajouté dans le header et dans la section hero
- Cliquer sur ce bouton ouvre un modal pour soumettre une demande

#### 2. Formulaire de demande de partenariat
L'université remplit les informations suivantes:
- Nom de l'université
- Nom du responsable de stage
- Prénom du responsable
- Email du responsable
- Numéro de téléphone du responsable
- Message optionnel

#### 3. Processus d'approbation par l'admin
- Accès: `/admin/partenariats`
- Liste toutes les demandes avec leur statut
- Statuts disponibles:
  - **Nouvelle**: Première soumission
  - **En révision**: L'admin examine la demande
  - **Acceptée**: La demande a été approuvée
  - **Refusée**: La demande a été rejetée
  - **Compte créé**: Un compte université a été créé

#### 4. Actions admin
- **Voir détails**: Affiche toutes les informations de la demande
- **Marquer en révision**: Change le statut à "en révision"
- **Accepter**: Génère un mot de passe temporaire et crée le compte université
- **Refuser**: Rejette la demande avec un commentaire

#### 5. Connexion université
Après acceptation:
- Email: `pierre.dubois@univ-bordeaux.fr` (pour la démo)
- Mot de passe: Généré aléatoirement lors de l'acceptation
- Page d'accueil: `/universite`

### Credentials de test

**Admin:**
- Email: `admin@rif.fr`
- Password: `demo123`

**Université (déjà acceptée):**
- Email: `pierre.dubois@univ-bordeaux.fr`
- Password: `TempPass123!`

### Structure du code

**Types** (`lib/types.ts`):
- `DemandePartenariat`: Interface pour les demandes
- `Universite`: Interface pour les utilisateurs université

**Components**:
- `partnership-request-modal.tsx`: Modal de soumission de demande
- `partenariat-requests-management.tsx`: Page de gestion admin

**Pages**:
- `/`: Page d'accueil avec bouton partenariat
- `/admin/partenariats`: Page de gestion des demandes
- `/universite`: Tableau de bord université

**Mock Data** (`lib/mock-data.ts`):
- `mockDemandesPartenariat`: Demandes existantes
- `mockUniversites`: Utilisateurs université
- `mockCredentials`: Identifiants de connexion

### Prochaines étapes possibles
- Intégration avec un vrai système d'email pour l'envoi de mots de passe temporaires
- Page de gestion complète pour l'université (stagiaires, conventions, etc.)
- Notifications en temps réel
- Export de rapports et statistiques
