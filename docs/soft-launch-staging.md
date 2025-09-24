# Soft Launch & Staging Environment Guide

Bu rehber ArchBuilder.AI web sitesinin soft launch sürecini ve staging environment kurulumunu kapsar.

## Staging Environment Setup

### Environment Separation
```yaml
Environments:
  Development:
    - URL: http://localhost:3000
    - Database: Local/Mock
    - Analytics: Disabled
    - Error Tracking: Console only
    - CDN: Local assets
    
  Staging:
    - URL: https://staging.archbuilder.ai
    - Database: Staging database
    - Analytics: Staging GA4 property
    - Error Tracking: Limited
    - CDN: Test CDN configuration
    
  Production:
    - URL: https://archbuilder.ai
    - Database: Production database
    - Analytics: Production GA4 property
    - Error Tracking: Full monitoring
    - CDN: Full CDN configuration
```

### Staging Configuration

#### Environment Variables (.env.staging)
```env
# Staging Environment Configuration
NODE_ENV=production
NEXT_PUBLIC_ENV=staging

# Domain Configuration
NEXT_PUBLIC_DOMAIN=https://staging.archbuilder.ai
NEXT_PUBLIC_SITE_URL=https://staging.archbuilder.ai
NEXT_PUBLIC_API_URL=https://staging-api.archbuilder.ai/v1

# Analytics & Tracking (Staging)
NEXT_PUBLIC_GA_ID=G-STAGING-XXXX
NEXT_PUBLIC_GTM_ID=GTM-STAGING-XX
NEXT_PUBLIC_HOTJAR_ID=STAGING-XXXX
NEXT_PUBLIC_MIXPANEL_TOKEN=staging_token_here

# Feature Flags (Test Mode)
NEXT_PUBLIC_NEWSLETTER_ENABLED=true
NEXT_PUBLIC_CONTACT_FORM_ENABLED=true
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_COOKIE_CONSENT_ENABLED=true
NEXT_PUBLIC_DEBUG_MODE=true

# Staging-specific Features
NEXT_PUBLIC_STAGING_BANNER=true
NEXT_PUBLIC_STAGING_AUTH=true
NEXT_PUBLIC_PERFORMANCE_PROFILING=true

# Social Media (Test Accounts)
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/company/archbuilder-ai-staging
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/archbuilder_stg
NEXT_PUBLIC_GITHUB_URL=https://github.com/archbuilder-ai/staging

# Contact Information (Staging)
NEXT_PUBLIC_SUPPORT_EMAIL=staging-support@archbuilder.ai
NEXT_PUBLIC_CONTACT_EMAIL=staging-contact@archbuilder.ai
NEXT_PUBLIC_SALES_EMAIL=staging-sales@archbuilder.ai

# Monitoring (Reduced Frequency)
NEXT_PUBLIC_HEALTH_CHECK_ENABLED=true
NEXT_PUBLIC_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_ERROR_TRACKING=true
NEXT_PUBLIC_UPTIME_MONITORING=true

# Firebase Staging Configuration
NEXT_PUBLIC_FIREBASE_PROJECT_ID=archbuilder-ai-staging
NEXT_PUBLIC_FIREBASE_API_KEY=staging_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=archbuilder-ai-staging.firebaseapp.com
```

#### Staging-specific Components
```typescript
// src/components/staging/StagingBanner.tsx
'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export function StagingBanner() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Only show in staging environment
    const isStaging = process.env.NEXT_PUBLIC_ENV === 'staging';
    const bannerDismissed = localStorage.getItem('staging-banner-dismissed');
    
    if (isStaging && !bannerDismissed) {
      setIsVisible(true);
    }
  }, []);
  
  const dismissBanner = () => {
    setIsVisible(false);
    localStorage.setItem('staging-banner-dismissed', 'true');
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="bg-yellow-500 text-yellow-900 px-4 py-2 text-center relative">
      <div className="flex items-center justify-center gap-2">
        <span className="font-semibold">⚠️ STAGING ENVIRONMENT</span>
        <span>This is a test version - Not the live website</span>
        <button
          onClick={dismissBanner}
          className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-yellow-600 rounded p-1"
          aria-label="Dismiss staging banner"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

// src/components/staging/StagingTools.tsx
'use client';

import { useState } from 'react';
import { Settings, Monitor, Bug, Zap } from 'lucide-react';
import { useMonitoring } from '@/lib/hooks/use-monitoring';

export function StagingTools() {
  const [isOpen, setIsOpen] = useState(false);
  const { dashboardData } = useMonitoring();
  
  // Only show in staging
  if (process.env.NEXT_PUBLIC_ENV !== 'staging') return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600"
        aria-label="Toggle staging tools"
      >
        <Settings size={20} />
      </button>
      
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white border rounded-lg shadow-xl p-4 w-80">
          <h3 className="font-semibold mb-4">Staging Tools</h3>
          
          <div className="space-y-3">
            {/* Performance Stats */}
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-green-500" />
              <span className="text-sm">
                Performance: {dashboardData?.health?.overallHealth || 0}%
              </span>
            </div>
            
            {/* Error Count */}
            <div className="flex items-center gap-2">
              <Bug size={16} className="text-red-500" />
              <span className="text-sm">
                Errors: {dashboardData?.errors?.errorCount || 0}
              </span>
            </div>
            
            {/* Uptime */}
            <div className="flex items-center gap-2">
              <Monitor size={16} className="text-blue-500" />
              <span className="text-sm">
                Uptime: {dashboardData?.uptime?.uptime?.toFixed(1) || 0}%
              </span>
            </div>
            
            {/* Quick Actions */}
            <div className="pt-2 border-t">
              <button
                onClick={() => window.location.reload()}
                className="w-full text-left text-sm py-1 px-2 hover:bg-gray-100 rounded"
              >
                🔄 Reload Page
              </button>
              <button
                onClick={() => localStorage.clear()}
                className="w-full text-left text-sm py-1 px-2 hover:bg-gray-100 rounded"
              >
                🗑️ Clear Storage
              </button>
              <button
                onClick={() => console.log('Dashboard Data:', dashboardData)}
                className="w-full text-left text-sm py-1 px-2 hover:bg-gray-100 rounded"
              >
                📊 Log Analytics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Firebase Staging Setup
```json
{
  "projects": {
    "staging": "archbuilder-ai-staging",
    "production": "archbuilder-ai-prod"
  },
  "targets": {
    "archbuilder-ai-staging": {
      "hosting": {
        "staging": ["archbuilder-ai-staging"]
      }
    },
    "archbuilder-ai-prod": {
      "hosting": {
        "production": ["archbuilder-ai-prod"]
      }
    }
  },
  "hosting": [
    {
      "target": "staging",
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
          "source": "**",
          "headers": [
            {
              "key": "X-Robots-Tag",
              "value": "noindex, nofollow"
            }
          ]
        }
      ]
    }
  ]
}
```

## Internal Team Review Process

### Review Team Structure
```yaml
Review Team:
  Technical Lead:
    - Code quality review
    - Performance validation
    - Security assessment
    - Architecture compliance
    
  UX/UI Designer:
    - Design consistency
    - User experience flow
    - Accessibility compliance
    - Visual regression testing
    
  Content Manager:
    - Copy accuracy
    - Translation quality
    - SEO optimization
    - Brand voice consistency
    
  QA Engineer:
    - Functional testing
    - Cross-browser testing
    - Mobile device testing
    - Bug identification
    
  Product Manager:
    - Feature completeness
    - User story validation
    - Business requirement fulfillment
    - Go-to-market readiness
```

### Review Checklist
```yaml
Technical Review:
  - [ ] Build process successful
  - [ ] No console errors
  - [ ] Performance metrics meet targets
  - [ ] Security headers implemented
  - [ ] SEO meta tags complete
  - [ ] Analytics tracking functional
  - [ ] Error monitoring active
  - [ ] Mobile responsiveness verified

Design Review:
  - [ ] Visual design matches mockups  
  - [ ] Brand guidelines followed
  - [ ] Color contrast accessibility
  - [ ] Typography hierarchy correct
  - [ ] Interactive states defined
  - [ ] Loading states implemented
  - [ ] Error states designed
  - [ ] Dark/light theme consistency

Content Review:
  - [ ] All copy proofread
  - [ ] Translations verified
  - [ ] Legal text reviewed
  - [ ] Contact information accurate
  - [ ] Social media links correct
  - [ ] SEO titles/descriptions optimized
  - [ ] Schema markup implemented
  - [ ] Image alt texts complete

Functional Review:
  - [ ] All navigation links work
  - [ ] Forms submit correctly
  - [ ] Language switching functional
  - [ ] Theme switching works
  - [ ] Modal interactions smooth
  - [ ] Newsletter signup works
  - [ ] Mobile menu functional
  - [ ] Search functionality (if applicable)
```

## User Acceptance Testing (UAT)

### UAT Participant Selection
```yaml
Internal Users:
  - Development team (5 people)
  - Design team (2 people)
  - Management team (3 people)
  - Customer support (2 people)
  
External Beta Users:
  - Existing customers (10 people)
  - Industry professionals (5 people)
  - Accessibility experts (2 people)
  - International users (5 people)
  
Target Demographics:
  - Architects (primary users)
  - Construction professionals
  - Design firms
  - Technology enthusiasts
  - International users (non-English)
```

### UAT Test Scenarios
```yaml
Scenario 1: First-time Visitor
  - Land on homepage
  - Explore main sections
  - Check pricing information
  - Attempt to contact company
  - Subscribe to newsletter
  
Scenario 2: International User
  - Switch to native language
  - Navigate through content
  - Verify cultural appropriateness
  - Test contact forms
  - Check social media links
  
Scenario 3: Mobile User
  - Access site on mobile device
  - Test touch interactions
  - Use mobile navigation
  - Fill out forms
  - Share content
  
Scenario 4: Accessibility User
  - Navigate with keyboard only
  - Use screen reader
  - Test high contrast mode
  - Verify font scaling
  - Check focus indicators
  
Scenario 5: Technical User
  - Inspect page performance
  - Check developer tools
  - Test on different browsers
  - Verify security headers
  - Analyze load times
```

### UAT Feedback Collection
```typescript
// UAT Feedback System
interface UATFeedback {
  userId: string;
  testScenario: string;
  timestamp: Date;
  device: string;
  browser: string;
  rating: 1 | 2 | 3 | 4 | 5;
  issues: {
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    location: string;
    screenshot?: string;
  }[];
  suggestions: string[];
  overallExperience: string;
}

// Feedback Collection Component
export function UATFeedbackForm() {
  const [feedback, setFeedback] = useState<Partial<UATFeedback>>({});
  
  const submitFeedback = async () => {
    // Send to analytics or feedback system
    gtag('event', 'uat_feedback', {
      scenario: feedback.testScenario,
      rating: feedback.rating,
      issues_count: feedback.issues?.length || 0
    });
    
    // Store in database or send to team
    console.log('UAT Feedback:', feedback);
  };
  
  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h3 className="font-semibold mb-4">UAT Feedback</h3>
      {/* Feedback form implementation */}
    </div>
  );
}
```

## Bug Tracking & Resolution

### Bug Classification
```yaml
Severity Levels:
  Critical:
    - Site completely broken
    - Security vulnerabilities
    - Data loss issues
    - Major functionality broken
    
  High:
    - Core features not working
    - Poor performance
    - Accessibility violations
    - Cross-browser issues
    
  Medium:
    - Minor functionality issues
    - UI inconsistencies
    - Content errors
    - Translation mistakes
    
  Low:
    - Cosmetic issues
    - Enhancement requests
    - Nice-to-have features
    - Minor typos
```

### Bug Resolution Process
```yaml
Bug Lifecycle:
  1. Discovery (UAT/Testing)
  2. Triage (Severity assignment)
  3. Assignment (Developer allocation)
  4. Resolution (Fix implementation)
  5. Testing (QA verification)
  6. Validation (UAT confirmation)
  7. Closure (Documentation)

Resolution Timeline:
  Critical: < 2 hours
  High: < 1 day
  Medium: < 3 days
  Low: < 1 week
```

### Bug Tracking Template
```yaml
Bug ID: BUG-YYYY-MM-DD-001
Title: Language selector not working on mobile
Severity: High
Priority: High
Environment: Staging
Reporter: QA Team
Assignee: Frontend Developer

Description:
  The language selector dropdown doesn't open when tapped on mobile devices (iOS Safari, Android Chrome).

Steps to Reproduce:
  1. Open staging site on mobile device
  2. Tap the language selector in header
  3. Observe that dropdown doesn't appear

Expected Result:
  Language dropdown should appear with all 7 language options

Actual Result:
  Nothing happens when tapping the selector

Additional Info:
  - Works fine on desktop
  - Tested on iPhone 12 (Safari) and Pixel 5 (Chrome)
  - Console shows no JavaScript errors

Screenshots:
  - Before: [attached]
  - After: [attached]

Resolution:
  Added touch event handlers and improved mobile touch targets

Test Results:
  - ✅ iPhone 12 (Safari 15)
  - ✅ Pixel 5 (Chrome 91)
  - ✅ iPad (Safari 14)
```

## Performance Validation

### Staging Performance Benchmarks
```yaml
Target Metrics (Staging):
  - First Contentful Paint: < 2.0s
  - Largest Contentful Paint: < 3.0s
  - First Input Delay: < 100ms
  - Cumulative Layout Shift: < 0.1
  - Speed Index: < 4.5s
  - Total Blocking Time: < 300ms

Lighthouse Scores:
  - Performance: ≥ 85
  - Accessibility: ≥ 90
  - Best Practices: ≥ 90
  - SEO: ≥ 90
```

### Performance Testing Script
```bash
#!/bin/bash
# staging-performance-test.sh

STAGING_URL="https://staging.archbuilder.ai"

echo "🔥 Running Staging Performance Tests..."

# Lighthouse audit
lighthouse $STAGING_URL \
  --output=html \
  --output-path=./reports/staging-lighthouse.html \
  --chrome-flags="--headless --no-sandbox"

# WebPageTest audit
curl -X POST "https://www.webpagetest.org/runtest.php" \
  -d "url=$STAGING_URL" \
  -d "k=YOUR_API_KEY" \
  -d "location=Dulles:Chrome" \
  -d "runs=3" \
  -d "fvonly=1"

# Bundle size analysis
npm run analyze

echo "📊 Performance test results saved to ./reports/"
```

## Staging Deployment Pipeline

### Automated Staging Deployment
```yaml
# .github/workflows/staging-deploy.yml
name: Deploy to Staging

on:
  push:
    branches: [develop]
  pull_request:
    branches: [main]

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test -- --watchAll=false
      
      - name: Build for staging
        env:
          NEXT_PUBLIC_ENV: staging
          NEXT_PUBLIC_DOMAIN: ${{ secrets.STAGING_DOMAIN }}
          NEXT_PUBLIC_GA_ID: ${{ secrets.STAGING_GA_ID }}
        run: |
          npm run build
          npm run export
      
      - name: Deploy to Firebase Staging
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_STAGING }}
          projectId: archbuilder-ai-staging
          channelId: live
      
      - name: Run smoke tests
        run: |
          sleep 30
          curl -f https://staging.archbuilder.ai || exit 1
      
      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: "🚀 Staging deployment completed: https://staging.archbuilder.ai"
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

Bu comprehensive staging guide ile ArchBuilder.AI web sitesi güvenli bir şekilde soft launch sürecinden geçecek ve production'a hazır hale gelecek.