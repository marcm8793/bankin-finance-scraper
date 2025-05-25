# Configuration Discord pour Bankin Finance Scraper

Ce guide vous explique comment configurer les notifications Discord pour recevoir automatiquement vos résumés financiers.

## Prérequis

1. Un serveur Discord où vous avez les permissions d'administrateur
2. Un channel Discord où vous voulez recevoir les notifications

## Étapes de configuration

### 1. Créer un Bot Discord

1. Allez sur [Discord Developer Portal](https://discord.com/developers/applications)
2. Cliquez sur "New Application"
3. Donnez un nom à votre application (ex: "Bankin Finance Bot")
4. Allez dans l'onglet "Bot"
5. Cliquez sur "Add Bot"
6. Copiez le **Token** (gardez-le secret !)

### 2. Inviter le Bot sur votre serveur

1. Dans l'onglet "OAuth2" > "URL Generator"
2. Sélectionnez les scopes :
   - `bot`
3. Sélectionnez les permissions :
   - `Send Messages`
   - `Use Slash Commands` (optionnel)
   - `Embed Links`
4. Copiez l'URL générée et ouvrez-la dans votre navigateur
5. Sélectionnez votre serveur et autorisez le bot

### 3. Obtenir l'ID du Channel

1. Dans Discord, activez le "Mode Développeur" :
   - Paramètres utilisateur > Avancé > Mode développeur
2. Faites un clic droit sur le channel où vous voulez les notifications
3. Cliquez sur "Copier l'ID"

### 4. Configurer les variables d'environnement

Dans votre fichier `.env`, ajoutez :

```env
# Configuration Discord
DISCORD_BOT_TOKEN=votre-token-bot-discord
DISCORD_CHANNEL_ID=votre-id-channel-discord
DISCORD_ENABLED=true
```

## Format des notifications

Le bot enverra des messages avec des embeds colorés contenant :

- 📅 **Mois** : Le mois en cours
- 💸 **Dépenses** : Total des dépenses
- 💰 **Revenus** : Total des revenus
- 📊 **Solde Net** : Différence entre revenus et dépenses
- 📈/📉 **Statut** : Indicateur visuel (vert si positif, rouge si négatif)

## Désactiver Discord

Pour désactiver temporairement les notifications Discord sans supprimer la configuration :

```env
DISCORD_ENABLED=false
```

## Dépannage

### Le bot ne répond pas

- Vérifiez que le token est correct
- Vérifiez que le bot a bien été invité sur le serveur
- Vérifiez que le bot a les permissions d'écrire dans le channel

### Channel introuvable

- Vérifiez que l'ID du channel est correct
- Vérifiez que le bot a accès au channel (permissions de lecture/écriture)

### Erreurs de connexion

- Vérifiez votre connexion internet
- Le token Discord peut avoir expiré, régénérez-le si nécessaire

## Exemple de message Discord

```
💰 Résumé Financier Bankin
📅 Mois: décembre

💸 Dépenses: 2 450,00 €
💰 Revenus: 3 200,00 €
📊 Solde Net: 750,00 €

📈 Statut: ✅ Solde positif
```
