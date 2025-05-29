# Dockerfile simple et efficace pour ARM64/Apple Silicon
FROM node:18-alpine

# Installer Chromium et les dépendances nécessaires
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && rm -rf /var/cache/apk/*

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S pptruser \
    && adduser -S pptruser -u 1001 -G pptruser

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration des dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci && npm cache clean --force

# Copier le script d'entrée
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Copier le code source
COPY . .

# Compiler le TypeScript
RUN npm run build

# Créer le dossier logs et ajuster les permissions
RUN mkdir -p /app/logs \
    && chown -R pptruser:pptruser /app

# Basculer vers l'utilisateur non-root
USER pptruser

# Variables d'environnement pour Puppeteer avec Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV CHROME_BIN=/usr/bin/chromium
ENV CHROME_PATH=/usr/bin/chromium

# Exposer le port
EXPOSE 3000

# Utiliser le script d'entrée
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# Commande par défaut
CMD ["start"]
