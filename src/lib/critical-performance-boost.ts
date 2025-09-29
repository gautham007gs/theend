
// Critical performance boosters for exceptional user experience

export class CriticalPerformanceBoost {
  // Preload critical resources before user interaction
  static preloadCriticalResources(): void {
    const criticalResources = [
      '/maya-chat',
      '/_next/static/chunks/pages/maya-chat.js',
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource;
      document.head.appendChild(link);
    });
  }

  // Optimize First Contentful Paint
  static optimizeFCP(): void {
    // Inline critical CSS for faster rendering
    const criticalCSS = `
      body { font-family: Inter, system-ui, sans-serif; }
      .chat-container { min-height: 100vh; }
      .loading-spinner { animation: spin 1s linear infinite; }
    `;
    
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.prepend(style);
  }

  // Reduce Cumulative Layout Shift
  static reduceCLS(): void {
    // Reserve space for dynamic content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const element = node as HTMLElement;
            
            // Add dimensions to images to prevent layout shift
            const images = element.querySelectorAll('img:not([width]):not([height])');
            images.forEach((img: HTMLImageElement) => {
              img.style.aspectRatio = '1 / 1';
              img.style.width = '100%';
              img.style.height = 'auto';
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Initialize all critical optimizations
  static initialize(): void {
    if (typeof window === 'undefined') return;

    this.preloadCriticalResources();
    this.optimizeFCP();
    this.reduceCLS();

    console.log('🚀 Critical performance boost activated');
  }
}

// Auto-initialize on load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      CriticalPerformanceBoost.initialize();
    });
  } else {
    CriticalPerformanceBoost.initialize();
  }
}
