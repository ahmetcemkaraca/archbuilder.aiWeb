'use client';

import { ArrowRightIcon, PlayIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { useI18n } from '@/lib/i18n';
import { AnimatedSection, StaggeredList, StaggeredItem } from '@/components/ui/animated-section';

export function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Badge */}
          <AnimatedSection 
            animation="fadeInUp"
            delay={0.2}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 border border-blue-200 dark:border-blue-700 rounded-full px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 mb-8"
          >
            <SparklesIcon className="w-4 h-4" />
            <span>{t('aiRevolution')}</span>
          </AnimatedSection>

          {/* Main heading */}
          <AnimatedSection 
            animation="fadeInUp"
            delay={0.4}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight"
          >
            <div className="animate-slide-in-left">
              {t('heroTitle1')}
            </div>
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-scale-in">
              {t('heroTitle2')}
            </div>
            <div className="animate-slide-in-right">
              {t('heroTitle3')}
            </div>
          </AnimatedSection>

          {/* Subtitle */}
          <AnimatedSection 
            animation="fadeInUp"
            delay={0.6}
            className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            {t('heroSubtitle')}
          </AnimatedSection>

          {/* CTA Buttons */}
          <AnimatedSection 
            animation="fadeInUp"
            delay={0.8}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16"
          >
            <a 
              href="/signup"
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center space-x-2 shadow-lg"
            >
              <span>{t('startFree')}</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </AnimatedSection>

          {/* Features preview */}
          <StaggeredList className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto" staggerDelay={0.15}>
            <StaggeredItem>
              <div className="text-center group cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <span className="text-2xl">🏗️</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {t('heroFeature1Title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {t('heroFeature1Description')}
                </p>
              </div>
            </StaggeredItem>

            <StaggeredItem>
              <div className="text-center group cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <span className="text-2xl">📐</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {t('heroFeature2Title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {t('heroFeature2Description')}
                </p>
              </div>
            </StaggeredItem>

            <StaggeredItem>
              <div className="text-center group cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                  {t('heroFeature3Title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {t('heroFeature3Description')}
                </p>
              </div>
            </StaggeredItem>
          </StaggeredList>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-gray-300 dark:border-gray-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-300 dark:bg-gray-600 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
}