'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { LanguageSelector } from '@/components/ui/language-selector';
import { KeyIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

function ResetPasswordContent() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);

  // Password strength indicators
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    setIsMounted(true);
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      // Simulate token validation
      setTimeout(() => {
        setIsValidToken(true);
      }, 1000);
    }
  }, [searchParams]);

  useEffect(() => {
    // Validate password strength
    setPasswordValidation({
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const passwordsMatch = password === confirmPassword && password.length > 0;

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
              <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {isMounted ? t('resetPasswordSuccess') : 'Şifre Başarıyla Değiştirildi'}
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {isMounted ? t('resetPasswordSuccessDesc') : 'Şifreniz başarıyla güncellendi. Artık yeni şifrenizle giriş yapabilirsiniz.'}
            </p>

            <Link
              href="/login"
              className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300"
            >
              {isMounted ? t('loginNow') : 'Şimdi Giriş Yap'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isValidToken && token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
        {/* Language Selector */}
        <div className="absolute top-4 right-4 z-10">
          <LanguageSelector />
        </div>

        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <KeyIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {isMounted ? t('invalidResetToken') : 'Geçersiz Bağlantı'}
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {isMounted ? t('invalidResetTokenDesc') : 'Bu şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş. Lütfen yeni bir sıfırlama isteği gönderin.'}
            </p>

            <Link
              href="/forgot-password"
              className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300"
            >
              {isMounted ? t('requestNewReset') : 'Yeni Sıfırlama İsteği'}
            </Link>
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
                {isMounted ? t('resetPasswordTitle') : 'Yeni Şifre Belirle'}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {isMounted ? t('resetPasswordSubtitle') : 'Güçlü bir şifre seçin ve hesabınızı güvende tutun'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isMounted ? t('newPassword') : 'Yeni Şifre'}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder={isMounted ? t('enterNewPassword') : 'Yeni şifrenizi girin'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Password strength indicators */}
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${passwordValidation.length ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className={passwordValidation.length ? 'text-green-600' : 'text-gray-500'}>
                      {isMounted ? t('passwordLength') : 'En az 8 karakter'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${passwordValidation.lowercase ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className={passwordValidation.lowercase ? 'text-green-600' : 'text-gray-500'}>
                      {isMounted ? t('passwordLowercase') : 'Küçük harf'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${passwordValidation.uppercase ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className={passwordValidation.uppercase ? 'text-green-600' : 'text-gray-500'}>
                      {isMounted ? t('passwordUppercase') : 'Büyük harf'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${passwordValidation.number ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className={passwordValidation.number ? 'text-green-600' : 'text-gray-500'}>
                      {isMounted ? t('passwordNumber') : 'Rakam'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${passwordValidation.special ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className={passwordValidation.special ? 'text-green-600' : 'text-gray-500'}>
                      {isMounted ? t('passwordSpecial') : 'Özel karakter'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isMounted ? t('confirmPassword') : 'Şifreyi Onayla'}
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      confirmPassword && !passwordsMatch
                        ? 'border-red-300 dark:border-red-600'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder={isMounted ? t('confirmNewPassword') : 'Yeni şifrenizi tekrar girin'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {isMounted ? t('passwordsDoNotMatch') : 'Şifreler uyuşmuyor'}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !isPasswordValid || !passwordsMatch}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <KeyIcon className="w-5 h-5" />
                    <span>{isMounted ? t('updatePassword') : 'Şifreyi Güncelle'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="text-center">
              <Link 
                href="/login"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
              >
                {isMounted ? t('backToLogin') : 'Giriş sayfasına dön'}
              </Link>
            </div>
          </div>
        </div>

        {/* Right side - Hero */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 p-12">
          <div className="max-w-md text-center text-white">
            <div className="mb-8">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <KeyIcon className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                {isMounted ? t('resetPasswordHeroTitle') : 'Güvenli Şifre Yenileme'}
              </h2>
              <p className="text-lg text-blue-100">
                {isMounted ? t('resetPasswordHeroDescription') : 'Güçlü şifre ile hesabınızı koruyun. Güvenlik önceliğimizdir.'}
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
                  {isMounted ? t('resetPasswordFeature1') : 'Güçlü şifreleme'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-blue-100">
                  {isMounted ? t('resetPasswordFeature2') : 'Anında aktivasyon'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-blue-100">
                  {isMounted ? t('resetPasswordFeature3') : 'Güvenlik kontrolleri'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Yükleniyor...
            </h1>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}