/**
 * Firebase Cost-Optimized Analytics
 * Lightweight tracking implementation for ArchBuilder.AI
 * Minimal bandwidth usage, maximum insight
 */

import React from 'react';

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
  enabled: process.env.NODE_ENV === 'production' && !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
};

// Analytics state
let clientId: string | null = null;
let sessionId: string | null = null;

/**
 * Initialize lightweight Firebase Analytics
 */
export const initializeFirebase = (): boolean => {
  if (typeof window === 'undefined' || !config.enabled) return false;
  
  // Generate client ID (persistent)
  clientId = localStorage.getItem('firebase_client_id');
  if (!clientId) {
    clientId = 'client_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('firebase_client_id', clientId);
  }
  
  // Generate session ID (per session)
  sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  
  return true;
};

/**
 * Send event to Firebase via Measurement Protocol
 * Cost-optimized: batched, minimal payload
 */
const sendEvent = async (eventName: string, parameters: Record<string, any>) => {
  if (!config.enabled || !clientId || !config.measurementId) return;
  
  // Rate limiting - max 10 events per minute
  const rateLimitKey = 'firebase_rate_limit';
  const now = Date.now();
  const rateLimitData = JSON.parse(localStorage.getItem(rateLimitKey) || '{"count": 0, "resetTime": 0}');
  
  if (now > rateLimitData.resetTime) {
    rateLimitData.count = 0;
    rateLimitData.resetTime = now + 60000; // 1 minute
  }
  
  if (rateLimitData.count >= 10) {
    console.warn('Firebase Analytics: Rate limit exceeded');
    return;
  }
  
  rateLimitData.count++;
  localStorage.setItem(rateLimitKey, JSON.stringify(rateLimitData));
  
  // Prepare minimal payload
  const payload = {
    client_id: clientId,
    session_id: sessionId,
    timestamp_micros: (now * 1000).toString(),
    events: [{
      name: eventName,
      params: {
        ...parameters,
        engagement_time_msec: 1000,
        session_id: sessionId
      }
    }]
  };
  
  try {
    // Use Measurement Protocol v2 (more efficient)
    await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${config.measurementId}&api_secret=${config.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.warn('Firebase Analytics: Network error', error);
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
  contactFormSubmit: (formType: 'contact' | 'newsletter' | 'demo') => {
    sendEvent('generate_lead', {
      form_type: formType,
      value: formType === 'demo' ? 100 : 10,
      currency: 'USD'
    });
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