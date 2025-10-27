
'use client';

import dynamic from 'next/dynamic';

const CookieConsent = dynamic(() => import('./CookieConsent'), {
  ssr: false,
  loading: () => null
});

const ServiceWorkerRegistration = dynamic(() => import('./ServiceWorkerRegistration'), {
  ssr: false,
  loading: () => null
});

const GlobalAdScripts = dynamic(() => import('./GlobalAdScripts'), {
  ssr: false,
  loading: () => null
});

const SocialBarAdDisplay = dynamic(() => import('./SocialBarAdDisplay'), {
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

export default function ClientComponentsWrapper() {
  return (
    <>
      <CookieConsent />
      <ServiceWorkerRegistration />
      <GlobalAdScripts />
      <SocialBarAdDisplay />
      <DevDiagnostics />
      <GoogleAnalytics />
    </>
  );
}
