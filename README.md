# Narrat - Écosystème Spirituel Numérique

Narrat est une plateforme backend modulaire conçue pour accompagner la vie spirituelle chrétienne. Elle offre une structure robuste pour gérer les enseignements, la prière, la communauté et la croissance personnelle.

## 🚀 Technologies

- **Runtime**: Node.js & TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL (via Docker)
- **Containerization**: Docker & Docker Compose
- **Validation**: Zod
- **Security**: JWT, BcryptJS, Helmet

## 🏗️ Architecture du Projet

Le projet est conçu comme un monorepo contenant le backend et les applications clientes.

```text
narrat/
├── narrat-service/  # Backend (Node.js, Express, Prisma)
├── narrat-admin/    # Application Admin (Next.js)
├── mobile/          # Application Mobile (À initialiser)
└── README.md
```

### 🔙 Backend (Narrat Service)
```text
narrat-service/
├── src/
│   ├── config/          # Configurations (Base de données, Env)
│   ├── modules/         # Modules fonctionnels (Auth, Library, etc.)
│   │   └── [module]/
│   │       ├── [module].controller.ts
│   │       ├── [module].service.ts
│   │       ├── [module].dto.ts
│   │       └── [module].route.ts
│   ├── shared/          # Utilitaires et Middlewares partagés
│   ├── app.ts           # Configuration Express
│   └── server.ts        # Point d'entrée
├── prisma/              # Schéma et Migrations Prisma
└── docker-compose.yml   # Infrastructure locale
```

## 📦 Modules Implémentés

Le système est composé de 13 modules principaux :

1.  **Auth** : Gestion des utilisateurs (Inscription, Connexion, Profil).
2.  **Library** : Bibliothèque numérique (Livres, Catégories, Auteurs).
3.  **Confession & Community** : Partage de témoignages et requêtes.
4.  **Formation** : Cours et enseignements (Enrôlement, Leçons, Quiz).
5.  **Notifications** : Rappels, versets quotidiens et alertes.
6.  **Challenges** : Défis spirituels (Suivi quotidien, Partenaires).
7.  **Prayer** : Journal de prière et mur d'intercession.
8.  **Quiz** : Quiz bibliques (Sessions, Tournois, Duels, Leaderboard).
9.  **Worship** : Chants d'adoration, Paroles et sélections.
10. **Revival** : Histoires des réveils passés et figures historiques.
11. **Family** : Groupes familiaux et dévotions pour la famille.
12. **Evangelism** : Suivi des contacts et ressources d'évangélisation.
13. **Spiritual Health** : Bilan de santé spirituelle et plans de croissance.
14. **AI Assistant** : Accompagnement spirituel basé sur l'IA (GPT-4o).

## 🛠️ Installation et Démarrage

### Prérequis

- Node.js (v18+)
- Docker & Docker Compose

### Étapes

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd narrat-service
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer l'environnement**
   Copiez le fichier `.env.example` (ou créez un `.env`) :
   ```env
   PORT=3000
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/narrat?schema=public"
   JWT_SECRET=your_super_secret_key
   NODE_ENV=development
   ```

4. **Lancer la base de données**
   ```bash
   docker-compose up -d
   ```

5. **Générer le client Prisma et migrer**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

6. **Lancer en mode développement**
   ```bash
   npm run dev
   ```

## 📜 Licence

Ce projet est la propriété de Narrat. Tous droits réservés.
