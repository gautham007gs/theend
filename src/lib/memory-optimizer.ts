
class MemoryOptimizer {
  private static instance: MemoryOptimizer;
  private cleanupTasks: (() => void)[] = [];
  private maxCacheSize = 50 * 1024 * 1024; // 50MB

  private constructor() {
    this.initializeMemoryMonitoring();
  }

  public static getInstance(): MemoryOptimizer {
    if (!MemoryOptimizer.instance) {
      MemoryOptimizer.instance = new MemoryOptimizer();
    }
    return MemoryOptimizer.instance;
  }

  private initializeMemoryMonitoring() {
    if (typeof window === 'undefined') return;

    // Monitor memory usage periodically
    setInterval(() => {
      this.checkMemoryUsage();
    }, 60000); // Every minute

    // Cleanup on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.performCleanup();
      }
    });
  }

  private checkMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedMemory = memory.usedJSHeapSize;
      const memoryLimit = memory.jsHeapSizeLimit;

      // If using > 80% of available memory, trigger cleanup
      if (usedMemory > memoryLimit * 0.8) {
        console.warn('[Memory Optimizer] High memory usage detected, cleaning up...');
        this.performCleanup();
      }
    }

    this.cleanupLocalStorage();
  }

  private cleanupLocalStorage() {
    try {
      let totalSize = 0;
      const items: { key: string; size: number; timestamp?: number }[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;

        const value = localStorage.getItem(key) || '';
        const size = new Blob([value]).size;
        totalSize += size;

        // Parse timestamp if available
        let timestamp;
        try {
          const parsed = JSON.parse(value);
          timestamp = parsed.timestamp || parsed.lastUpdated || 0;
        } catch {
          timestamp = 0;
        }

        items.push({ key, size, timestamp });
      }

      // If exceeding max size, remove oldest items
      if (totalSize > this.maxCacheSize) {
        items.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        
        let removed = 0;
        for (const item of items) {
          if (totalSize - removed < this.maxCacheSize * 0.7) break;
          
          // Don't remove critical items
          if (!item.key.includes('user_pseudo_id') && 
              !item.key.includes('isAdminLoggedIn')) {
            localStorage.removeItem(item.key);
            removed += item.size;
          }
        }

        console.log(`[Memory Optimizer] Cleaned up ${removed} bytes from localStorage`);
      }
    } catch (error) {
      console.error('[Memory Optimizer] Error cleaning localStorage:', error);
    }
  }

  private performCleanup() {
    // Execute registered cleanup tasks
    this.cleanupTasks.forEach(task => {
      try {
        task();
      } catch (error) {
        console.error('[Memory Optimizer] Cleanup task failed:', error);
      }
    });

    // Clear session storage except critical data
    try {
      const keysToKeep = ['user_session', 'admin_session'];
      const sessionData: Record<string, string> = {};

      keysToKeep.forEach(key => {
        const value = sessionStorage.getItem(key);
        if (value) sessionData[key] = value;
      });

      sessionStorage.clear();

      Object.entries(sessionData).forEach(([key, value]) => {
        sessionStorage.setItem(key, value);
      });
    } catch (error) {
      console.error('[Memory Optimizer] Error cleaning sessionStorage:', error);
    }
  }

  public registerCleanupTask(task: () => void) {
    this.cleanupTasks.push(task);
  }

  public forceCleanup() {
    this.performCleanup();
    this.cleanupLocalStorage();
  }
}

export const memoryOptimizer = MemoryOptimizer.getInstance();
