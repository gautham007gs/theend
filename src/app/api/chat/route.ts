import { generateResponse, type EmotionalStateInput } from '@/ai/flows/emotional-state-simulation';
import { NextRequest, NextResponse } from 'next/server';
import { aiChat } from '@/ai/vertex-ai';
import { trackAnalytics } from '@/lib/analytics-tracker';
import { enhancedUserManager } from '@/lib/enhanced-user-manager';
import { Logger } from '@/utils/logger';
import { PerformanceUtils } from '@/lib/performance-utils';
import SecurityValidator from '@/lib/security-utils';
import APISecurityManager from '@/lib/api-security';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  // Apply comprehensive API security
  const securityCheck = await APISecurityManager.secureAPIRoute(request, {
    allowedMethods: ['POST'],
    requireCSRF: false, // Will implement custom validation
    rateLimit: { requests: 60, window: 60000 } // 60 requests per minute
  });

  if (securityCheck) return securityCheck;

  try {
    const body = await request.json();
    const { message, conversationId } = body;

    // Get client IP for security tracking
    const clientIP = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') || 'unknown';

    // Comprehensive input validation
    const validationResult = SecurityValidator.validateMessageInput(
      message,
      conversationId || 'anonymous',
      clientIP
    );

    if (!validationResult.isValid) {
      Logger.warn('Invalid message input', {
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

    // Use sanitized message
    const sanitizedMessage = validationResult.sanitized!;

    // AI Chat Processing with sanitized input
    const response = await aiChat(sanitizedMessage, conversationId);

    // Log successful interaction for security monitoring
    Logger.info('Chat API success', {
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
    Logger.error('Chat API error', {
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