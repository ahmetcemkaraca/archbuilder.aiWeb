/**
 * Enhanced Billing Dashboard Component
 * Gelişmiş faturalandırma dashboard bileşeni
 */

'use client';

import {
    Invoice,
    InvoiceStatus,
    SupportedCurrency,
    TaxRegion,
    formatCurrency,
    getCurrencyByRegion
} from '@/types/stripe';
import {
    ArrowTrendingUpIcon,
    ChartBarIcon,
    CheckCircleIcon,
    ClockIcon,
    CreditCardIcon,
    CurrencyDollarIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import InvoiceManagementComponent from './invoice-management';
import UsageTrackingComponent from './usage-tracking';

interface BillingStats {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingAmount: number;
  overdueAmount: number;
  currency: SupportedCurrency;
  revenueGrowth: number;
}

interface SubscriptionInfo {
  planName: string;
  status: 'active' | 'past_due' | 'canceled' | 'unpaid';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  price: number;
  currency: SupportedCurrency;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

interface BillingDashboardProps {
  stats: BillingStats;
  subscription: SubscriptionInfo;
  paymentMethods: PaymentMethod[];
  invoices: Invoice[];
  usageData: any[];
  currentUsage: any;
  usageLimits: any;
  userRegion: TaxRegion;
  onUpdatePaymentMethod?: () => void;
  onCancelSubscription?: () => void;
  onReactivateSubscription?: () => void;
  onDownloadInvoice?: (invoiceId: string) => void;
  onViewInvoice?: (invoiceId: string) => void;
  onGenerateInvoice?: (type: 'subscription' | 'usage') => void;
  onUpgradePlan?: () => void;
  isLoading?: boolean;
}

const BillingDashboardComponent: React.FC<BillingDashboardProps> = ({
  stats,
  subscription,
  paymentMethods,
  invoices,
  usageData,
  currentUsage,
  usageLimits,
  userRegion,
  onUpdatePaymentMethod,
  onCancelSubscription,
  onReactivateSubscription,
  onDownloadInvoice,
  onViewInvoice,
  onGenerateInvoice,
  onUpgradePlan,
  isLoading = false
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'usage' | 'payment'>('overview');
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedCurrency>(
    getCurrencyByRegion(userRegion)
  );

  // Get subscription status info
  const getSubscriptionStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return {
          icon: CheckCircleIcon,
          color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
          text: 'Aktif'
        };
      case 'past_due':
        return {
          icon: ExclamationTriangleIcon,
          color: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30',
          text: 'Ödeme Gecikti'
        };
      case 'canceled':
        return {
          icon: ClockIcon,
          color: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30',
          text: 'İptal Edildi'
        };
      case 'unpaid':
        return {
          icon: ExclamationTriangleIcon,
          color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
          text: 'Ödenmedi'
        };
      default:
        return {
          icon: ClockIcon,
          color: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30',
          text: 'Bilinmiyor'
        };
    }
  };

  const subscriptionStatusInfo = getSubscriptionStatusInfo(subscription.status);
  const StatusIcon = subscriptionStatusInfo.icon;

  // Stats cards data
  const statsCards = [
    {
      title: 'Toplam Gelir',
      value: formatCurrency(stats.totalRevenue, selectedCurrency),
      icon: CurrencyDollarIcon,
      color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
    },
    {
      title: 'Aylık Gelir',
      value: formatCurrency(stats.monthlyRevenue, selectedCurrency),
      icon: ArrowTrendingUpIcon,
      color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
      change: stats.revenueGrowth
    },
    {
      title: 'Bekleyen Ödemeler',
      value: formatCurrency(stats.pendingAmount, selectedCurrency),
      icon: ClockIcon,
      color: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30'
    },
    {
      title: 'Vadesi Geçen',
      value: formatCurrency(stats.overdueAmount, selectedCurrency),
      icon: ExclamationTriangleIcon,
      color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Genel Bakış', icon: ChartBarIcon },
    { id: 'invoices', label: 'Faturalar', icon: DocumentTextIcon },
    { id: 'usage', label: 'Kullanım', icon: ChartBarIcon },
    { id: 'payment', label: 'Ödeme Yöntemleri', icon: CreditCardIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Faturalandırma Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Abonelik, ödemeler ve kullanım istatistiklerinizi yönetin
            </p>
          </div>

          {/* Currency selector */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Para Birimi:
            </label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value as SupportedCurrency)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={SupportedCurrency.USD}>USD ($)</option>
              <option value={SupportedCurrency.EUR}>EUR (€)</option>
              <option value={SupportedCurrency.GBP}>GBP (£)</option>
              <option value={SupportedCurrency.TRY}>TRY (₺)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
                {stat.change !== undefined && (
                  <p className={`text-xs mt-1 ${
                    stat.change >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.change >= 0 ? '+' : ''}{stat.change.toFixed(1)}% bu ay
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Subscription status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-full ${subscriptionStatusInfo.color}`}>
              <StatusIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {subscription.planName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {subscriptionStatusInfo.text} • {formatCurrency(subscription.price, subscription.currency)}/ay
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Dönem: {new Date(subscription.currentPeriodStart).toLocaleDateString('tr-TR')} - {new Date(subscription.currentPeriodEnd).toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
              <button
                onClick={onCancelSubscription}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Aboneliği İptal Et
              </button>
            )}
            {subscription.cancelAtPeriodEnd && (
              <button
                onClick={onReactivateSubscription}
                className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 border border-green-300 rounded-md hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-900/20"
              >
                Yeniden Aktifleştir
              </button>
            )}
            <button
              onClick={onUpgradePlan}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Planı Yükselt
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent invoices preview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Son Faturalar
                  </h3>
                  <div className="space-y-3">
                    {invoices.slice(0, 3).map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            #{invoice.invoiceNumber}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {new Date(invoice.dueDate || invoice.id).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formatCurrency(invoice.total, invoice.currency as SupportedCurrency)}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            invoice.status === InvoiceStatus.PAID
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {invoice.status === InvoiceStatus.PAID ? 'Ödendi' : 'Beklemede'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment methods preview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Ödeme Yöntemleri
                  </h3>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <CreditCardIcon className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {method.brand?.toUpperCase()} •••• {method.last4}
                            </p>
                            {method.expiryMonth && method.expiryYear && (
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                              </p>
                            )}
                          </div>
                        </div>
                        {method.isDefault && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                            Varsayılan
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={onUpdatePaymentMethod}
                    className="w-full px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-300 rounded-md hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
                  >
                    Ödeme Yöntemi Ekle/Güncelle
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'invoices' && (
            <InvoiceManagementComponent
              invoices={invoices}
              isLoading={isLoading}
              onDownloadInvoice={onDownloadInvoice}
              onViewInvoice={onViewInvoice}
              onGenerateInvoice={onGenerateInvoice}
            />
          )}

          {activeTab === 'usage' && (
            <UsageTrackingComponent
              usageData={usageData}
              currentUsage={currentUsage}
              limits={usageLimits}
              billingPeriod={`${new Date(subscription.currentPeriodStart).toLocaleDateString('tr-TR')} - ${new Date(subscription.currentPeriodEnd).toLocaleDateString('tr-TR')}`}
              onUpgrade={onUpgradePlan}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Kayıtlı Ödeme Yöntemleri
                </h3>
                <button
                  onClick={onUpdatePaymentMethod}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Yeni Kart Ekle
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <CreditCardIcon className="w-6 h-6 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {method.brand?.toUpperCase()} •••• {method.last4}
                          </p>
                          {method.expiryMonth && method.expiryYear && (
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Son kullanma: {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                            </p>
                          )}
                        </div>
                      </div>
                      {method.isDefault && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                          Varsayılan
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {!method.isDefault && (
                        <button className="flex-1 px-3 py-2 text-xs font-medium text-blue-600 hover:text-blue-700 border border-blue-300 rounded-md hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20">
                          Varsayılan Yap
                        </button>
                      )}
                      <button className="flex-1 px-3 py-2 text-xs font-medium text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20">
                        Kaldır
                      </button>
                    </div>
                  </div>
                ))}

                {paymentMethods.length === 0 && (
                  <div className="col-span-2 text-center py-8">
                    <CreditCardIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Kayıtlı Ödeme Yöntemi Yok
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Otomatik ödemeler için bir kredi kartı ekleyin.
                    </p>
                    <button
                      onClick={onUpdatePaymentMethod}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      İlk Kartınızı Ekleyin
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingDashboardComponent;