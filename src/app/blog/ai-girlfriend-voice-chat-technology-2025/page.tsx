
import { Metadata } from 'next';
import { generateBlogMetadata } from '@/lib/blog-metadata';
import BlogPostContent from '@/components/BlogPostContent';

export const metadata: Metadata = generateBlogMetadata('ai-girlfriend-voice-chat-technology-2025');

export default function AIGirlfriendVoiceChat() {
  return (
    <BlogPostContent 
      slug="ai-girlfriend-voice-chat-technology-2025"
      title="AI Girlfriend Voice Chat 2025: Revolutionary Voice Technology | Realistic Conversations"
      author="Voice AI Technology Expert"
      date="2025-01-27"
      keywords="AI girlfriend voice chat, AI voice girlfriend, virtual girlfriend voice call"
      description="Experience AI girlfriend voice chat technology in 2025. Discover how advanced voice synthesis makes virtual relationships realistic."
    />
  );
}
