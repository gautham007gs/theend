
'use client';

import dynamic from 'next/dynamic';

const ClientComponentsWrapper = dynamic(() => import('@/components/ClientComponentsWrapper'), {
  ssr: false,
  loading: () => null
});

export default function ClientProviders() {
  return <ClientComponentsWrapper />;
}
