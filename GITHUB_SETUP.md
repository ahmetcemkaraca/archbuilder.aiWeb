# GitHub Repository Setup Instructions

To push this website to GitHub, you need to:

## 1. Create a new repository on GitHub

1. Go to https://github.com/new
2. Repository name: `archbuilder-ai-website`
3. Description: `ArchBuilder.AI - Official Website - Multilingual AI-Powered Architecture Platform`
4. Make it **Public**
5. Do NOT initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## 2. Push the code

Once the repository is created, run:

```bash
git push -u origin main
```

## Repository Details

- **Repository Name**: archbuilder-ai-website
- **Owner**: ahmetcemkaraca
- **Description**: ArchBuilder.AI - Official Website - Multilingual AI-Powered Architecture Platform
- **Technologies**: Next.js 15.5.3, React 19, TypeScript, Tailwind CSS 4, i18n (7 languages)
- **Features**:
  - Multilingual support (English, Turkish, Russian, German, French, Spanish, Italian)
  - Apple-vari design aesthetic
  - Responsive and mobile-friendly
  - Dark/Light theme support
  - Modern glass-morphism UI
  - SEO optimized

## Website Features

### 🌍 Multilingual Support
- **Default Language**: English
- **Supported Languages**: English, Turkish, Russian, German, French, Spanish, Italian
- **Language Selector**: Dropdown with flags and native language names
- **Browser Detection**: Automatic language detection with localStorage persistence

### 🎨 Design & UX
- **Apple-vari Aesthetic**: Clean, minimal, premium design
- **Glass Morphism**: Modern frosted glass effects
- **Responsive Design**: Perfect on all devices
- **Dark/Light Mode**: Theme switching with persistence
- **Smooth Animations**: Framer Motion powered transitions

### 📱 Navigation
- **Header Menu**: Overview, Use Cases, Features, Technology, Pricing, Contact
- **Mobile Friendly**: Hamburger menu for mobile devices
- **Sticky Header**: Fixed navigation with glass effect
- **Language Switcher**: Accessible language selection

### 🚀 Performance
- **Next.js 15.5.3**: Latest framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Full type safety
- **Tailwind CSS 4**: Latest version with optimized builds
- **Turbopack**: Ultra-fast bundling for development

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

This website is ready to deploy on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **GitHub Pages** (with GitHub Actions)
- **Any static hosting provider**

For Vercel deployment:
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Next.js and configure build settings
3. Deploy with one click

## Environment Variables

Create a `.env.local` file for local development:

```env
# Add any environment variables here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## File Structure

```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── layout/            # Header, Footer components
│   ├── sections/          # Hero, Features, CTA sections
│   └── ui/                # Reusable UI components
├── lib/
│   └── i18n/              # Internationalization system
└── types/                 # TypeScript type definitions
```

## Contributing

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Make your changes
5. Test the website in different languages
6. Submit a pull request

## License

This project is private and proprietary to ArchBuilder.AI.