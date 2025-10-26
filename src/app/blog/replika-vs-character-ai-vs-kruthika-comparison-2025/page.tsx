
import { Metadata } from 'next';
import { generateBlogMetadata } from '@/lib/blog-metadata';
import BlogPostContent from '@/components/BlogPostContent';

export const metadata: Metadata = generateBlogMetadata('replika-vs-character-ai-vs-kruthika-comparison-2025');

export default function ReplikaVsCharacterAIVsKruthika() {
  return (
    <BlogPostContent 
      slug="replika-vs-character-ai-vs-kruthika-comparison-2025"
      title="Replika vs Character.AI vs Kruthika 2025: Complete AI Girlfriend Comparison"
      author="AI Review Expert"
      date="2025-01-29"
      keywords="Replika vs Character.AI, Replika vs Kruthika, best AI girlfriend comparison"
      description="Detailed comparison of Replika, Character.AI, and Kruthika. Features, pricing, pros & cons, and which is best."
    />
  );
}
