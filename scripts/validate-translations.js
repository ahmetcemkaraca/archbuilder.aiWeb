#!/usr/bin/env node

/**
 * ArchBuilder.AI Çeviri Doğrulama Script'i
 * 
 * Bu script tüm dil çevirilerinin eksiksiz olduğunu kontrol eder.
 * 
 * Kullanım:
 *   node scripts/validate-translations.js
 *   node scripts/validate-translations.js --locale=es
 *   node scripts/validate-translations.js --detailed
 */

import { printTranslationReport, printMissingKeys, validateTranslations, generateMissingKeysTemplate } from '../src/lib/i18n/translation-manager.js';

// Command line arguments
const args = process.argv.slice(2);
const locale = args.find(arg => arg.startsWith('--locale='))?.split('=')[1];
const detailed = args.includes('--detailed');
const generateTemplate = args.includes('--generate-template');

// Ana çalıştırma fonksiyonu
function main() {
  console.log('🌐 ArchBuilder.AI Çeviri Doğrulama Sistemi');
  console.log('=======================================');
  
  if (locale) {
    // Belirli bir dil için detaylı rapor
    if (!['tr', 'en', 'ru', 'de', 'fr', 'es', 'it'].includes(locale)) {
      console.error(`❌ Geçersiz dil kodu: ${locale}`);
      console.log('Desteklenen diller: tr, en, ru, de, fr, es, it');
      process.exit(1);
    }
    
    printMissingKeys(locale);
    
    if (generateTemplate) {
      console.log('\n=== Template Oluşturma ===');
      const template = generateMissingKeysTemplate(locale);
      console.log(template);
    }
  } else {
    // Genel rapor
    printTranslationReport();
    
    if (detailed) {
      console.log('\n=== Detaylı Analiz ===');
      const report = validateTranslations();
      
      // Genel istatistikler
      const totalTranslations = report.totalKeys * report.localeStatuses.length;
      const completedTranslations = report.localeStatuses.reduce(
        (sum, status) => sum + (status.totalKeys - status.missingKeys.length),
        0
      );
      
      console.log(`\n📊 Genel İstatistikler:`);
      console.log(`- Toplam çeviri sayısı: ${totalTranslations}`);
      console.log(`- Tamamlanan çeviri: ${completedTranslations}`);
      console.log(`- Eksik çeviri: ${totalTranslations - completedTranslations}`);
      console.log(`- Başarı oranı: ${Math.round((completedTranslations / totalTranslations) * 100)}%`);
      
      // Kalite metrikleri
      const highQualityLocales = report.localeStatuses.filter(s => s.completionRate >= 95).length;
      const mediumQualityLocales = report.localeStatuses.filter(s => s.completionRate >= 80 && s.completionRate < 95).length;
      const lowQualityLocales = report.localeStatuses.filter(s => s.completionRate < 80).length;
      
      console.log(`\n🎯 Kalite Dağılımı:`);
      console.log(`- Yüksek kalite (≥95%): ${highQualityLocales} dil`);
      console.log(`- Orta kalite (80-94%): ${mediumQualityLocales} dil`);
      console.log(`- Düşük kalite (<80%): ${lowQualityLocales} dil`);
    }
  }
  
  // Çıkış kodu belirleme
  const report = validateTranslations();
  const hasIncompleteTranslations = report.localeStatuses.some(status => status.completionRate < 100);
  
  if (hasIncompleteTranslations) {
    console.log('\n⚠️  Bazı çeviriler eksik. Lütfen eksik anahtarları tamamlayın.');
    process.exit(1);
  } else {
    console.log('\n✅ Tüm çeviriler eksiksiz!');
    process.exit(0);
  }
}

// Hata yakalama
try {
  main();
} catch (error) {
  console.error('❌ Script çalışırken hata oluştu:', error.message);
  process.exit(1);
}