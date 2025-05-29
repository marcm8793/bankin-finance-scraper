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
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-accelerated-2d-canvas",
    "--no-first-run",
    "--disable-gpu",
    "--disable-web-security",
    "--disable-features=VizDisplayCompositor",
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
  ],
  viewport: {
    width: 1280,
    height: 720,
  },
};

/**
 * Configuration des timeouts (en millisecondes)
 */
export const TIMEOUTS: TimeoutConfig = {
  selector: 30000, // 30 seconds for element selection
  navigation: 60000, // 60 seconds for navigation
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
 * Configuration Discord par défaut
 */
export const DEFAULT_DISCORD_CONFIG = {
  token: "your-discord-bot-token",
  channelId: "your-discord-channel-id",
};

/**
 * Indicateurs d'URL pour une connexion réussie
 */
export const SUCCESS_URL_INDICATORS = ["accounts"];
