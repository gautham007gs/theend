
'use client';

import { useEffect } from 'react';
import { preloadImages, reserveSpace } from '@/lib/performance-utils';

export default function LayoutOptimizer() {
  useEffect(() => {
    // Preload critical images to prevent layout shifts
    const criticalImages = [
      'https://placehold.co/100x100.png/E91E63/FFFFFF?text=K',
      '/chat-bg.png',
      '/og-image.png'
    ];

    preloadImages(criticalImages).catch(console.warn);

    // Reserve space for dynamic content areas
    const chatContainer = document.querySelector('[data-chat-container]');
    if (chatContainer) {
      reserveSpace(chatContainer as HTMLElement, 100, 400);
    }

    // Optimize font loading to prevent FOIT/FOUT
    const optimizeFonts = () => {
      document.fonts.ready.then(() => {
        document.body.classList.add('fonts-loaded');
      });
    };

    optimizeFonts();

    // Prevent layout shift from ads and dynamic content
    const adElements = document.querySelectorAll('[data-ad-placeholder]');
    adElements.forEach(el => {
      reserveSpace(el as HTMLElement, 320, 250);
    });

  }, []);

  return null;
}
