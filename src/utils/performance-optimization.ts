// Advanced performance optimization utilities for better Core Web Vitals

interface PerformanceMetrics {
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  tti: number;
}

export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private observers: PerformanceObserver[] = [];
  private metrics: Partial<PerformanceMetrics> = {};

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
      this.optimizePageLoad();
    }
  }

  private initializeObservers() {
    // Largest Contentful Paint Observer
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.metrics.lcp = lastEntry.startTime;

        if (lastEntry.startTime > 2500) {
          this.optimizeLCP();
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    } catch (e) {
      console.warn('LCP observer not supported');
    }

    // First Input Delay Observer
    try {
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime;

          if (this.metrics.fid > 100) {
            this.optimizeFID();
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    } catch (e) {
      console.warn('FID observer not supported');
    }

    // Cumulative Layout Shift Observer
    let clsValue = 0;
    try {
      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.cls = clsValue;

        if (clsValue > 0.1) {
          this.optimizeCLS();
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch (e) {
      console.warn('CLS observer not supported');
    }
  }

  private optimizePageLoad() {
    // Preload critical resources
    this.preloadCriticalResources();

    // Optimize images
    this.setupLazyLoading();

    // Reduce main thread blocking
    this.scheduleNonCriticalTasks();

    // Optimize fonts
    this.optimizeFontLoading();

    // Setup resource hints
    this.addResourceHints();
  }

  private preloadCriticalResources() {
    const criticalResources = [
      { href: '/chat-bg.png', as: 'image', type: 'image/png' },
      { href: '/_next/static/chunks/webpack.js', as: 'script' },
      { href: '/_next/static/chunks/pages/_app.js', as: 'script' }
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) link.type = resource.type;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  private setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              imageObserver.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      // Apply to existing images
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });

      // Watch for new images
      const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
              const element = node as Element;
              const lazyImages = element.querySelectorAll('img[data-src]');
              lazyImages.forEach(img => imageObserver.observe(img));
            }
          });
        });
      });

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  private scheduleNonCriticalTasks() {
    // Use scheduler API if available, otherwise use setTimeout
    const scheduler = (window as any).scheduler;

    const scheduleTask = (task: () => void, priority: 'user-blocking' | 'user-visible' | 'background' = 'background') => {
      if (scheduler && scheduler.postTask) {
        scheduler.postTask(task, { priority });
      } else {
        // Fallback to setTimeout with appropriate delays
        const delay = priority === 'user-blocking' ? 0 : priority === 'user-visible' ? 5 : 50;
        setTimeout(task, delay);
      }
    };

    // Schedule analytics and non-critical features
    scheduleTask(() => {
      // Initialize analytics
      console.log('Non-critical analytics initialized');
    }, 'background');

    scheduleTask(() => {
      // Initialize service worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(console.warn);
      }
    }, 'background');
  }

  private optimizeFontLoading() {
    // Use font-display: swap for better performance
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2') format('woff2');
      }
    `;
    document.head.appendChild(style);
  }

  private addResourceHints() {
    const hints = [
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
      { rel: 'preconnect', href: 'https://placehold.co' },
      { rel: 'prefetch', href: '/maya-chat' }
    ];

    hints.forEach(hint => {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      document.head.appendChild(link);
    });
  }

  private optimizeLCP() {
    // Additional LCP optimizations
    this.preloadCriticalResources();
  }

  private optimizeFID() {
    // Break up long tasks
    this.scheduleNonCriticalTasks();
  }

  private optimizeCLS() {
    // Add size attributes to images and reserve space for dynamic content
    document.querySelectorAll('img:not([width]):not([height])').forEach(img => {
      const htmlImg = img as HTMLImageElement;
      if (htmlImg.naturalWidth && htmlImg.naturalHeight) {
        htmlImg.width = htmlImg.naturalWidth;
        htmlImg.height = htmlImg.naturalHeight;
      }
    });
  }

  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  public cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Image optimization utilities
export class ImageOptimizer {
  static optimizeImage(src: string, width?: number, height?: number): string {
    // Use Next.js Image optimization or implement custom logic
    if (src.includes('placehold.co')) {
      return src;
    }

    // Add width/height parameters for better performance
    if (width && height) {
      const url = new URL(src, window.location.origin);
      url.searchParams.set('w', width.toString());
      url.searchParams.set('h', height.toString());
      url.searchParams.set('q', '75'); // Good quality/size balance
      return url.toString();
    }

    return src;
  }

  static createLazyImage(src: string, alt: string, className?: string): HTMLImageElement {
    const img = document.createElement('img');
    img.dataset.src = src;
    img.alt = alt;
    img.className = `lazy ${className || ''}`;
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s';

    img.onload = () => {
      img.style.opacity = '1';
    };

    return img;
  }
}

// Bundle splitting and code optimization
export class CodeOptimizer {
  static async loadComponentLazily<T>(
    importFn: () => Promise<{ default: T }>
  ): Promise<T> {
    const module = await importFn();
    return module.default;
  }

  static preloadRoute(route: string) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);
  }

  static async executeWithScheduler(task: () => void | Promise<void>, priority: 'user-blocking' | 'user-visible' | 'background' = 'background') {
    if ('scheduler' in window && (window as any).scheduler.postTask) {
      return (window as any).scheduler.postTask(task, { priority });
    } else {
      // Fallback to requestIdleCallback or setTimeout
      if ('requestIdleCallback' in window && priority === 'background') {
        return new Promise(resolve => {
          (window as any).requestIdleCallback(() => {
            const result = task();
            resolve(result);
          });
        });
      } else {
        const delay = priority === 'user-blocking' ? 0 : priority === 'user-visible' ? 5 : 50;
        return new Promise(resolve => {
          setTimeout(() => {
            const result = task();
            resolve(result);
          }, delay);
        });
      }
    }
  }
}

// Memory optimization
export class MemoryOptimizer {
  private static cleanupTasks: (() => void)[] = [];

  static addCleanupTask(task: () => void) {
    this.cleanupTasks.push(task);
  }

  static cleanup() {
    this.cleanupTasks.forEach(task => {
      try {
        task();
      } catch (error) {
        console.warn('Cleanup task failed:', error);
      }
    });
    this.cleanupTasks = [];
  }

  static optimizeEventListeners() {
    // Use passive event listeners where possible
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      if (typeof options === 'object' && options.passive === undefined) {
        if (['scroll', 'wheel', 'touchstart', 'touchmove'].includes(type)) {
          options.passive = true;
        }
      }
      return originalAddEventListener.call(this, type, listener, options);
    };
  }

  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// Initialize performance optimizations
if (typeof window !== 'undefined') {
  // Initialize performance optimizer
  const performanceOptimizer = PerformanceOptimizer.getInstance();

  // Optimize memory usage
  MemoryOptimizer.optimizeEventListeners();

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    performanceOptimizer.cleanup();
    MemoryOptimizer.cleanup();
  });

  console.log('🚀 Advanced performance optimizations loaded');
}

export { PerformanceOptimizer, ImageOptimizer, CodeOptimizer, MemoryOptimizer };