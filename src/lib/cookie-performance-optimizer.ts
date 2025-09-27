
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

  // Batch cookie operations to reduce document.cookie calls
  static batchSetCookies(cookies: Array<{ name: string; value: string; category: string }>): void {
    if (typeof window === 'undefined') return;

    // Group by category for efficient setting
    const categorized = cookies.reduce((acc, cookie) => {
      if (!acc[cookie.category]) acc[cookie.category] = [];
      acc[cookie.category].push(cookie);
      return acc;
    }, {} as Record<string, typeof cookies>);

    Object.entries(categorized).forEach(([category, cookieList]) => {
      cookieList.forEach(cookie => {
        // Use existing CookieManager logic but in batches
        import('./cookie-manager').then(({ CookieManager }) => {
          CookieManager.setCookie(cookie.name, cookie.value, category as any);
        });
      });
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

  // Analyze cookie usage and suggest optimizations
  static analyzeCookieUsage(): {
    totalSize: number;
    cookieCount: number;
    recommendations: string[];
  } {
    if (typeof window === 'undefined') {
      return { totalSize: 0, cookieCount: 0, recommendations: [] };
    }

    const cookies = document.cookie.split(';');
    const totalSize = document.cookie.length;
    const recommendations: string[] = [];

    if (totalSize > 3000) {
      recommendations.push('Cookie storage approaching limit. Consider data compression.');
    }

    if (cookies.length > 20) {
      recommendations.push('High cookie count detected. Consider consolidating related cookies.');
    }

    // Check for large individual cookies
    cookies.forEach(cookie => {
      if (cookie.length > 500) {
        const name = cookie.split('=')[0].trim();
        recommendations.push(`Large cookie detected: ${name}. Consider compression.`);
      }
    });

    return {
      totalSize,
      cookieCount: cookies.length,
      recommendations
    };
  }
}

// Auto-cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    CookiePerformanceOptimizer.clearCookieCache();
  }, 300000);
}
