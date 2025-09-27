// Performance monitoring and optimization utilities

export interface PerformanceMetrics {
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  firstInputDelay?: number;
  cumulativeLayoutShift?: number;
  timeToFirstByte?: number;
}

/**
 * Measures Core Web Vitals and other performance metrics
 */
export function measurePerformance(): PerformanceMetrics {
  const metrics: PerformanceMetrics = {};

  if (typeof window !== 'undefined' && 'performance' in window) {
    // Measure FCP (First Contentful Paint)
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
    if (fcpEntry) {
      metrics.firstContentfulPaint = fcpEntry.startTime;
    }

    // Measure LCP (Largest Contentful Paint) 
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      metrics.largestContentfulPaint = lastEntry.startTime;
    });
    
    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP measurement not supported');
    }

    // Measure TTFB (Time to First Byte)
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      metrics.timeToFirstByte = navigationEntry.responseStart - navigationEntry.requestStart;
    }

    // FID and CLS are measured via other methods in production
    // This is a simplified version for development monitoring
  }

  return metrics;
}

/**
 * Reports performance metrics to console in development
 */
export function reportPerformance(metrics: PerformanceMetrics) {
  if (process.env.NODE_ENV === 'development') {
    console.group('🚀 Performance Metrics');
    if (metrics.firstContentfulPaint) {
      console.log(`FCP: ${metrics.firstContentfulPaint.toFixed(2)}ms`);
    }
    if (metrics.largestContentfulPaint) {
      console.log(`LCP: ${metrics.largestContentfulPaint.toFixed(2)}ms`);
    }
    if (metrics.timeToFirstByte) {
      console.log(`TTFB: ${metrics.timeToFirstByte.toFixed(2)}ms`);
    }
    console.groupEnd();
  }
}

/**
 * Lazy load components for better performance
 */
export function createLazyComponent<T extends any>(
  importFn: () => Promise<{ default: T }>
) {
  if (typeof window === 'undefined') return null;
  
  return importFn;
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string = 'script') {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  }
}

/**
 * Optimize image loading with intersection observer
 */
export function createImageOptimizer() {
  if (typeof window === 'undefined') return null;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01
  });

  return observer;
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

/**
 * Throttle function for scroll events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Cache with TTL for API responses
 */
export class PerformanceCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number = 5 * 60 * 1000) { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > item.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

export const performanceCache = new PerformanceCache();