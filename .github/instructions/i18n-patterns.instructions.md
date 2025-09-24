---
applyTo: "src/lib/i18n/**/*.ts,src/components/**/*.tsx,src/app/**/*.tsx"
description: i18n system patterns for ArchBuilder.AI website - custom React Context system with 7 languages
---

# i18n System Instructions

## System Architecture
This project uses a **custom React Context-based i18n system**, NOT next-intl despite the dependency existing.

### Core Files
- `src/lib/i18n/config.ts` - Supported locales, names, flags
- `src/lib/i18n/context.tsx` - React Context provider and hook
- `src/lib/i18n/translations.ts` - Translation helper functions
- `src/lib/i18n/locales/*.ts` - Translation files (one per language)

## Supported Languages
```typescript
const locales = ['en', 'tr', 'ru', 'de', 'fr', 'es', 'it'] as const;
// en = English (default), tr = Turkish, ru = Russian, 
// de = German, fr = French, es = Spanish, it = Italian
```

## Usage Patterns

### 1. Component Translation Usage
**ALWAYS** use the `useI18n()` hook - NEVER hardcode UI text:

```typescript
// ✅ CORRECT
import { useI18n } from '@/lib/i18n';

export function MyComponent() {
  const { t } = useI18n();
  
  return (
    <div>
      <h1>{t('heroTitle')}</h1>
      <p>{t('heroSubtitle')}</p>
      <button>{t('getStarted')}</button>
    </div>
  );
}

// ❌ WRONG - Never hardcode text
export function MyComponent() {
  return (
    <div>
      <h1>Welcome to ArchBuilder.AI</h1> {/* ❌ */}
      <p>AI-powered architecture</p>      {/* ❌ */}
      <button>Get Started</button>         {/* ❌ */}
    </div>
  );
}
```

### 2. Translation File Structure
All locale files must have **identical key structure**:

```typescript
// src/lib/i18n/locales/en.ts (PRIMARY - defines structure)
export const en = {
  // Navigation
  overview: 'Overview',
  features: 'Features', 
  pricing: 'Pricing',
  
  // Hero Section
  heroTitle1: 'The Future of',
  heroTitle2: 'AI-Powered', 
  heroTitle3: 'Architecture',
  heroSubtitle: 'Transform your designs with AI...',
  
  // Buttons
  getStarted: 'Get Started',
  learnMore: 'Learn More',
  watchDemo: 'Watch Demo',
  
  // Features
  aiDesignTitle: 'AI-Powered Design',
  aiDesignDesc: 'Create projects with advanced AI...'
};

// src/lib/i18n/locales/tr.ts (MUST match en.ts keys exactly)
export const tr = {
  // Navigation  
  overview: 'Genel Bakış',
  features: 'Özellikler',
  pricing: 'Fiyatlandırma',
  
  // Hero Section
  heroTitle1: 'Mimarlığın',
  heroTitle2: 'AI Destekli',
  heroTitle3: 'Geleceği', 
  heroSubtitle: 'Tasarımlarınızı AI ile dönüştürün...',
  
  // Buttons
  getStarted: 'Hemen Başla',
  learnMore: 'Daha Fazla',
  watchDemo: 'Demo İzle',
  
  // Features
  aiDesignTitle: 'AI Destekli Tasarım', 
  aiDesignDesc: 'Gelişmiş AI ile projeler oluşturun...'
};
```

### 3. Adding New Translation Keys

When adding new UI text, follow this process:

1. **Add to English first** (`src/lib/i18n/locales/en.ts`)
2. **Add to all other 6 languages** with same key names
3. **Use descriptive key names** (not generic like 'title1', 'text2')
4. **Group related keys** logically (nav, hero, features, etc.)

```typescript
// ✅ GOOD key naming
export const en = {
  // Hero section keys
  heroMainTitle: 'AI-Powered Architecture',
  heroSubheading: 'Revolutionary design automation',
  heroCTAPrimary: 'Start Free Trial',
  heroCTASecondary: 'Watch Demo Video',
  
  // Feature card keys  
  featureAITitle: 'Intelligent Design',
  featureAIDescription: 'AI analyzes your requirements...',
  featureRevitTitle: 'Revit Integration',
  featureRevitDescription: 'Seamless Revit workflow...'
};

// ❌ BAD key naming
export const en = {
  title1: 'AI-Powered Architecture',    // Too generic
  text1: 'Revolutionary design...',     // No context
  button: 'Click Here',                 // Which button?
  desc: 'Some description'              // Abbreviated, unclear
};
```

### 4. Language Selector Implementation

Use the provided locale configuration:

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
      className="appearance-none bg-transparent"
    >
      {locales.map(lang => (
        <option key={lang} value={lang}>
          {localeFlags[lang]} {localeNames[lang]}
        </option>
      ))}
    </select>
  );
}
```

### 5. Context Provider Setup

The i18n provider wraps the entire app in `src/app/layout.tsx`:

```typescript
// src/app/layout.tsx  
import { I18nProvider } from '@/lib/i18n';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          {/* ThemeProvider and other providers */}
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
```

## TypeScript Integration

### Type Safety for Translation Keys

```typescript
// The system provides type-safe translation keys
const { t } = useI18n();

// ✅ TypeScript will validate these exist
const title = t('heroTitle1');        // Valid key
const subtitle = t('heroSubtitle');   // Valid key

// ❌ TypeScript will error on invalid keys  
const invalid = t('nonExistentKey');  // Type error!
```

### Locale Type Definition

```typescript
// src/lib/i18n/config.ts
export type Locale = typeof locales[number]; 
// Results in: 'en' | 'tr' | 'ru' | 'de' | 'fr' | 'es' | 'it'

// Used throughout the system for type safety
const currentLocale: Locale = 'en'; // ✅ Valid
const invalid: Locale = 'jp';       // ❌ Type error
```

## Common Anti-Patterns

### 1. Conditional Text Rendering
```typescript
// ❌ WRONG - Don't check locale manually
const { locale } = useI18n();
const text = locale === 'tr' ? 'Merhaba' : 'Hello';

// ✅ CORRECT - Use translation system
const { t } = useI18n();
const text = t('greeting'); // greeting: 'Hello' in en.ts, 'Merhaba' in tr.ts
```

### 2. Direct Locale File Imports
```typescript
// ❌ WRONG - Don't import locale files directly  
import { tr } from '@/lib/i18n/locales/tr';
const text = tr.heroTitle;

// ✅ CORRECT - Always use the hook
const { t } = useI18n();
const text = t('heroTitle');
```

### 3. Mixing Translation Systems
```typescript
// ❌ WRONG - Don't use next-intl functions
import { useTranslations } from 'next-intl'; // Don't use!

// ✅ CORRECT - Use custom system
import { useI18n } from '@/lib/i18n';
```

## Testing i18n Components

```typescript
// Test components with i18n context
import { render, screen } from '@testing-library/react';
import { I18nProvider } from '@/lib/i18n';
import { Hero } from '@/components/sections/hero';

test('renders hero with translations', () => {
  render(
    <I18nProvider>
      <Hero />
    </I18nProvider>
  );
  
  // Test that translated content appears
  expect(screen.getByText(/AI-Powered/)).toBeInTheDocument();
});

// Test language switching
test('changes language when locale changes', () => {
  const { rerender } = render(
    <I18nProvider initialLocale="en">
      <Hero />
    </I18nProvider>
  );
  
  expect(screen.getByText(/The Future of/)).toBeInTheDocument();
  
  rerender(
    <I18nProvider initialLocale="tr"> 
      <Hero />
    </I18nProvider>
  );
  
  expect(screen.getByText(/Mimarlığın/)).toBeInTheDocument();
});
```

## Checklist for i18n Changes

Before submitting any UI text changes:

- [ ] Added keys to English locale file first (`en.ts`)
- [ ] Added same keys to all 6 other locale files
- [ ] Used descriptive, contextual key names
- [ ] Grouped related keys logically
- [ ] Tested component with different locales
- [ ] Verified TypeScript compilation passes
- [ ] No hardcoded UI text remains in component

## Performance Considerations

- **Lazy loading**: Locale files are imported statically (not lazy) for simplicity
- **Bundle size**: ~7KB total for all translation files 
- **Runtime**: Context switching is fast (no API calls)
- **Persistence**: Locale preference saved in localStorage