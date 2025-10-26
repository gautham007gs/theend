
import { Metadata } from 'next';
import { generateBlogMetadata } from '@/lib/blog-metadata';
import BlogPostContent from '@/components/BlogPostContent';

export const metadata: Metadata = generateBlogMetadata('ai-girlfriend-privacy-safety-guide');

export default function AIGirlfriendPrivacySafety() {
  return (
    <BlogPostContent 
      slug="ai-girlfriend-privacy-safety-guide"
      title="AI Girlfriend Privacy & Safety Guide 2025: Protect Your Data | Security Tips"
      author="Cybersecurity Expert"
      date="2025-01-23"
      keywords="AI girlfriend privacy, AI girlfriend safety, virtual girlfriend data protection"
      description="Essential AI girlfriend privacy and safety guide. Learn how to protect your data and use AI companions safely."
    />
  );
}
