/**
 * Payment Success Content Component
 * Stripe ödeme başarı içerik komponenti
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircleIcon, ArrowRightIcon, HomeIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface PaymentDetails {
  sessionId: string;
  amount: string;
  currency: string;
  customerEmail: string;
}

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    sessionId: '',
    amount: '',
    currency: '',
    customerEmail: ''
  });

  useEffect(() => {
    // URL parametrelerinden ödeme detaylarını al
    const sessionId = searchParams.get('session_id') || '';
    const amount = searchParams.get('amount') || '';
    const currency = searchParams.get('currency') || 'USD';
    const customerEmail = searchParams.get('customer_email') || '';
    
    setPaymentDetails({
      sessionId,
      amount,
      currency, 
      customerEmail
    });

    // Analitik olayını izle (opsiyonel)
    if (typeof window !== 'undefined' && (window as unknown as { gtag: Function }).gtag) {
      (window as unknown as { gtag: Function }).gtag('event', 'purchase', {
        event_category: 'ecommerce',
        transaction_id: sessionId,
        value: amount ? parseFloat(amount) / 100 : 0,
        currency: currency
      });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-24 h-24 mb-8"
          >
            <CheckCircleIcon className="w-full h-full text-green-500" />
          </motion.div>

          {/* Success Message */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Ödeme Başarılı!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8"
          >
            Siparişiniz başarıyla tamamlandı. Teşekkür ederiz!
          </motion.p>

          {/* Payment Details */}
          {paymentDetails.sessionId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8 max-w-md mx-auto"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <CreditCardIcon className="w-5 h-5 mr-2" />
                Ödeme Detayları
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Oturum ID:</span>
                  <span className="text-gray-900 dark:text-white font-mono">
                    {paymentDetails.sessionId.substring(0, 20)}...
                  </span>
                </div>
                
                {paymentDetails.amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Tutar:</span>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      ${(parseFloat(paymentDetails.amount) / 100).toFixed(2)} {paymentDetails.currency.toUpperCase()}
                    </span>
                  </div>
                )}
                
                {paymentDetails.customerEmail && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">E-posta:</span>
                    <span className="text-gray-900 dark:text-white">{paymentDetails.customerEmail}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 mb-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Sırada Ne Var?
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📧</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  E-postanızı Kontrol Edin
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Onay e-postası ve fatura gönderildi.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🚀</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Kullanmaya Başlayın
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Kontrol panelinize gidin ve projelerinizi oluşturun.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span>Kontrol Paneli</span>
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              <span>Ana Sayfa</span>
            </Link>
          </motion.div>

          {/* Support Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="text-sm text-gray-500 dark:text-gray-400 mt-8"
          >
            Herhangi bir sorunuz varsa{' '}
            <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
              destek ekibimiz
            </Link>
            {' '}ile iletişime geçin.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}