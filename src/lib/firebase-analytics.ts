/**
 * Firebase Analytics + Google Analytics 4 Integration
 * Production-ready tracking for ArchBuilder.AI
 * Real data collection with GA4 integration
 */

import React from 'react';
import { getAnalytics, logEvent, setUserProperties, setUserId, Analytics } from 'firebase/analytics';
import { app } from './firebase-config';

// Configuration
interface FirebaseConfig {
  projectId: string;
  measurementId: string;
  apiKey: string;
  enabled: boolean;
}

const config: FirebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  enabled: typeof window !== 'undefined' && !!process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Analytics instance
export let analytics: Analytics | null = null;

// Analytics state
let clientId: string | null = null;
let sessionId: string | null = null;

/**
 * Initialize Firebase Analytics with GA4
 */
export const initializeFirebase = (): boolean => {
  if (typeof window === 'undefined' || !config.enabled) return false;
  
  try {
    // Firebase Analytics'i başlat
    analytics = getAnalytics(app);
    
    // Client ID'yi oluştur (persistent)
    clientId = localStorage.getItem('firebase_client_id');
    if (!clientId) {
      clientId = 'client_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('firebase_client_id', clientId);
    }
    
    // Session ID (per session)
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    
    // User properties ayarla
    if (analytics) {
      setUserProperties(analytics, {
        'client_type': 'website_visitor',
        'visit_timestamp': new Date().toISOString(),
        'user_language': navigator.language || 'en',
        'screen_resolution': `${screen.width}x${screen.height}`
      });
    }
    
    console.log('✅ Firebase Analytics initialized with GA4');
    return true;
    
  } catch (error) {
    console.error('❌ Firebase Analytics initialization failed:', error);
    return false;
  }
};

/**
 * Send event to Firebase Analytics & GA4
 * Production-ready event tracking
 */
const sendEvent = async (eventName: string, parameters: Record<string, any>) => {
  if (!config.enabled || !analytics) return;
  
  try {
    // Firebase Analytics event'i gönder
    await logEvent(analytics, eventName, {
      ...parameters,
      session_id: sessionId,
      client_id: clientId,
      timestamp: Date.now(),
      page_location: window.location.href,
      page_title: document.title
    });
    
    console.log(`🔥 GA4 Event: ${eventName}`, parameters);
    
  } catch (error) {
    console.error('❌ Firebase Analytics event error:', error);
  }
};

/**
 * Cost-optimized event tracking
 */
export const trackEvent = {
  // Core events - always track
  pageView: (pagePath: string, pageTitle: string) => {
    sendEvent('page_view', {
      page_title: pageTitle,
      page_location: window.location.href,
      page_path: pagePath
    });
  },

  // High-value events - business critical
  contactFormSubmit: (formType: 'contact' | 'newsletter' | 'demo' | 'signup', success: boolean = true) => {
    const eventValue = {
      contact: 25,
      newsletter: 10,
      demo: 100,
      signup: 50
    };
    
    if (success) {
      sendEvent('generate_lead', {
        form_type: formType,
        value: eventValue[formType],
        currency: 'USD',
        success: true
      });
      
      // Conversion event de gönder
      sendEvent('conversion', {
        conversion_type: `${formType}_submit`,
        value: eventValue[formType],
        currency: 'USD'
      });
    } else {
      sendEvent('form_error', {
        form_type: formType,
        error_type: 'submission_failed'
      });
    }
  },

  // Promo code usage tracking
  promoCodeUsage: (promoCode: string, success: boolean, email?: string) => {
    sendEvent('promo_code_used', {
      promo_code: promoCode,
      success: success,
      user_email_hash: email ? btoa(email).substring(0, 8) : null
    });
    
    if (success) {
      sendEvent('conversion', {
        conversion_type: 'promo_code_success',
        value: 25,
        currency: 'USD',
        promo_code: promoCode
      });
    }
  },

  // User engagement - sampled (20%)
  engagement: (action: string, section: string) => {
    if (Math.random() > 0.2) return;
    sendEvent('user_engagement', {
      engagement_action: action,
      engagement_section: section
    });
  },

  // Language changes
  languageChange: (toLang: string) => {
    sendEvent('select_content', {
      content_type: 'language',
      content_id: toLang
    });
  },

  // Demo requests
  demoRequest: (type: string) => {
    sendEvent('select_promotion', {
      promotion_name: `demo_${type}`,
      creative_name: type
    });
  },

  // Errors - sampled (10%)
  error: (errorType: string, errorMessage: string) => {
    if (Math.random() > 0.1) return;
    sendEvent('exception', {
      description: errorMessage.substring(0, 100),
      fatal: false,
      error_type: errorType
    });
  }
};

/**
 * Performance monitoring (lightweight)
 */
export const performanceMonitor = {
  trackWebVitals: () => {
    if (typeof window === 'undefined') return;
    
    new Promise((resolve) => {
      if (document.readyState === 'complete') {
        resolve(null);
      } else {
        window.addEventListener('load', () => resolve(null));
      }
    }).then(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
        
        // Only send if performance is poor (cost optimization)
        if (loadTime > 3000 || domContentLoaded > 1500) {
          sendEvent('page_performance', {
            load_time: Math.round(loadTime),
            dom_content_loaded: Math.round(domContentLoaded),
            performance_grade: loadTime > 5000 ? 'poor' : 'needs_improvement'
          });
        }
      }
    });
  }
};

/**
 * React hook for Firebase Analytics
 */
export const useFirebaseAnalytics = () => {
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    const initialized = initializeFirebase();
    setIsInitialized(initialized);
    
    if (initialized) {
      // Track user type
      const visitCount = parseInt(localStorage.getItem('visit_count') || '0') + 1;
      localStorage.setItem('visit_count', visitCount.toString());
      
      // Track performance (only for first 5 visits)
      if (visitCount <= 5) {
        performanceMonitor.trackWebVitals();
      }
    }
  }, []);

  return {
    isInitialized,
    trackEvent: isInitialized ? trackEvent : null,
    performanceMonitor: isInitialized ? performanceMonitor : null
  };
};

/**
 * Cost monitoring utilities
 */
export const costOptimization = {
  getDailyEventCount: (): number => {
    const today = new Date().toDateString();
    return parseInt(localStorage.getItem(`firebase_events_${today}`) || '0');
  },

  estimateMonthlyCost: (): number => {
    return 0; // Firebase Analytics is free!
  },

  getUsageStats: () => ({
    dailyEvents: costOptimization.getDailyEventCount(),
    rateLimitStatus: JSON.parse(localStorage.getItem('firebase_rate_limit') || '{"count": 0}'),
    clientId,
    sessionId,
    isEnabled: config.enabled
  })
};

/**
 * Debug mode for development
 */
export const analyticsDebug = {
  enable: () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔥 Firebase Analytics Debug Mode Enabled');
      console.log('Config:', { projectId: config.projectId, enabled: config.enabled, clientId, sessionId });
    }
  },

  logEvent: (eventName: string, parameters: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔥 Analytics Event: ${eventName}`, parameters);
    }
  }
};

// Auto-initialize in production
if (typeof window !== 'undefined' && config.enabled) {
  setTimeout(initializeFirebase, 1000);
}

export default {
  initializeFirebase,
  trackEvent,
  performanceMonitor,
  useFirebaseAnalytics,
  costOptimization,
  analyticsDebug
};