import { Metadata } from 'next';
import { generateBlogMetadata } from '@/lib/blog-metadata';
import BlogPostContent from '@/components/BlogPostContent';

export const metadata: Metadata = generateBlogMetadata('ai-girlfriends-india-dating-culture');

export default function AIGirlfriendsIndiaDatingCulture() {
  return (
    <BlogPostContent 
      slug="ai-girlfriends-india-dating-culture"
      title="AI Girlfriends in India 2025: Transforming Dating Culture | Kruthika"
      author="Rahul Mehta"
      date="2025-01-22"
      keywords="AI girlfriend India, AI girlfriend apps India, virtual girlfriend India"
      description="How AI girlfriend apps like Kruthika are revolutionizing dating in India. Explore the rise of virtual companions among Indians."
    />
  );
}