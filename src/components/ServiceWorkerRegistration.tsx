'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    let retryCount = 0;
    const maxRetries = 3;

    const registerSW = async () => {
      try {
        // Unregister any existing workers first
        const existingRegistrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(existingRegistrations.map(reg => reg.unregister()));

        // Small delay to ensure clean state
        await new Promise(resolve => setTimeout(resolve, 100));

        // Register new service worker
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
                console.log('🔄 New Service Worker available - reload to update');
              }
            });
          }
        });

        // Periodic update checks (every 30 minutes)
        setInterval(() => {
          registration.update().catch(() => {});
        }, 30 * 60 * 1000);

      } catch (error) {
        retryCount++;
        console.warn(`SW registration attempt ${retryCount} failed:`, error instanceof Error ? error.message : 'Unknown');
        
        // Retry with exponential backoff
        if (retryCount < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
          setTimeout(registerSW, delay);
        }
      }
    };

    // Register after page fully loads
    if (document.readyState === 'complete') {
      registerSW();
    } else {
      window.addEventListener('load', registerSW, { once: true });
    }

    // Cleanup
    return () => {
      // No cleanup needed
    };
  }, []);

  return null;
}