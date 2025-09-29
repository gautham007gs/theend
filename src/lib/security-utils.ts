
// Security utilities for input validation and protection

export class SecurityValidator {
  // Rate limiting for messages
  private static messageRateLimit = new Map<string, number[]>();
  
  static validateMessageInput(message: string, userId: string = 'anonymous'): {
    isValid: boolean;
    reason?: string;
    sanitized?: string;
  } {
    // Rate limiting check
    if (!this.checkRateLimit(userId)) {
      return { isValid: false, reason: 'Rate limit exceeded. Please slow down.' };
    }
    
    // Length validation
    if (message.length > 2000) {
      return { isValid: false, reason: 'Message too long. Maximum 2000 characters.' };
    }
    
    if (message.trim().length === 0) {
      return { isValid: false, reason: 'Message cannot be empty.' };
    }
    
    // XSS protection
    const sanitized = this.sanitizeInput(message);
    
    // Spam detection
    if (this.detectSpam(sanitized)) {
      return { isValid: false, reason: 'Message appears to be spam.' };
    }
    
    // Inappropriate content basic filtering
    if (this.containsInappropriateContent(sanitized)) {
      return { isValid: false, reason: 'Message contains inappropriate content.' };
    }
    
    return { isValid: true, sanitized };
  }
  
  private static checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const userLimits = this.messageRateLimit.get(userId) || [];
    
    // Remove old timestamps (older than 1 minute)
    const recentLimits = userLimits.filter(timestamp => now - timestamp < 60000);
    
    // Allow max 30 messages per minute
    if (recentLimits.length >= 30) {
      return false;
    }
    
    recentLimits.push(now);
    this.messageRateLimit.set(userId, recentLimits);
    return true;
  }
  
  private static sanitizeInput(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .trim();
  }
  
  private static detectSpam(message: string): boolean {
    const spamPatterns = [
      /(.)\1{10,}/i, // Repeated characters
      /https?:\/\/[^\s]+/gi, // Multiple URLs
      /\b(buy now|click here|free money|earn \$|lottery|winner)\b/gi
    ];
    
    return spamPatterns.some(pattern => pattern.test(message));
  }
  
  private static containsInappropriateContent(message: string): boolean {
    // Basic inappropriate content detection
    const inappropriatePatterns = [
      /\b(fuck|shit|bitch|damn)\b/gi,
      // Add more patterns as needed but keep it reasonable for AI girlfriend context
    ];
    
    return inappropriatePatterns.some(pattern => pattern.test(message));
  }
  
  // Validate image uploads
  static validateImageUpload(file: File): { isValid: boolean; reason?: string } {
    // File size check (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { isValid: false, reason: 'Image too large. Maximum size is 5MB.' };
    }
    
    // File type check
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, reason: 'Invalid file type. Only JPEG, PNG, and WebP allowed.' };
    }
    
    return { isValid: true };
  }
  
  // CSRF token generation
  static generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
  // Validate CSRF token
  static validateCSRFToken(token: string, expectedToken: string): boolean {
    return token === expectedToken && token.length === 64;
  }
}

export default SecurityValidator;
