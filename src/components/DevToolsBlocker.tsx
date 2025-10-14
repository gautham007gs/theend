
"use client";

import { useEffect, useState } from 'react';

export function DevToolsBlocker() {
  const [isUserActive, setIsUserActive] = useState(false);

  useEffect(() => {
    // Only activate DevTools detection after user interacts with page
    const activateDetection = () => {
      setIsUserActive(true);
    };

    // Wait for user interaction before activating
    const events = ['click', 'touchstart', 'keydown', 'scroll'];
    events.forEach(event => {
      document.addEventListener(event, activateDetection, { once: true });
    });

    // Prevent F12 and other shortcuts (always active for keyboard shortcuts)
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

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, activateDetection);
      });
      document.removeEventListener('keydown', preventDevTools);
    };
  }, []);

  useEffect(() => {
    if (!isUserActive) return; // Don't detect until user is active

    // More sophisticated DevTools detection
    const detectDevTools = () => {
      const threshold = 200; // Increased threshold to avoid false positives
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      // Only block if BOTH dimensions are significantly different (more reliable)
      if (widthThreshold && heightThreshold) {
        // DevTools likely open - show warning
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-size:24px;flex-direction:column;gap:20px;"><div>Developer tools are not allowed</div><div style="font-size:16px;color:#666;">Please close DevTools to continue</div></div>';
      }
    };

    // Check periodically, but only after user is active
    const interval = setInterval(detectDevTools, 2000); // Check every 2 seconds (less aggressive)

    return () => {
      clearInterval(interval);
    };
  }, [isUserActive]);

  return null;
}
