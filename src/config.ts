import { PuppeteerConfig, TimeoutConfig, PageSelectors } from "./types";

/**
 * URL de connexion Bankin
 */
export const BANKIN_SIGNIN_URL = "https://app2.bankin.com/signin";

/**
 * Configuration par défaut pour Puppeteer
 */
export const DEFAULT_PUPPETEER_CONFIG: PuppeteerConfig = {
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
  viewport: {
    width: 1280,
    height: 720,
  },
};

/**
 * Configuration des timeouts (en millisecondes)
 */
export const TIMEOUTS: TimeoutConfig = {
  selector: 10000,
  navigation: 15000,
};

/**
 * Sélecteurs CSS pour les éléments de la page
 */
export const SELECTORS: PageSelectors = {
  emailInput: "#signin_email",
  passwordInput: "#signin_password",
  submitButton: 'button[type="submit"]',
};

/**
 * Identifiants par défaut (pour les tests)
 */
export const DEFAULT_CREDENTIALS = {
  email: "your-email@example.com",
  password: "your-password",
};

/**
 * Indicateurs d'URL pour une connexion réussie
 */
export const SUCCESS_URL_INDICATORS = ["accounts"];
