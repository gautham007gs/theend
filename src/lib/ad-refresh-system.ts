import { debounce, throttle } from './performance-utils';

// Safe ad refresh intervals (in seconds) to avoid detection
const REFRESH_INTERVALS = {
  MINIMUM: 45, // Never refresh faster than 45 seconds (safer for ad networks)
  STANDARD: 60, // Optimal refresh rate for revenue
  EXTENDED: 90, // Conservative refresh rate
  MAXIMUM: 180, // Very conservative for suspicious patterns
  PEAK_HOURS: 75, // Longer intervals during peak traffic
};

// Viewability thresholds
const VIEWABILITY_CONFIG = {
  THRESHOLD: 0.5, // 50% of ad must be visible
  DURATION: 1000, // Must be visible for 1 second
  CHECK_INTERVAL: 250, // Check visibility every 250ms
};

// Click fraud protection
const CLICK_PROTECTION = {
  MAX_CLICKS_PER_MINUTE: 2,
  MAX_CLICKS_PER_HOUR: 8,
  SUSPICIOUS_CLICK_INTERVAL: 3000, // 3 seconds minimum between clicks
};

interface AdRefreshConfig {
  adElementId: string;
  networkName: 'adsterra' | 'monetag';
  adType: 'banner' | 'native' | 'social';
  maxRefreshesPerHour: number;
  respectUserActivity: boolean;
}

interface RefreshState {
  refreshCount: number;
  lastRefreshTime: number;
  isVisible: boolean;
  viewableTime: number;
  clickCount: number;
  lastClickTime: number;
  suspiciousActivity: boolean;
}

class AdRefreshManager {
  private states = new Map<string, RefreshState>();
  private observers = new Map<string, IntersectionObserver>();
  private refreshTimers = new Map<string, NodeJS.Timeout>();
  private isUserActive = true;
  private lastUserActivity = Date.now();

  constructor() {
    this.initializeUserActivityTracking();
  }

  private initializeUserActivityTracking() {
    if (typeof window === 'undefined') return;

    const updateActivity = debounce(() => {
      this.isUserActive = true;
      this.lastUserActivity = Date.now();
    }, 1000);

    // Track user activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // Set user as inactive after 2 minutes of no activity
    setInterval(() => {
      if (Date.now() - this.lastUserActivity > 120000) {
        this.isUserActive = false;
      }
    }, 30000);
  }

  registerAd(config: AdRefreshConfig): void {
    const { adElementId, networkName, adType, maxRefreshesPerHour, respectUserActivity } = config;
    
    this.states.set(adElementId, {
      refreshCount: 0,
      lastRefreshTime: 0,
      isVisible: false,
      viewableTime: 0,
      clickCount: 0,
      lastClickTime: 0,
      suspiciousActivity: false
    });

    this.setupViewabilityTracking(adElementId);
    this.setupClickProtection(adElementId);
    this.scheduleRefresh(adElementId, config);
  }

  private setupViewabilityTracking(adElementId: string): void {
    if (typeof window === 'undefined') return;

    const element = document.getElementById(adElementId);
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const state = this.states.get(adElementId);
          if (!state) return;

          const isVisible = entry.intersectionRatio >= VIEWABILITY_CONFIG.THRESHOLD;
          state.isVisible = isVisible;

          if (isVisible) {
            state.viewableTime = Date.now();
          }
        });
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1.0],
        rootMargin: '0px'
      }
    );

    observer.observe(element);
    this.observers.set(adElementId, observer);
  }

  private setupClickProtection(adElementId: string): void {
    if (typeof window === 'undefined') return;

    const element = document.getElementById(adElementId);
    if (!element) return;

    const handleClick = throttle((event: Event) => {
      const state = this.states.get(adElementId);
      if (!state) return;

      const now = Date.now();
      const timeSinceLastClick = now - state.lastClickTime;

      // Check for suspicious clicking patterns
      if (timeSinceLastClick < CLICK_PROTECTION.SUSPICIOUS_CLICK_INTERVAL) {
        state.suspiciousActivity = true;
        console.warn(`Suspicious click pattern detected for ad ${adElementId}`);
        return;
      }

      // Check click rate limits
      const clicksInLastMinute = this.getClicksInTimeframe(state, 60000);
      const clicksInLastHour = this.getClicksInTimeframe(state, 3600000);

      if (clicksInLastMinute >= CLICK_PROTECTION.MAX_CLICKS_PER_MINUTE ||
          clicksInLastHour >= CLICK_PROTECTION.MAX_CLICKS_PER_HOUR) {
        state.suspiciousActivity = true;
        event.preventDefault();
        console.warn(`Click rate limit exceeded for ad ${adElementId}`);
        return;
      }

      state.clickCount++;
      state.lastClickTime = now;
    }, 1000);

    element.addEventListener('click', handleClick);
  }

  private getClicksInTimeframe(state: RefreshState, timeframe: number): number {
    const now = Date.now();
    return state.clickCount; // Simplified - in production, maintain click timestamp array
  }

  private scheduleRefresh(adElementId: string, config: AdRefreshConfig): void {
    const state = this.states.get(adElementId);
    if (!state) return;

    const getRefreshInterval = (): number => {
      // Base interval calculation
      let interval = REFRESH_INTERVALS.STANDARD;

      // Increase interval if user is inactive
      if (config.respectUserActivity && !this.isUserActive) {
        interval = REFRESH_INTERVALS.EXTENDED;
      }

      // Increase interval if suspicious activity detected
      if (state.suspiciousActivity) {
        interval = REFRESH_INTERVALS.MAXIMUM;
      }

      // Increase interval based on refresh count (gradual increase)
      const hourlyRefreshes = this.getRefreshesInLastHour(state);
      if (hourlyRefreshes >= config.maxRefreshesPerHour * 0.8) {
        interval = REFRESH_INTERVALS.EXTENDED;
      }

      // Add random jitter to avoid pattern detection (±10%)
      const jitter = interval * 0.1 * (Math.random() - 0.5);
      return Math.max(REFRESH_INTERVALS.MINIMUM, interval + jitter);
    };

    const refresh = () => {
      if (!this.shouldRefresh(adElementId, config)) {
        // Reschedule for later
        const timer = setTimeout(refresh, getRefreshInterval() * 1000);
        this.refreshTimers.set(adElementId, timer);
        return;
      }

      this.performRefresh(adElementId, config);
      
      // Schedule next refresh
      const timer = setTimeout(refresh, getRefreshInterval() * 1000);
      this.refreshTimers.set(adElementId, timer);
    };

    // Initial delay
    const initialDelay = REFRESH_INTERVALS.STANDARD + Math.random() * 30;
    const timer = setTimeout(refresh, initialDelay * 1000);
    this.refreshTimers.set(adElementId, timer);
  }

  private shouldRefresh(adElementId: string, config: AdRefreshConfig): boolean {
    const state = this.states.get(adElementId);
    if (!state) return false;

    // Don't refresh if user activity is required but user is inactive
    if (config.respectUserActivity && !this.isUserActive) {
      return false;
    }

    // Don't refresh if suspicious activity detected
    if (state.suspiciousActivity) {
      return false;
    }

    // Don't refresh if not visible for required duration
    if (!state.isVisible || 
        (Date.now() - state.viewableTime) < VIEWABILITY_CONFIG.DURATION) {
      return false;
    }

    // Check hourly refresh limits
    const hourlyRefreshes = this.getRefreshesInLastHour(state);
    if (hourlyRefreshes >= config.maxRefreshesPerHour) {
      return false;
    }

    // Minimum time since last refresh
    const timeSinceLastRefresh = Date.now() - state.lastRefreshTime;
    if (timeSinceLastRefresh < REFRESH_INTERVALS.MINIMUM * 1000) {
      return false;
    }

    return true;
  }

  private getRefreshesInLastHour(state: RefreshState): number {
    const oneHourAgo = Date.now() - 3600000;
    return state.lastRefreshTime > oneHourAgo ? state.refreshCount : 0;
  }

  private performRefresh(adElementId: string, config: AdRefreshConfig): void {
    const state = this.states.get(adElementId);
    if (!state) return;

    const element = document.getElementById(adElementId);
    if (!element) return;

    try {
      // Network-specific refresh logic
      if (config.networkName === 'adsterra') {
        this.refreshAdsterraAd(element, config.adType);
      } else if (config.networkName === 'monetag') {
        this.refreshMonetagAd(element, config.adType);
      }

      // Update state
      state.refreshCount++;
      state.lastRefreshTime = Date.now();

      console.log(`Ad refreshed: ${adElementId} (${config.networkName} ${config.adType})`);
      
      // Log for analytics
      this.logRefreshEvent(adElementId, config);

    } catch (error) {
      console.error(`Error refreshing ad ${adElementId}:`, error);
      state.suspiciousActivity = true; // Mark as suspicious on error
    }
  }

  private refreshAdsterraAd(element: HTMLElement, adType: string): void {
    // Adsterra-specific refresh logic
    // This would trigger Adsterra's refresh method if available
    if (typeof window !== 'undefined' && (window as any).atAsyncOptions) {
      try {
        // Refresh Adsterra ad unit
        (window as any).atAsyncOptions.key && 
        (window as any).__atnt && 
        (window as any).__atnt.refresh();
      } catch (error) {
        console.warn('Adsterra refresh method not available:', error);
      }
    }
  }

  private refreshMonetagAd(element: HTMLElement, adType: string): void {
    // Monetag-specific refresh logic
    // This would trigger Monetag's refresh method if available
    if (typeof window !== 'undefined' && (window as any).monetag) {
      try {
        // Refresh Monetag ad unit
        (window as any).monetag.refresh && 
        (window as any).monetag.refresh();
      } catch (error) {
        console.warn('Monetag refresh method not available:', error);
      }
    }
  }

  private logRefreshEvent(adElementId: string, config: AdRefreshConfig): void {
    // Log to analytics for tracking performance
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ad_refresh', {
        ad_id: adElementId,
        ad_network: config.networkName,
        ad_type: config.adType,
        refresh_count: this.states.get(adElementId)?.refreshCount || 0
      });
    }
  }

  unregisterAd(adElementId: string): void {
    // Clean up
    const timer = this.refreshTimers.get(adElementId);
    if (timer) {
      clearTimeout(timer);
      this.refreshTimers.delete(adElementId);
    }

    const observer = this.observers.get(adElementId);
    if (observer) {
      observer.disconnect();
      this.observers.delete(adElementId);
    }

    this.states.delete(adElementId);
  }

  // Public method to temporarily disable refreshing (e.g., during user interaction)
  pauseRefresh(adElementId: string, duration: number = 30000): void {
    const state = this.states.get(adElementId);
    if (state) {
      state.suspiciousActivity = true;
      setTimeout(() => {
        if (state) state.suspiciousActivity = false;
      }, duration);
    }
  }

  // Get refresh statistics for monitoring
  getStats(adElementId: string): RefreshState | null {
    return this.states.get(adElementId) || null;
  }
}

// Export singleton instance
export const adRefreshManager = new AdRefreshManager();

// Utility function to easily register ads
export const registerAdRefresh = (config: AdRefreshConfig): void => {
  adRefreshManager.registerAd(config);
};

export const unregisterAdRefresh = (adElementId: string): void => {
  adRefreshManager.unregisterAd(adElementId);
};

console.log('Ad Refresh System: Safe impression optimization system loaded');