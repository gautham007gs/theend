
'use client';

import { useEffect, useState } from 'react';

export default function LazyAnimations() {
  const [shouldLoadAnimations, setShouldLoadAnimations] = useState(false);

  useEffect(() => {
    // Defer animation loading until idle
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        setShouldLoadAnimations(true);
      }, { timeout: 3000 });
    } else {
      setTimeout(() => setShouldLoadAnimations(true), 2000);
    }
  }, []);

  useEffect(() => {
    if (!shouldLoadAnimations) return;

    // Lazy load animation-heavy styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideIn {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .animate-fade-in {
        animation: fadeIn 0.3s ease-in-out;
      }
      .animate-slide-in {
        animation: slideIn 0.4s ease-out;
      }
    `;
    document.head.appendChild(style);

    // Clean up
    return () => {
      document.head.removeChild(style);
    };
  }, [shouldLoadAnimations]);

  return null;
}
