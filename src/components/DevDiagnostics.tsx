
'use client';

import dynamic from 'next/dynamic';

// Lazy load diagnostics in development only
const PerformanceDiagnostics = dynamic(
  () => import('@/lib/performance').then(mod => {
    if (typeof window !== 'undefined') {
      mod.PerformanceMonitor.getInstance().initializeWebVitals();
    }
    return () => null;
  }),
  { ssr: false }
);

const SEOOptimizer = dynamic(
  () => import('@/lib/seo').then(mod => {
    if (typeof window !== 'undefined') {
      mod.SEOOptimizer.initialize();
    }
    return () => null;
  }),
  { ssr: false }
);

const PWAValidator = dynamic(
  () => import('@/lib/pwa-validator').then(mod => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      setTimeout(() => mod.PWAValidator.validatePWA(), 3000);
    }
    return () => null;
  }),
  { ssr: false }
);

export default function DevDiagnostics() {
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <>
      <PerformanceDiagnostics />
      <SEOOptimizer />
      <PWAValidator />
    </>
  );
}
