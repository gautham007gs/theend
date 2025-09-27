// Resource optimization utilities for better Core Web Vitals

/**
 * Prefetch critical resources
 */
export function prefetchCriticalResources() {
  if (typeof document === 'undefined') return;

  const criticalResources = [
    { href: '/api/test-vertex', as: 'fetch' },
    { href: '/maya-chat', as: 'document' },
    { href: '/blog', as: 'document' }
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = resource.href;
    if (resource.as) {
      link.as = resource.as;
    }
    document.head.appendChild(link);
  });
}

/**
 * Lazy load images with intersection observer
 */
export function initLazyImageLoading() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

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

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

/**
 * Optimize third-party script loading
 */
export function optimizeThirdPartyScripts() {
  if (typeof window === 'undefined') return;

  // Defer non-critical scripts
  const scripts = document.querySelectorAll('script[data-defer]');
  scripts.forEach(script => {
    const newScript = document.createElement('script');
    newScript.src = script.getAttribute('src') || '';
    newScript.defer = true;
    newScript.async = true;
    document.head.appendChild(newScript);
  });
}

/**
 * Reduce unused CSS
 */
export function removeUnusedCSS() {
  if (typeof document === 'undefined') return;

  // This is a simplified version - in production you'd use tools like PurgeCSS
  const unusedSelectors = [
    '.unused-class',
    '.debug-only'
  ];

  unusedSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.remove();
    });
  });
}

/**
 * Optimize critical rendering path
 */
export function optimizeCriticalRenderingPath() {
  if (typeof document === 'undefined') return;

  // Inline critical CSS
  const criticalCSS = `
    body { margin: 0; font-family: Inter, sans-serif; }
    .loading { display: flex; align-items: center; justify-content: center; }
  `;

  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.insertBefore(style, document.head.firstChild);
}

/**
 * Implement resource hints for better performance
 */
export function addResourceHints() {
  if (typeof document === 'undefined') return;

  const hints = [
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossOrigin: 'anonymous' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
  ];

  hints.forEach(hint => {
    const link = document.createElement('link');
    link.rel = hint.rel;
    link.href = hint.href;
    if (hint.crossOrigin) {
      link.crossOrigin = hint.crossOrigin;
    }
    document.head.appendChild(link);
  });
}

/**
 * Monitor and report Core Web Vitals
 */
export function measureCoreWebVitals() {
  if (typeof window === 'undefined') return;

  // Measure Largest Contentful Paint (LCP)
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1] as PerformanceEntry;
    
    console.log('LCP:', lastEntry.startTime);
    
    // Report to analytics in production
    if (process.env.NODE_ENV === 'production') {
      // Analytics reporting would go here
    }
  });

  try {
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    console.warn('LCP measurement not supported');
  }

  // Measure First Input Delay (FID)
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach(entry => {
      const fidEntry = entry as any; // PerformanceEventTiming
      if (fidEntry.processingStart) {
        const fid = fidEntry.processingStart - fidEntry.startTime;
        console.log('FID:', fid);
      }
    });
  });

  try {
    fidObserver.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    console.warn('FID measurement not supported');
  }

  // Measure Cumulative Layout Shift (CLS)
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        console.log('CLS:', clsValue);
      }
    });
  });

  try {
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    console.warn('CLS measurement not supported');
  }
}