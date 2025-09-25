'use client';

import { useState, useEffect } from 'react';
import { useConsent } from '@/hooks/use-analytics';
import { useI18n } from '@/lib/i18n';

/**
 * GDPR/CCPA Uyumlu Cookie Banner
 * Privacy-first yaklaşımla consent management
 */
export default function CookieBanner() {
  const { showBanner, acceptAll, acceptNecessary, acceptCustom } = useConsent();
  const { t } = useI18n();
  const [showDetails, setShowDetails] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [customConsent, setCustomConsent] = useState({
    analytics: false,
    marketing: false,
    personalization: false
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!showBanner) return null;

  const handleCustomSave = () => {
    acceptCustom(customConsent);
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[9998]" />
      
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-2xl">
        <div className="max-w-7xl mx-auto p-6">
          {!showDetails ? (
            // Simple Banner
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {isMounted ? t('cookieTitle') : 'We Use Cookies'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {isMounted ? t('cookieDescription') : 'We use cookies to improve your experience on our site and to show you personalized content. By continuing to use our site, you consent to our use of cookies.'}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 lg:ml-6">
                <button
                  onClick={() => setShowDetails(true)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                >
                  {isMounted ? t('cookieCustomize') : 'Customize'}
                </button>
                
                <button
                  onClick={acceptNecessary}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                >
                  {isMounted ? t('cookieNecessary') : 'Accept Necessary Only'}
                </button>
                
                <button
                  onClick={acceptAll}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  {isMounted ? t('cookieAcceptAll') : 'Accept All'}
                </button>
              </div>
            </div>
          ) : (
            // Detailed Settings
            <div className="max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {isMounted ? t('cookiePreferences') : 'Cookie Preferences'}
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Necessary Cookies */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {isMounted ? t('cookieNecessaryTitle') : 'Necessary Cookies'}
                    </h4>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400 mr-3">
                        {isMounted ? t('cookieAlwaysActive') : 'Always Active'}
                      </span>
                      <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5" />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {isMounted ? t('cookieNecessaryDescription') : 'These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and accessibility.'}
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {isMounted ? t('cookieAnalyticsTitle') : 'Analytics Cookies'}
                    </h4>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customConsent.analytics}
                        onChange={(e) => setCustomConsent(prev => ({
                          ...prev,
                          analytics: e.target.checked
                        }))}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full relative transition-colors ${
                        customConsent.analytics ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                          customConsent.analytics ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {isMounted ? t('cookieAnalyticsDescription') : 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.'}
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {isMounted ? t('cookieMarketingTitle') : 'Marketing Cookies'}
                    </h4>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customConsent.marketing}
                        onChange={(e) => setCustomConsent(prev => ({
                          ...prev,
                          marketing: e.target.checked
                        }))}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full relative transition-colors ${
                        customConsent.marketing ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                          customConsent.marketing ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {isMounted ? t('cookieMarketingDescription') : 'These cookies are used to track visitors across websites and to display relevant advertisements.'}
                  </p>
                </div>

                {/* Personalization Cookies */}
                <div className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {isMounted ? t('cookiePersonalizationTitle') : 'Personalization Cookies'}
                    </h4>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customConsent.personalization}
                        onChange={(e) => setCustomConsent(prev => ({
                          ...prev,
                          personalization: e.target.checked
                        }))}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full relative transition-colors ${
                        customConsent.personalization ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                          customConsent.personalization ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {isMounted ? t('cookiePersonalizationDescription') : 'These cookies allow us to remember your preferences and provide you with a more personal experience.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={acceptNecessary}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                >
                  {isMounted ? t('cookieNecessary') : 'Accept Necessary Only'}
                </button>
                
                <button
                  onClick={handleCustomSave}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                >
                  {isMounted ? t('cookieSavePreferences') : 'Save Preferences'}
                </button>
                
                <button
                  onClick={acceptAll}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  {isMounted ? t('cookieAcceptAll') : 'Accept All'}
                </button>
              </div>

              {/* Privacy Links */}
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                <a href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-200 underline">
                  {isMounted ? t('cookiePrivacyPolicy') : 'Privacy Policy'}
                </a>
                <a href="/terms" className="hover:text-gray-700 dark:hover:text-gray-200 underline">
                  {isMounted ? t('cookieTermsOfService') : 'Terms of Service'}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}