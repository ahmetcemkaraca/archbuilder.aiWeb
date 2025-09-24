'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { LanguageSelector } from '@/components/ui/language-selector';

export default function TermsPage() {
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
            {isMounted ? t('termsTitle') : 'Kullanım Şartları'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {isMounted ? t('termsLastUpdated') : 'Son güncelleme: 24 Eylül 2025'}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 mb-8">
            <p className="text-blue-800 dark:text-blue-200 m-0">
              <strong>Önemli:</strong> Bu sözleşme, ArchBuilder.AI hizmetlerini kullanırken 
              uymanız gereken şart ve koşulları belirler. Lütfen dikkatlice okuyun.
            </p>
          </div>

          <h2>1. Sözleşmenin Konusu</h2>
          <p>
            Bu sözleşme, ArchBuilder.AI yapay zeka destekli mimarlık tasarım platformunun 
            kullanım şartlarını düzenler. Platform, kullanıcıların mimarlık projelerini 
            AI teknolojisi ile hızlandırmasını sağlar.
          </p>

          <h2>2. Tanımlar</h2>
          <ul>
            <li><strong>Platform:</strong> ArchBuilder.AI web ve desktop uygulaması</li>
            <li><strong>Kullanıcı:</strong> Platformu kullanan kişi veya kurum</li>
            <li><strong>İçerik:</strong> Platform üzerinden yüklenen/oluşturulan dosyalar</li>
            <li><strong>AI Hizmetleri:</strong> GPT-4.1 ve Vertex AI destekli özellikler</li>
          </ul>

          <h2>3. Hizmet Kapsamı</h2>
          <h3>3.1 Temel Hizmetler</h3>
          <ul>
            <li>AI destekli mimari proje oluşturma</li>
            <li>DWG, DXF, IFC, PDF dosya işleme</li>
            <li>Revit entegrasyonu</li>
            <li>Proje yönetimi araçları</li>
          </ul>

          <h3>3.2 Hizmet Sınırlamaları</h3>
          <ul>
            <li>Plan bazlı kullanım kotaları</li>
            <li>Dosya boyutu sınırları</li>
            <li>API çağrı limitleri</li>
            <li>Eş zamanlı kullanıcı sayısı</li>
          </ul>

          <h2>4. Kullanıcı Sorumlulukları</h2>
          <h3>4.1 Hesap Güvenliği</h3>
          <ul>
            <li>Güçlü şifre kullanma</li>
            <li>Hesap bilgilerini gizli tutma</li>
            <li>Şüpheli aktiviteleri bildirme</li>
            <li>İki faktörlü kimlik doğrulama</li>
          </ul>

          <h3>4.2 İçerik Sorumluluğu</h3>
          <ul>
            <li>Yüklenen dosyaların yasal olması</li>
            <li>Telif hakkı ihlali yapmama</li>
            <li>Kişisel verileri korama</li>
            <li>Profesyonel kullanım</li>
          </ul>

          <h2>5. Yasak Kullanımlar</h2>
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 mb-6">
            <h3 className="mt-0">Kesinlikle Yasak</h3>
            <ul className="mb-0">
              <li>Illegal proje tasarımları</li>
              <li>Telif hakkı ihlali</li>
              <li>Zararlı yazılım yükleme</li>
              <li>Sistemi hacklemek</li>
              <li>Başkalarının hesaplarını kullanma</li>
              <li>Ticari olmayan amaçlı kullanım (kurumsal planlarda)</li>
            </ul>
          </div>

          <h2>6. Fikri Mülkiyet</h2>
          <h3>6.1 Platform Hakları</h3>
          <ul>
            <li>ArchBuilder.AI markası korunmaktadır</li>
            <li>Yazılım kodları özel mülkiyettir</li>
            <li>AI model çıktıları platform tarafından lisanslanır</li>
          </ul>

          <h3>6.2 Kullanıcı İçeriği</h3>
          <ul>
            <li>Yüklediğiniz dosyalar size aittir</li>
            <li>AI çıktıları üzerinde kullanım hakkınız vardır</li>
            <li>Platform, hizmet sunumu için sınırlı kullanım hakkına sahiptir</li>
          </ul>

          <h2>7. AI Kullanımı ve Sınırlamalar</h2>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 mb-6">
            <h3 className="mt-0">AI Hizmetleri Hakkında</h3>
            <ul className="mb-0">
              <li>AI çıktıları profesyonel kontrolden geçmelidir</li>
              <li>Yapısal hesaplamalar mühendis onayı gerektirir</li>
              <li>Yerel yönetmelikler kontrol edilmelidir</li>
              <li>AI önerileri kesin değil, öneri niteliğindedir</li>
            </ul>
          </div>

          <h2>8. Ödeme ve Faturalandırma</h2>
          <h3>8.1 Ödeme Şartları</h3>
          <ul>
            <li>Aylık/yıllık abonelik sistemi</li>
            <li>Otomatik yenileme (iptal edilebilir)</li>
            <li>KDV dahil fiyatlandırma</li>
            <li>Kredi kartı veya banka transferi</li>
          </ul>

          <h3>8.2 İptal ve İade</h3>
          <ul>
            <li>14 gün ücretsiz deneme</li>
            <li>İptal: Hesap panelinden</li>
            <li>İade: Sadece teknik sorunlarda</li>
            <li>Kısmi iadeler için destek ekibi ile iletişim</li>
          </ul>

          <h2>9. Gizlilik ve Veri Koruması</h2>
          <p>
            Kişisel verileriniz <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
            Gizlilik Politikası</Link> kapsamında korunur. GDPR ve KVKK uyumludur.
          </p>

          <h2>10. Hizmet Seviyesi (SLA)</h2>
          <h3>10.1 Uptime Garantileri</h3>
          <ul>
            <li>Başlangıç: %95 uptime</li>
            <li>Profesyonel: %99 uptime</li>
            <li>Kurumsal: %99.9 uptime</li>
          </ul>

          <h3>10.2 Destek Seviyeleri</h3>
          <ul>
            <li>Başlangıç: E-posta (48 saat)</li>
            <li>Profesyonel: E-posta + Chat (24 saat)</li>
            <li>Kurumsal: 7/24 destek + telefon</li>
          </ul>

          <h2>11. Sorumluluk Sınırlaması</h2>
          <p>
            ArchBuilder.AI, aşağıdaki konularda sorumluluk kabul etmez:
          </p>
          <ul>
            <li>AI çıktılarının doğruluğu</li>
            <li>Yapısal güvenlik hesaplamaları</li>
            <li>Yerel yönetmelik uyumluluğu</li>
            <li>Kullanıcı hatalarından kaynaklanan zararlar</li>
            <li>Üçüncü taraf entegrasyonları</li>
          </ul>

          <h2>12. Force Majeure</h2>
          <p>
            Doğal afetler, savaş, terör, internet kesintileri, AI servis sağlayıcı 
            sorunları gibi kontrolümüz dışındaki durumlardan sorumlu değiliz.
          </p>

          <h2>13. Sözleşme Değişiklikleri</h2>
          <ul>
            <li>Şartları değiştirme hakkımızı saklı tutarız</li>
            <li>Önemli değişiklikler 30 gün önceden bildirilir</li>
            <li>E-posta ile bildirim yapılır</li>
            <li>Değişiklikleri kabul etmeme durumunda hesap kapatılabilir</li>
          </ul>

          <h2>14. Uygulanacak Hukuk</h2>
          <p>
            Bu sözleşme Türkiye Cumhuriyeti kanunlarına tabidir. 
            Uyuşmazlıklar İstanbul mahkemelerinde çözülür.
          </p>

          <h2>15. İletişim</h2>
          <p>
            Hukuki konular için:
          </p>
          <ul>
            <li>E-posta: legal@archbuilder.app</li>
            <li>Telefon: +90 (212) 555-0123</li>
            <li>Adres: Maslak, İstanbul, Türkiye</li>
          </ul>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mt-8">
            <h3>İlgili Belgeler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                → Gizlilik Politikası
              </Link>
              <Link href="/cookies" className="text-blue-600 hover:text-blue-700">
                → Çerez Politikası
              </Link>
              <Link href="/sla" className="text-blue-600 hover:text-blue-700">
                → SLA Detayları
              </Link>
              <Link href="/contact" className="text-blue-600 hover:text-blue-700">
                → İletişim
              </Link>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 mt-8">
            <p className="text-green-800 dark:text-green-200 m-0">
              <strong>Kabul:</strong> Platformu kullanarak bu şartları kabul etmiş sayılırsınız. 
              Şartlarımızı düzenli olarak gözden geçirmenizi öneririz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}