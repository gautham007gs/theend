
import { NextRequest } from 'next/server';
import { supabase } from './supabaseClient';

export async function verifyAdminAuth(request: NextRequest): Promise<{
  isValid: boolean;
  user?: any;
  error?: string;
}> {
  try {
    // Get session token from Authorization header or cookie
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      // Try to get from cookie
      const cookies = request.headers.get('cookie');
      if (!cookies) {
        return { isValid: false, error: 'No authentication token found' };
      }
      
      // Parse cookies to find Supabase auth token
      const authCookie = cookies.split(';').find(c => c.trim().startsWith('sb-'));
      if (!authCookie) {
        return { isValid: false, error: 'No authentication cookie found' };
      }
    }
    
    if (!supabase) {
      return { isValid: false, error: 'Supabase client not available' };
    }
    
    // Verify the session with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return { isValid: false, error: 'Invalid or expired session' };
    }
    
    // Additional check: verify user has admin role (implement your own logic)
    // For now, we'll just check if user exists and is authenticated
    return { isValid: true, user };
    
  } catch (error: any) {
    console.error('Auth verification error:', error);
    return { isValid: false, error: error.message || 'Authentication failed' };
  }
}

export async function requireAdminAuth(request: NextRequest) {
  const authResult = await verifyAdminAuth(request);
  
  if (!authResult.isValid) {
    return {
      authenticated: false,
      response: new Response(
        JSON.stringify({ error: 'Unauthorized', details: authResult.error }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    };
  }
  
  return { authenticated: true, user: authResult.user };
}
