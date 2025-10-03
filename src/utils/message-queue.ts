
// Advanced message queue system for handling peak loads

interface QueuedMessage {
  id: string;
  userId: string;
  message: string;
  timestamp: number;
  priority: 'high' | 'normal' | 'low';
  retryCount: number;
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}

interface QueueStats {
  queueLength: number;
  processing: number;
  processed: number;
  failed: number;
  averageWaitTime: number;
  averageProcessingTime: number;
}

export class MessageQueue {
  private queue: QueuedMessage[] = [];
  private processing = new Set<string>();
  private maxConcurrent: number;
  private maxRetries: number;
  private stats: QueueStats = {
    queueLength: 0,
    processing: 0,
    processed: 0,
    failed: 0,
    averageWaitTime: 0,
    averageProcessingTime: 0
  };
  private waitTimes: number[] = [];
  private processingTimes: number[] = [];

  constructor(maxConcurrent = 10, maxRetries = 3) {
    this.maxConcurrent = maxConcurrent;
    this.maxRetries = maxRetries;
  }

  /**
   * Add message to queue with priority
   */
  async enqueue(
    userId: string,
    message: string,
    priority: 'high' | 'normal' | 'low' = 'normal'
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const queuedMessage: QueuedMessage = {
        id: `${userId}_${Date.now()}_${Math.random()}`,
        userId,
        message,
        timestamp: Date.now(),
        priority,
        retryCount: 0,
        resolve,
        reject
      };

      // Insert based on priority
      if (priority === 'high') {
        this.queue.unshift(queuedMessage);
      } else {
        this.queue.push(queuedMessage);
      }

      this.stats.queueLength = this.queue.length;
      this.processQueue();
    });
  }

  /**
   * Process queue with concurrency control
   */
  private async processQueue() {
    while (
      this.processing.size < this.maxConcurrent &&
      this.queue.length > 0
    ) {
      const item = this.queue.shift();
      if (!item) break;

      this.processing.add(item.id);
      this.stats.processing = this.processing.size;
      this.stats.queueLength = this.queue.length;

      // Calculate wait time
      const waitTime = Date.now() - item.timestamp;
      this.waitTimes.push(waitTime);
      if (this.waitTimes.length > 100) this.waitTimes.shift();
      this.stats.averageWaitTime = this.waitTimes.reduce((a, b) => a + b, 0) / this.waitTimes.length;

      this.processMessage(item);
    }
  }

  /**
   * Process individual message
   */
  private async processMessage(item: QueuedMessage) {
    const startTime = Date.now();

    try {
      // Call actual message processing function
      const result = await this.sendToAI(item.userId, item.message);
      
      // Calculate processing time
      const processingTime = Date.now() - startTime;
      this.processingTimes.push(processingTime);
      if (this.processingTimes.length > 100) this.processingTimes.shift();
      this.stats.averageProcessingTime = this.processingTimes.reduce((a, b) => a + b, 0) / this.processingTimes.length;

      this.stats.processed++;
      item.resolve(result);
    } catch (error) {
      // Retry logic
      if (item.retryCount < this.maxRetries) {
        item.retryCount++;
        console.log(`Retrying message ${item.id}, attempt ${item.retryCount}`);
        
        // Re-add to queue with high priority
        this.queue.unshift(item);
      } else {
        this.stats.failed++;
        item.reject(error);
      }
    } finally {
      this.processing.delete(item.id);
      this.stats.processing = this.processing.size;
      
      // Continue processing queue
      this.processQueue();
    }
  }

  /**
   * Send message to AI - integrate with your existing chat API
   */
  private async sendToAI(userId: string, message: string): Promise<any> {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        userId,
        timestamp: Date.now()
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get queue statistics
   */
  getStats(): QueueStats {
    return { ...this.stats };
  }

  /**
   * Clear queue (emergency use only)
   */
  clear() {
    this.queue.forEach(item => {
      item.reject(new Error('Queue cleared'));
    });
    this.queue = [];
    this.stats.queueLength = 0;
  }

  /**
   * Get queue health status
   */
  getHealthStatus(): 'healthy' | 'degraded' | 'critical' {
    if (this.queue.length > 100 || this.stats.averageWaitTime > 10000) {
      return 'critical';
    }
    if (this.queue.length > 50 || this.stats.averageWaitTime > 5000) {
      return 'degraded';
    }
    return 'healthy';
  }
}

// Global queue instance
export const globalMessageQueue = new MessageQueue(15, 3);

// Initialize queue monitoring
if (typeof window !== 'undefined') {
  setInterval(() => {
    const stats = globalMessageQueue.getStats();
    const health = globalMessageQueue.getHealthStatus();
    
    if (health !== 'healthy') {
      console.warn(`🚨 Queue ${health}:`, stats);
    }
  }, 30000); // Check every 30 seconds
}
