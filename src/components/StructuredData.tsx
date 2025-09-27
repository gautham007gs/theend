'use client';

import { useEffect } from 'react';

export default function StructuredData() {
  useEffect(() => {
    // Only add structured data on client side to prevent hydration mismatch
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

    // Check if script already exists
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }, []);

  return null; // This component doesn't render anything
}