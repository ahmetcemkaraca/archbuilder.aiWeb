'use client';

import { 
  CpuChipIcon, 
  DocumentArrowUpIcon, 
  Cog6ToothIcon,
  CheckCircleIcon,
  LanguageIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import { useI18n } from '@/lib/i18n';
import { AnimatedSection } from '@/components/ui/animated-section';

export function Features() {
  const { t } = useI18n();

  const features = [
    {
      icon: CpuChipIcon,
      title: t('aiDesignTitle'),
      description: t('aiDesignDesc'),
      details: [
        t('aiDesignDetails1'),
        t('aiDesignDetails2'),
        t('aiDesignDetails3')
      ]
    },
    {
      icon: DocumentArrowUpIcon,
      title: t('multiFormatTitle'),
      description: t('multiFormatDesc'),
      details: [
        t('multiFormatDetails1'),
        t('multiFormatDetails2'),
        t('multiFormatDetails3'),
        t('multiFormatDetails4')
      ]
    },
    {
      icon: Cog6ToothIcon,
      title: t('workflowTitle'),
      description: t('workflowDesc'),
      details: [
        t('workflowDetails1'),
        t('workflowDetails2'),
        t('workflowDetails3'),
        t('workflowDetails4')
      ]
    },
    {
      icon: CheckCircleIcon,
      title: t('qualityControlTitle'),
      description: t('qualityControlDesc'),
      details: [
        t('qualityControlDetails1'),
        t('qualityControlDetails2'),
        t('qualityControlDetails3'),
        t('qualityControlDetails4')
      ]
    },
    {
      icon: LanguageIcon,
      title: t('globalCompatibilityTitle'),
      description: t('globalCompatibilityDesc'),
      details: [
        t('globalCompatibilityDetails1'),
        t('globalCompatibilityDetails2'),
        t('globalCompatibilityDetails3'),
        t('globalCompatibilityDetails4')
      ]
    },
    {
      icon: LockClosedIcon,
      title: t('securityPrivacyTitle'),
      description: t('securityPrivacyDesc'),
      details: [
        t('securityPrivacyDetails1'),
        t('securityPrivacyDetails2'),
        t('securityPrivacyDetails3'),
        t('securityPrivacyDetails4')
      ]
    }
  ];

  return (
    <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16 animate-on-scroll-fade-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="block">{t('featuresTitle1')}</span>
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('featuresTitle2')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('featuresSubtitle')}
          </p>
        </AnimatedSection>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <AnimatedSection 
              key={index}
              className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 animate-on-scroll-fade-up`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Feature Icon */}
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4 animate-scale-on-hover">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
              </div>

              {/* Feature Description */}
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {feature.description}
              </p>

              {/* Feature Details */}
              <ul className="space-y-3">
                {feature.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {detail}
                    </span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              {t('featuresCTA')}
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              {t('featuresCTADesc')}
            </p>
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
              {t('startFreeTrial')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}