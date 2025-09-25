/**
 * Health Check Monitoring for ArchBuilder.AI
 * Website uptime, performance ve availability monitoring
 */

import React from 'react';

// Analytics gtag type declaration
declare global {
  interface Window {
    gtag?: (command: string, eventName: string, parameters?: Record<string, unknown>) => void;
  }
}

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: {
    [key: string]: {
      status: 'pass' | 'fail' | 'warn';
      message: string;
      duration?: number;
      details?: Record<string, unknown>;
    };
  };
  metadata: {
    version: string;
    environment: string;
    buildTime: string;
    commitHash?: string;
  };
}

export interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  navigationTiming: PerformanceNavigationTiming;
}

class HealthMonitor {
  private baseUrl: string;
  private retryCount: number = 3;
  private timeout: number = 10000;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  }

  /**
   * Comprehensive health check
   */
  async performHealthCheck(): Promise<HealthCheckResult> {
    const startTime = performance.now();
    const timestamp = new Date().toISOString();
    
    const checks: HealthCheckResult['checks'] = {};
    
    // 1. Static asset check
    try {
      const assetCheck = await this.checkStaticAssets();
      checks['static_assets'] = {
        status: assetCheck.success ? 'pass' : 'fail',
        message: assetCheck.message,
        duration: assetCheck.duration
      };
    } catch (error) {
      checks['static_assets'] = {
        status: 'fail',
        message: `Static asset check failed: ${error}`,
        duration: performance.now() - startTime
      };
    }

    // 2. Core Web Vitals check
    try {
      const vitalsCheck = await this.checkCoreWebVitals();
      checks['core_web_vitals'] = {
        status: vitalsCheck.status,
        message: vitalsCheck.message,
        details: vitalsCheck.metrics
      };
    } catch (error) {
      checks['core_web_vitals'] = {
        status: 'fail',
        message: `Web vitals check failed: ${error}`
      };
    }

    // 3. External dependencies check
    try {
      const depsCheck = await this.checkExternalDependencies();
      checks['external_dependencies'] = {
        status: depsCheck.status,
        message: depsCheck.message,
        details: depsCheck.results
      };
    } catch (error) {
      checks['external_dependencies'] = {
        status: 'fail',
        message: `Dependencies check failed: ${error}`
      };
    }

    // 4. Local storage & consent check
    try {
      const storageCheck = await this.checkLocalStorage();
      checks['local_storage'] = {
        status: storageCheck.status,
        message: storageCheck.message
      };
    } catch (error) {
      checks['local_storage'] = {
        status: 'fail',
        message: `Storage check failed: ${error}`
      };
    }

    // Overall status determination
    const failedChecks = Object.values(checks).filter(check => check.status === 'fail').length;
    const warnChecks = Object.values(checks).filter(check => check.status === 'warn').length;
    
    let overallStatus: HealthCheckResult['status'];
    if (failedChecks > 0) {
      overallStatus = failedChecks > 1 ? 'unhealthy' : 'degraded';
    } else if (warnChecks > 0) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'healthy';
    }

    return {
      status: overallStatus,
      timestamp,
      checks,
      metadata: {
        version: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        buildTime: process.env.NEXT_PUBLIC_BUILD_TIME || timestamp,
        commitHash: process.env.NEXT_PUBLIC_COMMIT_HASH
      }
    };
  }

  /**
   * Static assets availability check
   */
  private async checkStaticAssets(): Promise<{ success: boolean; message: string; duration: number }> {
    const startTime = performance.now();
    const criticalAssets = [
      '/favicon.ico',
      '/manifest.json',
      '/robots.txt'
    ];

    const results = await Promise.allSettled(
      criticalAssets.map(asset => 
        fetch(`${this.baseUrl}${asset}`, { 
          method: 'HEAD',
          cache: 'no-cache'
        })
      )
    );

    const failed = results.filter(result => result.status === 'rejected').length;
    const duration = performance.now() - startTime;

    return {
      success: failed === 0,
      message: failed === 0 
        ? `All ${criticalAssets.length} critical assets are accessible`
        : `${failed}/${criticalAssets.length} critical assets failed to load`,
      duration
    };
  }

  /**
   * Core Web Vitals performance check
   */
  private async checkCoreWebVitals(): Promise<{ 
    status: 'pass' | 'warn' | 'fail'; 
    message: string; 
    metrics: Partial<PerformanceMetrics> 
  }> {
    if (typeof window === 'undefined') {
      return {
        status: 'warn',
        message: 'Web vitals check not available in server environment',
        metrics: {}
      };
    }

    const metrics: Partial<PerformanceMetrics> = {};
    
    // Navigation Timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart;
      metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
      metrics.navigationTiming = navigation;
    }

    // Core Web Vitals thresholds
    const thresholds = {
      loadTime: 3000, // 3 seconds
      domContentLoaded: 1500, // 1.5 seconds
      firstContentfulPaint: 1800, // 1.8 seconds
      largestContentfulPaint: 2500, // 2.5 seconds
      firstInputDelay: 100, // 100ms
      cumulativeLayoutShift: 0.1 // 0.1
    };

    let warnings = 0;
    let failures = 0;

    // Check each metric against thresholds
    Object.entries(thresholds).forEach(([metric, threshold]) => {
      const value = metrics[metric as keyof PerformanceMetrics];
      if (value !== undefined && typeof value === 'number') {
        if (value > threshold * 1.5) failures++;
        else if (value > threshold) warnings++;
      }
    });

    let status: 'pass' | 'warn' | 'fail';
    let message: string;

    if (failures > 0) {
      status = 'fail';
      message = `${failures} performance metrics exceed failure thresholds`;
    } else if (warnings > 0) {
      status = 'warn';
      message = `${warnings} performance metrics exceed warning thresholds`;
    } else {
      status = 'pass';
      message = 'All performance metrics within acceptable ranges';
    }

    return { status, message, metrics };
  }

  /**
   * External dependencies check
   */
  private async checkExternalDependencies(): Promise<{
    status: 'pass' | 'warn' | 'fail';
    message: string;
    results: { [key: string]: boolean };
  }> {
    const dependencies = [
      { name: 'Google Fonts', url: 'https://fonts.googleapis.com', timeout: 5000 },
      { name: 'Google Analytics', url: 'https://www.googletagmanager.com', timeout: 5000 }
    ];

    const results: { [key: string]: boolean } = {};
    
  for (const dep of dependencies) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), dep.timeout);
        
        await fetch(dep.url, {
          method: 'HEAD',
          signal: controller.signal,
          mode: 'no-cors'
        });
        
        clearTimeout(timeoutId);
        results[dep.name] = true;
      } catch (_error) {
        results[dep.name] = false;
      }
    }

    const failed = Object.values(results).filter(success => !success).length;
    
    let status: 'pass' | 'warn' | 'fail';
    let message: string;

    if (failed === 0) {
      status = 'pass';
      message = 'All external dependencies are accessible';
    } else if (failed <= dependencies.length / 2) {
      status = 'warn';
      message = `${failed}/${dependencies.length} external dependencies are not accessible`;
    } else {
      status = 'fail';
      message = `${failed}/${dependencies.length} external dependencies failed`;
    }

    return { status, message, results };
  }

  /**
   * Local storage and consent management check
   */
  private async checkLocalStorage(): Promise<{ status: 'pass' | 'warn' | 'fail'; message: string }> {
    if (typeof window === 'undefined') {
      return {
        status: 'warn',
        message: 'Local storage check not available in server environment'
      };
    }

    try {
      // Test localStorage availability
      const testKey = 'archbuilder_health_check';
      localStorage.setItem(testKey, 'test');
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);

      if (retrieved !== 'test') {
        return {
          status: 'fail',
          message: 'Local storage read/write test failed'
        };
      }

      // Check consent management state
      const consentData = localStorage.getItem('archbuilder_consent');
      const hasValidConsent = consentData && JSON.parse(consentData);

      return {
        status: 'pass',
        message: `Local storage functional, consent management ${hasValidConsent ? 'active' : 'pending'}`
      };
    } catch (error) {
      return {
        status: 'fail',
        message: `Local storage check failed: ${error}`
      };
    }
  }

  /**
   * Continuous monitoring with configurable intervals
   */
  startContinuousMonitoring(intervalMs: number = 300000): void { // Default 5 minutes
    if (typeof window === 'undefined') return;

    const monitor = async () => {
      try {
        const result = await this.performHealthCheck();
        
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Health Check Result:', result);
        }

        // Send to analytics if unhealthy
        if (result.status === 'unhealthy' && window.gtag) {
          window.gtag('event', 'health_check_failed', {
            event_category: 'monitoring',
            event_label: result.status,
            custom_parameters: {
              failed_checks: Object.entries(result.checks)
                .filter(([_, check]) => check.status === 'fail')
                .map(([name]) => name)
                .join(',')
            }
          });
        }

        // Store latest result
        localStorage.setItem('archbuilder_last_health_check', JSON.stringify({
          ...result,
          nextCheck: Date.now() + intervalMs
        }));

      } catch (error) {
        console.error('Health monitoring failed:', error);
      }
    };

    // Initial check
    monitor();
    
    // Set up interval
    setInterval(monitor, intervalMs);
  }
}

// Export singleton instance
export const healthMonitor = new HealthMonitor();

// Export health check hook for React components
export function useHealthCheck() {
  const [healthStatus, setHealthStatus] = React.useState<HealthCheckResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const runHealthCheck = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await healthMonitor.performHealthCheck();
      setHealthStatus(result);
    } catch (error) {
      console.error('Health check failed:', error);
      setHealthStatus(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    // Load cached result on mount
    const cached = localStorage.getItem('archbuilder_last_health_check');
    if (cached) {
      try {
        const data = JSON.parse(cached);
        if (data.nextCheck > Date.now()) {
          setHealthStatus(data);
        } else {
          runHealthCheck();
        }
      } catch {
        runHealthCheck();
      }
    } else {
      runHealthCheck();
    }
  }, [runHealthCheck]);

  return { healthStatus, isLoading, runHealthCheck };
}