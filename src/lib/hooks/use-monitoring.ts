'use client';

import { useEffect, useState } from 'react';
import { 
  healthCheckService, 
  performanceMonitor, 
  errorMonitor, 
  uptimeMonitor,
  monitoringDashboard,
  type HealthCheckResult,
  type PerformanceMetrics,
  type ErrorMetrics,
  type UptimeMetrics
} from '@/lib/monitoring';

export interface MonitoringData {
  health: HealthCheckResult | null;
  performance: PerformanceMetrics | null;
  errors: ErrorMetrics | null;
  uptime: UptimeMetrics | null;
  isLoading: boolean;
  lastUpdated: Date | null;
}

export function useMonitoring(intervalMs: number = 30000): MonitoringData {
  const [data, setData] = useState<MonitoringData>({
    health: null,
    performance: null,
    errors: null,
    uptime: null,
    isLoading: true,
    lastUpdated: null
  });

  useEffect(() => {
    let isMounted = true;
    
    async function fetchMonitoringData() {
      if (!isMounted) return;
      
      try {
        const [health, performanceData, errors, uptime] = await Promise.all([
          healthCheckService.runHealthCheck(),
          Promise.resolve(performanceMonitor.getLatestMetrics()),
          Promise.resolve(errorMonitor.getErrorMetrics()),
          Promise.resolve(uptimeMonitor.getUptimeMetrics())
        ]);
        
        if (isMounted) {
          setData({
            health,
            performance: performanceData,
            errors,
            uptime,
            isLoading: false,
            lastUpdated: new Date()
          });
        }
      } catch (error) {
        console.error('Monitoring data fetch error:', error);
        if (isMounted) {
          setData(prev => ({
            ...prev,
            isLoading: false,
            lastUpdated: new Date()
          }));
        }
      }
    }
    
    // Initial fetch
    fetchMonitoringData();
    
    // Set up interval
    const interval = setInterval(fetchMonitoringData, intervalMs);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [intervalMs]);

  return data;
}

export function useHealthCheck(intervalMs: number = 60000) {
  const [healthData, setHealthData] = useState<HealthCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    let isMounted = true;
    
    async function runCheck() {
      if (!isMounted) return;
      
      try {
        const result = await healthCheckService.runHealthCheck();
        if (isMounted) {
          setHealthData(result);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Health check error:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    
    runCheck();
    const interval = setInterval(runCheck, intervalMs);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [intervalMs]);
  
  return { healthData, isLoading };
}

export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState<{
    current: PerformanceMetrics | null;
    average: Partial<PerformanceMetrics> | null;
    coreWebVitals: { lcp: number; fid: number; cls: number };
  }>({
    current: null,
    average: null,
    coreWebVitals: { lcp: 0, fid: 0, cls: 0 }
  });
  
  useEffect(() => {
    let isMounted = true;
    
    async function updateMetrics() {
      if (!isMounted) return;
      
      const current = performanceMonitor.getLatestMetrics();
      const average = performanceMonitor.getAverageMetrics();
      
      // Measure Core Web Vitals
      const [cls, fid] = await Promise.all([
        performanceMonitor.measureCLS(),
        performanceMonitor.measureFID()
      ]);
      
      if (isMounted) {
        setMetrics({
          current,
          average,
          coreWebVitals: {
            lcp: current?.lcp || 0,
            fid,
            cls
          }
        });
      }
    }
    
    // Initial measurement
    updateMetrics();
    
    // Update every 30 seconds
    const interval = setInterval(updateMetrics, 30000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);
  
  return metrics;
}

export function useErrorTracking() {
  const [errorData, setErrorData] = useState<ErrorMetrics | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    
    function updateErrorData() {
      if (!isMounted) return;
      
      const metrics = errorMonitor.getErrorMetrics();
      setErrorData(metrics);
    }
    
    // Initial update
    updateErrorData();
    
    // Update every minute
    const interval = setInterval(updateErrorData, 60000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);
  
  return errorData;
}

export function useUptimeMonitoring() {
  const [uptimeData, setUptimeData] = useState<UptimeMetrics | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    
    async function updateUptime() {
      if (!isMounted) return;
      
      try {
        // Check endpoint health
        await uptimeMonitor.checkEndpointHealth();
        
        const metrics = uptimeMonitor.getUptimeMetrics();
        if (isMounted) {
          setUptimeData(metrics);
        }
      } catch (error) {
        console.error('Uptime monitoring error:', error);
      }
    }
    
    // Initial check
    updateUptime();
    
    // Check every 5 minutes
    const interval = setInterval(updateUptime, 5 * 60 * 1000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);
  
  return uptimeData;
}

// Monitoring Dashboard Hook
export function useMonitoringDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [report, setReport] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    let isMounted = true;
    
    async function updateDashboard() {
      if (!isMounted) return;
      
      try {
        const [metrics, reportText] = await Promise.all([
          monitoringDashboard.getAllMetrics(),
          monitoringDashboard.generateReport()
        ]);
        
        if (isMounted) {
          setDashboardData(metrics);
          setReport(reportText);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Dashboard update error:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    
    updateDashboard();
    
    // Update every 2 minutes
    const interval = setInterval(updateDashboard, 2 * 60 * 1000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);
  
  return { dashboardData, report, isLoading };
}