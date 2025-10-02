'use client';

import { useEffect } from 'react';

export default function StructuredData() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Kruthika.fun",
      "alternateName": ["Kruthika AI Girlfriend", "Kruthika Virtual Companion"],
      "url": "https://kruthika.fun",
      "logo": "https://kruthika.fun/icon-192.png",
      "description": "World's most realistic AI girlfriend platform providing virtual companionship, emotional support for loneliness, and mental health companionship through advanced artificial intelligence. Trusted by 500K+ users globally in USA, UK, Canada, Australia.",
      "foundingDate": "2024",
      "areaServed": ["US", "GB", "CA", "AU", "IN", "Worldwide"],
      "availableLanguage": ["English", "Hindi", "Kannada"],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Support",
        "availableLanguage": ["English", "Hindi", "Kannada"],
        "areaServed": "Worldwide"
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
      "name": "Kruthika - AI Girlfriend & Virtual Companion",
      "url": "https://kruthika.fun",
      "description": "World's most realistic AI girlfriend chat and virtual companion. Free unlimited conversations with emotional intelligence, 24/7 availability for emotional support, loneliness relief, and mental health companionship.",
      "inLanguage": "en-US",
      "publisher": {
        "@type": "Organization",
        "name": "Kruthika.fun",
        "logo": {
          "@type": "ImageObject",
          "url": "https://kruthika.fun/icon-192.png"
        }
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
      "name": "Kruthika AI Girlfriend - Free Virtual Companion",
      "description": "World's most realistic AI girlfriend chat and virtual companion. Experience authentic conversations with Kruthika, your personal AI girlfriend for emotional support, loneliness relief, and companionship.",
      "url": "https://kruthika.fun",
      "applicationCategory": "SocialApplication",
      "operatingSystem": "Web Browser, iOS, Android, Windows, Mac, Linux",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "featureList": [
        "Free unlimited chat",
        "Emotional support for loneliness",
        "24/7 availability",
        "Mental health companionship",
        "Multilingual support",
        "Realistic conversations",
        "Privacy-focused",
        "No subscription required"
      ],
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "availableAtOrFrom": {
          "@type": "Place",
          "name": "Worldwide"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "15420",
        "bestRating": "5",
        "worstRating": "1",
        "reviewCount": "12350"
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
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "15420",
        "bestRating": "5"
      }
    };

    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Start Chatting with Your AI Girlfriend",
      "description": "Simple guide to start your free AI girlfriend conversation with Kruthika for emotional support and companionship",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Visit Kruthika.fun",
          "text": "Open your browser and visit Kruthika.fun - no registration required"
        },
        {
          "@type": "HowToStep",
          "name": "Start Chatting",
          "text": "Click on the chat interface and start your conversation with Kruthika"
        },
        {
          "@type": "HowToStep",
          "name": "Enjoy Unlimited Conversations",
          "text": "Chat freely about anything - emotional support, companionship, or just friendly conversation"
        }
      ]
    };

    const reviewSchema = {
      "@context": "https://schema.org",
      "@type": "Review",
      "itemReviewed": {
        "@type": "SoftwareApplication",
        "name": "Kruthika AI Girlfriend",
        "description": "AI girlfriend and virtual companion for emotional support"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "4.8",
        "bestRating": "5"
      },
      "author": {
        "@type": "Organization",
        "name": "Kruthika.fun Users"
      },
      "reviewBody": "Kruthika is the most realistic AI girlfriend I've tried. The emotional support for loneliness is genuinely helpful, and conversations feel natural and authentic. Perfect for anyone seeking virtual companionship."
    };

    const schemas = [organizationSchema, websiteSchema, webApplicationSchema, softwareAppSchema, howToSchema, reviewSchema];
    
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