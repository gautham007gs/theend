"use client";

import { useEffect } from 'react';

export function ScreenshotProtection() {
  useEffect(() => {
    // Add visual obscuring layer on screenshot attempt detection
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

    // Detect visibility change (often triggered during screenshot)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        obscureContent();
      }
    };

    // Detect page blur (common during screenshot)
    const handleBlur = () => {
      obscureContent();
    };

    // Prevent right-click context menu
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Prevent keyboard shortcuts for screenshots and dev tools
    const handleKeydown = (e: KeyboardEvent) => {
      // Prevent Print Screen, Windows + Shift + S, Command + Shift + 3/4/5
      if (
        e.key === 'PrintScreen' ||
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) ||
        (e.ctrlKey && e.shiftKey && e.key === 'S')
      ) {
        e.preventDefault();
        obscureContent();
        return false;
      }

      // Prevent developer tools
      if (
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'U') ||
        e.key === 'F12'
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeydown);

    // Cleanup: remove all event listeners
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  return null;
}
