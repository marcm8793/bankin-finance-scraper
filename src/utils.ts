import { BankinCredentials, EnvironmentConfig } from "./types";
import { DEFAULT_CREDENTIALS } from "./config";

/**
 * Récupère les identifiants depuis les variables d'environnement
 */
export function getCredentialsFromEnv(): BankinCredentials {
  const env = process.env as EnvironmentConfig;

  return {
    email: env.BANKIN_EMAIL || DEFAULT_CREDENTIALS.email,
    password: env.BANKIN_PASSWORD || DEFAULT_CREDENTIALS.password,
  };
}

/**
 * Vérifie si les identifiants sont les valeurs par défaut
 */
export function areDefaultCredentials(credentials: BankinCredentials): boolean {
  return (
    credentials.email === DEFAULT_CREDENTIALS.email ||
    credentials.password === DEFAULT_CREDENTIALS.password
  );
}

/**
 * Détermine si le mode headless doit être activé
 */
export function shouldRunHeadless(): boolean {
  return process.env.HEADLESS !== "false";
}

/**
 * Vérifie si l'URL indique une connexion réussie
 */
export function isLoginSuccessful(url: string, indicators: string[]): boolean {
  return indicators.some((indicator) => url.includes(indicator));
}

/**
 * Affiche un message d'avertissement formaté
 */
export function logWarning(message: string): void {
  console.warn(`⚠️  ${message}`);
}

/**
 * Affiche un message de succès formaté
 */
export function logSuccess(message: string): void {
  console.log(`✅ ${message}`);
}

/**
 * Affiche un message d'erreur formaté
 */
export function logError(message: string): void {
  console.error(`❌ ${message}`);
}

/**
 * Affiche un message d'information formaté
 */
export function logInfo(message: string): void {
  console.log(`📸 ${message}`);
}

/**
 * Parse un montant français (avec virgules et espaces) en nombre
 * Exemples: "2 000,00 €" -> 2000.00, "1 234,56 €" -> 1234.56
 */
export function parseFrenchAmount(amount: string): number {
  // Supprimer tout sauf les chiffres, virgules, points et tirets
  let cleanAmount = amount.replace(/[^\d,.-]/g, "");

  // Détecter le format: si on a une virgule suivie de 2 chiffres à la fin, c'est le séparateur décimal français
  // Sinon, si on a un point suivi de 2 chiffres à la fin, c'est le séparateur décimal anglais
  if (/,\d{2}$/.test(cleanAmount)) {
    // Format français: "1234,56" ou "1 234,56"
    cleanAmount = cleanAmount.replace(",", ".");
  } else if (/,\d{3}/.test(cleanAmount) && /\.\d{2}$/.test(cleanAmount)) {
    // Format anglais avec virgule comme séparateur de milliers: "1,234.56"
    cleanAmount = cleanAmount.replace(/,/g, "");
  } else {
    // Autres cas: remplacer virgule par point
    cleanAmount = cleanAmount.replace(",", ".");
  }

  return parseFloat(cleanAmount) || 0;
}
