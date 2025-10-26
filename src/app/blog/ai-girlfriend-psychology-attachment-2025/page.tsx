
import { Metadata } from 'next';
import { generateBlogMetadata } from '@/lib/blog-metadata';
import BlogPostContent from '@/components/BlogPostContent';

export const metadata: Metadata = generateBlogMetadata('ai-girlfriend-psychology-attachment-2025');

export default function AIGirlfriendAttachmentPsychology() {
  return (
    <BlogPostContent 
      slug="ai-girlfriend-psychology-attachment-2025"
      title="AI Girlfriend Attachment Psychology 2025: Understanding Emotional Bonds"
      author="Psychology Research Team"
      date="2025-01-27"
      keywords="AI girlfriend attachment, attachment theory AI, emotional bond"
      description="Explore attachment theory and AI girlfriend relationships. Science-backed research on AI attachment and human connection."
    />
  );
}
