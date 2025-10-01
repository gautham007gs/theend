/**
 * Secure Admin Session Management
 * Provides cryptographically secure session handling for admin routes
 */

import { NextRequest, NextResponse } from 'next/server';

// Session structure
export interface AdminSession {
  userId: string;
  email: string;
  role: 'admin';
  issuedAt: number;
  expiresAt: number;
}

// In-memory session store (in production, use Redis or database)
const activeSessions = new Map<string, AdminSession>();

// Session configuration
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const COOKIE_NAME = 'admin_session';

/**
 * Generate a cryptographically secure session ID
 */
export function generateSessionId(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Create a new admin session
 */
export function createAdminSession(userId: string, email: string): { sessionId: string; session: AdminSession } {
  const now = Date.now();
  const sessionId = generateSessionId();
  
  const session: AdminSession = {
    userId,
    email,
    role: 'admin',
    issuedAt: now,
    expiresAt: now + SESSION_DURATION
  };
  
  activeSessions.set(sessionId, session);
  
  console.log(`✅ Admin session created for: ${email}`);
  return { sessionId, session };
}

/**
 * Validate an admin session
 */
export function validateAdminSession(sessionId: string): { valid: boolean; session?: AdminSession; reason?: string } {
  if (!sessionId || sessionId.length === 0) {
    return { valid: false, reason: 'No session ID provided' };
  }
  
  const session = activeSessions.get(sessionId);
  
  if (!session) {
    return { valid: false, reason: 'Session not found' };
  }
  
  // Check expiration
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(sessionId);
    return { valid: false, reason: 'Session expired' };
  }
  
  return { valid: true, session };
}

/**
 * Destroy an admin session
 */
export function destroyAdminSession(sessionId: string): boolean {
  return activeSessions.delete(sessionId);
}

/**
 * Clean up expired sessions
 */
export function cleanupExpiredSessions(): void {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [sessionId, session] of activeSessions.entries()) {
    if (now > session.expiresAt) {
      activeSessions.delete(sessionId);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    console.log(`🧹 Cleaned up ${cleaned} expired admin sessions`);
  }
}

/**
 * Extract session ID from request
 */
export function extractSessionId(request: NextRequest): string | null {
  // Check cookie
  const cookie = request.cookies.get(COOKIE_NAME);
  if (cookie) {
    return cookie.value;
  }
  
  // Check Authorization header as fallback
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
}

/**
 * Set session cookie in response
 */
export function setSessionCookie(response: NextResponse, sessionId: string): void {
  const isProduction = process.env.NODE_ENV === 'production';
  
  console.log(`🍪 Setting session cookie: ${COOKIE_NAME} = ${sessionId.substring(0, 8)}...`);
  console.log(`🍪 Cookie settings: httpOnly=true, secure=${isProduction}, sameSite=lax, maxAge=${SESSION_DURATION / 1000}s, path=/`);
  
  // Set secure cookie with explicit domain for Replit
  const cookieOptions: any = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/'
  };
  
  // For development on Replit, don't set secure flag
  if (process.env.NODE_ENV === 'development') {
    cookieOptions.secure = false;
  }
  
  response.cookies.set(COOKIE_NAME, sessionId, cookieOptions);
  
  // Also set a backup header for debugging
  response.headers.set('X-Session-Set', sessionId.substring(0, 8) + '...');
}

/**
 * Clear session cookie
 */
export function clearSessionCookie(response: NextResponse): void {
  response.cookies.delete(COOKIE_NAME);
}

// Start cleanup interval
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredSessions, 60 * 60 * 1000); // Every hour
}

export default {
  COOKIE_NAME,
  generateSessionId,
  createAdminSession,
  validateAdminSession,
  destroyAdminSession,
  extractSessionId,
  setSessionCookie,
  clearSessionCookie,
  cleanupExpiredSessions
};
