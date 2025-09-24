# Cache Strategy for ArchBuilder.AI Website

## Overview
Bu dokuman static export için optimal caching stratejisini açıklar. Hosting provider'ınızda aşağıdaki cache rules'ları configure edin.

## File-Based Cache Rules

### 1. Static Assets - Long-term Caching (1 year)
```
/_next/static/**
/fonts/**
```
- **Cache-Control**: `public, max-age=31536000, immutable`
- **ETag**: `strong`
- **Compression**: `gzip, brotli`

### 2. Images and Media - Medium-term with Revalidation (30 days)
```
/images/**
/icons/**
/*.jpg
/*.jpeg
/*.png
/*.webp
/*.avif
/*.svg
```
- **Cache-Control**: `public, max-age=2592000, stale-while-revalidate=86400`
- **ETag**: `strong`
- **Compression**: `varies by format`

### 3. HTML Pages - Short-term with Revalidation (1 hour)
```
/*.html
/*/index.html
```
- **Cache-Control**: `public, max-age=3600, stale-while-revalidate=60`
- **ETag**: `weak`
- **Compression**: `gzip, brotli`

### 4. SEO Files - Daily Caching
```
/sitemap.xml
/robots.txt
/manifest.json
```
- **Cache-Control**: `public, max-age=86400, stale-while-revalidate=3600`
- **ETag**: `strong`
- **Compression**: `gzip, brotli`

### 5. CSS and JavaScript - Long-term Caching
```
/_next/static/css/**
/_next/static/chunks/**
/*.css
/*.js
```
- **Cache-Control**: `public, max-age=31536000, immutable`
- **ETag**: `strong`
- **Compression**: `gzip, brotli`

## Hosting Provider Specific Configurations

### Netlify (_headers file)
```
# Static assets
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
  
/images/*
  Cache-Control: public, max-age=2592000, stale-while-revalidate=86400
  
/*.html
  Cache-Control: public, max-age=3600, stale-while-revalidate=60
  
/sitemap.xml
  Cache-Control: public, max-age=86400, stale-while-revalidate=3600
```

### Vercel (vercel.json)
```json
{
  "headers": [
    {
      "source": "/_next/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control", 
          "value": "public, max-age=2592000, stale-while-revalidate=86400"
        }
      ]
    }
  ]
}
```

### Cloudflare Page Rules
1. **Static Assets**: `archbuilder.ai/_next/static/*`
   - Cache Level: Cache Everything
   - Edge Cache TTL: 1 month
   - Browser Cache TTL: 1 year

2. **Images**: `archbuilder.ai/images/*`
   - Cache Level: Cache Everything  
   - Edge Cache TTL: 1 month
   - Browser Cache TTL: 1 month

3. **HTML Pages**: `archbuilder.ai/*`
   - Cache Level: Cache Everything
   - Edge Cache TTL: 1 hour
   - Browser Cache TTL: 1 hour

### AWS CloudFront Distribution
```yaml
CacheBehaviors:
  - PathPattern: "_next/static/*"
    TargetOriginId: S3Origin
    ViewerProtocolPolicy: redirect-to-https
    CachePolicyId: "4135ea2d-6df8-44a3-9df3-4b5a84be39ad" # CachingOptimized
    
  - PathPattern: "images/*"  
    TargetOriginId: S3Origin
    ViewerProtocolPolicy: redirect-to-https
    CachePolicyId: "658327ea-f89d-4fab-a63d-7e88639e58f6" # CachingOptimizedForUncompressedObjects
```

## Cache Validation Strategy

### Performance Metrics
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s  
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

### Cache Hit Ratio Targets
- **Static Assets**: > 95%
- **Images**: > 90%
- **HTML Pages**: > 80%
- **Overall**: > 85%

### Monitoring
Use following tools to monitor cache performance:
- Google PageSpeed Insights
- GTmetrix 
- WebPageTest
- Browser DevTools Network tab
- CDN provider analytics

## Security Headers (Apply via hosting provider)

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

## Compression Settings

Enable compression for all text-based assets:
- **Gzip**: Minimum compression for compatibility
- **Brotli**: Preferred for modern browsers (20-25% better than gzip)

File types to compress:
- HTML, CSS, JavaScript
- JSON, XML
- SVG images
- Font files (WOFF, WOFF2)

## Notes
- Bu configuration'lar hosting provider'da manuel olarak set edilmelidir
- Next.js static export headers otomatik olarak apply edilmez
- CDN kullanırken edge caching rules'ları da configure edin
- Regular performance monitoring ile cache effectiveness'ini track edin