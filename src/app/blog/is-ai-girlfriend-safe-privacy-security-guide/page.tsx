
import { Metadata } from 'next';
import { generateBlogMetadata } from '@/lib/blog-metadata';
import BlogPostContent from '@/components/BlogPostContent';

export const metadata: Metadata = generateBlogMetadata('is-ai-girlfriend-safe-privacy-security-guide');

export default function IsAIGirlfriendSafe() {
  return (
    <BlogPostContent 
      slug="is-ai-girlfriend-safe-privacy-security-guide"
      title="Is AI Girlfriend Safe? Privacy & Security Guide 2025 | Safety Tips"
      author="Digital Security Expert"
      date="2025-02-05"
      keywords="is AI girlfriend safe, AI girlfriend security, AI girlfriend privacy"
      description="Is AI girlfriend safe to use? Complete privacy and security guide 2025. Expert safety tips and recommendations."
    />
  );
}
