
import SecurityValidator from './security-utils';
import APISecurityManager from './api-security';
import SecurityMonitoring from './security-monitoring';
import { Logger } from '@/utils/logger';

export class SecurityScheduler {
  private static isRunning = false;
  private static intervals: NodeJS.Timeout[] = [];
  
  // Start security maintenance tasks
  static start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    Logger.info('Starting security maintenance scheduler');
    
    // Cleanup expired security data every 5 minutes
    const cleanupInterval = setInterval(() => {
      try {
        SecurityValidator.cleanup();
        APISecurityManager.cleanup();
        Logger.info('Security cleanup completed');
      } catch (error) {
        Logger.error('Security cleanup failed', { error });
      }
    }, 5 * 60 * 1000);
    
    // Generate security reports every hour
    const reportInterval = setInterval(() => {
      try {
        const metrics = SecurityMonitoring.getSecurityMetrics();
        Logger.info('Security metrics', metrics);
        
        // Alert on high activity
        if (metrics.total > 100) {
          Logger.warn('High security event volume detected', metrics);
        }
      } catch (error) {
        Logger.error('Security reporting failed', { error });
      }
    }, 60 * 60 * 1000);
    
    this.intervals = [cleanupInterval, reportInterval];
  }
  
  // Stop security scheduler
  static stop(): void {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
    this.isRunning = false;
    Logger.info('Security scheduler stopped');
  }
  
  // Manual security health check
  static performHealthCheck(): {
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    metrics: any;
  } {
    const issues: string[] = [];
    const metrics = SecurityMonitoring.getSecurityMetrics();
    
    // Check for high error rates
    if (metrics.total > 50) {
      issues.push('High security event volume');
    }
    
    // Check for critical events
    if (metrics.bySeverity.critical > 0) {
      issues.push('Critical security events detected');
    }
    
    // Check for concentrated attacks
    const topIP = metrics.topIPs[0];
    if (topIP && topIP.count > 20) {
      issues.push(`Suspicious activity from ${topIP.ip}`);
    }
    
    const status = issues.length === 0 ? 'healthy' : 
                   metrics.bySeverity.critical > 0 ? 'critical' : 'warning';
    
    return { status, issues, metrics };
  }
}

// Auto-start in production
if (process.env.NODE_ENV === 'production') {
  SecurityScheduler.start();
}

export default SecurityScheduler;
