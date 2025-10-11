
"use client";

import { useEffect } from 'react';

export function ScreenshotProtection() {
  useEffect(() => {
    // Multi-layer protection against screenshots and content theft
    
    // Layer 1: Visual obscuring for screenshot attempts
    const obscureContent = () => {
      const overlay = document.createElement('div');
      overlay.id = 'screenshot-blocker';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        z-index: 999999;
        pointer-events: none;
      `;
      document.body.appendChild(overlay);
      
      setTimeout(() => {
        const existingOverlay = document.getElementById('screenshot-blocker');
        if (existingOverlay) {
          existingOverlay.remove();
        }
      }, 100);
    };

    // Layer 2: Body-level event protection
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const handleCopy = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const handleCut = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const handlePaste = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const handleDragStart = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const handleDrop = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Layer 3: Keyboard shortcuts blocking
    const handleKeydown = (e: KeyboardEvent) => {
      // Screenshot shortcuts (all platforms)
      if (
        e.key === 'PrintScreen' ||
        e.key === 'Print' ||
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) || // macOS
        (e.ctrlKey && e.key === 'PrintScreen') || // Windows
        (e.shiftKey && e.key === 'PrintScreen') || // Windows Alt
        (e.ctrlKey && e.shiftKey && e.key === 'S') || // Custom screenshot tools
        (e.metaKey && e.shiftKey && e.key === 's') // macOS screenshot tools
      ) {
        e.preventDefault();
        e.stopPropagation();
        obscureContent();
        return false;
      }

      // Developer tools
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u')) ||
        e.key === 'F12'
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Copy, save, select all shortcuts
      if (e.ctrlKey || e.metaKey) {
        if (
          e.key === 'c' || e.key === 'C' ||
          e.key === 's' || e.key === 'S' ||
          e.key === 'x' || e.key === 'X' ||
          e.key === 'a' || e.key === 'A'
        ) {
          // Allow in input fields only
          const target = e.target as HTMLElement;
          if (!target.matches('input, textarea, [contenteditable]')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        }
      }
    };

    // Layer 4: Visibility change detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        obscureContent();
      }
    };

    // Layer 5: Page blur detection
    const handleBlur = () => {
      obscureContent();
    };

    // Layer 6: Mobile-specific screenshot detection
    const detectMobileScreenshot = () => {
      if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
        const observer = new MutationObserver(() => {
          if (document.hidden) {
            obscureContent();
          }
        });
        observer.observe(document.body, { attributes: true, childList: true, subtree: true });
        return observer;
      }
      return null;
    };

    // Layer 7: Apply protection to body element
    document.body.setAttribute('oncontextmenu', 'return false');
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.webkitTouchCallout = 'none';

    // Register all event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('drop', handleDrop);

    // Mobile screenshot detection
    const mobileObserver = detectMobileScreenshot();

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('drop', handleDrop);
      if (mobileObserver) mobileObserver.disconnect();
    };
  }, []);

  return null;
}
