
import { Metadata } from 'next';
import { generateBlogMetadata } from '@/lib/blog-metadata';
import BlogPostContent from '@/components/BlogPostContent';

export const metadata: Metadata = generateBlogMetadata('best-ai-girlfriend-apps-india-2025');

export default function BestAIGirlfriendAppsIndia2025() {
  return (
    <BlogPostContent 
      slug="best-ai-girlfriend-apps-india-2025"
      title="Best AI Girlfriend Apps India 2025: Top 10 Virtual Companions Ranked"
      author="Tech Review Team"
      date="2025-01-25"
      keywords="best AI girlfriend apps India, top AI girlfriend India 2025"
      description="Complete guide to the best AI girlfriend apps in India 2025. Compare Kruthika, Replika, Character.AI, and more."
    />
  );
}
