# ArchBuilder.AI Website

🚀 **Production-ready AI-powered architectural design platform website**

[![Firebase Deploy](https://img.shields.io/badge/Firebase-Deployed-orange)](https://archbuilderai.web.app)
[![Analytics](https://img.shields.io/badge/GA4-Active-green)](https://analytics.google.com)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black)](https://nextjs.org)

Official marketing website for ArchBuilder.AI - an advanced AI-powered architectural design automation platform.

## 🌍 Multilingual Support

**Default Language**: English  
**Supported Languages**: English (🇺🇸), Turkish (🇹🇷), Russian (🇷🇺), German (🇩🇪), French (🇫🇷), Spanish (🇪🇸), Italian (🇮🇹)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server (with Turbopack)
npm run dev

# Open http://localhost:3000 in your browser
```

## 🎨 Features

- **Apple-vari Design**: Clean, minimal, premium aesthetic
- **Multilingual**: 7 languages with automatic browser detection
- **Responsive**: Perfect on desktop, tablet, and mobile
- **Dark/Light Mode**: Theme switching with persistence
- **Modern Tech Stack**: Next.js 15.5.3, React 19, TypeScript, Tailwind CSS 4
- **Glass Morphism**: Beautiful frosted glass UI effects
- **SEO Optimized**: Proper meta tags and language attributes
- **📊 Data Collection**: Firebase Firestore integration for forms
- **🛡️ Admin Panel**: Secure admin dashboard for managing submissions
- **📧 Contact Forms**: Working contact and newsletter subscription forms
- **🔥 Firebase Hosting**: Deployed on Firebase with custom domain support

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Heroicons
- **Animations**: Framer Motion
- **Theme**: next-themes
- **Development**: Turbopack (ultra-fast bundling)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Admin Panel)
- **Hosting**: Firebase Hosting
- **Forms**: React Hook Form + Firebase integration

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── layout/            # Header, Footer
│   ├── sections/          # Hero, Features, CTA, etc.
│   └── ui/                # Reusable components
├── lib/
│   └── i18n/              # Internationalization
│       ├── config.ts      # Language configuration
│       ├── context.tsx    # React Context provider
│       └── locales/       # Translation files
└── types/                 # TypeScript definitions
```

## 🌐 Internationalization

The website uses a custom i18n system built with React Context:

- **Browser Detection**: Automatically detects user's language
- **Local Storage**: Remembers language preference
- **Language Selector**: Dropdown with flags and native names
- **Type-Safe**: TypeScript support for all translation keys

### Adding New Languages

1. Add locale to `src/lib/i18n/config.ts`
2. Create translation file in `src/lib/i18n/locales/`
3. Add flag emoji and native name to config

## 🎯 Pages & Sections

- **Hero**: AI-powered architecture introduction
- **Features**: Key platform capabilities
- **Technology**: Technical infrastructure details
- **Pricing**: Subscription plans and pricing
- **CTA**: Call-to-action for user engagement
- **Footer**: Links, contact info, language selector

## 📱 Navigation Menu

- Overview
- Use Cases  
- Features
- Technology
- Pricing
- Contact

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Manual Deployment

```bash
# Build for production
npm run build

# Export static files (if needed)
npm run export

# Start production server
npm start
```

## 🔧 Development

```bash
# Start with Turbopack (faster)
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## 📄 License

Private and proprietary to ArchBuilder.AI.

---

Built with ❤️ by the ArchBuilder.AI team

## Governance & Templates

- Issue templates: `.github/ISSUE_TEMPLATE/` (bug, feature, documentation)
- PR template: `.github/PULL_REQUEST_TEMPLATE.md`
- Code owners: `.github/CODEOWNERS`
- Workflows: `.github/workflows/` (CI, PR governance, lint)

Follow the Issue-first workflow and branch naming conventions in:
- `.github/instructions/developer.instructions.md`
- `.github/copilot-instructions.md`

PRs must include a linked Issue via `Closes #<id>` and use a conventional title; governance checks will fail otherwise.
