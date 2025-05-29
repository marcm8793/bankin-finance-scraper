# Bankin Finance Scraper

Script d'automatisation pour se connecter à Bankin en utilisant Puppeteer et TypeScript.

Ce script permet de récupérer automatiquement la somme des dépenses et des revenus de tous les comptes à la demande depuis l'application d'agrégation bancaire Bankin.

## ✨ Fonctionnalités

- 🔐 **Connexion automatique** à Bankin avec vos identifiants
- 💸 **Récupération des dépenses** du mois en cours
- 💰 **Récupération des revenus** du mois en cours
- 📊 **Calcul du solde net** (revenus - dépenses)
- 🔗 **Notifications Discord** avec des embeds colorés (optionnel)
- 🛡️ **Gestion d'erreurs** complète avec notifications
- 🎯 **Mode headless** ou visible pour le debug
- 🐳 **Support Docker** pour un déploiement facile

## 🚀 Installation

### Installation classique

1. **Cloner ou télécharger le projet**

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**

   ```bash
   cp env.example .env
   ```

   Puis éditez le fichier `.env` avec vos vraies informations :

   ```
   BANKIN_EMAIL=votre-email@example.com
   BANKIN_PASSWORD=votre-mot-de-passe
   HEADLESS=true

   # Configuration Discord (optionnel)
   DISCORD_BOT_TOKEN=votre-token-bot-discord
   DISCORD_CHANNEL_ID=votre-id-channel-discord
   DISCORD_ENABLED=true
   ```

4. **Configuration Discord (optionnel)**

   Pour recevoir les résultats financiers sur Discord, consultez le guide détaillé : [DISCORD_SETUP.md](./docs/DISCORD_SETUP.md)

### 🐳 Installation avec Docker

Pour une installation et un déploiement simplifiés avec Docker :

```bash
# 1. Configurer les variables d'environnement
cp env.example .env
# Éditez le fichier .env avec vos informations

# 2. Construire l'image Docker
npm run docker:build

# 3. Lancer le scraper
npm run docker:run
```

📖 **Guide complet Docker** : [DOCKER_DEPLOYMENT.md](./docs/DOCKER_DEPLOYMENT.md)

## 🎯 Utilisation

### Utilisation classique

#### Lancer le script (production)

```bash
npm start
```

#### Mode développement (TypeScript direct)

```bash
npm run dev
```

#### Mode développement avec rechargement automatique

```bash
npm run dev:watch
```

#### Mode debug (voir le navigateur)

Pour voir le navigateur en action, modifiez `HEADLESS=false` dans votre fichier `.env`, puis :

```bash
npm run dev
```

#### Mode debug avec inspecteur Node.js

Pour débugger avec l'inspecteur Node.js :

```bash
npm run dev:debug
```

### 🐳 Utilisation avec Docker

#### Commandes de base

```bash
# Lancer le scraper (production)
npm run docker:run

# Mode développement
npm run docker:dev

# Accéder au shell du conteneur
npm run docker:shell
```

#### Avec Docker Compose

```bash
# Lancer le service
npm run docker:compose:up

# Mode développement
npm run docker:compose:dev

# Construire l'image
npm run docker:compose:build
```

#### Commandes Docker directes

```bash
# Toutes les commandes disponibles
docker run --rm --env-file .env bankin-finance-scraper help

# Exemples d'utilisation
docker run --rm --env-file .env bankin-finance-scraper start
docker run --rm --env-file .env bankin-finance-scraper dev
docker run --rm --env-file .env bankin-finance-scraper build
```

### Autres commandes utiles

#### Compilation manuelle

```bash
npm run build
```

#### Nettoyage des fichiers compilés

```bash
npm run clean
```

#### Vérification des types

```bash
npm run type-check
```

## 📚 Documentation

- 📖 [Guide de déploiement Docker](./docs/DOCKER_DEPLOYMENT.md)
- 🔗 [Configuration Discord](./docs/DISCORD_SETUP.md)

## 🔧 Développement

Le projet supporte plusieurs modes d'exécution :

- **Local** : Exécution directe avec Node.js
- **Docker** : Exécution dans un conteneur isolé
- **Docker Compose** : Orchestration avec services multiples

Choisissez la méthode qui convient le mieux à votre environnement de développement ou de production.
