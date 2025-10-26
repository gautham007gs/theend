
import { Metadata } from 'next';
import { generateBlogMetadata } from '@/lib/blog-metadata';
import BlogPostContent from '@/components/BlogPostContent';

export const metadata: Metadata = generateBlogMetadata('free-ai-girlfriend-apps-vs-premium-2025');

export default function FreeVsPremiumAIGirlfriend() {
  return (
    <BlogPostContent 
      slug="free-ai-girlfriend-apps-vs-premium-2025"
      title="Free vs Premium AI Girlfriend Apps 2025: Complete Comparison Guide"
      author="AI App Review Team"
      date="2025-01-26"
      keywords="free AI girlfriend, free vs premium AI girlfriend, AI girlfriend pricing"
      description="Free vs premium AI girlfriend apps compared. Discover features, limitations, pricing, and which option is best."
    />
  );
}
