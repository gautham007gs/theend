import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                  (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'https://kruthika.fun')
  
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/blog',
          '/blog/',
          '/blog/*',
          '/blog/psychology-ai-girlfriends',
          '/blog/best-ai-girlfriend-2025',
          '/blog/ai-girlfriend-emotional-support-loneliness',
          '/blog/24-7-ai-companionship-constant-availability-benefits',
          '/blog/ai-companion-social-anxiety-confidence-building',
          '/blog/ai-girlfriends-india-dating-culture',
          '/blog/building-perfect-ai-girlfriend-technology',
          '/blog/benefits-ai-girlfriend-kruthika',
          '/blog/future-ai-girlfriends-2024',
          '/us',
          '/uk',
          '/ca',
          '/au',
          '/maya-chat',
          '/status'
        ],
        disallow: ['/admin/', '/api/', '/_next/', '/tmp/', '/attached_assets/', '/maya-chat/actions'],
        crawlDelay: 0,
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/', '/kruthika-avatar.svg', '/og-image.jpg', '/og-image.png'],
        disallow: ['/admin/', '/_next/'],
      },
      {
        userAgent: 'Bingbot',
        allow: ['/', '/blog/', '/blog/*', '/us', '/uk', '/ca', '/au', '/maya-chat'],
        disallow: ['/admin/', '/api/', '/_next/', '/tmp/'],
        crawlDelay: 1,
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/tmp/',
          '/attached_assets/',
          '/*.json$',
          '/maya-chat/actions',
        ],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  }
}