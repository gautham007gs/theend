
import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/ai/vertex-ai';
import MaximumSecurity from '@/lib/enhanced-security';
import { APISecurityManager } from '@/lib/api-security';

export async function HEAD(request: NextRequest) {
  // Apply security to HEAD requests
  const enhancedSecurityCheck = await MaximumSecurity.secureRequest(request);
  if (enhancedSecurityCheck) return enhancedSecurityCheck;
  
  return new Response(null, { status: 200 });
}

export async function GET(request: NextRequest) {
  // CRITICAL: Apply MAXIMUM security protection - this endpoint should be admin-only
  const enhancedSecurityCheck = await MaximumSecurity.secureRequest(request);
  if (enhancedSecurityCheck) return enhancedSecurityCheck;

  // Apply API security with strict rate limiting
  const securityCheck = await APISecurityManager.secureAPIRoute(request, {
    allowedMethods: ['GET', 'HEAD'],
    rateLimit: { requests: 5, window: 60000 } // Only 5 requests per minute for testing endpoint
  });
  if (securityCheck) return securityCheck;

  // Only allow in development mode
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({
      success: false,
      error: 'This endpoint is disabled in production for security'
    }, { status: 403 });
  }
  
  try {
    // Test simple response generation without exposing sensitive data
    const testResponse = await generateAIResponse('Say "Hello, Vertex AI is working!"');
    
    return NextResponse.json({
      success: true,
      message: 'Vertex AI is working correctly',
      testResponse: testResponse,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasCredentials: !!process.env.GOOGLE_CREDENTIALS_JSON
      }
    });

  } catch (error) {
    console.error('Test Vertex AI: Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Service temporarily unavailable'
    }, { status: 500 });
  }
}
