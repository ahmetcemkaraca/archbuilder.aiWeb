'use client';

import { useState, useEffect } from 'react';
import { ArrowRightIcon, PlayIcon } from '@heroicons/react/24/outline';
import { SparklesIcon, RocketLaunchIcon } from '@heroicons/react/24/solid';
import { useI18n } from '@/lib/i18n';
import { AnimatedSection, StaggeredList, StaggeredItem } from '@/components/ui/animated-section';

export function CTA() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
          <AnimatedSection animation="fadeInUp" delay={0.2}>
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 text-sm font-medium mb-8">
              <RocketLaunchIcon className="w-5 h-5" />
              <span>{mounted ? t('futureMarchitecture') : 'Mimarlığın Geleceği Burada'}</span>
            </div>
          </AnimatedSection>

          {/* Main Headline */}
          <AnimatedSection animation="fadeInUp" delay={0.4}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              <span className="block">{mounted ? t('ctaTitle') : 'AI ile Projelerinizi Dönüştürmeye Hazır mısınız?'}</span>
            </h2>
          </AnimatedSection>

          {/* Subtitle */}
          <AnimatedSection animation="fadeInUp" delay={0.6}>
            <p className="text-xl sm:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
              {mounted ? t('ctaSubtitle') : 'ArchBuilder.AI ile mimarlık sürecinizi hızlandırın, kaliteyi artırın ve rekabette önde olun. Bugün ücretsiz denemeye başlayın.'}
            </p>
          </AnimatedSection>

          {/* CTA Buttons */}
          <AnimatedSection animation="fadeInUp" delay={0.8} className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <a 
              href="/signup"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
            >
              <SparklesIcon className="w-5 h-5" />
              <span>{mounted ? t('freeTrial') : '14 Gün Ücretsiz Deneme'}</span>
              <ArrowRightIcon className="w-5 h-5" />
            </a>
            
            <a 
              href="/demo"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center space-x-2"
            >
              <PlayIcon className="w-5 h-5" />
              <span>{mounted ? t('watchDemo') : 'Demo İzleyin'}</span>
            </a>
          </AnimatedSection>

          {/* Trust Indicators */}
          <StaggeredList className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <StaggeredItem className="text-center">
              <div className="text-3xl font-bold mb-2">{mounted ? t('freeDays') : '14 Gün'}</div>
              <div className="text-blue-100">{mounted ? t('freeTrialLabel') : 'Ücretsiz Deneme'}</div>
            </StaggeredItem>
            <StaggeredItem className="text-center">
              <div className="text-3xl font-bold mb-2">{mounted ? t('noCreditCard') : 'Kredi Kartı'}</div>
              <div className="text-blue-100">{mounted ? t('notRequired') : 'Gerekmiyor'}</div>
            </StaggeredItem>
            <StaggeredItem className="text-center">
              <div className="text-3xl font-bold mb-2">{mounted ? t('supportAvailable') : '7/24'}</div>
              <div className="text-blue-100">{mounted ? t('supportLabel') : 'Destek'}</div>
            </StaggeredItem>
          </StaggeredList>
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