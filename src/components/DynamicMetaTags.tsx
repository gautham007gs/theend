
'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';

interface DynamicMetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export default function DynamicMetaTags({
  title,
  description,
  keywords,
  ogImage,
  canonicalUrl
}: DynamicMetaTagsProps) {
  const pathname = usePathname();
  const baseUrl = 'https://kruthika.fun';
  const fullUrl = canonicalUrl || `${baseUrl}${pathname}`;
  
  // Dynamic meta based on page with trending 2025 keywords
  const dynamicTitle = title || 'Kruthika - Best Free AI Girlfriend 2025 | No Sign Up | Voice Chat';
  const dynamicDescription = description || 'Meet Kruthika, the world\'s most realistic AI girlfriend. Free unlimited chat, no sign up required, voice chat available, 24/7 emotional support. Better than Replika, Character.AI & Candy.AI. Start now!';
  const dynamicKeywords = keywords || 'AI girlfriend, AI girlfriend free, virtual girlfriend, realistic AI girlfriend 2025, AI girlfriend no sign up, AI girlfriend voice chat, best AI girlfriend app 2025, Replika alternative, Character.AI alternative, Candy.AI alternative, free AI girlfriend apps, AI companion, AI girlfriend chat, AI girlfriend generator, create AI girlfriend, virtual companion, AI girlfriend simulator, AI girlfriend with pictures, emotional support AI, 24/7 AI companion, conversational AI girlfriend, AI girlfriend online, best free AI girlfriend 2025';
  const dynamicOgImage = ogImage || `${baseUrl}/og-image.png`;

  return (
    <>
      <title>{dynamicTitle}</title>
      <meta name="description" content={dynamicDescription} />
      <meta name="keywords" content={dynamicKeywords} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={dynamicTitle} />
      <meta property="og:description" content={dynamicDescription} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={dynamicOgImage} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Kruthika.fun" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={dynamicTitle} />
      <meta name="twitter:description" content={dynamicDescription} />
      <meta name="twitter:image" content={dynamicOgImage} />
      
      {/* Additional SEO */}
      <meta name="author" content="Kruthika.fun" />
      <meta name="language" content="en-IN" />
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="Mumbai, India" />
    </>
  );
}
