'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { useI18n } from '@/lib/i18n';
import { LanguageSelector } from '@/components/ui/language-selector';

export default function PricingPage() {
  const { t } = useI18n();
  const [isMounted, setIsMounted] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const plans = [
    {
      name: isMounted ? t('starterPlanFull') : 'Başlangıç',
      price: isMounted ? t('priceTBD') : 'ÇOK YAKINDA',
      annualPrice: isMounted ? t('priceTBD') : 'ÇOK YAKINDA',
      period: '',
      description: isMounted ? t('starterDescFull') : 'Bireysel mimarlık projeleri için',
      features: [
        isMounted ? t('buildingFree') : '5 proje/ay',
        isMounted ? t('basicAIFeatures') : 'Temel AI özellikler',
        isMounted ? t('dwgDxfImport') : 'DWG/DXF içe aktarma',
        isMounted ? t('emailSupport') : 'E-posta desteği',
        isMounted ? t('revit2024Integration') : 'Revit 2024 entegrasyonu'
      ],
      limitations: [
        isMounted ? t('noPDFAnalysis') : 'PDF analizi yok',
        isMounted ? t('noIFCSupport') : 'IFC desteği yok',
        isMounted ? t('noAdvancedAI') : 'Gelişmiş AI yok'
      ],
      popular: false,
      cta: isMounted ? t('comingSoon') : 'Çok Yakında',
      ctaStyle: 'bg-gray-400 text-white cursor-not-allowed'
    },
    {
      name: isMounted ? t('professionalPlanFull') : 'Profesyonel',
      price: isMounted ? t('priceTBD') : 'ÇOK YAKINDA',
      annualPrice: isMounted ? t('priceTBD') : 'ÇOK YAKINDA',
      period: '',
      description: isMounted ? t('professionalDescFull') : 'Profesyonel mimarlar ve küçük ofisler için',
      features: [
        isMounted ? t('buildingFree') : 'Sınırsız proje',
        isMounted ? t('allAIFeatures') : 'Tüm AI özellikler',
        isMounted ? t('allFormats') : 'Tüm dosya formatları',
        isMounted ? t('prioritySupport') : 'Öncelikli destek',
        isMounted ? t('revitAllVersions') : 'Tüm Revit versiyonları',
        isMounted ? t('pdfRegulationAnalysis') : 'PDF yönetmelik analizi',
        isMounted ? t('multiUserSupport') : '5 kullanıcıya kadar',
        isMounted ? t('advancedAnalytics') : 'Gelişmiş analitik'
      ],
      limitations: [
        isMounted ? t('noCustomCodes') : 'Özel kodlar yok',
        isMounted ? t('noAPIAccess') : 'API erişimi yok'
      ],
      popular: true,
      cta: isMounted ? t('comingSoon') : 'Çok Yakında',
      ctaStyle: 'bg-gray-400 text-white cursor-not-allowed'
    },
    {
      name: isMounted ? t('enterprisePlanFull') : 'Kurumsal',
      price: isMounted ? t('priceTBD') : 'ÇOK YAKINDA',
      annualPrice: isMounted ? t('priceTBD') : 'ÇOK YAKINDA',
      period: '',
      description: isMounted ? t('enterpriseDescFull') : 'Büyük ofisler ve kurumlar için',
      features: [
        isMounted ? t('buildingFree') : 'Sınırsız proje',
        isMounted ? t('premiumAIModels') : 'Premium AI modeller',
        isMounted ? t('customIntegrations') : 'Özel entegrasyonlar',
        isMounted ? t('prioritySupport247') : '7/24 öncelikli destek',
        isMounted ? t('allRevitVersions') : 'Tüm Revit versiyonları',
        isMounted ? t('customBuildingCodes') : 'Özel yapı kodları',
        isMounted ? t('unlimitedUsers') : 'Sınırsız kullanıcı',
        isMounted ? t('advancedReporting') : 'Gelişmiş raporlama',
        isMounted ? t('whiteLabelSolutions') : 'Beyaz etiket çözümler',
        isMounted ? t('customCloudDeployment') : 'Özel bulut dağıtımı',
        isMounted ? t('slaGuarantee') : 'SLA garantisi'
      ],
      limitations: [],
      popular: false,
      cta: isMounted ? t('comingSoon') : 'Çok Yakında',
      ctaStyle: 'bg-gray-400 text-white cursor-not-allowed'
    }
  ];

  const features = [
    {
      name: isMounted ? t('aiProjectCreationFeature') : 'AI Proje Oluşturma',
      starter: true,
      professional: true,
      enterprise: true
    },
    {
      name: isMounted ? t('dwgDxfImportFeature') : 'DWG/DXF İçe Aktarma',
      starter: true,
      professional: true,
      enterprise: true
    },
    {
      name: isMounted ? t('ifcSupportFeature') : 'IFC Desteği',
      starter: false,
      professional: true,
      enterprise: true
    },
    {
      name: isMounted ? t('pdfAnalysisFeature') : 'PDF Yönetmelik Analizi',
      starter: false,
      professional: true,
      enterprise: true
    },
    {
      name: isMounted ? t('gpt4Feature') : 'GPT-4.1 Entegrasyonu',
      starter: false,
      professional: true,
      enterprise: true
    },
    {
      name: isMounted ? t('multiUserFeature') : 'Çoklu Kullanıcı',
      starter: false,
      professional: isMounted ? t('fivePeople') : '5 kişi',
      enterprise: isMounted ? t('unlimited') : 'Sınırsız'
    },
    {
      name: isMounted ? t('apiAccessFeature') : 'API Erişimi',
      starter: false,
      professional: false,
      enterprise: true
    },
    {
      name: isMounted ? t('customCodesFeature') : 'Özel Yapı Kodları',
      starter: false,
      professional: false,
      enterprise: true
    }
  ];

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
              {isMounted ? t('pricingTransparent') : 'Şeffaf ve'}
              <span className="block text-yellow-300">
                {isMounted ? t('pricingFair') : 'Adil Fiyatlandırma'}
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              {isMounted ? t('pricingSubtitleFull') : 'İhtiyaçlarınıza uygun planı seçin ve AI destekli mimarlık tasarımının gücünü keşfedin'}
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 bg-white/10 backdrop-blur-sm rounded-lg p-2 max-w-sm mx-auto">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-white' : 'text-blue-200'}`}>
                {isMounted ? t('monthlyBilling') : 'Aylık'}
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isAnnual ? 'bg-green-500' : 'bg-white/20'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className={`text-sm font-medium ${isAnnual ? 'text-white' : 'text-blue-200'}`}>
                {isMounted ? t('yearlyBilling') : 'Yıllık'}
                <span className="ml-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  {isMounted ? t('save20Percent') : '%20 tasarruf'}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 -mt-32 relative z-10">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl transition-all duration-300 border-2 ${
                plan.popular 
                  ? 'border-blue-500 scale-105 lg:scale-110 shadow-blue-500/25' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg">
                    <StarIcon className="w-4 h-4" />
                    <span>{isMounted ? t('mostPopularBadge') : 'En Popüler'}</span>
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {isAnnual ? plan.annualPrice : plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-lg text-gray-500 dark:text-gray-400 ml-1">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  {isAnnual && plan.price !== plan.annualPrice && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                      {isMounted ? t('monthlyPrice') : 'Aylık'}: {plan.price}
                    </div>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <SparklesIcon className="w-5 h-5 text-green-500 mr-2" />
                  {isMounted ? t('includedFeatures') : 'Dahil Özellikler'}
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
                    {isMounted ? t('notIncludedFeatures') : 'Dahil Olmayan'}
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
              <button 
                disabled={plan.cta === (isMounted ? t('comingSoon') : 'Çok Yakında')}
                className={`block w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 text-center ${plan.ctaStyle} ${
                  plan.popular ? 'shadow-lg' : ''
                }`}
              >
                {plan.cta}
              </button>

              {/* Free Trial Note */}
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">
                {isMounted ? t('freeTrialNote') : '14 gün ücretsiz deneme. Kredi kartı gerekmez.'}
              </p>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-16">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <h3 className="text-2xl font-semibold">
              {isMounted ? t('detailedComparison') : 'Detaylı Karşılaştırma'}
            </h3>
            <p className="text-blue-100 mt-1">
              {isMounted ? t('compareAllFeatures') : 'Tüm özellikleri karşılaştırın ve size en uygun planı seçin'}
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    {isMounted ? t('featureColumn') : 'Özellik'}
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    {isMounted ? t('starterColumn') : 'Başlangıç'}
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-900/20">
                    {isMounted ? t('professionalColumn') : 'Profesyonel'}
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-normal">
                      {isMounted ? t('recommended') : 'Önerilen'}
                    </div>
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    {isMounted ? t('enterpriseColumn') : 'Kurumsal'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index} className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                    index === 1 ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                  }`}>
                    <td className="py-4 px-6 text-gray-900 dark:text-white font-medium">
                      {feature.name}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof feature.starter === 'boolean' ? (
                        feature.starter ? (
                          <CheckIcon className="w-6 h-6 text-green-500 mx-auto" />
                        ) : (
                          <XMarkIcon className="w-6 h-6 text-red-500 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-900 dark:text-white font-medium">{feature.starter}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center bg-blue-50/30 dark:bg-blue-900/10">
                      {typeof feature.professional === 'boolean' ? (
                        feature.professional ? (
                          <CheckIcon className="w-6 h-6 text-green-500 mx-auto" />
                        ) : (
                          <XMarkIcon className="w-6 h-6 text-red-500 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-900 dark:text-white font-medium">{feature.professional}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof feature.enterprise === 'boolean' ? (
                        feature.enterprise ? (
                          <CheckIcon className="w-6 h-6 text-green-500 mx-auto" />
                        ) : (
                          <XMarkIcon className="w-6 h-6 text-red-500 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-900 dark:text-white font-medium">{feature.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            {isMounted ? t('faqPricingTitle') : 'Sık Sorulan Sorular'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">
                {isMounted ? t('faqFreeTrial') : 'Ücretsiz deneme var mı?'}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {isMounted ? t('faqFreeTrialAnswer') : 'Evet, tüm planlar için 14 gün ücretsiz deneme sunuyoruz. Kredi kartı bilgisi gerekmez.'}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">
                {isMounted ? t('faqPlanChange') : 'Planımı değiştirebilir miyim?'}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {isMounted ? t('faqPlanChangeAnswer') : 'Evet, istediğiniz zaman planınızı yükseltebilir veya düşürebilirsiniz. Değişiklik hemen geçerli olur.'}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">
                {isMounted ? t('faqDataSecurity') : 'Verilerim güvende mi?'}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {isMounted ? t('faqDataSecurityAnswer') : 'Evet, tüm verileriniz AES-256 şifreleme ile korunur ve GDPR/KVKK uyumlu olarak işlenir.'}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">
                {isMounted ? t('faqRefund') : 'İade politikanız nedir?'}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {isMounted ? t('faqRefundAnswer') : 'İlk 30 gün içinde memnun kalmazsanız tam iade garantisi sunuyoruz.'}
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              {isMounted ? t('needCustomSolution') : 'Özel Çözüm mü Gerekiyor?'}
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              {isMounted ? t('customSolutionDescription') : 'Kurumsal ihtiyaçlarınız için özel fiyatlandırma ve özelleştirmeler sunuyoruz.'}
            </p>
            <Link 
              href="/contact"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              {isMounted ? t('contactSales') : 'Satış Ekibi ile İletişime Geçin'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}