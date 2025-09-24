# Pre-Launch Testing Guide

Bu rehber ArchBuilder.AI web sitesinin canlıya alınmadan önce yapılması gereken tüm test süreçlerini kapsar.

## Cross-Device Testing

### Desktop Browsers
```yaml
Windows:
  - Chrome 91+ (Latest)
  - Firefox 89+ (Latest)
  - Edge 91+ (Latest)
  - Opera 77+ (Latest)

macOS:
  - Safari 14+ (Latest)
  - Chrome 91+ (Latest)
  - Firefox 89+ (Latest)

Linux:
  - Chrome 91+ (Latest)
  - Firefox 89+ (Latest)
```

### Mobile Devices
```yaml
iOS:
  - Safari (iOS 14+)
  - Chrome (iOS 14+)
  - Firefox (iOS 14+)
  
Android:
  - Chrome (Android 8+)
  - Samsung Internet
  - Firefox (Android 8+)
  
Tablets:
  - iPad (iOS 14+)
  - Android Tablets (Android 8+)
```

### Screen Resolutions
```yaml
Desktop:
  - 1920x1080 (Full HD)
  - 2560x1440 (QHD)
  - 3840x2160 (4K)
  - 1366x768 (Laptop)
  - 1440x900 (MacBook)

Mobile:
  - 390x844 (iPhone 12/13/14)
  - 414x896 (iPhone 11/XR)
  - 375x667 (iPhone SE)
  - 360x640 (Android Common)
  - 412x915 (Pixel)

Tablet:
  - 768x1024 (iPad)
  - 834x1194 (iPad Air)
  - 1024x1366 (iPad Pro)
  - 800x1280 (Android Tablet)
```

## Performance Testing

### Core Web Vitals Targets
```yaml
Largest Contentful Paint (LCP):
  - Good: < 2.5s
  - Needs Improvement: 2.5s - 4.0s
  - Poor: > 4.0s

First Input Delay (FID):
  - Good: < 100ms
  - Needs Improvement: 100ms - 300ms
  - Poor: > 300ms

Cumulative Layout Shift (CLS):
  - Good: < 0.1
  - Needs Improvement: 0.1 - 0.25
  - Poor: > 0.25
```

### Performance Testing Tools
```bash
# Lighthouse CLI testing
npm install -g lighthouse
lighthouse https://archbuilder.ai --output=html --output-path=./reports/lighthouse-report.html

# PageSpeed Insights API
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://archbuilder.ai&strategy=mobile"

# WebPageTest
# Submit URL to https://webpagetest.org for detailed analysis

# GTmetrix
# Submit URL to https://gtmetrix.com for performance analysis
```

### Performance Benchmarks
```yaml
Target Metrics:
  - First Contentful Paint: < 1.5s
  - Largest Contentful Paint: < 2.5s
  - First Input Delay: < 100ms
  - Cumulative Layout Shift: < 0.1
  - Total Blocking Time: < 300ms
  - Speed Index: < 4.0s

Bundle Size Targets:
  - Initial JavaScript Bundle: < 200KB
  - Initial CSS Bundle: < 50KB
  - Total Page Weight: < 1MB
  - Image Optimization: WebP/AVIF format
  - Font Loading: Preload critical fonts
```

## Security Audit

### Security Headers Check
```bash
# Test security headers
curl -I https://archbuilder.ai

# Expected headers:
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# X-XSS-Protection: 1; mode=block
# Strict-Transport-Security: max-age=31536000; includeSubDomains
# Content-Security-Policy: ...
# Referrer-Policy: strict-origin-when-cross-origin
```

### SSL/TLS Testing
```bash
# SSL Labs test
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=archbuilder.ai

# Expected rating: A+ or A
# TLS version: 1.2+ 
# Certificate: Valid and trusted
# HSTS: Enabled
# OCSP Stapling: Enabled
```

### Content Security Policy (CSP) Testing
```javascript
// CSP validation
const cspPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https://www.google-analytics.com;
  connect-src 'self' https://www.google-analytics.com https://api.archbuilder.ai;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`;

// Test with CSP Evaluator: https://csp-evaluator.withgoogle.com/
```

### Vulnerability Testing
```bash
# OWASP ZAP security scan
docker run -t owasp/zap2docker-stable zap-baseline.py -t https://archbuilder.ai

# Snyk vulnerability scan
npx snyk test

# npm audit
npm audit --audit-level moderate
```

## Accessibility Audit

### WCAG 2.1 AA Compliance
```yaml
Level A Requirements:
  - All images have alt text
  - Proper heading hierarchy (h1, h2, h3...)
  - Form labels properly associated
  - Keyboard navigation support
  - Focus indicators visible

Level AA Requirements:
  - Color contrast ratio ≥ 4.5:1
  - Text resizable up to 200%
  - No seizure-inducing content
  - Page titles descriptive
  - Language of page identified
```

### Accessibility Testing Tools
```bash
# axe-core testing
npm install -g axe-cli
axe https://archbuilder.ai --output=accessibility-report.json

# pa11y testing
npm install -g pa11y
pa11y https://archbuilder.ai --standard WCAG2AA --reporter html > pa11y-report.html

# Lighthouse accessibility audit
lighthouse https://archbuilder.ai --only-categories=accessibility
```

### Screen Reader Testing
```yaml
Windows:
  - NVDA (Free)
  - JAWS (Commercial)
  - Windows Narrator (Built-in)

macOS:
  - VoiceOver (Built-in)

Mobile:
  - iOS VoiceOver
  - Android TalkBack
```

### Keyboard Navigation Testing
```yaml
Test Scenarios:
  - Tab through all interactive elements
  - Enter/Space activate buttons and links  
  - Arrow keys navigate menus
  - Escape closes modals and dropdowns
  - Focus trapping in modals
  - Skip links functionality
  - All functionality accessible without mouse
```

## Functional Testing

### User Journey Testing
```yaml
Critical User Flows:
  1. Homepage → Features → Pricing → Contact
  2. Language switching (7 languages)
  3. Theme switching (dark/light)
  4. Newsletter subscription
  5. Contact form submission
  6. Modal interactions
  7. Mobile navigation menu
  8. Social media links
  9. Footer navigation
  10. SEO meta tags display
```

### Form Testing
```yaml
Contact Form Tests:
  - Valid submission succeeds
  - Required field validation
  - Email format validation
  - Textarea character limits
  - Loading states display
  - Success message shown
  - Error handling works
  - Form reset after submission
  - GDPR compliance checkbox
  - Spam protection active

Newsletter Form Tests:
  - Email validation
  - Subscription preferences
  - Success/error states
  - Duplicate email handling
  - Unsubscribe functionality
```

### i18n Testing
```yaml
Language Tests:
  - All 7 languages load correctly
  - No missing translation keys
  - Text doesn't overflow containers
  - RTL support (if applicable)
  - Date/number formatting
  - Currency display
  - Language selector functionality
  - URL structure per language
  - SEO meta tags translated
  - Error messages translated
```

## Automated Testing Suite

### Unit Tests
```bash
# Run all unit tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch

# Test specific components
npm test -- --testPathPattern=components/sections
```

### Integration Tests
```javascript
// Example Playwright test
import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load and display all sections', async ({ page }) => {
    await page.goto('/');
    
    // Check hero section
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
    
    // Check features section  
    await expect(page.locator('[data-testid="features-section"]')).toBeVisible();
    
    // Check pricing section
    await expect(page.locator('[data-testid="pricing-section"]')).toBeVisible();
    
    // Check CTA section
    await expect(page.locator('[data-testid="cta-section"]')).toBeVisible();
  });
  
  test('should switch languages correctly', async ({ page }) => {
    await page.goto('/');
    
    // Click language selector
    await page.click('[data-testid="language-selector"]');
    
    // Select Turkish
    await page.click('[data-testid="language-tr"]');
    
    // Verify URL changed
    expect(page.url()).toContain('/tr');
    
    // Verify content changed
    await expect(page.locator('h1')).toContainText('Yapay Zeka');
  });
  
  test('should submit contact form', async ({ page }) => {
    await page.goto('/');
    
    // Fill contact form
    await page.fill('[data-testid="contact-name"]', 'Test User');
    await page.fill('[data-testid="contact-email"]', 'test@example.com');
    await page.fill('[data-testid="contact-message"]', 'Test message');
    
    // Submit form
    await page.click('[data-testid="contact-submit"]');
    
    // Verify success message
    await expect(page.locator('[data-testid="contact-success"]')).toBeVisible();
  });
});
```

### E2E Tests
```javascript
// Critical user journey tests
test.describe('User Journeys', () => {
  test('complete website exploration', async ({ page }) => {
    // Start on homepage
    await page.goto('/');
    
    // Navigate through all sections
    await page.click('[href="#features"]');
    await page.waitForTimeout(1000);
    
    await page.click('[href="#technology"]');
    await page.waitForTimeout(1000);
    
    await page.click('[href="#pricing"]');
    await page.waitForTimeout(1000);
    
    // Test mobile menu
    await page.setViewportSize({ width: 375, height: 667 });
    await page.click('[data-testid="mobile-menu-toggle"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    // Test theme switching
    await page.click('[data-testid="theme-toggle"]');
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Test newsletter signup
    await page.fill('[data-testid="newsletter-email"]', 'test@example.com');
    await page.click('[data-testid="newsletter-submit"]');
    await expect(page.locator('[data-testid="newsletter-success"]')).toBeVisible();
  });
});
```

## Browser Testing Matrix

### Automated Browser Testing
```yaml
# Playwright configuration
browsers:
  - chromium: 91+
  - firefox: 89+
  - webkit: 14+ (Safari)

devices:
  - Desktop Chrome
  - Desktop Firefox
  - Desktop Safari
  - iPhone 12
  - iPad
  - Pixel 5
  - Galaxy S21

test_types:
  - Visual regression
  - Functional testing
  - Performance testing
  - Accessibility testing
```

### Manual Testing Checklist
```yaml
Desktop Testing:
  - [ ] Page loads correctly
  - [ ] All images display
  - [ ] Forms work properly
  - [ ] Navigation functions
  - [ ] Responsive behavior
  - [ ] Performance acceptable
  - [ ] No console errors
  - [ ] Print styles work

Mobile Testing:
  - [ ] Touch interactions work
  - [ ] Viewport meta tag correct
  - [ ] Swipe gestures function
  - [ ] Keyboard appears for inputs
  - [ ] Zoom functionality works
  - [ ] Orientation changes handled
  - [ ] Performance on slow devices
  - [ ] Battery usage reasonable
```

## Testing Automation Scripts

### Pre-launch Test Suite
```bash
#!/bin/bash
# pre-launch-tests.sh

echo "🚀 Starting Pre-launch Test Suite..."

# 1. Build and export
echo "📦 Building production version..."
npm run build
npm run export

# 2. Run unit tests
echo "🧪 Running unit tests..."
npm test -- --coverage --watchAll=false

# 3. Run E2E tests
echo "🎭 Running E2E tests..."
npx playwright test

# 4. Run accessibility tests
echo "♿ Running accessibility audit..."
axe http://localhost:3000 --exit

# 5. Run performance tests
echo "⚡ Running performance audit..."
lighthouse http://localhost:3000 --output=html --output-path=./reports/lighthouse.html

# 6. Run security scan
echo "🔒 Running security scan..."
npx snyk test

# 7. Check bundle size
echo "📊 Checking bundle size..."
npx bundlesize

# 8. Validate HTML
echo "✅ Validating HTML..."
html-validate out/**/*.html

echo "✨ Pre-launch tests completed!"
```

### Continuous Testing Pipeline
```yaml
# .github/workflows/testing.yml
name: Pre-launch Testing

on:
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM

jobs:
  test-matrix:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
        device: [desktop, mobile]
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build project
        run: npm run build && npm run export
      
      - name: Run Playwright tests
        run: npx playwright test --project=${{ matrix.browser }}-${{ matrix.device }}
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: test-results-${{ matrix.browser }}-${{ matrix.device }}
          path: test-results/
```

## Performance Monitoring

### Real User Monitoring (RUM)
```javascript
// Performance monitoring script
const performanceMonitor = {
  init() {
    // Monitor Core Web Vitals
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          this.reportMetric('LCP', entry.startTime);
        }
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
    // Monitor First Input Delay
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const fid = entry.processingStart - entry.startTime;
        this.reportMetric('FID', fid);
      }
    }).observe({ entryTypes: ['first-input'] });
    
    // Monitor Cumulative Layout Shift
    let cls = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          cls += entry.value;
          this.reportMetric('CLS', cls);
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });
  },
  
  reportMetric(metric, value) {
    // Report to analytics
    gtag('event', 'web_vitals', {
      metric_name: metric,
      metric_value: value,
      metric_rating: this.getRating(metric, value)
    });
  },
  
  getRating(metric, value) {
    const thresholds = {
      LCP: [2500, 4000],
      FID: [100, 300],
      CLS: [0.1, 0.25]
    };
    
    const [good, needs_improvement] = thresholds[metric];
    
    if (value <= good) return 'good';
    if (value <= needs_improvement) return 'needs_improvement';
    return 'poor';
  }
};

// Initialize monitoring
performanceMonitor.init();
```

Bu comprehensive testing guide ile ArchBuilder.AI web sitesi production'a hazır hale gelecek ve tüm kalite standartlarını karşılayacak.