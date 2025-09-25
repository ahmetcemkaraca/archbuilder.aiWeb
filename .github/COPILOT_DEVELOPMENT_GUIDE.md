# GitHub Copilot Development Guide - ArchBuilder.AI Website

This guide provides comprehensive instructions for GitHub Copilot coding agents working on the ArchBuilder.AI website project.

## 🏗️ Project Architecture Quick Reference

- **Tech Stack**: Next.js 15.5.3, React 19, TypeScript, Tailwind CSS 4
- **Deployment**: Static export (`output: 'export'`)
- **i18n**: Custom React Context system (7 languages)
- **Performance Target**: Lighthouse ≥ 90
- **Code Quality**: TypeScript strict mode, ESLint, Prettier

## 🚀 Quick Start for Copilot

### 1. Read Instructions First
```bash
# ALWAYS read relevant instruction files before coding
ls .github/instructions/*.instructions.md
# Key files:
# - web-typescript-react.instructions.md
# - website-nextjs-patterns.instructions.md  
# - i18n-patterns.instructions.md
```

### 2. Environment Setup
```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development
npm run dev

# Test build (will fail on Google Fonts in CI - this is normal)
npm run build

# Run linting (should show ~100 errors, not 16K+)
npm run lint
```

### 3. Create Feature Branch
```bash
git checkout main
git pull origin main
git checkout -b feature/your-task-description
```

## 📁 File Structure Guide

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── layout/            # Header, Footer, Navigation
│   ├── sections/          # Hero, Features, CTA, Pricing
│   ├── ui/                # Reusable UI components
│   └── providers/         # Context providers
├── lib/
│   ├── i18n/              # Custom i18n system
│   │   ├── context.tsx    # useI18n hook
│   │   ├── config.ts      # Supported locales
│   │   └── locales/       # en.ts, tr.ts, ru.ts, de.ts, fr.ts, es.ts, it.ts
│   └── utils.ts           # Utility functions
└── types/                 # TypeScript definitions
```

## 🌐 i18n System Usage

### ✅ Correct Usage
```typescript
import { useI18n } from '@/lib/i18n';

export function MyComponent() {
  const { t } = useI18n();
  
  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.subtitle')}</p>
    </div>
  );
}
```

### ❌ Never Do This
```typescript
// DON'T hardcode UI text
export function MyComponent() {
  return <h1>Welcome to ArchBuilder.AI</h1>; // ❌
}

// DON'T use next-intl directly  
import { useTranslations } from 'next-intl'; // ❌
```

### Adding New Translation Keys
1. Add to English first: `src/lib/i18n/locales/en.ts`
2. Add to all other 6 languages with same key structure
3. Use descriptive key names: `hero.ctaPrimary` not `button1`

## 🎨 Component Development

### Creating New Components
```typescript
// src/components/sections/new-section.tsx
import { useI18n } from '@/lib/i18n';

interface NewSectionProps {
  className?: string;
}

export function NewSection({ className }: NewSectionProps) {
  const { t } = useI18n();
  
  return (
    <section className={cn('py-20', className)}>
      <div className="container">
        <h2>{t('newSection.title')}</h2>
        <p>{t('newSection.description')}</p>
      </div>
    </section>
  );
}
```

### Registry Updates Required
When creating new components, update:
```json
// docs/registry/identifiers.json
{
  "modules": [
    {
      "name": "components.sections.newSection",
      "exports": ["NewSection"],
      "variables": [],
      "configKeys": []
    }
  ]
}
```

## 🔧 Common Development Tasks

### Fix ESLint Errors
```bash
# Check current errors (should be ~100, not thousands)
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Common issues:
# - Unused variables: prefix with _ or remove
# - Missing translations: add to all locale files
# - TypeScript errors: add proper types
```

### Test Build Process
```bash
# Full build test
npm run build

# If Google Fonts fails (normal in CI):
# The fonts are handled gracefully in production

# Static export test
ls out/  # Should contain index.html and assets
```

### Add New Translation Keys
1. **English first** (`src/lib/i18n/locales/en.ts`):
```typescript
export const en = {
  // ... existing keys
  newFeature: {
    title: "New Feature Title",
    description: "Feature description"
  }
};
```

2. **All other languages** (tr.ts, ru.ts, de.ts, fr.ts, es.ts, it.ts):
```typescript
export const tr = {
  // ... existing keys  
  newFeature: {
    title: "Yeni Özellik Başlığı",
    description: "Özellik açıklaması"
  }
};
```

## 🧪 Testing & Validation

### Pre-Commit Checklist
```bash
# 1. Build succeeds
npm run build

# 2. Linting passes (or only expected errors)
npm run lint

# 3. TypeScript compilation
npx tsc --noEmit

# 4. Manual testing
npm run dev
# Test in Chrome, Firefox, Safari
# Test mobile responsiveness
# Test dark/light theme switching

# 5. Registry validation
pwsh -File scripts/validate-registry.ps1
```

### Manual Testing Steps
1. **Language switching**: Test all 7 languages
2. **Responsive design**: Mobile + desktop
3. **Theme switching**: Dark + light modes
4. **Performance**: Lighthouse audit
5. **Console**: No errors or warnings

## 🚫 Common Mistakes to Avoid

### Code Anti-Patterns
```typescript
// ❌ Relative imports
import { Button } from '../ui/button';

// ✅ Absolute imports  
import { Button } from '@/components/ui/button';

// ❌ Hardcoded text
<h1>Welcome</h1>

// ✅ i18n system
<h1>{t('hero.title')}</h1>

// ❌ Missing TypeScript types
function MyComponent(props) { }

// ✅ Proper typing
interface MyComponentProps {
  title: string;
}
function MyComponent({ title }: MyComponentProps) { }
```

### Development Workflow Mistakes
- ❌ Working directly on main branch
- ❌ Not reading instruction files
- ❌ Forgetting to update registry
- ❌ Not testing all languages
- ❌ Missing translation keys

## 📊 Performance Guidelines

### Lighthouse Targets
- Performance: ≥ 90
- Accessibility: ≥ 90  
- Best Practices: ≥ 90
- SEO: ≥ 90

### Performance Best Practices
```typescript
// ✅ Dynamic imports for code splitting
import dynamic from 'next/dynamic';
const HeavyComponent = dynamic(() => import('./heavy-component'));

// ✅ Image optimization
import Image from 'next/image';
<Image src="/image.jpg" alt={t('image.alt')} width={800} height={600} />

// ✅ Efficient CSS
className="container mx-auto px-4 py-8"
```

## 🔄 Using report_progress Tool

Always use the `report_progress` tool for commits:

```typescript
// When you complete a meaningful unit of work:
await report_progress({
  commitMessage: "Add new hero section with i18n support",
  prDescription: `
- [x] Created new hero section component
- [x] Added translation keys to all 7 languages  
- [x] Updated registry files
- [x] Tested responsive design
- [ ] Pending: Performance audit
- [ ] Pending: Accessibility review
  `
});
```

## 🆘 Troubleshooting

### Build Failures
- **Google Fonts error**: Normal in CI, handled gracefully
- **Dependency conflicts**: Use `npm install --legacy-peer-deps`
- **TypeScript errors**: Check strict mode compliance

### Lint Errors (16K+ errors)
- **Cause**: ESLint scanning .next directory
- **Solution**: Check `eslint.config.mjs` ignores are working
- **Expected**: ~100 errors from actual source code

### i18n Issues
- **Missing translations**: Check all 7 locale files have matching keys
- **Type errors**: Ensure translation keys exist in en.ts first
- **Runtime errors**: Verify useI18n hook is used correctly

## 📚 Additional Resources

- **Architecture Decisions**: `.github/instructions/architecture-decisions.instructions.md`
- **Performance Guide**: `.github/instructions/performance-optimization.instructions.md`
- **Code Style**: `.github/instructions/code-style.instructions.md`
- **Registry System**: `.github/instructions/registry-governance.instructions.md`

---

## 🎯 Quick Validation Commands

```bash
# Full validation suite
pwsh -File scripts/validate-copilot-instructions.ps1 -Verbose
pwsh -File scripts/validate-registry.ps1
npm run lint
npm run build
npm test

# Should all pass with minimal issues
```