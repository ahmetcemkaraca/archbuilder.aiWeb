/**
 * Marketplace Page
 * Market yeri ana sayfası
 */

import React from 'react';
import { Metadata } from 'next';
import Marketplace from '@/components/sections/marketplace';

export const metadata: Metadata = {
  title: 'Marketplace - ArchBuilder.AI',
  description: 'AI kredileri, premium destek paketleri ve ek özellikler. Projelerinizi geliştirmek için gereken tüm ürünler.',
  keywords: 'AI kredileri, marketplace, premium destek, ArchBuilder.AI',
  openGraph: {
    title: 'ArchBuilder.AI Marketplace',
    description: 'AI kredileri ve premium özellikler',
    type: 'website'
  }
};

const MarketplacePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              ArchBuilder.AI Marketplace
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Projelerinizi bir sonraki seviyeye taşıyacak AI kredileri, premium destek paketleri ve özel özellikler.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Marketplace showHeader={false} />
      </div>

      {/* Featured Benefits Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Neden ArchBuilder.AI Marketplace?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Anında Aktivasyon
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Satın aldığınız krediler ve özellikler anında hesabınıza eklenir.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Premium Kalite
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                En yeni AI modelleri ve premium özelliklerle üstün kalitede sonuçlar.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Güvenli Ödeme
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Stripe ile güvenli ödeme altyapısı ve 256-bit SSL şifreleme.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Sık Sorulan Sorular
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                AI kredileri nasıl kullanılır?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Satın aldığınız AI kredileri otomatik olarak hesabınıza eklenir ve AI layout oluşturma işlemlerinde kullanılır. Her layout oluşturma işlemi için 1 kredi harcanır.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Premium destek paketinde neler var?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Premium destek paketinde öncelikli e-posta desteği, video görüşme imkanı, özel eğitim materyalleri ve proje danışmanlığı bulunur.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                İade politikanız nedir?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Kullanılmamış krediler için 30 gün içinde tam iade yapılır. Kullanılmış krediler için kısmi iade uygulanabilir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;