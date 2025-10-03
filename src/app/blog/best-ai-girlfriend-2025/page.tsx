import type { Metadata } from 'next';
import BestAIGirlfriend2025Client from './BestAIGirlfriend2025Client';

export const metadata: Metadata = {
  title: 'Best AI Girlfriend 2025: USA, UK, Canada, Australia, India | Kruthika',
  description: 'Discover the best AI girlfriend apps in 2025. Expert reviews and comparisons for users in USA, UK, Canada, Australia, and India. Find your perfect AI companion.',
  keywords: 'best AI girlfriend 2025, AI girlfriend USA, AI girlfriend UK, AI girlfriend Canada, AI girlfriend Australia, AI girlfriend India, top AI companion 2025',
  openGraph: {
    title: 'Best AI Girlfriend 2025: Top Picks for USA, UK, Canada, Australia & India',
    description: 'Complete global guide to the best AI girlfriend apps in 2025, with region-specific recommendations.',
    url: 'https://kruthika.fun/blog/best-ai-girlfriend-2025',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best AI Girlfriend 2025: Top Global Picks',
    description: 'Discover the best AI girlfriend apps for USA, UK, Canada, Australia, and India users.',
    images: ['/og-image.jpg'],
  },
};

export default function BestAIGirlfriend2025() {
  return <BestAIGirlfriend2025Client />;
}
