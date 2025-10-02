
interface ErrorLog {
  type: string;
  message: string;
  stack?: string;
  url: string;
  timestamp: number;
  userAgent: string;
  userId?: string;
}

export class ErrorTracker {
  private static errors: ErrorLog[] = [];
  private static readonly MAX_ERRORS = 100;

  static logError(error: Error, context?: any) {
    const errorLog: ErrorLog = {
      type: error.name,
      message: error.message,
      stack: error.stack,
      url: typeof window !== 'undefined' ? window.location.href : '',
      timestamp: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      userId: context?.userId
    };

    this.errors.push(errorLog);
    
    // Keep only recent errors
    if (this.errors.length > this.MAX_ERRORS) {
      this.errors.shift();
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(errorLog);
    }
  }

  private static async sendToAnalytics(errorLog: ErrorLog) {
    try {
      await fetch('/api/analytics/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorLog)
      });
    } catch (err) {
      console.error('Failed to send error to analytics:', err);
    }
  }

  static getRecentErrors(count: number = 10): ErrorLog[] {
    return this.errors.slice(-count);
  }

  static getErrorRate(): number {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const recentErrors = this.errors.filter(e => e.timestamp > fiveMinutesAgo);
    return recentErrors.length / 5; // Errors per minute
  }
}
