import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Skeleton } from './ui/skeleton';

export const DynamicBannerAd = dynamic(
  () => import('@/components/chat/BannerAdDisplay'),
  {
    ssr: false,
    loading: () => <div className="h-24 animate-pulse bg-muted rounded-lg" />,
  }
);

export const DynamicCookieConsent = dynamic(
  () => import('@/components/CookieConsent'),
  {
    ssr: false,
    loading: () => null,
  }
);

export const DynamicCharts = dynamic(
  () => import('@/components/charts/AdminCharts').then(mod => ({ default: mod.BarChart })),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-[300px] w-full" />
      </div>
    ),
  }
);

export const DynamicProfileEditor = dynamic(
  () => import('@/components/chat/ProfileEditor'),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full" />,
  }
);


type LazyComponentProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function LazyComponent({ children, fallback }: LazyComponentProps) {
  return (
    <Suspense fallback={fallback || <Skeleton className="h-20 w-full" />}>
      {children}
    </Suspense>
  );
}
