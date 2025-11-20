'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const registerSW = async () => {
        try {
          // Unregister any existing workers first to ensure clean state
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map(reg => reg.unregister()));
          
          // Small delay to ensure clean slate
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Register with specific configuration
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            updateViaCache: 'none'
          });
          
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Service Worker registered:', registration.scope);
          }
          
          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  if (process.env.NODE_ENV === 'development') {
                    console.log('🔄 New Service Worker available');
                  }
                  // Optionally show update notification to user
                  if (confirm('New version available! Reload to update?')) {
                    window.location.reload();
                  }
                }
              });
            }
          });
          
          // Ensure activation
          await registration.update();
          
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Service Worker registration failed:', error);
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
        window.removeEventListener('load', registerSW);
      };
    }
  }, []);

  return null;
}