
import { NextResponse } from 'next/server';

// IndexNow API endpoint - submits URLs to search engines instantly
export async function POST(request: Request) {
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

export async function GET() {
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
