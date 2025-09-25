import { tr } from './locales/tr';
import { en } from './locales/en';
import { ru } from './locales/ru';
import { de } from './locales/de';
import { fr } from './locales/fr';
import { es } from './locales/es';
import { it } from './locales/it';
import type { Locale } from './config';

export const translations = {
  tr,
  en,
  ru,
  de,
  fr,
  es,
  it
} as const;

export type TranslationKey = keyof typeof tr;

export function getTranslation(locale: Locale, key: TranslationKey): string {
  try {
    const translation = translations[locale] as Record<string, unknown>;
    const fallback = translations.tr as Record<string, unknown>;
    
    const result = String(translation?.[key] ?? fallback?.[key] ?? key);
    
    // Ensure we return a string, not an object
    if (typeof result === 'object' && result !== null) {
      console.warn(`Translation key '${key}' returned object instead of string:`, result);
      return key; // Return the key itself as fallback
    }
    
    return String(result);
  } catch (error) {
    console.error(`Translation error for key '${key}':`, error);
    return key;
  }
}