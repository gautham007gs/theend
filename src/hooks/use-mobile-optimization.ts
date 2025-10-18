
'use client';

import { useEffect, useRef } from 'react';

export function useMobileOptimization() {
  const cleanupRef = useRef<(() => void)[]>([]);
  const isPausedRef = useRef(false);

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return;

    const isLowEnd = (performance as any).memory?.jsHeapSizeLimit < 1073741824;

    // Listen for freeze prevention pause/resume
    const handlePause = () => {
      console.log('📱 Mobile Optimization: Paused');
      isPausedRef.current = true;
    };

    const handleResume = () => {
      console.log('📱 Mobile Optimization: Resumed');
      isPausedRef.current = false;
    };

    window.addEventListener('freeze-prevention-pause', handlePause);
    window.addEventListener('freeze-prevention-resume', handleResume);

    cleanupRef.current.push(() => {
      window.removeEventListener('freeze-prevention-pause', handlePause);
      window.removeEventListener('freeze-prevention-resume', handleResume);
    });

    // Use passive listeners for better scroll
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

    // Aggressive optimizations for low-end
    if (isLowEnd) {
      document.documentElement.style.setProperty('--animation-duration', '0s');
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.style.setProperty('--animation-duration', '0.1s');
    }
    
    document.documentElement.style.setProperty('touch-action', 'manipulation');
    document.documentElement.style.setProperty('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');
    document.documentElement.style.setProperty('overflow-scrolling', 'touch');
    document.documentElement.style.setProperty('-webkit-overflow-scrolling', 'touch');
    
    // GPU acceleration
    const chatContainer = document.querySelector('[data-chat-container]');
    if (chatContainer instanceof HTMLElement) {
      chatContainer.style.transform = 'translateZ(0)';
      chatContainer.style.willChange = 'transform';
    }

    // ENHANCED: Memory cleanup that respects pause state
    const memoryInterval = isLowEnd ? 15000 : 30000;
    const memoryCleanup = setInterval(() => {
      // Don't perform cleanup when paused
      if (isPausedRef.current) {
        console.log('📱 Mobile Optimization: Skipping cleanup (paused)');
        return;
      }

      if ('memory' in performance && (performance as any).memory) {
        const memory = (performance as any).memory;
        if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * (isLowEnd ? 0.7 : 0.9)) {
          console.log('📱 Mobile Optimization: High memory usage, cleaning up');
          // Clear old data
          const keys = ['messages_kruthika', 'chat_history'];
          keys.forEach(key => {
            try {
              const data = localStorage.getItem(key);
              if (data) {
                const parsed = JSON.parse(data);
                if (Array.isArray(parsed) && parsed.length > (isLowEnd ? 20 : 50)) {
                  localStorage.setItem(key, JSON.stringify(parsed.slice(-(isLowEnd ? 20 : 50))));
                }
              }
            } catch (e) {
              console.warn('Memory cleanup error:', e);
            }
          });
        }
      }
    }, memoryInterval);

    cleanupRef.current.push(() => clearInterval(memoryCleanup));

    // Optimize viewport
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

export function useMessageCleanup(messages: any[], maxMessages: number = 50) {
  useEffect(() => {
    const isLowEnd = (performance as any).memory?.jsHeapSizeLimit < 1073741824;
    const limit = isLowEnd ? 30 : maxMessages;
    
    if (messages.length > limit) {
      console.log(`Message count (${messages.length}) exceeds ${limit}, cleanup recommended`);
    }
  }, [messages.length, maxMessages]);
}
