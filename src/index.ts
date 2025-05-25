import "dotenv/config";
import { BankinScraper } from "./bankin-scraper";
import {
  getCredentialsFromEnv,
  areDefaultCredentials,
  logWarning,
  parseFrenchAmount,
} from "./utils";

/**
 * Fonction principale pour exécuter le script de connexion Bankin
 */
async function main(): Promise<void> {
  console.log("🚀 Démarrage de l'automatisation de connexion Bankin...");

  // Récupération des identifiants depuis les variables d'environnement
  const credentials = getCredentialsFromEnv();

  // Vérification si les identifiants par défaut sont utilisés
  if (areDefaultCredentials(credentials)) {
    logWarning(
      "Vous utilisez les identifiants par défaut. Veuillez configurer vos vrais identifiants dans le fichier .env"
    );
  }

  // Création d'une instance du scraper
  const scraper = new BankinScraper();

  try {
    // Exécution de la connexion
    const result = await scraper.login(credentials);

    // Affichage du résultat
    console.log("\n📊 Résultat de la connexion:");
    console.log(`   Succès: ${result.success ? "✅" : "❌"}`);
    console.log(`   URL: ${result.currentUrl}`);
    console.log(`   Message: ${result.message}`);

    // Si la connexion a réussi, récupérer les dépenses et les revenus
    if (result.success) {
      const currentMonth = new Date().toLocaleString("fr-FR", {
        month: "long",
      });

      // Récupération des dépenses
      console.log("\n💸 Récupération des dépenses...");
      const expensesResult = await scraper.getExpensesTotal(currentMonth);

      console.log("\n📈 Résultat des dépenses:");
      console.log(`   Succès: ${expensesResult.success ? "✅" : "❌"}`);
      console.log(`   Mois: ${expensesResult.currentMonth}`);
      console.log(`   Total: ${expensesResult.total}`);
      console.log(`   Message: ${expensesResult.message}`);

      // Récupération des revenus
      console.log("\n💰 Récupération des revenus...");
      const incomesResult = await scraper.getIncomesTotal(currentMonth);

      console.log("\n📈 Résultat des revenus:");
      console.log(`   Succès: ${incomesResult.success ? "✅" : "❌"}`);
      console.log(`   Mois: ${incomesResult.currentMonth}`);
      console.log(`   Total: ${incomesResult.total}`);
      console.log(`   Message: ${incomesResult.message}`);

      // Calcul du solde net si les deux opérations ont réussi
      if (expensesResult.success && incomesResult.success) {
        const expensesAmount = parseFrenchAmount(expensesResult.total);
        const incomesAmount = parseFrenchAmount(incomesResult.total);
        const netBalance = incomesAmount - expensesAmount;

        console.log("\n💼 Résumé financier:");
        console.log(`   Revenus: ${incomesResult.total}`);
        console.log(`   Dépenses: ${expensesResult.total}`);
        console.log(`   Solde net: ${netBalance.toFixed(2)} €`);
      }
    }

    // Code de sortie basé sur le succès
    process.exit(result.success ? 0 : 1);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    console.error(`❌ Erreur fatale: ${errorMessage}`);
    process.exit(1);
  } finally {
    // Nettoyage: fermeture du navigateur
    await scraper.close();
  }
}

// Gestion des erreurs non capturées
process.on("unhandledRejection", (reason) => {
  console.error("❌ Promesse rejetée non gérée:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Exception non capturée:", error);
  process.exit(1);
});

// Gestion de l'interruption (Ctrl+C)
process.on("SIGINT", () => {
  console.log("\n🛑 Interruption détectée. Arrêt du script...");
  process.exit(0);
});

// Exécution du script principal
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Erreur dans la fonction principale:", error);
    process.exit(1);
  });
}
