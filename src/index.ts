import "dotenv/config";
import { BankinScraper } from "./bankin-scraper";
import { DiscordNotifier, FinancialSummary } from "./discord-notifier";
import {
  getCredentialsFromEnv,
  areDefaultCredentials,
  logWarning,
  parseFrenchAmount,
  getDiscordConfigFromEnv,
  areDefaultDiscordConfig,
  isDiscordEnabled,
} from "./utils";

/**
 * Fonction principale pour exécuter le script de connexion Bankin
 */
async function main(): Promise<void> {
  console.log("🚀 Démarrage de l'automatisation de connexion Bankin...");

  // Récupération des identifiants depuis les variables d'environnement
  const credentials = getCredentialsFromEnv();
  const discordConfig = getDiscordConfigFromEnv();

  // Vérification si les identifiants par défaut sont utilisés
  if (areDefaultCredentials(credentials)) {
    logWarning(
      "Vous utilisez les identifiants par défaut. Veuillez configurer vos vrais identifiants dans le fichier .env"
    );
  }

  // Vérification de la configuration Discord
  let discordNotifier: DiscordNotifier | null = null;
  if (isDiscordEnabled()) {
    console.log("🔗 Initialisation de Discord...");
    discordNotifier = new DiscordNotifier(
      discordConfig.token,
      discordConfig.channelId
    );
    try {
      await discordNotifier.initialize();
    } catch (error) {
      console.error(
        "❌ Impossible d'initialiser Discord, continuons sans notifications"
      );
      discordNotifier = null;
    }
  } else if (areDefaultDiscordConfig(discordConfig)) {
    logWarning(
      "Configuration Discord par défaut détectée. Configurez DISCORD_BOT_TOKEN et DISCORD_CHANNEL_ID pour activer les notifications."
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

      // Calcul du solde net et envoi Discord si les deux opérations ont réussi
      if (expensesResult.success && incomesResult.success) {
        const expensesAmount = parseFrenchAmount(expensesResult.total);
        const incomesAmount = parseFrenchAmount(incomesResult.total);
        const netBalance = incomesAmount - expensesAmount;

        console.log("\n💼 Résumé financier:");
        console.log(`   Revenus: ${incomesResult.total}`);
        console.log(`   Dépenses: ${expensesResult.total}`);
        console.log(`   Solde net: ${netBalance.toFixed(2)} €`);

        // Envoi sur Discord si configuré
        if (discordNotifier) {
          console.log("\n📤 Envoi du résumé sur Discord...");
          const summary: FinancialSummary = {
            success: true,
            currentMonth: currentMonth,
            revenues: incomesResult.total,
            expenses: expensesResult.total,
            netBalance: netBalance.toFixed(2),
          };

          try {
            await discordNotifier.sendFinancialSummary(summary);
          } catch (error) {
            console.error("❌ Erreur lors de l'envoi Discord:", error);
          }
        }
      } else {
        // En cas d'échec partiel, envoyer un message d'erreur sur Discord
        if (discordNotifier) {
          const errorMessage = `Échec de récupération des données financières:\n- Dépenses: ${
            expensesResult.success ? "✅" : "❌"
          } ${expensesResult.message}\n- Revenus: ${
            incomesResult.success ? "✅" : "❌"
          } ${incomesResult.message}`;
          try {
            await discordNotifier.sendErrorMessage(errorMessage);
          } catch (error) {
            console.error("❌ Erreur lors de l'envoi Discord:", error);
          }
        }
      }
    } else {
      // En cas d'échec de connexion, envoyer un message d'erreur sur Discord
      if (discordNotifier) {
        try {
          await discordNotifier.sendErrorMessage(
            `Échec de connexion à Bankin: ${result.message}`
          );
        } catch (error) {
          console.error("❌ Erreur lors de l'envoi Discord:", error);
        }
      }
    }

    // Code de sortie basé sur le succès
    process.exit(result.success ? 0 : 1);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    console.error(`❌ Erreur fatale: ${errorMessage}`);

    // Envoyer l'erreur fatale sur Discord
    if (discordNotifier) {
      try {
        await discordNotifier.sendErrorMessage(
          `Erreur fatale: ${errorMessage}`
        );
      } catch (discordError) {
        console.error("❌ Erreur lors de l'envoi Discord:", discordError);
      }
    }

    process.exit(1);
  } finally {
    // Nettoyage: fermeture du navigateur et Discord
    await scraper.close();
    if (discordNotifier) {
      await discordNotifier.close();
    }
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
