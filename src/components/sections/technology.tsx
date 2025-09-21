'use client';

import { CloudIcon, CpuChipIcon, ShieldCheckIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { useI18n } from '@/lib/i18n';

export function Technology() {
  const { t } = useI18n();
  const techStack = [
    {
      category: 'Desktop Uygulaması',
      icon: '💻',
      technologies: [
        { name: 'Windows WPF', description: '.NET Framework ile Apple-vari tasarım' },
        { name: 'C# .NET', description: 'Revit API entegrasyonu' },
        { name: 'Revit 2026', description: 'BIM modelleme ve otomasyonu' }
      ],
      color: 'from-blue-500 to-blue-600'
    },
    {
      category: 'Cloud AI Platformu',
      icon: '☁️',
      technologies: [
        { name: 'Python FastAPI', description: 'Yüksek performanslı API servisleri' },
        { name: 'Vertex AI Gemini-2.5', description: 'Google\'ın ileri AI modeli' },
        { name: 'GitHub Models GPT-4.1', description: 'OpenAI\'ın en güçlü modeli' }
      ],
      color: 'from-purple-500 to-purple-600'
    },
    {
      category: 'Veri İşleme',
      icon: '📊',
      technologies: [
        { name: 'PostgreSQL', description: 'Güvenilir ilişkisel veritabanı' },
        { name: 'Redis', description: 'Yüksek hızlı önbellekleme' },
        { name: 'Vector Embeddings', description: 'AI tabanlı doküman arama' }
      ],
      color: 'from-green-500 to-green-600'
    },
    {
      category: 'Güvenlik & Altyapı',
      icon: '🔒',
      technologies: [
        { name: 'Docker & Kubernetes', description: 'Ölçeklenebilir konteynerizasyon' },
        { name: 'OAuth2 & JWT', description: 'Güvenli kimlik doğrulama' },
        { name: 'AES-256 Şifreleme', description: 'Veri güvenliği garantisi' }
      ],
      color: 'from-red-500 to-red-600'
    }
  ];

  const aiModels = [
    {
      name: 'Vertex AI Gemini-2.5-Flash-Lite',
      provider: 'Google Cloud',
      use_case: 'Hızlı prototipleme ve iteratif tasarım',
      features: ['Multimodal girdi', 'Düşük gecikme', 'Yüksek verimlilik'],
      performance: '< 2 saniye yanıt süresi'
    },
    {
      name: 'GitHub Models GPT-4.1',
      provider: 'OpenAI',
      use_case: 'Karmaşık mimari problemler',
      features: ['Derinlemesine analiz', 'Yaratıcı çözümler', 'Kod üretimi'],
      performance: '5-15 saniye yanıt süresi'
    }
  ];

  return (
    <section id="technology" className="py-24 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="block">{t('technologyTitle1')}</span>
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('technologyTitle2')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('technologySubtitle')}
          </p>
        </div>

        {/* Technology Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {techStack.map((stack, index) => (
            <div 
              key={index}
              className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
            >
              {/* Category Header */}
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">{stack.icon}</div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {stack.category}
                </h3>
              </div>

              {/* Technologies */}
              <div className="space-y-4">
                {stack.technologies.map((tech, techIndex) => (
                  <div key={techIndex} className="text-center">
                    <div className={`inline-block bg-gradient-to-r ${stack.color} text-white px-3 py-1 rounded-full text-sm font-medium mb-2`}>
                      {tech.name}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {tech.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* AI Models Showcase */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-8 mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Dual AI Engine Sistemi
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              İki farklı AI modeli kullanarak farklı senaryolar için optimize edilmiş performans
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {aiModels.map((model, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <CpuChipIcon className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {model.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {model.provider}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    <strong>Kullanım Alanı:</strong> {model.use_case}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    <strong>Performans:</strong> {model.performance}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Temel Özellikler:
                  </p>
                  <ul className="space-y-1">
                    {model.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture Overview */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Hibrit Desktop-Cloud Mimarisi
          </h3>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🖥️</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Windows Desktop App
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Yerel dosya yönetimi, Revit entegrasyonu, Apple-vari kullanıcı deneyimi
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CloudIcon className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Cloud AI Processing
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Python FastAPI, AI model orkestrasyonu, doküman işleme, RAG sistemi
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShieldCheckIcon className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Güvenli Veri İşleme
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Şifreli iletişim, GDPR uyumluluğu, multi-tenant izolasyon
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}