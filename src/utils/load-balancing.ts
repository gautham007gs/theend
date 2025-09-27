// Load balancing utilities for horizontal scaling

interface ServerNode {
  id: string;
  url: string;
  weight: number;
  currentLoad: number;
  isHealthy: boolean;
  lastHealthCheck: number;
}

/**
 * Round-robin load balancer
 */
export class RoundRobinBalancer {
  private servers: ServerNode[] = [];
  private currentIndex = 0;

  constructor(servers: Omit<ServerNode, 'currentLoad' | 'isHealthy' | 'lastHealthCheck'>[]) {
    this.servers = servers.map(server => ({
      ...server,
      currentLoad: 0,
      isHealthy: true,
      lastHealthCheck: Date.now()
    }));
  }

  /**
   * Get next available server
   */
  getNextServer(): ServerNode | null {
    const healthyServers = this.servers.filter(s => s.isHealthy);
    
    if (healthyServers.length === 0) {
      return null;
    }

    const server = healthyServers[this.currentIndex % healthyServers.length];
    this.currentIndex++;
    
    return server;
  }

  /**
   * Mark server as healthy/unhealthy
   */
  setServerHealth(serverId: string, isHealthy: boolean): void {
    const server = this.servers.find(s => s.id === serverId);
    if (server) {
      server.isHealthy = isHealthy;
      server.lastHealthCheck = Date.now();
    }
  }

  /**
   * Update server load
   */
  updateServerLoad(serverId: string, load: number): void {
    const server = this.servers.find(s => s.id === serverId);
    if (server) {
      server.currentLoad = load;
    }
  }

  /**
   * Get server statistics
   */
  getStats() {
    return {
      totalServers: this.servers.length,
      healthyServers: this.servers.filter(s => s.isHealthy).length,
      averageLoad: this.servers.reduce((sum, s) => sum + s.currentLoad, 0) / this.servers.length,
      servers: this.servers.map(s => ({
        id: s.id,
        url: s.url,
        weight: s.weight,
        load: s.currentLoad,
        healthy: s.isHealthy
      }))
    };
  }
}

/**
 * Weighted load balancer based on server capacity
 */
export class WeightedBalancer {
  private servers: ServerNode[] = [];

  constructor(servers: Omit<ServerNode, 'currentLoad' | 'isHealthy' | 'lastHealthCheck'>[]) {
    this.servers = servers.map(server => ({
      ...server,
      currentLoad: 0,
      isHealthy: true,
      lastHealthCheck: Date.now()
    }));
  }

  /**
   * Get server based on weight and current load
   */
  getNextServer(): ServerNode | null {
    const healthyServers = this.servers.filter(s => s.isHealthy);
    
    if (healthyServers.length === 0) {
      return null;
    }

    // Calculate effective weight (weight - current load)
    const serversWithEffectiveWeight = healthyServers.map(server => ({
      server,
      effectiveWeight: Math.max(0, server.weight - server.currentLoad)
    }));

    // Select server with highest effective weight
    let selectedServer = serversWithEffectiveWeight[0];
    for (const item of serversWithEffectiveWeight) {
      if (item.effectiveWeight > selectedServer.effectiveWeight) {
        selectedServer = item;
      }
    }

    return selectedServer.server;
  }

  setServerHealth = (serverId: string, isHealthy: boolean): void => {
    const server = this.servers.find(s => s.id === serverId);
    if (server) {
      server.isHealthy = isHealthy;
      server.lastHealthCheck = Date.now();
    }
  }

  updateServerLoad = (serverId: string, load: number): void => {
    const server = this.servers.find(s => s.id === serverId);
    if (server) {
      server.currentLoad = load;
    }
  }
}

/**
 * Health checker for server nodes
 */
export class HealthChecker {
  private checkInterval: NodeJS.Timeout | null = null;
  private balancer: RoundRobinBalancer | WeightedBalancer;

  constructor(balancer: RoundRobinBalancer | WeightedBalancer) {
    this.balancer = balancer;
  }

  /**
   * Start health monitoring
   */
  startHealthChecks(intervalMs = 30000): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(() => {
      this.performHealthChecks();
    }, intervalMs);

    console.log('🏥 Health checking started');
  }

  /**
   * Stop health monitoring
   */
  stopHealthChecks(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Perform health checks on all servers
   */
  private async performHealthChecks(): Promise<void> {
    const stats = this.balancer.getStats();
    
    for (const server of stats.servers) {
      try {
        // Simple health check - could be enhanced with actual HTTP requests
        const isHealthy = await this.checkServerHealth(server.url);
        this.balancer.setServerHealth(server.id, isHealthy);
      } catch (error) {
        console.warn(`Health check failed for server ${server.id}:`, error);
        this.balancer.setServerHealth(server.id, false);
      }
    }
  }

  /**
   * Check individual server health
   */
  private async checkServerHealth(url: string): Promise<boolean> {
    try {
      // In production, this would make an actual HTTP request
      // For now, return true as a placeholder
      return true;
    } catch (error) {
      return false;
    }
  }
}

/**
 * Request distributor for scaling
 */
export class RequestDistributor {
  private balancer: RoundRobinBalancer | WeightedBalancer;
  private requestQueue: Array<{ id: string; priority: number; handler: () => Promise<any> }> = [];
  private isProcessing = false;

  constructor(balancer: RoundRobinBalancer | WeightedBalancer) {
    this.balancer = balancer;
  }

  /**
   * Add request to queue
   */
  enqueueRequest(
    id: string,
    handler: () => Promise<any>,
    priority = 1
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({
        id,
        priority,
        handler: async () => {
          try {
            const result = await handler();
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }
      });

      // Sort by priority (higher number = higher priority)
      this.requestQueue.sort((a, b) => b.priority - a.priority);

      // Start processing if not already running
      if (!this.isProcessing) {
        this.processQueue();
      }
    });
  }

  /**
   * Process request queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (!request) break;

      try {
        const server = this.balancer.getNextServer();
        if (server) {
          // Update server load
          this.balancer.updateServerLoad(server.id, server.currentLoad + 1);
          
          // Execute request
          await request.handler();
          
          // Decrease server load
          this.balancer.updateServerLoad(server.id, Math.max(0, server.currentLoad - 1));
        } else {
          console.warn('No healthy servers available for request:', request.id);
          // Retry later
          this.requestQueue.unshift(request);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error('Request processing failed:', error);
      }
    }

    this.isProcessing = false;
  }

  /**
   * Get queue statistics
   */
  getQueueStats() {
    return {
      queueLength: this.requestQueue.length,
      isProcessing: this.isProcessing,
      balancerStats: this.balancer.getStats()
    };
  }
}