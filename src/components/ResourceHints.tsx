
'use client';

import { useEffect } from 'react';

export default function ResourceHints() {
  useEffect(() => {
    const preconnectOrigins = [
      { href: 'https://wubzdjzosbbbghdlfcgc.supabase.co', crossOrigin: true },
      { href: 'https://judicialphilosophical.com', crossOrigin: false },
      { href: 'https://adsterranet.com', crossOrigin: false },
    ];

    preconnectOrigins.forEach(origin => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = origin.href;
      if (origin.crossOrigin) link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    const criticalResources = [
      { href: '/chat-bg.png', as: 'image' },
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      document.head.appendChild(link);
    });

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
