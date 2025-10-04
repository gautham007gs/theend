
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/', '/tmp/', '/attached_assets/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/', '/tmp/', '/attached_assets/'],
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
          '/maya-chat/actions',
        ],
      }
    ],
    sitemap: 'https://kruthika.fun/sitemap.xml',
    host: 'https://kruthika.fun'
  }
}
