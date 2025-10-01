import { NextRequest, NextResponse } from 'next/server';
import { extractSessionId, destroyAdminSession, clearSessionCookie } from '@/lib/admin-session';

export async function POST(request: NextRequest) {
  try {
    // Extract session ID
    const sessionId = extractSessionId(request);
    
    if (sessionId) {
      // Destroy the session
      destroyAdminSession(sessionId);
      console.log(`🔒 Admin logged out successfully`);
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    // Clear the session cookie
    clearSessionCookie(response);

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
