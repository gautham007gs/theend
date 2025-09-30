
'use client';

import { useEffect } from 'react';

export default function MobileChatOptimizer() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Optimize viewport for mobile chat
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');
      }

      // Add mobile-specific CSS optimizations
      const style = document.createElement('style');
      style.textContent = `
        /* Optimize mobile chat experience */
        .chat-container {
          min-height: 100dvh; /* Use dynamic viewport height */
          overscroll-behavior: none;
        }
        
        /* Better touch targets */
        button, [role="button"] {
          min-height: 44px;
          min-width: 44px;
        }
        
        /* Optimize input area */
        .chat-input-area {
          padding-bottom: env(safe-area-inset-bottom);
        }
        
        /* Reduce motion on mobile for performance */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `;
      document.head.appendChild(style);

      // Optimize keyboard handling
      let initialViewportHeight = window.innerHeight;
      
      const handleResize = () => {
        const currentHeight = window.innerHeight;
        const keyboardHeight = initialViewportHeight - currentHeight;
        
        if (keyboardHeight > 150) { // Keyboard is open
          document.documentElement.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
          document.body.classList.add('keyboard-open');
        } else {
          document.documentElement.style.removeProperty('--keyboard-height');
          document.body.classList.remove('keyboard-open');
        }
      };

      window.addEventListener('resize', handleResize, { passive: true });
      
      return () => {
        window.removeEventListener('resize', handleResize);
        document.head.removeChild(style);
      };
    }
  }, []);

  return null;
}
