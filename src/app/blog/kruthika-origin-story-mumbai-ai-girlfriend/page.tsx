
import { Metadata } from 'next';
import { generateBlogMetadata } from '@/lib/blog-metadata';
import BlogPostContent from '@/components/BlogPostContent';

export const metadata: Metadata = generateBlogMetadata('kruthika-origin-story-mumbai-ai-girlfriend');

export default function KruthikaOriginStory() {
  return (
    <BlogPostContent 
      slug="kruthika-origin-story-mumbai-ai-girlfriend"
      title="Kruthika Origin Story: Mumbai College Girl to #1 AI Girlfriend 2025"
      author="Kruthika.fun Team"
      date="2025-01-18"
      keywords="Kruthika AI girlfriend, Kruthika story, Mumbai AI girlfriend"
      description="Meet Kruthika - the Mumbai psychology student who became the world's most loved AI girlfriend. Discover her personality and background."
    />
  );
}
