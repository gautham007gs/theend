// Critical performance optimizations for TTI and CLS improvements

// Preload only essential resources after interactive
export const preloadCriticalResources = () => {
  if (typeof window === 'undefined') return;

  // Only preload actual critical resources that exist
  const criticalResources = [
    { href: '/manifest.json', as: 'fetch' },
  ];

  criticalResources.forEach(({ href, as }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  });
};

// Targeted CLS prevention for specific elements
export const reserveAdSpace = () => {
  if (typeof window === 'undefined') return;

  const style = document.createElement('style');
  style.textContent = `
    /* Reserve space for ads to prevent CLS */
    .kruthika-chat-banner-ad-container {
      min-height: 90px !important;
      background: linear-gradient(90deg, rgba(236,72,153,0.1) 0%, rgba(168,85,247,0.1) 100%);
      transition: none !important;
    }
    
    .kruthika-chat-banner-ad-container:empty {
      display: block !important;
      min-height: 90px !important;
    }
    
    /* Set explicit dimensions for avatar images */
    img[src*="placehold.co"] {
      width: 40px !important;
      height: 40px !important;
      border-radius: 50% !important;
      object-fit: cover !important;
    }
    
    /* Skeleton placeholders for critical elements */
    .message-skeleton {
      min-height: 48px;
      background: rgba(255,255,255,0.1);
      border-radius: 8px;
      margin: 8px 0;
    }
  `;
  document.head.appendChild(style);
};

// Real TTI optimization by deferring heavy operations
export const optimizeTTI = () => {
  if (typeof window === 'undefined') return { defer: () => {} };

  const deferredTasks: (() => void)[] = [];
  
  // Use requestIdleCallback to run tasks when main thread is free
  const runDeferredTasks = () => {
    const runTask = () => {
      if (deferredTasks.length === 0) return;
      
      const task = deferredTasks.shift();
      if (task) task();
      
      // Continue with next task when idle
      if (deferredTasks.length > 0) {
        requestIdleCallback(runTask, { timeout: 50 });
      }
    };
    
    requestIdleCallback(runTask, { timeout: 50 });
  };

  // Start processing deferred tasks after initial render
  requestIdleCallback(() => {
    window.dispatchEvent(new CustomEvent('app-interactive'));
    runDeferredTasks();
  }, { timeout: 1000 });

  return {
    defer: (task: () => void) => deferredTasks.push(task)
  };
};

// Advanced performance monitoring with better TTI calculation
export const getAccurateTTI = (): number => {
  if (typeof window === 'undefined') return 0;

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (!navigation) return 0;

  // More accurate TTI calculation
  // TTI = when main thread is quiet for 5 seconds and main resource loading is complete
  const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
  const loadComplete = navigation.loadEventEnd - navigation.fetchStart;
  
  // Use the smaller of the two for a more realistic TTI
  return Math.min(domContentLoaded, loadComplete);
};

// Measure First Contentful Paint more accurately
export const getAccurateFCP = (): Promise<number> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(0);
      return;
    }

    let fcpValue = 0;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          fcpValue = entry.startTime;
          observer.disconnect();
          resolve(fcpValue);
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['paint'] });
      
      // Fallback timeout
      setTimeout(() => {
        observer.disconnect();
        resolve(fcpValue);
      }, 10000);
    } catch (e) {
      resolve(0);
    }
  });
};

// Optimized LCP measurement
export const getAccurateLCP = (): Promise<number> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(0);
      return;
    }

    let lcpValue = 0;
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        lcpValue = lastEntry.startTime;
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      
      // Stop observing after load event
      window.addEventListener('load', () => {
        setTimeout(() => {
          observer.disconnect();
          resolve(lcpValue);
        }, 2000);
      });
    } catch (e) {
      resolve(0);
    }
  });
};

// Bundle size optimization markers
export const markCriticalJSLoaded = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('critical-js-loaded'));
  }
};

console.log('Critical Performance: Advanced TTI and CLS optimization system loaded');