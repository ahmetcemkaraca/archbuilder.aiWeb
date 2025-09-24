/**
 * Performance Monitoring Utilities
 * 
 * Core Web Vitals ve genel performance metrikleri için utilities
 */

export interface PerformanceMetrics {
  // Core Web Vitals
  fcp?: number;  // First Contentful Paint
  lcp?: number;  // Largest Contentful Paint
  cls?: number;  // Cumulative Layout Shift
  fid?: number;  // First Input Delay
  inp?: number;  // Interaction to Next Paint
  ttfb?: number; // Time to First Byte
  
  // Additional metrics
  domContentLoaded?: number;
  loadComplete?: number;
  bundleSize?: number;
  
  // User context
  userAgent?: string;
  connectionType?: string;
  deviceMemory?: number;
}

/**
 * Web Vitals ölçümü ve raporlama
 */
export function measureWebVitals(callback: (metrics: PerformanceMetrics) => void): void {
  // Performance Observer desteği kontrolü
  if (typeof window === 'undefined' || !window.PerformanceObserver) {
    return;
  }

  const metrics: PerformanceMetrics = {};
  
  // FCP (First Contentful Paint) ölçümü
  const fcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
    if (fcpEntry) {
      metrics.fcp = fcpEntry.startTime;
    }
  });
  
  try {
    fcpObserver.observe({ entryTypes: ['paint'] });
  } catch (e) {
    console.warn('FCP observer failed:', e);
  }

  // LCP (Largest Contentful Paint) ölçümü
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    if (lastEntry) {
      metrics.lcp = lastEntry.startTime;
    }
  });
  
  try {
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    console.warn('LCP observer failed:', e);
  }

  // CLS (Cumulative Layout Shift) ölçümü
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
      }
    }
    metrics.cls = clsValue;
  });
  
  try {
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    console.warn('CLS observer failed:', e);
  }

  // FID (First Input Delay) ölçümü
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const firstEntry = entries[0];
    if (firstEntry) {
      metrics.fid = (firstEntry as any).processingStart - firstEntry.startTime;
    }
  });
  
  try {
    fidObserver.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    console.warn('FID observer failed:', e);
  }

  // TTFB (Time to First Byte) ölçümü
  if (window.performance && window.performance.timing) {
    const navigationTiming = window.performance.timing;
    metrics.ttfb = navigationTiming.responseStart - navigationTiming.navigationStart;
  }

  // DOM ve Load event timing
  window.addEventListener('DOMContentLoaded', () => {
    metrics.domContentLoaded = performance.now();
  });

  window.addEventListener('load', () => {
    metrics.loadComplete = performance.now();
    
    // Device ve connection bilgilerini ekle
    if ('connection' in navigator) {
      metrics.connectionType = (navigator as any).connection?.effectiveType;
    }
    
    if ('deviceMemory' in navigator) {
      metrics.deviceMemory = (navigator as any).deviceMemory;
    }
    
    metrics.userAgent = navigator.userAgent;
    
    // Metrikleri callback ile gönder
    callback(metrics);
  });
}

/**
 * Bundle size analizi
 */
export function analyzeBundleSize(): Promise<{ totalSize: number; gzipSize: number }> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve({ totalSize: 0, gzipSize: 0 });
      return;
    }

    // Resource timing API ile bundle size analizi
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    let totalSize = 0;
    let estimatedGzipSize = 0;
    
    resources.forEach(resource => {
      if (resource.name.includes('.js') || resource.name.includes('.css')) {
        // Transfer size (compressed) ve decoded size
        totalSize += resource.decodedBodySize || 0;
        estimatedGzipSize += resource.transferSize || 0;
      }
    });
    
    resolve({
      totalSize,
      gzipSize: estimatedGzipSize
    });
  });
}

/**
 * Lighthouse-style performance scoring
 */
export function calculatePerformanceScore(metrics: PerformanceMetrics): number {
  const weights = {
    fcp: 0.1,
    lcp: 0.25,
    cls: 0.15,
    fid: 0.1,
    ttfb: 0.1,
    bundleSize: 0.3
  };
  
  // Threshold'lar (milliseconds ve bytes)
  const thresholds = {
    fcp: { good: 1800, poor: 3000 },
    lcp: { good: 2500, poor: 4000 },
    cls: { good: 0.1, poor: 0.25 },
    fid: { good: 100, poor: 300 },
    ttfb: { good: 800, poor: 1800 },
    bundleSize: { good: 200000, poor: 500000 } // 200KB - 500KB
  };
  
  let totalScore = 0;
  let totalWeight = 0;
  
  // Her metrik için score hesapla
  Object.entries(weights).forEach(([key, weight]) => {
    const value = metrics[key as keyof PerformanceMetrics];
    const threshold = thresholds[key as keyof typeof thresholds];
    
    if (value !== undefined && threshold && typeof value === 'number') {
      let score = 100;
      
      if (value <= threshold.good) {
        score = 100;
      } else if (value <= threshold.poor) {
        // Linear interpolation between good and poor
        score = 100 - ((value - threshold.good) / (threshold.poor - threshold.good)) * 50;
      } else {
        score = 50; // Poor score
      }
      
      totalScore += score * weight;
      totalWeight += weight;
    }
  });
  
  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
}

/**
 * Performance metrikleri localStorage'a kaydet
 */
export function savePerformanceMetrics(metrics: PerformanceMetrics): void {
  try {
    const timestamp = new Date().toISOString();
    const data = { ...metrics, timestamp };
    
    // Son 10 ölçümü sakla
    const existing = JSON.parse(localStorage.getItem('archbuilder_performance') || '[]');
    existing.push(data);
    
    if (existing.length > 10) {
      existing.shift(); // İlk elemanı çıkar
    }
    
    localStorage.setItem('archbuilder_performance', JSON.stringify(existing));
  } catch (e) {
    console.warn('Performance metrics save failed:', e);
  }
}

/**
 * Kaydedilmiş performance geçmişini getir
 */
export function getPerformanceHistory(): PerformanceMetrics[] {
  try {
    return JSON.parse(localStorage.getItem('archbuilder_performance') || '[]');
  } catch (e) {
    console.warn('Performance history fetch failed:', e);
    return [];
  }
}

/**
 * Performance raporunu konsola yazdır
 */
export function logPerformanceReport(metrics: PerformanceMetrics): void {
  const score = calculatePerformanceScore(metrics);
  
  console.group('🚀 ArchBuilder.AI Performance Report');
  console.log(`Overall Score: ${score}/100`);
  console.log('Core Web Vitals:');
  console.log(`  FCP: ${metrics.fcp?.toFixed(2)}ms`);
  console.log(`  LCP: ${metrics.lcp?.toFixed(2)}ms`);
  console.log(`  CLS: ${metrics.cls?.toFixed(3)}`);
  console.log(`  FID: ${metrics.fid?.toFixed(2)}ms`);
  console.log(`  TTFB: ${metrics.ttfb?.toFixed(2)}ms`);
  console.log('Additional Metrics:');
  console.log(`  DOM Ready: ${metrics.domContentLoaded?.toFixed(2)}ms`);
  console.log(`  Load Complete: ${metrics.loadComplete?.toFixed(2)}ms`);
  console.log(`  Connection: ${metrics.connectionType || 'unknown'}`);
  console.log(`  Device Memory: ${metrics.deviceMemory || 'unknown'}GB`);
  console.groupEnd();
}

/**
 * Real User Monitoring (RUM) için analytics gönderimi
 */
export function sendPerformanceData(metrics: PerformanceMetrics): void {
  // Google Analytics 4 event
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', 'web_vitals', {
      custom_parameter_1: metrics.fcp,
      custom_parameter_2: metrics.lcp,
      custom_parameter_3: metrics.cls,
      custom_parameter_4: metrics.fid,
    });
  }
  
  // Custom analytics endpoint (opsiyonel)
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
    fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'performance',
        metrics,
        url: window.location.href,
        timestamp: new Date().toISOString()
      })
    }).catch(e => console.warn('Analytics send failed:', e));
  }
}