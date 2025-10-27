
// Advanced SEO optimization utilities
export class SEOOptimizer {
  // Generate dynamic meta tags based on page content
  static generateDynamicMeta(pageType: string, content?: any) {
    const baseMeta = {
      home: {
        title: 'Kruthika - Best Free AI Girlfriend 2025 | No Sign Up Required',
        description: 'Meet Kruthika, the world\'s most realistic AI girlfriend. Free unlimited chat, voice chat, 24/7 emotional support. Better than Replika & Character.AI. Start now!',
        keywords: 'AI girlfriend free, best AI girlfriend 2025, AI girlfriend no sign up, realistic AI girlfriend, virtual girlfriend, AI companion'
      },
      chat: {
        title: 'Chat with Kruthika - Your AI Girlfriend | Free Unlimited Messages',
        description: 'Start chatting with Kruthika, your personal AI girlfriend. Free unlimited messages, voice chat, emotional support 24/7. No sign up required!',
        keywords: 'AI girlfriend chat, free AI chat, virtual girlfriend chat, AI companion chat, online AI girlfriend'
      },
      blog: {
        title: content?.title || 'AI Girlfriend Blog - Tips, Guides & Insights | Kruthika',
        description: content?.description || 'Explore the world of AI girlfriends with expert guides, tips, and insights. Learn about AI companionship, emotional support, and technology.',
        keywords: 'AI girlfriend blog, AI companion guide, virtual girlfriend tips, AI relationship advice'
      }
    };

    return baseMeta[pageType as keyof typeof baseMeta] || baseMeta.home;
  }

  // Optimize images for SEO
  static optimizeImageSEO(images: NodeListOf<HTMLImageElement>) {
    images.forEach(img => {
      // Add alt text if missing
      if (!img.alt) {
        const filename = img.src.split('/').pop()?.split('.')[0] || 'image';
        img.alt = filename.replace(/-/g, ' ');
      }

      // Add loading attribute
      if (!img.loading) {
        img.loading = 'lazy';
      }

      // Add width/height to prevent CLS
      if (!img.width || !img.height) {
        img.width = img.naturalWidth || 800;
        img.height = img.naturalHeight || 600;
      }
    });
  }

  // Generate breadcrumb JSON-LD
  static generateBreadcrumbs(path: string) {
    const segments = path.split('/').filter(Boolean);
    const breadcrumbs = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://kruthika.fun'
        }
      ]
    };

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      breadcrumbs.itemListElement.push({
        '@type': 'ListItem',
        position: index + 2,
        name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        item: `https://kruthika.fun${currentPath}`
      });
    });

    return breadcrumbs;
  }

  // Check and fix common SEO issues
  static auditPage() {
    const issues: string[] = [];

    // Check title length
    const title = document.title;
    if (title.length < 30 || title.length > 60) {
      issues.push(`Title length (${title.length}) should be 30-60 characters`);
    }

    // Check meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    const descContent = metaDesc?.getAttribute('content') || '';
    if (descContent.length < 120 || descContent.length > 160) {
      issues.push(`Meta description length (${descContent.length}) should be 120-160 characters`);
    }

    // Check for h1
    const h1Count = document.querySelectorAll('h1').length;
    if (h1Count === 0) {
      issues.push('Missing H1 tag');
    } else if (h1Count > 1) {
      issues.push(`Multiple H1 tags found (${h1Count})`);
    }

    // Check images
    const imagesWithoutAlt = document.querySelectorAll('img:not([alt])').length;
    if (imagesWithoutAlt > 0) {
      issues.push(`${imagesWithoutAlt} images missing alt text`);
    }

    // Check internal links
    const externalLinks = document.querySelectorAll('a[href^="http"]:not([rel*="noopener"])');
    if (externalLinks.length > 0) {
      issues.push(`${externalLinks.length} external links missing rel="noopener"`);
    }

    if (issues.length > 0) {
      console.warn('🔍 SEO Issues Found:', issues);
    } else {
      console.log('✅ No SEO issues detected');
    }

    return issues;
  }

  // Initialize SEO optimizations
  static initialize() {
    if (typeof window === 'undefined') return;

    // Optimize images
    const images = document.querySelectorAll('img');
    this.optimizeImageSEO(images);

    // Run audit after page load
    window.addEventListener('load', () => {
      setTimeout(() => this.auditPage(), 1000);
    });

    console.log('🔍 SEO Optimizer initialized');
  }
}

// Auto-initialize
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    SEOOptimizer.initialize();
  });
}
