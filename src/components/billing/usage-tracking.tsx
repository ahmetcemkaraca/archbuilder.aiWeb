/**
 * Enhanced Usage Tracking Component
 * Gelişmiş kullanım takibi bileşeni
 */

'use client';

import {
    SupportedCurrency,
    formatCurrency
} from '@/types/stripe';
import {
    ArrowDownIcon,
    ArrowUpIcon,
    ChartBarIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import React from 'react';

interface UsageData {
  period: string;
  totalRequests: number;
  promptTokens: number;
  completionTokens: number;
  aiModelsUsed: string[];
  cost: number;
  currency: SupportedCurrency;
}

interface UsageLimits {
  maxRequests: number;
  maxTokens: number;
  warningThreshold: number; // percentage (0.8 = 80%)
}

interface UsageTrackingProps {
  usageData: UsageData[];
  currentUsage: UsageData;
  limits: UsageLimits;
  billingPeriod: string;
  onUpgrade?: () => void;
  isLoading?: boolean;
}

const UsageTrackingComponent: React.FC<UsageTrackingProps> = ({
  usageData,
  currentUsage,
  limits,
  billingPeriod,
  onUpgrade,
  isLoading = false
}) => {
  // Calculate usage percentages
  const requestsPercentage = (currentUsage.totalRequests / limits.maxRequests) * 100;
  const tokensPercentage = ((currentUsage.promptTokens + currentUsage.completionTokens) / limits.maxTokens) * 100;

  // Check if approaching limits
  const isApproachingRequestLimit = requestsPercentage >= (limits.warningThreshold * 100);
  const isApproachingTokenLimit = tokensPercentage >= (limits.warningThreshold * 100);

  // Calculate usage trends
  const getUsageTrend = (currentValue: number, previousValue: number) => {
    if (usageData.length < 2) return 0;
    return ((currentValue - previousValue) / previousValue) * 100;
  };

  const previousUsage = usageData.length > 1 ? usageData[usageData.length - 2] : currentUsage;
  const requestsTrend = getUsageTrend(currentUsage.totalRequests, previousUsage.totalRequests);
  const tokensTrend = getUsageTrend(
    currentUsage.promptTokens + currentUsage.completionTokens,
    previousUsage.promptTokens + previousUsage.completionTokens
  );

  // Progress bar component
  const ProgressBar: React.FC<{
    percentage: number;
    isWarning: boolean;
    label: string;
    current: number;
    max: number;
  }> = ({ percentage, isWarning, label, current, max }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-gray-900 dark:text-white font-medium">
          {current.toLocaleString()} / {max.toLocaleString()}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-2 rounded-full transition-colors ${
            isWarning
              ? 'bg-yellow-500 dark:bg-yellow-400'
              : percentage >= 100
                ? 'bg-red-500 dark:bg-red-400'
                : 'bg-blue-500 dark:bg-blue-400'
          }`}
        />
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400">
        {percentage.toFixed(1)}% kullanıldı
      </div>
    </div>
  );

  // Trend indicator component
  const TrendIndicator: React.FC<{ trend: number }> = ({ trend }) => {
    if (Math.abs(trend) < 1) return null;

    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
        trend > 0
          ? 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30'
          : 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30'
      }`}>
        {trend > 0 ? (
          <ArrowUpIcon className="w-3 h-3" />
        ) : (
          <ArrowDownIcon className="w-3 h-3" />
        )}
        {Math.abs(trend).toFixed(1)}%
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <ChartBarIcon className="w-6 h-6" />
              Kullanım Takibi
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {billingPeriod} dönemi kullanım istatistikleri
            </p>
          </div>

          {/* Warning alerts */}
          {(isApproachingRequestLimit || isApproachingTokenLimit) && (
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                Limite yaklaşıyorsunuz
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-600 dark:text-gray-300">
                Kullanım verileri yükleniyor...
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Usage progress bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* API Requests */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">API İstekleri</h3>
                  <TrendIndicator trend={requestsTrend} />
                </div>
                <ProgressBar
                  percentage={requestsPercentage}
                  isWarning={isApproachingRequestLimit}
                  label="Toplam İstek"
                  current={currentUsage.totalRequests}
                  max={limits.maxRequests}
                />
              </div>

              {/* Tokens */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Token Kullanımı</h3>
                  <TrendIndicator trend={tokensTrend} />
                </div>
                <ProgressBar
                  percentage={tokensPercentage}
                  isWarning={isApproachingTokenLimit}
                  label="Toplam Token"
                  current={currentUsage.promptTokens + currentUsage.completionTokens}
                  max={limits.maxTokens}
                />

                {/* Token breakdown */}
                <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-400">
                  <div>
                    <span className="font-medium">İstek:</span> {currentUsage.promptTokens.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Yanıt:</span> {currentUsage.completionTokens.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Usage details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {/* AI Models Used */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                  Kullanılan AI Modelleri
                </h4>
                <div className="flex flex-wrap gap-1">
                  {currentUsage.aiModelsUsed.map((model, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                    >
                      {model}
                    </span>
                  ))}
                </div>
              </div>

              {/* Current cost */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                  Mevcut Maliyet
                </h4>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(currentUsage.cost, currentUsage.currency)}
                </div>
              </div>

              {/* Billing period */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                  Faturalama Dönemi
                </h4>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {billingPeriod}
                </div>
              </div>
            </div>

            {/* Warning and upgrade section */}
            {(requestsPercentage >= 90 || tokensPercentage >= 90) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                      Kullanım Limiti Uyarısı
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                      Aylık limitinizin %90'ına ulaştınız. Hizmet kesintisi yaşamamak için planınızı yükseltmeyi düşünün.
                    </p>
                    {onUpgrade && (
                      <button
                        onClick={onUpgrade}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Planı Yükselt
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Info section */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-3">
                <InformationCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <p className="font-medium mb-1">Kullanım Hakkında</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Kullanım verileri gerçek zamanlı güncellenir</li>
                    <li>• Token sayısı AI model yanıtlarına bağlı olarak değişir</li>
                    <li>• Limit aşımında otomatik faturalandırma devreye girer</li>
                    <li>• Detaylı raporlar fatura geçmişinden görüntülenebilir</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsageTrackingComponent;