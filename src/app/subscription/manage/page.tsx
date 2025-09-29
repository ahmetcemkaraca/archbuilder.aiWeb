/**
 * Subscription Management Page
 * Abonelik yönetim sayfası
 */

'use client';

import { LanguageSelector } from '@/components/ui/language-selector';
import {
    calculateSubscriptionPrice,
    createCustomerPortalSession,
    detectUserRegion,
    generateInvoice,
    getUserInvoices,
    getUserUsageOverage,
    getUserUsageStats
} from '@/lib/stripe-api';
import {
    BillingInterval,
    Invoice,
    SUBSCRIPTION_LIMITS,
    SubscriptionStatus,
    SubscriptionTier,
    SupportedCurrency,
    TaxRegion,
    UsageOverage,
    formatCurrency
} from '@/types/stripe';
import {
    ArrowPathIcon,
    CheckCircleIcon,
    CreditCardIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface CurrentSubscription {
    id: string;
    tier: SubscriptionTier;
    status: SubscriptionStatus;
    billing_interval: BillingInterval;
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
    trial_end?: string;
}

interface UsageStats {
    aiLayouts: number;
    buildingScans: number;
    apiCalls: number;
    exports: number;
    storageUsed: number;
}

export default function SubscriptionManagePage() {
    const [subscription, setSubscription] = useState<CurrentSubscription | null>(null);
    const [usage, setUsage] = useState<UsageStats | null>(null);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [usageOverage, setUsageOverage] = useState<UsageOverage | null>(null);
    const [selectedCurrency, setSelectedCurrency] = useState<SupportedCurrency>(SupportedCurrency.USD);
    const [selectedRegion, setSelectedRegion] = useState<TaxRegion>(TaxRegion.US);
    const [isLoading, setIsLoading] = useState(true);
    const [isPortalLoading, setIsPortalLoading] = useState(false);
    const [isInvoiceGenerating, setIsInvoiceGenerating] = useState(false);

    // Sayfa yüklendiğinde abonelik bilgilerini al
    useEffect(() => {
        loadSubscriptionData();
    }, []);

    const loadSubscriptionData = async () => {
        try {
            setIsLoading(true);

            // Detect user region and currency
            const detected = await detectUserRegion();
            if (detected) {
                setSelectedRegion(detected.detectedRegion);
                setSelectedCurrency(detected.detectedCurrency);
            }

            // Mock data - gerçek implementasyonda API'den gelecek
            const mockSubscription: CurrentSubscription = {
                id: 'sub_1234567890',
                tier: SubscriptionTier.PROFESSIONAL,
                status: SubscriptionStatus.ACTIVE,
                billing_interval: BillingInterval.MONTHLY,
                current_period_start: '2024-01-01T00:00:00Z',
                current_period_end: '2024-02-01T00:00:00Z',
                cancel_at_period_end: false
            };

            // Load user data
            const userId = 'user_123';
            const [usageData, invoiceData, overageData] = await Promise.all([
                getUserUsageStats(userId),
                getUserInvoices(userId),
                getUserUsageOverage(userId)
            ]);

            setSubscription(mockSubscription);
            setUsage(usageData);
            setInvoices(invoiceData);
            setUsageOverage(overageData);
        } catch (error) {
            console.error('Abonelik verisi yüklenirken hata:', error);
            toast.error('Abonelik bilgileri yüklenemedi');
        } finally {
            setIsLoading(false);
        }
    };

    const handleManageBilling = async () => {
        if (!subscription) return;

        setIsPortalLoading(true);
        try {
            const result = await createCustomerPortalSession(
                'cus_mock_customer_id',
                window.location.href
            );

            if (result.url) {
                window.location.href = result.url;
            } else {
                toast.error(result.error || 'Billing portal açılamadı');
            }
        } catch (error) {
            console.error('Billing portal hatası:', error);
            toast.error('Ödeme yönetimi açılamadı');
        } finally {
            setIsPortalLoading(false);
        }
    };

    const handleGenerateInvoice = async (type: 'subscription' | 'usage' = 'subscription') => {
        setIsInvoiceGenerating(true);
        try {
            const result = await generateInvoice('user_123', type);
            if (result.success) {
                toast.success('Fatura başarıyla oluşturuldu');
                // Reload invoices
                const newInvoices = await getUserInvoices('user_123');
                setInvoices(newInvoices);
            } else {
                toast.error(result.error || 'Fatura oluşturulamadı');
            }
        } catch (error) {
            console.error('Fatura oluşturma hatası:', error);
            toast.error('Fatura oluşturulamadı');
        } finally {
            setIsInvoiceGenerating(false);
        }
    };

    const getStatusColor = (status: SubscriptionStatus) => {
        switch (status) {
            case SubscriptionStatus.ACTIVE:
                return 'text-green-600 bg-green-100';
            case SubscriptionStatus.TRIALING:
                return 'text-blue-600 bg-blue-100';
            case SubscriptionStatus.PAST_DUE:
                return 'text-yellow-600 bg-yellow-100';
            case SubscriptionStatus.CANCELED:
                return 'text-red-600 bg-red-100';
            case SubscriptionStatus.UNPAID:
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusText = (status: SubscriptionStatus) => {
        switch (status) {
            case SubscriptionStatus.ACTIVE:
                return 'Aktif';
            case SubscriptionStatus.TRIALING:
                return 'Deneme Döneminde';
            case SubscriptionStatus.PAST_DUE:
                return 'Ödeme Gecikmiş';
            case SubscriptionStatus.CANCELED:
                return 'İptal Edilmiş';
            case SubscriptionStatus.UNPAID:
                return 'Ödenmemiş';
            default:
                return 'Bilinmiyor';
        }
    };

    const getUsagePercentage = (used: number, limit: number) => {
        if (limit === -1) return 0; // Unlimited
        return Math.min((used / limit) * 100, 100);
    };

    const getUsageColor = (percentage: number) => {
        if (percentage >= 90) return 'bg-red-500';
        if (percentage >= 75) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <ArrowPathIcon className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="text-gray-600 dark:text-gray-300">Yükleniyor...</span>
                </div>
            </div>
        );
    }

    if (!subscription) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <ExclamationTriangleIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Aktif Abonelik Bulunamadı
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Henüz bir aboneliğiniz yok. Hemen bir plan seçin ve başlayın.
                    </p>
                    <Link
                        href="/pricing"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Planları İncele
                    </Link>
                </div>
            </div>
        );
    }

    const limits = SUBSCRIPTION_LIMITS[subscription.tier];
    const currentPrice = calculateSubscriptionPrice(subscription.tier, subscription.billing_interval);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                                ← Ana Sayfa
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                                Abonelik Yönetimi
                            </h1>
                        </div>
                        <LanguageSelector />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Ana İçerik */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Mevcut Plan */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Mevcut Planınız
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                                        Abonelik durumu ve detayları
                                    </p>
                                </div>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
                                    {subscription.status === SubscriptionStatus.ACTIVE && <CheckCircleIcon className="w-4 h-4 mr-1" />}
                                    {subscription.status === SubscriptionStatus.CANCELED && <XCircleIcon className="w-4 h-4 mr-1" />}
                                    {getStatusText(subscription.status)}
                                </span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white capitalize mb-2">
                                        {subscription.tier} Plan
                                    </h3>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {formatCurrency(currentPrice.price, selectedCurrency)}
                                        <span className="text-base font-normal text-gray-500">
                                            /{subscription.billing_interval === BillingInterval.YEARLY ? 'yıl' : 'ay'}
                                        </span>
                                    </p>
                                    {subscription.billing_interval === BillingInterval.YEARLY && currentPrice.savings && currentPrice.savings > 0 && (
                                        <p className="text-sm text-green-600 mt-1">
                                            Yıllık {formatCurrency(currentPrice.savings, selectedCurrency)} tasarruf
                                        </p>
                                    )}
                                    <div className="mt-2 text-xs text-gray-500">
                                        Fiyatlar {selectedCurrency} cinsinden • {selectedRegion} bölgesi
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div>
                                        <span className="text-sm text-gray-500">Mevcut dönem:</span>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {new Date(subscription.current_period_start).toLocaleDateString('tr-TR')} - {' '}
                                            {new Date(subscription.current_period_end).toLocaleDateString('tr-TR')}
                                        </p>
                                    </div>
                                    {subscription.cancel_at_period_end && (
                                        <div className="text-yellow-600">
                                            <span className="text-sm">⚠️ Dönem sonunda iptal edilecek</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Kullanım İstatistikleri */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
                        >
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                Bu Ay Kullanım
                            </h2>

                            {usage && (
                                <div className="space-y-6">
                                    {/* AI Layout Kullanımı */}
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                AI Layout Oluşturma
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {usage.aiLayouts} / {limits.aiLayoutsPerMonth === -1 ? 'Sınırsız' : limits.aiLayoutsPerMonth}
                                            </span>
                                        </div>
                                        {limits.aiLayoutsPerMonth !== -1 && (
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(usage.aiLayouts, Number(limits.aiLayoutsPerMonth)))}`}
                                                    style={{ width: `${getUsagePercentage(usage.aiLayouts, Number(limits.aiLayoutsPerMonth))}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Bina Tarama Kullanımı */}
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Bina Tarama
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {usage.buildingScans} / {limits.buildingScansPerMonth === -1 ? 'Sınırsız' : limits.buildingScansPerMonth}
                                            </span>
                                        </div>
                                        {limits.buildingScansPerMonth !== -1 && (
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(usage.buildingScans, Number(limits.buildingScansPerMonth)))}`}
                                                    style={{ width: `${getUsagePercentage(usage.buildingScans, Number(limits.buildingScansPerMonth))}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Depolama Kullanımı */}
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Bulut Depolama
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {(usage.storageUsed / 1024).toFixed(1)} GB kullanıldı
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Usage Overage Warning */}
                            {usageOverage && usageOverage.overageCharges.total > 0 && (
                                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                                    <div className="flex items-start">
                                        <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                                        <div>
                                            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                                Kullanım Limiti Aşıldı
                                            </h4>
                                            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                                Bu ay {formatCurrency(usageOverage.overageCharges.total, selectedCurrency)} ek ücret oluştu.
                                            </p>
                                            <button
                                                onClick={() => handleGenerateInvoice('usage')}
                                                className="text-sm text-yellow-800 dark:text-yellow-200 font-medium hover:underline mt-2"
                                            >
                                                Ek kullanım faturası oluştur →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Invoice History */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Fatura Geçmişi
                                </h2>
                                <button
                                    onClick={() => handleGenerateInvoice('subscription')}
                                    disabled={isInvoiceGenerating}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {isInvoiceGenerating ? (
                                        <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <DocumentTextIcon className="w-4 h-4 mr-2" />
                                    )}
                                    Fatura Oluştur
                                </button>
                            </div>

                            {invoices.length > 0 ? (
                                <div className="space-y-4">
                                    {invoices.slice(0, 5).map((invoice) => (
                                        <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-gray-900 dark:text-white">
                                                    Fatura #{invoice.invoiceNumber}
                                                </h4>
                                                <p className="text-sm text-gray-500">
                                                    {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('tr-TR') : 'Tarih belirtilmemiş'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {formatCurrency(invoice.total, invoice.currency as SupportedCurrency)}
                                                </p>
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                                                    invoice.status === 'open' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {invoice.status === 'paid' ? 'Ödendi' :
                                                     invoice.status === 'open' ? 'Beklemede' : 'Ödenmedi'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {invoices.length > 5 && (
                                        <p className="text-sm text-gray-500 text-center">
                                            ... ve {invoices.length - 5} fatura daha
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">Henüz fatura bulunmuyor</p>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Yan Panel */}
                    <div className="space-y-6">
                        {/* Hızlı Eylemler */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Hızlı Eylemler
                            </h3>

                            <div className="space-y-3">
                                <button
                                    onClick={handleManageBilling}
                                    disabled={isPortalLoading}
                                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                                >
                                    {isPortalLoading ? (
                                        <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <CreditCardIcon className="w-4 h-4 mr-2" />
                                    )}
                                    Ödeme Yönetimi
                                </button>

                                <Link
                                    href="/pricing"
                                    className="w-full flex items-center justify-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                                >
                                    <ArrowPathIcon className="w-4 h-4 mr-2" />
                                    Plan Değiştir
                                </Link>

                                <button
                                    onClick={() => handleGenerateInvoice('subscription')}
                                    disabled={isInvoiceGenerating}
                                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                                >
                                    {isInvoiceGenerating ? (
                                        <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <DocumentTextIcon className="w-4 h-4 mr-2" />
                                    )}
                                    Yeni Fatura Oluştur
                                </button>

                                {usageOverage && usageOverage.overageCharges.total > 0 && (
                                    <button
                                        onClick={() => handleGenerateInvoice('usage')}
                                        className="w-full flex items-center justify-center px-4 py-2 border border-yellow-300 text-sm font-medium rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
                                    >
                                        <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                                        Ek Kullanım Faturası
                                    </button>
                                )}
                            </div>
                        </motion.div>

                        {/* Plan Özellikleri */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Plan Özellikleri
                            </h3>

                            <ul className="space-y-2 text-sm">
                                {Array.isArray(limits.features) && limits.features.map((feature, index) => (
                                    <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                                        <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                        {feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
