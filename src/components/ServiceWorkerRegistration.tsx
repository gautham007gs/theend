'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Defer SW registration to reduce TBT
      window.addEventListener('load', () => {
        setTimeout(() => {
          navigator.serviceWorker.register('/sw.js')
            .then(registration => {
              console.log('✅ Service Worker active for mobile caching');
            })
            .catch(err => {
              console.error('Service worker registration failed:', err);
            });
        }, 2000);
      });
    }
  }, []);

  return null;
}