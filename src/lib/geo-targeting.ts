
export const getGeographicMultiplier = (): number => {
  if (typeof window === 'undefined') return 1.0;
  
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const locale = navigator.language || 'en-US';
    
    // Higher-paying regions (rough estimates)
    const premiumRegions = {
      'US': 2.5,     // $2.50+ CPM
      'CA': 2.2,     // $2.20+ CPM  
      'GB': 2.0,     // $2.00+ CPM
      'AU': 1.8,     // $1.80+ CPM
      'DE': 1.6,     // $1.60+ CPM
      'IN': 0.8,     // $0.80+ CPM (but high volume)
    };
    
    // Detect region from timezone/locale
    if (timezone.includes('America/New_York') || locale.startsWith('en-US')) return premiumRegions.US;
    if (timezone.includes('America/Toronto') || locale.startsWith('en-CA')) return premiumRegions.CA;
    if (timezone.includes('Europe/London') || locale.startsWith('en-GB')) return premiumRegions.GB;
    if (timezone.includes('Australia') || locale.startsWith('en-AU')) return premiumRegions.AU;
    if (timezone.includes('Europe/Berlin') || locale.startsWith('de')) return premiumRegions.DE;
    if (timezone.includes('Asia/Kolkata') || locale.startsWith('hi')) return premiumRegions.IN;
    
    return 1.0; // Default multiplier
  } catch {
    return 1.0;
  }
};

export const getOptimalAdFrequency = (geoMultiplier: number): number => {
  // Show more ads to higher-paying regions
  if (geoMultiplier >= 2.0) return 8; // Premium regions
  if (geoMultiplier >= 1.5) return 6; // Mid-tier regions
  return 4; // Lower-tier regions
};
