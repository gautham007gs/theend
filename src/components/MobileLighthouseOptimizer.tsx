
'use client';

import { useEffect } from 'react';

export default function MobileLighthouseOptimizer() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Inline Critical CSS for faster First Paint
    const inlineCriticalCSS = () => {
      const criticalCSS = `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; }
        .chat-container { min-height: 100dvh; display: flex; flex-direction: column; }
        .loading { display: flex; align-items: center; justify-content: center; min-height: 100dvh; }
      `;
      
      const style = document.createElement('style');
      style.id = 'critical-css';
      style.textContent = criticalCSS;
      document.head.insertBefore(style, document.head.firstChild);
    };

    // 2. Defer Non-Critical Scripts
    const deferNonCriticalScripts = () => {
      const scripts = document.querySelectorAll('script[data-defer]');
      scripts.forEach(script => {
        if (script instanceof HTMLScriptElement) {
          script.defer = true;
          script.async = true;
        }
      });
    };

    // 3. Optimize Images with loading="lazy" and proper dimensions
    const optimizeImages = () => {
      const images = document.querySelectorAll('img:not([loading])');
      images.forEach(img => {
        if (img instanceof HTMLImageElement) {
          img.loading = 'lazy';
          img.decoding = 'async';
          
          // Add width/height to prevent layout shift
          if (!img.width && !img.height && img.naturalWidth) {
            img.width = img.naturalWidth;
            img.height = img.naturalHeight;
          }
        }
      });
    };

    // 4. Implement Resource Hints for faster loading
    const addResourceHints = () => {
      const hints = [
        { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
        { rel: 'preconnect', href: 'https://wubzdjzosbbbghdlfcgc.supabase.co' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossOrigin: 'anonymous' }
      ];

      hints.forEach(hint => {
        const existing = document.querySelector(`link[href="${hint.href}"]`);
        if (!existing) {
          const link = document.createElement('link');
          link.rel = hint.rel;
          link.href = hint.href;
          if (hint.crossOrigin) link.crossOrigin = hint.crossOrigin;
          document.head.appendChild(link);
        }
      });
    };

    // 5. Verify Service Worker for mobile caching
    const verifyServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('✅ Service Worker active for mobile caching');
        } catch (error) {
          console.warn('Service Worker registration failed:', error);
        }
      }
    };

    // 6. Measure and log Core Web Vitals
    const measureCoreWebVitals = () => {
      // LCP - Largest Contentful Paint
      let lcp = 0;
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        lcp = lastEntry.startTime;
        console.log(`📊 Mobile LCP: ${lcp.toFixed(0)}ms ${lcp < 2500 ? '✅' : '⚠️'}`);
      });
      try { lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] }); } catch (e) {}

      // FID - First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime;
          console.log(`📊 Mobile FID: ${fid.toFixed(0)}ms ${fid < 100 ? '✅' : '⚠️'}`);
        });
      });
      try { fidObserver.observe({ entryTypes: ['first-input'] }); } catch (e) {}

      // CLS - Cumulative Layout Shift
      let cls = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) cls += entry.value;
        });
        console.log(`📊 Mobile CLS: ${cls.toFixed(3)} ${cls < 0.1 ? '✅' : '⚠️'}`);
      });
      try { clsObserver.observe({ entryTypes: ['layout-shift'] }); } catch (e) {}
    };

    // 7. Mobile-specific optimizations
    const applyMobileOptimizations = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (!isMobile) return;

      // Optimize viewport
      let viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        document.head.appendChild(viewport);
      }
      viewport.content = 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes';

      // Reduce animations on slow connections
      if ('connection' in navigator) {
        const conn = (navigator as any).connection;
        if (conn && (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g')) {
          document.documentElement.style.setProperty('--animation-duration', '0.01s');
        }
      }

      // Enable passive event listeners
      document.addEventListener('touchstart', () => {}, { passive: true });
      document.addEventListener('touchmove', () => {}, { passive: true });
    };

    // Execute all optimizations
    inlineCriticalCSS();
    deferNonCriticalScripts();
    optimizeImages();
    addResourceHints();
    verifyServiceWorker();
    measureCoreWebVitals();
    applyMobileOptimizations();

    console.log('🚀 Mobile Lighthouse optimizations activated');

    // Monitor images added dynamically
    const imageObserver = new MutationObserver(() => {
      optimizeImages();
    });
    imageObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      imageObserver.disconnect();
    };
  }, []);

  return null;
}
