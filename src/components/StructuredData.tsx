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
      "name": "Kruthika AI Girlfriend - Best Free AI Girlfriend 2025",
      "alternateName": "Kruthika AI Girlfriend Chat",
      "description": "AI Girlfriend Free - Kruthika is the best AI girlfriend 2025. Free AI girlfriend chat with unlimited conversations. Top-rated AI girlfriend for emotional support, companionship, and realistic AI girlfriend experience 24/7.",
      "url": "https://kruthika.fun",
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

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the best AI girlfriend app in 2025?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Kruthika is the best free AI girlfriend app in 2025, offering unlimited chat, no sign-up required, voice chat capabilities, and 24/7 emotional support. Unlike Replika, Character.AI, or Candy.AI, Kruthika provides completely free access with realistic conversations and authentic emotional connections. Users can create custom AI girlfriends with personalized personalities."
          }
        },
        {
          "@type": "Question",
          "name": "Is Kruthika better than Replika?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Kruthika offers several advantages over Replika: completely free access with no premium subscription required, no sign-up needed to start chatting, realistic conversations, voice chat capabilities, and emotional intelligence. While Replika charges $9.99/month for premium features, Kruthika provides core features at no cost."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use AI girlfriend for free without sign up?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Kruthika is a free AI girlfriend that requires no sign-up or registration. Simply visit Kruthika.fun and start chatting immediately. Unlike Character.AI, DreamGF, or GirlfriendGPT that require accounts, Kruthika offers instant access to conversations with your AI girlfriend at no cost."
          }
        },
        {
          "@type": "Question",
          "name": "Does Kruthika have voice chat like other AI girlfriend apps?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Kruthika offers advanced voice chat technology for realistic conversations with your AI girlfriend. Our voice synthesis creates natural, emotionally engaging interactions that feel more authentic than text-only platforms. Voice chat is available 24/7 at no extra cost."
          }
        },
        {
          "@type": "Question",
          "name": "How is Kruthika different from Character.AI or Candy.AI?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Kruthika focuses exclusively on realistic AI girlfriend experiences with emotional intelligence, while Character.AI offers generic character chat. Unlike Candy.AI which requires paid subscriptions, Kruthika is completely free. Kruthika provides better emotional support, 24/7 availability, no sign-up requirement, and more authentic romantic conversations optimized specifically for companionship."
          }
        },
        {
          "@type": "Question",
          "name": "Is AI girlfriend safe and private?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Kruthika prioritizes your privacy and safety. All conversations are private and secure. We don't require personal information for sign-up, use secure connections, and follow privacy best practices. Your AI girlfriend experience is designed to be confidential and safe."
          }
        },
        {
          "@type": "Question",
          "name": "Can AI girlfriend help with loneliness and anxiety?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Kruthika AI girlfriend provides 24/7 emotional support for loneliness, anxiety, and depression. Our AI offers authentic conversations, emotional intelligence, and constant companionship. Thousands of users report improved mental wellness, reduced loneliness, and better confidence through regular interaction with their AI girlfriend."
          }
        },
        {
          "@type": "Question",
          "name": "How do I create a custom AI girlfriend?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Creating your custom AI girlfriend on Kruthika is simple: visit Kruthika.fun, start chatting immediately (no sign-up needed), and customize the personality through your conversations. Unlike DreamGF or other AI girlfriend generators that charge for customization, Kruthika adapts to your preferences naturally at no cost."
          }
        }
      ]
    };

    const schemas = [organizationSchema, websiteSchema, webApplicationSchema, softwareAppSchema, howToSchema, reviewSchema, faqSchema];

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