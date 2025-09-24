'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { 
  analytics, 
  consentManager, 
  trackPageView, 
  trackEvent,
  type AnalyticsEvent,
  type ConsentState 
} from '@/lib/analytics';

/**
 * Analytics Hook for ArchBuilder.AI
 * Component'lerde analytics kullanımı için
 */
export function useAnalytics() {
  const [hasConsent, setHasConsent] = useState(false);
  const [consentState, setConsentState] = useState<ConsentState | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Consent durumunu yükle
    const consent = consentManager.loadConsent();
    if (consent) {
      setConsentState(consent);
      setHasConsent(consent.analytics);
    }

    // Consent değişikliklerini dinle
    consentManager.onConsentChange((newConsent) => {
      setConsentState(newConsent);
      setHasConsent(newConsent.analytics);
    });
  }, []);

  // Page view tracking (route değişikliklerinde)
  useEffect(() => {
    if (hasConsent && pathname) {
      trackPageView(window.location.href, document.title);
    }
  }, [pathname, hasConsent]);

  // Convenience methods
  const track = {
    event: (event: AnalyticsEvent) => {
      if (hasConsent) {
        trackEvent(event);
      }
    },
    
    click: (elementName: string, category: string = 'ui') => {
      if (hasConsent) {
        trackEvent({
          action: 'click',
          category,
          label: elementName
        });
      }
    },
    
    formSubmit: (formName: string, success: boolean = true) => {
      if (hasConsent) {
        trackEvent({
          action: success ? 'form_submit_success' : 'form_submit_error',
          category: 'forms',
          label: formName,
          value: success ? 1 : 0
        });
      }
    },
    
    download: (fileName: string, fileType: string = 'unknown') => {
      if (hasConsent) {
        trackEvent({
          action: 'download',
          category: 'engagement',
          label: fileName,
          custom_parameters: {
            file_type: fileType
          }
        });
      }
    },
    
    videoPlay: (videoTitle: string) => {
      if (hasConsent) {
        trackEvent({
          action: 'video_play',
          category: 'video',
          label: videoTitle
        });
      }
    },
    
    scroll: (percentage: number) => {
      if (hasConsent) {
        trackEvent({
          action: 'scroll',
          category: 'engagement',
          label: `${percentage}%`,
          value: percentage
        });
      }
    },
    
    search: (searchTerm: string, resultsCount: number = 0) => {
      if (hasConsent) {
        trackEvent({
          action: 'search',
          category: 'engagement',
          label: searchTerm,
          value: resultsCount,
          custom_parameters: {
            search_term: searchTerm,
            results_count: resultsCount
          }
        });
      }
    },
    
    ctaClick: (ctaName: string, location: string) => {
      if (hasConsent) {
        trackEvent({
          action: 'cta_click',
          category: 'conversion',
          label: ctaName,
          custom_parameters: {
            cta_location: location
          }
        });
      }
    },
    
    newsletter: (action: 'subscribe' | 'unsubscribe', email?: string) => {
      if (hasConsent) {
        trackEvent({
          action: `newsletter_${action}`,
          category: 'conversion',
          label: action,
          custom_parameters: {
            has_email: email ? 'yes' : 'no'
          }
        });
      }
    }
  };

  return {
    hasConsent,
    consentState,
    track,
    // Direct access to managers
    analytics,
    consentManager
  };
}

/**
 * Consent Hook
 * Cookie banner ve consent management için
 */
export function useConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [consentState, setConsentState] = useState<ConsentState | null>(null);

  useEffect(() => {
    const consent = consentManager.loadConsent();
    
    if (!consent || consentManager.isConsentExpired()) {
      setShowBanner(true);
    } else {
      setConsentState(consent);
    }

    consentManager.onConsentChange((newConsent) => {
      setConsentState(newConsent);
      setShowBanner(false);
    });
  }, []);

  const acceptAll = () => {
    consentManager.saveConsent({
      analytics: true,
      marketing: true,
      personalization: true
    });
  };

  const acceptNecessary = () => {
    consentManager.saveConsent({
      analytics: false,
      marketing: false,
      personalization: false
    });
  };

  const acceptCustom = (consent: Partial<ConsentState>) => {
    consentManager.saveConsent(consent);
  };

  return {
    showBanner,
    consentState,
    acceptAll,
    acceptNecessary,
    acceptCustom,
    setShowBanner
  };
}

/**
 * Scroll Tracking Hook
 * Sayfa scroll'unu track eder
 */
export function useScrollTracking() {
  const { track } = useAnalytics();
  const [trackedPercentages, setTrackedPercentages] = useState<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      // Milestone'ları track et (25%, 50%, 75%, 100%)
      const milestones = [25, 50, 75, 100];
      
      for (const milestone of milestones) {
        if (scrollPercent >= milestone && !trackedPercentages.has(milestone)) {
          track.scroll(milestone);
          setTrackedPercentages(prev => new Set(prev).add(milestone));
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [track, trackedPercentages]);
}

/**
 * Performance Tracking Hook
 * Sayfa performance'ını track eder
 */
export function usePerformanceTracking() {
  const { track } = useAnalytics();

  useEffect(() => {
    // Page load time
    window.addEventListener('load', () => {
      setTimeout(() => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        
        track.event({
          action: 'page_load_time',
          category: 'performance',
          value: loadTime,
          custom_parameters: {
            load_time_ms: loadTime
          }
        });
      }, 0);
    });

    // Error tracking
    window.addEventListener('error', (event) => {
      track.event({
        action: 'javascript_error',
        category: 'error',
        label: event.message,
        custom_parameters: {
          filename: event.filename,
          line_number: event.lineno,
          column_number: event.colno
        }
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      track.event({
        action: 'unhandled_promise_rejection',
        category: 'error',
        label: event.reason?.toString() || 'Unknown error',
        custom_parameters: {
          reason: event.reason
        }
      });
    });
  }, [track]);
}