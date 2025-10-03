import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import MaximumSecurity from './lib/enhanced-security'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Advanced rate limiting for high traffic protection (keeping existing for backward compatibility)
const rateLimitMap = new Map<string, { count: number; lastReset: number; penalties: number }>();
const slowClientsMap = new Map<string, number>(); // Track slow clients
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100; // Increased for normal traffic
const MAX_REQUESTS_BURST = 20; // Burst protection
const SLOW_CLIENT_THRESHOLD = 5000; // 5 seconds for slow responses
const PENALTY_MULTIPLIER = 0.5; // Reduce limits for repeat offenders

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const userRate = rateLimitMap.get(ip);

  if (!userRate) {
    rateLimitMap.set(ip, { count: 1, lastReset: now, penalties: 0 });
    return false;
  }

  // Reset if window has passed
  if (now - userRate.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, lastReset: now, penalties: userRate.penalties });
    return false;
  }

  // Calculate effective limit based on penalties
  const effectiveLimit = Math.floor(MAX_REQUESTS_PER_WINDOW * (1 - (userRate.penalties * PENALTY_MULTIPLIER)));

  // Burst protection - check last 10 seconds
  const recentWindow = 10 * 1000;
  if (userRate.count > MAX_REQUESTS_BURST && (now - userRate.lastReset) < recentWindow) {
    userRate.penalties++;
    return true;
  }

  // Check if limit exceeded
  if (userRate.count >= effectiveLimit) {
    userRate.penalties++;
    return true;
  }

  // Increment count
  userRate.count++;
  return false;
}

function isInstagramInAppBrowserServer(userAgent: string | null): boolean {
  if (userAgent) {
    // Common patterns for Instagram's in-app browser user agent string
    return /instagram/i.test(userAgent) || /mozilla\/5\.0 \([^)]+\) applewebkit\/[^ ]+ \(khtml, like gecko\) mobile\/[^ ]+ instagram/i.test(userAgent);
  }
  return false;
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname, searchParams, origin } = request.nextUrl;
  const userAgent = request.headers.get('user-agent');

  // Apply maximum security to all requests
  const securityResponse = await MaximumSecurity.secureRequest(request);
  if (securityResponse) return securityResponse;

  // Server-side admin authentication check
  if (request.nextUrl.pathname.startsWith('/admin') &&
      request.nextUrl.pathname !== '/admin/login') {

    const supabase = createMiddlewareClient({ req: request, res: response });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('returnUrl', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }


  // Apply enhanced maximum security ONLY to API routes (not pages/assets)
  if (pathname.startsWith('/api/')) {
    // Enhanced security check with DDoS protection, IP reputation, etc.
    const securityCheck = await MaximumSecurity.secureRequest(request);
    if (securityCheck) return securityCheck;

    // Legacy rate limiting (kept for additional protection)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429, headers: { 'X-Security-Block': 'legacy-rate-limit' } }
      );
    }
  }

  // For Server Actions and API routes, fix headers and continue
  if (pathname.startsWith('/api/') || request.method === 'POST') {
    // Fix CORS and header issues for Replit
    const forwardedHost = request.headers.get('x-forwarded-host');
    const requestOrigin = request.headers.get('origin');

    if (forwardedHost && forwardedHost.includes('replit.dev')) {
      // For Server Actions, ensure consistent host/origin headers
      if (request.method === 'POST' && pathname.startsWith('/maya-chat')) {
        // Extract hostname without protocol from forwardedHost
        const hostWithoutProtocol = forwardedHost.replace(/^https?:\/\//, '');

        // Set consistent headers - remove port from both if present
        response.headers.set('x-forwarded-host', hostWithoutProtocol);
        response.headers.set('host', hostWithoutProtocol);

        // Also set origin to match
        response.headers.set('origin', `https://${hostWithoutProtocol}`);
      }

      response.headers.set('Access-Control-Allow-Origin', `https://${forwardedHost}`);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Forwarded-Host, X-Forwarded-Proto, X-Forwarded-For, Host, Origin, X-CSRF-Token');
    }

    // Enhanced security headers
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    // Add caching headers for static assets
    if (request.nextUrl.pathname.startsWith('/_next/static/') ||
        request.nextUrl.pathname.includes('.')) {
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      // No cache for dynamic content (prevents stale data attacks)
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      response.headers.set('Pragma', 'no-cache');
    }

    // Add performance timing headers
    response.headers.set('Server-Timing', `middleware;dur=${Date.now()}`);

    return response;
  }

  // Check if our redirect trick has already been attempted for this request flow
  const hasRedirectAttemptedFlag = searchParams.has('external_redirect_attempted');

  // Only apply the trick if it's an Instagram browser, the flag isn't set, and it's not an API/static asset path
  if (isInstagramInAppBrowserServer(userAgent) && !hasRedirectAttemptedFlag) {

    // More robustly ignore common asset paths and API routes
    if (pathname.startsWith('/_next/') ||
        pathname.startsWith('/api/') ||
        pathname.startsWith('/media/') || // Assuming /media/ for local assets like audio
        pathname.includes('.') // General check for file extensions like .png, .ico, .css, .js
       ) {
      return NextResponse.next();
    }

    // Construct the target URL for the meta-refresh, preserving original path and query params,
    // and adding our flag.
    const targetUrl = new URL(pathname, origin);
    // Append existing searchParams
    searchParams.forEach((value, key) => {
        if (key !== 'external_redirect_attempted') { // Avoid duplicating our flag
            targetUrl.searchParams.append(key, value);
        }
    });
    targetUrl.searchParams.set('external_redirect_attempted', 'true');
    const targetUrlString = targetUrl.toString();

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Opening in Browser...</title>
    <meta http-equiv="refresh" content="0;url=${targetUrlString}">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; margin: 0; padding: 25px; background-color: #fafafa; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 90vh; text-align: center; color: #262626; }
        .container { background-color: #ffffff; padding: 20px 30px; border-radius: 12px; box-shadow: 0 6px 18px rgba(0,0,0,0.08); max-width: 400px; width: 90%; }
        p { margin-bottom: 18px; font-size: 17px; line-height: 1.65; }
        a { color: #0095f6; text-decoration: none; font-weight: 600; }
        a:hover { text-decoration: underline; }
        .loader { border: 4px solid #dbdbdb; border-top: 4px solid #0095f6; border-radius: 50%; width: 35px; height: 35px; animation: spin 1.2s linear infinite; margin: 25px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .small-text { font-size: 13px; color: #8e8e8e; margin-top: 25px; }
    </style>
</head>
<body>
    <div class="container">
        <p>Taking you to the full experience...</p>
        <div class="loader"></div>
        <p>If you're not redirected, please <a href="${targetUrlString}">click here</a>.</p>
        <p class="small-text">This helps ensure all features work correctly by using your phone's main browser.</p>
    </div>
    <script type="text/javascript">
      // The meta refresh is the primary method.
      // A direct window.location.href might be too quick and less likely to trigger OS intervention.
      // No additional JS needed for this specific trick; meta-refresh + Content-Disposition is the core.
    </script>
</body>
</html>`;

    return new Response(htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="open-maya-chat.html"`, // Filename hints to browser/OS
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
  }

  // Apply performance headers to all other requests
  // Add performance headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  // Add caching headers for static assets
  if (request.nextUrl.pathname.startsWith('/_next/static/') ||
      request.nextUrl.pathname.includes('.')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // Add performance timing headers
  response.headers.set('Server-Timing', `middleware;dur=${Date.now()}`);

  return response;
}

// Configure the matcher to run on page routes and API routes for header fixes
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, robots.txt
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)',
  ],
};