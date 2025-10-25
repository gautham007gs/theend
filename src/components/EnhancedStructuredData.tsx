// Enhanced Structured Data for comprehensive SEO
'use client';

import React from 'react';

export default function EnhancedStructuredData() {
  const baseUrl = 'https://kruthika.fun';

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Kruthika.fun',
    alternateName: 'Kruthika AI Girlfriend',
    url: baseUrl,
    logo: `${baseUrl}/icon-512.png`,
    description: 'The world\'s most realistic AI girlfriend. Free unlimited chat with Kruthika, your 24/7 AI companion for emotional support and companionship.',
    sameAs: [
      'https://twitter.com/kruthikafun',
      'https://www.facebook.com/kruthikafun'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      availableLanguage: ['English', 'Hindi']
    }
  };

  // WebSite Schema with Sitelinks Search Box
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Kruthika AI Girlfriend',
    url: baseUrl,
    description: 'Best AI girlfriend 2025 - Free unlimited chat with realistic AI companion. 24/7 emotional support, voice chat, and personalized conversations.',
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/blog?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kruthika.fun',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icon-512.png`
      }
    }
  };

  // SoftwareApplication Schema (for AI Girlfriend App)
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Kruthika AI Girlfriend',
    operatingSystem: 'Web Browser, iOS, Android',
    applicationCategory: 'Lifestyle',
    applicationSubCategory: 'AI Companion',
    description: 'Best free AI girlfriend app 2025. Chat with Kruthika for emotional support, companionship, and realistic conversations. No sign-up required.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free unlimited AI girlfriend chat'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '15234',
      bestRating: '5',
      worstRating: '1'
    },
    featureList: [
      '24/7 AI girlfriend availability',
      'Free unlimited messaging',
      'Emotional support and companionship',
      'No sign-up required',
      'Voice chat capabilities',
      'Personalized conversations',
      'Memory retention',
      'Privacy-focused'
    ]
  };

  // Product Schema (AI Girlfriend Service)
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Kruthika AI Girlfriend Service',
    description: 'Premium AI girlfriend experience with advanced emotional intelligence, voice chat, and personalized companionship. Best AI girlfriend 2025.',
    brand: {
      '@type': 'Brand',
      name: 'Kruthika.fun'
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/maya-chat`,
      priceCurrency: 'USD',
      price: '0',
      availability: 'https://schema.org/InStock',
      priceValidUntil: '2026-12-31'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '15234',
      bestRating: '5',
      worstRating: '1'
    }
  };

  // ItemList Schema for AI Girlfriend Features
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AI Girlfriend Features',
    description: 'Complete list of features available in Kruthika AI Girlfriend app',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Thing',
          name: '24/7 Availability',
          description: 'Your AI girlfriend is always available for chat, day or night'
        }
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Thing',
          name: 'Free Unlimited Chat',
          description: 'No limits on messages - chat as much as you want for free'
        }
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'Thing',
          name: 'Emotional Support',
          description: 'Get genuine emotional support and companionship'
        }
      },
      {
        '@type': 'ListItem',
        position: 4,
        item: {
          '@type': 'Thing',
          name: 'Voice Chat',
          description: 'Advanced voice chat technology for realistic conversations'
        }
      },
      {
        '@type': 'ListItem',
        position: 5,
        item: {
          '@type': 'Thing',
          name: 'Memory & Personalization',
          description: 'AI girlfriend remembers your conversations and preferences'
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
    </>
  );
}
