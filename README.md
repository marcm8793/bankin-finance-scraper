# Bankin Finance Scraper

Script d'automatisation pour se connecter à Bankin en utilisant Puppeteer et TypeScript.

Ce script permet de récupérer automatiquement la somme des dépenses et des revenus de tous les comptes à la demande depuis l'application d'agrégation bancaire Bankin.

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
   ```

4. **Créer le dossier pour les screenshots**
   ```bash
   mkdir screenshots
   ```

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
