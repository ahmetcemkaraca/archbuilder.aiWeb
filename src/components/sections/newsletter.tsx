'use client';

import { useState, useEffect } from 'react';
import { 
  EnvelopeIcon, 
  CheckCircleIcon,
  SparklesIcon,
  GiftIcon,
  UserGroupIcon,
  BellIcon 
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import { useI18n } from '@/lib/i18n';

interface NewsletterFormData {
  email: string;
  preferences: string[];
  firstName?: string;
}

export function NewsletterSubscription() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<NewsletterFormData>({
    email: '',
    preferences: ['updates'],
    firstName: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const subscriptionTypes = [
    {
      id: 'updates',
      name: mounted ? t('productUpdates') : 'Ürün Güncellemeleri',
      description: mounted ? t('productUpdatesDesc') : 'Yeni özellikler ve güncellemeler',
      icon: BellIcon
    },
    {
      id: 'tips',
      name: mounted ? t('architectureTips') : 'Mimarlık İpuçları',
      description: mounted ? t('architectureTipsDesc') : 'AI ve tasarım ipuçları',
      icon: SparklesIcon
    },
    {
      id: 'community',
      name: mounted ? t('communityNews') : 'Topluluk Haberleri',
      description: mounted ? t('communityNewsDesc') : 'Webinar ve etkinlikler',
      icon: UserGroupIcon
    },
    {
      id: 'special',
      name: mounted ? t('specialOffers') : 'Özel Teklifler',
      description: mounted ? t('specialOffersDesc') : 'İndirimler ve kampanyalar',
      icon: GiftIcon
    }
  ];

  const benefits = [
    mounted ? `✨ ${t('newsletterBenefit1')}` : '✨ Yeni AI özelliklerinden ilk siz haberdar olun',
    mounted ? `🎯 ${t('newsletterBenefit2')}` : '🎯 Mimarlık workflow optimization ipuçları',
    mounted ? `💰 ${t('newsletterBenefit3')}` : '💰 Özel indirimler ve erken erişim fırsatları',
    mounted ? `🤝 ${t('newsletterBenefit4')}` : '🤝 Exclusive webinar ve eğitim etkinlikleri',
    mounted ? `📈 ${t('newsletterBenefit5')}` : '📈 Sektör trendleri ve analiz raporları'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim()) {
      setError(t('newsletterEmailRequired'));
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError(t('newsletterValidEmailRequired'));
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would make actual API call to your newsletter service
      console.log('Newsletter subscription:', formData);
      
      setIsSubscribed(true);
    } catch (error) {
      setError(t('errorOccurred'));
      console.error('Newsletter subscription error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreferenceChange = (preferenceId: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(preferenceId)
        ? prev.preferences.filter(p => p !== preferenceId)
        : [...prev.preferences, preferenceId]
    }));
  };

  if (isSubscribed) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8 text-center border border-green-200 dark:border-green-700">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircleIconSolid className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {mounted ? t('welcomeMessage') : '🎉 Hoş Geldiniz!'}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {mounted ? t('confirmationEmailSent') : 'E-posta adresinize onay maili gönderdik. Lütfen e-postanızı kontrol ederek aboneliğinizi onaylayın.'}
        </p>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            {mounted ? t('whatsNext') : 'Sırada Ne Var?'}
          </h4>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <li>{mounted ? t('checkConfirmationEmail') : '📧 Onay mailini kontrol edin'}</li>
            <li>{mounted ? t('clickConfirmationLink') : '🔗 Onay linkine tıklayın'}</li>
            <li>{mounted ? t('startReceivingTips') : '🎁 Haftalık AI ipuçları almaya başlayın'}</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-900/20 dark:via-gray-800 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-700">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <EnvelopeIcon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {mounted ? t('newsletterBadge') : 'AI Mimarlık Bülteni'}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          {mounted ? t('newsletterDesc') : 'ArchBuilder.AI\'dan güncellemeler, ipuçları ve özel teklifleri kaçırmayın'}
        </p>
      </div>

      {/* Benefits */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <SparklesIcon className="w-5 h-5 text-blue-600 mr-2" />
          {mounted ? t('whatYouGet') : 'Neler Kazanacaksınız?'}
        </h4>
        <ul className="space-y-2">
          {benefits.map((benefit, index) => (
            <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
              <span className="mr-2">{benefit.split(' ')[0]}</span>
              <span>{benefit.split(' ').slice(1).join(' ')}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Subscription Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email & Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="newsletter-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {mounted ? `${t('emailAddress')} *` : 'E-posta Adresi *'}
            </label>
            <div className="relative">
              <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="email"
                id="newsletter-email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder={mounted ? t('emailPlaceholder2') : 'email@example.com'}
              />
            </div>
          </div>

          <div>
            <label htmlFor="newsletter-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {mounted ? t('nameOptional') : 'Ad (İsteğe bağlı)'}
            </label>
            <input
              type="text"
              id="newsletter-name"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder={mounted ? t('namePlaceholder') : 'Adınız'}
            />
          </div>
        </div>

        {/* Subscription Preferences */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            {mounted ? t('interestedTopics') : 'İlgilendiğiniz Konular'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subscriptionTypes.map((type) => (
              <label
                key={type.id}
                className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.preferences.includes(type.id)
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.preferences.includes(type.id)}
                  onChange={() => handlePreferenceChange(type.id)}
                  className="mt-1 mr-3"
                />
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <type.icon className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {type.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {type.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-3">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Subscribe Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{mounted ? t('subscribing') : 'Abone Oluyor...'}</span>
            </>
          ) : (
            <>
              <CheckCircleIcon className="w-5 h-5" />
              <span>{mounted ? t('subscribeNewsletterFree') : 'Ücretsiz Abone Ol'}</span>
            </>
          )}
        </button>

        {/* Privacy Notice */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {mounted ? t('privacyPolicyAccept') : 'Abone olarak Gizlilik Politikamızı kabul etmiş olursunuz. İstediğiniz zaman abonelikten çıkabilirsiniz.'}
        </p>
      </form>
    </div>
  );
}