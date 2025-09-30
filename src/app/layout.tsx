import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import ErrorBoundary from "@/components/ErrorBoundary";
import InstagramBrowserPrompt from '@/components/InstagramBrowserPrompt';
import GlobalAdScripts from '@/components/GlobalAdScripts';
import SocialBarAdDisplay from '@/components/SocialBarAdDisplay';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import ResourceHints from '@/components/ResourceHints';
import { AdSettingsProvider } from '@/contexts/AdSettingsContext';
import { AIProfileProvider } from '@/contexts/AIProfileContext';
import { GlobalStatusProvider } from '@/contexts/GlobalStatusContext';
import { AIMediaAssetsProvider } from '@/contexts/AIMediaAssetsContext';
import CookieConsent from '@/components/CookieConsent';
import StructuredData from '@/components/StructuredData';
import ClientOnly from '@/components/ClientOnly';
import '@/lib/critical-performance-boost';
import MobilePerformanceOptimizer from '@/components/MobilePerformanceOptimizer';

// Optimize font loading for better performance
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap', // Improved font display strategy
  preload: true
});

export const metadata: Metadata = {
  title: {
    default: 'Kruthika.fun - India\'s Most Realistic AI Girlfriend | Free Chat',
    template: '%s | Kruthika.fun'
  },
  description: 'Meet Kruthika - India\'s most authentic AI girlfriend. Free unlimited chat with emotional intelligence, cultural understanding, and genuine personality. Start chatting now!',
  keywords: 'Kruthika.fun, AI girlfriend, AI girlfriend free, best AI girlfriend 2025, virtual girlfriend, AI companion, AI chat, virtual companion, AI girlfriend India, AI girlfriend chat, online girlfriend, chatbot girlfriend, AI relationship simulator, virtual dating, Indian AI girlfriend, Mumbai AI girlfriend, college girl AI, emotional AI, virtual relationship, AI dating simulator, companion AI, girlfriend simulator, AI chat app, virtual girlfriend online, AI girlfriend 2024, realistic AI girlfriend, authentic AI girlfriend, AI companion chat, virtual girlfriend free, AI dating app, virtual girlfriend simulator, AI girlfriend experience, Indian virtual girlfriend, psychology AI girlfriend, emotional support AI, mental health companion, loneliness solution, relationship practice AI, hindi AI girlfriend, multilingual AI chat, emotional intelligence AI, realistic conversation AI',
  authors: [{ name: 'Kruthika.fun Team' }],
  creator: 'Kruthika.fun',
  publisher: 'Kruthika.fun',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  openGraph: {
    title: 'Kruthika.fun - #1 AI Girlfriend Chat | Best Virtual Companion 2024',
    description: 'Meet Kruthika, India\'s most realistic AI girlfriend. Experience authentic conversations and emotional connection with the best free AI girlfriend simulator. Chat now!',
    url: 'https://kruthika.fun',
    siteName: 'Kruthika.fun',
    images: [
      {
        url: 'https://kruthika.fun/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Kruthika.fun - AI Girlfriend Chat',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kruthika.fun - #1 AI Girlfriend Chat | Best Virtual Companion 2024',
    description: 'Meet Kruthika, India\'s most realistic AI girlfriend. Free AI dating with authentic conversations and emotional connection. Chat with your virtual girlfriend now!',
    images: ['https://kruthika.fun/og-image.png'],
    creator: '@kruthikafun',
  },
  alternates: {
    canonical: 'https://kruthika.fun',
  },
  other: {
    'google-site-verification': 'verification-for-kruthika-fun-search-console',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="your-google-verification-code" />
        <meta name="theme-color" content="#4F46E5" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="canonical" href="https://kruthika.fun" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon-192.png" sizes="192x192" type="image/png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />

        {/* Critical performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://placehold.co" />
        <link rel="dns-prefetch" href="https://i.imghippo.com" />
        <link rel="preload" href="/chat-bg.png" as="image" type="image/png" />
        <link rel="modulepreload" href="/_next/static/chunks/webpack.js" />

        {/* Critical CSS moved to globals.css to prevent hydration issues */}

        <ResourceHints />
        <StructuredData />

        {/* Reduce CLS with font metrics - use CSS variables only */}
        
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning={true}>
        <ErrorBoundary>
          <AdSettingsProvider>
            <AIProfileProvider>
              <GlobalStatusProvider>
                <AIMediaAssetsProvider>
                  <InstagramBrowserPrompt />
                  <GlobalAdScripts />
                  <ServiceWorkerRegistration />
                  <ResourceHints />
                  {children}
                  <SocialBarAdDisplay /> {/* Add SocialBarAdDisplay here */}
                  <CookieConsent />
                  <Toaster />
                  <PerformanceMonitor /> {/* Include PerformanceMonitor here */}
                  <MobilePerformanceOptimizer />
                </AIMediaAssetsProvider>
              </GlobalStatusProvider>
            </AIProfileProvider>
          </AdSettingsProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}