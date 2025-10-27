
import { connectionMonitor } from './connection-monitor';
import { batteryOptimizer } from './battery-optimizer';

interface PrefetchConfig {
  priority: 'high' | 'medium' | 'low';
  url: string;
  type: 'script' | 'style' | 'image' | 'fetch';
}

class SmartPrefetcher {
  private static instance: SmartPrefetcher;
  private prefetchQueue: PrefetchConfig[] = [];
  private prefetchedUrls = new Set<string>();
  private isProcessing = false;

  private constructor() {
    this.initializePrefetching();
  }

  public static getInstance(): SmartPrefetcher {
    if (!SmartPrefetcher.instance) {
      SmartPrefetcher.instance = new SmartPrefetcher();
    }
    return SmartPrefetcher.instance;
  }

  private initializePrefetching() {
    if (typeof window === 'undefined') return;

    // Start prefetching when idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => this.processPrefetchQueue());
    } else {
      setTimeout(() => this.processPrefetchQueue(), 1000);
    }
  }

  private shouldPrefetch(): boolean {
    const connectionQuality = connectionMonitor.getQuality();
    const batteryStatus = batteryOptimizer.getBatteryStatus();

    // Don't prefetch on poor connection
    if (connectionQuality === 'poor' || connectionQuality === 'offline') {
      return false;
    }

    // Don't prefetch on low battery unless charging
    if (!batteryStatus.charging && batteryStatus.level === 'critical') {
      return false;
    }

    return true;
  }

  private async processPrefetchQueue() {
    if (this.isProcessing || this.prefetchQueue.length === 0) return;
    if (!this.shouldPrefetch()) return;

    this.isProcessing = true;

    // Sort by priority
    this.prefetchQueue.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    const config = this.prefetchQueue.shift();
    if (!config || this.prefetchedUrls.has(config.url)) {
      this.isProcessing = false;
      this.processPrefetchQueue();
      return;
    }

    try {
      await this.prefetchResource(config);
      this.prefetchedUrls.add(config.url);
    } catch (error) {
      console.error('[Smart Prefetch] Failed to prefetch:', config.url, error);
    }

    this.isProcessing = false;

    // Continue processing queue
    if (this.prefetchQueue.length > 0) {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => this.processPrefetchQueue());
      } else {
        setTimeout(() => this.processPrefetchQueue(), 100);
      }
    }
  }

  private async prefetchResource(config: PrefetchConfig): Promise<void> {
    const { url, type } = config;

    if (type === 'fetch') {
      await fetch(url, { method: 'GET', mode: 'cors' });
    } else if (type === 'image') {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
      });
    } else {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = type === 'script' ? 'script' : 'style';
      link.href = url;
      document.head.appendChild(link);
    }
  }

  public addToPrefetchQueue(config: PrefetchConfig) {
    if (!this.prefetchedUrls.has(config.url)) {
      this.prefetchQueue.push(config);
      this.processPrefetchQueue();
    }
  }

  public prefetchCriticalResources(urls: string[]) {
    urls.forEach(url => {
      this.addToPrefetchQueue({
        url,
        priority: 'high',
        type: 'fetch',
      });
    });
  }
}

export const smartPrefetcher = SmartPrefetcher.getInstance();
