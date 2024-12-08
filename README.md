# SowEsport - Front

Ce projet constitue le frontend de la plateforme **SowEsport**, développée pour offrir une expérience utilisateur immersive dans le domaine de l'eSport. Ce frontend est construit avec **Remix**, permettant une application rapide, interactive et optimisée pour le SEO.

---

## 🚀 Fonctionnalités

- 🖥️ Interface utilisateur réactive et moderne
- 🎟️ Gestion des billets pour les événements eSport
- 🔍 Classements régionaux et nationaux
- 🗺️ Carte interactive des compétitions en France
- 🛍️ Boutique en ligne pour l'achat de produits dérivés
- 🔗 Intégration avec une blockchain pour sécuriser les achats et gérer les remboursements

---

## 🛠️ Prérequis

Avant de lancer le projet, assurez-vous d'avoir :

- [Node.js](https://nodejs.org/) (version 16+ recommandée)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/) pour gérer les dépendances
- [Docker](https://www.docker.com/) (optionnel, pour le déploiement conteneurisé)

---

## ⚙️ Installation

### Option 1: Installation locale

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/nicoooo972/sowesport---front.git
   cd sowesport---front
   ```

2. Installez les dépendances :
   ```bash
   npm install
   # ou si vous utilisez yarn :
   yarn install
   ```

3. Configurez les variables d'environnement (voir la section Configuration)

4. Lancez l'application en mode développement :
   ```bash
   npm run dev
   # ou avec yarn :
   yarn dev
   ```

### Option 2: Installation avec Docker

1. Clonez le dépôt comme ci-dessus

2. Lancez l'application avec Docker :
   ```bash
   docker-compose up -d
   ```

L'application sera accessible à l'adresse http://localhost:3000.

## 📝 Configuration Docker

Le projet peut être lancé dans un conteneur Docker. Voici la configuration dans le fichier `docker-compose.yml` :

```yaml
services:
  frontend:
    build: 
      context: .
      dockerfile: Dockerfile
    container_name: sowesport-front
    ports:
      - '3000:3000'
    volumes:
      - .:/app
      - /app/node_modules
    env_file:
      - ./.env
```

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Configuration de l'API
API_BASE_URL=http://localhost:5000/api
BLOCKCHAIN_API_KEY=votre_clé_api_blockchain
```

## 📂 Structure du projet

Voici un aperçu de l'organisation du code :

```
src/
├── components/    # Composants réutilisables
├── pages/         # Pages principales de l'application
├── routes/        # Définition des routes Remix
├── styles/        # Fichiers CSS ou Tailwind
├── utils/         # Fonctions utilitaires
└── index.tsx      # Point d'entrée de l'application
```

## 🚧 Roadmap

* Ajouter des animations pour améliorer l'expérience utilisateur
* Intégrer un système de notification en temps réel
* Ajouter une fonctionnalité de recherche avancée
* Optimiser les performances pour les appareils mobiles
* Création des pages manquantes

## 🤝 Contribuer

Les contributions sont les bienvenues ! Si vous avez des suggestions ou souhaitez signaler des bugs, ouvrez une issue ou soumettez une pull request.

## 📄 Licence

Ce projet est sous licence MIT.

## ❤️ Remerciements

Merci à toute l'équipe de développement et à la communauté Remix pour leur soutien !
