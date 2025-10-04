
import { Logger } from '@/utils/logger';

interface RateLimitViolation {
  ip: string;
  timestamp: number;
  endpoint: string;
  violationType: 'burst' | 'limit' | 'penalty';
  count: number;
  penalties: number;
}

export class RateLimitMonitor {
  private static violations: RateLimitViolation[] = [];
  private static maxViolations = 1000; // Keep last 1000 violations
  
  // Log a rate limit violation
  static logViolation(
    ip: string, 
    endpoint: string, 
    violationType: 'burst' | 'limit' | 'penalty',
    count: number,
    penalties: number
  ): void {
    const violation: RateLimitViolation = {
      ip,
      timestamp: Date.now(),
      endpoint,
      violationType,
      count,
      penalties
    };
    
    this.violations.push(violation);
    
    // Keep only recent violations
    if (this.violations.length > this.maxViolations) {
      this.violations = this.violations.slice(-this.maxViolations);
    }
    
    // Log critical violations
    if (penalties > 5) {
      Logger.error(`[RATE-LIMIT] Critical violation from IP ${ip}`, {
        endpoint,
        violationType,
        count,
        penalties
      });
    }
  }
  
  // Get violations summary
  static getSummary(timeWindow: number = 3600000): {
    totalViolations: number;
    uniqueIPs: number;
    topOffenders: Array<{ ip: string; count: number }>;
    byType: Record<string, number>;
  } {
    const cutoff = Date.now() - timeWindow;
    const recentViolations = this.violations.filter(v => v.timestamp > cutoff);
    
    const ipCounts: Record<string, number> = {};
    const typeCounts: Record<string, number> = {};
    
    recentViolations.forEach(v => {
      ipCounts[v.ip] = (ipCounts[v.ip] || 0) + 1;
      typeCounts[v.violationType] = (typeCounts[v.violationType] || 0) + 1;
    });
    
    const topOffenders = Object.entries(ipCounts)
      .map(([ip, count]) => ({ ip, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return {
      totalViolations: recentViolations.length,
      uniqueIPs: Object.keys(ipCounts).length,
      topOffenders,
      byType: typeCounts
    };
  }
  
  // Check if IP should be blocked
  static shouldBlockIP(ip: string, threshold: number = 10): boolean {
    const recentViolations = this.violations.filter(
      v => v.ip === ip && Date.now() - v.timestamp < 300000 // 5 minutes
    );
    return recentViolations.length >= threshold;
  }
  
  // Get violations for specific IP
  static getIPViolations(ip: string, timeWindow: number = 3600000): RateLimitViolation[] {
    const cutoff = Date.now() - timeWindow;
    return this.violations.filter(v => v.ip === ip && v.timestamp > cutoff);
  }
  
  // Clear old violations
  static cleanup(): void {
    const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
    this.violations = this.violations.filter(v => v.timestamp > cutoff);
  }
}

export default RateLimitMonitor;
