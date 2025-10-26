// Enhanced CPM Optimization System with Viewability Tracking
export class CPMOptimizer {
  private static performanceData: Map<string, {
    impressions: number;
    clicks: number;
    viewableTime: number;
    viewableImpressions: number;
    ctr: number;
    viewabilityRate: number;
    invalidClicks: number;
    botTraffic: number;
  }> = new Map();

  // CPM Issue Diagnostics
  private static cpmIssues: string[] = [];

  // Track ad performance by placement with viewability metrics
  static trackAdPerformance(placementId: string, metrics: {
    impression?: boolean;
    click?: boolean;
    viewableTime?: number;
    wasViewable?: boolean;
  }) {
    const current = this.performanceData.get(placementId) || {
      impressions: 0,
      clicks: 0,
      viewableTime: 0,
      viewableImpressions: 0,
      ctr: 0,
      viewabilityRate: 0,
      invalidClicks: 0,
      botTraffic: 0
    };

    if (metrics.impression) {
      current.impressions++;
      
      // Detect potential bot traffic (rapid impressions)
      if (current.impressions > 10) {
        const avgTimePerImpression = current.viewableTime / current.impressions;
        if (avgTimePerImpression < 500) { // Less than 0.5 seconds per impression
          current.botTraffic++;
          this.cpmIssues.push(`⚠️ Potential bot traffic detected on ${placementId}`);
        }
      }
    }
    
    if (metrics.click) {
      current.clicks++;
      
      // Detect invalid clicks (too fast after impression)
      if (metrics.viewableTime && metrics.viewableTime < 1000) {
        current.invalidClicks++;
        this.cpmIssues.push(`⚠️ Suspicious click detected (too fast) on ${placementId}`);
      }
    }
    
    if (metrics.viewableTime) current.viewableTime += metrics.viewableTime;
    if (metrics.wasViewable) current.viewableImpressions++;

    current.ctr = current.impressions > 0 ? (current.clicks / current.impressions) * 100 : 0;
    current.viewabilityRate = current.impressions > 0 ? (current.viewableImpressions / current.impressions) * 100 : 0;

    this.performanceData.set(placementId, current);
    
    // Comprehensive logging every 10 impressions
    if (current.impressions % 10 === 0) {
      console.log(`📊 Ad Performance [${placementId}]:`);
      console.log(`   • Impressions: ${current.impressions}`);
      console.log(`   • Viewability: ${current.viewabilityRate.toFixed(1)}%`);
      console.log(`   • CTR: ${current.ctr.toFixed(2)}%`);
      console.log(`   • Avg View Time: ${(current.viewableTime / current.impressions / 1000).toFixed(2)}s`);
      
      // CPM Quality Warnings
      if (current.viewabilityRate < 50) {
        console.warn(`⚠️ LOW VIEWABILITY (${current.viewabilityRate.toFixed(1)}%) - CPM will be reduced by Adsterra`);
        this.cpmIssues.push(`Low viewability: ${current.viewabilityRate.toFixed(1)}%`);
      }
      if (current.ctr < 0.1) {
        console.warn(`⚠️ LOW CTR (${current.ctr.toFixed(2)}%) - Poor ad engagement affects CPM`);
        this.cpmIssues.push(`Low CTR: ${current.ctr.toFixed(2)}%`);
      }
      if (current.botTraffic > current.impressions * 0.3) {
        console.error(`🚨 HIGH BOT TRAFFIC (${(current.botTraffic / current.impressions * 100).toFixed(1)}%) - Adsterra will heavily discount CPM`);
        this.cpmIssues.push(`High bot traffic: ${(current.botTraffic / current.impressions * 100).toFixed(1)}%`);
      }
    }
  }

  // Get comprehensive CPM diagnostics
  static getCPMDiagnostics() {
    const allStats = this.getAllStats();
    const totalImpressions = allStats.reduce((sum, stat) => sum + stat.impressions, 0);
    const avgViewability = allStats.reduce((sum, stat) => sum + stat.viewabilityRate, 0) / allStats.length;
    const avgCTR = allStats.reduce((sum, stat) => sum + stat.ctr, 0) / allStats.length;
    
    return {
      totalImpressions,
      avgViewability: avgViewability || 0,
      avgCTR: avgCTR || 0,
      issues: this.cpmIssues,
      estimatedCPM: this.estimateCurrentCPM(avgViewability, avgCTR)
    };
  }

  // Estimate current CPM based on quality metrics
  private static estimateCurrentCPM(viewability: number, ctr: number): number {
    let baseCPM = 2.0; // Base CPM for quality traffic
    
    // Viewability impact (Adsterra requirement: >50%)
    if (viewability < 30) baseCPM *= 0.1; // Severe penalty
    else if (viewability < 50) baseCPM *= 0.3;
    else if (viewability < 70) baseCPM *= 0.6;
    else if (viewability >= 80) baseCPM *= 1.5; // Premium
    
    // CTR impact
    if (ctr < 0.1) baseCPM *= 0.2; // Very low engagement
    else if (ctr < 0.5) baseCPM *= 0.5;
    else if (ctr >= 1.0) baseCPM *= 1.3;
    else if (ctr >= 2.0) baseCPM *= 1.8;
    
    return Math.max(0.05, baseCPM);
  }

  // Get placement performance stats
  static getPlacementStats(placementId: string) {
    return this.performanceData.get(placementId) || null;
  }

  // Get all placement stats
  static getAllStats() {
    return Array.from(this.performanceData.entries()).map(([id, data]) => ({
      placementId: id,
      ...data
    }));
  }
}

// Lazy loading disabled - ads load immediately for maximum monetization
// export const setupLazyAdLoading = () => {
//   // Disabled - ads now load immediately
// };

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

// Log CPM diagnostics on load
if (typeof window !== 'undefined') {
  setTimeout(() => {
    const diagnostics = CPMOptimizer.getCPMDiagnostics();
    console.log('🔍 CPM DIAGNOSTICS:');
    console.log(`   Estimated CPM: $${diagnostics.estimatedCPM.toFixed(2)}`);
    console.log(`   Avg Viewability: ${diagnostics.avgViewability.toFixed(1)}%`);
    console.log(`   Avg CTR: ${diagnostics.avgCTR.toFixed(2)}%`);
    
    if (diagnostics.issues.length > 0) {
      console.warn('⚠️ CPM ISSUES DETECTED:');
      diagnostics.issues.forEach(issue => console.warn(`   • ${issue}`));
      console.log('\n💡 RECOMMENDATIONS:');
      console.log('   1. Ensure ads are visible in viewport (>50% area)');
      console.log('   2. Keep ads on screen for 2+ seconds');
      console.log('   3. Avoid auto-clicks or bot traffic');
      console.log('   4. Target tier-1 countries (US, UK, CA, AU)');
      console.log('   5. Use contextual ad placements');
    }
  }, 5000);
}

console.log('CPM Optimizer: Advanced diagnostics enabled');