import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { I18nProvider } from "@/lib/i18n";
import { Toaster } from "react-hot-toast";
import { StructuredData } from "@/components/seo/structured-data";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import CookieBanner from "@/components/ui/cookie-banner";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "ArchBuilder.AI - AI-Powered Architectural Design Automation",
    template: "%s | ArchBuilder.AI"
  },
  description: "Transform your architectural projects with AI-powered automation. Integrates with Revit, processes DWG/IFC/PDF files, and creates step-by-step project workflows using advanced AI models.",
  keywords: [
    "AI architecture",
    "Revit automation", 
    "architectural design",
    "BIM modeling",
    "CAD processing",
    "building design", 
    "DWG processing",
    "IFC analysis",
    "PDF regulations",
    "AI building design",
    "automated architecture",
    "OpenAI GPT-4",
    "Vertex AI Gemini",
    "architectural workflow",
    "smart building design"
  ],
  authors: [{ name: "ArchBuilder.AI Team", url: "https://archbuilder.ai" }],
  creator: "ArchBuilder.AI",
  publisher: "ArchBuilder.AI", 
  applicationName: "ArchBuilder.AI",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN && process.env.NEXT_PUBLIC_DOMAIN.startsWith('http') ? process.env.NEXT_PUBLIC_DOMAIN : 'https://archbuilder.ai'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'tr-TR': '/tr', 
      'ru-RU': '/ru',
      'de-DE': '/de',
      'fr-FR': '/fr',
      'es-ES': '/es',
      'it-IT': '/it',
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: (process.env.NEXT_PUBLIC_DOMAIN && process.env.NEXT_PUBLIC_DOMAIN.startsWith('http')) ? process.env.NEXT_PUBLIC_DOMAIN : 'https://archbuilder.ai',
    title: "ArchBuilder.AI - AI-Powered Architectural Design Automation",
    description: "Transform your architectural projects with AI-powered automation. Integrates with Revit, processes DWG/IFC/PDF files, and creates intelligent project workflows.",
    siteName: "ArchBuilder.AI",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArchBuilder.AI - AI-Powered Architectural Design Platform",
        type: "image/png",
      },
      {
        url: "/images/og-logo.png", 
        width: 512,
        height: 512,
        alt: "ArchBuilder.AI Logo",
        type: "image/png",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@archbuilder_ai",
    creator: "@archbuilder_ai",
    title: "ArchBuilder.AI - AI-Powered Architectural Design",
    description: "Transform your architectural projects with AI-powered automation. Integrates with Revit and processes multi-format CAD files.",
    images: ["/images/og-image.png"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
  },
  category: 'technology',
  classification: 'AI Software, Architecture, CAD, BIM',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData locale="en" />
        <link rel="canonical" href={(process.env.NEXT_PUBLIC_DOMAIN && process.env.NEXT_PUBLIC_DOMAIN.startsWith('http')) ? process.env.NEXT_PUBLIC_DOMAIN : 'https://archbuilder.ai'} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ArchBuilder.AI" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="ArchBuilder.AI" />
        
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        
        {/* Performance optimizations */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `}
        </Script>

        <ErrorBoundary>
          <I18nProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <CookieBanner />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
            </ThemeProvider>
          </I18nProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
