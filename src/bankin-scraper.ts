import puppeteer, { Browser, Page } from "puppeteer";
import { BankinCredentials, LoginResult } from "./types";
import {
  BANKIN_SIGNIN_URL,
  DEFAULT_PUPPETEER_CONFIG,
  TIMEOUTS,
  SELECTORS,
  SUCCESS_URL_INDICATORS,
} from "./config";
import {
  shouldRunHeadless,
  isLoginSuccessful,
  logWarning,
  logSuccess,
  logError,
} from "./utils";

/**
 * Classe principale pour l'automatisation de Bankin
 */
export class BankinScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;

  /**
   * Lance le navigateur Puppeteer
   */
  async launch(): Promise<void> {
    console.log("🚀 Lancement du navigateur...");

    const launchOptions: any = {
      headless: shouldRunHeadless(),
      args: DEFAULT_PUPPETEER_CONFIG.args,
      ignoreDefaultArgs: ["--disable-extensions"],
      timeout: 180000, // 3 minutes timeout
    };

    // Use system Chromium if available (for cloud deployments like Railway)
    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
      launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
      console.log(
        `🔧 Utilisation de Chromium système: ${process.env.PUPPETEER_EXECUTABLE_PATH}`
      );
    }

    console.log(
      "🔧 Options de lancement:",
      JSON.stringify(launchOptions, null, 2)
    );

    try {
      this.browser = await puppeteer.launch(launchOptions);
      console.log("✅ Navigateur lancé avec succès");

      this.page = await this.browser.newPage();
      console.log("✅ Nouvelle page créée");

      await this.page.setViewport(DEFAULT_PUPPETEER_CONFIG.viewport);
      console.log("✅ Viewport configuré");

      // Add error handlers for the page
      this.page.on("error", (error) => {
        console.error("❌ Erreur de page:", error);
      });

      this.page.on("pageerror", (error) => {
        console.error("❌ Erreur JavaScript de page:", error);
      });
    } catch (error) {
      console.error("❌ Erreur lors du lancement du navigateur:", error);
      throw error;
    }
  }

  /**
   * Navigue vers la page de connexion Bankin avec retry
   */
  async navigateToSignIn(): Promise<void> {
    if (!this.page) {
      throw new Error(
        "Le navigateur n'est pas initialisé. Appelez launch() d'abord."
      );
    }

    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(
          `📍 Navigation vers la page de connexion Bankin (tentative ${attempt}/${maxRetries})...`
        );

        await this.page.goto(BANKIN_SIGNIN_URL, {
          waitUntil: "networkidle2",
          timeout: TIMEOUTS.navigation,
        });

        console.log("✅ Navigation réussie");
        return; // Success, exit the retry loop
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`⚠️ Tentative ${attempt} échouée:`, lastError.message);

        if (attempt < maxRetries) {
          const waitTime = attempt * 2000; // Progressive backoff: 2s, 4s
          console.log(
            `⏳ Attente de ${waitTime}ms avant nouvelle tentative...`
          );
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        }
      }
    }

    throw new Error(
      `Navigation échouée après ${maxRetries} tentatives. Dernière erreur: ${lastError?.message}`
    );
  }

  /**
   * Attend que les éléments de connexion soient chargés
   */
  async waitForLoginForm(): Promise<void> {
    if (!this.page) {
      throw new Error("La page n'est pas initialisée.");
    }

    console.log("⏳ Attente du chargement du formulaire de connexion...");
    await this.page.waitForSelector(SELECTORS.emailInput, {
      timeout: TIMEOUTS.selector,
    });
    await this.page.waitForSelector(SELECTORS.passwordInput, {
      timeout: TIMEOUTS.selector,
    });
  }

  /**
   * Remplit le formulaire de connexion
   */
  async fillLoginForm(credentials: BankinCredentials): Promise<void> {
    if (!this.page) {
      throw new Error("La page n'est pas initialisée.");
    }

    console.log("✏️  Remplissage du formulaire de connexion...");
    await this.page.type(SELECTORS.emailInput, credentials.email);
    await this.page.type(SELECTORS.passwordInput, credentials.password);
  }

  /**
   * Soumet le formulaire de connexion avec retry
   */
  async submitLoginForm(): Promise<void> {
    if (!this.page) {
      throw new Error("La page n'est pas initialisée.");
    }

    console.log("🔄 Soumission du formulaire...");
    await this.page.click(SELECTORS.submitButton);

    console.log("⏳ Attente de la réponse de connexion...");

    const maxRetries = 2;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(
          `⏳ Tentative d'attente de navigation ${attempt}/${maxRetries}...`
        );

        await this.page.waitForNavigation({
          waitUntil: "networkidle2",
          timeout: TIMEOUTS.navigation,
        });

        console.log("✅ Navigation après soumission réussie");
        return; // Success
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(
          `⚠️ Tentative ${attempt} de navigation échouée:`,
          lastError.message
        );

        if (attempt < maxRetries) {
          console.log("⏳ Attente supplémentaire avant nouvelle tentative...");
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }
    }

    // If navigation fails, check if we're already on the right page
    const currentUrl = this.page.url();
    console.log(`🌐 URL actuelle après échec de navigation: ${currentUrl}`);

    if (currentUrl.includes("accounts") || currentUrl.includes("dashboard")) {
      console.log("✅ Semble être connecté malgré l'échec de navigation");
      return;
    }

    throw new Error(
      `Navigation après soumission échouée après ${maxRetries} tentatives. Dernière erreur: ${lastError?.message}`
    );
  }

  /**
   * Vérifie si la connexion a réussi
   */
  checkLoginSuccess(): {
    success: boolean;
    currentUrl: string;
    message: string;
  } {
    if (!this.page) {
      throw new Error("La page n'est pas initialisée.");
    }

    const currentUrl = this.page.url();
    const success = isLoginSuccessful(currentUrl, SUCCESS_URL_INDICATORS);

    console.log(`🌐 URL actuelle après connexion: ${currentUrl}`);

    const message = success
      ? "🎉 La connexion semble avoir réussi !"
      : "❌ La connexion a peut-être échoué. Vérifiez la capture d'écran pour plus de détails.";

    if (success) {
      logSuccess("Connexion réussie !");
    } else {
      logWarning("Connexion possiblement échouée");
    }

    return { success, currentUrl, message };
  }

  /**
   * Effectue la connexion complète à Bankin
   */
  async login(credentials: BankinCredentials): Promise<LoginResult> {
    try {
      await this.launch();
      await this.navigateToSignIn();
      await this.waitForLoginForm();
      await this.fillLoginForm(credentials);
      await this.submitLoginForm();

      const { success, currentUrl, message } = this.checkLoginSuccess();

      logSuccess("Tentative de connexion terminée.");

      return {
        success,
        currentUrl,

        message,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      logError(`Une erreur s'est produite: ${errorMessage}`);

      return {
        success: false,
        currentUrl: this.page?.url() || "",

        message: `Erreur: ${errorMessage}`,
      };
    }
  }

  /**
   * Navigue vers une URL avec retry et gestion d'erreurs robuste
   */
  private async navigateToPage(
    url: string,
    description: string
  ): Promise<void> {
    if (!this.page) {
      throw new Error("La page n'est pas initialisée.");
    }

    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(
          `📊 ${description} (tentative ${attempt}/${maxRetries})...`
        );

        await this.page.goto(url, {
          waitUntil: "networkidle2",
          timeout: TIMEOUTS.navigation,
        });

        console.log(`✅ Navigation vers ${description} réussie`);
        return;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(
          `⚠️ Tentative ${attempt} échouée pour ${description}:`,
          lastError.message
        );

        if (attempt < maxRetries) {
          const waitTime = attempt * 2000;
          console.log(
            `⏳ Attente de ${waitTime}ms avant nouvelle tentative...`
          );
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        }
      }
    }

    throw new Error(
      `Navigation vers ${description} échouée après ${maxRetries} tentatives. Dernière erreur: ${lastError?.message}`
    );
  }

  /**
   * Navigue vers la page des catégories et récupère le total des dépenses
   */
  async getExpensesTotal(targetMonth: string): Promise<{
    success: boolean;
    total: string;
    currentMonth: string;
    message: string;
  }> {
    if (!this.page) {
      throw new Error("La page n'est pas initialisée.");
    }

    try {
      console.log("📊 Navigation vers la page des catégories...");
      await this.navigateToPage(
        "https://app2.bankin.com/categories",
        "la page des catégories"
      );

      // Attendre que la page soit chargée
      await this.page.waitForSelector("#monthSelector", {
        timeout: TIMEOUTS.selector,
      });

      console.log(`📅 Sélection du mois: ${targetMonth}...`);

      // Chercher et cliquer sur le mois cible
      const monthSelector = await this.page.$$("#monthSelector a");
      let monthFound = false;
      let currentMonth = "";

      for (const monthElement of monthSelector) {
        const monthText = await this.page.evaluate(
          (el) => el.textContent?.trim(),
          monthElement
        );
        if (
          monthText &&
          monthText.toLowerCase().includes(targetMonth.toLowerCase())
        ) {
          await monthElement.click();
          currentMonth = monthText;
          monthFound = true;
          console.log(`✅ Mois sélectionné: ${monthText}`);
          break;
        }
      }

      if (!monthFound) {
        // Si le mois n'est pas trouvé, utiliser le mois actuel (celui avec la classe "active")
        const activeMonth = await this.page.$eval(
          "#monthSelector a.active",
          (el) => el.textContent?.trim() || ""
        );
        currentMonth = activeMonth;
        console.log(
          `⚠️ Mois ${targetMonth} non trouvé, utilisation du mois actuel: ${activeMonth}`
        );
      }

      // Attendre que les données se chargent
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Récupérer le total des dépenses
      console.log("💰 Récupération du total des dépenses...");
      const totalElement = await this.page.$(".dbl.fs2.fw7");

      if (!totalElement) {
        throw new Error(
          "Impossible de trouver l'élément contenant le total des dépenses"
        );
      }

      const total = await this.page.evaluate(
        (el) => el.textContent?.trim() || "0.00 €",
        totalElement
      );

      console.log(`💸 Total des dépenses pour ${currentMonth}: ${total}`);

      return {
        success: true,
        total,
        currentMonth,
        message: `Total des dépenses récupéré avec succès pour ${currentMonth}: ${total}`,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      logError(`Erreur lors de la récupération des dépenses: ${errorMessage}`);

      return {
        success: false,
        total: "0.00 €",
        currentMonth: "",
        message: `Erreur: ${errorMessage}`,
      };
    }
  }

  /**
   * Navigue vers la page des revenus et récupère le total des revenus
   */
  async getIncomesTotal(targetMonth: string): Promise<{
    success: boolean;
    total: string;
    currentMonth: string;
    message: string;
  }> {
    if (!this.page) {
      throw new Error("La page n'est pas initialisée.");
    }

    try {
      console.log("💰 Navigation vers la page des revenus...");
      await this.navigateToPage(
        "https://app2.bankin.com/categories/2",
        "la page des revenus"
      );

      // Attendre que la page soit chargée
      await this.page.waitForSelector("#monthSelector", {
        timeout: TIMEOUTS.selector,
      });

      console.log(`📅 Sélection du mois: ${targetMonth}...`);

      // Chercher et cliquer sur le mois cible
      const monthSelector = await this.page.$$("#monthSelector a");
      let monthFound = false;
      let currentMonth = "";

      for (const monthElement of monthSelector) {
        const monthText = await this.page.evaluate(
          (el) => el.textContent?.trim(),
          monthElement
        );
        if (
          monthText &&
          monthText.toLowerCase().includes(targetMonth.toLowerCase())
        ) {
          await monthElement.click();
          currentMonth = monthText;
          monthFound = true;
          console.log(`✅ Mois sélectionné: ${monthText}`);
          break;
        }
      }

      if (!monthFound) {
        // Si le mois n'est pas trouvé, utiliser le mois actuel (celui avec la classe "active")
        const activeMonth = await this.page.$eval(
          "#monthSelector a.active",
          (el) => el.textContent?.trim() || ""
        );
        currentMonth = activeMonth;
        console.log(
          `⚠️ Mois ${targetMonth} non trouvé, utilisation du mois actuel: ${activeMonth}`
        );
      }

      // Attendre que les données se chargent
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Récupérer le total des revenus
      console.log("💰 Récupération du total des revenus...");
      const totalElement = await this.page.$(".dbl.fs2.fw7");

      if (!totalElement) {
        throw new Error(
          "Impossible de trouver l'élément contenant le total des revenus"
        );
      }

      const total = await this.page.evaluate(
        (el) => el.textContent?.trim() || "0.00 €",
        totalElement
      );

      console.log(`💸 Total des revenus pour ${currentMonth}: ${total}`);

      return {
        success: true,
        total,
        currentMonth,
        message: `Total des revenus récupéré avec succès pour ${currentMonth}: ${total}`,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      logError(`Erreur lors de la récupération des revenus: ${errorMessage}`);

      return {
        success: false,
        total: "0.00 €",
        currentMonth: "",
        message: `Erreur: ${errorMessage}`,
      };
    }
  }

  /**
   * Ferme le navigateur
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      console.log("🔒 Navigateur fermé.");
    }
  }
}
