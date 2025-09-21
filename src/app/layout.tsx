import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { I18nProvider } from "@/lib/i18n";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ArchBuilder.AI - AI-Powered Architectural Design Automation",
  description: "Revolutionizing architectural design through AI-powered automation with hybrid desktop-cloud architecture. Integrates Revit, OpenAI, and multi-format CAD processing.",
  keywords: [
    "AI architecture",
    "Revit automation",
    "architectural design",
    "BIM modeling",
    "CAD processing",
    "building design",
    "OpenAI",
    "Claude AI",
    "Vertex AI"
  ],
  authors: [{ name: "ArchBuilder.AI Team" }],
  creator: "ArchBuilder.AI",
  publisher: "ArchBuilder.AI",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://archbuilder.app",
    title: "ArchBuilder.AI - AI-Powered Architectural Design Automation",
    description: "Revolutionizing architectural design through AI-powered automation",
    siteName: "ArchBuilder.AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArchBuilder.AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ArchBuilder.AI - AI-Powered Architectural Design",
    description: "Revolutionizing architectural design through AI-powered automation",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <I18nProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
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
      </body>
    </html>
  );
}
