
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const CookieConsent = dynamic(() => import('./CookieConsent'), {
  ssr: false,
  loading: () => null
});

const ServiceWorkerRegistration = dynamic(() => import('./ServiceWorkerRegistration'), {
  ssr: false,
  loading: () => null
});

const GlobalAdScripts = dynamic(() => import('./GlobalAdScripts').then(mod => ({ default: mod.default })), {
  ssr: false,
  loading: () => null
});

const DevDiagnostics = dynamic(() => import('./DevDiagnostics'), {
  ssr: false,
  loading: () => null
});

const GoogleAnalytics = dynamic(() => import('./GoogleAnalytics'), {
  ssr: false,
  loading: () => null
});

const OneSignalInit = dynamic(() => import('./OneSignalInit'), {
  ssr: false,
  loading: () => null
});

export default function ClientComponentsWrapper() {
  return (
    <>
      <CookieConsent />
      <ServiceWorkerRegistration />
      <Suspense fallback={null}>
        <GlobalAdScripts />
      </Suspense>
      <DevDiagnostics />
      <GoogleAnalytics />
      <OneSignalInit />
    </>
  );
}
