'use client';

import dynamic from 'next/dynamic';

// Only load essential client components
const CookieConsent = dynamic(() => import('./CookieConsent'), {
  ssr: false,
  loading: () => null
});

const ServiceWorkerRegistration = dynamic(() => import('./ServiceWorkerRegistration'), {
  ssr: false,
  loading: () => null
});

export default function ClientComponentsWrapper() {
  return (
    <>
      <CookieConsent />
      <ServiceWorkerRegistration />
    </>
  );
}