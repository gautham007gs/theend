
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kruthika.fun'
  
  const blogPosts = [
    'psychology-ai-girlfriends',
    'ai-girlfriends-india-dating-culture',
    'building-perfect-ai-girlfriend-technology',
    'benefits-ai-girlfriend-kruthika',
    'future-ai-girlfriends-2024',
    'kruthika-origin-story-mumbai-ai-girlfriend',
    'best-ai-girlfriend-apps-india-2025',
    'how-to-talk-ai-girlfriend-conversation-guide',
    'ai-girlfriend-privacy-safety-guide',
    'ai-girlfriend-voice-chat-technology-2025',
    'free-ai-girlfriend-apps-vs-premium-2025',
    'ai-companion-social-anxiety-confidence-building',
    'ai-girlfriend-market-statistics-2025-growth-trends',
    'replika-vs-character-ai-vs-kruthika-comparison-2025',
    '24-7-ai-companionship-constant-availability-benefits',
    'ai-girlfriend-psychology-attachment-2025',
    'ai-girlfriend-emotional-support-loneliness',
  ];

  const blogUrls = blogPosts.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/maya-chat`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
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
