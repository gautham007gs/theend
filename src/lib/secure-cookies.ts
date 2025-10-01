/**
 * Secure Cookie Management for Maximum Protection
 * Protects against: Cookie hijacking, Session fixation, XSS cookie theft
 */

import { NextResponse } from 'next/server';
import crypto from 'crypto';

export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  maxAge?: number;
  path?: string;
  domain?: string;
  signed?: boolean;
}

export class SecureCookieManager {
  private static secret = process.env.COOKIE_SECRET || 'ultra-secure-cookie-secret-change-in-production-asap';
  
  /**
   * Get ultra-secure cookie options
   */
  static getSecureOptions(overrides?: Partial<CookieOptions>): CookieOptions {
    const isProduction = process.env.NODE_ENV === 'production';
    
    return {
      httpOnly: true, // Prevent JavaScript access (XSS protection)
      secure: isProduction, // HTTPS only in production
      sameSite: 'strict', // Strong CSRF protection
      maxAge: 86400, // 24 hours default
      path: '/',
      ...overrides
    };
  }
  
  /**
   * Sign a cookie value to prevent tampering
   */
  static sign(value: string): string {
    const signature = crypto
      .createHmac('sha256', this.secret)
      .update(value)
      .digest('hex');
    
    return `${value}.${signature}`;
  }
  
  /**
   * Verify and unsign a cookie value
   */
  static unsign(signedValue: string): string | null {
    const parts = signedValue.split('.');
    if (parts.length !== 2) return null;
    
    const [value, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', this.secret)
      .update(value)
      .digest('hex');
    
    // Use timing-safe comparison to prevent timing attacks
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }
    
    return value;
  }
  
  /**
   * Set a secure cookie
   */
  static setCookie(
    response: NextResponse,
    name: string,
    value: string,
    options?: Partial<CookieOptions>
  ): void {
    const secureOptions = this.getSecureOptions(options);
    const signedValue = secureOptions.signed !== false ? this.sign(value) : value;
    
    const cookieString = this.buildCookieString(name, signedValue, secureOptions);
    response.headers.append('Set-Cookie', cookieString);
  }
  
  /**
   * Build cookie string with all security options
   */
  private static buildCookieString(name: string, value: string, options: CookieOptions): string {
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    
    if (options.maxAge) {
      cookie += `; Max-Age=${options.maxAge}`;
    }
    
    if (options.path) {
      cookie += `; Path=${options.path}`;
    }
    
    if (options.domain) {
      cookie += `; Domain=${options.domain}`;
    }
    
    if (options.httpOnly) {
      cookie += '; HttpOnly';
    }
    
    if (options.secure) {
      cookie += '; Secure';
    }
    
    if (options.sameSite) {
      cookie += `; SameSite=${options.sameSite.charAt(0).toUpperCase() + options.sameSite.slice(1)}`;
    }
    
    return cookie;
  }
  
  /**
   * Generate secure session ID
   */
  static generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex');
  }
  
  /**
   * Generate CSRF token
   */
  static generateCSRFToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
  
  /**
   * Validate CSRF token
   */
  static validateCSRFToken(token: string, expectedToken: string): boolean {
    if (!token || !expectedToken) return false;
    if (token.length !== expectedToken.length) return false;
    
    // Timing-safe comparison
    return crypto.timingSafeEqual(
      Buffer.from(token),
      Buffer.from(expectedToken)
    );
  }
  
  /**
   * Clear a cookie securely
   */
  static clearCookie(response: NextResponse, name: string, options?: Partial<CookieOptions>): void {
    const secureOptions = this.getSecureOptions({
      ...options,
      maxAge: 0
    });
    
    const cookieString = this.buildCookieString(name, '', secureOptions);
    response.headers.append('Set-Cookie', cookieString);
  }
  
  /**
   * Rotate session (prevent session fixation attacks)
   */
  static rotateSession(oldSessionId: string): string {
    // Generate new session ID
    const newSessionId = this.generateSessionId();
    
    // Log rotation for security audit
    console.log(`🔄 Session rotated: ${oldSessionId.substring(0, 8)}... → ${newSessionId.substring(0, 8)}...`);
    
    return newSessionId;
  }
}

export default SecureCookieManager;
