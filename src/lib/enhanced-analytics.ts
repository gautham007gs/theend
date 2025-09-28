
export class EnhancedAnalytics {
  private static instance: EnhancedAnalytics;
  private metricsBuffer: any[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  static getInstance(): EnhancedAnalytics {
    if (!EnhancedAnalytics.instance) {
      EnhancedAnalytics.instance = new EnhancedAnalytics();
    }
    return EnhancedAnalytics.instance;
  }

  constructor() {
    this.startBuffering();
  }

  private startBuffering() {
    // Flush metrics every 30 seconds
    this.flushInterval = setInterval(() => {
      this.flushMetrics();
    }, 30000);
  }

  private async flushMetrics() {
    if (this.metricsBuffer.length === 0) return;

    try {
      await fetch('/api/analytics/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: this.metricsBuffer })
      });
      this.metricsBuffer = [];
    } catch (error) {
      console.warn('Failed to flush analytics metrics:', error);
    }
  }

  trackUserBehavior(action: string, data: any) {
    this.metricsBuffer.push({
      type: 'user_behavior',
      action,
      data,
      timestamp: Date.now()
    });
  }

  trackConversationQuality(messageCount: number, averageLength: number, sentiment: string) {
    this.metricsBuffer.push({
      type: 'conversation_quality',
      messageCount,
      averageLength,
      sentiment,
      timestamp: Date.now()
    });
  }

  trackUIInteraction(element: string, interaction: string) {
    this.metricsBuffer.push({
      type: 'ui_interaction',
      element,
      interaction,
      timestamp: Date.now()
    });
  }

  trackPerformanceMetric(metric: string, value: number) {
    this.metricsBuffer.push({
      type: 'performance',
      metric,
      value,
      timestamp: Date.now()
    });
  }
}

export const enhancedAnalytics = EnhancedAnalytics.getInstance();
