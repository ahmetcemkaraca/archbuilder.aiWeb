'use client';

import { CheckIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

export function Pricing() {
  const plans = [
    {
      name: 'Başlangıç',
      price: '₺299',
      period: '/ay',
      description: 'Küçük mimarlık ofisleri ve bireysel mimarlar için',
      features: [
        '10 proje oluşturma/ay',
        '5 GB dosya depolama',
        'Temel AI özellikler',
        'DWG/DXF içe aktarma',
        'Email destek',
        'Revit 2024+ entegrasyonu'
      ],
      limitations: [
        'PDF yönetmelik analizi yok',
        'IFC desteği yok',
        'Gelişmiş AI modelleri yok'
      ],
      popular: false,
      cta: 'Başlangıç Planını Seç',
      ctaStyle: 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
    },
    {
      name: 'Profesyonel',
      price: '₺799',
      period: '/ay',
      description: 'Orta ölçekli mimarlık firmaları için optimize edilmiş',
      features: [
        '50 proje oluşturma/ay',
        '50 GB dosya depolama',
        'Tüm AI özellikler (GPT-4.1 + Gemini)',
        'DWG/DXF/IFC/PDF tüm formatlar',
        'Öncelikli destek',
        'Revit 2022+ tüm sürümler',
        'PDF yönetmelik analizi',
        'Çoklu kullanıcı desteği (5 kişi)',
        'Gelişmiş proje analytics'
      ],
      limitations: [
        'Özel yapı kodları ekleme yok',
        'API erişimi yok'
      ],
      popular: true,
      cta: 'Profesyonel Planını Seç',
      ctaStyle: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
    },
    {
      name: 'Kurumsal',
      price: '₺1.999',
      period: '/ay',
      description: 'Büyük mimarlık firmaları ve şirketler için',
      features: [
        'Sınırsız proje oluşturma',
        '500 GB dosya depolama',
        'Premium AI modeller + özel fintuning',
        'Tüm dosya formatları + özel entegrasyonlar',
        '7/24 öncelikli destek',
        'Tüm Revit sürümleri + API erişimi',
        'Özel yapı kodları ve yönetmelikler',
        'Sınırsız kullanıcı',
        'Gelişmiş analytics + raporlama',
        'White-label çözümler',
        'Özel cloud deployment',
        'SLA garantisi (%99.9 uptime)'
      ],
      limitations: [],
      popular: false,
      cta: 'Kurumsal Planını Seç',
      ctaStyle: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
    }
  ];

  const features = [
    {
      name: 'AI Proje Oluşturma',
      starter: true,
      professional: true,
      enterprise: true
    },
    {
      name: 'DWG/DXF İçe Aktarma',
      starter: true,
      professional: true,
      enterprise: true
    },
    {
      name: 'IFC Format Desteği',
      starter: false,
      professional: true,
      enterprise: true
    },
    {
      name: 'PDF Yönetmelik Analizi',
      starter: false,
      professional: true,
      enterprise: true
    },
    {
      name: 'GPT-4.1 AI Model',
      starter: false,
      professional: true,
      enterprise: true
    },
    {
      name: 'Çoklu Kullanıcı',
      starter: false,
      professional: '5 kişi',
      enterprise: 'Sınırsız'
    },
    {
      name: 'API Erişimi',
      starter: false,
      professional: false,
      enterprise: true
    },
    {
      name: 'Özel Yapı Kodları',
      starter: false,
      professional: false,
      enterprise: true
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="block">Şeffaf ve</span>
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Adil Fiyatlandırma
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            İhtiyaçlarınıza uygun planı seçin. Tüm planlar 14 gün ücretsiz deneme ile gelir.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg transition-all duration-300 border-2 ${
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
                    <span>En Popüler</span>
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
                  Dahil Olanlar
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
                    Dahil Olmayanlar
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
              <button className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${plan.ctaStyle}`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Detaylı Özellik Karşılaştırması
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-600">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Özellik
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Başlangıç
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Profesyonel
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Kurumsal
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
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Sık Sorulan Sorular
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Ücretsiz deneme süresince hangi özellikler kullanılabilir?
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                14 günlük ücretsiz deneme süresince seçtiğiniz planın tüm özelliklerini 
                sınırsız olarak kullanabilirsiniz.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Plan değişikliği nasıl yapılır?
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Hesap panelinden istediğiniz zaman plan yükseltme veya düşürme 
                işlemi yapabilirsiniz. Değişiklik hemen etkili olur.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}