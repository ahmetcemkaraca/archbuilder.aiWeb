/**
 * Stripe Configuration & Client Setup
 * ArchBuilder.AI için Stripe ödeme sistemi konfigürasyonu
 */

import { Stripe, loadStripe } from '@stripe/stripe-js';

// Stripe istemci promise'i (singleton pattern)
let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!publishableKey) {
      console.error('Stripe yayınlanabilir anahtarı bulunamadı');
      return null;
    }

    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

// Stripe konfigürasyon sabitleri
export const STRIPE_CONFIG = {
  // Test anahtarlarımızı üretim anahtarlarıyla değiştireceğiz
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  currency: 'usd',
  locale: 'auto' as const,
  
  // Ödeme yöntemleri
  paymentMethods: ['card', 'ideal', 'sepa_debit'] as const,
  
  // Görünüm özelleştirmesi
  appearance: {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#0570de',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '2px',
      borderRadius: '8px',
    },
  },
} as const;

// Stripe Elements konfigürasyonu
export const createStripeOptions = (amount: number, currency: string = 'usd') => ({
  mode: 'payment' as const,
  amount: Math.round(amount * 100), // Stripe cent cinsinden tutar bekler
  currency: currency.toLowerCase(),
  appearance: STRIPE_CONFIG.appearance,
  payment_method_types: STRIPE_CONFIG.paymentMethods,
});

// Abonelik için Stripe Options
export const createSubscriptionOptions = (priceId: string) => ({
  mode: 'subscription' as const,
  line_items: [
    {
      price: priceId,
      quantity: 1,
    },
  ],
  success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/subscription/canceled`,
  allow_promotion_codes: true,
});

// Tek seferlik ödeme için Checkout Session
export const createCheckoutOptions = (lineItems: Array<{ price: string; quantity: number }>) => ({
  mode: 'payment' as const,
  line_items: lineItems,
  success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/canceled`,
  allow_promotion_codes: true,
  shipping_address_collection: {
    allowed_countries: ['US', 'TR', 'GB', 'DE', 'FR', 'ES', 'IT'],
  },
});

// Hata yönetimi yardımcı fonksiyonları
export const handleStripeError = (error: any) => {
  console.error('Stripe hatası:', error);
  
  switch (error.type) {
    case 'card_error':
      return `Kart hatası: ${error.message}`;
    case 'validation_error':
      return `Doğrulama hatası: ${error.message}`;
    case 'api_connection_error':
      return 'Bağlantı hatası. Lütfen tekrar deneyin.';
    case 'api_error':
      return 'Sunucu hatası. Lütfen destek ekibi ile iletişime geçin.';
    case 'authentication_error':
      return 'Kimlik doğrulama hatası.';
    case 'rate_limit_error':
      return 'Çok fazla istek. Lütfen bir dakika bekleyin.';
    default:
      return error.message || 'Bilinmeyen bir hata oluştu.';
  }
};

// Stripe istemci durumunu kontrol etme yardımcısı
export const checkStripeReady = async (): Promise<boolean> => {
  try {
    const stripe = await getStripe();
    return stripe !== null;
  } catch (error) {
    console.error('Stripe hazır değil:', error);
    return false;
  }
};