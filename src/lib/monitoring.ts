
interface HealthMetrics {
  responseTime: number;
  errorRate: number;
  activeUsers: number;
  memoryUsage: number;
  cpuUsage: number;
}

class HealthMonitor {
  private static instance: HealthMonitor;
  private metrics: HealthMetrics = {
    responseTime: 0,
    errorRate: 0,
    activeUsers: 0,
    memoryUsage: 0,
    cpuUsage: 0
  };
  
  static getInstance(): HealthMonitor {
    if (!HealthMonitor.instance) {
      HealthMonitor.instance = new HealthMonitor();
    }
    return HealthMonitor.instance;
  }

  updateMetrics(newMetrics: Partial<HealthMetrics>): void {
    this.metrics = { ...this.metrics, ...newMetrics };
    
    // Alert if critical thresholds exceeded
    if (this.metrics.responseTime > 5000) {
      console.error('ALERT: High response time detected:', this.metrics.responseTime);
    }
    
    if (this.metrics.errorRate > 0.05) { // 5% error rate
      console.error('ALERT: High error rate detected:', this.metrics.errorRate);
    }
    
    if (this.metrics.memoryUsage > 80) { // 80% memory usage
      console.warn('WARNING: High memory usage:', this.metrics.memoryUsage);
    }
  }

  getHealthStatus(): 'healthy' | 'warning' | 'critical' {
    if (this.metrics.responseTime > 5000 || this.metrics.errorRate > 0.1) {
      return 'critical';
    }
    
    if (this.metrics.responseTime > 2000 || this.metrics.errorRate > 0.05) {
      return 'warning';
    }
    
    return 'healthy';
  }

  getMetrics(): HealthMetrics {
    return { ...this.metrics };
  }
}

export const healthMonitor = HealthMonitor.getInstance();
