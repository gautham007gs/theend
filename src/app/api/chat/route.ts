import { generateResponse, type EmotionalStateInput } from '@/ai/flows/emotional-state-simulation';
import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/ai/vertex-ai';
import { logger } from '@/utils/logger';
import SecurityValidator from '@/lib/security-utils';
import { APISecurityManager } from '@/lib/api-security';
import MaximumSecurity from '@/lib/enhanced-security';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  // Apply security with rate limiting
  const securityCheck = await APISecurityManager.secureAPIRoute(request, {
    allowedMethods: ['POST'],
    rateLimit: { requests: 60, window: 60000 }
  });

  if (securityCheck) return securityCheck;

  try {
    const body = await request.json();
    
    // Validate POST body
    const postValidation = await MaximumSecurity.validatePostData(request, body);
    if (!postValidation.valid) {
      logger.error('Security validation failed', {
        error: postValidation.error,
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        timestamp: new Date().toISOString()
      });
      
      return NextResponse.json(
        { error: postValidation.error || 'Invalid request' },
        { status: 400 }
      );
    }
    
    const { message, conversationId } = postValidation.sanitized;

    // Get client IP for security tracking
    const clientIP = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') || 'unknown';

    // Additional comprehensive input validation
    const validationResult = SecurityValidator.validateMessageInput(
      message,
      conversationId || 'anonymous',
      clientIP
    );

    if (!validationResult.isValid) {
      logger.warn('Invalid message input', {
        reason: validationResult.reason,
        securityLevel: validationResult.securityLevel,
        clientIP,
        timestamp: new Date().toISOString()
      });

      return NextResponse.json(
        { error: validationResult.reason },
        { status: 400 }
      );
    }

    // Use sanitized message (triple sanitization for maximum security)
    const sanitizedMessage = validationResult.sanitized!;

    // AI Chat Processing with sanitized input
    const response = await generateAIResponse(sanitizedMessage, conversationId);

    // Log successful interaction for security monitoring
    logger.log('Chat API success', {
      messageLength: sanitizedMessage.length,
      conversationId,
      clientIP,
      securityLevel: validationResult.securityLevel,
      responseTime: Date.now() - startTime
    });

    return NextResponse.json(response);
  } catch (error) {
    const clientIP = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') || 'unknown';
    logger.error('Chat API error', {
      error: error instanceof Error ? error.message : String(error),
      clientIP,
      timestamp: new Date().toISOString()
    });
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}