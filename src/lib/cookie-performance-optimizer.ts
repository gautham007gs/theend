
'use client';

// Cookie Performance Optimizer
// Reduces cookie storage impact and optimizes read/write operations

interface CookieCompressionMap {
  [key: string]: string;
}

export class CookiePerformanceOptimizer {
  // Compress commonly used values to reduce cookie size
  private static compressionMap: CookieCompressionMap = {
    'romantic': 'r',
    'casual': 'c',
    'flirty': 'f',
    'supportive': 's',
    'getting_to_know': 'gtk',
    'close': 'cl',
    'intimate': 'i',
    'new': 'n',
    'instant': 'in',
    'natural': 'na',
    'slow': 'sl'
  };

  static compressValue(value: string): string {
    return this.compressionMap[value] || value;
  }

  static decompressValue(compressed: string): string {
    const reverseMap = Object.entries(this.compressionMap)
      .reduce((acc, [key, val]) => ({ ...acc, [val]: key }), {});
    return reverseMap[compressed as keyof typeof reverseMap] || compressed;
  }

  // Enhanced batch cookie operations with compression and optimization
  static batchSetCookies(cookies: Array<{ name: string; value: string; category: string }>): void {
    if (typeof window === 'undefined') return;

    // Group by category for efficient setting
    const categorized = cookies.reduce((acc, cookie) => {
      if (!acc[cookie.category]) acc[cookie.category] = [];
      acc[cookie.category].push(cookie);
      return acc;
    }, {} as Record<string, typeof cookies>);

    // Use requestIdleCallback for non-blocking cookie operations
    const processCategory = (category: string, cookieList: typeof cookies) => {
      cookieList.forEach(cookie => {
        // Compress value before setting
        const compressedValue = this.compressValue(cookie.value);
        
        // Use existing CookieManager logic but with compression
        import('./cookie-manager').then(({ CookieManager }) => {
          CookieManager.setCookie(cookie.name, compressedValue, category as any);
        });
      });
    };

    Object.entries(categorized).forEach(([category, cookieList]) => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => processCategory(category, cookieList));
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => processCategory(category, cookieList), 0);
      }
    });
  }

  // Optimize cookie reads with caching
  private static cookieCache = new Map<string, { value: string; timestamp: number }>();
  private static CACHE_DURATION = 30000; // 30 seconds

  static getCachedCookie(name: string): string | null {
    if (typeof window === 'undefined') return null;

    const cached = this.cookieCache.get(name);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.value;
    }

    // Cache miss, read from cookie and cache
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        const value = decodeURIComponent(c.substring(nameEQ.length, c.length));
        this.cookieCache.set(name, { value, timestamp: Date.now() });
        return value;
      }
    }
    
    this.cookieCache.set(name, { value: '', timestamp: Date.now() });
    return null;
  }

  // Clear cache periodically
  static clearCookieCache(): void {
    this.cookieCache.clear();
  }

  // Enhanced cookie usage analysis with performance impact scoring
  static analyzeCookieUsage(): {
    totalSize: number;
    cookieCount: number;
    recommendations: string[];
    performanceScore: number;
    compressionSavings: number;
    categoryBreakdown: Record<string, number>;
  } {
    if (typeof window === 'undefined') {
      return { 
        totalSize: 0, 
        cookieCount: 0, 
        recommendations: [],
        performanceScore: 100,
        compressionSavings: 0,
        categoryBreakdown: {}
      };
    }

    const cookies = document.cookie.split(';').filter(cookie => cookie.trim());
    const totalSize = document.cookie.length;
    const recommendations: string[] = [];
    const categoryBreakdown: Record<string, number> = {};
    let compressionSavings = 0;

    // Calculate performance score (0-100)
    let performanceScore = 100;
    if (totalSize > 4000) performanceScore -= 30; // Approaching 4KB limit
    if (totalSize > 3000) performanceScore -= 20;
    if (cookies.length > 25) performanceScore -= 20; // Too many cookies
    if (cookies.length > 15) performanceScore -= 10;

    // Analyze each cookie
    cookies.forEach(cookie => {
      const [name, value] = cookie.split('=').map(s => s.trim());
      const cookieSize = cookie.length;
      
      // Check for compression opportunities
      if (value && this.compressionMap[value]) {
        const compressed = this.compressValue(value);
        const savings = value.length - compressed.length;
        compressionSavings += savings;
      }

      // Categorize cookies
      if (name.includes('session') || name.includes('user')) {
        categoryBreakdown['User Session'] = (categoryBreakdown['User Session'] || 0) + cookieSize;
      } else if (name.includes('preference') || name.includes('setting')) {
        categoryBreakdown['Preferences'] = (categoryBreakdown['Preferences'] || 0) + cookieSize;
      } else if (name.includes('analytics') || name.includes('tracking')) {
        categoryBreakdown['Analytics'] = (categoryBreakdown['Analytics'] || 0) + cookieSize;
      } else {
        categoryBreakdown['Other'] = (categoryBreakdown['Other'] || 0) + cookieSize;
      }

      // Generate recommendations
      if (cookieSize > 1000) {
        recommendations.push(`Critical: Cookie '${name}' is ${cookieSize} bytes. Consider splitting or compression.`);
        performanceScore -= 15;
      } else if (cookieSize > 500) {
        recommendations.push(`Warning: Cookie '${name}' is large (${cookieSize} bytes). Consider optimization.`);
        performanceScore -= 5;
      }
    });

    // Overall recommendations
    if (totalSize > 3500) {
      recommendations.push('🚨 Critical: Total cookie size approaching 4KB limit. Immediate optimization required.');
    } else if (totalSize > 2500) {
      recommendations.push('⚠️ Warning: Cookie storage getting large. Consider optimization.');
    }

    if (cookies.length > 20) {
      recommendations.push('💡 Consider consolidating related cookies to reduce HTTP header overhead.');
    }

    if (compressionSavings > 100) {
      recommendations.push(`💰 Potential ${compressionSavings} bytes savings through value compression.`);
    }

    // Performance tips
    if (performanceScore < 70) {
      recommendations.push('🔧 Consider implementing cookie lazy loading for non-critical data.');
      recommendations.push('📦 Use localStorage for large, non-sensitive data instead of cookies.');
    }

    return {
      totalSize,
      cookieCount: cookies.length,
      recommendations,
      performanceScore: Math.max(0, performanceScore),
      compressionSavings,
      categoryBreakdown
    };
  }
}

// Auto-cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    CookiePerformanceOptimizer.clearCookieCache();
  }, 300000);
}
