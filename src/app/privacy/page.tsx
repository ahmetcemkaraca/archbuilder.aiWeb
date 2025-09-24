'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { LanguageSelector } from '@/components/ui/language-selector';

export default function PrivacyPage() {
  const { t } = useI18n();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-bold text-xl">ArchBuilder.AI</span>
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {isMounted ? t('privacyTitle') : 'Gizlilik Politikası'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {isMounted ? t('privacyLastUpdated') : 'Son güncelleme: 24 Eylül 2025'}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 mb-8">
            <p className="text-blue-800 dark:text-blue-200 m-0">
              <strong>Önemli:</strong> Bu gizlilik politikası, ArchBuilder.AI'nın kişisel verilerinizi 
              nasıl topladığını, kullandığını ve koruduğunu açıklar. GDPR ve KVKK uyumludur.
            </p>
          </div>

          <h2>1. Veri Sorumlusu</h2>
          <p>
            Bu gizlilik politikası kapsamında veri sorumlusu ArchBuilder.AI'dır. 
            İletişim bilgileri: info@archbuilder.app
          </p>

          <h2>2. Toplanan Veriler</h2>
          <h3>2.1 Kişisel Bilgiler</h3>
          <ul>
            <li>Ad, soyad</li>
            <li>E-posta adresi</li>
            <li>Telefon numarası (opsiyonel)</li>
            <li>Şirket bilgileri (opsiyonel)</li>
          </ul>

          <h3>2.2 Teknik Veriler</h3>
          <ul>
            <li>IP adresi</li>
            <li>Tarayıcı bilgileri</li>
            <li>İşletim sistemi</li>
            <li>Cihaz bilgileri</li>
            <li>Kullanım istatistikleri</li>
          </ul>

          <h3>2.3 Proje Verileri</h3>
          <ul>
            <li>Yüklenen CAD dosyaları (DWG, DXF, IFC)</li>
            <li>PDF yönetmelikleri</li>
            <li>Revit proje dosyaları</li>
            <li>AI ile oluşturulan içerikler</li>
          </ul>

          <h2>3. Veri Kullanım Amaçları</h2>
          <ul>
            <li>Hizmet sağlama ve geliştirme</li>
            <li>Müşteri desteği</li>
            <li>Güvenlik ve dolandırıcılık önleme</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
            <li>Pazarlama (onayınız ile)</li>
          </ul>

          <h2>4. Veri Paylaşımı</h2>
          <p>
            Verilerinizi aşağıdaki durumlar dışında üçüncü taraflarla paylaşmayız:
          </p>
          <ul>
            <li>Yasal zorunluluklar</li>
            <li>Güvenlik tehditleri</li>
            <li>İş ortakları (sözleşmeli, sınırlı erişim)</li>
            <li>Açık rızanız ile</li>
          </ul>

          <h2>5. AI ve Veri İşleme</h2>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 mb-6">
            <h3 className="mt-0">Önemli AI Bilgilendirmesi</h3>
            <ul className="mb-0">
              <li>Proje verileriniz AI modelleri tarafından işlenir</li>
              <li>Google Vertex AI ve OpenAI GPT-4.1 kullanıyoruz</li>
              <li>Veriler model eğitiminde kullanılmaz</li>
              <li>İşleme sonrası geçici veriler silinir</li>
            </ul>
          </div>

          <h2>6. Veri Güvenliği</h2>
          <ul>
            <li>AES-256 şifreleme</li>
            <li>SSL/TLS bağlantılar</li>
            <li>Çok faktörlü kimlik doğrulama</li>
            <li>Düzenli güvenlik denetimleri</li>
            <li>Sıfır güven ağ mimarisi</li>
          </ul>

          <h2>7. Veri Saklama</h2>
          <ul>
            <li>Hesap verileri: Hesap silinene kadar</li>
            <li>Proje dosyaları: Plan süreniz boyunca + 6 ay</li>
            <li>Log kayıtları: 12 ay</li>
            <li>Pazarlama verileri: Onay çekilene kadar</li>
          </ul>

          <h2>8. Haklarınız (GDPR/KVKK)</h2>
          <ul>
            <li><strong>Erişim hakkı:</strong> Verilerinizi görme</li>
            <li><strong>Düzeltme hakkı:</strong> Yanlış verileri düzeltme</li>
            <li><strong>Silme hakkı:</strong> Verilerinizi silme</li>
            <li><strong>Taşınabilirlik:</strong> Verilerinizi alma</li>
            <li><strong>İtiraz hakkı:</strong> İşlemeye itiraz etme</li>
            <li><strong>Kısıtlama hakkı:</strong> İşlemeyi sınırlama</li>
          </ul>

          <h2>9. Çerezler</h2>
          <p>
            Websitemizde aşağıdaki çerez türlerini kullanıyoruz:
          </p>
          <ul>
            <li><strong>Zorunlu çerezler:</strong> Site işlevselliği için</li>
            <li><strong>Analitik çerezler:</strong> Google Analytics</li>
            <li><strong>Pazarlama çerezleri:</strong> Onayınız ile</li>
          </ul>

          <h2>10. Uluslararası Veri Transferi</h2>
          <p>
            Verileriniz aşağıdaki ülkelerdeki sunucularımızda işlenebilir:
          </p>
          <ul>
            <li>Türkiye (ana veri merkezi)</li>
            <li>Avrupa Birliği</li>
            <li>Amerika Birleşik Devletleri (Google Cloud, OpenAI)</li>
          </ul>

          <h2>11. İletişim</h2>
          <p>
            Gizlilik ile ilgili sorularınız için:
          </p>
          <ul>
            <li>E-posta: privacy@archbuilder.app</li>
            <li>Telefon: +90 (212) 555-0123</li>
            <li>Adres: Maslak, İstanbul, Türkiye</li>
          </ul>

          <h2>12. Değişiklikler</h2>
          <p>
            Bu politikayı değiştirme hakkımızı saklı tutarız. Önemli değişiklikler 
            e-posta ile bildirilir. Güncel versiyonu web sitemizden takip edebilirsiniz.
          </p>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mt-8">
            <h3>Hızlı Erişim</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                → Kullanım Şartları
              </Link>
              <Link href="/cookies" className="text-blue-600 hover:text-blue-700">
                → Çerez Politikası
              </Link>
              <Link href="/gdpr" className="text-blue-600 hover:text-blue-700">
                → GDPR Bilgileri
              </Link>
              <Link href="/contact" className="text-blue-600 hover:text-blue-700">
                → İletişim
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}