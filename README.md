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

## 🚀 Installation

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

## 🎯 Utilisation

### Lancer le script (production)

```bash
npm start
```

### Mode développement (TypeScript direct)

```bash
npm run dev
```

### Mode développement avec rechargement automatique

```bash
npm run dev:watch
```

### Mode debug (voir le navigateur)

Pour voir le navigateur en action, modifiez `HEADLESS=false` dans votre fichier `.env`, puis :

```bash
npm run dev
```

### Mode debug avec inspecteur Node.js

Pour débugger avec l'inspecteur Node.js :

```bash
npm run dev:debug
```

### Compilation manuelle

```bash
npm run build
```

### Nettoyage des fichiers compilés

```bash
npm run clean
```

### Vérification des types

```bash
npm run type-check
```
