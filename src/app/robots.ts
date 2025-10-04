
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
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
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/', '/tmp/'],
      }
    ],
    sitemap: 'https://kruthika.fun/sitemap.xml',
    host: 'https://kruthika.fun'
  }
}
