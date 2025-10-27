
interface CachedResponse {
  response: string;
  timestamp: number;
  contextHash: string;
}

export class ResponseCache {
  private static instance: ResponseCache;
  private cache = new Map<string, CachedResponse>();
  private maxCacheSize = 100;
  private cacheLifetime = 3600000; // 1 hour

  private constructor() {}

  public static getInstance(): ResponseCache {
    if (!ResponseCache.instance) {
      ResponseCache.instance = new ResponseCache();
    }
    return ResponseCache.instance;
  }

  private generateHash(message: string, context: string[]): string {
    const combined = `${message}${context.join('')}`;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  get(message: string, context: string[]): string | null {
    const hash = this.generateHash(message, context);
    const cached = this.cache.get(hash);

    if (!cached) return null;

    // Check if expired
    if (Date.now() - cached.timestamp > this.cacheLifetime) {
      this.cache.delete(hash);
      return null;
    }

    return cached.response;
  }

  set(message: string, context: string[], response: string): void {
    const hash = this.generateHash(message, context);

    // Manage cache size
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(hash, {
      response,
      timestamp: Date.now(),
      contextHash: hash,
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const responseCache = ResponseCache.getInstance();
