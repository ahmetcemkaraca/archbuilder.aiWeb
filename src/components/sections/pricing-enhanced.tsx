/**
 * Enhanced Pricing Section with Stripe Integration
 * Gelişmiş fiyatlandırma bölümü - Stripe entegrasyonlu
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon, StarIcon, BoltIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import { useI18n } from '@/lib/i18n/context';
import { 
  SubscriptionTier, 
  BillingInterval, 
  SUBSCRIPTION_PRICING, 
  SUBSCRIPTION_LIMITS,
  calculateYearlySavings,
  hasFeature,
  FEATURE_FLAGS
} from '@/types/stripe';
import { createSubscriptionCheckout, validatePromoCode } from '@/lib/stripe-api';
import toast from 'react-hot-toast';

interface PricingProps {
  className?: string;
  showComparison?: boolean;
  defaultInterval?: BillingInterval;
}

const PricingSection: React.FC<PricingProps> = ({
  className = '',
  showComparison = true,
  defaultInterval = BillingInterval.MONTHLY
}) => {
  const { t } = useI18n();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>(defaultInterval);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);

  // Promosyon kodu uygula
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    const result = await validatePromoCode(promoCode);
    if (result.valid) {
      setAppliedPromo(result.discount);
      toast.success(t('promoCodeApplied'));
    } else {
      toast.error(t('invalidPromoCode'));
    }
  };

  // Abonelik satın alma
  const handleSubscribe = async (tier: SubscriptionTier) => {
    if (tier === SubscriptionTier.FREE) {
      // Ücretsiz plan için kayıt sayfasına yönlendir
      window.location.href = '/signup';
      return;
    }

    if (tier === SubscriptionTier.CUSTOM) {
      // Özel plan için iletişim sayfasına yönlendir
      window.location.href = '/contact';
      return;
    }

    setIsLoading(true);
    setSelectedTier(tier);

    try {
      const result = await createSubscriptionCheckout(tier, billingInterval, {
        successUrl: `${window.location.origin}/subscription/success`,
        cancelUrl: `${window.location.origin}/pricing`,
        trialDays: tier === SubscriptionTier.PROFESSIONAL ? 14 : undefined
      });

      if (result.error) {
        toast.error(result.error);
      }
      // Başarılı olursa Stripe otomatik olarak yönlendirir
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error(t('errorCreatingSubscription'));
    } finally {
      setIsLoading(false);
      setSelectedTier(null);
    }
  };

  // Fiyat hesaplama (promosyon kodu ile)
  const calculateDiscountedPrice = (tier: SubscriptionTier) => {
    const pricing = SUBSCRIPTION_PRICING[tier];
    if (!pricing || typeof pricing.monthlyPriceUsd !== 'number') return 0;

    const basePrice = billingInterval === BillingInterval.YEARLY 
      ? pricing.yearlyPriceUsd 
      : pricing.monthlyPriceUsd;

    if (appliedPromo) {
      if (appliedPromo.type === 'percentage') {
        return basePrice * (1 - appliedPromo.value / 100);
      } else {
        return Math.max(0, basePrice - appliedPromo.value);
      }
    }

    return basePrice;
  };

  // Plan özellikleri
  const getPlanFeatures = (tier: SubscriptionTier) => {
    const limits = SUBSCRIPTION_LIMITS[tier];
    const features = [];

    // Kullanım limitleri
    if (limits.aiLayoutsPerMonth === -1) {
      features.push(t('unlimitedUsage') + ' AI Layout');
    } else {
      features.push(`${limits.aiLayoutsPerMonth} AI Layout/ay`);
    }

    if (limits.buildingScansPerMonth === -1) {
      features.push(t('unlimitedUsage') + ' Bina Tarama');
    } else {
      features.push(`${limits.buildingScansPerMonth} Bina Tarama/ay`);
    }

    // Depolama
    if (typeof limits.cloudStorage === 'string') {
      features.push(limits.cloudStorage + ' Bulut Depolama');
    }

    // Destek seviyesi
    switch (limits.supportLevel) {
      case 'community':
        features.push('Topluluk Desteği');
        break;
      case 'email':
        features.push('E-posta Desteği');
        break;
      case 'priority':
        features.push('Öncelikli Destek');
        break;
      case 'dedicated':
        features.push('Özel Destek');
        break;
    }

    // Özellikler
    const featureList = limits.features || [];
    if (featureList.includes('revit_plugin')) features.push('Revit Plugin');
    if (featureList.includes('team_collaboration')) features.push('Takım İşbirliği');
    if (featureList.includes('api_access')) features.push('API Erişimi');
    if (featureList.includes('white_label')) features.push('White Label');
    if (featureList.includes('sso')) features.push('SSO Entegrasyonu');

    return features;
  };

  return (
    <section className={`py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('pricing')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Projeleriniz için en uygun planı seçin
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 flex items-center justify-center">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex">
              <button
                onClick={() => setBillingInterval(BillingInterval.MONTHLY)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  billingInterval === BillingInterval.MONTHLY
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {t('monthly')}
              </button>
              <button
                onClick={() => setBillingInterval(BillingInterval.YEARLY)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all relative ${
                  billingInterval === BillingInterval.YEARLY
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {t('yearly')}
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  17% OFF
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Promosyon Kodu */}
        <div className="max-w-md mx-auto mb-12">
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder={t('enterPromoCode')}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleApplyPromo}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('applyPromoCode')}
            </button>
          </div>
          {appliedPromo && (
            <div className="mt-2 text-green-600 text-sm">
              {appliedPromo.type === 'percentage' 
                ? `${appliedPromo.value}% ${t('promoCodeDiscount')}`
                : `$${appliedPromo.value} ${t('promoCodeDiscount')}`
              }
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
          {Object.values(SubscriptionTier).map((tier, index) => {
            const pricing = SUBSCRIPTION_PRICING[tier];
            const limits = SUBSCRIPTION_LIMITS[tier];
            const isPopular = tier === SubscriptionTier.PROFESSIONAL;
            const price = calculateDiscountedPrice(tier);
            const originalPrice = billingInterval === BillingInterval.YEARLY 
              ? pricing.yearlyPriceUsd 
              : pricing.monthlyPriceUsd;
            const features = getPlanFeatures(tier);

            return (
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 ${
                  isPopular ? 'border-2 border-blue-500 transform scale-105' : 'border border-gray-200 dark:border-gray-700'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <StarIcon className="w-4 h-4" />
                      {t('mostPopularPlan')}
                    </span>
                  </div>
                )}

                {/* Plan Name */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                    {tier}
                  </h3>
                  <div className="mt-4">
                    {typeof price === 'number' ? (
                      <>
                        {appliedPromo && originalPrice !== price && (
                          <div className="text-lg text-gray-500 line-through">
                            ${originalPrice}
                          </div>
                        )}
                        <div className="text-4xl font-bold text-gray-900 dark:text-white">
                          ${price}
                          <span className="text-lg font-normal text-gray-500">
                            /{billingInterval === BillingInterval.YEARLY ? 'yıl' : 'ay'}
                          </span>
                        </div>
                        {billingInterval === BillingInterval.YEARLY && (
                          <div className="text-green-600 text-sm mt-1">
                            ${calculateYearlySavings(tier)} tasarruf
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {t('contactSalesTeam')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300 text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSubscribe(tier)}
                  disabled={isLoading && selectedTier === tier}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    isPopular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  } ${isLoading && selectedTier === tier ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading && selectedTier === tier ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      {t('loading')}
                    </div>
                  ) : (
                    tier === SubscriptionTier.FREE ? t('startFreeTrialNow') : 
                    tier === SubscriptionTier.CUSTOM ? t('contactSalesTeam') : 
                    t('startFreeTrialNow')
                  )}
                </button>

                {/* Trial Info */}
                {tier === SubscriptionTier.PROFESSIONAL && (
                  <div className="mt-3 text-center text-sm text-gray-500">
                    14 günlük ücretsiz deneme • {t('noPaymentRequired')}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        {showComparison && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="px-8 py-6 bg-gray-50 dark:bg-gray-900">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('detailedComparison')}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      {t('featureColumn')}
                    </th>
                    {Object.values(SubscriptionTier).map(tier => (
                      <th key={tier} className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white capitalize">
                        {tier}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { 
                      feature: 'AI Layout Oluşturma/Ay', 
                      values: ['5', '100', 'Sınırsız', 'Özel'] 
                    },
                    { 
                      feature: 'Bina Tarama/Ay', 
                      values: ['2', '20', 'Sınırsız', 'Özel'] 
                    },
                    { 
                      feature: 'Bulut Depolama', 
                      values: ['100MB', '10GB', '100GB', 'Özel'] 
                    },
                    { 
                      feature: 'Revit Plugin', 
                      values: ['❌', '✅', '✅', '✅'] 
                    },
                    { 
                      feature: 'API Erişimi', 
                      values: ['❌', '❌', '✅', '✅'] 
                    },
                    { 
                      feature: 'Takım İşbirliği', 
                      values: ['❌', '5 Kişi', 'Sınırsız', 'Sınırsız'] 
                    }
                  ].map((row, index) => (
                    <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-8 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {row.feature}
                      </td>
                      {row.values.map((value, valueIndex) => (
                        <td key={valueIndex} className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-300">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Security & Trust Badges */}
        <div className="mt-16 text-center">
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-6 h-6 text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                SSL Şifreli Ödeme
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BoltIcon className="w-6 h-6 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Anında Aktivasyon
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              30 Gün Para İade Garantisi
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;