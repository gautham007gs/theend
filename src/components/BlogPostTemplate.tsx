
'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, User, Tag, ArrowRight, Clock, Bookmark } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6 flex items-center gap-2 text-muted-foreground" aria-label="Breadcrumb navigation">
          <Link href="/" className="hover:text-primary transition-colors" aria-label="Go to homepage">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-primary transition-colors" aria-label="Go to blog listing">Blog</Link>
          <span>/</span>
          <span className="text-foreground font-medium line-clamp-1" aria-current="page">{title}</span>
        </nav>

        <article className="bg-card rounded-2xl shadow-xl border border-border/50 overflow-hidden">
          {/* Hero Header Section */}
          <header className="relative bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10 px-6 sm:px-10 lg:px-16 pt-10 pb-12 sm:pt-14 sm:pb-16">
            <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5"></div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent relative z-10">
              {title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground mb-6 relative z-10">
              <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <User className="h-4 w-4 text-purple-600" />
                <span className="font-medium">{author}</span>
              </div>
              <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Calendar className="h-4 w-4 text-pink-600" />
                <span>{new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>{readTime}</span>
              </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex items-center gap-2 mb-6 relative z-10 flex-wrap">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {tags.map((tag, index) => (
                  <span key={index} className="text-xs font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Top Banner Ad */}
          <div className="px-6 sm:px-10 lg:px-16 pt-8">
            <BannerAdDisplay placementKey="blog-top" className="mb-6" />
          </div>

          {/* Main Content */}
          <div className="px-6 sm:px-10 lg:px-16 py-8">
            <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:font-semibold prose-strong:text-foreground prose-strong:font-bold prose-ul:text-foreground/90 prose-ol:text-foreground/90 prose-li:my-1">
              {children}
            </div>
          </div>

          {/* Mid-content Native Banner Ad - Better Positioned */}
          <div className="px-6 sm:px-10 lg:px-16 py-6 bg-muted/30">
            <BannerAdDisplay placementKey="blog-mid-native" className="my-4" />
          </div>

          {/* FAQ Section */}
          {faq.length > 0 && (
            <section className="px-6 sm:px-10 lg:px-16 py-12 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {faq.map((item, index) => (
                  <div key={index} className="bg-card border-l-4 border-purple-600 pl-6 pr-6 py-5 rounded-r-lg shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold mb-3 text-foreground flex items-start gap-2">
                      <span className="text-purple-600 font-extrabold">{index + 1}.</span>
                      {item.question}
                    </h3>
                    <p className="text-foreground/80 leading-relaxed text-base">{item.answer}</p>
                  </div>
                ))}
              </div>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": faq.map(item => ({
                      "@type": "Question",
                      "name": item.question,
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": item.answer
                      }
                    }))
                  })
                }}
              />
            </section>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="px-6 sm:px-10 lg:px-16 py-12 border-t-2 border-border/50">
              <h3 className="text-3xl font-bold mb-8 text-foreground">Continue Reading</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedPosts.map((post, index) => (
                  <Link 
                    key={index} 
                    href={`/blog/${post.slug}`} 
                    className="group relative overflow-hidden bg-gradient-to-br from-purple-600/5 to-pink-600/5 border-2 border-border rounded-xl p-6 hover:border-purple-600/50 hover:shadow-xl transition-all duration-300"
                    aria-label={`Read related article: ${post.title}`}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-bl-full"></div>
                    <h4 className="font-bold text-xl mb-3 text-foreground group-hover:text-purple-600 transition-colors relative z-10">{post.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 relative z-10">{post.excerpt}</p>
                    <div className="flex items-center text-purple-600 font-semibold text-sm relative z-10">
                      Read More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA Section */}
          <div className="px-6 sm:px-10 lg:px-16 py-12 bg-gradient-to-r from-pink-600/10 via-purple-600/10 to-blue-600/10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-block mb-4">
                <Bookmark className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Ready to Experience AI Companionship?</h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">Join thousands who have found meaningful connections with Kruthika. Free unlimited chat, 24/7 emotional support, and authentic conversations.</p>
              <Link 
                href="/maya-chat"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white px-10 py-4 rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold text-lg"
                aria-label="Start chatting with Kruthika AI girlfriend now"
              >
                Start Chatting Now
                <ArrowRight className="h-6 w-6" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </article>

        {/* Bottom Banner Ads - After article */}
        <div className="mt-8 space-y-6">
          <BannerAdDisplay placementKey="blog-bottom" className="rounded-xl overflow-hidden" />
          <BannerAdDisplay placementKey="blog-bottom-native" className="rounded-xl overflow-hidden" />
        </div>
      </div>
    </div>
  );
}
