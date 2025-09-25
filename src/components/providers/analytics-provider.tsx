'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Analytics Provider - Google Analytics 4 ve Firebase Analytics tracking
 * Production-ready tracking için global initialization
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Firebase Analytics'i başlat
    const initializeAnalytics = async () => {
      try {
        const { initializeFirebase, trackEvent } = await import('@/lib/firebase-analytics');
        
        // Firebase Analytics initialize et
        const initialized = initializeFirebase();
        
        if (initialized) {
          console.log('✅ Firebase Analytics başlatıldı');
          
          // İlk sayfa görüntüleme tracking'i
          trackEvent.pageView(pathname, document.title);
          
          // Performance monitoring
          const { performanceMonitor } = await import('@/lib/firebase-analytics');
          performanceMonitor.trackWebVitals();
          
        } else {
          console.log('⚠️  Firebase Analytics başlatılamadı (disabled veya config eksik)');
        }
        
      } catch (error) {
        console.error('❌ Analytics initialization failed:', error);
      }
    };

    // Page load'dan sonra initialize et
    if (typeof window !== 'undefined') {
      setTimeout(initializeAnalytics, 1000);
    }
  }, [pathname]);

  // Route change tracking
  useEffect(() => {
    const trackPageView = async () => {
      try {
        const { trackEvent } = await import('@/lib/firebase-analytics');
        trackEvent.pageView(pathname, document.title);
        
        // GA4 page view (gtag varsa)
        if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
          const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag!;
          gtag('config', process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, {
            page_path: pathname,
            page_title: document.title
          });
        }
        
      } catch (error) {
        console.log('Page view tracking failed:', error);
      }
    };

    trackPageView();
  }, [pathname]);

  // User engagement tracking
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const trackEngagement = async (action: string, target?: string) => {
      try {
        const { trackEvent } = await import('@/lib/firebase-analytics');
        trackEvent.engagement(action, target || 'unknown');
      } catch (error) {
        console.log('Engagement tracking failed:', error);
      }
    };

    // Click tracking
    const handleClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A') {
        const text = target.textContent?.substring(0, 50) || target.className;
        trackEngagement('click', text);
      }
    };

    // Scroll tracking
  let scrollTimer: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > 0 && scrollPercent % 25 === 0) {
          trackEngagement('scroll', `${scrollPercent}%`);
        }
      }, 1000);
    };

    // Event listeners
    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

  return <>{children}</>;
}

/**
 * Custom hook for manual event tracking
 */
export function useAnalytics() {
  const trackCustomEvent = async (eventName: string, parameters?: Record<string, unknown>) => {
    try {
      const { trackEvent } = await import('@/lib/firebase-analytics');
      
      // Firebase Analytics event
      if (eventName in trackEvent) {
        const fn = (trackEvent as unknown as Record<string, (p?: Record<string, unknown>) => void>)[eventName];
        if (typeof fn === 'function') {
          fn(parameters);
        }
      }
      
      // GA4 custom event
      if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
        const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag!;
        gtag('event', eventName, parameters);
      }
      
    } catch (error) {
      console.log('Custom event tracking failed:', error);
    }
  };

  const trackConversion = async (conversionType: string, value?: number) => {
    try {
      const { trackEvent } = await import('@/lib/firebase-analytics');
      
      // Firebase conversion
      const isValidFormType = (type: string): type is 'contact' | 'newsletter' | 'demo' | 'signup' =>
        ['contact', 'newsletter', 'demo', 'signup'].includes(type);
      const formType: 'contact' | 'newsletter' | 'demo' | 'signup' = isValidFormType(conversionType)
        ? conversionType
        : 'contact';
      trackEvent.contactFormSubmit(formType, true);
      
      // GA4 conversion
      if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
        const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag!;
        gtag('event', 'conversion', {
          conversion_type: conversionType,
          value: value || 0,
          currency: 'USD'
        });
      }
      
    } catch (error) {
      console.log('Conversion tracking failed:', error);
    }
  };

  return {
    trackCustomEvent,
    trackConversion
  };
}

/**
 * Analytics Debug Component (development only)
 */
export function AnalyticsDebug() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const checkAnalytics = async () => {
        try {
          const { costOptimization } = await import('@/lib/firebase-analytics');
          const stats = costOptimization.getUsageStats();
          
          console.log('🔍 Analytics Debug Info:', {
            ...stats,
            environment: process.env.NODE_ENV,
            measurement_id: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
            domain: window.location.origin
          });
        } catch (error) {
          console.error('Analytics debug failed:', error);
        }
      };

      setTimeout(checkAnalytics, 2000);
    }
  }, []);

  return null;
}