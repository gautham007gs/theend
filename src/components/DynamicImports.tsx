
import dynamic from 'next/dynamic';

// Lazy-load heavy components with SSR disabled for faster initial load
export const DynamicChatView = dynamic(
  () => import('./chat/ChatView'),
  { 
    ssr: false,
    loading: () => <div className="flex-grow flex items-center justify-center">Loading chat...</div>
  }
);

export const DynamicChatInput = dynamic(
  () => import('./chat/ChatInput'),
  { 
    ssr: false,
    loading: () => <div className="h-20 bg-chat-input-bg animate-pulse" />
  }
);

export const DynamicProfileEditor = dynamic(
  () => import('./chat/ProfileEditor'),
  { ssr: false }
);

export const DynamicPerformanceMonitor = dynamic(
  () => import('./PerformanceMonitor').then(mod => ({ default: mod.PerformanceMonitor })),
  { 
    ssr: false,
    loading: () => null
  }
);

export const DynamicBannerAdDisplay = dynamic(
  () => import('./chat/BannerAdDisplay'),
  { 
    ssr: false,
    loading: () => <div className="h-16 bg-gray-100 animate-pulse" />
  }
);

export const DynamicUserEngagementMetrics = dynamic(
  () => import('./analytics/UserEngagementMetrics'),
  { ssr: false }
);
