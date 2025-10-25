
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                  (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'https://kruthika.fun')
  
  return {
    rules: [
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
          '/test-*'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/blog/', '/blog/*'],
        disallow: ['/admin/', '/api/', '/_next/', '/tmp/'],
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
        allow: ['/', '/blog/', '/blog/*'],
        disallow: ['/admin/', '/api/', '/_next/', '/tmp/'],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  }
}
