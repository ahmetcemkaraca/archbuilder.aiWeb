import { tr } from './locales/tr';
import { en } from './locales/en';
import { ru } from './locales/ru';
import { de } from './locales/de';
import { fr } from './locales/fr';
import { es } from './locales/es';
import { it } from './locales/it';

type TranslationKeys = keyof typeof tr;
type LocaleCode = 'tr' | 'en' | 'ru' | 'de' | 'fr' | 'es' | 'it';

interface TranslationStatus {
  locale: LocaleCode;
  totalKeys: number;
  missingKeys: string[];
  completionRate: number;
}

interface TranslationReport {
  baseLocale: LocaleCode;
  totalKeys: number;
  localeStatuses: TranslationStatus[];
  overallCompletion: number;
}

// Tüm desteklenen dil dosyalarını bir map'e topla
const locales = {
  tr,
  en,
  ru,
  de,
  fr,
  es,
  it
} as const;

/**
 * Nesne içindeki tüm anahtarları düz bir liste olarak çıkarır (nested keys dahil olmak üzere)
 * @param obj - Çeviri nesnesi
 * @param prefix - Anahtar öneki (nested keys için)
 * @returns Tüm anahtarların düz listesi
 */
function extractAllKeys(obj: unknown, prefix: string = ''): string[] {
  const keys: string[] = [];
  
  if (typeof obj !== 'object' || obj === null) return keys;

  for (const key in obj as Record<string, unknown>) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      const value = (obj as Record<string, unknown>)[key];
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Nested object - recurse
        keys.push(...extractAllKeys(value, fullKey));
      } else {
        // Primitive value - add to keys
        keys.push(fullKey);
      }
    }
  }
  
  return keys;
}

/**
 * Belirli bir dil için eksik anahtarları bulur
 * @param baseKeys - Referans dil anahtarları
 * @param targetLocale - Kontrol edilecek dil
 * @returns Eksik anahtarların listesi
 */
function findMissingKeys(baseKeys: string[], targetLocale: LocaleCode): string[] {
  const targetKeys = extractAllKeys(locales[targetLocale]);
  return baseKeys.filter(key => !targetKeys.includes(key));
}

/**
 * Tüm dillerin çeviri durumunu kontrol eder
 * @param baseLocale - Referans dil (varsayılan: 'tr')
 * @returns Detaylı çeviri raporu
 */
export function validateTranslations(baseLocale: LocaleCode = 'tr'): TranslationReport {
  const baseKeys = extractAllKeys(locales[baseLocale]);
  const totalKeys = baseKeys.length;
  
  const localeStatuses: TranslationStatus[] = [];
  
  // Her dil için durum kontrolü
  Object.keys(locales).forEach(locale => {
    const localeCode = locale as LocaleCode;
    
    if (localeCode === baseLocale) {
      // Base locale is always 100% complete
      localeStatuses.push({
        locale: localeCode,
        totalKeys,
        missingKeys: [],
        completionRate: 100
      });
    } else {
      const missingKeys = findMissingKeys(baseKeys, localeCode);
      const completedKeys = totalKeys - missingKeys.length;
      const completionRate = Math.round((completedKeys / totalKeys) * 100);
      
      localeStatuses.push({
        locale: localeCode,
        totalKeys,
        missingKeys,
        completionRate
      });
    }
  });
  
  // Genel tamamlanma oranını hesapla
  const overallCompletion = Math.round(
    localeStatuses.reduce((sum, status) => sum + status.completionRate, 0) / localeStatuses.length
  );
  
  return {
    baseLocale,
    totalKeys,
    localeStatuses,
    overallCompletion
  };
}

/**
 * Belirli bir dil için eksik anahtarları konsola yazdırır
 * @param locale - Kontrol edilecek dil
 * @param baseLocale - Referans dil
 */
export function printMissingKeys(locale: LocaleCode, baseLocale: LocaleCode = 'tr'): void {
  const baseKeys = extractAllKeys(locales[baseLocale]);
  const missingKeys = findMissingKeys(baseKeys, locale);
  
  console.log(`\n=== ${locale.toUpperCase()} Eksik Anahtarlar ===`);
  console.log(`Toplam anahtar: ${baseKeys.length}`);
  console.log(`Eksik anahtar: ${missingKeys.length}`);
  console.log(`Tamamlanma oranı: ${Math.round(((baseKeys.length - missingKeys.length) / baseKeys.length) * 100)}%`);
  
  if (missingKeys.length > 0) {
    console.log('\nEksik anahtarlar:');
    missingKeys.forEach(key => console.log(`  - ${key}`));
  } else {
    console.log('\n✅ Tüm anahtarlar mevcut!');
  }
}

/**
 * Tüm dillerin özet raporunu konsola yazdırır
 */
export function printTranslationReport(): void {
  const report = validateTranslations();
  
  console.log('\n=== ArchBuilder.AI Çeviri Raporu ===');
  console.log(`Referans dil: ${report.baseLocale.toUpperCase()}`);
  console.log(`Toplam anahtar sayısı: ${report.totalKeys}`);
  console.log(`Genel tamamlanma oranı: ${report.overallCompletion}%\n`);
  
  console.log('Dil bazında durum:');
  report.localeStatuses
    .sort((a, b) => b.completionRate - a.completionRate)
    .forEach(status => {
      const emoji = status.completionRate === 100 ? '✅' : status.completionRate >= 90 ? '🟡' : '🔴';
      console.log(`  ${emoji} ${status.locale.toUpperCase()}: ${status.completionRate}% (${status.missingKeys.length} eksik)`);
    });
  
  // En düşük tamamlanma oranına sahip dilleri detaylandır
  const incompleteLocales = report.localeStatuses.filter(status => status.completionRate < 100);
  if (incompleteLocales.length > 0) {
    console.log('\n=== Eksik Çeviriler ===');
    incompleteLocales.forEach(status => {
      if (status.missingKeys.length > 0) {
        console.log(`\n${status.locale.toUpperCase()} (${status.missingKeys.length} eksik):`);
        status.missingKeys.slice(0, 10).forEach(key => console.log(`  - ${key}`));
        if (status.missingKeys.length > 10) {
          console.log(`  ... ve ${status.missingKeys.length - 10} tane daha`);
        }
      }
    });
  }
}

/**
 * TypeScript tip güvenliği için çeviri anahtarlarını kontrol eder
 * @param key - Kontrol edilecek anahtar
 * @returns Anahtar geçerli mi?
 */
export function isValidTranslationKey(key: string): key is TranslationKeys {
  return key in tr;
}

/**
 * Geliştiriciler için: eksik anahtarları otomatik template olarak oluşturur
 * @param locale - Hedef dil
 * @param baseLocale - Referans dil
 * @returns TypeScript template kodu
 */
export function generateMissingKeysTemplate(locale: LocaleCode, baseLocale: LocaleCode = 'tr'): string {
  const baseKeys = extractAllKeys(locales[baseLocale]);
  const missingKeys = findMissingKeys(baseKeys, locale);
  
  if (missingKeys.length === 0) {
    return `// ${locale.toUpperCase()}: Tüm anahtarlar mevcut! ✅`;
  }
  
  let template = `// ${locale.toUpperCase()} için eksik anahtarlar (${missingKeys.length} adet)\n`;
  template += `// Aşağıdaki anahtarları ${locale}.ts dosyasına ekleyin:\n\n`;
  
  missingKeys.forEach(key => {
    template += `  ${key}: '', // TODO: ${locale.toUpperCase()} çevirisi eklenecek\n`;
  });
  
  return template;
}

// CLI kullanımı için export
export { locales, extractAllKeys, findMissingKeys };
export type { TranslationKeys, LocaleCode, TranslationStatus, TranslationReport };