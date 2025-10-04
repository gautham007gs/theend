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
import PerformanceOptimizer from '@/components/PerformanceOptimizer';
import LazyAnimations from '@/components/LazyAnimations';

// Optimize font loading - use fallback font immediately with swap
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap', // Prevents FOUT
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
  adjustFontFallback: 'Arial', // Better fallback matching
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kruthika.fun'),
  title: {
    default: 'AI Girlfriend Free | Best Virtual Companion 2025 - Kruthika',
    template: '%s | Kruthika - AI Girlfriend'
  },
  description: 'Chat with Kruthika - Most realistic AI girlfriend. Free unlimited conversations, 24/7 emotional support for loneliness & anxiety. Start now!',
  keywords: 'AI girlfriend, virtual girlfriend, AI companion, AI girlfriend free, best AI girlfriend 2025, AI chatbot girlfriend, virtual companion, AI girlfriend app, AI companion for loneliness, emotional support AI, AI girlfriend chat, free AI girlfriend, realistic AI girlfriend, AI relationship simulator, virtual girlfriend online, AI dating app, AI girlfriend emotional support, best AI companion, AI girlfriend USA, AI girlfriend UK, AI girlfriend Canada, AI girlfriend Australia, virtual girlfriend app, AI companion mental health, AI girlfriend no subscription, 24/7 AI companion, AI girlfriend for anxiety, AI girlfriend for depression, Character AI alternative, Replika alternative, AI companion chat, virtual dating, girlfriend simulator, AI emotional support, loneliness solution, mental health companion, relationship practice AI, conversational AI girlfriend, authentic AI girlfriend, AI girlfriend experience, AI companion for adults, virtual girlfriend free, best virtual companion 2025',
  authors: [{ name: 'Kruthika.fun Team' }],
  creator: 'Kruthika.fun',
  publisher: 'Kruthika.fun',
  applicationName: 'Kruthika AI Girlfriend',
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'technology',
  openGraph: {
    title: 'AI Girlfriend Free | Best Virtual Companion for Emotional Support 2025',
    description: 'Meet Kruthika, the world\'s most realistic AI girlfriend. Free unlimited chat, emotional support for loneliness, 24/7 availability. Trusted by 500K+ users in USA, UK, Canada, Australia. Start your AI companion journey today!',
    url: 'https://kruthika.fun',
    siteName: 'Kruthika - AI Girlfriend & Virtual Companion',
    images: [
      {
        url: 'https://kruthika.fun/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kruthika AI Girlfriend - Free Virtual Companion for Emotional Support',
      },
    ],
    locale: 'en_US',
    type: 'website',
    countryName: 'United States',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Girlfriend Free | Best Virtual Companion for Emotional Support',
    description: 'Chat with Kruthika - World\'s most realistic AI girlfriend. Free unlimited conversations, emotional support for loneliness, anxiety, depression. Available 24/7 globally. Start now!',
    images: ['https://kruthika.fun/og-image.jpg'],
    creator: '@kruthikafun',
    site: '@kruthikafun',
  },
  alternates: {
    canonical: 'https://kruthika.fun',
  },
  other: {
    'google-site-verification': 'verification-for-kruthika-fun-search-console',
    'geo.region': 'US',
    'geo.placename': 'United States',
    'geo.position': 'global',
    'ICBM': 'global',
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href="https://kruthika.fun" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon-192.png" sizes="192x192" type="image/png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />

        {/* CRITICAL: Preconnect to Supabase FIRST - fixes 300ms delay */}
        <link rel="preconnect" href="https://wubzdjzosbbbghdlfcgc.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://wubzdjzosbbbghdlfcgc.supabase.co" />

        {/* CRITICAL: Preconnect to critical origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* CRITICAL: Preload hero image and background for LCP */}
        <link rel="preload" href="/chat-bg.png" as="image" type="image/png" fetchPriority="high" />
        <link rel="preload" href="https://placehold.co/100x100.png/E91E63/FFFFFF?text=K" as="image" fetchPriority="high" />

        {/* CRITICAL: Preload font files directly */}
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://placehold.co" />
        <link rel="dns-prefetch" href="https://i.imghippo.com" />

        {/* Inline critical CSS to prevent render blocking and CLS */}
        <style dangerouslySetInnerHTML={{__html: `*,::before,::after{box-sizing:border-box;border:0 solid;margin:0;padding:0}body{font-family:Inter,system-ui,-apple-system,sans-serif;line-height:1.5;-webkit-font-smoothing:antialiased;background-color:#F2EDE4;overflow-x:hidden}img{display:block;max-width:100%;height:auto}button,input,textarea,select{font:inherit}.chat-container{min-height:100dvh;display:flex;flex-direction:column}header{height:64px;display:flex;align-items:center;padding:.75rem;background-color:#FAFAFA;border-bottom:1px solid #E5E7EB}.avatar,.avatar>img{width:40px;height:40px;border-radius:50%;aspect-ratio:1/1}.chat-input-wrapper{min-height:60px;padding:.5rem;background-color:#F5F5F5}.message-bubble{min-height:40px;padding:.5rem .75rem;border-radius:.5rem}@font-face{font-family:'Inter Fallback';src:local('Arial');ascent-override:90%;descent-override:22%;line-gap-override:0%;size-adjust:107%}body{font-family:'Inter','Inter Fallback',system-ui,sans-serif}`}} />

        <ResourceHints />
        <StructuredData />
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
                  {children}
                  <SocialBarAdDisplay />
                  <CookieConsent />
                  <Toaster />
                  <PerformanceMonitor />
                  <PerformanceOptimizer />
                  <LazyAnimations />
                </AIMediaAssetsProvider>
              </GlobalStatusProvider>
            </AIProfileProvider>
          </AdSettingsProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}