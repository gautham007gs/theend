
import crypto from 'crypto';

// Comprehensive security utilities for enterprise-grade protection
export class SecurityValidator {
  // Rate limiting for messages with adaptive throttling
  private static messageRateLimit = new Map<string, number[]>();
  private static suspiciousIPs = new Map<string, { attempts: number; lastAttempt: number }>();
  private static blockedIPs = new Set<string>();
  
  // SQL injection patterns
  private static sqlInjectionPatterns = [
    /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/gi,
    /(--|\*\/|\/\*|;|'|"|`)/gi,
    /(\bor\b.*\b1\b.*=.*\b1\b)/gi,
    /(\band\b.*\b1\b.*=.*\b1\b)/gi
  ];

  // XSS patterns
  private static xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /<object[^>]*>.*?<\/object>/gi,
    /<embed[^>]*>/gi,
    /expression\s*\(/gi,
    /vbscript:/gi
  ];

  // Advanced input validation with security layers
  static validateMessageInput(message: string, userId: string = 'anonymous', clientIP?: string): {
    isValid: boolean;
    reason?: string;
    sanitized?: string;
    securityLevel?: 'safe' | 'suspicious' | 'blocked';
  } {
    // Check if IP is blocked
    if (clientIP && this.blockedIPs.has(clientIP)) {
      return { isValid: false, reason: 'Access denied.', securityLevel: 'blocked' };
    }

    // Rate limiting with progressive penalties
    if (!this.checkRateLimit(userId, clientIP)) {
      return { isValid: false, reason: 'Rate limit exceeded. Please slow down.', securityLevel: 'suspicious' };
    }
    
    // Basic validation
    if (message.length > 2000) {
      this.flagSuspiciousActivity(clientIP);
      return { isValid: false, reason: 'Message too long. Maximum 2000 characters.' };
    }
    
    if (message.trim().length === 0) {
      return { isValid: false, reason: 'Message cannot be empty.' };
    }

    // Security threat detection
    if (this.detectSQLInjection(message)) {
      this.flagSuspiciousActivity(clientIP, 'sql_injection');
      return { isValid: false, reason: 'Invalid input detected.', securityLevel: 'blocked' };
    }

    if (this.detectXSSAttempt(message)) {
      this.flagSuspiciousActivity(clientIP, 'xss_attempt');
      return { isValid: false, reason: 'Invalid input detected.', securityLevel: 'blocked' };
    }

    // Advanced sanitization
    const sanitized = this.advancedSanitization(message);
    
    // Spam and content validation
    if (this.detectAdvancedSpam(sanitized)) {
      this.flagSuspiciousActivity(clientIP);
      return { isValid: false, reason: 'Message appears to be spam.', securityLevel: 'suspicious' };
    }
    
    // Content filtering
    if (this.containsInappropriateContent(sanitized)) {
      return { isValid: false, reason: 'Message contains inappropriate content.' };
    }
    
    return { isValid: true, sanitized, securityLevel: 'safe' };
  }

  // Enhanced rate limiting with IP tracking
  private static checkRateLimit(userId: string, clientIP?: string): boolean {
    const now = Date.now();
    const userLimits = this.messageRateLimit.get(userId) || [];
    
    // Clean old entries
    const recentLimits = userLimits.filter(timestamp => now - timestamp < 60000);
    
    // Check for suspicious IP activity
    if (clientIP && this.suspiciousIPs.has(clientIP)) {
      const suspiciousData = this.suspiciousIPs.get(clientIP)!;
      if (suspiciousData.attempts > 10 && now - suspiciousData.lastAttempt < 300000) { // 5 min cooldown
        return false;
      }
    }
    
    // Adaptive rate limiting based on suspicion level
    const maxRequests = this.suspiciousIPs.has(clientIP || userId) ? 15 : 30;
    
    if (recentLimits.length >= maxRequests) {
      this.flagSuspiciousActivity(clientIP);
      return false;
    }
    
    recentLimits.push(now);
    this.messageRateLimit.set(userId, recentLimits);
    return true;
  }

  // SQL injection detection
  private static detectSQLInjection(input: string): boolean {
    return this.sqlInjectionPatterns.some(pattern => pattern.test(input));
  }

  // XSS attempt detection
  private static detectXSSAttempt(input: string): boolean {
    return this.xssPatterns.some(pattern => pattern.test(input));
  }

  // Advanced sanitization with multiple layers
  private static advancedSanitization(input: string): string {
    return input
      // HTML entity encoding
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      // Remove potential script injections
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      // Clean up whitespace and control characters
      .replace(/[\x00-\x1F\x7F]/g, '')
      .trim();
  }

  // Enhanced spam detection with AI-like patterns
  private static detectAdvancedSpam(message: string): boolean {
    const spamPatterns = [
      /(.)\1{10,}/i, // Repeated characters
      /https?:\/\/[^\s]+/gi, // URLs
      /\b(buy now|click here|free money|earn \$|lottery|winner|viagra|casino)\b/gi,
      /[^\w\s]{5,}/gi, // Too many special characters
      /\b\d{4,}\b.*\b\d{4,}\b/gi, // Multiple long numbers (phone/credit card patterns)
    ];
    
    return spamPatterns.some(pattern => pattern.test(message));
  }

  // Content filtering (keeping it reasonable for AI girlfriend context)
  private static containsInappropriateContent(message: string): boolean {
    const inappropriatePatterns = [
      /\b(explicit_violent_content|extreme_profanity)\b/gi,
      // Keep minimal for AI girlfriend context - most content should be allowed
    ];
    
    return inappropriatePatterns.some(pattern => pattern.test(message));
  }

  // Flag suspicious activity for monitoring
  private static flagSuspiciousActivity(clientIP?: string, type: string = 'general'): void {
    if (!clientIP) return;
    
    const current = this.suspiciousIPs.get(clientIP) || { attempts: 0, lastAttempt: 0 };
    current.attempts += type === 'sql_injection' || type === 'xss_attempt' ? 5 : 1;
    current.lastAttempt = Date.now();
    
    this.suspiciousIPs.set(clientIP, current);
    
    // Auto-block after severe violations
    if (current.attempts > 20 || (type === 'sql_injection' || type === 'xss_attempt')) {
      this.blockedIPs.add(clientIP);
    }
  }

  // Enhanced file upload validation
  static validateFileUpload(file: File, allowedTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']): { 
    isValid: boolean; 
    reason?: string; 
    securityLevel?: string;
  } {
    // File size check (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { isValid: false, reason: 'File too large. Maximum size is 5MB.' };
    }
    
    // File type validation
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, reason: 'Invalid file type.', securityLevel: 'suspicious' };
    }
    
    // File name validation
    if (!/^[a-zA-Z0-9._-]+$/.test(file.name)) {
      return { isValid: false, reason: 'Invalid file name characters.', securityLevel: 'suspicious' };
    }
    
    // Check for double extensions (potential malware)
    if ((file.name.match(/\./g) || []).length > 1) {
      return { isValid: false, reason: 'Invalid file format.', securityLevel: 'blocked' };
    }
    
    return { isValid: true, securityLevel: 'safe' };
  }

  // Secure CSRF token generation
  static generateCSRFToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Constant-time CSRF token validation
  static validateCSRFToken(token: string, expectedToken: string): boolean {
    if (token.length !== expectedToken.length) return false;
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expectedToken));
  }

  // API key validation
  static validateAPIKey(apiKey: string): boolean {
    const apiKeyPattern = /^[a-zA-Z0-9_-]{32,128}$/;
    return apiKeyPattern.test(apiKey);
  }

  // Password strength validation
  static validatePasswordStrength(password: string): { 
    isValid: boolean; 
    score: number; 
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;
    
    if (password.length >= 8) score += 1;
    else feedback.push('Password must be at least 8 characters');
    
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Include lowercase letters');
    
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Include uppercase letters');
    
    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('Include numbers');
    
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    else feedback.push('Include special characters');
    
    return {
      isValid: score >= 4,
      score,
      feedback
    };
  }

  // Clean up expired entries
  static cleanup(): void {
    const now = Date.now();
    
    // Clean rate limits
    for (const [key, timestamps] of this.messageRateLimit.entries()) {
      const recent = timestamps.filter(t => now - t < 300000); // 5 min
      if (recent.length === 0) {
        this.messageRateLimit.delete(key);
      } else {
        this.messageRateLimit.set(key, recent);
      }
    }
    
    // Clean suspicious IPs
    for (const [ip, data] of this.suspiciousIPs.entries()) {
      if (now - data.lastAttempt > 3600000) { // 1 hour
        this.suspiciousIPs.delete(ip);
      }
    }
  }
}

export default SecurityValidator;
