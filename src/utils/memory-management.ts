// Memory management utilities for large scale applications

interface MemoryStats {
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
}

/**
 * Memory monitor for tracking usage patterns
 */
export class MemoryMonitor {
  private static instance: MemoryMonitor;
  private memoryHistory: MemoryStats[] = [];
  private maxHistorySize = 100;
  private monitoringInterval: NodeJS.Timeout | null = null;

  static getInstance(): MemoryMonitor {
    if (!MemoryMonitor.instance) {
      MemoryMonitor.instance = new MemoryMonitor();
    }
    return MemoryMonitor.instance;
  }

  /**
   * Start memory monitoring
   */
  startMonitoring(intervalMs = 30000): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.monitoringInterval = setInterval(() => {
      this.recordMemoryUsage();
    }, intervalMs);

    console.log('🧠 Memory monitoring started');
  }

  /**
   * Stop memory monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  /**
   * Record current memory usage
   */
  recordMemoryUsage(): MemoryStats {
    if (typeof process === 'undefined') {
      return { heapUsed: 0, heapTotal: 0, external: 0, rss: 0 };
    }

    const memUsage = process.memoryUsage();
    const stats: MemoryStats = {
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external,
      rss: memUsage.rss
    };

    // Keep history limited
    this.memoryHistory.push(stats);
    if (this.memoryHistory.length > this.maxHistorySize) {
      this.memoryHistory.shift();
    }

    // Check for memory leaks
    this.checkForLeaks(stats);

    return stats;
  }

  /**
   * Get current memory statistics
   */
  getCurrentStats(): MemoryStats {
    return this.recordMemoryUsage();
  }

  /**
   * Get memory usage trend
   */
  getMemoryTrend(): { isIncreasing: boolean; avgGrowth: number } {
    if (this.memoryHistory.length < 10) {
      return { isIncreasing: false, avgGrowth: 0 };
    }

    const recent = this.memoryHistory.slice(-10);
    const first = recent[0].heapUsed;
    const last = recent[recent.length - 1].heapUsed;
    
    const growth = (last - first) / first;
    
    return {
      isIncreasing: growth > 0.1, // 10% increase
      avgGrowth: growth
    };
  }

  /**
   * Check for potential memory leaks
   */
  private checkForLeaks(currentStats: MemoryStats): void {
    const trend = this.getMemoryTrend();
    
    if (trend.isIncreasing && trend.avgGrowth > 0.2) {
      console.warn('⚠️ Potential memory leak detected:', {
        growth: `${(trend.avgGrowth * 100).toFixed(1)}%`,
        currentHeap: this.formatBytes(currentStats.heapUsed)
      });
    }
  }

  /**
   * Force garbage collection (if available)
   */
  forceGC(): boolean {
    if (typeof global !== 'undefined' && global.gc) {
      global.gc();
      console.log('🗑️ Forced garbage collection');
      return true;
    }
    return false;
  }

  /**
   * Get formatted memory usage
   */
  getFormattedStats(): Record<string, string> {
    const stats = this.getCurrentStats();
    
    return {
      heapUsed: this.formatBytes(stats.heapUsed),
      heapTotal: this.formatBytes(stats.heapTotal),
      external: this.formatBytes(stats.external),
      rss: this.formatBytes(stats.rss),
      heapUtilization: `${((stats.heapUsed / stats.heapTotal) * 100).toFixed(1)}%`
    };
  }

  private formatBytes(bytes: number): string {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)}MB`;
  }
}

/**
 * Resource cleanup utilities
 */
export class ResourceManager {
  private static cleanupTasks: (() => void)[] = [];

  /**
   * Register cleanup task
   */
  static registerCleanup(task: () => void): void {
    this.cleanupTasks.push(task);
  }

  /**
   * Run all cleanup tasks
   */
  static runCleanup(): void {
    console.log('🧹 Running resource cleanup...');
    
    this.cleanupTasks.forEach((task, index) => {
      try {
        task();
      } catch (error) {
        console.error(`Cleanup task ${index} failed:`, error);
      }
    });

    console.log(`Completed ${this.cleanupTasks.length} cleanup tasks`);
  }

  /**
   * Setup automatic cleanup on process exit
   */
  static setupAutomaticCleanup(): void {
    if (typeof process === 'undefined') return;

    process.on('exit', () => this.runCleanup());
    process.on('SIGINT', () => {
      this.runCleanup();
      process.exit(0);
    });
    process.on('SIGTERM', () => {
      this.runCleanup();
      process.exit(0);
    });
  }
}

/**
 * Connection pooling for scalability
 */
export class ConnectionPool<T> {
  private connections: T[] = [];
  private activeConnections = new Set<T>();
  private maxConnections: number;
  private createConnection: () => Promise<T>;
  private destroyConnection: (conn: T) => Promise<void>;

  constructor(
    maxConnections: number,
    createConnection: () => Promise<T>,
    destroyConnection: (conn: T) => Promise<void>
  ) {
    this.maxConnections = maxConnections;
    this.createConnection = createConnection;
    this.destroyConnection = destroyConnection;
  }

  /**
   * Get connection from pool
   */
  async acquire(): Promise<T> {
    // Try to get existing connection
    if (this.connections.length > 0) {
      const connection = this.connections.pop()!;
      this.activeConnections.add(connection);
      return connection;
    }

    // Create new connection if under limit
    if (this.activeConnections.size < this.maxConnections) {
      const connection = await this.createConnection();
      this.activeConnections.add(connection);
      return connection;
    }

    // Wait for available connection
    return new Promise((resolve) => {
      const checkForConnection = () => {
        if (this.connections.length > 0) {
          const connection = this.connections.pop()!;
          this.activeConnections.add(connection);
          resolve(connection);
        } else {
          setTimeout(checkForConnection, 100);
        }
      };
      checkForConnection();
    });
  }

  /**
   * Return connection to pool
   */
  release(connection: T): void {
    if (this.activeConnections.has(connection)) {
      this.activeConnections.delete(connection);
      this.connections.push(connection);
    }
  }

  /**
   * Destroy all connections
   */
  async destroy(): Promise<void> {
    // Destroy active connections
    for (const connection of this.activeConnections) {
      await this.destroyConnection(connection);
    }
    this.activeConnections.clear();

    // Destroy pooled connections
    for (const connection of this.connections) {
      await this.destroyConnection(connection);
    }
    this.connections.length = 0;
  }

  /**
   * Get pool statistics
   */
  getStats() {
    return {
      totalConnections: this.activeConnections.size + this.connections.length,
      activeConnections: this.activeConnections.size,
      availableConnections: this.connections.length,
      maxConnections: this.maxConnections
    };
  }
}

// Export singleton instance
export const memoryMonitor = MemoryMonitor.getInstance();