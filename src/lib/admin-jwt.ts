/**
 * Secure JWT-based Admin Authentication
 * Edge Runtime compatible using Web Crypto API
 * Stateless authentication - no session store needed
 */

import { NextRequest, NextResponse } from 'next/server';

// JWT payload structure
export interface AdminJWTPayload {
  userId: string;
  email: string;
  role: 'admin';
  iat: number;
  exp: number;
}

const COOKIE_NAME = 'admin_session';
const JWT_EXPIRY = 24 * 60 * 60; // 24 hours in seconds

/**
 * Get the JWT secret from environment
 */
function getJWTSecret(): string {
  const secret = process.env.COOKIE_SECRET || process.env.JWT_SECRET || 'dev-secret-change-in-production';
  
  if (secret === 'dev-secret-change-in-production' && process.env.NODE_ENV === 'production') {
    console.error('⚠️ CRITICAL: Using default JWT secret in production! Set COOKIE_SECRET env variable!');
  }
  
  return secret;
}

/**
 * Base64 URL encode (safe for URLs)
 */
function base64urlEncode(data: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...data));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Base64 URL decode
 */
function base64urlDecode(str: string): Uint8Array {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Create HMAC-SHA256 signature using Web Crypto API (Edge compatible)
 */
async function createSignature(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(data)
  );
  
  return base64urlEncode(new Uint8Array(signature));
}

/**
 * Verify HMAC-SHA256 signature using Web Crypto API (Edge compatible)
 */
async function verifySignature(data: string, signature: string, secret: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    const signatureBytes = base64urlDecode(signature);
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes as BufferSource,
      encoder.encode(data)
    );
    
    return isValid;
  } catch {
    return false;
  }
}

/**
 * Create a signed JWT token
 */
export async function createAdminJWT(userId: string, email: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const payload: AdminJWTPayload = {
    userId,
    email,
    role: 'admin',
    iat: now,
    exp: now + JWT_EXPIRY
  };
  
  const encoder = new TextEncoder();
  const headerB64 = base64urlEncode(encoder.encode(JSON.stringify(header)));
  const payloadB64 = base64urlEncode(encoder.encode(JSON.stringify(payload)));
  
  const data = `${headerB64}.${payloadB64}`;
  const signature = await createSignature(data, getJWTSecret());
  
  return `${data}.${signature}`;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyAdminJWT(token: string): Promise<{ valid: boolean; payload?: AdminJWTPayload; reason?: string }> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, reason: 'Invalid token format' };
    }
    
    const [headerB64, payloadB64, signature] = parts;
    const data = `${headerB64}.${payloadB64}`;
    
    // Verify signature
    const isValidSignature = await verifySignature(data, signature, getJWTSecret());
    if (!isValidSignature) {
      return { valid: false, reason: 'Invalid signature' };
    }
    
    // Decode payload
    const payloadBytes = base64urlDecode(payloadB64);
    const payloadStr = new TextDecoder().decode(payloadBytes);
    const payload = JSON.parse(payloadStr) as AdminJWTPayload;
    
    // Verify expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return { valid: false, reason: 'Token expired' };
    }
    
    // Verify role
    if (payload.role !== 'admin') {
      return { valid: false, reason: 'Invalid role' };
    }
    
    return { valid: true, payload };
  } catch (error) {
    return { valid: false, reason: 'Token verification failed' };
  }
}

/**
 * Extract JWT token from request (cookie or Authorization header)
 */
export function extractAdminJWT(request: NextRequest): string | null {
  // Check cookie
  const cookie = request.cookies.get(COOKIE_NAME);
  if (cookie) {
    return cookie.value;
  }
  
  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
}

/**
 * Set JWT cookie in response
 */
export function setAdminJWTCookie(response: NextResponse, token: string): void {
  const isProduction = process.env.NODE_ENV === 'production';
  
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: JWT_EXPIRY,
    path: '/'
  });
}

/**
 * Clear JWT cookie
 */
export function clearAdminJWTCookie(response: NextResponse): void {
  response.cookies.delete(COOKIE_NAME);
}

export default {
  COOKIE_NAME,
  createAdminJWT,
  verifyAdminJWT,
  extractAdminJWT,
  setAdminJWTCookie,
  clearAdminJWTCookie
};
