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
  return translations[locale][key] || translations.tr[key] || key;
}