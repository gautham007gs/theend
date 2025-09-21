'use client';

import dynamic from 'next/dynamic';

// Dynamically import PerformanceMonitor to reduce initial bundle size
const PerformanceMonitor = dynamic(
  () => import('./PerformanceMonitor').then((mod) => ({ default: mod.PerformanceMonitor })),
  {
    ssr: false, // Don't render on server
    loading: () => null, // No loading indicator needed
  }
);

export default PerformanceMonitor;