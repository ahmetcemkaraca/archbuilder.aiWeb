'use client';

import { CheckIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { useI18n } from '@/lib/i18n';
import { AnimatedSection, StaggeredList, StaggeredItem } from '@/components/ui/animated-section';

export function Pricing() {
  const { t } = useI18n();
  const plans = [
    {
      name: t('starterPlanFull'),
      price: t('priceTBD'),
      period: '',
      description: t('starterDescFull'),
      features: [
        t('buildingFree'),
        t('basicAIFeatures'),
        t('dwgDxfImport'),
        t('emailSupport'),
        t('revit2024Integration')
      ],
      limitations: [
        t('noPDFAnalysis'),
        t('noIFCSupport'),
        t('noAdvancedAI')
      ],
      popular: false,
      cta: t('comingSoon'),
      ctaStyle: 'bg-gray-400 text-white cursor-not-allowed'
    },
    {
      name: t('professionalPlanFull'),
      price: t('priceTBD'),
      period: '',
      description: t('professionalDescFull'),
      features: [
        t('buildingFree'),
        t('allAIFeatures'),
        t('allFormats'),
        t('prioritySupport'),
        t('revitAllVersions'),
        t('pdfRegulationAnalysis'),
        t('multiUserSupport'),
        t('advancedAnalytics')
      ],
      limitations: [
        t('noCustomCodes'),
        t('noAPIAccess')
      ],
      popular: true,
      cta: t('comingSoon'),
      ctaStyle: 'bg-gray-400 text-white cursor-not-allowed'
    },
    {
      name: t('enterprisePlanFull'),
      price: t('priceTBD'),
      period: '',
      description: t('enterpriseDescFull'),
      features: [
        t('buildingFree'),
        t('premiumAIModels'),
        t('customIntegrations'),
        t('prioritySupport247'),
        t('allRevitVersions'),
        t('customBuildingCodes'),
        t('unlimitedUsers'),
        t('advancedReporting'),
        t('whiteLabelSolutions'),
        t('customCloudDeployment'),
        t('slaGuarantee')
      ],
      limitations: [],
      popular: false,
      cta: t('comingSoon'),
      ctaStyle: 'bg-gray-400 text-white cursor-not-allowed'
    }
  ];

  const features = [
    {
      name: t('aiProjectCreationFeature'),
      starter: true,
      professional: true,
      enterprise: true
    },
    {
      name: t('dwgDxfImportFeature'),
      starter: true,
      professional: true,
      enterprise: true
    },
    {
      name: t('ifcSupportFeature'),
      starter: false,
      professional: true,
      enterprise: true
    },
    {
      name: t('pdfAnalysisFeature'),
      starter: false,
      professional: true,
      enterprise: true
    },
    {
      name: t('gpt4Feature'),
      starter: false,
      professional: true,
      enterprise: true
    },
    {
      name: t('multiUserFeature'),
      starter: false,
      professional: t('fivePeople'),
      enterprise: t('unlimited')
    },
    {
      name: t('apiAccessFeature'),
      starter: false,
      professional: false,
      enterprise: true
    },
    {
      name: t('customCodesFeature'),
      starter: false,
      professional: false,
      enterprise: true
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="block">{t('pricingTransparent')}</span>
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('pricingFair')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('pricingSubtitleFull')}
          </p>
        </AnimatedSection>

        {/* Pricing Cards */}
        <StaggeredList className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <StaggeredItem 
              key={index}
              className={`relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg transition-all duration-300 border-2 hover:scale-105 ${
                plan.popular 
                  ? 'border-blue-500 scale-105 lg:scale-110' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <StarIcon className="w-4 h-4" />
                    <span>{t('mostPopularBadge')}</span>
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-lg text-gray-500 dark:text-gray-400">
                    {plan.period}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <SparklesIcon className="w-5 h-5 text-green-500 mr-2" />
                  {t('includedFeatures')}
                </h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Limitations */}
              {plan.limitations.length > 0 && (
                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <XMarkIcon className="w-5 h-5 text-red-500 mr-2" />
                    {t('notIncludedFeatures')}
                  </h4>
                  <ul className="space-y-2">
                    {plan.limitations.map((limitation, limitationIndex) => (
                      <li key={limitationIndex} className="flex items-start">
                        <XMarkIcon className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          {limitation}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA Button */}
              <a 
                href={plan.cta === t('comingSoon') ? '#' : `/pricing/${plan.name.toLowerCase()}`}
                className={`block w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 text-center ${plan.ctaStyle}`}
              >
                {plan.cta}
              </a>
            </StaggeredItem>
          ))}
        </StaggeredList>

        {/* Feature Comparison Table */}
        <AnimatedSection animation="fadeInUp" className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('detailedComparison')}
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-600">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    {t('featureColumn')}
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    {t('starterColumn')}
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    {t('professionalColumn')}
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    {t('enterpriseColumn')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-4 px-6 text-gray-900 dark:text-white">
                      {feature.name}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof feature.starter === 'boolean' ? (
                        feature.starter ? (
                          <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <XMarkIcon className="w-5 h-5 text-red-500 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-900 dark:text-white">{feature.starter}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof feature.professional === 'boolean' ? (
                        feature.professional ? (
                          <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <XMarkIcon className="w-5 h-5 text-red-500 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-900 dark:text-white">{feature.professional}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof feature.enterprise === 'boolean' ? (
                        feature.enterprise ? (
                          <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <XMarkIcon className="w-5 h-5 text-red-500 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-900 dark:text-white">{feature.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedSection>

        {/* FAQ Section */}
        <AnimatedSection animation="fadeInUp" delay={0.2} className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            {t('faqPricingTitle')}
          </h3>
          <StaggeredList className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <StaggeredItem className="text-left">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {t('faqFreeTrial')}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {t('faqFreeTrialAnswer')}
              </p>
            </StaggeredItem>
            <StaggeredItem className="text-left">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {t('faqPlanChange')}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {t('faqPlanChangeAnswer')}
              </p>
            </StaggeredItem>
          </StaggeredList>
        </AnimatedSection>
      </div>
    </section>
  );
}