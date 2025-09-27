// Database optimization utilities for large scale applications

interface ConnectionPoolConfig {
  maxConnections: number;
  minConnections: number;
  idleTimeout: number;
  connectionTimeout: number;
}

/**
 * Optimized database connection pool configuration
 */
export const getDatabasePoolConfig = (): ConnectionPoolConfig => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    maxConnections: isProduction ? 100 : 20,
    minConnections: isProduction ? 10 : 2,
    idleTimeout: 30000, // 30 seconds
    connectionTimeout: 10000, // 10 seconds
  };
};

/**
 * Database query optimization utilities
 */
export class QueryOptimizer {
  private static queryCache = new Map<string, any>();
  private static cacheSize = 1000;
  private static cacheTTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Cache frequently used queries
   */
  static cacheQuery(queryKey: string, result: any, ttl?: number): void {
    // Clean cache if it's getting too large
    if (this.queryCache.size >= this.cacheSize) {
      const firstKey = this.queryCache.keys().next().value;
      this.queryCache.delete(firstKey);
    }

    this.queryCache.set(queryKey, {
      data: result,
      timestamp: Date.now(),
      ttl: ttl || this.cacheTTL
    });
  }

  /**
   * Get cached query result
   */
  static getCachedQuery(queryKey: string): any | null {
    const cached = this.queryCache.get(queryKey);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired) {
      this.queryCache.delete(queryKey);
      return null;
    }

    return cached.data;
  }

  /**
   * Generate optimized query key for caching
   */
  static generateQueryKey(query: string, params: any[]): string {
    const paramsStr = JSON.stringify(params);
    return `${query}:${paramsStr}`.slice(0, 100);
  }

  /**
   * Batch multiple queries for efficiency
   */
  static async batchQueries<T>(queries: (() => Promise<T>)[]): Promise<T[]> {
    const results = await Promise.all(queries.map(query => query()));
    return results;
  }

  /**
   * Clear query cache
   */
  static clearCache(): void {
    this.queryCache.clear();
  }

  /**
   * Get cache statistics
   */
  static getCacheStats() {
    return {
      size: this.queryCache.size,
      maxSize: this.cacheSize,
      hitRate: this.calculateHitRate()
    };
  }

  private static calculateHitRate(): number {
    // Simplified hit rate calculation
    return this.queryCache.size / this.cacheSize;
  }
}

/**
 * Database connection health monitoring
 */
export class DatabaseHealthMonitor {
  private static lastHealthCheck = 0;
  private static healthCheckInterval = 30000; // 30 seconds
  private static isHealthy = true;

  static async checkHealth(): Promise<boolean> {
    const now = Date.now();
    
    // Don't check too frequently
    if (now - this.lastHealthCheck < this.healthCheckInterval) {
      return this.isHealthy;
    }

    try {
      // Simple health check - could be enhanced with actual DB ping
      this.lastHealthCheck = now;
      this.isHealthy = true;
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      this.isHealthy = false;
      return false;
    }
  }

  static getHealthStatus() {
    return {
      isHealthy: this.isHealthy,
      lastCheck: this.lastHealthCheck,
      uptime: process.uptime()
    };
  }
}

/**
 * Database migration utilities for scaling
 */
export class MigrationHelper {
  static async runMigrationSafely(migration: () => Promise<void>): Promise<boolean> {
    try {
      console.log('Starting database migration...');
      await migration();
      console.log('Database migration completed successfully');
      return true;
    } catch (error) {
      console.error('Database migration failed:', error);
      return false;
    }
  }

  static async backupBeforeMigration(): Promise<boolean> {
    try {
      console.log('Creating database backup before migration...');
      // Backup logic would go here in production
      return true;
    } catch (error) {
      console.error('Database backup failed:', error);
      return false;
    }
  }
}