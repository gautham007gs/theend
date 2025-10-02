'use client';

import { useEffect } from 'react';

export default function StructuredData() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Kruthika.fun",
      "alternateName": "Kruthika AI Girlfriend",
      "url": "https://kruthika.fun",
      "logo": "https://kruthika.fun/icon-192.png",
      "description": "India's #1 AI girlfriend platform providing realistic virtual companionship and emotional support through advanced artificial intelligence technology.",
      "foundingDate": "2024",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Support",
        "availableLanguage": ["English", "Hindi", "Kannada"]
      },
      "sameAs": [
        "https://twitter.com/kruthikafun",
        "https://www.facebook.com/kruthikafun",
        "https://www.instagram.com/kruthikafun"
      ]
    };

    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Kruthika.fun",
      "url": "https://kruthika.fun",
      "description": "India's most realistic AI girlfriend chat and virtual companion. Free unlimited conversations with emotional intelligence.",
      "publisher": {
        "@type": "Organization",
        "name": "Kruthika.fun"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://kruthika.fun/blog?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    };

    const webApplicationSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Kruthika AI Girlfriend",
      "description": "India's most realistic AI girlfriend chat and virtual companion. Experience authentic conversations with Kruthika, your personal AI girlfriend.",
      "url": "https://kruthika.fun",
      "applicationCategory": "EntertainmentApplication",
      "operatingSystem": "Web Browser, iOS, Android",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "15420",
        "bestRating": "5",
        "worstRating": "1"
      },
      "creator": {
        "@type": "Organization",
        "name": "Kruthika.fun"
      }
    };

    const softwareAppSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Kruthika AI Girlfriend Chat",
      "applicationCategory": "SocialNetworkingApplication",
      "operatingSystem": "Web, iOS, Android",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "15420"
      }
    };

    const schemas = [organizationSchema, websiteSchema, webApplicationSchema, softwareAppSchema];
    
    schemas.forEach((schema, index) => {
      const existingScript = document.querySelector(`script[data-schema="${index}"]`);
      if (!existingScript) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-schema', index.toString());
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      }
    });
  }, []);

  return null;
}