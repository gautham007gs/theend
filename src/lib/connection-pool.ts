
// Connection pooling and optimization for high traffic
import { supabase } from './supabaseClient';

class ConnectionPool {
  private static instance: ConnectionPool;
  private requestQueue: Array<() => Promise<any>> = [];
  private activeConnections = 0;
  private readonly maxConnections = 50;
  private readonly queueTimeout = 5000; // 5 seconds

  static getInstance(): ConnectionPool {
    if (!ConnectionPool.instance) {
      ConnectionPool.instance = new ConnectionPool();
    }
    return ConnectionPool.instance;
  }

  async executeQuery<T>(queryFn: () => Promise<T>): Promise<T> {
    if (this.activeConnections >= this.maxConnections) {
      // Queue the request
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Query timeout: too many concurrent requests'));
        }, this.queueTimeout);

        this.requestQueue.push(async () => {
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
        });
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
      const nextQuery = this.requestQueue.shift();
      if (nextQuery) {
        nextQuery();
      }
    }
  }

  getStats() {
    return {
      activeConnections: this.activeConnections,
      queuedRequests: this.requestQueue.length,
      maxConnections: this.maxConnections
    };
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
