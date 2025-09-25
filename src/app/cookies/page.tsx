import Link from 'next/link';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
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
            Çerez Politikası
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Son güncelleme: 24 Eylül 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 mb-8">
            <p className="text-blue-800 dark:text-blue-200 m-0">
              <strong>Bu sayfa:</strong> ArchBuilder.AI platformunun çerez kullanımını, 
              türlerini ve yönetim seçeneklerini detaylandırır.
            </p>
          </div>

          <h2>1. Çerez Nedir?</h2>
          <p>
            Çerezler, web sitelerinin tarayıcınızda sakladığı küçük metin dosyalarıdır. 
            Bu dosyalar, site işlevselliğini artırmak, kullanıcı deneyimini iyileştirmek 
            ve analitik veriler toplamak için kullanılır.
          </p>

          <h2>2. ArchBuilder.AI Çerez Kullanımı</h2>
          <p>
            Platformumuz, aşağıdaki amaçlarla çerez teknolojisini kullanır:
          </p>
          <ul>
            <li>Kullanıcı oturum yönetimi</li>
            <li>Tercih ve ayarları hatırlama</li>
            <li>Güvenlik ve doğrulama</li>
            <li>Performans analizi</li>
            <li>Hizmet iyileştirme</li>
          </ul>

          <h2>3. Çerez Türleri</h2>
          
          <h3>3.1 Zorunlu Çerezler</h3>
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 mb-6">
            <h4 className="mt-0">Bu çerezler devre dışı bırakılamaz</h4>
            <table className="w-full border-collapse border border-red-200 dark:border-red-700">
              <thead>
                <tr className="bg-red-100 dark:bg-red-800">
                  <th className="border border-red-200 dark:border-red-700 p-3 text-left">Çerez</th>
                  <th className="border border-red-200 dark:border-red-700 p-3 text-left">Amaç</th>
                  <th className="border border-red-200 dark:border-red-700 p-3 text-left">Süre</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-red-200 dark:border-red-700 p-3">session_token</td>
                  <td className="border border-red-200 dark:border-red-700 p-3">Kullanıcı oturum yönetimi</td>
                  <td className="border border-red-200 dark:border-red-700 p-3">24 saat</td>
                </tr>
                <tr>
                  <td className="border border-red-200 dark:border-red-700 p-3">csrf_token</td>
                  <td className="border border-red-200 dark:border-red-700 p-3">Güvenlik (CSRF koruması)</td>
                  <td className="border border-red-200 dark:border-red-700 p-3">Oturum</td>
                </tr>
                <tr>
                  <td className="border border-red-200 dark:border-red-700 p-3">auth_verify</td>
                  <td className="border border-red-200 dark:border-red-700 p-3">Kimlik doğrulama</td>
                  <td className="border border-red-200 dark:border-red-700 p-3">15 dakika</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>3.2 İşlevsel Çerezler</h3>
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 mb-6">
            <h4 className="mt-0">Kullanıcı deneyimi için gerekli</h4>
            <table className="w-full border-collapse border border-blue-200 dark:border-blue-700">
              <thead>
                <tr className="bg-blue-100 dark:bg-blue-800">
                  <th className="border border-blue-200 dark:border-blue-700 p-3 text-left">Çerez</th>
                  <th className="border border-blue-200 dark:border-blue-700 p-3 text-left">Amaç</th>
                  <th className="border border-blue-200 dark:border-blue-700 p-3 text-left">Süre</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-blue-200 dark:border-blue-700 p-3">theme_preference</td>
                  <td className="border border-blue-200 dark:border-blue-700 p-3">Karanlık/aydınlık mod</td>
                  <td className="border border-blue-200 dark:border-blue-700 p-3">1 yıl</td>
                </tr>
                <tr>
                  <td className="border border-blue-200 dark:border-blue-700 p-3">language_pref</td>
                  <td className="border border-blue-200 dark:border-blue-700 p-3">Dil tercihi</td>
                  <td className="border border-blue-200 dark:border-blue-700 p-3">6 ay</td>
                </tr>
                <tr>
                  <td className="border border-blue-200 dark:border-blue-700 p-3">ui_settings</td>
                  <td className="border border-blue-200 dark:border-blue-700 p-3">Arayüz ayarları</td>
                  <td className="border border-blue-200 dark:border-blue-700 p-3">3 ay</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>3.3 Analitik Çerezler</h3>
          <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 mb-6">
            <h4 className="mt-0">Performans ve kullanım analizi</h4>
            <table className="w-full border-collapse border border-green-200 dark:border-green-700">
              <thead>
                <tr className="bg-green-100 dark:bg-green-800">
                  <th className="border border-green-200 dark:border-green-700 p-3 text-left">Çerez</th>
                  <th className="border border-green-200 dark:border-green-700 p-3 text-left">Amaç</th>
                  <th className="border border-green-200 dark:border-green-700 p-3 text-left">Süre</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-green-200 dark:border-green-700 p-3">_ga</td>
                  <td className="border border-green-200 dark:border-green-700 p-3">Google Analytics (anonim)</td>
                  <td className="border border-green-200 dark:border-green-700 p-3">2 yıl</td>
                </tr>
                <tr>
                  <td className="border border-green-200 dark:border-green-700 p-3">performance_metrics</td>
                  <td className="border border-green-200 dark:border-green-700 p-3">Sayfa performansı</td>
                  <td className="border border-green-200 dark:border-green-700 p-3">7 gün</td>
                </tr>
                <tr>
                  <td className="border border-green-200 dark:border-green-700 p-3">user_journey</td>
                  <td className="border border-green-200 dark:border-green-700 p-3">Kullanıcı davranışı</td>
                  <td className="border border-green-200 dark:border-green-700 p-3">30 gün</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>3.4 Pazarlama Çerezleri</h3>
          <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-6 mb-6">
            <h4 className="mt-0">Reklam ve hedefleme (isteğe bağlı)</h4>
            <table className="w-full border-collapse border border-purple-200 dark:border-purple-700">
              <thead>
                <tr className="bg-purple-100 dark:bg-purple-800">
                  <th className="border border-purple-200 dark:border-purple-700 p-3 text-left">Çerez</th>
                  <th className="border border-purple-200 dark:border-purple-700 p-3 text-left">Amaç</th>
                  <th className="border border-purple-200 dark:border-purple-700 p-3 text-left">Süre</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-purple-200 dark:border-purple-700 p-3">marketing_pref</td>
                  <td className="border border-purple-200 dark:border-purple-700 p-3">E-posta pazarlama izni</td>
                  <td className="border border-purple-200 dark:border-purple-700 p-3">1 yıl</td>
                </tr>
                <tr>
                  <td className="border border-purple-200 dark:border-purple-700 p-3">ad_targeting</td>
                  <td className="border border-purple-200 dark:border-purple-700 p-3">Hedefli reklam</td>
                  <td className="border border-purple-200 dark:border-purple-700 p-3">90 gün</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>4. Çerez Yönetimi</h2>
          
          <h3>4.1 Çerez Tercih Merkezi</h3>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
            <p className="mb-4">
              Çerez tercihlerinizi istediğiniz zaman değiştirebilirsiniz:
            </p>
            <div className="space-y-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                🍪 Çerez Ayarlarını Yönet
              </button>
            </div>
          </div>

          <h3>4.2 Tarayıcı Ayarları</h3>
          <p>Çerezleri tarayıcınızdan da yönetebilirsiniz:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4>Chrome</h4>
              <p className="text-sm">Ayarlar → Gizlilik ve güvenlik → Çerezler</p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4>Firefox</h4>
              <p className="text-sm">Ayarlar → Gizlilik ve Güvenlik → Çerezler</p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4>Safari</h4>
              <p className="text-sm">Tercihler → Gizlilik → Çerezleri Yönet</p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4>Edge</h4>
              <p className="text-sm">Ayarlar → Gizlilik → Çerezleri temizle</p>
            </div>
          </div>

          <h2>5. Üçüncü Taraf Çerezleri</h2>
          
          <h3>5.1 Entegre Hizmetler</h3>
          <p>Platform, aşağıdaki üçüncü taraf hizmetlerini kullanır:</p>
          <ul>
            <li><strong>Google Analytics:</strong> Anonim kullanım istatistikleri</li>
            <li><strong>Stripe:</strong> Ödeme işlemleri (güvenlik çerezleri)</li>
            <li><strong>Intercom:</strong> Müşteri destek sistemi</li>
            <li><strong>Hotjar:</strong> Kullanıcı deneyimi analizi</li>
          </ul>

          <h3>5.2 Sosyal Medya</h3>
          <p>
            Sosyal medya paylaşım butonları (LinkedIn, Twitter) kendi çerezlerini kullanır. 
            Bu çerezler ilgili platformların gizlilik politikalarına tabidir.
          </p>

          <h2>6. Mobil Uygulama</h2>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 mb-6">
            <p className="text-yellow-800 dark:text-yellow-200 m-0">
              <strong>Not:</strong> Mobil uygulamalar çerez kullanmaz, bunun yerine 
              cihaz kimliği ve uygulama ayarları kullanılır. Detaylar için 
              <Link href="/privacy" className="underline">Gizlilik Politikası</Link>&apos;na bakın.
            </p>
          </div>

          <h2>7. Çerez Güvenliği</h2>
          <h3>7.1 Güvenlik Önlemleri</h3>
          <ul>
            <li><strong>Secure Flag:</strong> HTTPS üzerinden iletim</li>
            <li><strong>HttpOnly:</strong> JavaScript erişimi engellenir</li>
            <li><strong>SameSite:</strong> CSRF saldırı koruması</li>
            <li><strong>Şifreleme:</strong> Hassas veriler şifrelenir</li>
          </ul>

          <h3>7.2 Veri Minimizasyonu</h3>
          <ul>
            <li>Sadece gerekli veriler saklanır</li>
            <li>Otomatik silme süreleri belirlenir</li>
            <li>Kişisel veriler anonimleştirilir</li>
            <li>Düzenli güvenlik denetimleri yapılır</li>
          </ul>

          <h2>8. Yasal Uyumluluk</h2>
          
          <h3>8.1 GDPR Uyumluluğu</h3>
          <ul>
            <li>Açık onay (opt-in) sistemi</li>
            <li>Granüler çerez kontrolü</li>
            <li>Veri taşınabilirliği</li>
            <li>Unutulma hakkı</li>
          </ul>

          <h3>8.2 KVKK Uyumluluğu</h3>
          <ul>
            <li>Aydınlatma metni</li>
            <li>Açık rıza sistemi</li>
            <li>Veri işleme envanteri</li>
            <li>İhlal bildirim prosedürleri</li>
          </ul>

          <h2>9. Çerez Politikası Değişiklikleri</h2>
          <p>
            Bu politika gerektiğinde güncellenebilir. Önemli değişiklikler:
          </p>
          <ul>
            <li>E-posta ile bildirilir</li>
            <li>Platform üzerinde duyurulur</li>
            <li>30 gün önceden haber verilir</li>
            <li>Yeni onay gerekiyorsa istenilir</li>
          </ul>

          <h2>10. İletişim</h2>
          <p>Çerez politikası hakkında sorularınız için:</p>
          <ul>
            <li><strong>E-posta:</strong> privacy@archbuilder.app</li>
            <li><strong>Telefon:</strong> +90 (212) 555-0123</li>
            <li><strong>Adres:</strong> Maslak, İstanbul, Türkiye</li>
          </ul>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mt-8">
            <h3>İlgili Sayfalar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                → Gizlilik Politikası
              </Link>
              <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                → Kullanım Şartları
              </Link>
              <Link href="/contact" className="text-blue-600 hover:text-blue-700">
                → İletişim
              </Link>
              <Link href="/settings" className="text-blue-600 hover:text-blue-700">
                → Hesap Ayarları
              </Link>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 mt-8">
            <p className="text-blue-800 dark:text-blue-200 m-0">
              <strong>Hatırlatma:</strong> Çerez tercihlerinizi istediğiniz zaman 
              değiştirebilir, analitik ve pazarlama çerezlerini reddedebilirsiniz. 
              Zorunlu çerezler platform işleyişi için gereklidir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}