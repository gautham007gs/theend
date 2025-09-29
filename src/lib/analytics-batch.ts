
interface AnalyticsEvent {
  type: string;
  data: any;
  timestamp: number;
}

class AnalyticsBatcher {
  private queue: AnalyticsEvent[] = [];
  private batchSize = 10;
  private flushInterval = 5000; // 5 seconds
  private timer: NodeJS.Timeout | null = null;

  constructor() {
    this.scheduleFlush();
  }

  addEvent(type: string, data: any) {
    this.queue.push({
      type,
      data,
      timestamp: Date.now()
    });

    if (this.queue.length >= this.batchSize) {
      this.flush();
    }
  }

  private scheduleFlush() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flush(), this.flushInterval);
  }

  private async flush() {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      await fetch('/api/analytics/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events })
      });
    } catch (error) {
      // Re-queue failed events
      this.queue.unshift(...events);
    }

    this.scheduleFlush();
  }
}

export const analyticsBatcher = new AnalyticsBatcher();
