import { Metadata } from 'next';
import { generateBlogMetadata } from '@/lib/blog-metadata';
import BlogPostContent from '@/components/BlogPostContent';

export const metadata: Metadata = generateBlogMetadata('benefits-ai-girlfriend-kruthika');

export default function BenefitsAIGirlfriendKruthika() {
  return (
    <BlogPostContent 
      slug="benefits-ai-girlfriend-kruthika"
      title="5 Benefits of AI Girlfriend 2025: Why Choose Kruthika | Proven Advantages"
      author="Sarah Johnson"
      date="2025-01-20"
      keywords="AI girlfriend benefits, benefits of AI girlfriend, AI girlfriend advantages"
      description="Discover 5 proven benefits of having an AI girlfriend like Kruthika. From emotional support to improved communication skills."
    />
  );
}