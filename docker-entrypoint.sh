#!/bin/sh
set -e

# Script d'entrée pour le conteneur Docker bankin-finance-scraper
# Permet d'exécuter différentes commandes facilement

# Fonction d'aide
show_help() {
    echo "Usage: docker run bankin-finance-scraper [COMMAND]"
    echo ""
    echo "Commandes disponibles:"
    echo "  start       Lancer le scraper (défaut)"
    echo "  dev         Lancer en mode développement"
    echo "  dev:watch   Lancer en mode développement avec rechargement automatique"
    echo "  dev:debug   Lancer en mode debug"
    echo "  build       Compiler le TypeScript"
    echo "  clean       Nettoyer les fichiers compilés"
    echo "  type-check  Vérifier les types TypeScript"
    echo "  sh          Ouvrir un shell"
    echo "  help        Afficher cette aide"
    echo ""
    echo "Exemples:"
    echo "  docker run bankin-finance-scraper"
    echo "  docker run bankin-finance-scraper dev"
    echo "  docker run -it bankin-finance-scraper sh"
}

# Si aucun argument n'est fourni, utiliser la commande par défaut
if [ $# -eq 0 ]; then
    exec npm start
fi

# Traiter les commandes
case "$1" in
    start)
        exec npm start
        ;;
    dev)
        exec npm run dev
        ;;
    dev:watch)
        exec npm run dev:watch
        ;;
    dev:debug)
        exec npm run dev:debug
        ;;
    build)
        exec npm run build
        ;;
    clean)
        exec npm run clean
        ;;
    type-check)
        exec npm run type-check
        ;;
    sh)
        exec /bin/sh
        ;;
    help|--help|-h)
        show_help
        exit 0
        ;;
    *)
        echo "Commande inconnue: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
