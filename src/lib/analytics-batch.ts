
interface AnalyticsEvent {
  type: string;
  data: any;
  timestamp: number;
  retryCount?: number;
}

class AnalyticsBatcher {
  private queue: AnalyticsEvent[] = [];
  private batchSize = 50; // Increased for better efficiency
  private flushInterval = 15000; // 15 seconds - fewer API calls
  private maxRetries = 3;
  private timer: NodeJS.Timeout | null = null;
  private isOnline = true;

  constructor() {
    this.scheduleFlush();
    this.setupNetworkMonitoring();
  }

  private setupNetworkMonitoring() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.flush(); // Flush immediately when back online
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
    }
  }

  addEvent(type: string, data: any) {
    this.queue.push({
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0
    });

    // Batch similar events together
    if (this.queue.length >= this.batchSize || this.shouldFlushEarly(type)) {
      this.flush();
    }
  }

  private shouldFlushEarly(type: string): boolean {
    // Flush critical events immediately
    const criticalEvents = ['error', 'crash', 'security_violation'];
    return criticalEvents.includes(type);
  }

  private scheduleFlush() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flush(), this.flushInterval);
  }

  private async flush() {
    if (this.queue.length === 0 || !this.isOnline) return;

    // Group events by type for more efficient processing
    const eventGroups = this.queue.reduce((groups, event) => {
      if (!groups[event.type]) groups[event.type] = [];
      groups[event.type].push(event);
      return groups;
    }, {} as Record<string, AnalyticsEvent[]>);

    const events = [...this.queue];
    this.queue = [];

    try {
      const response = await fetch('/api/analytics/batch', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Batch-Size': events.length.toString()
        },
        body: JSON.stringify({ 
          events: events.map(e => ({ ...e, retryCount: undefined })), // Clean data
          groups: Object.keys(eventGroups).map(type => ({
            type,
            count: eventGroups[type].length
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`Batch failed: ${response.status}`);
      }
    } catch (error) {
      console.warn('Analytics batch failed:', error);
      // Re-queue failed events with retry logic
      const retriableEvents = events.filter(e => (e.retryCount || 0) < this.maxRetries);
      retriableEvents.forEach(e => e.retryCount = (e.retryCount || 0) + 1);
      this.queue.unshift(...retriableEvents);
    }

    this.scheduleFlush();
  }

  // Manual flush for critical moments
  public forceFlush() {
    return this.flush();
  }

  // Get queue status for debugging
  public getStatus() {
    return {
      queueLength: this.queue.length,
      isOnline: this.isOnline,
      nextFlushIn: this.timer ? this.flushInterval : 0
    };
  }
}

export const analyticsBatcher = new AnalyticsBatcher();
