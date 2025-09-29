/**
 * Enhanced Pricing Page with Multi-Currency Support
 * Çok para birimli gelişmiş fiyatlandırma sayfası
 */

'use client';

import MultiCurrencyPricingSection from '@/components/sections/multi-currency-pricing';
import { LanguageSelector } from '@/components/ui/language-selector';

export default function EnhancedPricingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            ArchBuilder.AI Fiyatlandırma
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            İhtiyacınıza uygun planı seçin. Tüm planlar 14 gün ücretsiz deneme içerir.
                        </p>
                    </div>
                    <LanguageSelector />
                </div>

                {/* Pricing Section */}
                <MultiCurrencyPricingSection />

                {/* FAQ Section */}
                <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
                        Sıkça Sorulan Sorular
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Ücretsiz deneme süresi var mı?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Evet, tüm planlarımız 14 gün ücretsiz deneme süresi sunar. Kredi kartı bilgisi gerekmez.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Planımı değiştirebilir miyim?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Evet, istediğiniz zaman planınızı yükseltebilir veya düşürebilirsiniz. Değişiklik hemen geçerli olur.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                İptal etme politikası nedir?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal sonrası mevcut dönem sonuna kadar hizmet alabilirsiniz.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Hangi ödeme yöntemlerini kabul ediyorsunuz?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Visa, MasterCard, American Express ve diğer büyük kredi kartlarını kabul ediyoruz.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Vergi dahil mi?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Gösterilen fiyatlar vergi hariçtir. Bulunduğunuz ülkeye göre geçerli KDV oranı uygulanır.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Kurumsal çözümler var mı?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Evet, kurumsal müşteriler için özel fiyatlandırma ve ek özellikler sunuyoruz. İletişime geçin.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
