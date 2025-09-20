
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a clean, readable font
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
// import { Providers } from './providers'; // No longer using the generic Providers component
import InstagramBrowserPrompt from '@/components/InstagramBrowserPrompt';
import GlobalAdScripts from '@/components/GlobalAdScripts';
import SocialBarAdDisplay from '@/components/SocialBarAdDisplay'; // Import SocialBarAdDisplay
import { AdSettingsProvider } from '@/contexts/AdSettingsContext';
import { AIProfileProvider } from '@/contexts/AIProfileContext';
import { GlobalStatusProvider } from '@/contexts/GlobalStatusContext';
import { AIMediaAssetsProvider } from '@/contexts/AIMediaAssetsContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Kruthika.fun - AI Girlfriend Chat | Virtual Companion Online',
  description: 'Meet Kruthika, your AI girlfriend and virtual companion at Kruthika.fun. Experience realistic AI chat conversations, emotional connection, and 24/7 companionship. Free AI girlfriend simulator with authentic Indian personality.',
  keywords: 'Kruthika.fun, AI girlfriend, virtual girlfriend, AI companion, AI chat, virtual companion, AI boyfriend alternative, online girlfriend, chatbot girlfriend, AI relationship simulator, virtual dating, AI girlfriend free, Indian AI girlfriend, Mumbai girl AI, college girl AI, emotional AI, AI girlfriend chat, virtual relationship, AI dating simulator, companion AI, girlfriend simulator, AI chat app, virtual girlfriend online',
  authors: [{ name: 'Kruthika.fun Team' }],
  creator: 'Kruthika.fun',
  publisher: 'Kruthika.fun',
  robots: 'index, follow',
  openGraph: {
    title: 'Kruthika.fun - AI Girlfriend Chat | Virtual Companion',
    description: 'Meet Kruthika, your AI girlfriend and virtual companion. Experience realistic conversations and emotional connection with your personal AI girlfriend.',
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
    title: 'Kruthika.fun - AI Girlfriend Chat | Virtual Companion',
    description: 'Meet Kruthika, your AI girlfriend and virtual companion. Experience realistic conversations and emotional connection.',
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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* <Providers> Removed this generic wrapper */}
          <AdSettingsProvider>
            <AIProfileProvider>
              <GlobalStatusProvider>
                <AIMediaAssetsProvider>
                  <InstagramBrowserPrompt />
                  <GlobalAdScripts />
                  {children}
                  <SocialBarAdDisplay /> {/* Add SocialBarAdDisplay here */}
                  <Toaster />
                </AIMediaAssetsProvider>
              </GlobalStatusProvider>
            </AIProfileProvider>
          </AdSettingsProvider>
        {/* </Providers> */}
      </body>
    </html>
  );
}
