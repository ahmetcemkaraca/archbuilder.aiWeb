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
- **Firebase Integration**: Fixed data collection system with Firebase Firestore
- **Admin Panel**: Created comprehensive admin dashboard (`/admin`) for managing submissions
- **Data Collection API**: Implemented `addContactSubmission`, `addNewsletterSubscription`, `addDemoRequest` functions
- **Form Integration**: Connected contact and newsletter forms to Firebase backend
- **Firebase Security**: Updated Firestore rules for admin-only data access
- **Authentication System**: Added Firebase Auth integration for admin panel access
- **Firebase Deploy**: Successfully deployed website and database rules to Firebase
- **Registry Updates**: Added Firebase config, admin panel, and API modules to identifiers.json

## Current System Status
- **✅ Firebase Project**: `archbuilderai` project configured and deployed
- **✅ Database Rules**: Firestore rules deployed with admin access controls
- **✅ Data Collection**: Contact and newsletter forms now save to Firestore
- **✅ Admin Dashboard**: Full admin panel with stats, contact management, and newsletter management
- **✅ Website Deploy**: Static site deployed to Firebase Hosting
- **✅ Build Success**: Static export working with Firebase integration
- **✅ Lint/Build/Test**: ESLint yeşil, `npm run build` ve Jest testleri başarılı
 - **✅ Governance**: Issue/PR templates, CODEOWNERS, PR governance and lint workflows added; CONTRIBUTING and SECURITY policies published.

### Registry Updates (2025-09-25)
- Yeni kayıtlar: `lib.analytics`, `components.providers.analytics-provider`, `components.ui.error-boundary`, `lib.performance`, `lib.monitoring`, `lib.firebase-analytics`
- Şema düzeltmeleri: `any` alanları tip güvenli yapılara taşındı (timestamp alanları ve promoDiscount)

## Next Development Priorities
- **Admin User Setup**: Create admin user in Firebase Auth console for panel access
- **Email Notifications**: Add email alerts for new form submissions
- **Data Analytics**: Enhance admin dashboard with charts and analytics
- **Export Features**: Add CSV export functionality for admin data
- **Real-time Updates**: Implement real-time data refresh in admin panel