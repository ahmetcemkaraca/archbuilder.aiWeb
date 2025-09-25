// Monitoring ve Health Check Utilities
// Performance monitoring, uptime tracking, error rate monitoring

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: {
    [key: string]: {
      status: 'pass' | 'fail' | 'warn';
      message: string;
      duration?: number;
  metadata?: Record<string, unknown>;
    };
  };
  overallHealth: number; // 0-100 score
}

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay  
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
  
  // Custom metrics
  pageLoadTime: number;
  domContentLoaded: number;
  resourceLoadTime: number;
  bundleSize: number;
  
  // User experience metrics
  navigationTiming: PerformanceNavigationTiming;
  timestamp: string;
  userAgent: string;
  url: string;
}

// Declare gtag for Google Analytics
declare global {
  function gtag(...args: unknown[]): void;
}

export interface ErrorMetrics {
  errorRate: number; // errors per session
  errorCount: number;
  errorTypes: {
    javascript: number;
    network: number;
    render: number;
    security: number;
  };
  topErrors: Array<{
    message: string;
    count: number;
    lastSeen: string;
    stack?: string;
  }>;
  timestamp: string;
}

export interface UptimeMetrics {
  uptime: number; // percentage
  responseTime: number; // average ms
  incidents: Array<{
    startTime: string;
    endTime?: string;
    severity: 'minor' | 'major' | 'critical';
    description: string;
    resolved: boolean;
  }>;
  slaCompliance: number; // percentage
}

class HealthCheckService {
  private checks: Map<string, () => Promise<unknown>> = new Map();
  
  constructor() {
    this.registerDefaultChecks();
  }
  
  private registerDefaultChecks() {
    // DOM Health Check
    this.registerCheck('dom-ready', async () => {
      return document.readyState === 'complete';
    });
    
    // JavaScript Runtime Check
    this.registerCheck('js-runtime', async () => {
      try {
        const testObj = { test: 'value' };
        JSON.stringify(testObj);
        return true;
      } catch (_error) {
        throw new Error(`JavaScript runtime error: ${_error}`);
      }
    });
    
    // Local Storage Check
    this.registerCheck('localStorage', async () => {
      try {
        const testKey = '__health_check__';
        localStorage.setItem(testKey, 'test');
        const retrieved = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);
        return retrieved === 'test';
      } catch (_error) {
        throw new Error('localStorage not available');
      }
    });
    
    // Network Connectivity Check  
    this.registerCheck('network', async () => {
      if (!navigator.onLine) {
        throw new Error('No network connectivity');
      }
      
      // Test connectivity with a lightweight request
      try {
        const response = await fetch('/favicon.ico', {
          method: 'HEAD',
          cache: 'no-cache'
        });
        return response.ok;
      } catch (_error) {
        throw new Error(`Network check failed: ${_error}`);
      }
    });
    
    // Performance API Check
    this.registerCheck('performance-api', async () => {
      return typeof performance !== 'undefined' && 
             typeof performance.mark === 'function';
    });
    
    // Theme System Check
    this.registerCheck('theme-system', async () => {
      const html = document.documentElement;
      return html.classList.contains('light') || html.classList.contains('dark');
    });
    
    // i18n System Check
    this.registerCheck('i18n-system', async () => {
      // Check if i18n context is available
      const langAttribute = document.documentElement.lang;
      const supportedLanguages = ['en', 'tr', 'ru', 'de', 'fr', 'es', 'it'];
      return supportedLanguages.includes(langAttribute);
    });
  }
  
  registerCheck(name: string, checkFunction: () => Promise<unknown>) {
    this.checks.set(name, checkFunction);
  }
  
  async runHealthCheck(): Promise<HealthCheckResult> {
    const timestamp = new Date().toISOString();
    const checks: HealthCheckResult['checks'] = {};
    let passCount = 0;
    let totalChecks = 0;
    
    for (const [name, checkFn] of this.checks) {
      totalChecks++;
      const startTime = performance.now();
      
      try {
        const result = await checkFn();
        const duration = performance.now() - startTime;
        
        if (result === true || result) {
          checks[name] = {
            status: 'pass',
            message: 'Check passed successfully',
            duration,
            metadata: (result && typeof result === 'object' && !Array.isArray(result)) 
              ? (result as Record<string, unknown>) 
              : undefined
          };
          passCount++;
        } else {
          checks[name] = {
            status: 'warn',
            message: 'Check returned falsy value',
            duration
          };
        }
      } catch (_error) {
        const duration = performance.now() - startTime;
        checks[name] = {
          status: 'fail',
          message: _error instanceof Error ? _error.message : 'Unknown error',
          duration
        };
      }
    }
    
    const healthScore = Math.round((passCount / totalChecks) * 100);
    let status: HealthCheckResult['status'];
    
    if (healthScore >= 90) status = 'healthy';
    else if (healthScore >= 70) status = 'degraded';
    else status = 'unhealthy';
    
    return {
      status,
      timestamp,
      checks,
      overallHealth: healthScore
    };
  }
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private observer: PerformanceObserver | null = null;
  
  constructor() {
    this.setupPerformanceObserver();
  }
  
  private setupPerformanceObserver() {
    if (typeof PerformanceObserver !== 'undefined') {
      this.observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'navigation') {
            this.recordNavigationMetrics(entry as PerformanceNavigationTiming);
          } else if (entry.entryType === 'paint') {
            this.recordPaintMetrics(entry as PerformancePaintTiming);
          } else if (entry.entryType === 'largest-contentful-paint') {
            this.recordLCPMetrics(entry as PerformanceEntry);
          }
        });
      });
      
      try {
        this.observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
      } catch (error) {
        console.warn('Performance observer setup failed:', error);
      }
    }
  }
  
  private recordNavigationMetrics(entry: PerformanceNavigationTiming) {
    const metrics: PerformanceMetrics = {
      lcp: 0, // Will be updated by LCP observer
      fid: 0, // Will be updated by FID measurement
      cls: 0, // Will be updated by CLS measurement
      fcp: 0, // Will be updated by paint observer
      ttfb: entry.responseStart - entry.requestStart,
      pageLoadTime: entry.loadEventEnd - entry.fetchStart,
      domContentLoaded: entry.domContentLoadedEventEnd - entry.fetchStart,
      resourceLoadTime: entry.loadEventEnd - entry.responseEnd,
      bundleSize: 0, // Will be calculated separately
      navigationTiming: entry,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    this.metrics.push(metrics);
    this.reportMetrics(metrics);
  }
  
  private recordPaintMetrics(entry: PerformancePaintTiming) {
    if (entry.name === 'first-contentful-paint') {
      const latestMetrics = this.metrics[this.metrics.length - 1];
      if (latestMetrics) {
        latestMetrics.fcp = entry.startTime;
      }
    }
  }
  
  private recordLCPMetrics(entry: PerformanceEntry) {
    const latestMetrics = this.metrics[this.metrics.length - 1];
    if (latestMetrics) {
      latestMetrics.lcp = entry.startTime;
    }
  }
  
  measureCLS(): Promise<number> {
    return new Promise((resolve) => {
  let clsValue = 0;
  let sessionValue = 0;
  let sessionEntries: PerformanceEntry[] = [];
      
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const e = entry as unknown as { hadRecentInput?: boolean; value?: number; startTime: number };
          if (!e.hadRecentInput) {
            const firstSessionEntry = sessionEntries[0];
            const lastSessionEntry = sessionEntries[sessionEntries.length - 1];
            
            if (sessionValue && 
                entry.startTime - lastSessionEntry.startTime < 1000 &&
                entry.startTime - firstSessionEntry.startTime < 5000) {
              sessionValue += (e.value ?? 0);
              sessionEntries.push(entry);
            } else {
              sessionValue = (e.value ?? 0);
              sessionEntries = [entry];
            }
            
            if (sessionValue > clsValue) {
              clsValue = sessionValue;
            }
          }
        }
      });
      
      observer.observe({ type: 'layout-shift', buffered: true });
      
      // Resolve after a reasonable time
      setTimeout(() => {
        observer.disconnect();
        resolve(clsValue);
      }, 5000);
    });
  }
  
  measureFID(): Promise<number> {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as unknown as { processingStart: number; startTime: number };
          const fidValue = fidEntry.processingStart - fidEntry.startTime;
          observer.disconnect();
          resolve(fidValue);
          return;
        }
      });
      
      observer.observe({ type: 'first-input', buffered: true });
      
      // Fallback if no interaction occurs
      setTimeout(() => {
        observer.disconnect();
        resolve(0);
      }, 10000);
    });
  }
  
  private reportMetrics(metrics: PerformanceMetrics) {
    // Send metrics to analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_metrics', {
        lcp: metrics.lcp,
        fcp: metrics.fcp,
        ttfb: metrics.ttfb,
        page_load_time: metrics.pageLoadTime,
        dom_content_loaded: metrics.domContentLoaded
      });
    }
    
    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Metrics:', metrics);
    }
  }
  
  getLatestMetrics(): PerformanceMetrics | null {
    return this.metrics[this.metrics.length - 1] || null;
  }
  
  getAverageMetrics(): Partial<PerformanceMetrics> | null {
    if (this.metrics.length === 0) return null;
    
    const totals = this.metrics.reduce((acc, metric) => ({
      lcp: acc.lcp + metric.lcp,
      fcp: acc.fcp + metric.fcp,
      ttfb: acc.ttfb + metric.ttfb,
      pageLoadTime: acc.pageLoadTime + metric.pageLoadTime,
      domContentLoaded: acc.domContentLoaded + metric.domContentLoaded
    }), { lcp: 0, fcp: 0, ttfb: 0, pageLoadTime: 0, domContentLoaded: 0 });
    
    const count = this.metrics.length;
    return {
      lcp: totals.lcp / count,
      fcp: totals.fcp / count,
      ttfb: totals.ttfb / count,
      pageLoadTime: totals.pageLoadTime / count,
      domContentLoaded: totals.domContentLoaded / count
    };
  }
}

class ErrorMonitor {
  private errors: Array<{ error: Error; timestamp: string; url: string }> = [];
  private errorCounts: Map<string, number> = new Map();
  
  constructor() {
    this.setupErrorHandlers();
  }
  
  private setupErrorHandlers() {
    // Global JavaScript errors
    window.addEventListener('error', (event) => {
      this.recordError(event.error || new Error(event.message), 'javascript');
    });
    
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.recordError(new Error(event.reason), 'javascript');
    });
    
    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        const target = event.target as { src?: string } | null;
        this.recordError(
          new Error(`Resource failed to load: ${target?.src || 'unknown'}`),
          'network'
        );
      }
    }, true);
  }
  
  private recordError(error: Error, type: string = 'javascript') {
    const timestamp = new Date().toISOString();
    const url = window.location.href;
    
    this.errors.push({ error, timestamp, url });
    
    // Count error occurrences
    const errorKey = `${error.name}: ${error.message}`;
    this.errorCounts.set(errorKey, (this.errorCounts.get(errorKey) || 0) + 1);
    
    // Report to analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        error_type: type
      });
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error recorded:', { error, type, timestamp, url });
    }
  }
  
  getErrorMetrics(): ErrorMetrics {
    const totalSessions = 1; // Simplified for client-side
    const errorCount = this.errors.length;
    
    const errorTypes = {
      javascript: 0,
      network: 0,
      render: 0,
      security: 0
    };
    
    // Categorize errors (simplified)
    this.errors.forEach(({ error }) => {
      if (error.message.includes('load')) {
        errorTypes.network++;
      } else if (error.message.includes('render') || error.message.includes('DOM')) {
        errorTypes.render++;
      } else if (error.message.includes('security') || error.message.includes('CSP')) {
        errorTypes.security++;
      } else {
        errorTypes.javascript++;
      }
    });
    
    const topErrors = Array.from(this.errorCounts.entries())
      .map(([message, count]) => ({
        message,
        count,
        lastSeen: this.errors.filter(e => `${e.error.name}: ${e.error.message}` === message)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]?.timestamp || '',
        stack: this.errors.find(e => `${e.error.name}: ${e.error.message}` === message)?.error.stack
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return {
      errorRate: errorCount / totalSessions,
      errorCount,
      errorTypes,
      topErrors,
      timestamp: new Date().toISOString()
    };
  }
}

class UptimeMonitor {
  private startTime: number = Date.now();
  private incidents: UptimeMetrics['incidents'] = [];
  private responseTimes: number[] = [];
  
  async checkEndpointHealth(url: string = window.location.origin): Promise<number> {
    const startTime = performance.now();
    
    try {
      await fetch(`${url}/favicon.ico`, {
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      const responseTime = performance.now() - startTime;
      this.responseTimes.push(responseTime);
      
      // Keep only last 100 response times
      if (this.responseTimes.length > 100) {
        this.responseTimes = this.responseTimes.slice(-100);
      }
      
      return responseTime;
    } catch (error) {
      this.recordIncident('Network connectivity issue', 'major');
      throw error;
    }
  }
  
  private recordIncident(description: string, severity: 'minor' | 'major' | 'critical') {
    this.incidents.push({
      startTime: new Date().toISOString(),
      severity,
      description,
      resolved: false
    });
  }
  
  getUptimeMetrics(): UptimeMetrics {
    const uptimeMs = Date.now() - this.startTime;
    
    // Calculate downtime from incidents
    const totalDowntime = this.incidents.reduce((total, incident) => {
      if (incident.endTime) {
        const downtime = new Date(incident.endTime).getTime() - new Date(incident.startTime).getTime();
        return total + downtime;
      }
      return total;
    }, 0);
    
    const uptimePercentage = Math.max(0, ((uptimeMs - totalDowntime) / uptimeMs) * 100);
    const averageResponseTime = this.responseTimes.length > 0 
      ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length 
      : 0;
    
    return {
      uptime: uptimePercentage,
      responseTime: averageResponseTime,
      incidents: [...this.incidents],
      slaCompliance: uptimePercentage >= 99.9 ? 100 : uptimePercentage
    };
  }
}

// Global monitoring instances
export const healthCheckService = new HealthCheckService();
export const performanceMonitor = new PerformanceMonitor();
export const errorMonitor = new ErrorMonitor();
export const uptimeMonitor = new UptimeMonitor();

// Monitoring dashboard data aggregator
export class MonitoringDashboard {
  async getAllMetrics() {
    const [healthCheck, errorMetrics, uptimeMetrics] = await Promise.all([
      healthCheckService.runHealthCheck(),
      Promise.resolve(errorMonitor.getErrorMetrics()),
      Promise.resolve(uptimeMonitor.getUptimeMetrics())
    ]);
    
    const performanceMetrics = performanceMonitor.getLatestMetrics();
    const averagePerformance = performanceMonitor.getAverageMetrics();
    
    // Measure current CLS and FID
    const [cls, fid] = await Promise.all([
      performanceMonitor.measureCLS(),
      performanceMonitor.measureFID()
    ]);
    
    return {
      health: healthCheck,
      performance: {
        current: performanceMetrics,
        average: averagePerformance,
        coreWebVitals: {
          cls,
          fid,
          lcp: performanceMetrics?.lcp || 0
        }
      },
      errors: errorMetrics,
      uptime: uptimeMetrics,
      timestamp: new Date().toISOString()
    };
  }
  
  async generateReport(): Promise<string> {
    const metrics = await this.getAllMetrics();
    
    return `
# Monitoring Report - ${new Date(metrics.timestamp).toLocaleDateString()}

## Health Status: ${metrics.health.status.toUpperCase()} (${metrics.health.overallHealth}%)

### Performance Metrics
- **LCP**: ${metrics.performance.coreWebVitals.lcp.toFixed(0)}ms
- **FID**: ${metrics.performance.coreWebVitals.fid.toFixed(0)}ms  
- **CLS**: ${metrics.performance.coreWebVitals.cls.toFixed(3)}
- **TTFB**: ${metrics.performance.current?.ttfb.toFixed(0) || 'N/A'}ms
- **Page Load**: ${metrics.performance.current?.pageLoadTime.toFixed(0) || 'N/A'}ms

### Error Metrics
- **Error Rate**: ${metrics.errors.errorRate.toFixed(3)} per session
- **Total Errors**: ${metrics.errors.errorCount}
- **JavaScript Errors**: ${metrics.errors.errorTypes.javascript}
- **Network Errors**: ${metrics.errors.errorTypes.network}

### Uptime Metrics  
- **Uptime**: ${metrics.uptime.uptime.toFixed(2)}%
- **Avg Response Time**: ${metrics.uptime.responseTime.toFixed(0)}ms
- **SLA Compliance**: ${metrics.uptime.slaCompliance.toFixed(2)}%
- **Active Incidents**: ${metrics.uptime.incidents.filter(i => !i.resolved).length}

### Health Check Details
${Object.entries(metrics.health.checks).map(([name, check]) => 
  `- **${name}**: ${check.status} - ${check.message} (${check.duration?.toFixed(0) || 'N/A'}ms)`
).join('\n')}
    `.trim();
  }
}

export const monitoringDashboard = new MonitoringDashboard();