'use client';

import { ArrowRightIcon, PlayIcon } from '@heroicons/react/24/outline';
import { SparklesIcon, RocketLaunchIcon } from '@heroicons/react/24/solid';
import { useI18n } from '@/lib/i18n';

export function CTA() {
  const { t } = useI18n();

  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 text-sm font-medium mb-8">
            <RocketLaunchIcon className="w-5 h-5" />
            <span>Mimarlığın Geleceği Burada</span>
          </div>

          {/* Main Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            <span className="block">{t('ctaTitle')}</span>
          </h2>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
            {t('ctaSubtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-lg">
              <SparklesIcon className="w-5 h-5" />
              <span>{t('freeTrial')}</span>
              <ArrowRightIcon className="w-5 h-5" />
            </button>
            
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center space-x-2">
              <PlayIcon className="w-5 h-5" />
              <span>{t('watchDemo')}</span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{t('freeTrial')}</div>
              <div className="text-blue-100">{t('freeTrial')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{t('noCredit')}</div>
              <div className="text-blue-100">{t('noCredit')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{t('support247')}</div>
              <div className="text-blue-100">{t('support247')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-20" viewBox="0 0 1200 120" fill="none">
          <path 
            d="M1200 120L0 120L0 0C400 80 800 80 1200 0V120Z" 
            className="fill-gray-50 dark:fill-gray-900"
          />
        </svg>
      </div>
    </section>
  );
}