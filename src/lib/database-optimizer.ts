
import { supabase } from './supabaseClient';

class DatabaseOptimizer {
  private static instance: DatabaseOptimizer;
  private queryStats = new Map<string, { count: number; totalTime: number; avgTime: number }>();
  
  static getInstance(): DatabaseOptimizer {
    if (!DatabaseOptimizer.instance) {
      DatabaseOptimizer.instance = new DatabaseOptimizer();
    }
    return DatabaseOptimizer.instance;
  }

  // Optimized analytics insertion with batching
  async batchInsertAnalytics(events: any[]): Promise<void> {
    if (events.length === 0) return;
    
    // Batch in chunks of 100
    const chunkSize = 100;
    const chunks = [];
    
    for (let i = 0; i < events.length; i += chunkSize) {
      chunks.push(events.slice(i, i + chunkSize));
    }
    
    const promises = chunks.map(chunk => 
      supabase.from('analytics_events').insert(chunk)
    );
    
    await Promise.allSettled(promises);
  }

  // Track query performance
  async trackQuery<T>(queryName: string, queryFn: () => Promise<T>): Promise<T> {
    const startTime = Date.now();
    
    try {
      const result = await queryFn();
      const duration = Date.now() - startTime;
      
      const stats = this.queryStats.get(queryName) || { count: 0, totalTime: 0, avgTime: 0 };
      stats.count++;
      stats.totalTime += duration;
      stats.avgTime = stats.totalTime / stats.count;
      
      this.queryStats.set(queryName, stats);
      
      // Log slow queries
      if (duration > 1000) {
        // Log slow queries only in development
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Slow query detected: ${queryName} took ${duration}ms`);
        }
      }
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`Query failed: ${queryName} after ${duration}ms`, error);
      throw error;
    }
  }

  // Get performance statistics
  getQueryStats(): Map<string, { count: number; totalTime: number; avgTime: number }> {
    return new Map(this.queryStats);
  }

  // Optimize common queries with prepared statements pattern
  async getAIProfile(useCache: boolean = true): Promise<any> {
    return this.trackQuery('ai_profile_fetch', async () => {
      const cacheKey = 'ai_profile_global';
      
      if (useCache) {
        // Check if we have recent data in memory/localStorage
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < 5 * 60 * 1000) { // 5 minutes
            return parsed.data;
          }
        }
      }
      
      const { data, error } = await supabase
        .from('ai_profiles')
        .select('settings')
        .eq('profile_name', 'kruthika')
        .single();
      
      if (!error && data) {
        // Cache the result
        localStorage.setItem(cacheKey, JSON.stringify({
          data: data.settings,
          timestamp: Date.now()
        }));
      }
      
      return data?.settings || null;
    });
  }

  // Bulk analytics operations
  async updateAnalytics(metrics: {
    dau?: number;
    messageCount?: number;
    errorCount?: number;
    responseTime?: number;
  }): Promise<void> {
    return this.trackQuery('analytics_update', async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('daily_analytics')
        .upsert({
          date: today,
          ...metrics,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'date'
        });
      
      if (error) {
        console.error('Analytics update failed:', error);
      }
    });
  }
}

export const dbOptimizer = DatabaseOptimizer.getInstance();
