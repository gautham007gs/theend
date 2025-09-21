
'use client';

import { useEffect } from 'react';

export default function ResourceHints() {
  useEffect(() => {
    // Preload critical resources
    const criticalResources = [
      { href: '/chat-bg.png', as: 'image' },
      { href: '/og-image.png', as: 'image' }
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      document.head.appendChild(link);
    });

    // Prefetch likely navigation targets
    const prefetchRoutes = ['/maya-chat', '/blog'];
    prefetchRoutes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  }, []);

  return null;
}
