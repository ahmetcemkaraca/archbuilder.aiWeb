'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useI18n } from '@/lib/i18n';
import { LanguageSelector } from '@/components/ui/language-selector';

const plans = [
  { id: 'personal', labelKey: 'signup.plans.personal' },
  { id: 'team', labelKey: 'signup.plans.team' },
  { id: 'enterprise', labelKey: 'signup.plans.enterprise' },
  { id: 'student', labelKey: 'signup.plans.student' },
];

export default function SignupPage() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    plan: 'professional'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert(isMounted ? t('signupRegistrationReceived') : 'Kayıt talebiniz alındı! Size en kısa sürede dönüş yapacağız.');
    }, 2000);
  };

  const benefits = isMounted ? [
    t('signupBenefit1'),
    t('signupBenefit2'),
    t('signupBenefit3'),
    t('signupBenefit4'),
    t('signupBenefit5'),
    t('signupBenefit6')
  ] : [
    '1 building ücretsiz deneme',
    'Tüm AI özelliklerine erişim',
    'DWG/DXF/IFC/PDF desteği',
    '7/24 e-posta desteği',
    'Revit entegrasyonu',
    'Kredi kartı gerekmez'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Language Selector */}
        <div className="flex justify-end mb-8">
          <LanguageSelector />
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-bold text-xl">ArchBuilder.AI</span>
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {isMounted ? t('signupJoinArchBuilder') : 'ArchBuilder.AI\'ya Katılın'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {isMounted ? t('signupTransformProjects') : 'Mimarlık projelerinizi AI ile dönüştürmeye başlayın'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Signup Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {isMounted ? t('signupCreateFreeAccount') : 'Ücretsiz Hesap Oluşturun'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isMounted ? t('signupFullName') : 'Ad Soyad'} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder={isMounted ? t('signupFullNamePlaceholder') : 'Adınız ve soyadınız'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isMounted ? t('signupEmailAddress') : 'E-posta Adresi'} *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder={isMounted ? t('signupEmailPlaceholder') : 'ornek@email.com'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isMounted ? t('signupCompanyOrganization') : 'Şirket/Kurum'}
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder={isMounted ? t('signupCompanyPlaceholder') : 'Şirket adı (opsiyonel)'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isMounted ? t('signupInterestedPlan') : 'İlgilendiğiniz Plan'}
                </label>
                <select
                  value={formData.plan}
                  onChange={(e) => setFormData({...formData, plan: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="starter">{isMounted ? t('signupPlanStarter') : 'Başlangıç'}</option>
                  <option value="professional">{isMounted ? t('signupPlanProfessional') : 'Profesyonel'}</option>
                  <option value="enterprise">{isMounted ? t('signupPlanEnterprise') : 'Kurumsal'}</option>
                  <option value="student">{isMounted ? t('signupPlanStudent') : 'Öğrenci'}</option>
                </select>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  required
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-700">{isMounted ? t('cookiePrivacyPolicy') : 'Gizlilik Politikası'}</Link> ve{' '}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-700">{isMounted ? t('cookieTermsOfService') : 'Kullanım Şartları'}</Link>{isMounted ? '\'nı ' + t('signupPrivacyAcceptance') : '\'nı okudum ve kabul ediyorum.'} *
                </p>
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
                    <span>{isMounted ? t('signupStartFree') : 'Ücretsiz Başla'}</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              {isMounted ? t('signupAlreadyHaveAccount') : 'Zaten hesabınız var mı?'}{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                {isMounted ? t('signupLoginLink') : 'Giriş yapın'}
              </Link>
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">{isMounted ? t('signupWhyArchBuilder') : 'Neden ArchBuilder.AI?'}</h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckIcon className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                {isMounted ? t('signupGetStarted') : '🚀 Hemen Başlayın'}
              </h4>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <p>{isMounted ? t('signupInstantActivation') : '✅ Anında hesap aktivasyonu'}</p>
                <p>{isMounted ? t('signupFreeTrial') : '✅ 1 building ücretsiz deneme'}</p>
                <p>{isMounted ? t('signupNoInstallation') : '✅ Kurulum gerektirmez'}</p>
                <p>{isMounted ? t('signupQuickProjects') : '✅ 30 saniyede projeler'}</p>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                {isMounted ? t('signupProTip') : '💡 Pro İpucu'}
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {isMounted ? t('signupProTipDescription') : 'İlk projenizi oluşturduktan sonra, AI\'dan belirli yapı detayları ve malzeme önerileri isteyebilirsiniz. Bu, tasarım sürecinizi %70 hızlandırır.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}