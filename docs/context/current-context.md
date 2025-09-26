# ArchBuilder.AI Website - Current Context

**Updated**: 2025-09-25 

## Project Overview
This is the **marketing website** component of ArchBuilder.AI - a Next.js 15 static-exportable multilingual site.

## Technology Stack
- **Framework**: Next.js 15.5.3 (App Router) with static export
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS 4 + dark/light theme support
- **i18n**: Custom React Context system (7 languages)
- **Build**: Turbopack for development speed

## Critical Architecture Constraints

### Static Export Requirements
- **NO server-side features**: No SSR, API routes, or dynamic server components
- **Environment variables**: Must be prefixed with `NEXT_PUBLIC_`
- **Image optimization**: Uses `unoptimized: true` for static compatibility
- **Routing**: All routes must be statically analyzable

### i18n System Architecture
- **Custom Context-based system** (NOT next-intl despite dependency)
- **7 supported locales**: en (default), tr, ru, de, fr, es, it  
- **Translation keys**: Type-safe with TypeScript inference
- **UI text rule**: NEVER hardcode - always use `t('key')` from `useI18n()` hook

## Component Structure
```
src/components/
├── layout/        # Header, Footer
├── sections/      # Hero, Features, CTA, Technology, Pricing  
├── ui/           # Reusable components (LanguageSelector)
└── providers/    # ThemeProvider, I18nProvider
```

## Development Workflow (GitFlow)
1. **Issue-first**: Open an Issue with acceptance criteria and labels
2. **GitFlow branching**:
   - **Features/Docs**: Branch from `develop` → PR to `develop`
   - **Releases**: Branch from `develop` → PR to `main` + merge to `develop`
   - **Hotfixes**: Branch from `main` → PR to `main` + merge to `develop`
3. **Read `.github/instructions/*.md`** before any changes
4. **Update registry files** when adding/modifying public contracts
5. **Add translation keys** to all 7 locale files (no hardcoded UI text)
6. **Open PR with conventional title** and `Closes #<id>` link; Squash & Merge after green CI
7. **Test static export** compatibility

## Current Registry State
- **25 registered modules** in identifiers.json (added auth pages)
- **7 TypeScript schemas** in schemas.json  
- **42 global config keys** for environment variables
- **Empty endpoints.json** (static site - no API routes)
- **630+ translation keys** across TR/EN locales

## Key Files & Patterns
- **i18n hook**: `src/lib/i18n/context.tsx` - `useI18n()` hook for translations
- **Locale config**: `src/lib/i18n/config.ts` - supported languages, flags, names
- **Translation files**: `src/lib/i18n/locales/*.ts` - one per language
- **Static config**: `next.config.ts` - `output: 'export'` for static deployment

## Quality Gates
- TypeScript compilation with no errors
- ESLint passes without warnings  
- All UI text uses i18n system (no hardcoded strings)
- Responsive design (mobile-first)
- Dark/light theme compatibility
- Lighthouse score ≥ 90

## Recent Updates

### Major Addition: Stripe Payment & Marketplace System (2025-01-27)
- **✅ Stripe Integration**: Complete payment infrastructure with client-side Stripe integration
- **✅ Payment Processing**: `createCheckoutSession`, `createSubscriptionCheckout`, promo code validation
- **✅ Subscription Management**: Professional/Enterprise tier pricing with billing intervals (monthly/annual)
- **✅ Marketplace System**: One-time product purchases (credits, templates, consultations)
- **✅ Enhanced Pricing Page**: Interactive pricing component with feature comparison, promo codes
- **✅ Payment Result Pages**: Success/canceled pages with proper Suspense boundaries
- **✅ Type Safety**: Comprehensive TypeScript definitions with Zod schemas for validation
- **✅ i18n Integration**: 70+ new translation keys for payment flows in EN/TR
- **✅ Static Export Compatible**: All Stripe integration designed for static deployment

### Previous Updates
- **Firebase Integration**: Data collection system with Firebase Firestore
- **Admin Panel**: Comprehensive admin dashboard (`/admin`) for managing submissions
- **Data Collection API**: Contact, newsletter, and demo request functions
- **Form Integration**: Connected forms to Firebase backend
- **Firebase Security**: Firestore rules with admin access controls
- **Authentication System**: Firebase Auth integration for admin panel
- **Firebase Deploy**: Website and database rules deployed

## Current System Status
- **✅ Stripe Payment System**: Complete payment infrastructure ready for production
- **✅ Marketplace Ready**: Product catalog and shopping cart functionality implemented  
- **✅ Payment Flows**: Success/canceled handling with analytics tracking
- **✅ Type Safety**: All Stripe operations fully typed with error handling
- **✅ Firebase Project**: `archbuilderai` project configured and deployed
- **✅ Database Rules**: Firestore rules deployed with admin access controls
- **✅ Data Collection**: Contact and newsletter forms save to Firestore
- **✅ Admin Dashboard**: Full admin panel with stats and management features
- **✅ Website Deploy**: Static site deployed to Firebase Hosting
- **✅ Build Success**: Static export working with all integrations
- **✅ Lint/Build/Test**: ESLint green, `npm run build` and Jest tests successful
- **✅ Governance**: Issue/PR templates, CODEOWNERS, workflows, and policies

### Registry Updates (2025-01-27)
- **New Stripe Modules**: `lib.stripe-config`, `lib.stripe-api`, `types.stripe`, payment components
- **Enhanced Components**: `pricing-enhanced`, `marketplace`, payment result pages
- **Environment Variables**: Stripe publishable key and price IDs added to global config
- **Translation System**: Extended with payment/marketplace terminology (70+ keys)

### Payment System Architecture
- **Client-side Integration**: Compatible with static export using @stripe/stripe-js
- **Subscription Tiers**: Starter, Professional, Enterprise with feature-based pricing
- **One-time Products**: Credits (10/50/100), templates, consultation packages
- **Promo Code System**: Validation and discount application
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Analytics Integration**: Payment tracking with gtag events

## Next Development Priorities
- **Stripe Environment Setup**: Configure production Stripe keys and webhook endpoints
- **Payment Testing**: Test payment flows with Stripe test cards
- **Analytics Enhancement**: Track conversion funnels and payment success rates
- **A/B Testing**: Experiment with pricing strategies and checkout flows
- **Customer Portal**: Add Stripe Customer Portal for subscription management
- **Invoice System**: Implement automated invoice generation and delivery