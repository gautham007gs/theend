
import { Metadata } from 'next';
import { generateBlogMetadata } from '@/lib/blog-metadata';
import BlogPostContent from '@/components/BlogPostContent';

export const metadata: Metadata = generateBlogMetadata('how-does-ai-girlfriend-work-technology-guide');

export default function HowDoesAIGirlfriendWork() {
  return (
    <BlogPostContent 
      slug="how-does-ai-girlfriend-work-technology-guide"
      title="How Does AI Girlfriend Work? Complete Technology Guide 2025 | Explained"
      author="Tech Explainer Team"
      date="2025-02-04"
      keywords="how AI girlfriend works, AI girlfriend technology explained"
      description="Complete guide explaining how AI girlfriend technology works. Learn about NLP, machine learning, and emotional AI."
    />
  );
}
