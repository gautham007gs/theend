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

        {/* Critical preconnects */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://wubzdjzosbbbghdlfcgc.supabase.co" />
        
        {/* Preload critical LCP image */}
        <link rel="preload" as="image" href="/kruthika-avatar.svg" type="image/svg+xml" fetchPriority="high" />
        
        {/* Prefetch chat page */}
        <link rel="prefetch" href="/maya-chat" />

        {/* Inline critical CSS */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @font-face{font-family:'Inter';font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2) format('woff2')}
            @font-face{font-family:'Inter';font-style:normal;font-weight:600;font-display:swap;src:url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2) format('woff2')}
            *{box-sizing:border-box;margin:0;padding:0}
            html{-webkit-text-size-adjust:100%;-webkit-font-smoothing:antialiased;scroll-behavior:smooth}
            body{font-family:Inter,-apple-system,sans-serif;line-height:1.5;background:#F2EDE4;min-height:100vh;overflow-x:hidden;position:relative}
            img{max-width:100%;height:auto;display:block}
            .avatar-placeholder,[class*="avatar"]{width:48px;height:48px;border-radius:50%;flex-shrink:0}
            .chat-header{height:64px;background:#fff;border-bottom:1px solid #e5e7eb;position:sticky;top:0;z-index:10}
            button,input,textarea{font:inherit;touch-action:manipulation}
            [hidden]{display:none!important}
            main{min-height:calc(100vh - 64px);contain:layout style paint}
            @media (prefers-reduced-motion:reduce){*{animation-duration:0.01ms!important;transition-duration:0.01ms!important;scroll-behavior:auto!important}}
          `
        }} />

        <StructuredData />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning={true}>
        <ErrorBoundary>
          <AIProfileProvider>
            <AdSettingsProvider>
              <GlobalStatusProvider>
                <AIMediaAssetsProvider>
                  {children}
                  <Toaster />
                  <ClientComponentsWrapper />
                </AIMediaAssetsProvider>
              </GlobalStatusProvider>
            </AdSettingsProvider>
          </AIProfileProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}