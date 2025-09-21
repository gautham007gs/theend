'use client';

import { useEffect } from 'react';
import { preloadCriticalResources, reserveAdSpace, optimizeTTI, markCriticalJSLoaded } from '@/lib/critical-performance';

export default function CriticalPerformanceInit() {
  useEffect(() => {
    // Initialize critical performance optimizations
    reserveAdSpace();
    
    const ttiOptimizer = optimizeTTI();
    
    // Defer non-critical operations
    ttiOptimizer.defer(() => {
      preloadCriticalResources();
      markCriticalJSLoaded();
    });
    
    // Targeted CLS prevention for images only
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[src*="placehold.co"]');
      images.forEach((img: Element) => {
        const htmlImg = img as HTMLImageElement;
        if (!htmlImg.width || !htmlImg.height) {
          htmlImg.width = 40;
          htmlImg.height = 40;
          htmlImg.style.width = '40px';
          htmlImg.style.height = '40px';
        }
      });
    };
    
    // Run after initial render
    requestIdleCallback(optimizeImages, { timeout: 100 });
    
    // Clean observer for new images only
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              const newImages = element.querySelectorAll('img[src*="placehold.co"]');
              if (newImages.length > 0) {
                requestIdleCallback(optimizeImages, { timeout: 50 });
              }
            }
          });
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // This component only runs side effects
}