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

export function Features() {
  const { t } = useI18n();

  const features = [
    {
      icon: CpuChipIcon,
      title: 'AI Destekli Tasarım',
      description: 'Vertex AI Gemini-2.5-Flash-Lite ve GPT-4.1 ile güçlendirilmiş mimari proje oluşturma',
      details: [
        'Doğal dil işleme ile proje gereksinimleri analizi',
        'Akıllı alan planlama ve optimizasyon',
        'Revit API entegrasyonu ile otomatik element oluşturma'
      ]
    },
    {
      icon: DocumentArrowUpIcon,
      title: 'Çoklu Format Desteği',
      description: 'DWG, DXF, IFC, PDF yönetmelikleri ve mevcut Revit projelerini analiz edin',
      details: [
        'AutoCAD DWG/DXF dosyalarını içe aktarma',
        'IFC dosya formatı desteği',
        'PDF yönetmelik dökümanlarını AI ile işleme',
        'Mevcut .rvt dosyalarını tersine mühendislik'
      ]
    },
    {
      icon: Cog6ToothIcon,
      title: 'Adım Adım İş Akışı',
      description: 'Proje karmaşıklığına göre 5-50 adımlık detaylı iş planları',
      details: [
        'Sandbox ortamında güvenli test etme',
        'Her adımda kullanıcı onayı',
        'Gerçek zamanlı ilerleme takibi',
        'Hata durumunda geri alma seçenekleri'
      ]
    },
    {
      icon: CheckCircleIcon,
      title: 'Kalite Kontrol',
      description: 'AI çıktılarının doğruluğunu garanti eden çok katmanlı doğrulama',
      details: [
        'Yapay zeka hallüsinasyon kontrolü',
        'Güven skoru hesaplama',
        'Otomatik hata tespiti',
        'BIM model doğrulama'
      ]
    },
    {
      icon: LanguageIcon,
      title: 'Küresel Uyumluluk',
      description: 'Uluslararası yapı yönetmelikleri ve çok dil desteği',
      details: [
        'Türkiye, ABD, Avrupa yapı kodları',
        'Metrik ve Imperial ölçü sistemleri',
        'Çoklu dil arayüzü (TR, EN, ES, FR, DE)',
        'Bölgesel kustomizasyon'
      ]
    },
    {
      icon: LockClosedIcon,
      title: 'Güvenlik & Gizlilik',
      description: 'GDPR uyumlu, şifreli veri işleme ve güvenli cloud mimarisi',
      details: [
        'AES-256 şifreleme',
        'OAuth2 ve JWT token güvenliği',
        'STRIDE tehdit modelleme',
        'Multi-tenant izolasyon'
      ]
    }
  ];

  return (
    <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="block">{t('featuresTitle1')}</span>
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('featuresTitle2')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('featuresSubtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              {/* Feature Icon */}
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
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
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Tüm Özellikler ile Projelerinizi Dönüştürün
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              ArchBuilder.AI ile mimarlık projelerinizi AI destekli otomasyona taşıyın. 
              Ücretsiz deneme sürümü ile başlayın.
            </p>
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
              Ücretsiz Denemeyi Başlat
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}