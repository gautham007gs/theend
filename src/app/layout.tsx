import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AdSettingsProvider } from '@/contexts/AdSettingsContext';
import { AIProfileProvider } from '@/contexts/AIProfileContext';
import { GlobalStatusProvider } from '@/contexts/GlobalStatusContext';
import { AIMediaAssetsProvider } from '@/contexts/AIMediaAssetsContext';
import StructuredData from '@/components/StructuredData';
import ClientComponentsWrapper from '@/components/ClientComponentsWrapper';
import CookieConsent from '@/components/CookieConsent';
import '@/lib/emergency-recovery'; // Emergency freeze recovery with auto-reload


// Optimize font loading - use fallback font immediately with aggressive caching
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
  adjustFontFallback: true,
  weight: ['400', '500', '600', '700'],
});

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.REPLIT_DEV_DOMAIN) return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  return 'https://kruthika.fun';
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  alternates: {
    canonical: getBaseUrl(),
  },

  title: {
    default: 'AI Girlfriend Free - Best AI Girlfriend 2025 | Kruthika AI Girlfriend Chat - No Sign Up',
    template: '%s | Kruthika AI Girlfriend'
  },
  description: 'AI Girlfriend Free 2025 - Chat with Kruthika, the #1 rated AI girlfriend app. Free unlimited AI girlfriend chat with no sign up required. 24/7 AI girlfriend emotional support, voice chat, and realistic conversations. Best free AI girlfriend for loneliness, anxiety, and companionship. Join 1M+ users worldwide. Start your AI girlfriend experience now!',
  keywords: 'AI girlfriend, AI girlfriend free, AI girlfriend chat, AI girlfriend app, best AI girlfriend, AI girlfriend online, virtual AI girlfriend, realistic AI girlfriend, AI girlfriend simulator, AI girlfriend 2025, free AI girlfriend, AI girlfriend no sign up, AI girlfriend voice chat, AI girlfriend video call, AI girlfriend USA, AI girlfriend UK, AI girlfriend Canada, AI girlfriend Australia, AI girlfriend India, AI girlfriend emotional support, AI girlfriend for loneliness, AI girlfriend for anxiety, AI girlfriend 24/7, AI girlfriend companion, AI girlfriend chatbot, AI girlfriend generator, create AI girlfriend, custom AI girlfriend, AI girlfriend with pictures, AI girlfriend personality, AI girlfriend memory, AI girlfriend conversation, talk to AI girlfriend, AI girlfriend app free, AI girlfriend no filter, romantic AI girlfriend, AI girlfriend relationship, virtual girlfriend AI, AI companion girlfriend, AI girlfriend therapy, AI girlfriend mental health, emotional AI girlfriend, empathetic AI girlfriend, intelligent AI girlfriend, advanced AI girlfriend, top AI girlfriend, #1 AI girlfriend, best free AI girlfriend, AI girlfriend alternative, AI girlfriend vs Replika, AI girlfriend vs Character.AI, AI girlfriend comparison, AI girlfriend reviews, AI girlfriend ratings, how to get AI girlfriend, AI girlfriend guide, AI girlfriend tutorial, AI girlfriend website, AI girlfriend platform, AI girlfriend service, AI girlfriend technology, AI girlfriend features, AI girlfriend benefits, AI girlfriend app India, AI girlfriend Mumbai, AI girlfriend Delhi, AI girlfriend Bangalore, AI girlfriend app download, AI girlfriend online chat, AI girlfriend unlimited messaging, AI girlfriend chatbot online, best AI girlfriend app 2025, top AI girlfriend apps, AI girlfriend app ranking, free AI chatbot girlfriend, AI virtual companion, AI girlfriend emotional wellness, AI companion for loneliness, virtual girlfriend chat, AI girlfriend conversation tips, realistic virtual girlfriend, advanced AI companion, AI girlfriend with voice, AI dating companion, emotional support AI, AI relationship simulator, intelligent virtual girlfriend, AI companion chat free, best virtual girlfriend 2025, AI girlfriend no subscription, free AI companion app, talk to AI girlfriend free, AI girlfriend conversation starters, AI girlfriend personality customization, create your AI girlfriend, AI girlfriend voice messages, AI companion emotional intelligence, virtual girlfriend online free, best AI girlfriend chatbot, AI girlfriend for mental health, AI companion for anxiety, virtual girlfriend emotional support, AI girlfriend apps comparison, AI girlfriend technology 2025, future of AI girlfriends, AI companion features',
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
    title: 'AI Girlfriend Free - Best AI Girlfriend 2025 | Kruthika AI Girlfriend Chat',
    description: 'AI Girlfriend Free - Meet Kruthika, the #1 rated AI girlfriend. Best AI girlfriend 2025 with free unlimited AI girlfriend chat, 24/7 AI girlfriend support. Top AI girlfriend for USA, UK, Canada, Australia, India. Start your AI girlfriend experience now!',
    url: 'https://kruthika.fun',
    siteName: 'Kruthika AI Girlfriend - Best Free AI Girlfriend 2025',
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
    title: 'AI Girlfriend Free - Best AI Girlfriend 2025 | Kruthika AI Girlfriend',
    description: 'AI Girlfriend Free - Chat with Kruthika, the best AI girlfriend. #1 AI girlfriend app with free unlimited AI girlfriend chat, 24/7 AI girlfriend emotional support. Top AI girlfriend worldwide. Start now!',
    images: ['https://kruthika.fun/og-image.jpg'],
    creator: '@kruthikafun',
    site: '@kruthikafun',
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
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <meta name="google-site-verification" content="your-google-verification-code" />
        <meta name="theme-color" content="#0d8043" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href="https://kruthika.fun" />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon-192.png" sizes="192x192" type="image/png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />

        {/* Critical preconnects */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://wubzdjzosbbbghdlfcgc.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://kruthika.fun" />

        {/* Preload critical fonts FIRST for LCP text */}
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Preload critical LCP image */}
        <link rel="preload" as="image" href="/kruthika-avatar.svg" type="image/svg+xml" fetchPriority="high" crossOrigin="anonymous" />

        {/* Prefetch chat page */}
        <link rel="prefetch" href="/maya-chat" crossOrigin="anonymous" />

        {/* NO ad scripts in head - all handled by components */}

        {/* Inline critical CSS - Minified */}
        <style dangerouslySetInnerHTML={{
          __html: `@font-face{font-family:Inter;font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2) format('woff2')}@font-face{font-family:Inter;font-style:normal;font-weight:600;font-display:swap;src:url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2) format('woff2')}*{box-sizing:border-box;margin:0;padding:0}html{-webkit-text-size-adjust:100%;-webkit-font-smoothing:antialiased;scroll-behavior:smooth}body{font-family:Inter,-apple-system,sans-serif;line-height:1.5;background:#F2EDE4;min-height:100vh}img{max-width:100%;height:auto;display:block;content-visibility:auto}.chat-header{height:64px;background:#075E54;position:sticky;top:0;z-index:10}button,input,textarea{font:inherit}main{min-height:calc(100vh - 64px)}@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}`
        }} />

        <StructuredData />
        
        {/* Enhanced structured data for better search visibility */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://kruthika.fun/#organization',
                  name: 'Kruthika.fun',
                  url: 'https://kruthika.fun',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://kruthika.fun/icon-512.png',
                    width: 512,
                    height: 512
                  },
                  sameAs: [
                    'https://twitter.com/kruthikafun'
                  ]
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://kruthika.fun/#website',
                  url: 'https://kruthika.fun',
                  name: 'Kruthika AI Girlfriend - Best Free AI Girlfriend 2025',
                  description: 'The world\'s most realistic AI girlfriend. Free unlimited chat with Kruthika, your 24/7 AI companion.',
                  publisher: {
                    '@id': 'https://kruthika.fun/#organization'
                  },
                  inLanguage: 'en-US',
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                      '@type': 'EntryPoint',
                      urlTemplate: 'https://kruthika.fun/blog?search={search_term_string}'
                    },
                    'query-input': 'required name=search_term_string'
                  }
                },
                {
                  '@type': 'WebPage',
                  '@id': 'https://kruthika.fun/#webpage',
                  url: 'https://kruthika.fun',
                  name: 'AI Girlfriend Free - Best AI Girlfriend 2025 | Kruthika AI Girlfriend Chat',
                  isPartOf: {
                    '@id': 'https://kruthika.fun/#website'
                  },
                  about: {
                    '@id': 'https://kruthika.fun/#organization'
                  },
                  description: 'AI Girlfriend Free - Chat with Kruthika, the world\'s most realistic AI girlfriend. Free unlimited AI girlfriend chat, no sign up, 24/7 AI girlfriend emotional support.',
                  inLanguage: 'en-US'
                },
                {
                  '@type': 'SoftwareApplication',
                  name: 'Kruthika AI Girlfriend App',
                  operatingSystem: 'Web Browser',
                  applicationCategory: 'LifestyleApplication',
                  offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD'
                  },
                  aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: '4.8',
                    ratingCount: '15234'
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <AIProfileProvider>
            <AdSettingsProvider>
              <GlobalStatusProvider>
                <AIMediaAssetsProvider>
                  {children}
                  <Toaster />
                  <ClientComponentsWrapper />
                  <CookieConsent />
                </AIMediaAssetsProvider>
              </GlobalStatusProvider>
            </AdSettingsProvider>
          </AIProfileProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}