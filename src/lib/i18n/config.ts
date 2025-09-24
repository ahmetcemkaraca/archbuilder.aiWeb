export const locales = ['en', 'tr', 'ru', 'de', 'fr', 'es', 'it'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'tr';

export const localeNames: Record<Locale, string> = {
  tr: 'Türkçe',
  en: 'English',
  ru: 'Русский',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano'
};

export const localeFlags: Record<Locale, string> = {
  tr: '🇹🇷',
  en: '🇺🇸',
  ru: '🇷🇺',
  de: '🇩🇪',
  fr: '🇫🇷',
  es: '🇪🇸',
  it: '🇮🇹'
};