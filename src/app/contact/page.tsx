'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { LanguageSelector } from '@/components/ui/language-selector';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function ContactPage() {
  const { t } = useI18n();
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert(isMounted ? t('contactMessageSent') : 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </div>

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <Link href="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-bold text-xl">ArchBuilder.AI</span>
            </Link>
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {isMounted ? t('contactGetInTouch') : 'İletişime Geçin'}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {isMounted ? t('contactDescription') : 'Sorularınız, önerileriniz veya iş birliği teklifleriniz için bize ulaşın. Uzman ekibimiz size yardımcı olmaktan mutluluk duyar.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {isMounted ? t('contactSendMessage') : 'Mesaj Gönderin'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {isMounted ? t('contactName') : 'Ad Soyad'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder={isMounted ? t('contactNamePlaceholder') : 'Adınız ve soyadınız'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {isMounted ? t('contactEmailLabel') : 'E-posta'} *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder={isMounted ? t('contactEmailPlaceholder') : 'ornek@email.com'}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {isMounted ? t('contactCompany') : 'Şirket/Kurum'}
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder={isMounted ? t('contactCompanyPlaceholder') : 'Şirket adı (opsiyonel)'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {isMounted ? t('contactInquiryType') : 'Talep Türü'}
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({...formData, inquiryType: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="general">{isMounted ? t('contactGeneral') : 'Genel Bilgi'}</option>
                      <option value="demo">{isMounted ? t('contactDemo') : 'Demo Talebi'}</option>
                      <option value="partnership">{isMounted ? t('contactPartnership') : 'İş Birliği'}</option>
                      <option value="support">{isMounted ? t('contactSupport') : 'Teknik Destek'}</option>
                      <option value="sales">{isMounted ? t('contactSales') : 'Satış'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {isMounted ? t('contactSubject') : 'Konu'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder={isMounted ? t('contactSubjectPlaceholder') : 'Mesajınızın konusu'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {isMounted ? t('contactMessage') : 'Mesaj'} *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder={isMounted ? t('contactMessagePlaceholder') : 'Mesajınızı buraya yazın...'}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <EnvelopeIcon className="w-5 h-5" />
                        <span>{isMounted ? t('contactSendMessage') : 'Mesaj Gönder'}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Contact Details */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {isMounted ? t('contactInfo') : 'İletişim Bilgileri'}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{isMounted ? t('contactEmailLabel') : 'E-posta'}</p>
                      <p className="text-gray-800 dark:text-gray-200">info@archbuilder.app</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{isMounted ? t('contactPhone') : 'Telefon'}</p>
                      <p className="text-gray-800 dark:text-gray-200">+90 (212) 555-0123</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{isMounted ? t('contactAddress') : 'Adres'}</p>
                      <p className="text-gray-800 dark:text-gray-200">İstanbul, Türkiye</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <ClockIcon className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{isMounted ? t('contactWorkingHours') : 'Çalışma Saatleri'}</p>
                      <p className="text-gray-800 dark:text-gray-200">
                        {isMounted ? t('contactWorkingTime') : 'Pazartesi - Cuma: 09:00 - 18:00'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-semibold mb-4">
                  {isMounted ? t('contactQuickActions') : 'Hızlı İşlemler'}
                </h3>
                <div className="space-y-3">
                  <Link 
                    href="/signup" 
                    className="block w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-3 rounded-lg transition-colors text-center font-medium"
                  >
                    {isMounted ? t('contactFreeTrial') : '🚀 Ücretsiz Deneme'}
                  </Link>
                  <Link 
                    href="/pricing" 
                    className="block w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-3 rounded-lg transition-colors text-center font-medium"
                  >
                    {isMounted ? t('contactViewPricing') : '💰 Fiyatları İncele'}
                  </Link>
                  <a 
                    href="mailto:info@archbuilder.app" 
                    className="block w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-3 rounded-lg transition-colors text-center font-medium"
                  >
                    {isMounted ? t('contactDirectEmail') : '📧 Doğrudan E-posta'}
                  </a>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  {isMounted ? t('contactFAQ') : '❓ Sık Sorulan Sorular'}
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                  {isMounted ? t('contactFAQDescription') : 'Sorunuzun cevabı SSS bölümünde mevcut olabilir.'}
                </p>
                <Link 
                  href="/faq" 
                  className="text-yellow-800 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100 font-medium text-sm underline"
                >
                  {isMounted ? t('contactViewFAQ') : 'SSS\'leri İncele →'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}