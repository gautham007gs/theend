// Ad Network Quality Thresholds (Analytics Only - NO REFRESH)

export const AD_NETWORK_CONFIG = {
  adsterra: {
    preferredFormats: ['native', 'banner', 'popunder'],
    minViewability: 0.7,
    minDuration: 2000,
  },
  monetag: {
    preferredFormats: ['banner', 'native', 'social'],
    minViewability: 0.7,
    minDuration: 2000,
  }
};

// Quality thresholds for analytics
export const QUALITY_THRESHOLDS = {
  PREMIUM_CTR: 2.0,
  GOOD_CTR: 1.0,
  MIN_CTR: 0.3,

  PREMIUM_VIEWABILITY: 0.8,
  GOOD_VIEWABILITY: 0.7,
  MIN_VIEWABILITY: 0.5,

  MIN_IMPRESSIONS: 100,
};

// CPM estimation based on quality metrics (for analytics)
export const estimateCPM = (metrics: {
  ctr: number;
  viewability: number;
  geo: string;
  device: string;
  time: number;
}): number => {
  let baseCPM = 1.0;

  if (metrics.ctr >= QUALITY_THRESHOLDS.PREMIUM_CTR) baseCPM *= 2.5;
  else if (metrics.ctr >= QUALITY_THRESHOLDS.GOOD_CTR) baseCPM *= 1.8;
  else if (metrics.ctr >= QUALITY_THRESHOLDS.MIN_CTR) baseCPM *= 1.2;

  if (metrics.viewability >= QUALITY_THRESHOLDS.PREMIUM_VIEWABILITY) baseCPM *= 1.5;
  else if (metrics.viewability >= QUALITY_THRESHOLDS.GOOD_VIEWABILITY) baseCPM *= 1.2;

  const geoMultipliers: Record<string, number> = {
    'US': 3.0, 'GB': 2.5, 'CA': 2.2, 'AU': 2.2,
    'DE': 2.0, 'FR': 1.8, 'JP': 1.7, 'IN': 1.3
  };
  baseCPM *= (geoMultipliers[metrics.geo] || 1.0);

  if (metrics.device === 'desktop') baseCPM *= 1.4;
  else if (metrics.device === 'tablet') baseCPM *= 1.2;

  const hour = new Date(metrics.time).getHours();
  if (hour >= 18 && hour <= 23) baseCPM *= 1.5;
  else if (hour >= 9 && hour <= 17) baseCPM *= 1.3;

  return Number(baseCPM.toFixed(2));
};