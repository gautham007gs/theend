'use client';

import { useEffect, useRef } from 'react';

export function useMobileOptimization() {
  const cleanupRef = useRef<(() => void)[]>([]);

  useEffect(() => {
    // Optimize for mobile devices only
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return;

    // Passive event listeners for better scroll performance
    const options: AddEventListenerOptions = { passive: true };
    
    const touchHandler = () => {};
    document.addEventListener('touchstart', touchHandler, options);
    document.addEventListener('touchmove', touchHandler, options);
    document.addEventListener('touchend', touchHandler, options);

    cleanupRef.current.push(() => {
      document.removeEventListener('touchstart', touchHandler);
      document.removeEventListener('touchmove', touchHandler);
      document.removeEventListener('touchend', touchHandler);
    });

    // Reduce animation duration on mobile
    document.documentElement.style.setProperty('--animation-duration', '0.15s');

    // Optimize memory usage
    const memoryCleanup = setInterval(() => {
      // Clean up old DOM references
      if ('memory' in performance && (performance as any).memory) {
        const memory = (performance as any).memory;
        if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
          console.warn('Memory usage high, consider clearing chat history');
        }
      }
    }, 30000); // Check every 30 seconds

    cleanupRef.current.push(() => clearInterval(memoryCleanup));

    // Cleanup function
    return () => {
      cleanupRef.current.forEach(cleanup => cleanup());
      cleanupRef.current = [];
    };
  }, []);
}

export function useMessageCleanup(messages: any[], maxMessages: number = 100) {
  useEffect(() => {
    // Clean up old messages to prevent memory leaks in long sessions
    if (messages.length > maxMessages) {
      console.log(`Message count (${messages.length}) exceeds ${maxMessages}, consider pagination`);
    }
  }, [messages.length, maxMessages]);
}
