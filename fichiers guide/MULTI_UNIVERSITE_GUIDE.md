# Système Multi-Universités - Guide de Connexion

## 📚 Universités Disponibles

### 1. **Université de Bordeaux** (France)
- **Email:** `pierre.dubois@univ-bordeaux.fr`
- **Mot de passe:** `TempPass123!`
- **Responsable:** Pierre Dubois
- **Stagiaires:** 3 stagiaires

### 2. **ESPRIT** (Tunisie) ⭐
- **Email:** `contact@esprit.tn`
- **Mot de passe:** `ESPRIT2024!`
- **Responsable:** Fatima Ben Ali
- **Stagiaires:** 13 stagiaires
  
#### Liste des 13 stagiaires ESPRIT:
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

### 3. **ISETN** (Tunisie)
- **Email:** `responsable@isetn.tn`
- **Mot de passe:** `ISETN2024!`
- **Responsable:** Mohamed Kammoun
- **Stagiaires:** À configurer

### 4. **Université Virtuelle de Tunis** (Tunisie)
- **Email:** `contact@uvt.tn`
- **Mot de passe:** `UVT2024!`
- **Responsable:** Aïcha Mbarek
- **Stagiaires:** À configurer

---

## 🚀 Fonctionnalités Université

Après connexion en tant qu'université, vous pouvez:

### Tableau de Bord Université
- ✓ Voir le nombre total de stagiaires de votre institution
- ✓ Consulter les statistiques (conventions, en cours, etc.)
- ✓ Accéder rapidement aux stagiaires

### Gestion des Stagiaires
**Route:** `/universite/stagiaires`
- ✓ Afficher la liste complète de vos stagiaires
- ✓ Filtrer et rechercher par nom
- ✓ Voir les statistiques de chaque stagiaire
- ✓ Consulter le statut d'onboarding

### Profil Individual Stagiaire
**Route:** `/universite/stagiaires/[id]`
- ✓ Informations complètes du stagiaire
- ✓ Convention de stage
- ✓ Progression d'onboarding détaillée
- ✓ Tâches d'onboarding (À faire, En cours, Terminées)
- ✓ Barre de progression

---

## 👨‍💼 Autres Comptes de Démonstration

### Admin
- **Email:** `admin@rif.fr`
- **Mot de passe:** `demo123`
- **Accès:** Gestion complète, voir page `/admin/universites`

### RH
- **Email:** `admin.rh@rif.fr`
- **Mot de passe:** `demo123`
- **Accès:** Gestion des candidatures et analyse CV

### Stagiaire
- **Email:** `marie.dupont@edu.fr`
- **Mot de passe:** `demo123`

### Tuteur
- **Email:** `philippe.moreau@rif.fr`
- **Mot de passe:** `demo123`

---

## 📊 Admin - Gestion des Universités

**Route:** `/admin/universites`

L'admin peut:
- ✓ Voir tous les comptes universitaires
- ✓ Afficher les statistiques par université
- ✓ Consulter le nombre de stagiaires par institution
- ✓ Filtrer les universités par nom ou email
- ✓ Accéder aux détails de chaque université
- ✓ Gérer les stagiaires de chaque université
- ✓ Ajouter nouvelles universités
- ✓ Modifier/Supprimer des comptes

---

## 🎯 Architecture du Système

### Relations:
```
Université (univ-2: ESPRIT)
    ├─ Pierre Dubois (Responsable)
    └─ 13 Stagiaires
        ├─ Amira Ben Amor
        ├─ Ahmed Khlifi
        ├─ Yasmin Salem
        ├─ ... (10 stagiaires supplémentaires)
        └─ Chacun avec:
            - Profil complet
            - Convention
            - Onboarding suivi
            - Tâches d'intégration
```

### Types de Données:
- `University ID`: `univ-2` pour ESPRIT
- `Stagiaires Count`: 13 associés à ESPRIT
- `Status`: Tous les stagiaires sont "Actifs"

---

## 💡 Cas d'Usage

### Scénario 1: Connexion ESPRIT
1. Aller à `/connexion`
2. Entrer `contact@esprit.tn` / `ESPRIT2024!`
3. Être redirigé à `/universite`
4. Voir 13 stagiaires
5. Cliquer sur "Gérer les stagiaires"
6. Cliquer sur un stagiaire pour voir son profil complet

### Scénario 2: Admin - Gestion Universités
1. Aller à `/connexion`
2. Entrer `admin@rif.fr` / `demo123`
3. Aller à `/admin/universites`
4. Voir carte de chaque université avec nombre de stagiaires
5. Voir 13 stagiaires pour ESPRIT
6. Cliquer sur "Voir stagiaires (13)" pour explorer

---

## 🔄 Flux de Données

```
Login → Auth Check → Role Detection
    ↓
    ├─ Université → /universite → Dashboard + Stagiaires
    │   ├─ Filter by: universitId === user.id
    │   └─ Show: 13 stagiaires pour ESPRIT
    │
    ├─ Admin → /admin → Dashboard + Gestion Universités
    │   ├─ Show: 4 universités
    │   └─ Show: Tous les stagiaires totaux
    │
    ├─ RH → /rh → Candidatures et Analyses CV
    ├─ Tuteur → /tuteur → Ses stagiaires
    └─ Stagiaire → /stagiaire → Profil personnel
```

---

## ✨ Fonctionnalités Implémentées

✅ Multi-universités support
✅ 13 stagiaires pour ESPRIT
✅ Filtrage par université
✅ Page admin universités
✅ Dashboard université
✅ Liste stagiaires filtrée
✅ Profil stagiaire détaillé
✅ Onboarding suivi
✅ Credentials sécurisés
✅ Navigation complète
