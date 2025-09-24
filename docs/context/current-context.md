# ArchBuilder.AI Website - Current Context

**Updated**: 2025-09-24 

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

## Development Workflow
1. **Always create feature branches** from `main`
2. **Read `.github/instructions/*.md`** before any changes
3. **Update registry files** when adding/modifying components
4. **Add translation keys** to all 7 locale files
5. **Test static export** compatibility

## Current Registry State
- **12 registered modules** in identifiers.json
- **7 TypeScript schemas** in schemas.json  
- **3 global config keys** for environment variables
- **Empty endpoints.json** (static site - no API routes)

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
- Updated `.github/copilot-instructions.md` with website-specific patterns
- Created `.github/instructions/website-nextjs-patterns.instructions.md`
- Populated registry with current component exports
- Documented static export constraints and i18n architecture

## Next Development Priorities
- Component completion (sections that may be missing)
- Translation completion for all 7 languages
- Performance optimization for Lighthouse score
- Static export testing and validation