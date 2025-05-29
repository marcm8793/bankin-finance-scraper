#!/bin/bash

echo "🐳 Test des fonctionnalités Docker pour bankin-finance-scraper"
echo "=============================================================="

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les résultats
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

echo -e "${YELLOW}1. Test de construction de l'image Docker...${NC}"
docker build -t bankin-finance-scraper . > /dev/null 2>&1
print_result $? "Construction de l'image Docker"

echo -e "${YELLOW}2. Test de l'aide du conteneur...${NC}"
docker run --rm bankin-finance-scraper help > /dev/null 2>&1
print_result $? "Affichage de l'aide"

echo -e "${YELLOW}3. Test de compilation TypeScript...${NC}"
docker run --rm bankin-finance-scraper build > /dev/null 2>&1
print_result $? "Compilation TypeScript"

echo -e "${YELLOW}4. Test de vérification des types...${NC}"
docker run --rm bankin-finance-scraper type-check > /dev/null 2>&1
print_result $? "Vérification des types"

echo -e "${YELLOW}5. Test de nettoyage...${NC}"
docker run --rm bankin-finance-scraper clean > /dev/null 2>&1
print_result $? "Nettoyage des fichiers compilés"

echo -e "${YELLOW}6. Test de Docker Compose build...${NC}"
docker compose build > /dev/null 2>&1
print_result $? "Construction avec Docker Compose"

echo -e "${YELLOW}7. Test de Docker Compose CLI...${NC}"
docker compose run --rm bankin-scraper-cli help > /dev/null 2>&1
print_result $? "Service CLI Docker Compose"

echo -e "${YELLOW}8. Test d'accès au shell...${NC}"
docker run --rm bankin-finance-scraper sh -c "echo 'Shell accessible'" > /dev/null 2>&1
print_result $? "Accès au shell du conteneur"

echo -e "${YELLOW}9. Test des variables d'environnement Puppeteer...${NC}"
docker run --rm bankin-finance-scraper sh -c "echo \$PUPPETEER_EXECUTABLE_PATH" | grep -q "chromium-browser"
print_result $? "Variables d'environnement Puppeteer"

echo -e "${YELLOW}10. Test de la présence de Chromium...${NC}"
docker run --rm bankin-finance-scraper sh -c "which chromium-browser" > /dev/null 2>&1
print_result $? "Installation de Chromium"

echo ""
echo "=============================================================="
echo -e "${GREEN}🎉 Tests Docker terminés !${NC}"
echo ""
echo "Pour utiliser le projet avec Docker :"
echo "  npm run docker:build    # Construire l'image"
echo "  npm run docker:run      # Lancer le scraper"
echo "  npm run docker:dev      # Mode développement"
echo "  npm run docker:shell    # Accès shell"
echo ""
echo "Avec Docker Compose :"
echo "  npm run docker:compose:build  # Construire"
echo "  npm run docker:compose:up     # Service principal"
echo "  npm run docker:compose:dev    # Mode développement"
