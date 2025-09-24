'use client';

import { useEffect, useState } from 'react';
import { 
  measureWebVitals, 
  analyzeBundleSize, 
  calculatePerformanceScore,
  savePerformanceMetrics,
  logPerformanceReport,
  type PerformanceMetrics 
} from '@/lib/performance';

interface UsePerformanceResult {
  metrics: PerformanceMetrics | null;
  score: number;
  isLoading: boolean;
  bundleSize: { totalSize: number; gzipSize: number } | null;
}

/**
 * Performance monitoring hook
 * Component'lerde performance tracking için kullanılır
 */
export function usePerformanceMonitoring(enabled: boolean = true): UsePerformanceResult {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bundleSize, setBundleSize] = useState<{ totalSize: number; gzipSize: number } | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    // Web Vitals ölçümünü başlat
    measureWebVitals((webVitalsMetrics) => {
      // Bundle size analizini de ekle
      analyzeBundleSize().then((bundleSizeData) => {
        const completeMetrics: PerformanceMetrics = {
          ...webVitalsMetrics,
          bundleSize: bundleSizeData.totalSize
        };

        // Score hesapla
        const performanceScore = calculatePerformanceScore(completeMetrics);
        
        // State'i güncelle
        setMetrics(completeMetrics);
        setScore(performanceScore);
        setBundleSize(bundleSizeData);
        setIsLoading(false);

        // Metrikleri kaydet ve logla
        savePerformanceMetrics(completeMetrics);
        
        // Development ortamında console'a yazdır
        if (process.env.NODE_ENV === 'development') {
          logPerformanceReport(completeMetrics);
        }
      });
    });

    // Cleanup yok çünkü observers sayfa yaşam döngüsü boyunca aktif kalmalı
  }, [enabled]);

  return {
    metrics,
    score,
    isLoading,
    bundleSize
  };
}

/**
 * Performance badge component hook
 * Performance score'u göstermek için
 */
export function usePerformanceBadge() {
  const { score, isLoading } = usePerformanceMonitoring();
  
  const getBadgeColor = (score: number): string => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getBadgeText = (score: number): string => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Needs Improvement';
    return 'Poor';
  };
  
  return {
    score,
    isLoading,
    badgeColor: getBadgeColor(score),
    badgeText: getBadgeText(score),
    showBadge: !isLoading && score > 0
  };
}