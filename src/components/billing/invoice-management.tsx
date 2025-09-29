/**
 * Enhanced Invoice Management Component
 * Gelişmiş fatura yönetimi bileşeni
 */

'use client';

import {
    Invoice,
    InvoiceStatus,
    SupportedCurrency,
    formatCurrency
} from '@/types/stripe';
import {
    ArrowDownTrayIcon,
    CheckCircleIcon,
    ClockIcon,
    DocumentTextIcon,
    ExclamationCircleIcon,
    EyeIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

interface InvoiceManagementProps {
  invoices: Invoice[];
  isLoading?: boolean;
  onDownloadInvoice?: (invoiceId: string) => void;
  onViewInvoice?: (invoiceId: string) => void;
  onGenerateInvoice?: (type: 'subscription' | 'usage') => void;
  isGenerating?: boolean;
}

const InvoiceManagementComponent: React.FC<InvoiceManagementProps> = ({
  invoices,
  isLoading = false,
  onDownloadInvoice,
  onViewInvoice,
  onGenerateInvoice,
  isGenerating = false
}) => {
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  // Filter and sort invoices
  const filteredInvoices = invoices
    .filter(invoice => filterStatus === 'all' || invoice.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.dueDate || a.id).getTime();
        const dateB = new Date(b.dueDate || b.id).getTime();
        return dateB - dateA; // Newest first
      } else {
        return b.total - a.total; // Highest amount first
      }
    });

  // Get status display info
  const getStatusInfo = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.PAID:
        return {
          icon: CheckCircleIcon,
          color: 'text-green-600 bg-green-100',
          text: 'Ödendi'
        };
      case InvoiceStatus.OPEN:
        return {
          icon: ClockIcon,
          color: 'text-blue-600 bg-blue-100',
          text: 'Beklemede'
        };
      case InvoiceStatus.DRAFT:
        return {
          icon: DocumentTextIcon,
          color: 'text-gray-600 bg-gray-100',
          text: 'Taslak'
        };
      case InvoiceStatus.VOID:
        return {
          icon: ExclamationCircleIcon,
          color: 'text-red-600 bg-red-100',
          text: 'İptal'
        };
      case InvoiceStatus.UNCOLLECTIBLE:
        return {
          icon: ExclamationCircleIcon,
          color: 'text-red-600 bg-red-100',
          text: 'Tahsil Edilemez'
        };
      default:
        return {
          icon: DocumentTextIcon,
          color: 'text-gray-600 bg-gray-100',
          text: 'Bilinmiyor'
        };
    }
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Belirtilmemiş';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Fatura Yönetimi
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Faturalarınızı görüntüleyin, indirin ve yönetin
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Generate Invoice Button */}
            <div className="relative">
              <button
                onClick={() => onGenerateInvoice?.('subscription')}
                disabled={isGenerating}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <DocumentTextIcon className="w-4 h-4 mr-2" />
                    Fatura Oluştur
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Durum:
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as InvoiceStatus | 'all')}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Tümü</option>
              <option value={InvoiceStatus.PAID}>Ödendi</option>
              <option value={InvoiceStatus.OPEN}>Beklemede</option>
              <option value={InvoiceStatus.DRAFT}>Taslak</option>
              <option value={InvoiceStatus.VOID}>İptal</option>
              <option value={InvoiceStatus.UNCOLLECTIBLE}>Tahsil Edilemez</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sırala:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="date">Tarihe Göre</option>
              <option value="amount">Tutara Göre</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-600 dark:text-gray-300">
                Faturalar yükleniyor...
              </span>
            </div>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Fatura Bulunamadı
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {filterStatus !== 'all'
                ? `${filterStatus} durumunda fatura bulunmuyor.`
                : 'Henüz hiç faturanız yok.'
              }
            </p>
            {filterStatus !== 'all' && (
              <button
                onClick={() => setFilterStatus('all')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Tüm faturaları görüntüle
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInvoices.map((invoice, index) => {
              const statusInfo = getStatusInfo(invoice.status);
              const StatusIcon = statusInfo.icon;

              return (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Left side - Invoice info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Fatura #{invoice.invoiceNumber}
                        </h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.text}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <div>
                          <span className="font-medium">Tarih:</span>{' '}
                          {formatDate(invoice.dueDate)}
                        </div>
                        <div>
                          <span className="font-medium">Tutar:</span>{' '}
                          {formatCurrency(invoice.total, invoice.currency as SupportedCurrency)}
                        </div>
                        <div>
                          <span className="font-medium">Ödenen:</span>{' '}
                          {formatCurrency(invoice.amountPaid, invoice.currency as SupportedCurrency)}
                        </div>
                      </div>

                      {/* Line items preview */}
                      {invoice.lineItems && invoice.lineItems.length > 0 && (
                        <div className="mt-2 text-xs text-gray-500">
                          {invoice.lineItems.slice(0, 2).map((item, itemIndex) => (
                            <div key={itemIndex}>
                              {item.description} - {formatCurrency(item.amount, item.currency as SupportedCurrency)}
                            </div>
                          ))}
                          {invoice.lineItems.length > 2 && (
                            <div>... ve {invoice.lineItems.length - 2} kalem daha</div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex items-center gap-2">
                      {invoice.hostedInvoiceUrl && (
                        <button
                          onClick={() => onViewInvoice?.(invoice.id)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <EyeIcon className="w-4 h-4 mr-1" />
                          Görüntüle
                        </button>
                      )}

                      {invoice.invoicePdf && (
                        <button
                          onClick={() => onDownloadInvoice?.(invoice.id)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                          İndir
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary footer */}
      {filteredInvoices.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
            <div className="text-gray-600 dark:text-gray-300">
              Toplam {filteredInvoices.length} fatura görüntüleniyor
            </div>
            <div className="text-gray-900 dark:text-white font-medium">
              Toplam Tutar: {formatCurrency(
                filteredInvoices.reduce((sum, invoice) => sum + invoice.total, 0),
                filteredInvoices[0]?.currency as SupportedCurrency || SupportedCurrency.USD
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceManagementComponent;