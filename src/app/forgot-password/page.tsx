'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { LanguageSelector } from '@/components/ui/language-selector';
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
        {/* Language Selector */}
        <div className="absolute top-4 right-4 z-10">
          <LanguageSelector />
        </div>

        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <EnvelopeIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {isMounted ? t('forgotPasswordEmailSent') : 'E-posta Gönderildi'}
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {isMounted ? t('forgotPasswordEmailSentDesc') : `${email} adresine şifre sıfırlama bağlantısı gönderildi. E-postanızı kontrol edin.`}
            </p>

            <div className="space-y-4">
              <Link
                href="/login"
                className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300"
              >
                {isMounted ? t('backToLogin') : 'Giriş Sayfasına Dön'}
              </Link>
              
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setEmail('');
                }}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm"
              >
                {isMounted ? t('tryDifferentEmail') : 'Farklı e-posta ile dene'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </div>

      <div className="flex min-h-screen">
        {/* Left side - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            {/* Header */}
            <div className="text-center">
              <Link href="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <span className="font-bold text-2xl">ArchBuilder.AI</span>
              </Link>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {isMounted ? t('forgotPasswordTitle') : 'Şifremi Unuttum'}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {isMounted ? t('forgotPasswordSubtitle') : 'E-posta adresinizi girin, şifre sıfırlama bağlantısını gönderelim'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isMounted ? t('emailAddress') : 'E-posta Adresi'}
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder={isMounted ? t('forgotPasswordEmailPlaceholder') : 'Kayıtlı e-posta adresiniz'}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <EnvelopeIcon className="w-5 h-5" />
                    <span>{isMounted ? t('sendResetLink') : 'Sıfırlama Bağlantısı Gönder'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="text-center">
              <Link 
                href="/login"
                className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span>{isMounted ? t('backToLogin') : 'Giriş sayfasına dön'}</span>
              </Link>
            </div>

            {/* Help Text */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                {isMounted ? t('forgotPasswordHelpTitle') : 'Yardım'}
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• {isMounted ? t('forgotPasswordHelp1') : 'E-postanızı kontrol edin (spam klasörü dahil)'}</li>
                <li>• {isMounted ? t('forgotPasswordHelp2') : 'Bağlantı 24 saat geçerlidir'}</li>
                <li>• {isMounted ? t('forgotPasswordHelp3') : 'Sorun yaşıyorsanız destek ekibimizle iletişime geçin'}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right side - Hero */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 p-12">
          <div className="max-w-md text-center text-white">
            <div className="mb-8">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <EnvelopeIcon className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                {isMounted ? t('forgotPasswordHeroTitle') : 'Güvenli Şifre Sıfırlama'}
              </h2>
              <p className="text-lg text-blue-100">
                {isMounted ? t('forgotPasswordHeroDescription') : 'Hesap güvenliğiniz bizim için önemli. Şifrenizi güvenli bir şekilde sıfırlayabilirsiniz.'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-blue-100">
                  {isMounted ? t('forgotPasswordFeature1') : 'Güvenli şifreleme'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-blue-100">
                  {isMounted ? t('forgotPasswordFeature2') : 'Hızlı işlem'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-blue-100">
                  {isMounted ? t('forgotPasswordFeature3') : '7/24 destek'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}