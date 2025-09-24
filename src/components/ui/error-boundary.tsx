'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * React Error Boundary for ArchBuilder.AI
 * Error handling ve graceful degradation için
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Error yakalandığında state'i güncelle
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Error'u log'la ve callback'i çağır
    console.error('Error Boundary yakaladı:', error, errorInfo);
    
    // Custom error handler varsa çağır
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Error'u analytics'e gönder
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'exception', {
        description: error.toString(),
        fatal: false
      });
    }

    this.setState({
      hasError: true,
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback component varsa kullan
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} />;
      }

      // Default error UI
      return <DefaultErrorUI error={this.state.error} errorInfo={this.state.errorInfo} />;
    }

    return this.props.children;
  }
}

/**
 * Default Error UI Component with i18n support
 */
function DefaultErrorUI({ error, errorInfo }: { error?: Error; errorInfo?: React.ErrorInfo }) {
  const { t } = useI18n();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {isMounted ? t('errorBoundaryTitle') : 'Oops! Something went wrong'}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {isMounted ? t('errorBoundaryMessage') : 'We\'re sorry, but something unexpected happened. Please try refreshing the page.'}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {isMounted ? t('errorBoundaryRefresh') : 'Refresh Page'}
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {isMounted ? t('errorBoundaryHome') : 'Go to Homepage'}
            </button>
          </div>
          
          {/* Development mode'da error detaylarını göster */}
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                {isMounted ? t('errorBoundaryShowDetails') : 'Show Error Details'}
              </summary>
              <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-gray-800 dark:text-gray-200 overflow-auto">
                <pre>{error.toString()}</pre>
                {errorInfo && (
                  <pre className="mt-2">{errorInfo.componentStack}</pre>
                )}
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * HOC: Component'i Error Boundary ile wrap et
 */
export function withErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: React.ComponentType<{ error?: Error }>,
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
) {
  const WrappedComponent = (props: T) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

/**
 * Minimal Error Fallback Component
 */
export function MinimalErrorFallback({ error }: { error?: Error }) {
  const { t } = useI18n();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div className="flex items-center">
        <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <p className="text-sm text-red-800 dark:text-red-200">
          {isMounted ? t('errorBoundaryTryAgain') : 'Something went wrong. Please try again.'}
        </p>
      </div>
    </div>
  );
}

/**
 * Section Error Fallback Component
 */
export function SectionErrorFallback({ error }: { error?: Error }) {
  const { t } = useI18n();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="w-full py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="text-center px-4">
        <div className="w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {isMounted ? t('errorBoundarySectionTitle') : 'Content Temporarily Unavailable'}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {isMounted ? t('errorBoundarySectionMessage') : 'This section is currently experiencing issues. Please try refreshing the page.'}
        </p>
        
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
        >
          {isMounted ? t('errorBoundaryRefresh') : 'Refresh Page'}
        </button>
      </div>
    </div>
  );
}