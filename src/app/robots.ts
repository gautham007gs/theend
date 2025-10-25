
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                  (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'https://kruthika.fun')
  
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: ['/', '/blog/', '/blog/*', '/us', '/uk', '/ca', '/au', '/maya-chat', '/status'],
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
