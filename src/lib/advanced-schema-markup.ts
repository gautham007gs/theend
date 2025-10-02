
// Advanced schema markup for voice search and better SERP features

export class AdvancedSchemaMarkup {
  // Speakable schema for voice search optimization
  static generateSpeakableSchema(contentSelectors: string[]): object {
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": contentSelectors
      }
    };
  }

  // ItemList schema for blog navigation and better structure
  static generateBlogListSchema(blogPosts: Array<{title: string, url: string, position: number}>): object {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": blogPosts.map(post => ({
        "@type": "ListItem",
        "position": post.position,
        "name": post.title,
        "url": post.url
      }))
    };
  }

  // Enhanced BreadcrumbList for better site structure
  static generateBreadcrumbSchema(items: Array<{name: string, url: string}>): object {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    };
  }

  // HowTo schema for step-by-step guides
  static generateHowToSchema(name: string, description: string, steps: Array<{name: string, text: string}>): object {
    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": name,
      "description": description,
      "step": steps.map((step, index) => ({
        "@type": "HowToStep",
        "position": index + 1,
        "name": step.name,
        "text": step.text
      }))
    };
  }

  // Product schema for AI girlfriend service
  static generateProductSchema(): object {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Kruthika AI Girlfriend - Free Virtual Companion",
      "description": "World's most realistic AI girlfriend with emotional intelligence and 24/7 availability",
      "brand": {
        "@type": "Brand",
        "name": "Kruthika.fun"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "priceValidUntil": "2026-12-31"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "15420",
        "bestRating": "5",
        "worstRating": "1"
      }
    };
  }

  // Initialize all advanced schemas
  static initializeAdvancedSchemas(): void {
    if (typeof window === 'undefined') return;

    // Add Speakable schema for main content
    const speakableSchema = this.generateSpeakableSchema([
      ".blog-post-content h1",
      ".blog-post-content h2",
      ".blog-post-content p"
    ]);

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(speakableSchema);
    document.head.appendChild(script);

    console.log('🎙️ Advanced schema markup initialized for voice search');
  }
}

// Auto-initialize
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    AdvancedSchemaMarkup.initializeAdvancedSchemas();
  });
}
