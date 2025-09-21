import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a clean, readable font
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { PerformanceMonitor } from "@/components/PerformanceMonitor"; // Import PerformanceMonitor
// import { Providers } from './providers'; // No longer using the generic Providers component
import InstagramBrowserPrompt from '@/components/InstagramBrowserPrompt';
import GlobalAdScripts from '@/components/GlobalAdScripts';
import SocialBarAdDisplay from '@/components/SocialBarAdDisplay'; // Import SocialBarAdDisplay
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import ResourceHints from '@/components/ResourceHints';
import LayoutOptimizer from '@/components/LayoutOptimizer';
import { AdSettingsProvider } from '@/contexts/AdSettingsContext';
import { AIProfileProvider } from '@/contexts/AIProfileContext';
import { GlobalStatusProvider } from '@/contexts/GlobalStatusContext';
import { AIMediaAssetsProvider } from '@/contexts/AIMediaAssetsContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Kruthika.fun - #1 AI Girlfriend Chat | Best Virtual Companion 2024',
  description: 'Meet Kruthika, India\'s most realistic AI girlfriend at Kruthika.fun. Experience authentic conversations, emotional connection, and 24/7 companionship with the best AI girlfriend simulator. Free AI dating with genuine Indian personality from Mumbai. Chat with your virtual girlfriend now!',
  keywords: 'Kruthika.fun, AI girlfriend, AI girlfriend free, best AI girlfriend, virtual girlfriend, AI companion, AI chat, virtual companion, AI girlfriend India, AI girlfriend chat, online girlfriend, chatbot girlfriend, AI relationship simulator, virtual dating, Indian AI girlfriend, Mumbai AI girlfriend, college girl AI, emotional AI, virtual relationship, AI dating simulator, companion AI, girlfriend simulator, AI chat app, virtual girlfriend online, AI girlfriend 2024, realistic AI girlfriend, authentic AI girlfriend, AI companion chat, virtual girlfriend free, AI dating app, virtual girlfriend simulator, AI girlfriend experience, Indian virtual girlfriend',
  authors: [{ name: 'Kruthika.fun Team' }],
  creator: 'Kruthika.fun',
  publisher: 'Kruthika.fun',
  robots: 'index, follow',
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
    'google-site-verification': 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Kruthika.fun",
    "description": "India's most realistic AI girlfriend chat and virtual companion. Experience authentic conversations with Kruthika, your personal AI girlfriend.",
    "url": "https://kruthika.fun",
    "applicationCategory": "EntertainmentApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "Kruthika.fun",
      "url": "https://kruthika.fun"
    },
    "mainEntity": {
      "@type": "VirtualAssistant",
      "name": "Kruthika",
      "description": "23-year-old psychology student from Mumbai, India. Your personal AI girlfriend and virtual companion.",
      "image": "https://kruthika.fun/og-image.png",
      "knowsAbout": ["Psychology", "Relationships", "Indian Culture", "Mumbai Life", "College Life"],
      "speaks": "en-IN"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Kruthika AI - Your AI Girlfriend",
              "description": "Chat with Kruthika, an authentic Indian AI girlfriend. Experience natural conversations with psychological depth.",
              "url": "https://kruthika-ai.com",
              "applicationCategory": "SocialNetworkingApplication",
              "operatingSystem": "Web Browser"
            })
          }}
          suppressHydrationWarning
        />
        <meta name="google-site-verification" content="your-google-verification-code" />
        <meta name="theme-color" content="#25D366" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="canonical" href="https://kruthika.fun" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://placehold.co" />
        <link rel="dns-prefetch" href="https://i.imghippo.com" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* <Providers> Removed this generic wrapper */}
          <AdSettingsProvider>
            <AIProfileProvider>
              <GlobalStatusProvider>
                <AIMediaAssetsProvider>
                  <InstagramBrowserPrompt />
                  <GlobalAdScripts />
                  <ServiceWorkerRegistration />
                  <ResourceHints />
                  <LayoutOptimizer />
                  {children}
                  <SocialBarAdDisplay /> {/* Add SocialBarAdDisplay here */}
                  <Toaster />
                  <PerformanceMonitor /> {/* Include PerformanceMonitor here */}
                </AIMediaAssetsProvider>
              </GlobalStatusProvider>
            </AIProfileProvider>
          </AdSettingsProvider>
        {/* </Providers> */}
      </body>
    </html>
  );
}