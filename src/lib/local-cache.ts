
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class LocalCache {
  set<T>(key: string, data: T, expiryMinutes: number = 5): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + (expiryMinutes * 60 * 1000)
    };
    
    try {
      localStorage.setItem(`maya_cache_${key}`, JSON.stringify(item));
    } catch (error) {
      // Handle storage quota exceeded
      this.clearExpired();
    }
  }

  get<T>(key: string): T | null {
    try {
      const cached = localStorage.getItem(`maya_cache_${key}`);
      if (!cached) return null;

      const item: CacheItem<T> = JSON.parse(cached);
      
      if (Date.now() > item.expiry) {
        localStorage.removeItem(`maya_cache_${key}`);
        return null;
      }

      return item.data;
    } catch {
      return null;
    }
  }

  clearExpired(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('maya_cache_'));
    keys.forEach(key => {
      try {
        const item = JSON.parse(localStorage.getItem(key) || '{}');
        if (Date.now() > (item.expiry || 0)) {
          localStorage.removeItem(key);
        }
      } catch {
        localStorage.removeItem(key);
      }
    });
  }
}

export const localCache = new LocalCache();
