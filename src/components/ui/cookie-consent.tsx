'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, CogIcon, CheckIcon } from '@heroicons/react/24/outline';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setShowBanner(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    setPreferences(allAccepted);
    saveCookieConsent(allAccepted);
    setShowBanner(false);
  };

  const handleAcceptSelected = () => {
    saveCookieConsent(preferences);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    setPreferences(onlyNecessary);
    saveCookieConsent(onlyNecessary);
    setShowBanner(false);
  };

  const saveCookieConsent = (prefs: CookiePreferences) => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      preferences: prefs,
      timestamp: new Date().toISOString()
    }));

    // Here you would initialize analytics/marketing scripts based on preferences
    if (prefs.analytics) {
      console.log('Analytics cookies enabled');
      // Initialize Google Analytics, etc.
    }
    if (prefs.marketing) {
      console.log('Marketing cookies enabled');
      // Initialize marketing pixels, etc.
    }
    if (prefs.functional) {
      console.log('Functional cookies enabled');
      // Initialize functional cookies
    }
  };

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return; // Can't disable necessary cookies
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Content */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                🍪 Çerez Kullanımı
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Websitemizi geliştirmek ve size daha iyi bir deneyim sunmak için çerezler kullanıyoruz. 
                Çerez tercihlerinizi özelleştirebilir veya tümünü kabul edebilirsiniz.{' '}
                <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Gizlilik Politikası
                </a>
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setShowPreferences(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <CogIcon className="w-4 h-4" />
                <span>Tercihler</span>
              </button>
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Reddet
              </button>
              <button
                onClick={handleAcceptAll}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300"
              >
                Tümünü Kabul Et
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Çerez Tercihleri
              </h2>
              <button
                onClick={() => setShowPreferences(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
              {/* Necessary Cookies */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Gerekli Çerezler
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Websitenin düzgün çalışması için gerekli temel çerezler. Devre dışı bırakılamaz.
                  </p>
                </div>
                <div className="ml-4">
                  <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Analiz Çerezleri
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Website trafiğini ve kullanıcı davranışlarını anlamamıza yardımcı olur.
                  </p>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => updatePreference('analytics', !preferences.analytics)}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                      preferences.analytics ? 'bg-blue-500 justify-end' : 'bg-gray-300 dark:bg-gray-600 justify-start'
                    } px-1`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Pazarlama Çerezleri
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Size daha relevant reklamlar göstermek için kullanılır.
                  </p>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => updatePreference('marketing', !preferences.marketing)}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                      preferences.marketing ? 'bg-blue-500 justify-end' : 'bg-gray-300 dark:bg-gray-600 justify-start'
                    } px-1`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    İşlevsel Çerezler
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Tercihlerinizi hatırlamamıza ve kişiselleştirilmiş içerik sunmamıza yardımcı olur.
                  </p>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => updatePreference('functional', !preferences.functional)}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                      preferences.functional ? 'bg-blue-500 justify-end' : 'bg-gray-300 dark:bg-gray-600 justify-start'
                    } px-1`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-6">
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={handleRejectAll}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Tümünü Reddet
                </button>
                <button
                  onClick={handleAcceptSelected}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <CheckIcon className="w-4 h-4" />
                  <span>Seçilenleri Kaydet</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}