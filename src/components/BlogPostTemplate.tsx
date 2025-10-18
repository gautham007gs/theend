'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, User, Tag, ArrowRight } from 'lucide-react';
import BannerAdDisplay from '@/components/chat/BannerAdDisplay';

interface BlogPostTemplateProps {
  title: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  children: React.ReactNode;
  relatedPosts?: {
    title: string;
    slug: string;
    excerpt: string;
  }[];
  faq?: {
    question: string;
    answer: string;
  }[];
}

export default function BlogPostTemplate({
  title,
  author,
  date,
  readTime,
  tags,
  children,
  relatedPosts = [],
  faq = []
}: BlogPostTemplateProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm mb-8" aria-label="Breadcrumb navigation">
          <Link href="/" className="text-muted-foreground hover:text-primary" aria-label="Go to homepage">Home</Link>
          <span className="mx-2 text-muted-foreground" aria-hidden="true">/</span>
          <Link href="/blog" className="text-muted-foreground hover:text-primary" aria-label="Go to blog listing">Blog</Link>
          <span className="mx-2 text-muted-foreground" aria-hidden="true">/</span>
          <span className="text-foreground" aria-current="page">{title}</span>
        </nav>

        <article className="prose prose-lg max-w-none">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{title}</h1>

            <div className="flex items-center gap-6 text-muted-foreground text-sm mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(date).toLocaleDateString()}
              </div>
              <span>{readTime} read</span>
            </div>

            {tags.length > 0 && (
              <div className="flex items-center gap-2 mb-6">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </header>

          {/* Top Banner Ads */}
          <BannerAdDisplay adType="standard" placementKey="blog-top" className="mb-4" />
          <BannerAdDisplay adType="native" placementKey="blog-top-native" className="mb-8" />

          <div className="prose-content">
            {children}
          </div>

          <BannerAdDisplay adType="standard" placementKey="blog-middle" className="my-8" />

          {/* FAQ Section */}
          {faq.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {faq.map((item, index) => (
                  <div key={index} className="border-l-4 border-primary pl-4">
                    <h3 className="font-semibold mb-2">{item.question}</h3>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-12 pt-8 border-t border-border">
              <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedPosts.map((post, index) => (
                  <Link 
                    key={index} 
                    href={`/blog/${post.slug}`} 
                    className="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow"
                    aria-label={`Read related article: ${post.title}`}
                  >
                    <h4 className="font-semibold mb-2">{post.title}</h4>
                    <p className="text-muted-foreground text-sm">{post.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA Section */}
          <div className="mt-12 p-8 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Experience AI Companionship?</h3>
            <p className="text-muted-foreground mb-6">Join thousands who have found meaningful connections with Kruthika</p>
            <Link 
              href="/maya-chat"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 font-semibold"
              aria-label="Start chatting with Kruthika AI girlfriend now"
            >
              Start Chatting Now
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </article>

        {/* Bottom Banner Ads */}
        <BannerAdDisplay adType="standard" placementKey="blog-bottom" className="mt-8 mb-4" />
        <BannerAdDisplay adType="native" placementKey="blog-bottom-native" className="mt-4 mb-8" />
      </div>
    </div>
  );
}