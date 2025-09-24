'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { LanguageSelector } from '@/components/ui/language-selector';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  ArrowPathIcon,
  EnvelopeIcon 
} from '@heroicons/react/24/outline';

function VerifyEmailContent() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const tokenParam = searchParams.get('token');
    const emailParam = searchParams.get('email');
    
    if (tokenParam) {
      setToken(tokenParam);
      if (emailParam) {
        setEmail(decodeURIComponent(emailParam));
      }
      
      // Simulate email verification
      setTimeout(() => {
        // Randomly simulate different verification states for demo
        const random = Math.random();
        if (random < 0.7) {
          setVerificationStatus('success');
        } else if (random < 0.9) {
          setVerificationStatus('expired');
        } else {
          setVerificationStatus('error');
        }
      }, 2000);
    } else {
      // No token provided
      setVerificationStatus('error');
    }
  }, [searchParams]);

  const handleResendVerification = async () => {
    setIsResending(true);
    
    // Simulate resend API call
    setTimeout(() => {
      setIsResending(false);
      // You could show a toast notification here
    }, 2000);
  };

  // Loading state
  if (verificationStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
        {/* Language Selector */}
        <div className="absolute top-4 right-4 z-10">
          <LanguageSelector />
        </div>

        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <ArrowPathIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {isMounted ? t('verifyingEmail') : 'E-posta Doğrulanıyor'}
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300">
              {isMounted ? t('verifyingEmailDesc') : 'E-posta adresinizi doğruluyoruz, lütfen bekleyin...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
        {/* Language Selector */}
        <div className="absolute top-4 right-4 z-10">
          <LanguageSelector />
        </div>

        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {isMounted ? t('emailVerifiedSuccess') : 'E-posta Başarıyla Doğrulandı'}
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {isMounted ? t('emailVerifiedSuccessDesc') : 'Hesabınız aktif edildi. Artık tüm özellikleri kullanabilirsiniz.'}
            </p>

            <div className="space-y-4">
              <Link
                href="/login"
                className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300"
              >
                {isMounted ? t('loginNow') : 'Şimdi Giriş Yap'}
              </Link>
              
              <Link
                href="/"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm"
              >
                {isMounted ? t('backToHome') : 'Ana sayfaya dön'}
              </Link>
            </div>

            {/* Welcome message */}
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                {isMounted ? t('welcomeToArchBuilder') : 'ArchBuilder.AI\'ye Hoş Geldiniz!'}
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {isMounted ? t('verifyWelcomeMessage') : 'Artık AI destekli mimari tasarım özelliklerinin keyfini çıkarabilirsiniz.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error or Expired state
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </div>

      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <ExclamationTriangleIcon className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {verificationStatus === 'expired' 
              ? (isMounted ? t('verificationExpired') : 'Doğrulama Süresi Doldu')
              : (isMounted ? t('verificationFailed') : 'Doğrulama Başarısız')
            }
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {verificationStatus === 'expired'
              ? (isMounted ? t('verificationExpiredDesc') : 'Bu doğrulama bağlantısının süresi dolmuş. Yeni bir doğrulama e-postası gönderebiliriz.')
              : (isMounted ? t('verificationFailedDesc') : 'E-posta doğrulama işlemi başarısız oldu. Bağlantı geçersiz olabilir.')
            }
          </p>

          <div className="space-y-4">
            {email && (
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
              >
                {isResending ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <EnvelopeIcon className="w-5 h-5" />
                    <span>{isMounted ? t('resendVerification') : 'Yeniden Gönder'}</span>
                  </>
                )}
              </button>
            )}
            
            <Link
              href="/login"
              className="block w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-3 px-4 rounded-lg font-semibold transition-all duration-300"
            >
              {isMounted ? t('backToLogin') : 'Giriş sayfasına dön'}
            </Link>
          </div>

          {/* Help section */}
          <div className="mt-8 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {isMounted ? t('needHelp') : 'Yardıma mı ihtiyacınız var?'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {isMounted ? t('verificationHelpDesc') : 'E-posta doğrulama konusunda sorun yaşıyorsanız:'}
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 text-left">
              <li>• {isMounted ? t('checkSpamFolder') : 'Spam klasörünüzü kontrol edin'}</li>
              <li>• {isMounted ? t('checkEmailAddress') : 'E-posta adresinizin doğru olduğunu kontrol edin'}</li>
              <li>• {isMounted ? t('verifyContactSupport') : 'Destek ekibimizle iletişime geçin'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <ArrowPathIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Yükleniyor...
            </h1>
          </div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}