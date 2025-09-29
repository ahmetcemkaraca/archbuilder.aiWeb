/**
 * Stripe Ödeme API Servisleri
 * Client-side ödeme işlemleri yönetimi
 */

import { createCheckoutOptions, getStripe, handleStripeError } from '@/lib/stripe-config';
import {
  BillingInterval,
  ExchangeRates,
  Invoice,
  MRRARRData,
  ONE_TIME_PRODUCTS,
  PaymentStatus,
  RegionalPricing,
  SUBSCRIPTION_PRICING,
  SubscriptionTier,
  SupportedCurrency,
  TaxRegion,
  UsageOverage,
  formatCurrency
} from '@/types/stripe';

// Environment variables helper
const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const getApiKey = () => process.env.NEXT_PUBLIC_API_KEY || '';

// Type guard for subscription pricing
const isValidPricing = (pricing: any): pricing is { monthlyPriceUsd: number; yearlyPriceUsd: number } => {
  return pricing &&
    typeof pricing.monthlyPriceUsd === 'number' &&
    typeof pricing.yearlyPriceUsd === 'number';
};

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
    // Backend API'ye istek gönder
    const response = await fetch(`${getApiUrl()}/v1/billing/create-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'X-API-Key': getApiKey(),
      },
      body: JSON.stringify({
        tier,
        billing_interval: billingInterval,
        success_url: options?.successUrl || `${window.location.origin}/subscription/success`,
        cancel_url: options?.cancelUrl || `${window.location.origin}/pricing`,
        trial_days: options?.trialDays
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { sessionId: null, error: errorData.detail || 'Abonelik oluşturulamadı' };
    }

    const data = await response.json();

    // Stripe Checkout'a yönlendir
    const stripe = await getStripe();
    if (!stripe) {
      return { sessionId: null, error: 'Stripe yüklenemedi' };
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId: data.session_id
    });

    if (error) {
      return { sessionId: null, error: handleStripeError(error) };
    }

    return { sessionId: data.session_id };
  } catch (error) {
    console.error('Abonelik checkout hatası:', error);
    return { sessionId: null, error: 'Ağ hatası - lütfen tekrar deneyin' };
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
    // Backend API'ye istek gönder
    const response = await fetch(`${getApiUrl()}/v1/billing/customer-portal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'X-API-Key': getApiKey(),
      },
      body: JSON.stringify({
        customer_id: customerId,
        return_url: returnUrl || window.location.origin
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { url: null, error: errorData.detail || 'Portal URL oluşturulamadı' };
    }

    const data = await response.json();
    return { url: data.url };
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

  if (!pricing || !isValidPricing(pricing)) {
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

// Kullanım istatistikleri
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
    // Backend API'den kullanım verilerini al
    const response = await fetch(`${getApiUrl()}/v1/billing/usage/${userId}?period=${period}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'X-API-Key': getApiKey(),
      }
    });

    if (!response.ok) {
      console.error('Usage stats API hatası:', response.status);
      // Hata durumunda default değerler döndür
      return {
        aiLayouts: 0,
        buildingScans: 0,
        apiCalls: 0,
        exports: 0,
        storageUsed: 0
      };
    }

    const data = await response.json();
    return {
      aiLayouts: data.ai_layouts || 0,
      buildingScans: data.building_scans || 0,
      apiCalls: data.api_calls || 0,
      exports: data.exports || 0,
      storageUsed: data.storage_used || 0
    };
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

// Multi-Currency Support Functions

// Get current exchange rates
export const getExchangeRates = async (
  baseCurrency: SupportedCurrency = SupportedCurrency.USD
): Promise<ExchangeRates | null> => {
  try {
    const response = await fetch(`${getApiUrl()}/v1/billing/currency/exchange-rates?base_currency=${baseCurrency}`, {
      method: 'GET',
      headers: {
        'X-API-Key': getApiKey(),
      }
    });

    if (!response.ok) {
      console.error('Exchange rates API hatası:', response.status);
      return null;
    }

    const data = await response.json();
    return {
      baseCurrency,
      rates: data.rates,
      timestamp: data.timestamp
    };
  } catch (error) {
    console.error('Exchange rates hatası:', error);
    return null;
  }
};

// Convert currency amounts
export const convertCurrency = async (
  amount: number,
  fromCurrency: SupportedCurrency,
  toCurrency: SupportedCurrency
): Promise<{ convertedAmount: number; conversionInfo: any } | null> => {
  try {
    const response = await fetch(`${getApiUrl()}/v1/billing/currency/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': getApiKey(),
      },
      body: JSON.stringify({
        amount,
        from_currency: fromCurrency,
        to_currency: toCurrency
      })
    });

    if (!response.ok) {
      console.error('Currency conversion API hatası:', response.status);
      return null;
    }

    const data = await response.json();
    return {
      convertedAmount: data.converted_amount,
      conversionInfo: data.conversion_info
    };
  } catch (error) {
    console.error('Currency conversion hatası:', error);
    return null;
  }
};

// Get regional pricing for subscription tiers
export const getRegionalPricing = async (
  subscriptionTier: SubscriptionTier,
  targetCurrency: SupportedCurrency = SupportedCurrency.USD,
  taxRegion: TaxRegion = TaxRegion.US,
  countryCode?: string
): Promise<RegionalPricing | null> => {
  try {
    const params = new URLSearchParams({
      subscription_tier: subscriptionTier,
      target_currency: targetCurrency,
      tax_region: taxRegion,
      ...(countryCode && { country_code: countryCode })
    });

    const response = await fetch(`${getApiUrl()}/v1/billing/pricing/regional?${params}`, {
      method: 'GET',
      headers: {
        'X-API-Key': getApiKey(),
      }
    });

    if (!response.ok) {
      console.error('Regional pricing API hatası:', response.status);
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Regional pricing hatası:', error);
    return null;
  }
};

// Detect user's region and currency
export const detectUserRegion = async (
  countryCode?: string,
  currency?: SupportedCurrency
): Promise<{ detectedRegion: TaxRegion; detectedCurrency: SupportedCurrency } | null> => {
  try {
    const params = new URLSearchParams({
      ...(countryCode && { country_code: countryCode }),
      ...(currency && { currency })
    });

    const response = await fetch(`${getApiUrl()}/v1/billing/regions/detect?${params}`, {
      method: 'GET',
      headers: {
        'X-API-Key': getApiKey(),
      }
    });

    if (!response.ok) {
      console.error('Region detection API hatası:', response.status);
      return null;
    }

    const data = await response.json();
    return {
      detectedRegion: data.detected_region as TaxRegion,
      detectedCurrency: data.detected_currency as SupportedCurrency
    };
  } catch (error) {
    console.error('Region detection hatası:', error);
    return null;
  }
};

// Enhanced Billing Functions

// Get user invoices
export const getUserInvoices = async (userId: string): Promise<Invoice[]> => {
  try {
    const response = await fetch(`${getApiUrl()}/v1/billing/invoices/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'X-API-Key': getApiKey(),
      }
    });

    if (!response.ok) {
      console.error('User invoices API hatası:', response.status);
      return [];
    }

    const data = await response.json();
    return data.invoices || [];
  } catch (error) {
    console.error('User invoices hatası:', error);
    return [];
  }
};

// Get usage overage information
export const getUserUsageOverage = async (userId: string): Promise<UsageOverage | null> => {
  try {
    const response = await fetch(`${getApiUrl()}/v1/billing/usage/${userId}/overage`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'X-API-Key': getApiKey(),
      }
    });

    if (!response.ok) {
      console.error('Usage overage API hatası:', response.status);
      return null;
    }

    const data = await response.json();
    return data.overage_data;
  } catch (error) {
    console.error('Usage overage hatası:', error);
    return null;
  }
};

// Generate invoice for user
export const generateInvoice = async (
  userId: string,
  invoiceType: 'subscription' | 'usage' = 'subscription'
): Promise<{ success: boolean; invoiceId?: string; error?: string }> => {
  try {
    const response = await fetch(`${getApiUrl()}/v1/billing/invoices/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'X-API-Key': getApiKey(),
      },
      body: JSON.stringify({
        user_id: userId,
        invoice_type: invoiceType
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.detail || 'Invoice oluşturulamadı' };
    }

    const data = await response.json();
    return {
      success: true,
      invoiceId: data.invoice_id
    };
  } catch (error) {
    console.error('Invoice generation hatası:', error);
    return { success: false, error: 'Ağ hatası - lütfen tekrar deneyin' };
  }
};

// Admin Functions (for dashboard)

// Get MRR/ARR analytics (admin only)
export const getMRRARRAnalytics = async (
  targetDate?: string
): Promise<MRRARRData | null> => {
  try {
    const params = targetDate ? `?target_date=${encodeURIComponent(targetDate)}` : '';
    const response = await fetch(`${getApiUrl()}/v1/billing/analytics/revenue/mrr-arr${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'X-API-Key': getApiKey(),
      }
    });

    if (!response.ok) {
      console.error('MRR/ARR analytics API hatası:', response.status);
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('MRR/ARR analytics hatası:', error);
    return null;
  }
};

// Get revenue dashboard (admin only)
export const getRevenueDashboard = async (): Promise<any | null> => {
  try {
    const response = await fetch(`${getApiUrl()}/v1/billing/analytics/revenue/dashboard`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'X-API-Key': getApiKey(),
      }
    });

    if (!response.ok) {
      console.error('Revenue dashboard API hatası:', response.status);
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Revenue dashboard hatası:', error);
    return null;
  }
};

// Client-side pricing calculation with currency support
export const calculateLocalizedPrice = (
  tier: SubscriptionTier,
  billingInterval: BillingInterval,
  currency: SupportedCurrency = SupportedCurrency.USD,
  exchangeRate: number = 1,
  regionalAdjustment: number = 1,
  discountPercent?: number
): {
  price: number;
  currency: SupportedCurrency;
  formatted: string;
  savings?: number;
} => {
  const pricing = SUBSCRIPTION_PRICING[tier];

  if (!pricing || !isValidPricing(pricing)) {
    return { price: 0, currency, formatted: formatCurrency(0, currency) };
  }

  let basePrice: number;
  let savings = 0;

  switch (billingInterval) {
    case BillingInterval.YEARLY:
      basePrice = pricing.yearlyPriceUsd;
      savings = (pricing.monthlyPriceUsd * 12) - pricing.yearlyPriceUsd;
      break;
    case BillingInterval.QUARTERLY:
      basePrice = pricing.monthlyPriceUsd * 3 * 0.95; // %5 indirim
      savings = (pricing.monthlyPriceUsd * 3) - basePrice;
      break;
    default:
      basePrice = pricing.monthlyPriceUsd;
  }

  // Regional adjustment
  basePrice *= regionalAdjustment;

  // Currency conversion
  basePrice *= exchangeRate;

  // Discount application
  if (discountPercent && discountPercent > 0) {
    basePrice *= (1 - discountPercent / 100);
  }

  const finalPrice = Math.round(basePrice * 100) / 100;
  const convertedSavings = savings * exchangeRate * regionalAdjustment;

  return {
    price: finalPrice,
    currency,
    formatted: formatCurrency(finalPrice, currency),
    savings: convertedSavings > 0 ? Math.round(convertedSavings * 100) / 100 : undefined
  };
};

// Get supported regions and currencies
export const getSupportedRegionsCurrencies = async (): Promise<{
  currencies: Array<{ code: SupportedCurrency; info: any }>;
  taxRegions: Array<{ code: TaxRegion; name: string; taxInfo: any }>;
  regionalAdjustments: Record<string, number>;
} | null> => {
  try {
    const response = await fetch(`${getApiUrl()}/v1/billing/regions/supported`, {
      method: 'GET',
      headers: {
        'X-API-Key': getApiKey(),
      }
    });

    if (!response.ok) {
      console.error('Supported regions API hatası:', response.status);
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Supported regions hatası:', error);
    return null;
  }
};
