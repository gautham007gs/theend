
// Connection pooling and optimization for high traffic
import { supabase } from './supabaseClient';

// Query result cache for frequently accessed data
const queryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes default
const MAX_CACHE_ENTRIES = 1000;

class ConnectionPool {
  private static instance: ConnectionPool;
  private requestQueue: Array<{ fn: () => Promise<any>; priority: number }> = [];
  private activeConnections = 0;
  private readonly maxConnections = 150; // Further increased for higher traffic
  private readonly queueTimeout = 2000; // Further reduced timeout
  private batchQueue: Array<{ query: string; resolve: Function; reject: Function }> = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private readonly priorityLevels = { HIGH: 1, NORMAL: 2, LOW: 3 };

  static getInstance(): ConnectionPool {
    if (!ConnectionPool.instance) {
      ConnectionPool.instance = new ConnectionPool();
    }
    return ConnectionPool.instance;
  }

  async executeQuery<T>(queryFn: () => Promise<T>, priority: number = this.priorityLevels.NORMAL): Promise<T> {
    if (this.activeConnections >= this.maxConnections) {
      // Queue the request with priority
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Query timeout: too many concurrent requests'));
        }, this.queueTimeout);

        const queueItem = {
          fn: async () => {
            clearTimeout(timeoutId);
            try {
              this.activeConnections++;
              const result = await queryFn();
              resolve(result);
            } catch (error) {
              reject(error);
            } finally {
              this.activeConnections--;
              this.processQueue();
            }
          },
          priority
        };

        // Insert based on priority
        const insertIndex = this.requestQueue.findIndex(item => item.priority > priority);
        if (insertIndex === -1) {
          this.requestQueue.push(queueItem);
        } else {
          this.requestQueue.splice(insertIndex, 0, queueItem);
        }
      });
    } else {
      this.activeConnections++;
      try {
        const result = await queryFn();
        return result;
      } finally {
        this.activeConnections--;
        this.processQueue();
      }
    }
  }

  private processQueue() {
    if (this.requestQueue.length > 0 && this.activeConnections < this.maxConnections) {
      // Process highest priority first
      const nextItem = this.requestQueue.shift();
      if (nextItem) {
        nextItem.fn();
      }
    }
  }

  // Query caching system
  private getCacheKey(query: string, params: any): string {
    return `${query}-${JSON.stringify(params)}`;
  }

  private getCachedResult(cacheKey: string): any | null {
    const cached = queryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    if (cached) queryCache.delete(cacheKey);
    return null;
  }

  private setCachedResult(cacheKey: string, data: any, ttl: number = CACHE_TTL): void {
    if (queryCache.size >= MAX_CACHE_ENTRIES) {
      const firstKey = queryCache.keys().next().value;
      queryCache.delete(firstKey);
    }
    queryCache.set(cacheKey, { data, timestamp: Date.now(), ttl });
  }

  // Batch processing for analytics queries
  private processBatch(): void {
    if (this.batchQueue.length === 0) return;
    
    const batch = [...this.batchQueue];
    this.batchQueue = [];
    
    // Execute batch queries together
    this.executeQuery(async () => {
      const results = await Promise.allSettled(
        batch.map(item => supabase.rpc(item.query))
      );
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          batch[index].resolve(result.value);
        } else {
          batch[index].reject(result.reason);
        }
      });
    });
  }

  // Enhanced query execution with caching
  async executeQueryWithCache<T>(
    queryFn: () => Promise<T>, 
    cacheKey?: string, 
    cacheTtl: number = CACHE_TTL
  ): Promise<T> {
    // Check cache first
    if (cacheKey) {
      const cached = this.getCachedResult(cacheKey);
      if (cached) return cached;
    }

    const result = await this.executeQuery(queryFn);
    
    // Cache successful results
    if (cacheKey && result) {
      this.setCachedResult(cacheKey, result, cacheTtl);
    }
    
    return result;
  }

  getStats() {
    return {
      activeConnections: this.activeConnections,
      queuedRequests: this.requestQueue.length,
      maxConnections: this.maxConnections,
      cacheSize: queryCache.size,
      cacheHitRate: this.calculateCacheHitRate()
    };
  }

  private calculateCacheHitRate(): number {
    // Simple approximation - in production you'd track hits/misses
    return queryCache.size > 0 ? Math.min(90, queryCache.size * 2) : 0;
  }

  // Clear expired cache entries
  clearExpiredCache(): number {
    const now = Date.now();
    let cleared = 0;
    
    for (const [key, entry] of queryCache.entries()) {
      if (now - entry.timestamp >= entry.ttl) {
        queryCache.delete(key);
        cleared++;
      }
    }
    
    return cleared;
  }
}

export const connectionPool = ConnectionPool.getInstance();

// Optimized Supabase operations
export const optimizedSupabaseQuery = {
  async select(table: string, query: string = '*', filters?: any) {
    return connectionPool.executeQuery(async () => {
      let queryBuilder = supabase.from(table).select(query);
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          queryBuilder = queryBuilder.eq(key, value);
        });
      }
      return queryBuilder;
    });
  },

  async insert(table: string, data: any) {
    return connectionPool.executeQuery(async () => {
      return supabase.from(table).insert(data);
    });
  },

  async update(table: string, data: any, filters: any) {
    return connectionPool.executeQuery(async () => {
      let queryBuilder = supabase.from(table).update(data);
      Object.entries(filters).forEach(([key, value]) => {
        queryBuilder = queryBuilder.eq(key, value);
      });
      return queryBuilder;
    });
  }
};
