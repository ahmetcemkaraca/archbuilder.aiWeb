'use client';

import { ContactForm } from './contact-form';
import { NewsletterSubscription } from './newsletter';
import { useI18n } from '@/lib/i18n';

export function Contact() {
  const { t } = useI18n();
  return (
    <section id="contact" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="block">{t('contactTitle').split(' ')[0]}</span>
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('contactTitle').split(' ').slice(1).join(' ')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('contactSubtitle')}
          </p>
        </div>

        {/* Contact Form */}
        <div className="mb-16">
          <ContactForm />
        </div>

        {/* Newsletter */}
        <div className="mb-16">
          <NewsletterSubscription />
        </div>

        {/* Quick Contact Info - Full Width */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
            {t('quickContact')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center text-gray-600 dark:text-gray-300">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <div>
                <p className="font-medium text-lg mb-2">{t('email')}</p>
                <p className="text-sm">info@archbuilder.app</p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center text-gray-600 dark:text-gray-300">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">📞</span>
              </div>
              <div>
                <p className="font-medium text-lg mb-2">{t('phone')}</p>
                <p className="text-sm">+90 (212) 555-0123</p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center text-gray-600 dark:text-gray-300">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <p className="font-medium text-lg mb-2">{t('liveSupport')}</p>
                <p className="text-sm">{t('liveSupportDesc')}</p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center text-gray-600 dark:text-gray-300">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <div>
                <p className="font-medium text-lg mb-2">{t('location')}</p>
                <p className="text-sm">{t('locationDesc')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('faqTitle')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('faqSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                {t('faqDemo')}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {t('faqDemoAnswer')}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                {t('faqPricing')}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {t('faqPricingAnswer')}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                {t('faqTechSupport')}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {t('faqTechSupportAnswer')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}