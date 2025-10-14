// CPM Optimization System
export class CPMOptimizer {
  private static performanceData: Map<string, {
    impressions: number;
    clicks: number;
    viewableTime: number;
    ctr: number;
  }> = new Map();

  private static readonly MIN_REFRESH_INTERVAL = 60000; // 60 seconds minimum
  private static readonly MAX_REFRESH_INTERVAL = 120000; // 2 minutes maximum
  private static readonly DEFAULT_REFRESH_INTERVAL = 60000; // 60 seconds default


  // Track ad performance by placement
  static trackAdPerformance(placementId: string, metrics: {
    impression?: boolean;
    click?: boolean;
    viewableTime?: number;
  }) {
    const current = this.performanceData.get(placementId) || {
      impressions: 0,
      clicks: 0,
      viewableTime: 0,
      ctr: 0
    };

    if (metrics.impression) current.impressions++;
    if (metrics.click) current.clicks++;
    if (metrics.viewableTime) current.viewableTime += metrics.viewableTime;

    current.ctr = current.impressions > 0 ? (current.clicks / current.impressions) * 100 : 0;

    this.performanceData.set(placementId, current);
  }

  // Get optimal ad refresh interval based on performance
  static getOptimalRefreshInterval(placementId: string): number {
    const data = this.performanceData.get(placementId);
    if (!data) return this.DEFAULT_REFRESH_INTERVAL; // Default 60 seconds

    // Higher CTR = faster refresh (more revenue)
    // Ensure refresh interval is at least MIN_REFRESH_INTERVAL
    if (data.ctr > 2.0) return Math.max(this.MIN_REFRESH_INTERVAL, 45000); // Premium performance
    if (data.ctr > 1.0) return Math.max(this.MIN_REFRESH_INTERVAL, 55000); // Good performance
    if (data.ctr > 0.5) return Math.max(this.MIN_REFRESH_INTERVAL, 65000); // Average performance
    return Math.max(this.MIN_REFRESH_INTERVAL, 90000); // Poor performance - slow down to avoid waste
  }

  // Identify high-value placements
  static getHighValuePlacements(): string[] {
    const highValue: string[] = [];

    this.performanceData.forEach((data, placementId) => {
      if (data.ctr > 1.0 && data.impressions > 100) {
        highValue.push(placementId);
      }
    });

    return highValue;
  }

  // Get placement priority score (for ad network bidding)
  static getPlacementScore(placementId: string): number {
    const data = this.performanceData.get(placementId);
    if (!data) return 0;

    // Score based on CTR, viewability, and volume
    const ctrScore = data.ctr * 30; // CTR weight: 30%
    const viewabilityScore = (data.viewableTime / data.impressions) * 0.05; // Viewability weight: 50%
    const volumeScore = Math.min(data.impressions / 1000, 1) * 20; // Volume weight: 20%

    return Math.min(ctrScore + viewabilityScore + volumeScore, 100);
  }
}

// Ad lazy loading for better viewability
export const setupLazyAdLoading = () => {
  if (typeof window === 'undefined') return;

  const adElements = document.querySelectorAll('[data-ad-placement]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          const placementId = element.dataset.adPlacement;

          // Load ad only when it's about to be visible
          if (placementId && !element.dataset.adLoaded) {
            element.dataset.adLoaded = 'true';
            // Trigger ad load here
            console.log(`Loading ad for placement: ${placementId}`);
          }
        }
      });
    },
    {
      rootMargin: '50px', // Load 50px before entering viewport
      threshold: 0.1
    }
  );

  adElements.forEach((el) => observer.observe(el));
};

// Geographic targeting for premium CPM
export const getGeoCPMMultiplier = async (): Promise<number> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();

    const premiumGeos: Record<string, number> = {
      'US': 2.5,  // USA - highest CPM
      'GB': 2.2,  // UK
      'CA': 2.0,  // Canada
      'AU': 2.0,  // Australia
      'DE': 1.8,  // Germany
      'FR': 1.7,  // France
      'JP': 1.6,  // Japan
      'IN': 1.2,  // India
    };

    return premiumGeos[data.country_code] || 1.0;
  } catch {
    return 1.0; // Default multiplier
  }
};

// Device targeting for CPM optimization
export const getDeviceCPMMultiplier = (): number => {
  if (typeof window === 'undefined') return 1.0;

  const userAgent = navigator.userAgent.toLowerCase();

  // Desktop typically has higher CPM
  if (!/mobile|android|iphone|ipad|tablet/.test(userAgent)) {
    return 1.4; // Desktop premium
  }

  // Tablets have medium CPM
  if (/ipad|tablet/.test(userAgent)) {
    return 1.2;
  }

  // Mobile standard
  return 1.0;
};

// Time-based CPM optimization
export const getTimeCPMMultiplier = (): number => {
  const hour = new Date().getHours();
  const day = new Date().getDay();

  // Peak hours (evening): 6 PM - 11 PM
  if (hour >= 18 && hour <= 23) {
    return 1.5; // Premium peak time
  }

  // Business hours (weekdays): 9 AM - 5 PM
  if (day >= 1 && day <= 5 && hour >= 9 && hour <= 17) {
    return 1.3; // Business hours premium
  }

  // Weekend daytime
  if ((day === 0 || day === 6) && hour >= 10 && hour <= 20) {
    return 1.4; // Weekend premium
  }

  // Off-peak hours
  return 1.0;
};

// Content category targeting for higher CPM
export const getContentCPMMultiplier = (category: string): number => {
  const premiumCategories: Record<string, number> = {
    'finance': 2.0,
    'technology': 1.8,
    'business': 1.7,
    'health': 1.6,
    'education': 1.5,
    'entertainment': 1.3,
    'lifestyle': 1.2,
    'general': 1.0,
  };

  return premiumCategories[category.toLowerCase()] || 1.0;
};

console.log('CPM Optimizer: Advanced CPM optimization system loaded');