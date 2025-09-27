// Rate limiting utilities for API protection and scalability

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
}

/**
 * In-memory rate limiter for development and small scale
 */
export class InMemoryRateLimiter {
  private requests = new Map<string, number[]>();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    
    // Clean up old requests every minute
    setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Check if request is allowed
   */
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    
    // Get existing requests for this identifier
    const userRequests = this.requests.get(identifier) || [];
    
    // Filter out requests outside the current window
    const validRequests = userRequests.filter(timestamp => timestamp > windowStart);
    
    // Check if user has exceeded the limit
    if (validRequests.length >= this.config.maxRequests) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }

  /**
   * Get remaining requests for identifier
   */
  getRemaining(identifier: string): number {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    const userRequests = this.requests.get(identifier) || [];
    const validRequests = userRequests.filter(timestamp => timestamp > windowStart);
    
    return Math.max(0, this.config.maxRequests - validRequests.length);
  }

  /**
   * Get time until reset
   */
  getResetTime(identifier: string): number {
    const userRequests = this.requests.get(identifier) || [];
    if (userRequests.length === 0) return 0;
    
    const oldestRequest = Math.min(...userRequests);
    return Math.max(0, oldestRequest + this.config.windowMs - Date.now());
  }

  /**
   * Clean up old requests
   */
  private cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    
    for (const [identifier, requests] of this.requests.entries()) {
      const validRequests = requests.filter(timestamp => timestamp > windowStart);
      
      if (validRequests.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, validRequests);
      }
    }
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      totalIdentifiers: this.requests.size,
      config: this.config
    };
  }
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMIT_CONFIGS = {
  // API endpoints
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 minutes
    message: 'Too many API requests, please try again later.'
  },
  
  // Chat endpoints (more restrictive)
  chat: {
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 20, // 20 messages per minute
    message: 'Too many chat messages, please slow down.'
  },
  
  // Auth endpoints (very restrictive)
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
    message: 'Too many authentication attempts, please try again later.'
  },
  
  // General endpoints
  general: {
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
    message: 'Rate limit exceeded, please try again later.'
  }
};

/**
 * Rate limiter instances
 */
export const rateLimiters = {
  api: new InMemoryRateLimiter(RATE_LIMIT_CONFIGS.api),
  chat: new InMemoryRateLimiter(RATE_LIMIT_CONFIGS.chat),
  auth: new InMemoryRateLimiter(RATE_LIMIT_CONFIGS.auth),
  general: new InMemoryRateLimiter(RATE_LIMIT_CONFIGS.general)
};

/**
 * Helper function to get client identifier
 */
export function getClientIdentifier(req: any): string {
  // Try to get real IP from various headers
  const forwarded = req.headers['x-forwarded-for'];
  const realIp = req.headers['x-real-ip'];
  const clientIp = req.headers['x-client-ip'];
  
  let ip = forwarded || realIp || clientIp || req.connection?.remoteAddress || 'unknown';
  
  // Handle comma-separated IPs (from proxies)
  if (typeof ip === 'string' && ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }
  
  return ip as string;
}

/**
 * Rate limiting middleware function
 */
export function createRateLimitMiddleware(limiterType: keyof typeof rateLimiters) {
  return (req: any, res: any, next: () => void) => {
    const identifier = getClientIdentifier(req);
    const limiter = rateLimiters[limiterType];
    
    if (!limiter.isAllowed(identifier)) {
      const config = RATE_LIMIT_CONFIGS[limiterType];
      res.status(429).json({
        error: config.message,
        retryAfter: Math.ceil(limiter.getResetTime(identifier) / 1000)
      });
      return;
    }
    
    // Add rate limit headers
    const rateLimitConfig = RATE_LIMIT_CONFIGS[limiterType];
    res.setHeader('X-RateLimit-Limit', rateLimitConfig.maxRequests);
    res.setHeader('X-RateLimit-Remaining', limiter.getRemaining(identifier));
    res.setHeader('X-RateLimit-Reset', Math.ceil((Date.now() + limiter.getResetTime(identifier)) / 1000));
    
    next();
  };
}

/**
 * Distributed rate limiting (for production with Redis)
 */
export class DistributedRateLimiter {
  // This would integrate with Redis in production
  // For now, we'll use the in-memory limiter as fallback
  
  constructor(private config: RateLimitConfig) {}
  
  async isAllowed(identifier: string): Promise<boolean> {
    // In production, this would use Redis
    // For now, fallback to in-memory
    const limiter = new InMemoryRateLimiter(this.config);
    return limiter.isAllowed(identifier);
  }
  
  async getRemaining(identifier: string): Promise<number> {
    // Redis implementation would go here
    const limiter = new InMemoryRateLimiter(this.config);
    return limiter.getRemaining(identifier);
  }
}