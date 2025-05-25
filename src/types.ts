/**
 * Configuration pour l'environnement
 */
export interface EnvironmentConfig {
  BANKIN_EMAIL?: string;
  BANKIN_PASSWORD?: string;
  HEADLESS?: string;
}

/**
 * Identifiants de connexion Bankin
 */
export interface BankinCredentials {
  email: string;
  password: string;
}

/**
 * Configuration pour Puppeteer
 */
export interface PuppeteerConfig {
  headless: boolean;
  args: string[];
  viewport: {
    width: number;
    height: number;
  };
}

/**
 * Résultat de la tentative de connexion
 */
export interface LoginResult {
  success: boolean;
  currentUrl: string;
  message: string;
}

/**
 * Configuration des timeouts
 */
export interface TimeoutConfig {
  selector: number;
  navigation: number;
}

/**
 * Sélecteurs CSS pour les éléments de la page
 */
export interface PageSelectors {
  emailInput: string;
  passwordInput: string;
  submitButton: string;
}
