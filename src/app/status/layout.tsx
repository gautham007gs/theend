import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Girlfriend Status Updates | View Kruthika\'s Latest Stories 2025',
  description: 'View latest status updates and stories from Kruthika, your AI girlfriend. Experience realistic virtual companion updates, photos, and daily moments shared with you.',
  keywords: 'AI girlfriend status, virtual girlfriend updates, AI companion stories, Kruthika status, AI girlfriend photos, virtual girlfriend status updates, AI companion daily updates',
  openGraph: {
    title: 'AI Girlfriend Status Updates | Kruthika Stories',
    description: 'View latest status updates and stories from your AI girlfriend Kruthika. Experience realistic virtual companion moments.',
    url: 'https://kruthika.fun/status',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Girlfriend Status Updates | Kruthika Stories',
    description: 'View latest status updates and stories from your AI girlfriend Kruthika.',
  },
};

export default function StatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
