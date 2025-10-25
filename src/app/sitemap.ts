
import { MetadataRoute } from 'next'
import { getAllBlogSlugs, blogPostsMetadata } from '@/lib/blog-metadata'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                  (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'https://kruthika.fun')
  
  const blogSlugs = getAllBlogSlugs();

  const blogUrls = blogSlugs.map((slug) => {
    const meta = blogPostsMetadata[slug];
    return {
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(meta.dateModified),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    };
  });

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/maya-chat`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/us`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/uk`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/ca`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/au`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    ...blogUrls,
    {
      url: `${baseUrl}/status`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/legal/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/legal/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}
