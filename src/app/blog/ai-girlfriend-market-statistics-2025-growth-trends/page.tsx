
import { Metadata } from 'next';
import { generateBlogMetadata } from '@/lib/blog-metadata';
import BlogPostContent from '@/components/BlogPostContent';

export const metadata: Metadata = generateBlogMetadata('ai-girlfriend-market-statistics-2025-growth-trends');

export default function AIGirlfriendMarketStatistics() {
  return (
    <BlogPostContent 
      slug="ai-girlfriend-market-statistics-2025-growth-trends"
      title="AI Girlfriend Market Statistics 2025: Growth, Trends & User Data | Market Analysis"
      author="Market Research Team"
      date="2025-01-28"
      keywords="AI girlfriend statistics, AI girlfriend market size, virtual girlfriend market trends"
      description="Complete AI girlfriend market analysis 2025. Growth statistics, user demographics, market size, and predictions."
    />
  );
}
