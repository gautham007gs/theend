
'use client';

import dynamic from 'next/dynamic';

// Lazy load non-critical components with interaction-based loading
const CookieConsent = dynamic(() => import('@/components/CookieConsent').then(mod => ({ default: mod.default })), {
  ssr: false,
  loading: () => null
});

const InstagramBrowserPrompt = dynamic(() => import('@/components/InstagramBrowserPrompt').then(mod => ({ default: mod.default })), {
  ssr: false,
  loading: () => null
});

const ServiceWorkerRegistration = dynamic(() => import('@/components/ServiceWorkerRegistration').then(mod => ({ default: mod.default })), {
  ssr: false,
  loading: () => null
});

const MobileOptimizer = dynamic(() => import('@/components/MobileOptimizer').then(mod => ({ default: mod.default })), {
  ssr: false,
  loading: () => null
});

const PerformanceMonitor = dynamic(() => import('@/components/PerformanceMonitor').then(mod => ({ default: mod.default })), {
  ssr: false,
  loading: () => null
});

const PerformanceOptimizer = dynamic(() => import('@/components/PerformanceOptimizer').then(mod => ({ default: mod.default })), {
  ssr: false,
  loading: () => null
});

const ResourceHints = dynamic(() => import('@/components/ResourceHints').then(mod => ({ default: mod.default })), {
  ssr: false,
  loading: () => null
});

const GlobalAdScripts = dynamic(() => import('@/components/GlobalAdScripts').then(mod => ({ default: mod.default })), {
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
