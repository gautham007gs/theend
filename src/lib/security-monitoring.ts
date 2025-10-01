
import { Logger } from '@/utils/logger';

interface SecurityEvent {
  type: 'rate_limit' | 'sql_injection' | 'xss_attempt' | 'malicious_upload' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  clientIP: string;
  userAgent?: string;
  details: any;
  timestamp: number;
}

export class SecurityMonitoring {
  private static events: SecurityEvent[] = [];
  private static alertThresholds = {
    rate_limit: { count: 5, window: 300000 }, // 5 in 5 minutes
    sql_injection: { count: 1, window: 60000 }, // 1 in 1 minute
    xss_attempt: { count: 1, window: 60000 },
    malicious_upload: { count: 1, window: 60000 },
    suspicious_activity: { count: 10, window: 600000 } // 10 in 10 minutes
  };
  
  // Log security event
  static logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: Date.now()
    };
    
    this.events.push(securityEvent);
    
    // Log to system
    Logger.warn(`Security Event: ${event.type}`, {
      severity: event.severity,
      clientIP: event.clientIP,
      details: event.details
    });
    
    // Check for alert conditions
    this.checkAlertConditions(securityEvent);
    
    // Cleanup old events
    this.cleanupOldEvents();
  }
  
  // Check if alert conditions are met
  private static checkAlertConditions(event: SecurityEvent): void {
    const threshold = this.alertThresholds[event.type];
    if (!threshold) return;
    
    const recentEvents = this.events.filter(e => 
      e.type === event.type &&
      e.clientIP === event.clientIP &&
      Date.now() - e.timestamp < threshold.window
    );
    
    if (recentEvents.length >= threshold.count) {
      this.triggerSecurityAlert(event, recentEvents.length);
    }
  }
  
  // Trigger security alert
  private static triggerSecurityAlert(event: SecurityEvent, eventCount: number): void {
    Logger.error(`SECURITY ALERT: Multiple ${event.type} events`, {
      clientIP: event.clientIP,
      eventCount,
      severity: 'CRITICAL',
      timeWindow: '5 minutes',
      action: 'Consider blocking IP'
    });
    
    // Here you could integrate with external alerting systems
    // like Slack, email, or monitoring services
  }
  
  // Get security metrics
  static getSecurityMetrics(timeWindow: number = 3600000): { // 1 hour default
    total: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    topIPs: Array<{ ip: string; count: number }>;
  } {
    const cutoff = Date.now() - timeWindow;
    const recentEvents = this.events.filter(e => e.timestamp > cutoff);
    
    const byType: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};
    const ipCounts: Record<string, number> = {};
    
    recentEvents.forEach(event => {
      byType[event.type] = (byType[event.type] || 0) + 1;
      bySeverity[event.severity] = (bySeverity[event.severity] || 0) + 1;
      ipCounts[event.clientIP] = (ipCounts[event.clientIP] || 0) + 1;
    });
    
    const topIPs = Object.entries(ipCounts)
      .map(([ip, count]) => ({ ip, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return {
      total: recentEvents.length,
      byType,
      bySeverity,
      topIPs
    };
  }
  
  // Cleanup old events (keep last 24 hours)
  private static cleanupOldEvents(): void {
    const cutoff = Date.now() - (24 * 60 * 60 * 1000);
    this.events = this.events.filter(e => e.timestamp > cutoff);
  }
  
  // Get events for specific IP
  static getEventsByIP(clientIP: string, timeWindow: number = 3600000): SecurityEvent[] {
    const cutoff = Date.now() - timeWindow;
    return this.events.filter(e => 
      e.clientIP === clientIP && e.timestamp > cutoff
    );
  }
  
  // Check if IP should be blocked
  static shouldBlockIP(clientIP: string): boolean {
    const recentEvents = this.getEventsByIP(clientIP, 300000); // 5 minutes
    
    // Block if critical events
    const criticalEvents = recentEvents.filter(e => e.severity === 'critical');
    if (criticalEvents.length > 0) return true;
    
    // Block if too many high severity events
    const highSeverityEvents = recentEvents.filter(e => e.severity === 'high');
    if (highSeverityEvents.length >= 3) return true;
    
    // Block if too many total events
    if (recentEvents.length >= 20) return true;
    
    return false;
  }
}

export default SecurityMonitoring;
