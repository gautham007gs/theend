
// Advanced caching system for cost optimization

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

export class AdvancedCache {
  private memoryCache = new Map<string, CacheEntry<any>>();
  private maxMemoryEntries = 100;
  private defaultTTL = 5 * 60 * 1000; // 5 minutes
  
  // Multi-tier cache: Memory -> LocalStorage -> IndexedDB
  async get<T>(key: string): Promise<T | null> {
    // Level 1: Memory cache
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry && !this.isExpired(memoryEntry)) {
      memoryEntry.accessCount++;
      memoryEntry.lastAccessed = Date.now();
      return memoryEntry.data;
    }
    
    // Level 2: LocalStorage cache
    const localEntry = this.getFromLocalStorage<T>(key);
    if (localEntry) {
      // Promote to memory cache
      this.setInMemory(key, localEntry, this.defaultTTL);
      return localEntry;
    }
    
    // Level 3: IndexedDB cache (for larger data)
    const idbEntry = await this.getFromIndexedDB<T>(key);
    if (idbEntry) {
      // Promote to memory and localStorage
      this.setInMemory(key, idbEntry, this.defaultTTL);
      this.setInLocalStorage(key, idbEntry, this.defaultTTL);
      return idbEntry;
    }
    
    return null;
  }
  
  async set<T>(key: string, data: T, ttl: number = this.defaultTTL): Promise<void> {
    // Always set in memory cache
    this.setInMemory(key, data, ttl);
    
    // Set in localStorage for medium-term persistence
    this.setInLocalStorage(key, data, ttl);
    
    // Set in IndexedDB for large data or long-term cache
    if (this.getDataSize(data) > 1024) { // > 1KB
      await this.setInIndexedDB(key, data, ttl);
    }
  }
  
  private setInMemory<T>(key: string, data: T, ttl: number): void {
    // Implement LRU eviction if cache is full
    if (this.memoryCache.size >= this.maxMemoryEntries) {
      this.evictLRU();
    }
    
    this.memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      accessCount: 1,
      lastAccessed: Date.now()
    });
  }
  
  private setInLocalStorage<T>(key: string, data: T, ttl: number): void {
    try {
      const cacheEntry = {
        data,
        timestamp: Date.now(),
        ttl
      };
      localStorage.setItem(`cache_${key}`, JSON.stringify(cacheEntry));
    } catch (e) {
      console.warn('LocalStorage cache set failed:', e);
    }
  }
  
  private getFromLocalStorage<T>(key: string): T | null {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (!cached) return null;
      
      const entry = JSON.parse(cached);
      if (Date.now() - entry.timestamp > entry.ttl) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }
      
      return entry.data;
    } catch (e) {
      console.warn('LocalStorage cache get failed:', e);
      return null;
    }
  }
  
  private async setInIndexedDB<T>(key: string, data: T, ttl: number): Promise<void> {
    try {
      const request = indexedDB.open('KruthikaCache', 1);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache');
        }
      };
      
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['cache'], 'readwrite');
        const store = transaction.objectStore('cache');
        
        store.put({
          data,
          timestamp: Date.now(),
          ttl
        }, key);
      };
    } catch (e) {
      console.warn('IndexedDB cache set failed:', e);
    }
  }
  
  private async getFromIndexedDB<T>(key: string): Promise<T | null> {
    return new Promise((resolve) => {
      try {
        const request = indexedDB.open('KruthikaCache', 1);
        
        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          const transaction = db.transaction(['cache'], 'readonly');
          const store = transaction.objectStore('cache');
          const getRequest = store.get(key);
          
          getRequest.onsuccess = () => {
            const entry = getRequest.result;
            if (!entry || Date.now() - entry.timestamp > entry.ttl) {
              resolve(null);
              return;
            }
            
            resolve(entry.data);
          };
          
          getRequest.onerror = () => resolve(null);
        };
        
        request.onerror = () => resolve(null);
      } catch (e) {
        console.warn('IndexedDB cache get failed:', e);
        resolve(null);
      }
    });
  }
  
  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }
  
  private evictLRU(): void {
    let lruKey = '';
    let lruTime = Date.now();
    
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.lastAccessed < lruTime) {
        lruTime = entry.lastAccessed;
        lruKey = key;
      }
    }
    
    if (lruKey) {
      this.memoryCache.delete(lruKey);
    }
  }
  
  private getDataSize(data: any): number {
    return JSON.stringify(data).length;
  }
  
  // Clear expired entries
  cleanup(): void {
    for (const [key, entry] of this.memoryCache.entries()) {
      if (this.isExpired(entry)) {
        this.memoryCache.delete(key);
      }
    }
  }
}

export const advancedCache = new AdvancedCache();

// Auto cleanup every 10 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    advancedCache.cleanup();
  }, 10 * 60 * 1000);
}
