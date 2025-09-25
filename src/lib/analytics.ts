/**
 * Analytics & Tracking System for ArchBuilder.AI
 * 
 * Privacy-compliant analytics with GDPR/CCPA compliance
 * Google Analytics 4 integration with custom events
 */

// Types
interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, unknown>;
}

interface UserProperties {
  user_language?: string;
  user_country?: string;
  user_device_type?: string;
  user_browser?: string;
  subscription_status?: string;
}

interface ConversionEvent {
  event_name: string;
  currency?: string;
  value?: number;
  transaction_id?: string;
  items?: Array<{
    item_id: string;
    item_name: string;
    category: string;
    price: number;
    quantity: number;
  }>;
}

// Global analytics configuration
const ANALYTICS_CONFIG = {
  GA4_ID: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || '',
  GTM_ID: process.env.NEXT_PUBLIC_GTM_ID || '',
  PRIVACY_MODE: true,
  COOKIE_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN?.replace('https://', '') || 'archbuilder.ai',
  ANONYMIZE_IP: true,
  RESPECT_DNT: true, // Do Not Track header'ını respekt et
  CONSENT_REQUIRED: true
};

// Consent management
interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  timestamp: number;
}

/**
 * Consent Manager Class
 */
class ConsentManager {
  private static instance: ConsentManager;
  private consent: ConsentState | null = null;
  private consentCallbacks: Array<(consent: ConsentState) => void> = [];

  static getInstance(): ConsentManager {
    if (!ConsentManager.instance) {
      ConsentManager.instance = new ConsentManager();
    }
    return ConsentManager.instance;
  }

  // Consent durumunu localStorage'dan yükle
  loadConsent(): ConsentState | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem('archbuilder_consent');
      if (stored) {
        this.consent = JSON.parse(stored);
        return this.consent;
      }
    } catch (e) {
      console.warn('Consent loading failed:', e);
    }
    return null;
  }

  // Consent durumunu kaydet
  saveConsent(consent: Partial<ConsentState>): void {
    if (typeof window === 'undefined') return;

    this.consent = {
      analytics: consent.analytics || false,
      marketing: consent.marketing || false,
      personalization: consent.personalization || false,
      timestamp: Date.now()
    };

    try {
      localStorage.setItem('archbuilder_consent', JSON.stringify(this.consent));
      
      // Callback'leri çalıştır
      this.consentCallbacks.forEach(callback => callback(this.consent!));
      
      // Analytics'i başlat/durdur
      if (this.consent.analytics) {
        this.initializeAnalytics();
      } else {
        this.disableAnalytics();
      }
    } catch (e) {
      console.warn('Consent saving failed:', e);
    }
  }

  // Consent callback ekle
  onConsentChange(callback: (consent: ConsentState) => void): void {
    this.consentCallbacks.push(callback);
    
    // Mevcut consent varsa hemen çalıştır
    if (this.consent) {
      callback(this.consent);
    }
  }

  // Analytics için izin var mı?
  hasAnalyticsConsent(): boolean {
    return this.consent?.analytics || false;
  }

  // Marketing için izin var mı?
  hasMarketingConsent(): boolean {
    return this.consent?.marketing || false;
  }

  // Consent süresi dolmuş mu? (1 yıl)
  isConsentExpired(): boolean {
    if (!this.consent) return true;
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    return Date.now() - this.consent.timestamp > oneYear;
  }

  // Analytics'i başlat
  private initializeAnalytics(): void {
    if (!ANALYTICS_CONFIG.GA4_ID) return;

    // GA4 konfigürasyonu
    const gaConfig = {
      anonymize_ip: ANALYTICS_CONFIG.ANONYMIZE_IP,
      cookie_domain: ANALYTICS_CONFIG.COOKIE_DOMAIN,
      cookie_flags: 'SameSite=Strict;Secure',
      allow_google_signals: this.consent?.marketing || false,
      allow_ad_personalization_signals: this.consent?.marketing || false,
      send_page_view: true
    };

    // gtag komutları
    if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
      const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag!;
      gtag('config', ANALYTICS_CONFIG.GA4_ID, gaConfig);
      gtag('consent', 'update', {
        analytics_storage: this.consent?.analytics ? 'granted' : 'denied',
        ad_storage: this.consent?.marketing ? 'granted' : 'denied',
        personalization_storage: this.consent?.personalization ? 'granted' : 'denied'
      });
    }
  }

  // Analytics'i devre dışı bırak
  private disableAnalytics(): void {
    if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
      const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag!;
      gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        personalization_storage: 'denied'
      });
    }
  }
}

/**
 * Analytics Manager Class
 */
class AnalyticsManager {
  private static instance: AnalyticsManager;
  private consentManager: ConsentManager;
  private isInitialized = false;

  constructor() {
    this.consentManager = ConsentManager.getInstance();
  }

  static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  // Analytics'i başlat
  initialize(): void {
    if (this.isInitialized || typeof window === 'undefined') return;

    // Do Not Track kontrolü
    if (ANALYTICS_CONFIG.RESPECT_DNT && navigator.doNotTrack === '1') {
      console.log('Analytics disabled: Do Not Track enabled');
      return;
    }

    // Consent kontrol et
    const consent = this.consentManager.loadConsent();
    if (consent && !this.consentManager.isConsentExpired()) {
      if (consent.analytics) {
        this.loadGoogleAnalytics();
      }
    }

    this.isInitialized = true;
  }

  // Google Analytics script'ini yükle
  private loadGoogleAnalytics(): void {
    if (!ANALYTICS_CONFIG.GA4_ID) return;

    // GA4 script'ini yükle
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.GA4_ID}`;
    document.head.appendChild(script);

    // gtag function'ını tanımla
    (window as unknown as { dataLayer?: unknown[] }).dataLayer = (window as unknown as { dataLayer?: unknown[] }).dataLayer || [];
    (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag = function(...args: unknown[]) {
      (window as unknown as { dataLayer: unknown[] }).dataLayer.push(args);
    };

    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag!;
    gtag('js', new Date());
    
    // Consent mode başlat
    gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      personalization_storage: 'denied',
      wait_for_update: 2000
    });
  }

  // Event tracking
  trackEvent(event: AnalyticsEvent): void {
    if (!this.consentManager.hasAnalyticsConsent()) return;

    if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
      const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag!;
      gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters
      });
    }

    // Custom analytics endpoint (opsiyonel)
    this.sendToCustomEndpoint('event', event);
  }

  // Page view tracking
  trackPageView(url: string, title?: string): void {
    if (!this.consentManager.hasAnalyticsConsent()) return;

    if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
      const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag!;
      gtag('event', 'page_view', {
        page_title: title || document.title,
        page_location: url
      });
    }

    this.sendToCustomEndpoint('pageview', { url, title });
  }

  // Conversion tracking
  trackConversion(conversion: ConversionEvent): void {
    if (!this.consentManager.hasAnalyticsConsent()) return;

    if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
      const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag!;
      gtag('event', conversion.event_name, {
        currency: conversion.currency,
        value: conversion.value,
        transaction_id: conversion.transaction_id,
        items: conversion.items
      });
    }

    this.sendToCustomEndpoint('conversion', conversion);
  }

  // User properties set etme
  setUserProperties(properties: UserProperties): void {
    if (!this.consentManager.hasAnalyticsConsent()) return;

    if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
      const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag!;
      gtag('config', ANALYTICS_CONFIG.GA4_ID, {
        custom_map: properties
      });
    }
  }

  // Ecommerce tracking
  trackPurchase(transactionId: string, items: ConversionEvent['items'], value: number): void {
    this.trackConversion({
      event_name: 'purchase',
      currency: 'USD',
      value,
      transaction_id: transactionId,
      items
    });
  }

  // Form submission tracking
  trackFormSubmission(formName: string, success: boolean): void {
    this.trackEvent({
      action: success ? 'form_submit_success' : 'form_submit_error',
      category: 'forms',
      label: formName,
      value: success ? 1 : 0
    });
  }

  // Video tracking
  trackVideoEngagement(videoTitle: string, action: 'play' | 'pause' | 'complete', progress?: number): void {
    this.trackEvent({
      action: `video_${action}`,
      category: 'video',
      label: videoTitle,
      value: progress,
      custom_parameters: {
        video_title: videoTitle,
        video_progress: progress
      }
    });
  }

  // Custom endpoint'e gönderme (isteğe bağlı)
  private sendToCustomEndpoint(type: string, data: unknown): void {
    const endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
    if (!endpoint) return;

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        data,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        url: window.location.href
      })
    }).catch(e => console.warn('Custom analytics failed:', e));
  }
}

// Singleton instances
export const consentManager = ConsentManager.getInstance();
export const analytics = AnalyticsManager.getInstance();

// Convenience functions
export const trackEvent = (event: AnalyticsEvent) => analytics.trackEvent(event);
export const trackPageView = (url: string, title?: string) => analytics.trackPageView(url, title);
export const trackConversion = (conversion: ConversionEvent) => analytics.trackConversion(conversion);
export const setUserProperties = (properties: UserProperties) => analytics.setUserProperties(properties);

// Auto-initialize
if (typeof window !== 'undefined') {
  analytics.initialize();
}

// Export types
export type { AnalyticsEvent, UserProperties, ConversionEvent, ConsentState };