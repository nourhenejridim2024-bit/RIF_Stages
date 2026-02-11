# Guide d'Utilisation - Acteur École

## Bienvenue dans le système RIF-Stages pour les Écoles

Les écoles peuvent maintenant suivre leurs stagiaires et gérer leurs parcours d'onboarding directement depuis la plateforme.

---

## Connexion École

### Identifiants d'accès

#### Lycée Victor Duruy
- **Email**: contact@lycee-victor-duruy.fr
- **Mot de passe**: LyceeVD2024!
- **Stagiaires**: 3 stagiaires (Terminale NSI)

#### Collège Jean Jaurès
- **Email**: contact@college-jaures.fr
- **Mot de passe**: CollegeJJ2024!
- **Stagiaires**: 2 stagiaires (3ème)

#### BTS Audiovisuel
- **Email**: contact@bts-audiovisuel.fr
- **Mot de passe**: BTS2024!
- **Stagiaires**: À venir

---

## Fonctionnalités de l'École

### 1. Tableau de Bord Principal
**URL**: `/ecole`

Affiche:
- Nombre total de stagiaires
- Statistiques en cours
- Accès rapides aux stagiaires
- Liste des derniers stagiaires enregistrés

### 2. Gestion des Stagiaires
**URL**: `/ecole/stagiaires`

Fonctionnalités:
- Liste complète des stagiaires de l'école
- Recherche en temps réel par nom, spécialité ou email
- Affichage du profil de chaque stagiaire
- Accès au détail et onboarding de chaque stagiaire

### 3. Détail Stagiaire
**URL**: `/ecole/stagiaires/[id]`

Affiche:
- Informations personnelles (email, téléphone, formation)
- Progression d'onboarding en pourcentage
- Liste des tâches d'onboarding (à faire, en cours, complétées)
- Badges de statut pour chaque tâche

---

## Données Mock

### Écoles créées
1. **Lycée Victor Duruy** - Enseignement secondaire supérieur
2. **Collège Jean Jaurès** - Enseignement secondaire inférieur
3. **BTS Audiovisuel** - Enseignement supérieur court

### Stagiaires liés aux écoles

#### Lycée Victor Duruy (ecole-1)
- Thomas Bernard - Terminale NSI
- Camille Dubois - Terminale NSI
- Lucas Marchand - Terminale NSI

#### Collège Jean Jaurès (ecole-2)
- Valentin Moreau - 3ème
- Alice Lefevre - 3ème

---

## Flux de Visite Recommandé

1. Se connecter avec les identifiants école
2. Consulter le tableau de bord
3. Accéder à la liste des stagiaires via "Voir tous les stagiaires"
4. Utiliser la recherche pour filtrer les stagiaires
5. Cliquer sur un stagiaire pour voir son détail
6. Consulter la progression d'onboarding
7. Vérifier les tâches complétées et à faire

---

## Structure de Base de Données

### Table: Écoles
```
id: string
email: string
role: 'ecole'
nom: string
prenom: string
nomEcole: string
niveau: 'college' | 'lycee' | 'bts'
telephone: string
adresse: string
ville: string
createdAt: string
```

### Liaison: Stagiaires → Écoles
```
Stagiaire.ecoleId = Ecole.id
```

---

## Intégration avec d'autres acteurs

- **Université**: Gère les stagiaires de niveau supérieur
- **Tuteur**: Suit les stagiaires en entreprise
- **RH**: Analyse les CV et gère les candidatures
- **Admin**: Gère toutes les écoles et universités

---

## Prochaines Améliorations

- Génération de rapports PDF
- Export de listes de stagiaires
- Formulaires de commentaires sur les stagiaires
- Intégration avec les conventions de stage
- Notifications pour les milestones d'onboarding
