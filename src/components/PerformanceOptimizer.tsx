'use client';

import { useEffect } from 'react';
import '@/lib/cls-optimizer';

export default function PerformanceOptimizer() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const optimizations = {
      preloadCriticalResources() {
        const critical = [
          { href: '/kruthika-avatar.svg', as: 'image', type: 'image/svg+xml', priority: 'high' },
          { href: 'https://placehold.co/100x100.png/E91E63/FFFFFF?text=K', as: 'image', priority: 'high' }
        ];

        critical.forEach(({ href, as, type, priority }) => {
          if (!document.querySelector(`link[href="${href}"]`)) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = href;
            link.as = as;
            if (type) link.type = type;
            if (priority) link.setAttribute('fetchpriority', priority);
            document.head.appendChild(link);
          }
        });
        
        // Force immediate decode of critical images
        const criticalImages = ['/kruthika-avatar.svg'];
        criticalImages.forEach(src => {
          const img = new Image();
          img.src = src;
          img.decoding = 'sync';
        });
      },

      optimizeImages() {
        // Prioritize LCP images
        const heroImages = document.querySelectorAll('img[data-hero], img[alt*="Kruthika"], header img, img[alt*="AI girlfriend"]');
        heroImages.forEach(img => {
          const image = img as HTMLImageElement;
          image.setAttribute('fetchpriority', 'high');
          image.loading = 'eager';
          image.decoding = 'sync';
          
          // Set explicit dimensions and aspect ratio to prevent CLS
          if (!image.width && image.naturalWidth) {
            image.width = image.naturalWidth;
            image.height = image.naturalHeight;
          }
          image.style.aspectRatio = '1/1';
          image.style.objectFit = 'cover';
        });

        // Lazy load non-critical images
        const lazyImages = document.querySelectorAll('img:not([data-hero]):not([alt*="Kruthika"]):not(header img)');
        lazyImages.forEach(img => {
          const image = img as HTMLImageElement;
          image.loading = 'lazy';
          image.setAttribute('fetchpriority', 'low');
          image.decoding = 'async';
          
          // Set explicit dimensions
          if (!image.width && image.naturalWidth) {
            image.width = image.naturalWidth;
            image.height = image.naturalHeight;
          }
        });
      },

      optimizeFonts() {
        if ('fonts' in document) {
          const font = new FontFace(
            'Inter',
            'url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2) format("woff2")',
            { weight: '400', style: 'normal', display: 'swap' }
          );
          font.load().then(loadedFont => (document as any).fonts.add(loadedFont));
        }
      },

      deferNonCriticalCSS() {
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
        stylesheets.forEach(link => {
          const stylesheet = link as HTMLLinkElement;
          stylesheet.media = 'print';
          stylesheet.onload = function() { stylesheet.media = 'all'; };
        });
      },

      addResourceHints() {
        const hints = [
          { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
          { rel: 'dns-prefetch', href: 'https://placehold.co' }
        ];

        hints.forEach(({ rel, href, crossOrigin }) => {
          if (!document.querySelector(`link[href="${href}"]`)) {
            const link = document.createElement('link');
            link.rel = rel;
            link.href = href;
            if (crossOrigin) link.crossOrigin = crossOrigin;
            document.head.appendChild(link);
          }
        });
      },

      optimizeMobile() {
        if (window.innerWidth <= 768) {
          document.documentElement.style.setProperty('--reduced-motion', 'reduce');
          
          const isSlow = (navigator as any).connection?.effectiveType === '2g' || 
                        (navigator as any).connection?.effectiveType === 'slow-2g';
          
          if (isSlow) {
            document.body.classList.add('reduced-performance');
          }
        }
      },

      monitorLCP() {
        if ('PerformanceObserver' in window) {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1] as any;
            const lcpTime = lastEntry.startTime;
            
            console.log(`🎯 LCP: ${lcpTime.toFixed(0)}ms ${lcpTime < 2500 ? '✅' : '⚠️'}`);
          });

          try {
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
          } catch (e) {
            console.warn('LCP monitoring not supported');
          }
        }
      }
    };

    optimizations.preloadCriticalResources();
    optimizations.addResourceHints();
    optimizations.optimizeFonts();
    optimizations.optimizeMobile();
    optimizations.monitorLCP();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        optimizations.optimizeImages();
        optimizations.deferNonCriticalCSS();
      });
    } else {
      optimizations.optimizeImages();
      optimizations.deferNonCriticalCSS();
    }

  }, []);

  return null;
}
