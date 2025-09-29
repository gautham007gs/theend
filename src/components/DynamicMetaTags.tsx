
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
  
  // Dynamic meta based on page
  const dynamicTitle = title || 'Kruthika.fun - #1 AI Girlfriend Chat';
  const dynamicDescription = description || 'Meet Kruthika, India\'s most realistic AI girlfriend. Experience authentic conversations and emotional connection with the best free AI girlfriend simulator.';
  const dynamicKeywords = keywords || 'AI girlfriend, virtual girlfriend, AI companion, AI chat, Kruthika.fun';
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
