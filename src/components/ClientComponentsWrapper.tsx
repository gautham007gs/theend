
'use client';

import dynamic from 'next/dynamic';

// Lazy load non-critical components to improve LCP
const CookieConsent = dynamic(() => import('@/components/CookieConsent'), {
  ssr: false,
  loading: () => null
});

const InstagramBrowserPrompt = dynamic(() => import('@/components/InstagramBrowserPrompt'), {
  ssr: false,
  loading: () => null
});

const ServiceWorkerRegistration = dynamic(() => import('@/components/ServiceWorkerRegistration'), {
  ssr: false,
  loading: () => null
});

const MobileOptimizer = dynamic(() => import('@/components/MobileOptimizer'), {
  ssr: false,
  loading: () => null
});

const PerformanceMonitor = dynamic(() => import('@/components/PerformanceMonitor'), {
  ssr: false,
  loading: () => null
});

const PerformanceOptimizer = dynamic(() => import('@/components/PerformanceOptimizer'), {
  ssr: false,
  loading: () => null
});

const ResourceHints = dynamic(() => import('@/components/ResourceHints'), {
  ssr: false,
  loading: () => null
});

const GlobalAdScripts = dynamic(() => import('@/components/GlobalAdScripts'), {
  ssr: false,
  loading: () => null
});

const SocialBarAdDisplay = dynamic(() => import('@/components/SocialBarAdDisplay'), {
  ssr: false,
  loading: () => null
});

export default function ClientComponentsWrapper() {
  return (
    <>
      <ResourceHints />
      <InstagramBrowserPrompt />
      <GlobalAdScripts />
      <ServiceWorkerRegistration />
      <SocialBarAdDisplay />
      <CookieConsent />
      <PerformanceMonitor />
      <PerformanceOptimizer />
      <MobileOptimizer />
    </>
  );
}
