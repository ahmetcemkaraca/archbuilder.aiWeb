/**
 * Enhanced Pricing Page with Stripe Integration
 * Stripe entegrasyonlu gelişmiş fiyatlandırma sayfası
 */

import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import PricingSection from '@/components/sections/pricing-enhanced';
import { LanguageSelector } from '@/components/ui/language-selector';

export const metadata: Metadata = {
  title: 'Pricing - ArchBuilder.AI',
  description: 'Transparent and fair pricing for AI-powered architectural design. Choose the plan that fits your needs.',
  keywords: 'pricing, subscription, AI architecture, ArchBuilder.AI, plans',
  openGraph: {
    title: 'ArchBuilder.AI Pricing Plans',
    description: 'AI-powered architectural design with transparent pricing',
    type: 'website'
  }
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center space-x-2 text-blue-100 hover:text-white mb-8">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="font-bold text-2xl">ArchBuilder.AI</span>
            </Link>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Şeffaf ve
              <span className="block text-yellow-300">
                Adil Fiyatlandırma
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              İhtiyaçlarınıza uygun planı seçin ve AI destekli mimarlık tasarımının gücünü keşfedin
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-16 relative z-10">
        <PricingSection showComparison={true} />
      </div>

      {/* Additional Info Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Neden ArchBuilder.AI?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Hızlı Başlangıç
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Dakikalar içinde hesap oluşturun ve hemen AI destekli tasarıma başlayın.
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
                En yeni AI modelleri ve sürekli güncellenen özelliklerle üstün sonuçlar.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Güvenilir Destek
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Uzman ekibimiz her adımda yanınızda. 7/24 teknik destek.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Özel Çözüm mü Gerekiyor?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Kurumsal ihtiyaçlarınız için özel fiyatlandırma ve özelleştirmeler sunuyoruz.
            </p>
            <Link 
              href="/contact"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Satış Ekibi ile İletişime Geçin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}