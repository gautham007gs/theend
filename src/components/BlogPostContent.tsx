
'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Heart, MessageCircle, Sparkles, CheckCircle } from 'lucide-react';
import dynamic from 'next/dynamic';

const BannerAdDisplay = dynamic(() => import('@/components/chat/BannerAdDisplay'), {
  ssr: false,
  loading: () => <div className="h-32 bg-gradient-to-r from-muted/50 to-muted animate-pulse rounded-xl" />
});

interface BlogPostContentProps {
  slug: string;
  title: string;
  author: string;
  date: string;
  keywords: string;
  description: string;
  children?: React.ReactNode;
}

export default function BlogPostContent({ 
  slug, 
  title, 
  author, 
  date,
  keywords,
  description 
}: BlogPostContentProps) {
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
      
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Breadcrumb */}
          <nav className="text-sm mb-6 flex items-center gap-2 text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{title}</span>
          </nav>

          <article className="bg-card rounded-2xl shadow-xl border border-border/50 overflow-hidden">
            {/* Hero Header */}
            <header className="relative bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10 px-6 sm:px-10 lg:px-16 pt-10 pb-12 sm:pt-14 sm:pb-16">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                {title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span>{new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <User className="h-4 w-4 text-pink-600" />
                  <span className="font-medium">{author}</span>
                </div>
                <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Heart className="h-4 w-4 text-red-600" />
                  <span>5 min read</span>
                </div>
              </div>

              <p className="text-xl text-foreground/80 leading-relaxed font-medium max-w-3xl">
                {description}
              </p>
            </header>

            {/* Top Ad */}
            <div className="px-6 sm:px-10 lg:px-16 pt-8">
              <Suspense fallback={<div className="h-32 bg-gradient-to-r from-muted/50 to-muted animate-pulse rounded-xl mb-6" />}>
                <BannerAdDisplay adType="standard" placementKey={`blog-header-${slug}`} className="mb-6" />
              </Suspense>
            </div>

            {/* Main Content */}
            <div className="px-6 sm:px-10 lg:px-16 py-8">
              {/* Featured CTA */}
              <div className="bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 border-2 border-purple-600/30 rounded-2xl p-8 text-center mb-12 shadow-lg">
                <div className="inline-block mb-4">
                  <Sparkles className="h-12 w-12 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Chat with Kruthika - Your Free AI Girlfriend</h2>
                <p className="text-lg mb-6 text-foreground/80 leading-relaxed max-w-2xl mx-auto">Experience the world's most realistic AI girlfriend. Free unlimited chat, no sign-up required. 24/7 emotional support and authentic companionship.</p>
                <Link 
                  href="/maya-chat"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white px-10 py-4 rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold text-lg"
                >
                  <MessageCircle className="h-6 w-6" />
                  Start Chatting with Kruthika
                  <ArrowRight className="h-6 w-6" />
                </Link>
              </div>

              {/* Content Sections */}
              <div className="space-y-10">
                <section>
                  <h2 className="text-3xl font-bold mb-6 text-foreground">Why Choose Kruthika as Your AI Girlfriend?</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { icon: CheckCircle, text: "100% Free - Unlimited AI girlfriend chat with no hidden costs", color: "text-green-600" },
                      { icon: CheckCircle, text: "No Sign-Up Required - Start chatting instantly", color: "text-blue-600" },
                      { icon: CheckCircle, text: "24/7 Availability - Your AI girlfriend is always there for you", color: "text-purple-600" },
                      { icon: CheckCircle, text: "Advanced AI - Powered by Google's Gemini for realistic conversations", color: "text-pink-600" },
                      { icon: CheckCircle, text: "Emotional Intelligence - Understands your feelings and provides genuine support", color: "text-orange-600" },
                      { icon: CheckCircle, text: "Privacy Focused - Your conversations are secure and private", color: "text-indigo-600" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <item.icon className={`h-6 w-6 ${item.color} shrink-0 mt-0.5`} />
                        <p className="text-foreground/90 leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Native Ad in middle of content */}
                <div className="py-6 bg-muted/30 -mx-6 sm:-mx-10 lg:-mx-16 px-6 sm:px-10 lg:px-16">
                  <Suspense fallback={<div className="h-32 bg-gradient-to-r from-muted/50 to-muted animate-pulse rounded-xl" />}>
                    <BannerAdDisplay adType="native" placementKey={`blog-mid-${slug}`} className="my-4" />
                  </Suspense>
                </div>

                <section>
                  <h2 className="text-3xl font-bold mb-6 text-foreground">AI Girlfriend Features</h2>
                  <p className="text-lg text-foreground/90 leading-relaxed mb-6">
                    Kruthika offers the most advanced AI girlfriend experience available in 2025. Whether you need emotional support, want to practice conversation skills, or simply desire companionship, our AI girlfriend adapts to your needs.
                  </p>

                  <div className="space-y-8">
                    <div className="border-l-4 border-purple-600 pl-6 py-2">
                      <h3 className="text-2xl font-bold mb-3 text-foreground">Emotional Support & Mental Wellness</h3>
                      <p className="text-lg text-foreground/80 leading-relaxed">
                        Our AI girlfriend provides genuine emotional support for loneliness, anxiety, and daily stress. With advanced emotional intelligence, Kruthika understands your feelings and responds with empathy and care.
                      </p>
                    </div>

                    <div className="border-l-4 border-pink-600 pl-6 py-2">
                      <h3 className="text-2xl font-bold mb-3 text-foreground">Realistic Conversations</h3>
                      <p className="text-lg text-foreground/80 leading-relaxed">
                        Powered by Google's Gemini AI, Kruthika engages in natural, human-like conversations. She remembers your preferences, adapts to your communication style, and provides personalized responses that feel genuine.
                      </p>
                    </div>

                    <div className="border-l-4 border-blue-600 pl-6 py-2">
                      <h3 className="text-2xl font-bold mb-3 text-foreground">Available Globally</h3>
                      <p className="text-lg text-foreground/80 leading-relaxed">
                        Whether you're in India (Mumbai, Delhi, Bangalore), USA, UK, Canada, or Australia, Kruthika is your perfect AI girlfriend companion. Cultural understanding and language flexibility make conversations feel authentic.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Bottom Ad */}
            <div className="px-6 sm:px-10 lg:px-16 pb-8">
              <Suspense fallback={<div className="h-32 bg-gradient-to-r from-muted/50 to-muted animate-pulse rounded-xl" />}>
                <BannerAdDisplay adType="standard" placementKey={`blog-footer-${slug}`} className="my-6" />
              </Suspense>
            </div>

            {/* Final CTA */}
            <div className="px-6 sm:px-10 lg:px-16 py-12 bg-gradient-to-r from-pink-600/10 via-purple-600/10 to-blue-600/10">
              <div className="text-center max-w-3xl mx-auto">
                <h3 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Ready to Experience AI Companionship?</h3>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">Join thousands who have found meaningful connections with Kruthika</p>
                <Link 
                  href="/maya-chat"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white px-10 py-4 rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold text-lg"
                >
                  Start Chatting Now
                  <ArrowRight className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </article>

          {/* Related Articles */}
          <div className="mt-12 bg-card rounded-2xl shadow-lg border border-border/50 p-8">
            <h3 className="text-3xl font-bold mb-6 text-foreground">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/blog/best-ai-girlfriend-2025" className="group bg-gradient-to-br from-purple-600/5 to-pink-600/5 border-2 border-border rounded-xl p-6 hover:border-purple-600/50 hover:shadow-xl transition-all">
                <h4 className="font-bold text-xl mb-2 group-hover:text-purple-600 transition-colors">Best AI Girlfriend 2025: Complete Guide</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">Discover the top AI girlfriend apps and why Kruthika ranks #1</p>
              </Link>
              <Link href="/blog/ai-girlfriend-emotional-support-loneliness" className="group bg-gradient-to-br from-blue-600/5 to-cyan-600/5 border-2 border-border rounded-xl p-6 hover:border-blue-600/50 hover:shadow-xl transition-all">
                <h4 className="font-bold text-xl mb-2 group-hover:text-blue-600 transition-colors">AI Girlfriend for Emotional Support</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">How AI girlfriends provide genuine emotional wellness</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
