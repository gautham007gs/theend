import { debounce } from './performance-utils';

// Ad preload and lazy load utilities only - NO REFRESH LOGIC

export const AD_VIEWABILITY_CONFIG = {
  THRESHOLD: 0.7, // 70% of ad must be visible
  DURATION: 2000, // Must be visible for 2 seconds
  CHECK_INTERVAL: 200, // Check visibility every 200ms
};

// Setup lazy loading observer for ads
export const setupAdLazyLoading = (adElementId: string, onVisible: () => void): IntersectionObserver | null => {
  if (typeof window === 'undefined') return null;

  const element = document.getElementById(adElementId);
  if (!element) return null;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.01) {
          onVisible();
          observer.disconnect(); // Load once and disconnect
        }
      });
    },
    {
      rootMargin: '200px', // Load 200px before entering viewport
      threshold: 0.01
    }
  );

  observer.observe(element);
  return observer;
};

// Track viewability for analytics only
export const setupViewabilityTracking = (adElementId: string, onViewable: () => void): IntersectionObserver | null => {
  if (typeof window === 'undefined') return null;

  const element = document.getElementById(adElementId);
  if (!element) return null;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= AD_VIEWABILITY_CONFIG.THRESHOLD) {
          setTimeout(() => {
            if (entry.isIntersecting) {
              onViewable();
            }
          }, AD_VIEWABILITY_CONFIG.DURATION);
        }
      });
    },
    {
      threshold: [0, 0.25, 0.5, 0.75, 1.0],
      rootMargin: '0px'
    }
  );

  observer.observe(element);
  return observer;
};

console.log('Ad System: Preload and lazy load utilities loaded (no refresh)');