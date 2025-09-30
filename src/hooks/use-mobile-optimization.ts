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

    // Enhanced mobile optimizations
    document.documentElement.style.setProperty('--animation-duration', '0.1s');
    document.documentElement.style.setProperty('touch-action', 'manipulation');
    document.documentElement.style.setProperty('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');
    
    // Optimize scrolling performance
    document.documentElement.style.setProperty('overflow-scrolling', 'touch');
    document.documentElement.style.setProperty('-webkit-overflow-scrolling', 'touch');
    
    // Enable GPU acceleration for smooth animations
    const chatContainer = document.querySelector('[data-chat-container]');
    if (chatContainer instanceof HTMLElement) {
      chatContainer.style.transform = 'translateZ(0)';
      chatContainer.style.willChange = 'transform';
    }

    // Optimize memory usage
    const memoryCleanup = setInterval(() => {
      if ('memory' in performance && (performance as any).memory) {
        const memory = (performance as any).memory;
        if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
          console.warn('Memory usage high, consider clearing chat history');
        }
      }
    }, 30000);

    cleanupRef.current.push(() => clearInterval(memoryCleanup));

    // Add viewport meta optimization for better mobile rendering
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover');
    }

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
