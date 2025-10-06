// Consolidated performance optimization utilities
// Removes redundancy and improves tree-shaking

interface PerformanceMetrics {
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
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
    }
  }

  private initializeObservers() {
    // LCP Observer
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.metrics.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    } catch (e) {
      // Observer not supported
    }

    // CLS Observer
    let clsValue = 0;
    try {
      const clsObserver = new PerformanceObserver((entryList) => {
        entryList.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.cls = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'], buffered: true });
      this.observers.push(clsObserver);
    } catch (e) {
      // Observer not supported
    }
  }

  public cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Optimized task scheduler
export const scheduleTask = (task: () => void, priority: 'user-blocking' | 'user-visible' | 'background' = 'background') => {
  if ('scheduler' in window && (window as any).scheduler?.postTask) {
    return (window as any).scheduler.postTask(task, { priority });
  }

  const delay = priority === 'user-blocking' ? 0 : priority === 'user-visible' ? 5 : 50;
  return new Promise(resolve => setTimeout(() => resolve(task()), delay));
};

// Memory optimization utilities
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

// Auto-initialize
if (typeof window !== 'undefined') {
  const optimizer = PerformanceOptimizer.getInstance();
  window.addEventListener('beforeunload', () => optimizer.cleanup());
}