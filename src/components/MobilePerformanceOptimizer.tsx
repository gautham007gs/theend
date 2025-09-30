
'use client';

import { useEffect } from 'react';

export default function MobilePerformanceOptimizer() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Reduce animation complexity on mobile
      document.documentElement.style.setProperty('--animation-duration', '0.2s');
      
      // Optimize touch events
      document.addEventListener('touchstart', () => {}, { passive: true });
      document.addEventListener('touchmove', () => {}, { passive: true });
      
      // Reduce bundle size by conditionally loading features
      const reduceFeatures = () => {
        const heavyComponents = document.querySelectorAll('[data-heavy-component]');
        heavyComponents.forEach(component => {
          (component as HTMLElement).style.display = 'none';
        });
      };
      
      // Only reduce features on very slow connections
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          reduceFeatures();
        }
      }
    }
  }, []);

  return null;
}
