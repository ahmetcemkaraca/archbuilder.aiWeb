'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n';
import { LanguageSelector } from '@/components/ui/language-selector';

export default function AboutPage() {
  const { t } = useI18n();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-white/80 hover:text-white mb-8">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-bold text-xl">ArchBuilder.AI</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              {isMounted ? t('aboutBuildingFuture') : 'Mimarinin Geleceğini'} <br />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {isMounted ? t('aboutBuildingTogether') : 'Birlikte İnşa Ediyoruz'}
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {isMounted ? t('aboutFoundedIn2024') : '2024 yılında kurulan ArchBuilder.AI, yapay zeka teknolojisi ile mimarlık endüstrisini dönüştürmeyi hedefleyen yenilikçi bir startup\'tır.'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {isMounted ? t('aboutOurMission') : 'Misyonumuz'}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              {isMounted ? t('aboutMissionDescription') : 'Mimarları tekrarlayan işlerden kurtararak, yaratıcılığa odaklanmalarını sağlamak. AI destekli araçlarla tasarım sürecini hızlandırmak ve kaliteyi artırmak.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {isMounted ? t('aboutInnovation') : 'İnovasyon'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {isMounted ? t('aboutInnovationDesc') : 'En son AI teknolojilerini mimarlık dünyasına uyarlıyoruz'}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {isMounted ? t('aboutEfficiency') : 'Verimlilik'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {isMounted ? t('aboutEfficiencyDesc') : 'Tasarım süreçlerini %70\'e kadar hızlandırıyoruz'}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {isMounted ? t('aboutQuality') : 'Kalite'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {isMounted ? t('aboutQualityDesc') : 'Hatasız ve standartlara uygun projeler üretimi'}
              </p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Hikayemiz
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  ArchBuilder.AI'ın hikayesi, bir mimarlık ofisindeki günlük zorlukların gözlemlenmesiyle başladı. 
                  Mimarların yaratıcı potansiyellerini teknik çizimler ve hesaplamalar için harcadığını fark ettik.
                </p>
                <p>
                  2024 yılının başında kurulan şirketimiz, GPT-4.1 ve Google Vertex AI gibi 
                  son teknoloji AI modellerini kullanarak bu soruna çözüm getirdi.
                </p>
                <p>
                  Bugün, Türkiye'den dünyaya açılan ArchBuilder.AI, yüzlerce mimarın 
                  iş akışını optimize etmeye devam ediyor.
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">2024</div>
                  <div className="text-sm text-gray-500">Kuruluş Yılı</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">500+</div>
                  <div className="text-sm text-gray-500">Aktif Kullanıcı</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">15K+</div>
                  <div className="text-sm text-gray-500">İşlenen Proje</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">%95</div>
                  <div className="text-sm text-gray-500">Müşteri Memnuniyeti</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-8xl mb-4 block">🏗️</span>
                  <p className="text-gray-600 dark:text-gray-300 italic">
                    "AI ile mimarinin geleceğini inşa etmek"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Takımımız
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Mimarlık, yazılım mühendisliği ve AI alanlarında uzman profesyonellerden oluşur
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">AY</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Ahmet Yılmaz
              </h3>
              <p className="text-blue-600 dark:text-blue-400 mb-3">Kurucu & CEO</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                15 yıl mimarlık deneyimi, AI teknolojileri uzmanı
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">EK</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Elif Kaya
              </h3>
              <p className="text-green-600 dark:text-green-400 mb-3">CTO</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Machine Learning PhD, 10 yıl yazılım geliştirme
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">MD</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Mehmet Demir
              </h3>
              <p className="text-purple-600 dark:text-purple-400 mb-3">Lead Architect</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Yapısal tasarım uzmanı, BIM teknolojileri
              </p>
            </div>
          </div>
        </div>

        {/* Technology Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Teknoloji Altyapımız
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Dünya standartlarındaki AI ve bulut teknolojilerini kullanıyoruz
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">GPT-4.1</h3>
              <p className="text-sm text-gray-500">AI Modeli</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">☁️</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Vertex AI</h3>
              <p className="text-sm text-gray-500">Google Cloud</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">FastAPI</h3>
              <p className="text-sm text-gray-500">Backend</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Revit API</h3>
              <p className="text-sm text-gray-500">Entegrasyon</p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Değerlerimiz
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                🔒 Güvenlik Öncelikli
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Tüm proje verileriniz end-to-end şifreleme ile korunur. 
                SOC 2 Type II ve ISO 27001 standartlarına uygunluk.
              </p>
            </div>

            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                🌍 Sürdürülebilirlik
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yeşil bina tasarımını destekleyen AI algoritmaları ile 
                çevre dostu mimarlık projelerine katkı sağlıyoruz.
              </p>
            </div>

            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                🤝 Şeffaflık
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                AI kararlarının arkasındaki mantığı her zaman açık bir şekilde 
                sunuyoruz. Kara kutu yaklaşımına karşıyız.
              </p>
            </div>

            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                📚 Sürekli Öğrenme
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Kullanıcı geri bildirimlerini AI modellerimizi sürekli 
                geliştirmek için kullanıyor, beraber öğreniyoruz.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Bizimle İletişime Geçin
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            ArchBuilder.AI hakkında daha fazla bilgi almak, demo talep etmek 
            veya iş birliği fırsatlarını değerlendirmek için bize ulaşın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              İletişime Geç
            </Link>
            <Link 
              href="/signup" 
              className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700 px-8 py-4 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors font-semibold"
            >
              Ücretsiz Dene
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Daha Fazla Bilgi
            </h3>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                Gizlilik Politikası
              </Link>
              <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                Kullanım Şartları  
              </Link>
              <Link href="/cookies" className="text-blue-600 hover:text-blue-700">
                Çerez Politikası
              </Link>
              <Link href="/careers" className="text-blue-600 hover:text-blue-700">
                Kariyer
              </Link>
              <Link href="/press" className="text-blue-600 hover:text-blue-700">
                Basın
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}