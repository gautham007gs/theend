"use client";

import { useEffect } from 'react';

export function ScreenshotProtection() {
  useEffect(() => {
    // Enhanced visual obscuring layer for screenshot attempts
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

    // Detect visibility change (triggered during screenshot)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        obscureContent();
      }
    };

    // Detect page blur (screenshot tools often blur the page)
    const handleBlur = () => {
      obscureContent();
    };

    // Prevent right-click context menu
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Prevent copy, cut, paste
    const handleCopy = (e: Event) => {
      e.preventDefault();
      return false;
    };

    const handleCut = (e: Event) => {
      e.preventDefault();
      return false;
    };

    const handlePaste = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Comprehensive keyboard shortcut blocking
    const handleKeydown = (e: KeyboardEvent) => {
      // Screenshot shortcuts
      if (
        e.key === 'PrintScreen' ||
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) ||
        (e.ctrlKey && e.shiftKey && e.key === 'S')
      ) {
        e.preventDefault();
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
          e.preventDefault();
          return false;
        }
      }
    };

    // Detect screenshot on mobile (user agent sniffing)
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

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('paste', handlePaste);

    // Mobile screenshot detection
    const mobileObserver = detectMobileScreenshot();

    // Disable right-click on body
    document.body.oncontextmenu = () => false;

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('paste', handlePaste);
      if (mobileObserver) mobileObserver.disconnect();
    };
  }, []);

  return null;
}
