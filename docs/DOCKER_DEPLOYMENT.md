# 🐳 Déploiement Docker - Bankin Finance Scraper

Ce guide explique comment utiliser Docker pour déployer et exécuter le Bankin Finance Scraper dans un conteneur.

## 📋 Prérequis

- Docker installé sur votre système
- Docker Compose (inclus avec Docker Desktop)
- Fichier `.env` configuré (voir [README.md](../README.md))

## 🚀 Démarrage rapide

### 1. Construction de l'image

```bash
# Construire l'image Docker
docker build -t bankin-finance-scraper .

# Ou avec docker compose
docker compose build

# Ou avec npm
npm run docker:build
```

### 2. Exécution du scraper

```bash
# Lancer le scraper une fois
docker run --rm --env-file .env bankin-finance-scraper

# Ou avec docker compose (service persistant)
docker compose up bankin-scraper

# Ou avec npm
npm run docker:run
```

## 🛠️ Commandes disponibles

Le conteneur Docker supporte toutes les commandes npm du projet :

### Commandes de base

```bash
# Lancer le scraper (production)
docker run --rm --env-file .env bankin-finance-scraper start
npm run docker:run

# Mode développement
docker run --rm --env-file .env bankin-finance-scraper dev
npm run docker:dev

# Mode développement avec rechargement automatique
docker run --rm --env-file .env -it bankin-finance-scraper dev:watch

# Mode debug
docker run --rm --env-file .env bankin-finance-scraper dev:debug
```

### Commandes utilitaires

```bash
# Compiler le TypeScript
docker run --rm bankin-finance-scraper build

# Nettoyer les fichiers compilés
docker run --rm bankin-finance-scraper clean

# Vérifier les types
docker run --rm bankin-finance-scraper type-check

# Accéder au shell du conteneur
docker run --rm -it --env-file .env bankin-finance-scraper sh
npm run docker:shell
```

### Avec Docker Compose

```bash
# Lancer le service principal
docker compose up bankin-scraper
npm run docker:compose:up

# Exécuter des commandes ponctuelles
docker compose run --rm bankin-scraper-cli dev
npm run docker:compose:dev

# Construire les images
docker compose build
npm run docker:compose:build

# Accéder au shell
docker compose run --rm bankin-scraper-cli sh
```

## 🧪 Tests et validation

Un script de test automatisé est fourni pour valider l'installation Docker :

```bash
# Lancer tous les tests Docker
./test-docker.sh
```

Ce script teste :

- ✅ Construction de l'image Docker
- ✅ Affichage de l'aide
- ✅ Compilation TypeScript
- ✅ Vérification des types
- ✅ Nettoyage des fichiers compilés
- ✅ Construction avec Docker Compose
- ✅ Service CLI Docker Compose
- ✅ Accès au shell du conteneur
- ✅ Installation de Chromium

## 🏗️ Architecture technique

### Image de base

- **Node.js 18 Alpine** : Image légère et sécurisée
- **Chromium** : Navigateur pré-installé pour Puppeteer
- **Utilisateur non-root** : Sécurité renforcée

### Optimisations

- **Multi-stage build** : Réduction de la taille de l'image
- **Cache des dépendances** : Construction plus rapide
- **Variables d'environnement** : Configuration flexible

### Compatibilité

- ✅ **ARM64/Apple Silicon** : Optimisé pour les Mac M1/M2
- ✅ **AMD64/Intel** : Compatible avec les processeurs Intel
- ✅ **Linux** : Testé sur Ubuntu/Debian
- ✅ **macOS** : Docker Desktop
- ✅ **Windows** : Docker Desktop avec WSL2

## 🔧 Configuration avancée

### Limites de ressources

Le docker-compose.yml inclut des limites de ressources par défaut :

```yaml
deploy:
  resources:
    limits:
      memory: 1G
      cpus: "0.5"
```

### Sécurité

- Le conteneur utilise un utilisateur non-root (`pptruser`)
- Capabilities minimales pour Puppeteer
- Pas de nouveaux privilèges

### Puppeteer dans Docker

Le conteneur est configuré pour Puppeteer avec :

- Chromium stable pré-installé
- Polices nécessaires pour le rendu
- Mémoire partagée augmentée (`shm_size: 2gb`)
- Mode headless activé par défaut
- Variables d'environnement optimisées

## 🐛 Dépannage

### Problèmes courants

1. **Erreur de permissions**

   ```bash
   # Vérifier les permissions du fichier .env
   chmod 644 .env
   ```

2. **Chrome ne démarre pas**

   ```bash
   # Augmenter la mémoire partagée
   docker run --shm-size=2g --env-file .env bankin-finance-scraper
   ```

3. **Variables d'environnement non chargées**

   ```bash
   # Vérifier que le fichier .env est présent
   docker run --rm --env-file .env bankin-finance-scraper sh -c "env | grep BANKIN"
   ```

4. **Problème avec Apple Silicon (M1/M2)**
   ```bash
   # L'image est optimisée pour ARM64, pas de configuration supplémentaire nécessaire
   docker build -t bankin-finance-scraper .
   ```

### Mode debug

Pour débugger le conteneur :

```bash
# Voir le navigateur en action (nécessite X11 forwarding sur Linux/macOS)
docker run --rm --env-file .env -e HEADLESS=false bankin-finance-scraper dev

# Accéder aux logs détaillés
docker run --rm --env-file .env bankin-finance-scraper dev
```

## 📊 Surveillance et logs

### Logs du conteneur

```bash
# Voir les logs en temps réel
docker compose logs -f bankin-scraper

# Logs avec timestamps
docker compose logs -t bankin-scraper
```

### Monitoring des ressources

```bash
# Statistiques en temps réel
docker stats bankin-finance-scraper

# Informations sur le conteneur
docker inspect bankin-finance-scraper
```

## 🔄 Mise à jour

Pour mettre à jour le conteneur après des modifications du code :

```bash
# Reconstruire l'image
docker compose build --no-cache

# Redémarrer le service
docker compose up -d bankin-scraper
```

## 🚀 Déploiement en production

### Variables d'environnement recommandées

```bash
# Dans votre .env pour la production
HEADLESS=true
DISCORD_ENABLED=true
NODE_ENV=production
```

### Service systemd (Linux)

Créer un service systemd pour un démarrage automatique :

```bash
# Créer le fichier service
sudo nano /etc/systemd/system/bankin-scraper.service
```

Contenu du fichier :

```ini
[Unit]
Description=Bankin Finance Scraper
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=no
WorkingDirectory=/path/to/your/project
ExecStart=/usr/bin/docker compose up bankin-scraper
ExecStop=/usr/bin/docker compose down

[Install]
WantedBy=multi-user.target
```

Activer le service :

```bash
sudo systemctl enable bankin-scraper.service
sudo systemctl start bankin-scraper.service
```

## 📝 Notes importantes

- ✅ Le conteneur est optimisé pour un environnement headless
- ✅ Les dépendances de développement sont incluses pour permettre la compilation
- ✅ Le script d'entrée permet une utilisation flexible des commandes
- ✅ La configuration de sécurité suit les meilleures pratiques Docker
- ✅ Compatible avec les architectures ARM64 (Apple Silicon) et AMD64 (Intel)
- ✅ Chromium est pré-installé et configuré pour Puppeteer
- ✅ Toutes les commandes npm sont disponibles dans le conteneur

## 🎯 Résumé des commandes essentielles

```bash
# Construction et test
npm run docker:build
./test-docker.sh

# Utilisation quotidienne
npm run docker:run          # Lancer le scraper
npm run docker:dev          # Mode développement
npm run docker:shell        # Accès shell

# Docker Compose
npm run docker:compose:up   # Service principal
npm run docker:compose:dev  # Mode développement
```
