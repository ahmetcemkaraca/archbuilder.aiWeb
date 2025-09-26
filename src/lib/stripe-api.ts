/**
 * Stripe Ödeme API Servisleri
 * Client-side ödeme işlemleri yönetimi
 */

import { getStripe, handleStripeError, createCheckoutOptions, createSubscriptionOptions } from '@/lib/stripe-config';
import { 
  SubscriptionTier, 
  BillingInterval,
  PaymentStatus,
  SUBSCRIPTION_PRICING,
  ONE_TIME_PRODUCTS 
} from '@/types/stripe';

// Stripe Checkout Session oluşturma
export const createCheckoutSession = async (
  items: Array<{ productId: string; quantity?: number }>,
  options?: {
    customerId?: string;
    successUrl?: string;
    cancelUrl?: string;
    allowPromotionCodes?: boolean;
  }
): Promise<{ sessionId: string | null; error?: string }> => {
  try {
    // Static export olduğu için direkt Stripe Checkout'u kullanıyoruz
    const stripe = await getStripe();
    if (!stripe) {
      return { sessionId: null, error: 'Stripe yüklenemedi' };
    }

    // Line items'ları hazırla
    const lineItems = items.map(item => {
      const product = ONE_TIME_PRODUCTS.find(p => p.id === item.productId);
      if (!product?.stripePriceId) {
        throw new Error(`Ürün bulunamadı: ${item.productId}`);
      }
      
      return {
        price: product.stripePriceId,
        quantity: item.quantity || 1
      };
    });

    const sessionOptions = {
      ...createCheckoutOptions(lineItems),
      ...(options?.successUrl && { success_url: options.successUrl }),
      ...(options?.cancelUrl && { cancel_url: options.cancelUrl }),
      allow_promotion_codes: options?.allowPromotionCodes ?? true
    };

    // Stripe Checkout Session oluştur
    const { error } = await stripe.redirectToCheckout({
      lineItems: sessionOptions.line_items,
      mode: sessionOptions.mode,
      successUrl: sessionOptions.success_url,
      cancelUrl: sessionOptions.cancel_url
    });

    if (error) {
      return { sessionId: null, error: handleStripeError(error) };
    }

    return { sessionId: 'redirect_initiated' };
  } catch (error) {
    console.error('Checkout session oluşturma hatası:', error);
    return { sessionId: null, error: handleStripeError(error) };
  }
};

// Abonelik Checkout Session oluşturma
export const createSubscriptionCheckout = async (
  tier: SubscriptionTier,
  billingInterval: BillingInterval = BillingInterval.MONTHLY,
  options?: {
    customerId?: string;
    successUrl?: string;
    cancelUrl?: string;
    trialDays?: number;
  }
): Promise<{ sessionId: string | null; error?: string }> => {
  try {
    const stripe = await getStripe();
    if (!stripe) {
      return { sessionId: null, error: 'Stripe yüklenemedi' };
    }

    const pricing = SUBSCRIPTION_PRICING[tier];
    if (!pricing) {
      return { sessionId: null, error: 'Geçersiz abonelik planı' };
    }

    const priceId = pricing.stripePriceIds?.[billingInterval];
    if (!priceId) {
      return { sessionId: null, error: 'Fiyat ID bulunamadı' };
    }

    const sessionOptions = {
      ...createSubscriptionOptions(priceId),
      ...(options?.successUrl && { success_url: options.successUrl }),
      ...(options?.cancelUrl && { cancel_url: options.cancelUrl }),
      ...(options?.trialDays && { 
        subscription_data: { 
          trial_period_days: options.trialDays 
        } 
      })
    };

    // Stripe Checkout'a yönlendir
    const { error } = await stripe.redirectToCheckout({
      lineItems: sessionOptions.line_items,
      mode: sessionOptions.mode,
      successUrl: sessionOptions.success_url,
      cancelUrl: sessionOptions.cancel_url
    });

    if (error) {
      return { sessionId: null, error: handleStripeError(error) };
    }

    return { sessionId: 'subscription_redirect_initiated' };
  } catch (error) {
    console.error('Abonelik checkout hatası:', error);
    return { sessionId: null, error: handleStripeError(error) };
  }
};

// Checkout Session durumunu kontrol et
export const retrieveCheckoutSession = async (
  sessionId: string
): Promise<{ success: boolean; paymentStatus?: PaymentStatus; error?: string }> => {
  try {
    // Static export olduğu için localStorage'dan session bilgilerini alacağız
    const sessionData = localStorage.getItem(`stripe_session_${sessionId}`);
    
    if (!sessionData) {
      return { success: false, error: 'Session bulunamadı' };
    }

    const session = JSON.parse(sessionData);
    
    return {
      success: session.payment_status === 'paid',
      paymentStatus: session.payment_status === 'paid' ? PaymentStatus.SUCCESS : PaymentStatus.PENDING
    };
  } catch (error) {
    console.error('Session retrieval hatası:', error);
    return { success: false, error: handleStripeError(error) };
  }
};

// Müşteri portal URL'si oluştur (abonelik yönetimi için)
export const createCustomerPortalSession = async (
  customerId: string,
  returnUrl?: string
): Promise<{ url: string | null; error?: string }> => {
  try {
    // Static export olduğu için Stripe Customer Portal'ı direkt açacağız
    const portalUrl = `https://billing.stripe.com/p/login/test_your_portal_link`;
    
    // Gerçek implementasyonda burada API çağrısı olacak
    console.log('Customer Portal URL oluşturuluyor:', { customerId, returnUrl });
    
    return { url: portalUrl };
  } catch (error) {
    console.error('Customer portal hatası:', error);
    return { url: null, error: handleStripeError(error) };
  }
};

// Fiyat hesaplama yardımcıları
export const calculateSubscriptionPrice = (
  tier: SubscriptionTier,
  billingInterval: BillingInterval,
  discountPercent?: number
): { 
  price: number; 
  currency: string; 
  savings?: number;
  formattedPrice: string;
} => {
  const pricing = SUBSCRIPTION_PRICING[tier];
  
  if (!pricing || typeof pricing.monthlyPriceUsd !== 'number') {
    return { price: 0, currency: 'usd', formattedPrice: '$0' };
  }

  let price: number;
  let savings = 0;

  switch (billingInterval) {
    case BillingInterval.YEARLY:
      price = pricing.yearlyPriceUsd;
      savings = (pricing.monthlyPriceUsd * 12) - pricing.yearlyPriceUsd;
      break;
    case BillingInterval.QUARTERLY:
      price = pricing.monthlyPriceUsd * 3 * 0.95; // %5 indirim
      savings = (pricing.monthlyPriceUsd * 3) - price;
      break;
    default:
      price = pricing.monthlyPriceUsd;
  }

  // İndirim uygula
  if (discountPercent && discountPercent > 0) {
    price = price * (1 - discountPercent / 100);
  }

  return {
    price: Math.round(price * 100) / 100, // 2 decimal places
    currency: 'usd',
    savings: Math.round(savings * 100) / 100,
    formattedPrice: `$${price.toFixed(2)}`
  };
};

// Promo kod doğrulama (client-side mock)
export const validatePromoCode = async (
  code: string,
  _productId?: string
): Promise<{ 
  valid: boolean; 
  discount?: { type: 'percentage' | 'amount'; value: number }; 
  error?: string 
}> => {
  try {
    // Mock promo kodları (gerçek implementasyonda API çağrısı olacak)
    const mockPromoCodes: Record<string, { type: 'percentage' | 'amount'; value: number }> = {
      'WELCOME20': { type: 'percentage', value: 20 },
      'FIRST100': { type: 'amount', value: 100 },
      'STUDENT50': { type: 'percentage', value: 50 },
      'EARLY2024': { type: 'percentage', value: 30 }
    };

    const promoData = mockPromoCodes[code.toUpperCase()];
    
    if (!promoData) {
      return { valid: false, error: 'Geçersiz promo kodu' };
    }

    return {
      valid: true,
      discount: promoData
    };
  } catch (_error) {
    return { valid: false, error: 'Promo kod doğrulanamadı' };
  }
};

// Ödeme yöntemi kaydetme (gelecek kullanım için)
export const savePaymentMethod = async (
  paymentMethodId: string,
  customerId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Bu fonksiyon webhook veya server-side API ile implement edilecek
    console.log('Payment method kaydediliyor:', { paymentMethodId, customerId });
    
    // Mock başarı
    return { success: true };
  } catch (error) {
    return { success: false, error: handleStripeError(error) };
  }
};

// Kullanım istatistikleri (mock data)
export const getUserUsageStats = async (
  userId: string,
  period: string = new Date().toISOString().slice(0, 7) // YYYY-MM
): Promise<{
  aiLayouts: number;
  buildingScans: number; 
  apiCalls: number;
  exports: number;
  storageUsed: number;
}> => {
  try {
    // Mock usage data (gerçek implementasyonda Firebase'den gelecek)
    const mockUsage = {
      aiLayouts: Math.floor(Math.random() * 50),
      buildingScans: Math.floor(Math.random() * 10),
      apiCalls: Math.floor(Math.random() * 100),
      exports: Math.floor(Math.random() * 20),
      storageUsed: Math.floor(Math.random() * 1000) // MB
    };

    return mockUsage;
  } catch (error) {
    console.error('Usage stats hatası:', error);
    return {
      aiLayouts: 0,
      buildingScans: 0,
      apiCalls: 0,
      exports: 0,
      storageUsed: 0
    };
  }
};