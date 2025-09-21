
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

// Memory-efficient event listeners
export const addPassiveEventListener = (
  element: Element | Window,
  event: string,
  handler: EventListener
) => {
  element.addEventListener(event, handler, { passive: true });
  return () => element.removeEventListener(event, handler);
};

// Layout shift prevention utilities
export const preloadImages = (imageUrls: string[]) => {
  return Promise.all(
    imageUrls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    })
  );
};

export const reserveSpace = (element: HTMLElement, width: number, height: number) => {
  element.style.minWidth = `${width}px`;
  element.style.minHeight = `${height}px`;
};

// FPS optimization utilities
export const requestIdleCallback = (callback: () => void, timeout = 5000) => {
  if ('requestIdleCallback' in window) {
    return (window as any).requestIdleCallback(callback, { timeout });
  }
  return setTimeout(callback, 16);
};

export const batchDOMUpdates = (updates: (() => void)[]) => {
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
};

// Performance-optimized intersection observer
export const createOptimizedObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) => {
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: [0, 0.25, 0.5, 0.75, 1],
    ...options
  });
};
