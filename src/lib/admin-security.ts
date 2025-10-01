
/**
 * Admin Security Layer for Admin Panel Protection
 * Adds authentication and authorization for admin routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { MaximumSecurity } from './enhanced-security';
import crypto from 'crypto';

export class AdminSecurity {
  private static adminTokens = new Map<string, { 
    userId: string; 
    expires: number; 
    permissions: string[];
    lastUsed: number;
  }>();
  
  private static adminAttempts = new Map<string, {
    attempts: number;
    lastAttempt: number;
    blocked: boolean;
  }>();

  // Secure admin login with rate limiting
  static async authenticateAdmin(password: string, clientIP: string): Promise<{
    success: boolean;
    token?: string;
    error?: string;
  }> {
    // Check if IP is blocked from too many attempts
    const attempts = this.adminAttempts.get(clientIP);
    if (attempts?.blocked && Date.now() - attempts.lastAttempt < 900000) { // 15 min block
      return { success: false, error: 'Too many failed attempts. Try again later.' };
    }

    // Verify password (use environment variable for production)
    const adminPassword = process.env.ADMIN_PASSWORD || 'change-this-in-production';
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    const expectedHash = crypto.createHash('sha256').update(adminPassword).digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(hashedPassword), Buffer.from(expectedHash))) {
      // Record failed attempt
      const current = this.adminAttempts.get(clientIP) || { attempts: 0, lastAttempt: 0, blocked: false };
      current.attempts++;
      current.lastAttempt = Date.now();
      
      if (current.attempts >= 5) {
        current.blocked = true;
      }
      
      this.adminAttempts.set(clientIP, current);
      return { success: false, error: 'Invalid credentials' };
    }

    // Generate secure admin token
    const token = crypto.randomBytes(32).toString('hex');
    this.adminTokens.set(token, {
      userId: 'admin',
      expires: Date.now() + (4 * 60 * 60 * 1000), // 4 hours
      permissions: ['analytics', 'profile', 'security'],
      lastUsed: Date.now()
    });

    // Clear failed attempts on successful login
    this.adminAttempts.delete(clientIP);

    return { success: true, token };
  }

  // Validate admin token
  static validateAdminToken(token: string): {
    valid: boolean;
    permissions?: string[];
    error?: string;
  } {
    const adminSession = this.adminTokens.get(token);
    
    if (!adminSession) {
      return { valid: false, error: 'Invalid token' };
    }

    if (Date.now() > adminSession.expires) {
      this.adminTokens.delete(token);
      return { valid: false, error: 'Token expired' };
    }

    // Update last used
    adminSession.lastUsed = Date.now();
    
    return { valid: true, permissions: adminSession.permissions };
  }

  // Secure admin middleware
  static async secureAdminRoute(request: NextRequest): Promise<NextResponse | null> {
    // Apply enhanced security first
    const securityCheck = await MaximumSecurity.secureRequest(request);
    if (securityCheck) return securityCheck;

    // Check for admin token
    const authHeader = request.headers.get('authorization');
    const tokenCookie = request.cookies.get('admin_token')?.value;
    
    const token = authHeader?.replace('Bearer ', '') || tokenCookie;
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const validation = this.validateAdminToken(token);
    if (!validation.valid) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return null; // Allow access
  }

  // Admin session cleanup
  static cleanup(): void {
    const now = Date.now();
    
    // Clean expired tokens
    for (const [token, session] of this.adminTokens.entries()) {
      if (now > session.expires || now - session.lastUsed > 1800000) { // 30 min inactive
        this.adminTokens.delete(token);
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
      activeSessions: this.adminTokens.size,
      blockedIPs: Array.from(this.adminAttempts.values()).filter(a => a.blocked).length,
      totalAttempts: Array.from(this.adminAttempts.values()).reduce((sum, a) => sum + a.attempts, 0)
    };
  }
}

// Auto cleanup every 5 minutes
setInterval(() => AdminSecurity.cleanup(), 300000);

export default AdminSecurity;
