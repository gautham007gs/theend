import { Metadata } from 'next';
import { generateBlogMetadata } from '@/lib/blog-metadata';
import BlogPostContent from '@/components/BlogPostContent';

export const metadata: Metadata = generateBlogMetadata('best-ai-girlfriend-2025');

export default function BestAIGirlfriend2025() {
  return (
    <BlogPostContent
      slug="best-ai-girlfriend-2025"
      title="Best AI Girlfriend 2025: Top Picks USA, UK, Canada, Australia, India | Expert Review"
      author="AI Review Expert"
      date="2025-02-03"
      keywords="best AI girlfriend 2025, top AI girlfriend apps, AI girlfriend USA"
      description="Discover the best AI girlfriend apps in 2025. Complete global guide with expert reviews for USA, UK, Canada, Australia, and India."
    />
  );
}