
// API optimization utilities for faster response times

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

export class APIOptimizer {
  private static cache = new Map<string, CacheEntry>();
  private static pendingRequests = new Map<string, Promise<any>>();

  // Request deduplication and caching
  static async optimizedFetch(url: string, options: RequestInit = {}, ttl: number = 30000): Promise<any> {
    const cacheKey = `${url}:${JSON.stringify(options)}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }

    // Check if request is already pending (deduplication)
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    // Make request with optimizations
    const requestPromise = this.makeOptimizedRequest(url, options);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      const result = await requestPromise;
      
      // Cache successful response
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
        ttl
      });

      return result;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  private static async makeOptimizedRequest(url: string, options: RequestInit): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        // Add performance headers
        headers: {
          ...options.headers,
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'max-age=300', // 5 minutes
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Batch multiple API calls
  static async batchRequests<T>(requests: Array<() => Promise<T>>): Promise<T[]> {
    const batchSize = 3; // Process 3 requests at a time
    const results: T[] = [];

    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(request => request()));
      results.push(...batchResults);
    }

    return results;
  }

  // Preload critical API responses
  static preloadCriticalAPIs() {
    const criticalEndpoints = [
      '/api/analytics?type=overview',
      '/api/test-vertex'
    ];

    criticalEndpoints.forEach(endpoint => {
      // Preload in background
      this.optimizedFetch(endpoint, {}, 60000).catch(() => {
        // Ignore preload errors
      });
    });
  }

  // Clear expired cache entries
  static cleanupCache() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Message processing optimization
export class MessageOptimizer {
  private static messageQueue: any[] = [];
  private static isProcessing = false;

  static async optimizeMessageSending(messageData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.messageQueue.push({
        data: messageData,
        resolve,
        reject,
        timestamp: Date.now()
      });

      this.processQueue();
    });
  }

  private static async processQueue() {
    if (this.isProcessing || this.messageQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      
      try {
        // Process message with optimizations
        const result = await this.processMessage(message.data);
        message.resolve(result);
      } catch (error) {
        message.reject(error);
      }

      // Small delay to prevent overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.isProcessing = false;
  }

  private static async processMessage(messageData: any): Promise<any> {
    // Use optimized fetch for message processing
    return APIOptimizer.optimizedFetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData)
    }, 5000); // 5 second cache for message responses
  }
}

// Initialize API optimizations
if (typeof window !== 'undefined') {
  // Preload critical APIs
  APIOptimizer.preloadCriticalAPIs();
  
  // Cleanup cache every 5 minutes
  setInterval(() => APIOptimizer.cleanupCache(), 5 * 60 * 1000);
  
  console.log('🔧 API optimizations initialized');
}
