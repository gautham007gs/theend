
'use client';

import { useEffect } from 'react';

export default function MobileOptimizer() {
  useEffect(() => {
    // Mobile-specific optimizations
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Reduce animation complexity on mobile
      document.documentElement.style.setProperty('--animation-duration', '0.2s');
      
      // Optimize touch events
      document.addEventListener('touchstart', () => {}, { passive: true });
      document.addEventListener('touchmove', () => {}, { passive: true });
      
      // Reduce image quality on slower connections
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection && connection.effectiveType === '2g') {
          document.documentElement.classList.add('slow-connection');
        }
      }
      
      // Optimize memory usage
      const optimizeMemory = () => {
        // Clear old message history beyond 50 messages
        const messagesKey = 'messages_kruthika';
        const savedMessages = localStorage.getItem(messagesKey);
        if (savedMessages) {
          try {
            const messages = JSON.parse(savedMessages);
            if (messages.length > 50) {
              const recentMessages = messages.slice(-50);
              localStorage.setItem(messagesKey, JSON.stringify(recentMessages));
            }
          } catch (e) {
            console.warn('Memory optimization failed:', e);
          }
        }
      };
      
      // Run memory optimization every 5 minutes
      setInterval(optimizeMemory, 5 * 60 * 1000);
      
      console.log('🚀 Mobile optimizations activated');
    }
  }, []);

  return null;
}
