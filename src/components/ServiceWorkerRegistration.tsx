'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const registerSW = async () => {
        try {
          // Register service worker
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            updateViaCache: 'none'
          });
          
          console.log('✅ Service Worker registered successfully');
          
          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('🔄 New Service Worker available');
                }
              });
            }
          });
          
          // Check for updates
          registration.update().catch(() => {
            // Silently fail update check
          });
          
        } catch (error) {
          console.log('SW registration failed:', error instanceof Error ? error.message : 'Unknown error');
        }
      };
      
      // Register after page fully loads
      if (document.readyState === 'complete') {
        registerSW();
      } else {
        window.addEventListener('load', registerSW, { once: true });
      }
    }
  }, []);

  return null;
}