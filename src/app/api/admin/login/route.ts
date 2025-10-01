import { NextRequest, NextResponse } from 'next/server';
import { createAdminJWT, setAdminJWTCookie } from '@/lib/admin-jwt';
import { supabase } from '@/lib/supabaseClient';
import MaximumSecurity, { InputSanitizer } from '@/lib/enhanced-security';

export async function POST(request: NextRequest) {
  // Apply security checks
  const securityCheck = await MaximumSecurity.secureRequest(request);
  if (securityCheck) return securityCheck;

  try {
    const body = await request.json();
    
    // Validate and sanitize input
    const postValidation = await MaximumSecurity.validatePostData(request, body);
    if (!postValidation.valid) {
      return NextResponse.json(
        { error: postValidation.error || 'Invalid input' },
        { status: 400 }
      );
    }
    
    const { email, password } = postValidation.sanitized;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Additional input validation
    const emailValidation = InputSanitizer.validateInput(email, 100);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Authenticate with Supabase
    if (!supabase) {
      return NextResponse.json(
        { error: 'Authentication service unavailable' },
        { status: 503 }
      );
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: emailValidation.sanitized!,
      password: password
    });

    if (signInError || !data.user) {
      console.warn(`🔒 Failed login attempt for: ${email}`);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // CRITICAL: Verify user is an admin
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || ['gamingguruji095@gmail.com'];
    const userEmail = (data.user.email || email).toLowerCase();
    
    console.log(`🔍 Admin check: User email: ${userEmail}, Admin emails: ${adminEmails.join(', ')}`);
    
    if (!adminEmails.includes(userEmail)) {
      console.warn(`🔒 Unauthorized admin access attempt by: ${userEmail}`);
      return NextResponse.json(
        { error: 'Unauthorized - Admin access denied' },
        { status: 403 }
      );
    }

    // Create secure JWT token
    const token = await createAdminJWT(data.user.id, data.user.email || email);
    
    console.log(`🔑 JWT token created for ${data.user.email}`);

    // Create response with JWT cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email
      },
      message: 'Login successful'
    });

    // Set secure JWT cookie
    setAdminJWTCookie(response, token);
    
    // Add additional headers to ensure cookie is processed
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    console.log(`✅ Admin login successful: ${data.user.email}`);
    console.log(`🍪 JWT cookie set for admin session`);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
