/**
 * Multi-Currency Pricing Section with Regional Support
 * Gelişmiş çok para birimli fiyatlandırma bileşeni
 */

'use client';

import { useI18n } from '@/lib/i18n/context';
import {
    calculateLocalizedPrice,
    createSubscriptionCheckout,
    detectUserRegion,
    getExchangeRates,
    getRegionalPricing,
    validatePromoCode
} from '@/lib/stripe-api';
import {
    BillingInterval,
    CURRENCY_CONFIG,
    SUBSCRIPTION_LIMITS,
    SubscriptionTier,
    SupportedCurrency,
    TaxRegion,
    formatCurrency
} from '@/types/stripe';
import { BoltIcon, CheckIcon, GlobeAltIcon, ShieldCheckIcon, StarIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface MultiCurrencyPricingProps {
    className?: string;
    showComparison?: boolean;
    defaultInterval?: BillingInterval;
    defaultCurrency?: SupportedCurrency;
    defaultRegion?: TaxRegion;
}

const MultiCurrencyPricingSection: React.FC<MultiCurrencyPricingProps> = ({
    className = '',
    showComparison = true,
    defaultInterval = BillingInterval.MONTHLY,
    defaultCurrency = SupportedCurrency.USD,
    defaultRegion = TaxRegion.US
}) => {
    const { t } = useI18n();

    // State management
    const [billingInterval, setBillingInterval] = useState<BillingInterval>(defaultInterval);
    const [selectedCurrency, setSelectedCurrency] = useState<SupportedCurrency>(defaultCurrency);
    const [selectedRegion, setSelectedRegion] = useState<TaxRegion>(defaultRegion);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState<{ type: 'percentage' | 'amount'; value: number; code?: string } | null>(null);

    // Regional pricing data
    const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
    const [regionalPricing, setRegionalPricing] = useState<Record<SubscriptionTier, any>>({} as any);
    const [isLoadingPricing, setIsLoadingPricing] = useState(false);

    // Auto-detect user region and currency on mount
    useEffect(() => {
        const detectAndSetRegion = async () => {
            try {
                const detected = await detectUserRegion();
                if (detected) {
                    setSelectedRegion(detected.detectedRegion);
                    setSelectedCurrency(detected.detectedCurrency);
                }
            } catch (error) {
                console.error('Region detection failed:', error);
            }
        };

        detectAndSetRegion();
    }, []);

    // Load exchange rates when currency changes
    useEffect(() => {
        const loadExchangeRates = async () => {
            if (selectedCurrency === SupportedCurrency.USD) {
                setExchangeRates({ [SupportedCurrency.USD]: 1 });
                return;
            }

            try {
                const rates = await getExchangeRates(SupportedCurrency.USD);
                if (rates) {
                    setExchangeRates(rates.rates);
                }
            } catch (error) {
                console.error('Failed to load exchange rates:', error);
            }
        };

        loadExchangeRates();
    }, [selectedCurrency]);

    // Load regional pricing when region/currency changes
    useEffect(() => {
        const loadRegionalPricing = async () => {
            setIsLoadingPricing(true);
            const newRegionalPricing: Record<SubscriptionTier, any> = {} as any;

            try {
                for (const tier of Object.values(SubscriptionTier)) {
                    if (tier === SubscriptionTier.FREE || tier === SubscriptionTier.CUSTOM) {
                        continue;
                    }

                    const pricing = await getRegionalPricing(tier, selectedCurrency, selectedRegion);
                    if (pricing) {
                        newRegionalPricing[tier] = pricing;
                    }
                }

                setRegionalPricing(newRegionalPricing);
            } catch (error) {
                console.error('Failed to load regional pricing:', error);
            } finally {
                setIsLoadingPricing(false);
            }
        };

        if (selectedCurrency && selectedRegion) {
            loadRegionalPricing();
        }
    }, [selectedCurrency, selectedRegion]);

    // Promosyon kodu uygula
    const handleApplyPromo = async () => {
        if (!promoCode.trim()) return;

        const result = await validatePromoCode(promoCode);
        if (result.valid && result.discount) {
            setAppliedPromo({ ...result.discount, code: promoCode });
            toast.success(t('promoCodeApplied'));
        } else {
            toast.error(t('invalidPromoCode'));
        }
    };

    // Abonelik satın alma
    const handleSubscribe = async (tier: SubscriptionTier) => {
        if (tier === SubscriptionTier.FREE) {
            window.location.href = '/signup';
            return;
        }

        if (tier === SubscriptionTier.CUSTOM) {
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
        } catch (error) {
            console.error('Subscription error:', error);
            toast.error(t('errorCreatingSubscription'));
        } finally {
            setIsLoading(false);
            setSelectedTier(null);
        }
    };

    // Fiyat hesaplama (promosyon kodu ile)
    const calculateDisplayPrice = (tier: SubscriptionTier) => {
        if (tier === SubscriptionTier.FREE) {
            return { price: 0, formatted: formatCurrency(0, selectedCurrency) };
        }

        // Use regional pricing if available
        if (regionalPricing[tier]) {
            const pricing = regionalPricing[tier];
            const basePrice = billingInterval === BillingInterval.YEARLY
                ? pricing.finalPricing.yearly
                : pricing.finalPricing.monthly;

            let finalPrice = basePrice;

            if (appliedPromo) {
                if (appliedPromo.type === 'percentage') {
                    finalPrice = basePrice * (1 - appliedPromo.value / 100);
                } else {
                    finalPrice = Math.max(0, basePrice - appliedPromo.value);
                }
            }

            return {
                price: finalPrice,
                formatted: formatCurrency(finalPrice, selectedCurrency),
                originalPrice: appliedPromo ? basePrice : undefined,
                savings: billingInterval === BillingInterval.YEARLY ? pricing.savingsYearly.amount : undefined
            };
        }

        // Fallback to client-side calculation
        const exchangeRate = exchangeRates[selectedCurrency] || 1;
        const regionalAdjustment = 1; // Default

        const result = calculateLocalizedPrice(
            tier,
            billingInterval,
            selectedCurrency,
            exchangeRate,
            regionalAdjustment,
            appliedPromo?.type === 'percentage' ? appliedPromo.value : undefined
        );

        return {
            price: result.price,
            formatted: result.formatted,
            savings: result.savings
        };
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

    // Currency selector component
    const CurrencySelector = () => (
        <div className="flex items-center gap-2">
            <GlobeAltIcon className="w-5 h-5 text-gray-500" />
            <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value as SupportedCurrency)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm"
            >
                {Object.values(SupportedCurrency).map(currency => {
                    const config = CURRENCY_CONFIG[currency];
                    return (
                        <option key={currency} value={currency}>
                            {config?.symbol} {currency} - {config?.name}
                        </option>
                    );
                })}
            </select>
        </div>
    );

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

                    {/* Currency Selector */}
                    <div className="mt-6 flex justify-center">
                        <CurrencySelector />
                    </div>

                    {/* Billing Toggle */}
                    <div className="mt-8 flex items-center justify-center">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex">
                            <button
                                onClick={() => setBillingInterval(BillingInterval.MONTHLY)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${billingInterval === BillingInterval.MONTHLY
                                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                                        : 'text-gray-500 dark:text-gray-400'
                                    }`}
                            >
                                {t('monthly')}
                            </button>
                            <button
                                onClick={() => setBillingInterval(BillingInterval.YEARLY)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all relative ${billingInterval === BillingInterval.YEARLY
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
                                : `${formatCurrency(appliedPromo.value, selectedCurrency)} ${t('promoCodeDiscount')}`
                            }
                        </div>
                    )}
                </div>

                {/* Loading Indicator */}
                {isLoadingPricing && (
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            <span className="text-gray-600 dark:text-gray-300">
                                Fiyatlar güncelleniyor...
                            </span>
                        </div>
                    </div>
                )}

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
                    {Object.values(SubscriptionTier).map((tier, index) => {
                        const isPopular = tier === SubscriptionTier.PROFESSIONAL;
                        const priceData = calculateDisplayPrice(tier);
                        const features = getPlanFeatures(tier);

                        return (
                            <motion.div
                                key={tier}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 ${isPopular ? 'border-2 border-blue-500 transform scale-105' : 'border border-gray-200 dark:border-gray-700'
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
                                        {tier === SubscriptionTier.CUSTOM ? (
                                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {t('contactSalesTeam')}
                                            </div>
                                        ) : (
                                            <>
                                                {priceData.originalPrice && (
                                                    <div className="text-lg text-gray-500 line-through">
                                                        {formatCurrency(priceData.originalPrice, selectedCurrency)}
                                                    </div>
                                                )}
                                                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                                                    {priceData.formatted}
                                                    <span className="text-lg font-normal text-gray-500">
                                                        /{billingInterval === BillingInterval.YEARLY ? 'yıl' : 'ay'}
                                                    </span>
                                                </div>
                                                {priceData.savings && billingInterval === BillingInterval.YEARLY && (
                                                    <div className="text-green-600 text-sm mt-1">
                                                        {formatCurrency(priceData.savings, selectedCurrency)} tasarruf
                                                    </div>
                                                )}
                                            </>
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
                                    className={`w-full py-3 rounded-lg font-semibold transition-all ${isPopular
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

                {/* Regional Info */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <GlobeAltIcon className="w-4 h-4" />
                        <span>
                            Fiyatlar {selectedRegion} bölgesi için {selectedCurrency} cinsinden gösterilmektedir
                        </span>
                    </div>
                    {regionalPricing[SubscriptionTier.PROFESSIONAL]?.taxInfo?.applicable && (
                        <div className="text-xs text-gray-500 mt-1">
                            Vergiler dahil • {regionalPricing[SubscriptionTier.PROFESSIONAL].taxInfo.name}
                            ({regionalPricing[SubscriptionTier.PROFESSIONAL].taxInfo.ratePercentage.toFixed(1)}%)
                        </div>
                    )}
                </div>

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

export default MultiCurrencyPricingSection;
