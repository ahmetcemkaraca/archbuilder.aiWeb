/**
 * Payment Canceled Page
 * Stripe ödeme iptal sayfası
 */

import React, { Suspense } from 'react';
import PaymentCanceledContent from './payment-canceled-content';

export default function PaymentCanceledPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Yükleniyor...</p>
        </div>
      </div>
    }>
      <PaymentCanceledContent />
    </Suspense>
  );
}