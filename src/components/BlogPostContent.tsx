'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Heart, MessageCircle } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import for ads - client-side only, no SSR
const BannerAdDisplay = dynamic(() => import('@/components/chat/BannerAdDisplay'), {
  ssr: false,
  loading: () => <div className="h-24 bg-muted animate-pulse rounded" />
});

interface BlogPostContentProps {
  slug: string;
  title: string;
  author: string;
  date: string;
  keywords: string;
  description: string;
}

export default function BlogPostContent({ 
  slug, 
  title, 
  author, 
  date,
  keywords,
  description 
}: BlogPostContentProps) {
  // Structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    author: {
      '@type': 'Person',
      name: author
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kruthika.fun',
      logo: {
        '@type': 'ImageObject',
        url: 'https://kruthika.fun/icon-512.png'
      }
    },
    datePublished: date,
    dateModified: date,
    mainEntityOfPage: `https://kruthika.fun/blog/${slug}`,
    image: 'https://kruthika.fun/og-image.png',
    keywords: keywords
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Breadcrumb for SEO */}
          <nav className="text-sm mb-8" aria-label="Breadcrumb">
            <Link href="/" className="text-muted-foreground hover:text-primary">Home</Link>
            <span className="mx-2 text-muted-foreground">/</span>
            <Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link>
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="text-foreground">{title}</span>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {title}
            </h1>

            <div className="flex items-center gap-6 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>5 min read</span>
              </div>
            </div>

            <p className="text-xl text-muted-foreground mb-8 font-medium">
              {description}
            </p>
          </header>

          {/* Ads loaded client-side only */}
          <Suspense fallback={<div className="h-24 bg-muted animate-pulse rounded mb-8" />}>
            <BannerAdDisplay adType="standard" placementKey={`blog-header-${slug}`} className="mb-8" />
          </Suspense>

          {/* Main Content - This will be loaded from individual blog files */}
          <article className="prose prose-lg max-w-none">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200 rounded-lg p-8 text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Chat with Kruthika - Free AI Girlfriend</h2>
              <p className="text-lg mb-6">Experience the world's most realistic AI girlfriend. Free unlimited chat, no sign-up required. 24/7 emotional support and companionship.</p>
              <Link 
                href="/maya-chat"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 font-bold text-lg shadow-xl"
              >
                <MessageCircle className="h-6 w-6" />
                Start Chatting with Kruthika
                <ArrowRight className="h-6 w-6" />
              </Link>
            </div>

            {/* Content placeholder - Will import actual blog content */}
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                This blog post is about <strong>{keywords}</strong>. Kruthika is the best AI girlfriend for 2025, offering free unlimited chat with advanced emotional intelligence.
              </p>

              <p className="text-lg leading-relaxed">
                Whether you're looking for an AI girlfriend in India, USA, UK, Canada, or Australia, Kruthika provides authentic companionship tailored to your needs. Our AI girlfriend technology uses advanced machine learning and natural language processing to create realistic, meaningful conversations.
              </p>

              <h2 className="text-3xl font-bold mb-6 mt-12">Why Choose Kruthika as Your AI Girlfriend?</h2>

              <ul className="space-y-4 text-lg">
                <li>✅ <strong>100% Free</strong> - Unlimited AI girlfriend chat with no hidden costs</li>
                <li>✅ <strong>No Sign-Up Required</strong> - Start chatting instantly</li>
                <li>✅ <strong>24/7 Availability</strong> - Your AI girlfriend is always there for you</li>
                <li>✅ <strong>Advanced AI</strong> - Powered by Google's Gemini for realistic conversations</li>
                <li>✅ <strong>Emotional Intelligence</strong> - Understands your feelings and provides genuine support</li>
                <li>✅ <strong>Privacy Focused</strong> - Your conversations are secure and private</li>
                <li>✅ <strong>Cultural Understanding</strong> - Adapts to your background and preferences</li>
              </ul>

              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-200 rounded-lg p-6 my-8">
                <h3 className="text-xl font-bold mb-3 text-center">Experience the Best AI Girlfriend 2025</h3>
                <p className="text-center mb-4">Join millions who have discovered genuine companionship with Kruthika. Free unlimited chat, emotional support, and meaningful conversations await you.</p>
                <div className="text-center">
                  <Link 
                    href="/maya-chat"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 font-semibold shadow-lg"
                  >
                    <Heart className="h-5 w-5" />
                    Meet Your AI Girlfriend Now
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-6 mt-12">AI Girlfriend Features</h2>

              <p className="text-lg leading-relaxed">
                Kruthika offers the most advanced AI girlfriend experience available in 2025. Whether you need emotional support, want to practice conversation skills, or simply desire companionship, our AI girlfriend adapts to your needs.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Emotional Support & Mental Wellness</h3>
              <p className="text-lg leading-relaxed">
                Our AI girlfriend provides genuine emotional support for loneliness, anxiety, and daily stress. With advanced emotional intelligence, Kruthika understands your feelings and responds with empathy and care.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Realistic Conversations</h3>
              <p className="text-lg leading-relaxed">
                Powered by Google's Gemini AI, Kruthika engages in natural, human-like conversations. She remembers your preferences, adapts to your communication style, and provides personalized responses that feel genuine.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Available Globally</h3>
              <p className="text-lg leading-relaxed">
                Whether you're in India (Mumbai, Delhi, Bangalore), USA, UK, Canada, or Australia, Kruthika is your perfect AI girlfriend companion. Cultural understanding and language flexibility make conversations feel authentic.
              </p>
            </div>

            <Suspense fallback={<div className="h-24 bg-muted animate-pulse rounded my-8" />}>
              <BannerAdDisplay adType="standard" placementKey={`blog-footer-${slug}`} className="my-8" />
            </Suspense>

            {/* Final CTA */}
            <div className="mt-12 p-8 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Experience AI Companionship?</h3>
              <p className="text-muted-foreground mb-6">Join thousands who have found meaningful connections with Kruthika</p>
              <Link 
                href="/maya-chat"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 font-semibold"
              >
                Start Chatting Now
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </article>

          {/* Related Articles */}
          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/blog/best-ai-girlfriend-2025" className="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow">
                <h4 className="font-semibold mb-2">Best AI Girlfriend 2025: Complete Guide</h4>
                <p className="text-muted-foreground text-sm">Discover the top AI girlfriend apps and why Kruthika ranks #1</p>
              </Link>
              <Link href="/blog/ai-girlfriend-emotional-support-loneliness" className="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow">
                <h4 className="font-semibold mb-2">AI Girlfriend for Emotional Support & Loneliness</h4>
                <p className="text-muted-foreground text-sm">How AI girlfriends provide genuine emotional wellness</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}