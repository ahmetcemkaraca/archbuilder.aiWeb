/**
 * Admin Revenue Analytics Dashboard Component
 * Yönetici gelir analizi dashboard bileşeni
 */

'use client';

import {
    formatCurrency,
    SupportedCurrency,
    TaxRegion
} from '@/types/stripe';
import {
    ArrowPathIcon,
    ArrowTrendingDownIcon,
    ArrowTrendingUpIcon,
    CalendarIcon,
    ChartBarIcon,
    CurrencyDollarIcon,
    DocumentChartBarIcon,
    GlobeAltIcon,
    UsersIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import React, { useMemo, useState } from 'react';

interface RevenueMetrics {
    totalRevenue: number;
    monthlyRecurringRevenue: number;
    annualRecurringRevenue: number;
    averageRevenuePerUser: number;
    customerLifetimeValue: number;
    churnRate: number;
    growthRate: number;
    currency: SupportedCurrency;
}

interface RegionalRevenue {
    region: TaxRegion;
    revenue: number;
    percentage: number;
    customerCount: number;
    averageValue: number;
}

interface TimeSeriesData {
    period: string;
    revenue: number;
    customers: number;
    churn: number;
}

interface ProductMetrics {
    productName: string;
    revenue: number;
    subscriptions: number;
    conversionRate: number;
    churnRate: number;
}

interface AdminAnalyticsDashboardProps {
    metrics: RevenueMetrics;
    regionalData: RegionalRevenue[];
    timeSeriesData: TimeSeriesData[];
    productMetrics: ProductMetrics[];
    selectedPeriod: '7d' | '30d' | '90d' | '12m';
    onPeriodChange: (period: '7d' | '30d' | '90d' | '12m') => void;
    onRefresh?: () => void;
    isLoading?: boolean;
    lastUpdated?: string;
}

const AdminAnalyticsDashboardComponent: React.FC<AdminAnalyticsDashboardProps> = ({
    metrics,
    regionalData,
    timeSeriesData,
    productMetrics,
    selectedPeriod,
    onPeriodChange,
    onRefresh,
    isLoading = false,
    lastUpdated
}) => {
    const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'customers' | 'churn'>('revenue');

    // Calculate period labels
    const periodLabels = {
        '7d': 'Son 7 Gün',
        '30d': 'Son 30 Gün',
        '90d': 'Son 3 Ay',
        '12m': 'Son 12 Ay'
    };

    // Key metrics cards
    const keyMetrics = [
        {
            title: 'Toplam Gelir',
            value: formatCurrency(metrics.totalRevenue, metrics.currency),
            icon: CurrencyDollarIcon,
            color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
            change: metrics.growthRate,
            changeLabel: 'büyüme'
        },
        {
            title: 'Aylık Tekrarlayan Gelir (MRR)',
            value: formatCurrency(metrics.monthlyRecurringRevenue, metrics.currency),
            icon: ArrowTrendingUpIcon,
            color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
            change: metrics.growthRate,
            changeLabel: 'aylık büyüme'
        },
        {
            title: 'Yıllık Tekrarlayan Gelir (ARR)',
            value: formatCurrency(metrics.annualRecurringRevenue, metrics.currency),
            icon: ChartBarIcon,
            color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
            change: metrics.growthRate * 12,
            changeLabel: 'yıllık projeksiyon'
        },
        {
            title: 'Kullanıcı Başına Ortalama Gelir (ARPU)',
            value: formatCurrency(metrics.averageRevenuePerUser, metrics.currency),
            icon: UsersIcon,
            color: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30',
            subtitle: 'aylık ortalama'
        },
        {
            title: 'Müşteri Yaşam Boyu Değeri (CLV)',
            value: formatCurrency(metrics.customerLifetimeValue, metrics.currency),
            icon: ArrowTrendingUpIcon,
            color: 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/30',
            subtitle: 'tahmini değer'
        },
        {
            title: 'Churn Oranı',
            value: `${metrics.churnRate.toFixed(1)}%`,
            icon: ArrowTrendingDownIcon,
            color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
            change: -metrics.churnRate,
            changeLabel: 'aylık kayıp'
        }
    ];

    // Get region display name
    const getRegionName = (region: TaxRegion): string => {
        const regionNames: Record<TaxRegion, string> = {
            [TaxRegion.US]: 'Amerika',
            [TaxRegion.EU]: 'Avrupa',
            [TaxRegion.UK]: 'İngiltere',
            [TaxRegion.TR]: 'Türkiye',
            [TaxRegion.CA]: 'Kanada',
            [TaxRegion.AU]: 'Avustralya',
            [TaxRegion.JP]: 'Japonya',
            [TaxRegion.CH]: 'İsviçre',
            [TaxRegion.NONE]: 'Diğer'
        };

        return regionNames[region] || 'Bilinmiyor';
    };

    // Calculate chart data based on selected metric
    const chartData = useMemo(() => {
        return timeSeriesData.map(data => ({
            period: data.period,
            value: selectedMetric === 'revenue'
                ? data.revenue
                : selectedMetric === 'customers'
                    ? data.customers
                    : data.churn
        }));
    }, [timeSeriesData, selectedMetric]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <DocumentChartBarIcon className="w-8 h-8" />
                            Gelir Analiz Dashboard
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                            Detaylı gelir metrikleri ve iş analitiği
                        </p>
                        {lastUpdated && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Son güncelleme: {new Date(lastUpdated).toLocaleString('tr-TR')}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Period selector */}
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-gray-500" />
                            <select
                                value={selectedPeriod}
                                onChange={(e) => onPeriodChange(e.target.value as any)}
                                className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {Object.entries(periodLabels).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Refresh button */}
                        <button
                            onClick={onRefresh}
                            disabled={isLoading}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ArrowPathIcon className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                            Yenile
                        </button>
                    </div>
                </div>
            </div>

            {/* Key metrics cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {keyMetrics.map((metric, index) => (
                    <motion.div
                        key={metric.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                    {metric.title}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                    {metric.value}
                                </p>
                                {metric.change !== undefined && (
                                    <p className={`text-xs mt-1 flex items-center gap-1 ${metric.change >= 0
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-red-600 dark:text-red-400'
                                        }`}>
                                        {metric.change >= 0 ? (
                                            <ArrowTrendingUpIcon className="w-3 h-3" />
                                        ) : (
                                            <ArrowTrendingDownIcon className="w-3 h-3" />
                                        )}
                                        {Math.abs(metric.change).toFixed(1)}% {metric.changeLabel}
                                    </p>
                                )}
                                {metric.subtitle && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {metric.subtitle}
                                    </p>
                                )}
                            </div>
                            <div className={`p-3 rounded-full ${metric.color}`}>
                                <metric.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts and analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Time series chart */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Zaman Serisi Analizi
                        </h3>
                        <select
                            value={selectedMetric}
                            onChange={(e) => setSelectedMetric(e.target.value as any)}
                            className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="revenue">Gelir</option>
                            <option value="customers">Müşteri Sayısı</option>
                            <option value="churn">Churn Oranı</option>
                        </select>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="inline-flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                <span className="text-gray-600 dark:text-gray-300">Yükleniyor...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {chartData.map((data, index) => (
                                <div key={data.period} className="flex items-center gap-4">
                                    <div className="w-20 text-sm text-gray-600 dark:text-gray-300">
                                        {data.period}
                                    </div>
                                    <div className="flex-1">
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${(data.value / Math.max(...chartData.map(d => d.value))) * 100}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-24 text-right text-sm font-medium text-gray-900 dark:text-white">
                                        {selectedMetric === 'revenue'
                                            ? formatCurrency(data.value, metrics.currency)
                                            : selectedMetric === 'churn'
                                                ? `${data.value.toFixed(1)}%`
                                                : data.value.toLocaleString()
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Regional revenue breakdown */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <GlobeAltIcon className="w-5 h-5" />
                        Bölgesel Gelir Dağılımı
                    </h3>

                    <div className="space-y-4">
                        {regionalData.map((region, index) => (
                            <motion.div
                                key={region.region}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-gray-900 dark:text-white">
                                            {getRegionName(region.region)}
                                        </h4>
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            {region.percentage.toFixed(1)}%
                                        </span>
                                    </div>

                                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-700"
                                            style={{ width: `${region.percentage}%` }}
                                        />
                                    </div>

                                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                                        <span>{formatCurrency(region.revenue, metrics.currency)}</span>
                                        <span>{region.customerCount} müşteri</span>
                                        <span>Ort: {formatCurrency(region.averageValue, metrics.currency)}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Product performance */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Ürün Performansı
                </h3>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Ürün
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Gelir
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Abonelik
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Dönüşüm Oranı
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Churn Oranı
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {productMetrics.map((product, index) => (
                                <motion.tr
                                    key={product.productName}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        {product.productName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {formatCurrency(product.revenue, metrics.currency)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {product.subscriptions.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.conversionRate >= 15
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : product.conversionRate >= 10
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                            {product.conversionRate.toFixed(1)}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.churnRate <= 5
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : product.churnRate <= 10
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                            {product.churnRate.toFixed(1)}%
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Key insights */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Önemli İçgörüler
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                            Gelir Büyümesi
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            {metrics.growthRate >= 0 ? 'Pozitif' : 'Negatif'} büyüme trendi: %{Math.abs(metrics.growthRate).toFixed(1)}
                            {selectedPeriod === '12m' ? ' yıllık' : ' aylık'}
                        </p>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <h4 className="font-medium text-green-900 dark:text-green-200 mb-2">
                            Müşteri Değeri
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-300">
                            Ortalama CLV/ARPU oranı: {(metrics.customerLifetimeValue / metrics.averageRevenuePerUser).toFixed(1)}x
                        </p>
                    </div>

                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <h4 className="font-medium text-yellow-900 dark:text-yellow-200 mb-2">
                            Churn Durumu
                        </h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            Mevcut churn oranı: %{metrics.churnRate.toFixed(1)}
                            {metrics.churnRate <= 5 ? ' (Çok iyi)' : metrics.churnRate <= 10 ? ' (İyi)' : ' (Dikkat gerekli)'}
                        </p>
                    </div>

                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                        <h4 className="font-medium text-purple-900 dark:text-purple-200 mb-2">
                            Bölgesel Dağılım
                        </h4>
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                            En yüksek gelir: {getRegionName(regionalData[0]?.region)}
                            (%{regionalData[0]?.percentage.toFixed(1)})
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalyticsDashboardComponent;
