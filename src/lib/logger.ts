import React from 'react';

/**
 * Logger Utility for ArchBuilder.AI
 * Structured logging with environment-aware configuration
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
  correlationId?: string;
}

class Logger {
  private level: LogLevel;
  private isProduction: boolean;
  private sessionId: string;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.level = this.isProduction ? LogLevel.WARN : LogLevel.DEBUG;
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.level;
  }

  private formatMessage(entry: LogEntry): string {
    const { level, message, timestamp, context } = entry;
    const levelName = LogLevel[level];
    
    if (this.isProduction) {
      // Production: JSON formatında structured log
      return JSON.stringify({
        ...entry,
        level: levelName,
        sessionId: this.sessionId
      });
    } else {
      // Development: Readable format
      const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
      return `[${timestamp}] ${levelName}: ${message}${contextStr}`;
    }
  }

  private createEntry(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      context,
      error
    };

    // Browser environment'da ek bilgiler ekle
    if (typeof window !== 'undefined') {
      entry.url = window.location.href;
      entry.userAgent = navigator.userAgent;
    }

    return entry;
  }

  private log(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return;

    const formattedMessage = this.formatMessage(entry);

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
    }

    // Production'da external logging service'e gönder
    if (this.isProduction) {
      this.sendToExternalService(entry);
    }
  }

  private async sendToExternalService(entry: LogEntry): Promise<void> {
    try {
      // External logging service endpoint'i
      const endpoint = process.env.NEXT_PUBLIC_LOGGING_ENDPOINT;
      
      if (!endpoint) return;

      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      // Logging hatası durumunda console'a yaz
      console.error('Failed to send log to external service:', error);
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    const entry = this.createEntry(LogLevel.DEBUG, message, context);
    this.log(entry);
  }

  info(message: string, context?: Record<string, any>): void {
    const entry = this.createEntry(LogLevel.INFO, message, context);
    this.log(entry);
  }

  warn(message: string, context?: Record<string, any>): void {
    const entry = this.createEntry(LogLevel.WARN, message, context);
    this.log(entry);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    const entry = this.createEntry(LogLevel.ERROR, message, context, error);
    this.log(entry);
  }

  // Performance logging
  performanceLog(name: string, duration: number, context?: Record<string, any>): void {
    this.info(`Performance: ${name}`, {
      ...context,
      duration,
      type: 'performance'
    });
  }

  // User action logging
  userAction(action: string, context?: Record<string, any>): void {
    this.info(`User Action: ${action}`, {
      ...context,
      type: 'user_action'
    });
  }

  // Analytics event logging
  analyticsEvent(event: string, properties?: Record<string, any>): void {
    this.info(`Analytics: ${event}`, {
      ...properties,
      type: 'analytics'
    });
  }

  // API request logging
  apiRequest(method: string, url: string, statusCode?: number, duration?: number): void {
    const level = statusCode && statusCode >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    const entry = this.createEntry(level, `API Request: ${method} ${url}`, {
      method,
      url,
      statusCode,
      duration,
      type: 'api_request'
    });
    this.log(entry);
  }

  // Security event logging
  securityEvent(event: string, severity: 'low' | 'medium' | 'high' | 'critical', context?: Record<string, any>): void {
    const level = severity === 'critical' || severity === 'high' ? LogLevel.ERROR : LogLevel.WARN;
    const entry = this.createEntry(level, `Security: ${event}`, {
      ...context,
      severity,
      type: 'security'
    });
    this.log(entry);
  }
}

// Singleton instance
export const logger = new Logger();

// Performance measurement utility
export class PerformanceTimer {
  private startTime: number;
  private name: string;

  constructor(name: string) {
    this.name = name;
    this.startTime = performance.now();
  }

  end(context?: Record<string, any>): number {
    const duration = performance.now() - this.startTime;
    logger.performanceLog(this.name, duration, context);
    return duration;
  }
}

// HOC for component performance logging
export function withPerformanceLogging<T extends object>(
  Component: React.ComponentType<T>,
  componentName?: string
) {
  const WrappedComponent = (props: T) => {
    const name = componentName || Component.displayName || Component.name || 'Unknown';
    
    React.useEffect(() => {
      const timer = new PerformanceTimer(`Component Render: ${name}`);
      return () => {
        timer.end();
      };
    }, []);

    return React.createElement(Component, props);
  };

  WrappedComponent.displayName = `withPerformanceLogging(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook for logging user interactions
export function useInteractionLogger() {
  return {
    logClick: (element: string, context?: Record<string, any>) => {
      logger.userAction('click', { element, ...context });
    },
    logNavigation: (from: string, to: string) => {
      logger.userAction('navigation', { from, to });
    },
    logFormSubmission: (form: string, success: boolean, context?: Record<string, any>) => {
      logger.userAction('form_submission', { form, success, ...context });
    },
    logError: (error: Error, context?: Record<string, any>) => {
      logger.error('User-triggered error', error, context);
    }
  };
}

export default logger;