
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import MaximumSecurity from '@/lib/enhanced-security';
import { APISecurityManager } from '@/lib/api-security';

// IndexNow API endpoint - submits URLs to search engines instantly
export async function POST(request: NextRequest) {
  // Apply MAXIMUM security protection
  const enhancedSecurityCheck = await MaximumSecurity.secureRequest(request);
  if (enhancedSecurityCheck) return enhancedSecurityCheck;

  // Apply API security with strict rate limiting
  const securityCheck = await APISecurityManager.secureAPIRoute(request, {
    allowedMethods: ['POST'],
    rateLimit: { requests: 5, window: 60000 } // Only 5 indexing requests per minute
  });
  if (securityCheck) return securityCheck;

  try {
    const { urls } = await request.json();
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kruthika.fun';
    const apiKey = 'e8f3d9a7b2c4f1e6d8a9c3b5f7e2d4a6'; // Your unique key
    
    // Submit to IndexNow (Bing, Yandex support this)
    const indexNowPayload = {
      host: new URL(baseUrl).hostname,
      key: apiKey,
      keyLocation: `${baseUrl}/${apiKey}.txt`,
      urlList: urls || [
        baseUrl,
        `${baseUrl}/maya-chat`,
        `${baseUrl}/blog`,
        `${baseUrl}/us`,
        `${baseUrl}/uk`,
        `${baseUrl}/ca`,
        `${baseUrl}/au`,
      ]
    };

    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(indexNowPayload)
    });

    if (response.ok) {
      return NextResponse.json({ success: true, message: 'URLs submitted to IndexNow' });
    } else {
      return NextResponse.json({ success: false, error: 'IndexNow submission failed' }, { status: 500 });
    }
  } catch (error) {
    console.error('IndexNow error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Only allow in development mode for security
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({
      success: false,
      error: 'This endpoint is disabled in production for security. Use POST to submit specific URLs.'
    }, { status: 403 });
  }

  // Apply security even in development
  const enhancedSecurityCheck = await MaximumSecurity.secureRequest(request);
  if (enhancedSecurityCheck) return enhancedSecurityCheck;

  try {
    // Automatically submit all blog posts to IndexNow
    const { getAllBlogSlugs } = await import('@/lib/blog-metadata');
    const blogSlugs = getAllBlogSlugs();
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kruthika.fun';
    const apiKey = 'e8f3d9a7b2c4f1e6d8a9c3b5f7e2d4a6';
    
    const allUrls = [
      baseUrl,
      `${baseUrl}/maya-chat`,
      `${baseUrl}/blog`,
      `${baseUrl}/us`,
      `${baseUrl}/uk`,
      `${baseUrl}/ca`,
      `${baseUrl}/au`,
      `${baseUrl}/about`,
      `${baseUrl}/faq`,
      ...blogSlugs.map(slug => `${baseUrl}/blog/${slug}`)
    ];

    const indexNowPayload = {
      host: new URL(baseUrl).hostname,
      key: apiKey,
      keyLocation: `${baseUrl}/${apiKey}.txt`,
      urlList: allUrls
    };

    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(indexNowPayload)
    });

    if (response.ok || response.status === 202) {
      return NextResponse.json({ 
        success: true,
        message: `Successfully submitted ${allUrls.length} URLs to IndexNow for instant indexing`,
        count: allUrls.length,
        urls: allUrls
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'IndexNow endpoint active',
        info: 'POST URLs to this endpoint for instant indexing'
      });
    }
  } catch (error) {
    console.error('IndexNow GET error:', error);
    return NextResponse.json({ 
      message: 'IndexNow endpoint active',
      info: 'POST URLs to this endpoint for instant indexing',
      error: String(error)
    });
  }
}
