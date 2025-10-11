
"use client";

import { useEffect } from 'react';

export function DevToolsBlocker() {
  useEffect(() => {
    // Detect if DevTools is open
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        // DevTools likely open - redirect or show warning
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-size:24px;">Developer tools are not allowed</div>';
      }
    };

    // Check periodically
    const interval = setInterval(detectDevTools, 1000);

    // Prevent F12 and other shortcuts
    const preventDevTools = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('keydown', preventDevTools);

    // Detect right-click inspect
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });

    return () => {
      clearInterval(interval);
      document.removeEventListener('keydown', preventDevTools);
    };
  }, []);

  return null;
}
