'use client';

import { useEffect } from 'react';

export default function PerformanceOptimizer() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Enhanced task scheduler with chunking for long tasks
    const scheduleTask = (task: () => void, priority: 'high' | 'low' = 'low') => {
      if (priority === 'high') {
        requestAnimationFrame(task);
      } else if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(task, { timeout: 2000 });
      } else {
        setTimeout(task, 1);
      }
    };

    // Break up long tasks into smaller chunks
    const executeInChunks = async <T,>(items: T[], processor: (item: T) => void, chunkSize = 10) => {
      for (let i = 0; i < items.length; i += chunkSize) {
        const chunk = items.slice(i, i + chunkSize);
        await new Promise<void>(resolve => {
          scheduleTask(() => {
            chunk.forEach(processor);
            resolve();
          }, 'low');
        });
      }
    };

    const optimizations = {
      preloadCriticalResources() {
        const critical = [
          { href: '/chat-bg.png', as: 'image', type: 'image/png', priority: 'high' },
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
      },

      optimizeImages() {
        // Critical images - load immediately
        const heroImages = document.querySelectorAll('img[data-hero], img[alt*="Kruthika"]');
        heroImages.forEach(img => {
          (img as HTMLImageElement).setAttribute('fetchpriority', 'high');
          (img as HTMLImageElement).loading = 'eager';
        });

        // Lazy load all non-critical images with Intersection Observer
        const lazyImages = Array.from(document.querySelectorAll('img:not([data-hero]):not([alt*="Kruthika"])'));
        
        if ('IntersectionObserver' in window) {
          const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const img = entry.target as HTMLImageElement;
                img.loading = 'lazy';
                img.setAttribute('fetchpriority', 'low');
                img.decoding = 'async';
                
                if (!img.width && img.naturalWidth) {
                  img.width = img.naturalWidth;
                  img.height = img.naturalHeight;
                }
                imageObserver.unobserve(img);
              }
            });
          }, { rootMargin: '50px' });

          // Process images in chunks to avoid blocking
          executeInChunks(lazyImages, (img) => imageObserver.observe(img as HTMLImageElement), 20);
        } else {
          // Fallback for older browsers
          lazyImages.forEach(img => {
            const image = img as HTMLImageElement;
            image.loading = 'lazy';
            image.setAttribute('fetchpriority', 'low');
            image.decoding = 'async';
          });
        }
      },

      // Lazy load emojis and avatars
      lazyLoadEmojis() {
        scheduleTask(() => {
          const emojiContainers = document.querySelectorAll('[data-emoji-container]');
          emojiContainers.forEach(container => {
            container.setAttribute('style', 'font-display: swap');
          });
        }, 'low');
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
          // Defer loading with print media trick
          stylesheet.media = 'print';
          stylesheet.onload = function() { 
            stylesheet.media = 'all'; 
            stylesheet.onload = null; // Cleanup
          };
          // Fallback for older browsers
          setTimeout(() => {
            if (stylesheet.media === 'print') {
              stylesheet.media = 'all';
            }
          }, 100);
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

    // Critical optimizations - run immediately (minimal main thread blocking)
    optimizations.preloadCriticalResources();
    optimizations.addResourceHints();
    
    // Defer ALL non-critical optimizations to reduce TBT
    scheduleTask(() => optimizations.optimizeFonts(), 'low');
    scheduleTask(() => optimizations.optimizeMobile(), 'low');
    scheduleTask(() => optimizations.monitorLCP(), 'low');
    scheduleTask(() => optimizations.lazyLoadEmojis(), 'low');

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        // Stagger tasks to avoid long blocking
        scheduleTask(() => optimizations.optimizeImages(), 'high');
        setTimeout(() => scheduleTask(() => optimizations.deferNonCriticalCSS(), 'low'), 100);
      });
    } else {
      scheduleTask(() => optimizations.optimizeImages(), 'high');
      setTimeout(() => scheduleTask(() => optimizations.deferNonCriticalCSS(), 'low'), 100);
    }

  }, []);

  return null;
}
