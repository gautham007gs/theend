
import React from 'react';

// Performance utilities for high traffic scenarios
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const lazy = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) => {
  return React.lazy(importFunc);
};

// Critical resource preloader
export const preloadCriticalResources = () => {
  if (typeof window === 'undefined') return;
  
  // Defer preloading to after initial render
  requestIdleCallback(() => {
    const criticalResources = [
      { href: '/chat-bg.png', as: 'image', type: 'image/png' },
      { href: '/og-image.png', as: 'image', type: 'image/png' },
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
  });
};

// Font optimization
export const optimizeFonts = () => {
  if (typeof window === 'undefined') return;
  
  // Preload critical fonts
  const fonts = [
    '/fonts/inter-var.woff2',
    '/fonts/inter-regular.woff2'
  ];
  
  fonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = font;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Viewport-based lazy loading
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }
  
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  });
};

// Performance timing utilities
export const measurePerformance = (name: string, fn: () => void | Promise<void>) => {
  if (typeof window === 'undefined') return fn();
  
  const startTime = performance.now();
  const result = fn();
  
  if (result instanceof Promise) {
    return result.finally(() => {
      const endTime = performance.now();
      console.log(`Performance [${name}]: ${endTime - startTime}ms`);
    });
  } else {
    const endTime = performance.now();
    console.log(`Performance [${name}]: ${endTime - startTime}ms`);
    return result;
  }
};

// Memory cleanup utilities
export const cleanupMemory = () => {
  if (typeof window === 'undefined') return;
  
  // Clear expired caches
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        if (name.includes('expired')) {
          caches.delete(name);
        }
      });
    }).catch(error => {
      console.warn('Error cleaning up caches:', error);
    });
  }
  
  // Trigger garbage collection if available
  if ('gc' in window && typeof (window as any).gc === 'function') {
    try {
      (window as any).gc();
    } catch (error) {
      console.warn('Error triggering garbage collection:', error);
    }
  }
};

// Memory-efficient event listeners
export const addPassiveEventListener = (
  element: Element | Window,
  event: string,
  handler: EventListener
) => {
  element.addEventListener(event, handler, { passive: true });
  return () => element.removeEventListener(event, handler);
};

// Batch DOM updates for performance
export const batchDOMUpdates = (updates: (() => void)[]) => {
  if (typeof window === 'undefined') return;
  
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
};

// Resource timing API wrapper
export const getResourceTiming = () => {
  if (typeof window === 'undefined') return [];
  
  return performance.getEntriesByType('resource').map(entry => ({
    name: entry.name,
    duration: entry.duration,
    size: (entry as any).transferSize || 0,
    cached: (entry as any).transferSize === 0
  }));
};

// Performance utilities loaded
