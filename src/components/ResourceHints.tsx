
'use client';

import { useEffect } from 'react';

export default function ResourceHints() {
  useEffect(() => {
    const prefetchRoutes = ['/maya-chat'];
    prefetchRoutes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  }, []);

  return null;
}
