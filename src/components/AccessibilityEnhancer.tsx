'use client';

import { useEffect } from 'react';

export default function AccessibilityEnhancer() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-white focus:text-black';
    skipLink.setAttribute('aria-label', 'Skip to main content');
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main landmark if missing
    if (!document.querySelector('main')) {
      const mainContent = document.querySelector('[role="main"]') || document.body;
      mainContent.setAttribute('role', 'main');
      mainContent.id = 'main-content';
    }

    // Enhance focus visibility
    document.documentElement.classList.add('focus-visible');

    // Add ARIA labels to interactive elements without them
    const addAriaLabels = () => {
      // Buttons without aria-label
      document.querySelectorAll('button:not([aria-label])').forEach((button) => {
        const text = button.textContent?.trim();
        if (text) {
          button.setAttribute('aria-label', text);
        }
      });

      // Links without aria-label
      document.querySelectorAll('a:not([aria-label])').forEach((link) => {
        const text = link.textContent?.trim();
        if (text && text.length > 0) {
          link.setAttribute('aria-label', text);
        }
      });

      // Images without alt text
      document.querySelectorAll('img:not([alt])').forEach((img) => {
        const src = img.getAttribute('src');
        if (src) {
          const filename = src.split('/').pop()?.split('.')[0] || 'image';
          img.setAttribute('alt', filename.replace(/-/g, ' '));
        }
      });
    };

    // Run initially and on DOM changes
    addAriaLabels();
    const observer = new MutationObserver(addAriaLabels);
    observer.observe(document.body, { childList: true, subtree: true });

    // Keyboard navigation enhancement
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key closes modals/dialogs
      if (e.key === 'Escape') {
        document.querySelectorAll('[role="dialog"]').forEach(dialog => {
          (dialog as HTMLElement).style.display = 'none';
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
      if (skipLink.parentNode) {
        skipLink.parentNode.removeChild(skipLink);
      }
    };
  }, []);

  return null;
}