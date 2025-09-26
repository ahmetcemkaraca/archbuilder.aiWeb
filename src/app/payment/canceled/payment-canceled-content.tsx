/**
 * Payment Canceled Content Component
 * Stripe ödeme iptal içerik komponenti
 */

'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { XCircleIcon, ArrowRightIcon, HomeIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';

export default function PaymentCanceledContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    // Analitik olayını izle (opsiyonel)
    if (typeof window !== 'undefined' && (window as unknown as { gtag: Function }).gtag) {
      (window as unknown as { gtag: Function }).gtag('event', 'begin_checkout_cancelled', {
        event_category: 'ecommerce',
        transaction_id: sessionId || 'unknown'
      });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Cancel Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-24 h-24 mb-8"
          >
            <XCircleIcon className="w-full h-full text-orange-500" />
          </motion.div>

          {/* Cancel Message */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Ödeme İptal Edildi
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8"
          >
            İşleminiz iptal edildi. Henüz herhangi bir ücret tahsil edilmedi.
          </motion.p>

          {/* Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-8 max-w-2xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Ne Oldu?
            </h3>
            
            <div className="grid gap-6 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-orange-600 text-sm">ℹ️</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    İşlem İptal Edildi
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Ödeme sayfasından ayrıldınız veya işlemi iptal ettiniz. Kartınızdan herhangi bir ücret çekilmedi.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm">🔄</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Tekrar Deneyebilirsiniz
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    İstediğiniz zaman geri dönüp satın alma işlemini tamamlayabilirsiniz.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-sm">💬</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Yardıma İhtiyacınız Var mı?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Destek ekibimiz size yardımcı olmaktan mutluluk duyar.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Popular Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 mb-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Popüler Seçenekler
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🆓</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Ücretsiz Deneme
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  14 gün ücretsiz kullanım hakkı
                </p>
                <Link
                  href="/signup"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Hemen Başlayın
                </Link>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border-2 border-blue-500">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">💎</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Profesyonel Plan
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  En popüler seçim - %20 indirim
                </p>
                <Link
                  href="/pricing"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Detayları Görün
                </Link>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🛒</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Market Ürünleri
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Tek seferlik satın alımlar
                </p>
                <Link
                  href="/marketplace"
                  className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  Markete Gidin
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <CreditCardIcon className="w-5 h-5 mr-2" />
              <span>Tekrar Dene</span>
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg"
            >
              <span>Yardım Al</span>
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 shadow-lg"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              <span>Ana Sayfa</span>
            </Link>
          </motion.div>

          {/* Support Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800"
          >
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              <strong>Teknik sorun mu yaşıyorsunuz?</strong> Destek ekibimizle{' '}
              <Link href="/contact" className="underline hover:no-underline">
                iletişime geçin
              </Link>
              {' '}ve size yardımcı olalım. Genellikle 1 saat içinde yanıt veriyoruz.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}