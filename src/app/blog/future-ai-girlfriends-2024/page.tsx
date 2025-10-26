import { Metadata } from 'next';
import { generateBlogMetadata } from '@/lib/blog-metadata';
import BlogPostContent from '@/components/BlogPostContent';

export const metadata: Metadata = generateBlogMetadata('future-ai-girlfriends-2024');

export default function FutureAIGirlfriends2024() {
  return (
    <BlogPostContent 
      slug="future-ai-girlfriends-2024"
      title="Future of AI Girlfriends 2025-2026: What to Expect | Technology Predictions"
      author="Future Tech Team"
      date="2025-01-20"
      keywords="future AI girlfriend, AI girlfriend 2025, AI girlfriend VR"
      description="Explore the future of AI girlfriend technology in 2025 and beyond. VR integration, advanced emotional intelligence, and more."
    />
  );
}