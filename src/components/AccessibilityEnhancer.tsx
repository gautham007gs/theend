
'use client';

import { useEffect } from 'react';

export default function AccessibilityEnhancer() {
  useEffect(() => {
    // Skip to main content
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-pink-500 focus:text-white';
    skipLink.textContent = 'Skip to main content';
    document.body.prepend(skipLink);

    // Add main landmark if missing
    if (!document.querySelector('main')) {
      const mainContent = document.querySelector('[role="main"]') || document.body;
      mainContent.setAttribute('role', 'main');
      mainContent.id = 'main-content';
    }

    // Enhance focus visibility
    document.documentElement.classList.add('focus-visible');

    // Add aria-labels to interactive elements without text
    document.querySelectorAll('button:not([aria-label]), a:not([aria-label])').forEach(el => {
      const imgAlt = el.querySelector('img')?.getAttribute('alt');
      const svgTitle = el.querySelector('svg title')?.textContent;
      if (!el.textContent?.trim() && !imgAlt && !svgTitle) {
        el.setAttribute('aria-label', 'Interactive element');
      }
    });

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

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      skipLink.remove();
    };
  }, []);

  return null;
}
