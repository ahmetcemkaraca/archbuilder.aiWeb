# ArchBuilder.AI Design System

**Version**: 1.0.0  
**Updated**: 2025-09-24  
**Framework**: Next.js 15 + TypeScript + Tailwind CSS 4

## 🎨 Design Principles

### 1. **Apple-Inspired Minimalism**
- Clean, spacious layouts with generous white space
- Subtle shadows and glass-morphism effects
- Focus on typography hierarchy and readability

### 2. **AI-Human Collaboration**
- Visual indicators for AI assistance
- Progressive disclosure of complex features
- Clear feedback for AI-generated content

### 3. **Professional Architecture Focus**
- Technical precision in visual elements
- Industry-standard color palettes
- CAD-inspired grid systems and alignment

## 🔧 Core Components

### Layout Components

#### Header (`src/components/layout/header.tsx`)
```tsx
import { Header } from '@/components/layout/header';

// Usage
<Header />
```

**Features:**
- Responsive navigation with mobile hamburger menu
- Language selector (7 languages)
- Dark/light theme toggle
- Glass-morphism background effect

#### Footer (`src/components/layout/footer.tsx`)
```tsx
import { Footer } from '@/components/layout/footer';

// Usage
<Footer />
```

**Features:**
- 4-column link organization
- Social media integration
- Newsletter subscription
- Contact information

### Section Components

#### Hero Section (`src/components/sections/hero.tsx`)
```tsx
import { Hero } from '@/components/sections/hero';

// Usage
<Hero />
```

**Features:**
- Animated gradient background
- CSS blob animations
- Dual CTA buttons
- Responsive typography

#### Features Section (`src/components/sections/features.tsx`)
```tsx
import { Features } from '@/components/sections/features';

// Usage
<Features />
```

**Features:**
- 6-feature grid layout
- Heroicons integration
- Hover animations
- Content hierarchy

#### Technology Section (`src/components/sections/technology.tsx`)
```tsx
import { Technology } from '@/components/sections/technology';

// Usage
<Technology />
```

**Features:**
- 4-category tech stack
- AI model comparisons
- Performance metrics
- Interactive hover states

#### Pricing Section (`src/components/sections/pricing.tsx`)
```tsx
import { Pricing } from '@/components/sections/pricing';

// Usage
<Pricing />
```

**Features:**
- 3-tier pricing cards
- Feature comparison table
- Popular plan highlighting
- FAQ integration

### UI Components

#### Modal System (`src/components/ui/modal.tsx`)
```tsx
import { Modal, VideoModal } from '@/components/ui/modal';

// Basic Modal
<Modal 
  isOpen={isOpen} 
  onClose={handleClose}
  title="Modal Title"
>
  Modal content here
</Modal>

// Video Modal
<VideoModal 
  isOpen={videoOpen}
  onClose={handleVideoClose}
  videoId="dQw4w9WgXcQ"
  title="Demo Video"
/>
```

**Features:**
- ESC key support
- Overlay click to close
- Multiple size variants
- Accessibility support

#### Typography System (`src/components/ui/typography.tsx`)
```tsx
import { H1, H2, BodyText, Caption } from '@/components/ui/typography';

// Usage Examples
<H1>Main Heading</H1>
<H2 className="text-gradient">Gradient Heading</H2>
<BodyText>Regular paragraph text</BodyText>
<Caption>Uppercase caption text</Caption>
```

**Available Components:**
- `DisplayHeading`, `H1`-`H6` - Heading hierarchy
- `BodyLarge`, `BodyText`, `BodySmall`, `BodyXS` - Body text
- `Caption`, `Label`, `Overline` - Utility text
- `Code` - Inline and block code
- `Link` - Styled links
- `GradientText` - Animated gradient text

#### Animation Components (`src/components/ui/animations.tsx`)
```tsx
import { fadeInUp, fadeInLeft, LoadingDots } from '@/components/ui/animations';
import { motion } from 'framer-motion';

// Usage
<motion.div
  initial="hidden"
  animate="visible"
  variants={fadeInUp}
>
  Animated content
</motion.div>

<LoadingDots />
```

**Available Animations:**
- `fadeInUp` - Fade in from bottom
- `fadeInLeft` - Fade in from left
- `fadeInRight` - Fade in from right
- `LoadingDots` - Animated loading indicator

## 🎨 Design Tokens

### Color System (`src/styles/design-tokens.css`)

#### Brand Colors
```css
/* Primary Brand Colors */
--brand-primary-600: #475569; /* Main brand color */
--brand-secondary-600: #7c3aed; /* Secondary accent */

/* Interactive Colors */
--interactive-primary: var(--brand-secondary-600);
--interactive-primary-hover: var(--brand-secondary-700);
```

#### Status Colors
```css
--success-600: #16a34a;
--warning-600: #d97706;
--error-600: #dc2626;
```

#### Usage Examples
```tsx
// CSS Classes
<div className="bg-brand-primary text-white" />
<div className="bg-gradient-primary" />
<button className="btn-primary">Primary Button</button>

// CSS Variables
<div style={{ backgroundColor: 'var(--brand-primary-600)' }} />
```

### Typography Scale (`src/styles/typography.css`)

#### Font Hierarchy
```css
.heading-display: 6rem (96px) - Hero headings
.heading-1: 3.75rem (60px) - Page titles
.heading-2: 2.25rem (36px) - Section headings
.heading-3: 1.875rem (30px) - Subsection headings
.body-large: 1.25rem (20px) - Large body text
.body-base: 1rem (16px) - Regular body text
```

#### Responsive Breakpoints
- **Mobile (≤640px)**: Reduced font sizes by 25%
- **Tablet (641px-1024px)**: Standard scales
- **Desktop (≥1025px)**: Full scale with line-height optimization

### Spacing System
```css
--space-1: 0.25rem (4px)
--space-2: 0.5rem (8px)
--space-4: 1rem (16px)
--space-8: 2rem (32px)
--space-16: 4rem (64px)
```

### Border Radius
```css
--radius-sm: 0.25rem (4px)
--radius-md: 0.375rem (6px)
--radius-lg: 0.5rem (8px)
--radius-xl: 0.75rem (12px)
```

## 🌐 Internationalization (i18n)

### Language Support
- **English (en)** - Default
- **Turkish (tr)** - Primary market
- **Russian (ru)** - Eastern Europe
- **German (de)** - Central Europe
- **French (fr)** - EU market
- **Spanish (es)** - Latin America
- **Italian (it)** - Southern Europe

### Usage Pattern
```tsx
import { useI18n } from '@/lib/i18n';

function MyComponent() {
  const { t, locale } = useI18n();
  
  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.description')}</p>
    </div>
  );
}
```

### Translation File Structure
```typescript
// src/lib/i18n/locales/en.ts
export const en = {
  hero: {
    title: "AI-Powered Architectural Design",
    description: "Revolutionary automation for architects"
  },
  nav: {
    overview: "Overview",
    features: "Features",
    pricing: "Pricing"
  }
};
```

## 🚀 Performance Guidelines

### Bundle Size Optimization
- **Target**: Main bundle ≤ 150kB gzipped
- **Current**: ~149kB (optimized)
- **Strategy**: Dynamic imports, tree shaking, code splitting

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: ≤ 2.5s
- **FID (First Input Delay)**: ≤ 100ms
- **CLS (Cumulative Layout Shift)**: ≤ 0.1

### Image Optimization
```tsx
import Image from 'next/image';

// Optimized usage
<Image
  src="/hero-image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={true} // For above-the-fold images
  placeholder="blur"
/>
```

## 🎯 Accessibility Standards

### WCAG 2.1 AA Compliance
- **Color Contrast**: 4.5:1 minimum for normal text
- **Focus Indicators**: Visible focus rings on all interactive elements
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader**: Semantic HTML and ARIA labels

### Implementation Examples
```tsx
// Focus states
<button className="focus-ring">
  Accessible Button
</button>

// ARIA labels
<button aria-label="Close modal" onClick={closeModal}>
  ×
</button>

// Semantic HTML
<main>
  <section aria-labelledby="features-heading">
    <h2 id="features-heading">Features</h2>
  </section>
</main>
```

## 🔄 Animation Guidelines

### Timing Functions
```css
--timing-fast: 150ms;   /* Micro-interactions */
--timing-base: 250ms;   /* Standard transitions */
--timing-slow: 350ms;   /* Complex animations */
--timing-slower: 500ms; /* Page transitions */
```

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
/* Base styles: 320px+ */

@media (min-width: 640px) {
  /* Small tablets: 640px+ */
}

@media (min-width: 768px) {
  /* Tablets: 768px+ */
}

@media (min-width: 1024px) {
  /* Desktop: 1024px+ */
}

@media (min-width: 1280px) {
  /* Large desktop: 1280px+ */
}
```

## 🌙 Dark Mode Implementation

### Theme Toggle
```tsx
import { useTheme } from 'next-themes';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button 
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="btn-secondary"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
```

### Color Variables
```css
/* Light mode (default) */
:root {
  --surface-background: #fafafa;
  --text-primary: #171717;
}

/* Dark mode */
.dark {
  --surface-background: #0a0a0a;
  --text-primary: #fafafa;
}
```

## 🧪 Testing Strategy

### Component Testing
```typescript
// Example test for Typography component
import { render, screen } from '@testing-library/react';
import { H1 } from '@/components/ui/typography';

test('renders heading with correct class', () => {
  render(<H1>Test Heading</H1>);
  const heading = screen.getByRole('heading', { level: 1 });
  expect(heading).toHaveClass('heading-1');
});
```

### Visual Regression Testing
- Chromatic for component screenshots
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Mobile device testing (iOS Safari, Chrome Mobile)

## 📦 Build & Deployment

### Production Build
```bash
npm run build    # Next.js build
npm run export   # Static export
```

### Bundle Analysis
```bash
npm run analyze  # Webpack Bundle Analyzer
```

### Environment Variables
```env
NEXT_PUBLIC_DOMAIN=archbuilder.ai
NEXT_PUBLIC_API_URL=https://api.archbuilder.ai
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 🔗 External Dependencies

### Core Dependencies
- **Next.js 15.5.3** - React framework
- **React 19** - UI library
- **TypeScript 5.7** - Type safety
- **Tailwind CSS 4** - Utility-first CSS
- **Framer Motion 10.18** - Animations
- **next-themes 0.2.1** - Theme management
- **@heroicons/react 2.2.0** - Icon set

### Development Dependencies
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **@next/bundle-analyzer** - Bundle analysis

## 📚 Further Reading

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

---

**Maintainer**: ArchBuilder.AI Development Team  
**Contact**: dev@archbuilder.ai  
**Last Updated**: 2025-09-24