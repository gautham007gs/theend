
'use client';

import { useEffect } from 'react';

export default function ResourceHints() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Only add critical resource hints
    const hints = [
      { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
    ];

    hints.forEach(({ rel, href, crossOrigin }) => {
      const existing = document.querySelector(`link[rel="${rel}"][href="${href}"]`);
      if (!existing) {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        if (crossOrigin) link.crossOrigin = crossOrigin;
        document.head.appendChild(link);
      }
    });

    // Preload next route for instant navigation
    const nextRoute = document.createElement('link');
    nextRoute.rel = 'prefetch';
    nextRoute.href = '/maya-chat';
    nextRoute.as = 'document';
    document.head.appendChild(nextRoute);

  }, []);

  return null;
}
