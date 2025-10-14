
// Ad Network CPM Optimization Configurations

export const AD_NETWORK_CPM_CONFIG = {
  adsterra: {
    // Adsterra optimization settings
    preferredFormats: ['native', 'banner', 'popunder'], // Ordered by CPM
    minViewability: 0.7, // 70% viewable
    minDuration: 2000, // 2 seconds
    geoBoost: true, // Enable geographic targeting
    deviceBoost: true, // Enable device targeting
    timeBoost: true, // Enable time-based optimization
  },
  monetag: {
    // Monetag optimization settings
    preferredFormats: ['banner', 'native', 'social'],
    minViewability: 0.7,
    minDuration: 2000,
    geoBoost: true,
    deviceBoost: true,
    timeBoost: true,
  }
};

// Quality thresholds for premium CPM
export const QUALITY_THRESHOLDS = {
  PREMIUM_CTR: 2.0, // 2%+ CTR = premium rates
  GOOD_CTR: 1.0, // 1%+ CTR = good rates
  MIN_CTR: 0.3, // Below this = reduce frequency
  
  PREMIUM_VIEWABILITY: 0.8, // 80%+ viewability
  GOOD_VIEWABILITY: 0.7, // 70%+ viewability
  MIN_VIEWABILITY: 0.5, // Minimum acceptable
  
  MIN_IMPRESSIONS: 100, // Minimum impressions for reliable data
};

// CPM estimation based on quality metrics
export const estimateCPM = (metrics: {
  ctr: number;
  viewability: number;
  geo: string;
  device: string;
  time: number;
}): number => {
  let baseCPM = 1.0; // Base $1 CPM
  
  // CTR multiplier
  if (metrics.ctr >= QUALITY_THRESHOLDS.PREMIUM_CTR) baseCPM *= 2.5;
  else if (metrics.ctr >= QUALITY_THRESHOLDS.GOOD_CTR) baseCPM *= 1.8;
  else if (metrics.ctr >= QUALITY_THRESHOLDS.MIN_CTR) baseCPM *= 1.2;
  
  // Viewability multiplier
  if (metrics.viewability >= QUALITY_THRESHOLDS.PREMIUM_VIEWABILITY) baseCPM *= 1.5;
  else if (metrics.viewability >= QUALITY_THRESHOLDS.GOOD_VIEWABILITY) baseCPM *= 1.2;
  
  // Geographic multiplier (premium geos)
  const geoMultipliers: Record<string, number> = {
    'US': 3.0, 'GB': 2.5, 'CA': 2.2, 'AU': 2.2,
    'DE': 2.0, 'FR': 1.8, 'JP': 1.7, 'IN': 1.3
  };
  baseCPM *= (geoMultipliers[metrics.geo] || 1.0);
  
  // Device multiplier
  if (metrics.device === 'desktop') baseCPM *= 1.4;
  else if (metrics.device === 'tablet') baseCPM *= 1.2;
  
  // Time-based multiplier
  const hour = new Date(metrics.time).getHours();
  if (hour >= 18 && hour <= 23) baseCPM *= 1.5; // Evening premium
  else if (hour >= 9 && hour <= 17) baseCPM *= 1.3; // Business hours
  
  return Number(baseCPM.toFixed(2));
};
