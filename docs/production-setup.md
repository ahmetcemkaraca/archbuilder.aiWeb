# Production Environment Setup Guide

Bu rehber ArchBuilder.AI web sitesinin production ortamına deployment için gerekli konfigürasyonları içerir.

## Hosting Platform Options

### 1. Firebase Hosting (Recommended)
- **Avantajlar**: 
  - Global CDN
  - Automatic SSL
  - Custom domain support
  - Cost-effective (Firebase ile uyumlu)
  - Easy deployment

### 2. Vercel (Alternative)
- **Avantajlar**:
  - Next.js optimized
  - Automatic deployments
  - Edge functions
  - Built-in analytics

### 3. Netlify (Alternative)
- **Avantajlar**:
  - Static site optimization
  - Form handling
  - Branch previews
  - Edge functions

### 4. AWS CloudFront + S3 (Enterprise)
- **Avantajlar**:
  - Full control
  - Enterprise features
  - Global distribution
  - Cost optimization

## Domain Configuration

### DNS Setup
```bash
# A Record pointing to hosting provider
archbuilder.ai.           A      <hosting-ip>

# CNAME for www subdomain
www.archbuilder.ai.       CNAME  archbuilder.ai.

# CNAME for CDN (if applicable)
cdn.archbuilder.ai.       CNAME  <cdn-endpoint>
```

### Subdomain Structure
```
archbuilder.ai            # Main website
www.archbuilder.ai        # WWW redirect
api.archbuilder.ai        # API endpoints (future)
app.archbuilder.ai        # Desktop app downloads
docs.archbuilder.ai       # Documentation
blog.archbuilder.ai       # Blog (future)
```

## SSL Certificate Setup

### Automatic SSL (Recommended)
- Firebase Hosting: Automatic SSL provisioning
- Vercel: Automatic SSL via Let's Encrypt
- Netlify: Automatic SSL via Let's Encrypt

### Manual SSL Configuration
```bash
# For custom hosting providers
# Use Let's Encrypt or commercial certificates

# Generate Let's Encrypt certificate
certbot certonly --webroot \
  -w /var/www/archbuilder.ai \
  -d archbuilder.ai \
  -d www.archbuilder.ai
```

## CDN Configuration

### Firebase Hosting CDN
```json
{
  "hosting": {
    "public": "out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.@(html|json|xml|txt)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=3600, must-revalidate"
          }
        ]
      }
    ]
  }
}
```

### CloudFlare CDN Settings
```json
{
  "cache_level": "aggressive",
  "browser_cache_ttl": 31536000,
  "edge_cache_ttl": 86400,
  "always_online": true,
  "minify": {
    "css": true,
    "js": true,
    "html": true
  },
  "brotli": true,
  "rocket_loader": false,
  "mirage": true,
  "polish": "lossless"
}
```

## Environment Variables

### Production Environment (.env.production)
```env
# Domain Configuration
NEXT_PUBLIC_DOMAIN=https://archbuilder.ai
NEXT_PUBLIC_SITE_URL=https://archbuilder.ai
NEXT_PUBLIC_API_URL=https://api.archbuilder.ai/v1

# Analytics & Tracking
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_HOTJAR_ID=XXXXXXX
NEXT_PUBLIC_MIXPANEL_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Social Media Links
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/company/archbuilder-ai
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/archbuilder_ai
NEXT_PUBLIC_GITHUB_URL=https://github.com/archbuilder-ai
NEXT_PUBLIC_YOUTUBE_URL=https://youtube.com/c/archbuilder-ai

# Contact & Support
NEXT_PUBLIC_SUPPORT_EMAIL=support@archbuilder.ai
NEXT_PUBLIC_CONTACT_EMAIL=contact@archbuilder.ai
NEXT_PUBLIC_SALES_EMAIL=sales@archbuilder.ai

# Feature Flags
NEXT_PUBLIC_NEWSLETTER_ENABLED=true
NEXT_PUBLIC_CONTACT_FORM_ENABLED=true
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_COOKIE_CONSENT_ENABLED=true

# Performance & Security
NEXT_PUBLIC_CDN_URL=https://cdn.archbuilder.ai
NEXT_PUBLIC_IMAGE_OPTIMIZATION=true
NEXT_PUBLIC_SECURITY_HEADERS=true

# Monitoring & Health Checks
NEXT_PUBLIC_HEALTH_CHECK_ENABLED=true
NEXT_PUBLIC_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_ERROR_TRACKING=true
NEXT_PUBLIC_UPTIME_MONITORING=true

# Firebase Configuration (if using Firebase)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=archbuilder-ai-prod
NEXT_PUBLIC_FIREBASE_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=archbuilder-ai-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=archbuilder-ai-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_APP_ID=1:xxxxxxxxxxxx:web:xxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Security Environment Variables (CI/CD Secrets)
```env
# These should be set in CI/CD pipeline secrets
PRODUCTION_DOMAIN=archbuilder.ai
PRODUCTION_API_URL=https://api.archbuilder.ai/v1
PRODUCTION_GA_ID=G-XXXXXXXXXX

# Firebase Deployment Token
FIREBASE_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Slack Notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/xxx/xxx

# CodeCov Token
CODECOV_TOKEN=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## Performance Optimization

### Static Asset Configuration
```javascript
// next.config.ts production settings
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  images: {
    unoptimized: true,
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // Production webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Bundle splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
      
      // Tree shaking
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }
    
    return config;
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          }
        ]
      }
    ];
  }
};
```

### Caching Strategy
```javascript
// Cache headers for different asset types
const cacheHeaders = {
  // Static assets (images, fonts, etc.) - 1 year
  static: 'public, max-age=31536000, immutable',
  
  // CSS/JS bundles - 1 year with versioning
  bundles: 'public, max-age=31536000, immutable',
  
  // HTML files - 1 hour with revalidation
  html: 'public, max-age=3600, must-revalidate',
  
  // API responses - 5 minutes
  api: 'public, max-age=300, stale-while-revalidate=86400',
  
  // Dynamic content - no cache
  dynamic: 'no-cache, no-store, must-revalidate'
};
```

## Monitoring & Health Checks

### Production Monitoring Setup
```javascript
// Production monitoring configuration
const monitoringConfig = {
  healthChecks: {
    endpoint: 'https://archbuilder.ai/api/health',
    interval: 60000, // 1 minute
    timeout: 10000,  // 10 seconds
    retries: 3
  },
  
  performanceMonitoring: {
    enabled: true,
    sampleRate: 0.1, // 10% of users
    reportingInterval: 300000, // 5 minutes
    thresholds: {
      lcp: 2500,   // Largest Contentful Paint
      fid: 100,    // First Input Delay
      cls: 0.1     // Cumulative Layout Shift
    }
  },
  
  errorTracking: {
    enabled: true,
    sampleRate: 1.0, // Track all errors
    maxErrorsPerSession: 50,
    ignoreErrors: [
      /^Script error/,
      /^Non-Error promise rejection captured/,
      /^ResizeObserver loop limit exceeded/
    ]
  },
  
  uptimeMonitoring: {
    endpoints: [
      'https://archbuilder.ai',
      'https://archbuilder.ai/api/health',
      'https://api.archbuilder.ai/health'
    ],
    checkInterval: 300000, // 5 minutes
    alertThresholds: {
      responseTime: 5000,   // 5 seconds
      uptime: 99.9,         // 99.9% uptime
      errorRate: 0.01       // 1% error rate
    }
  }
};
```

### External Monitoring Services
```yaml
# Example monitoring services integration
services:
  uptime_monitoring:
    - pingdom: https://my.pingdom.com
    - uptimerobot: https://uptimerobot.com
    - statuscake: https://www.statuscake.com
  
  performance_monitoring:
    - lighthouse_ci: automated performance audits
    - web_vitals: real user monitoring
    - speedcurve: performance analytics
  
  error_tracking:
    - sentry: error tracking and performance
    - bugsnag: error monitoring
    - rollbar: real-time error tracking
  
  analytics:
    - google_analytics: user behavior
    - mixpanel: event tracking
    - hotjar: user experience
```

## Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] DNS records pointing to hosting provider
- [ ] SSL certificate provisioned
- [ ] CDN configuration tested
- [ ] Performance benchmarks recorded
- [ ] Security headers implemented
- [ ] Monitoring services configured

### Deployment Process
- [ ] Build production version locally
- [ ] Run lighthouse audit
- [ ] Validate static export
- [ ] Test on staging environment
- [ ] Deploy to production
- [ ] Verify DNS propagation
- [ ] Test SSL certificate
- [ ] Validate CDN caching
- [ ] Monitor initial performance metrics

### Post-Deployment
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Validate monitoring alerts
- [ ] Test all functionality
- [ ] Update status page
- [ ] Notify stakeholders

## Rollback Plan

### Quick Rollback Process
```bash
# Firebase Hosting rollback
firebase hosting:clone SITE_ID:SOURCE_VERSION SITE_ID:TARGET_VERSION

# Vercel rollback
vercel rollback [DEPLOYMENT_URL]

# Manual rollback (if using custom hosting)
# 1. Keep previous build artifacts
# 2. Switch DNS or load balancer
# 3. Restore from backup
```

### Rollback Triggers
- Error rate > 5%
- Page load time > 5 seconds
- Core Web Vitals failure
- Major functionality broken
- Security incident detected

This production setup ensures high availability, optimal performance, and comprehensive monitoring for the ArchBuilder.AI website.