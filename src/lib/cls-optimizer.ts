
// CLS (Cumulative Layout Shift) Optimizer
// Prevents layout shifts by reserving space for dynamic content

export class CLSOptimizer {
  private static resizeObserver: ResizeObserver | null = null;

  static init() {
    if (typeof window === 'undefined') return;

    // Set explicit dimensions on images without them
    this.fixImageDimensions();

    // Reserve space for dynamic content
    this.reserveDynamicSpace();

    // Monitor and fix layout shifts
    this.monitorLayoutShifts();

    // Fix font loading shifts
    this.optimizeFontLoading();
  }

  private static fixImageDimensions() {
    const images = document.querySelectorAll('img:not([width]):not([height])');
    images.forEach(img => {
      const image = img as HTMLImageElement;
      
      // Use natural dimensions or computed size
      if (image.complete && image.naturalWidth) {
        image.width = image.naturalWidth;
        image.height = image.naturalHeight;
        image.style.aspectRatio = `${image.naturalWidth}/${image.naturalHeight}`;
      } else {
        // Reserve space based on parent or default
        const computed = window.getComputedStyle(image);
        const width = parseInt(computed.width) || 100;
        const height = parseInt(computed.height) || 100;
        
        image.style.aspectRatio = '1/1';
        image.style.width = `${width}px`;
        image.style.height = `${height}px`;
        
        image.onload = () => {
          if (image.naturalWidth && image.naturalHeight) {
            image.width = image.naturalWidth;
            image.height = image.naturalHeight;
            image.style.aspectRatio = `${image.naturalWidth}/${image.naturalHeight}`;
          }
        };
      }
    });
  }

  private static reserveDynamicSpace() {
    // Avatar placeholders with explicit dimensions
    const avatars = document.querySelectorAll('[class*="avatar"]:not([style*="width"])');
    avatars.forEach(avatar => {
      const el = avatar as HTMLElement;
      if (!el.style.width) {
        el.style.width = '48px';
        el.style.height = '48px';
        el.style.aspectRatio = '1/1';
        el.style.minWidth = '48px';
        el.style.minHeight = '48px';
      }
    });

    // Message bubbles with strict layout containment
    const messages = document.querySelectorAll('[class*="message-bubble"]');
    messages.forEach(msg => {
      const el = msg as HTMLElement;
      el.style.contain = 'layout style paint';
      el.style.willChange = 'auto';
    });

    // Reserve space for dynamic content containers
    const containers = document.querySelectorAll('[class*="grid"], [class*="flex-col"]');
    containers.forEach(container => {
      const el = container as HTMLElement;
      if (!el.style.minHeight) {
        el.style.minHeight = 'auto';
        el.style.contain = 'layout';
      }
    });
  }

  private static monitorLayoutShifts() {
    if ('PerformanceObserver' in window) {
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShift = entry as any;
            if (!layoutShift.hadRecentInput) {
              clsValue += layoutShift.value;
              
              // Log shifts over threshold
              if (layoutShift.value > 0.01) {
                console.warn('Layout shift detected:', {
                  value: layoutShift.value,
                  sources: layoutShift.sources,
                  total: clsValue
                });
                
                // Auto-fix if possible
                this.autoFixShift(layoutShift);
              }
            }
          }
        });

        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        console.warn('CLS monitoring not supported');
      }
    }
  }

  private static autoFixShift(layoutShift: any) {
    if (!layoutShift.sources) return;

    layoutShift.sources.forEach((source: any) => {
      const node = source.node as HTMLElement;
      if (node && node.tagName === 'IMG') {
        // Fix image without dimensions
        const img = node as HTMLImageElement;
        if (!img.width && img.naturalWidth) {
          img.width = img.naturalWidth;
          img.height = img.naturalHeight;
          img.style.aspectRatio = `${img.naturalWidth}/${img.naturalHeight}`;
        }
      }
    });
  }

  private static optimizeFontLoading() {
    // Use font-display: swap to prevent FOIT
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Inter Fallback';
        src: local('Arial'), local('Helvetica'), local('sans-serif');
        font-display: swap;
        ascent-override: 90%;
        descent-override: 22%;
        line-gap-override: 0%;
        size-adjust: 107%;
      }
    `;
    document.head.appendChild(style);
  }

  static cleanup() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }
}

// Auto-initialize on client
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CLSOptimizer.init());
  } else {
    CLSOptimizer.init();
  }
}
