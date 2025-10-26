import { Metadata } from 'next';
import { generateBlogMetadata } from '@/lib/blog-metadata';
import BlogPostContent from '@/components/BlogPostContent';

export const metadata: Metadata = generateBlogMetadata('building-perfect-ai-girlfriend-technology');

export default function BuildingPerfectAIGirlfriendTechnology() {
  return (
    <BlogPostContent 
      slug="building-perfect-ai-girlfriend-technology"
      title="Building the Perfect AI Girlfriend: Technology Behind Kruthika 2025"
      author="Kruthika.fun Tech Team"
      date="2025-01-21"
      keywords="AI girlfriend technology, machine learning AI girlfriend, emotional AI technology"
      description="Learn how AI girlfriend technology works. Discover the advanced machine learning, NLP, and emotional AI that powers Kruthika."
    />
  );
}