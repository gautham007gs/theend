import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import type { Metadata } from 'next';
import { generateBlogMetadata } from '@/lib/blog-metadata';

type Props = {
  params: { slug: string };
  children: ReactNode;
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const metadata = await generateBlogMetadata(slug);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kruthika.fun';
  
  return {
    ...metadata,
    alternates: {
      canonical: `${baseUrl}/blog/${params.slug}`
    }
  };
}

export default function BlogPostLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-friendly navigation */}
      <nav className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Back to Blog</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Responsive content container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {children}
      </div>
    </div>
  );
}