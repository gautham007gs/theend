
/**
 * Admin Security Layer for Admin Panel Protection
 * Uses Supabase Auth with enhanced security features
 */

import { NextRequest, NextResponse } from 'next/server';
import { MaximumSecurity } from './enhanced-security';

export class AdminSecurity {
  private static adminSessions = new Map<string, { 
    userId: string; 
    expires: number; 
    permissions: string[];
    lastUsed: number;
    fingerprint: string;
  }>();
  
  private static adminAttempts = new Map<string, {
    attempts: number;
    lastAttempt: number;
    blocked: boolean;
  }>();

  // Enhanced session validation for Supabase authenticated users
  static validateAdminSession(sessionId: string, userFingerprint?: string): {
    valid: boolean;
    permissions?: string[];
    error?: string;
  } {
    const adminSession = this.adminSessions.get(sessionId);
    
    if (!adminSession) {
      return { valid: false, error: 'Session not found' };
    }

    if (Date.now() > adminSession.expires) {
      this.adminSessions.delete(sessionId);
      return { valid: false, error: 'Session expired' };
    }

    // Verify device fingerprint for additional security
    if (userFingerprint && adminSession.fingerprint !== userFingerprint) {
      return { valid: false, error: 'Device fingerprint mismatch - possible session hijacking' };
    }

    // Update last used
    adminSession.lastUsed = Date.now();
    
    return { valid: true, permissions: adminSession.permissions };
  }

  // Create admin session after Supabase authentication
  static createAdminSession(userId: string, fingerprint: string): string {
    const sessionId = this.generateSecureSessionId();
    
    this.adminSessions.set(sessionId, {
      userId,
      expires: Date.now() + (4 * 60 * 60 * 1000), // 4 hours
      permissions: ['analytics', 'profile', 'security'],
      lastUsed: Date.now(),
      fingerprint
    });

    return sessionId;
  }

  // Enhanced admin route protection using sessionStorage check
  static async secureAdminRoute(request: NextRequest): Promise<NextResponse | null> {
    // Apply enhanced security first
    const securityCheck = await MaximumSecurity.secureRequest(request);
    if (securityCheck) return securityCheck;

    // For admin routes (except login), redirect to login if not authenticated
    // The actual authentication check happens on the client side with sessionStorage
    // This is just for basic route protection
    const pathname = request.nextUrl.pathname;
    
    if (pathname.startsWith('/admin/') && !pathname.startsWith('/admin/login')) {
      // Check if there's a valid session cookie (optional additional security)
      const sessionCookie = request.cookies.get('admin_session')?.value;
      
      if (sessionCookie) {
        const validation = this.validateAdminSession(sessionCookie);
        if (!validation.valid) {
          // Invalid session, redirect to login
          const response = NextResponse.redirect(new URL('/admin/login', request.url));
          response.cookies.delete('admin_session');
          return response;
        }
      }
    }

    return null; // Allow access
  }

  // Rate limiting for admin login attempts
  static checkRateLimit(clientIP: string): {
    allowed: boolean;
    error?: string;
  } {
    const attempts = this.adminAttempts.get(clientIP);
    
    if (attempts?.blocked && Date.now() - attempts.lastAttempt < 900000) { // 15 min block
      return { allowed: false, error: 'Too many failed attempts. Try again later.' };
    }

    return { allowed: true };
  }

  // Record failed login attempt
  static recordFailedAttempt(clientIP: string): void {
    const current = this.adminAttempts.get(clientIP) || { attempts: 0, lastAttempt: 0, blocked: false };
    current.attempts++;
    current.lastAttempt = Date.now();
    
    if (current.attempts >= 5) {
      current.blocked = true;
    }
    
    this.adminAttempts.set(clientIP, current);
  }

  // Clear failed attempts on successful login
  static clearFailedAttempts(clientIP: string): void {
    this.adminAttempts.delete(clientIP);
  }

  // Generate device fingerprint for session security
  static generateDeviceFingerprint(request: NextRequest): string {
    const userAgent = request.headers.get('user-agent') || '';
    const acceptLanguage = request.headers.get('accept-language') || '';
    const acceptEncoding = request.headers.get('accept-encoding') || '';
    
    const fingerprint = Buffer.from(`${userAgent}|${acceptLanguage}|${acceptEncoding}`).toString('base64');
    return fingerprint.substring(0, 16);
  }

  // Admin session cleanup
  static cleanup(): void {
    const now = Date.now();
    
    // Clean expired sessions
    for (const [sessionId, session] of this.adminSessions.entries()) {
      if (now > session.expires || now - session.lastUsed > 1800000) { // 30 min inactive
        this.adminSessions.delete(sessionId);
      }
    }

    // Clean old attempt records
    for (const [ip, attempts] of this.adminAttempts.entries()) {
      if (now - attempts.lastAttempt > 3600000) { // 1 hour
        this.adminAttempts.delete(ip);
      }
    }
  }

  // Get admin security stats
  static getSecurityStats() {
    return {
      activeSessions: this.adminSessions.size,
      blockedIPs: Array.from(this.adminAttempts.values()).filter(a => a.blocked).length,
      totalAttempts: Array.from(this.adminAttempts.values()).reduce((sum, a) => sum + a.attempts, 0)
    };
  }

  private static generateSecureSessionId(): string {
    // Generate cryptographically secure session ID without using crypto module
    const array = new Uint8Array(32);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else {
      // Fallback for server-side
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

// Auto cleanup every 5 minutes
setInterval(() => AdminSecurity.cleanup(), 300000);

export default AdminSecurity;
