
'use client';

import { useEffect } from 'react';

export default function LCPOptimizer() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Aggressive image preloading
    const preloadCriticalImages = () => {
      const criticalImages = [
        '/chat-bg.png',
        'https://placehold.co/100x100.png/E91E63/FFFFFF?text=K'
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        link.setAttribute('fetchpriority', 'high');
        document.head.appendChild(link);
      });
    };

    // 2. Priority hints for LCP elements
    const optimizeLCPElements = () => {
      // Mark hero images as high priority
      const heroImages = document.querySelectorAll('img[data-hero], img[alt*="Kruthika"]');
      heroImages.forEach(img => {
        (img as HTMLImageElement).setAttribute('fetchpriority', 'high');
        (img as HTMLImageElement).loading = 'eager';
      });

      // Lazy load below-the-fold images
      const belowFoldImages = document.querySelectorAll('img:not([data-hero]):not([alt*="Kruthika"])');
      belowFoldImages.forEach(img => {
        (img as HTMLImageElement).loading = 'lazy';
        (img as HTMLImageElement).setAttribute('fetchpriority', 'low');
      });
    };

    // 3. Reduce render-blocking resources
    const deferNonCriticalCSS = () => {
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
      stylesheets.forEach(link => {
        (link as HTMLLinkElement).media = 'print';
        (link as HTMLLinkElement).onload = function() {
          (this as HTMLLinkElement).media = 'all';
        };
      });
    };

    // 4. Optimize Web Font loading
    const optimizeFontLoading = () => {
      if ('fonts' in document) {
        // Preload Inter font
        const font = new FontFace(
          'Inter',
          'url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2) format("woff2")',
          { weight: '400', style: 'normal', display: 'swap' }
        );
        
        font.load().then(loadedFont => {
          (document as any).fonts.add(loadedFont);
        });
      }
    };

    // 5. Early resource hints
    const addEarlyHints = () => {
      const hints = [
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
        { rel: 'dns-prefetch', href: 'https://placehold.co' }
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

    // Execute optimizations
    preloadCriticalImages();
    addEarlyHints();
    optimizeFontLoading();
    
    // Wait for DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        optimizeLCPElements();
        deferNonCriticalCSS();
      });
    } else {
      optimizeLCPElements();
      deferNonCriticalCSS();
    }

    // Monitor LCP
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        const lcpTime = lastEntry.startTime;
        
        console.log(`🎯 LCP: ${lcpTime.toFixed(0)}ms ${lcpTime < 2500 ? '✅' : '⚠️ Target: <2500ms'}`);
        
        // Auto-optimize if LCP is slow
        if (lcpTime > 2500) {
          console.warn('⚠️ LCP is slow, applying emergency optimizations...');
          preloadCriticalImages();
        }
      });

      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP monitoring not supported');
      }
    }

  }, []);

  return null;
}
