// Advanced caching strategies for scalability

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
  lastAccessed: number;
}

/**
 * Multi-level cache with LRU eviction
 */
export class MultiLevelCache<T> {
  private level1 = new Map<string, CacheEntry<T>>(); // Hot cache
  private level2 = new Map<string, CacheEntry<T>>(); // Warm cache
  private maxLevel1Size: number;
  private maxLevel2Size: number;
  private defaultTTL: number;

  constructor(
    maxLevel1Size = 100,
    maxLevel2Size = 1000,
    defaultTTL = 5 * 60 * 1000 // 5 minutes
  ) {
    this.maxLevel1Size = maxLevel1Size;
    this.maxLevel2Size = maxLevel2Size;
    this.defaultTTL = defaultTTL;

    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Set cache entry
   */
  set(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
      hits: 0,
      lastAccessed: Date.now()
    };

    // Always start in level 1 (hot cache)
    this.evictIfNeeded(this.level1, this.maxLevel1Size);
    this.level1.set(key, entry);
  }

  /**
   * Get cache entry
   */
  get(key: string): T | null {
    const now = Date.now();

    // Check level 1 first
    let entry = this.level1.get(key);
    if (entry) {
      if (this.isExpired(entry, now)) {
        this.level1.delete(key);
        return null;
      }
      entry.hits++;
      entry.lastAccessed = now;
      return entry.data;
    }

    // Check level 2
    entry = this.level2.get(key);
    if (entry) {
      if (this.isExpired(entry, now)) {
        this.level2.delete(key);
        return null;
      }
      
      entry.hits++;
      entry.lastAccessed = now;
      
      // Promote to level 1 if frequently accessed
      if (entry.hits > 3) {
        this.level2.delete(key);
        this.evictIfNeeded(this.level1, this.maxLevel1Size);
        this.level1.set(key, entry);
      }
      
      return entry.data;
    }

    return null;
  }

  /**
   * Check if key exists (without promoting)
   */
  has(key: string): boolean {
    const now = Date.now();
    
    const level1Entry = this.level1.get(key);
    if (level1Entry && !this.isExpired(level1Entry, now)) {
      return true;
    }
    
    const level2Entry = this.level2.get(key);
    if (level2Entry && !this.isExpired(level2Entry, now)) {
      return true;
    }
    
    return false;
  }

  /**
   * Delete cache entry
   */
  delete(key: string): boolean {
    const deleted1 = this.level1.delete(key);
    const deleted2 = this.level2.delete(key);
    return deleted1 || deleted2;
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.level1.clear();
    this.level2.clear();
  }

  /**
   * Get all cache keys from both levels
   */
  getAllKeys(): string[] {
    const level1Keys = Array.from(this.level1.keys());
    const level2Keys = Array.from(this.level2.keys());
    return [...level1Keys, ...level2Keys];
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const level1Entries = Array.from(this.level1.values());
    const level2Entries = Array.from(this.level2.values());
    
    return {
      level1: {
        size: this.level1.size,
        maxSize: this.maxLevel1Size,
        avgHits: level1Entries.reduce((sum, entry) => sum + entry.hits, 0) / level1Entries.length || 0
      },
      level2: {
        size: this.level2.size,
        maxSize: this.maxLevel2Size,
        avgHits: level2Entries.reduce((sum, entry) => sum + entry.hits, 0) / level2Entries.length || 0
      },
      total: {
        entries: this.level1.size + this.level2.size,
        memory: this.estimateMemoryUsage()
      }
    };
  }

  private isExpired(entry: CacheEntry<T>, now: number): boolean {
    return now - entry.timestamp > entry.ttl;
  }

  private evictIfNeeded(cache: Map<string, CacheEntry<T>>, maxSize: number): void {
    while (cache.size >= maxSize) {
      // LRU eviction - remove least recently accessed
      let lruKey = '';
      let oldestAccess = Date.now();
      
      for (const [key, entry] of cache.entries()) {
        if (entry.lastAccessed < oldestAccess) {
          oldestAccess = entry.lastAccessed;
          lruKey = key;
        }
      }
      
      if (lruKey) {
        // Move to level 2 if evicting from level 1, otherwise delete
        if (cache === this.level1) {
          const entry = cache.get(lruKey)!;
          cache.delete(lruKey);
          
          this.evictIfNeeded(this.level2, this.maxLevel2Size);
          this.level2.set(lruKey, entry);
        } else {
          cache.delete(lruKey);
        }
      }
    }
  }

  private cleanup(): void {
    const now = Date.now();
    
    // Clean expired entries from both levels
    for (const [key, entry] of this.level1.entries()) {
      if (this.isExpired(entry, now)) {
        this.level1.delete(key);
      }
    }
    
    for (const [key, entry] of this.level2.entries()) {
      if (this.isExpired(entry, now)) {
        this.level2.delete(key);
      }
    }
  }

  private estimateMemoryUsage(): string {
    // Rough estimate of memory usage
    const entrySize = 200; // bytes per entry (rough estimate)
    const totalEntries = this.level1.size + this.level2.size;
    const bytes = totalEntries * entrySize;
    
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }
}

/**
 * Specialized caches for different data types
 */
export const cacheInstances = {
  // API responses cache
  apiResponses: new MultiLevelCache<any>(50, 500, 5 * 60 * 1000), // 5 minutes
  
  // User data cache
  userData: new MultiLevelCache<any>(100, 1000, 15 * 60 * 1000), // 15 minutes
  
  // Static content cache
  staticContent: new MultiLevelCache<any>(200, 2000, 60 * 60 * 1000), // 1 hour
  
  // Chat history cache
  chatHistory: new MultiLevelCache<any>(50, 200, 10 * 60 * 1000), // 10 minutes
  
  // Blog posts cache
  blogPosts: new MultiLevelCache<any>(100, 500, 30 * 60 * 1000), // 30 minutes
};

/**
 * Cache helper functions
 */
export class CacheHelper {
  /**
   * Generate consistent cache key
   */
  static generateKey(prefix: string, ...params: any[]): string {
    const paramString = params.map(p => 
      typeof p === 'object' ? JSON.stringify(p) : String(p)
    ).join(':');
    
    return `${prefix}:${paramString}`;
  }

  /**
   * Cache with automatic JSON serialization
   */
  static async cacheJSON<T>(
    cache: MultiLevelCache<string>,
    key: string,
    dataFetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    // Try to get from cache first
    const cached = cache.get(key);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // Invalid JSON in cache, fetch fresh data
        cache.delete(key);
      }
    }

    // Fetch fresh data
    const data = await dataFetcher();
    
    // Store in cache
    cache.set(key, JSON.stringify(data), ttl);
    
    return data;
  }

  /**
   * Invalidate related cache entries
   */
  static invalidatePattern(
    cache: MultiLevelCache<any>,
    pattern: string
  ): number {
    let deleted = 0;
    
    // This is a simplified implementation
    // In production, you'd use a more sophisticated pattern matching
    const keys = this.getAllKeys(cache);
    
    for (const key of keys) {
      if (key.includes(pattern)) {
        cache.delete(key);
        deleted++;
      }
    }
    
    return deleted;
  }

  /**
   * Get all cache keys (for pattern matching)
   */
  private static getAllKeys(cache: MultiLevelCache<any>): string[] {
    return cache.getAllKeys();
  }

  /**
   * Warm cache with frequently accessed data
   */
  static async warmCache(): Promise<void> {
    console.log('Warming cache with frequently accessed data...');
    
    try {
      // Pre-load blog posts
      const blogKey = this.generateKey('blogs', 'all');
      cacheInstances.blogPosts.set(blogKey, 'blog-data-placeholder', 30 * 60 * 1000);
      
      // Pre-load common API responses
      const apiKey = this.generateKey('api', 'common');
      cacheInstances.apiResponses.set(apiKey, 'api-data-placeholder', 5 * 60 * 1000);
      
      console.log('Cache warming completed');
    } catch (error) {
      console.error('Cache warming failed:', error);
    }
  }
}

/**
 * Memory-based cache stats monitoring
 */
export class CacheMonitor {
  static getOverallStats() {
    return {
      apiResponses: cacheInstances.apiResponses.getStats(),
      userData: cacheInstances.userData.getStats(),
      staticContent: cacheInstances.staticContent.getStats(),
      chatHistory: cacheInstances.chatHistory.getStats(),
      blogPosts: cacheInstances.blogPosts.getStats(),
      timestamp: Date.now()
    };
  }

  static logStats(): void {
    const stats = this.getOverallStats();
    console.log('📊 Cache Statistics:', stats);
  }

  static startMonitoring(intervalMs = 5 * 60 * 1000): void {
    setInterval(() => {
      this.logStats();
    }, intervalMs);
  }
}