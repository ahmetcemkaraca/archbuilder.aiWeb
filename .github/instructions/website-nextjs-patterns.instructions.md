---
applyTo: "**/*.tsx,**/*.jsx,**/*.ts,**/*.js"
description: Website-specific patterns for ArchBuilder.AI marketing site with Next.js 15 + static export + multilingual support
---

# Website-Specific Development Instructions

## Architecture Context
This is the **marketing website** component of ArchBuilder.AI - a static-exportable Next.js site with custom i18n system.

### Technology Constraints
- **Static Export**: Must be deployable as static files (`next export`)
- **No Server Features**: No SSR, API routes, or server components with dynamic data
- **Custom i18n**: Uses React Context system, NOT next-intl despite dependency
- **Tailwind CSS 4**: Latest version with `@tailwindcss/postcss` plugin
- **Performance Target**: Lighthouse score ≥ 90

## Critical Patterns

### 1. i18n System Usage
**NEVER** hardcode UI text. Always use the custom i18n context:

```typescript
// ✅ CORRECT
import { useI18n } from '@/lib/i18n';

export function HeroSection() {
  const { t } = useI18n();
  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.subtitle')}</p>
    </div>
  );
}

// ❌ WRONG
export function HeroSection() {
  return (
    <div>
      <h1>AI-Powered Architecture</h1> {/* Never hardcode! */}
      <p>Revolutionary design automation</p>
    </div>
  );
}
```

### 2. Translation File Updates
When adding new UI text, update ALL 7 locale files:

```typescript
// src/lib/i18n/locales/en.ts (primary)
export const en = {
  hero: {
    title: "AI-Powered Architectural Design",
    cta: "Get Started Today"
  }
};

// src/lib/i18n/locales/tr.ts (must match keys)
export const tr = {
  hero: {
    title: "AI Destekli Mimari Tasarım", 
    cta: "Hemen Başla"
  }
};
```

### 3. Component Structure Patterns

#### Sections (Page-Level Components)
```typescript
// src/components/sections/hero.tsx
interface HeroProps {
  className?: string;
}

export function Hero({ className }: HeroProps) {
  const { t } = useI18n();
  
  return (
    <section className={cn("py-20", className)}>
      {/* Section content */}
    </section>
  );
}
```

#### UI Components (Reusable)
```typescript
// src/components/ui/language-selector.tsx
import { locales, localeNames, localeFlags } from '@/lib/i18n/config';
import { useI18n } from '@/lib/i18n';

export function LanguageSelector() {
  const { locale, setLocale } = useI18n();
  
  return (
    <select 
      value={locale} 
      onChange={(e) => setLocale(e.target.value as Locale)}
    >
      {locales.map(loc => (
        <option key={loc} value={loc}>
          {localeFlags[loc]} {localeNames[loc]}
        </option>
      ))}
    </select>
  );
}
```

### 4. Static Export Compatibility

#### Environment Variables
```typescript
// ✅ CORRECT - Next.js static export compatible
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.archbuilder.app';

// ❌ WRONG - Not available in static export
const serverSecret = process.env.SECRET_KEY; // Will be undefined
```

#### Image Optimization
```tsx
// ✅ CORRECT - Configured for static export
import Image from 'next/image';

<Image 
  src="/hero-image.jpg"
  alt={t('hero.imageAlt')}
  width={800}
  height={600}
  unoptimized // Already configured globally
/>
```

### 5. Theme System Integration
Always support both light and dark themes:

```tsx
// ✅ CORRECT
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <h1 className="text-primary-600 dark:text-primary-400">
    {t('hero.title')}
  </h1>
</div>
```

## Registry Updates Required

When creating new components or modifying existing ones:

### 1. Update identifiers.json
```json
{
  "modules": [
    {
      "name": "components.sections.hero",
      "exports": ["Hero"],
      "variables": [],
      "configKeys": []
    }
  ]
}
```

### 2. Update schemas.json (if adding types)
```json
{
  "schemas": [
    {
      "name": "HeroProps",
      "version": "1.0.0",
      "fields": ["className?"]
    }
  ]
}
```

## Performance Considerations

### Code Splitting
```typescript
// ✅ Dynamic imports for non-critical components
import dynamic from 'next/dynamic';

const PricingSection = dynamic(() => import('@/components/sections/pricing'));
```

### Bundle Analysis
```bash
# Check bundle size impact
npm run build
# Analyze with webpack-bundle-analyzer if needed
```

## Common Mistakes to Avoid

### 1. Server-Side Features
```typescript
// ❌ WRONG - Not compatible with static export
export async function getServerSideProps() {
  // This breaks static export
}

// ❌ WRONG - API routes don't work
export async function POST(request: Request) {
  // Static export doesn't support API routes
}
```

### 2. Dynamic Routing Issues
```typescript
// ✅ CORRECT - Pre-defined routes only
// pages: /, /about, /contact (static)

// ❌ WRONG - Dynamic routes need getStaticPaths
// /blog/[slug] requires pre-generation
```

### 3. i18n Anti-Patterns
```typescript
// ❌ WRONG - Using next-intl directly
import { useTranslations } from 'next-intl'; // Don't use this!

// ❌ WRONG - Conditional text
const text = locale === 'tr' ? 'Merhaba' : 'Hello'; // Use i18n system!
```

## Testing Requirements

### Component Testing
```typescript
// Test i18n integration
import { render } from '@testing-library/react';
import { I18nProvider } from '@/lib/i18n';

test('renders hero title', () => {
  render(
    <I18nProvider>
      <Hero />
    </I18nProvider>
  );
  // Assert translated content
});
```

### Static Export Validation
```bash
# Verify static export works
npm run build
npm run export
# Check dist/ directory for static files
```

## Documentation Requirements

For each new section or major component:

1. **Turkish Documentation**: Create `docs/components/[name].md`
2. **Usage Examples**: Include code samples and props
3. **i18n Keys**: Document required translation keys
4. **Theme Support**: Note dark/light mode considerations

## Quality Checklist

Before submitting any website changes:

- [ ] All UI text uses i18n system
- [ ] Translation keys added to all 7 locale files
- [ ] Component supports dark/light themes
- [ ] Static export compatibility verified
- [ ] TypeScript compilation successful
- [ ] Registry files updated
- [ ] Mobile responsiveness tested
- [ ] Performance impact assessed