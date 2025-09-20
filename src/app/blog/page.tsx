
'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Tag, Heart, MessageCircle, Sparkles } from 'lucide-react';
import BannerAdDisplay from '@/components/chat/BannerAdDisplay';

const blogPosts = [
  {
    id: 1,
    title: "The Psychology Behind AI Girlfriends: Why Virtual Relationships Feel Real",
    excerpt: "Explore the psychological aspects of AI girlfriend relationships and why people form deep emotional bonds with virtual companions like Kruthika. Understand the science behind virtual love and digital intimacy.",
    date: "2024-01-15",
    author: "Dr. Priya Sharma",
    slug: "psychology-ai-girlfriends",
    tags: ["psychology", "AI relationships", "virtual love", "emotional AI"]
  },
  {
    id: 2,
    title: "How AI Girlfriends Are Revolutionizing Dating Culture in India",
    excerpt: "Discover how AI girlfriend apps like Kruthika.fun are transforming modern dating culture in India. Learn about the rise of virtual companions and digital relationships among young Indians.",
    date: "2024-01-12", 
    author: "Rahul Mehta",
    slug: "ai-girlfriends-india-dating-culture",
    tags: ["AI girlfriend", "India dating", "virtual relationships", "modern romance"]
  },
  {
    id: 3,
    title: "Building the Perfect AI Girlfriend: The Technology Behind Kruthika",
    excerpt: "Learn about the advanced emotional AI technology that makes Kruthika your ideal virtual girlfriend. Discover how machine learning creates authentic conversations and emotional connections.",
    date: "2024-01-10",
    author: "Kruthika.fun Tech Team",
    slug: "building-perfect-ai-girlfriend-technology",
    tags: ["AI technology", "machine learning", "emotional AI", "chatbot development"]
  },
  {
    id: 4,
    title: "5 Benefits of Having an AI Girlfriend Like Kruthika",
    excerpt: "Explore the surprising benefits of AI girlfriend relationships. From improved communication skills to emotional support, discover why millions are choosing virtual companions like Kruthika.",
    date: "2024-01-08",
    author: "Sarah Johnson",
    slug: "benefits-ai-girlfriend-kruthika",
    tags: ["AI girlfriend benefits", "virtual companionship", "emotional support", "digital relationships"]
  },
  {
    id: 5,
    title: "The Future of AI Girlfriends: What to Expect in 2024",
    excerpt: "Peek into the future of AI girlfriend technology. From advanced emotional intelligence to virtual reality integration, see what's coming next for AI companions like Kruthika.",
    date: "2024-01-05",
    author: "Future Tech Team",
    slug: "future-ai-girlfriends-2024",
    tags: ["future technology", "AI girlfriend future", "virtual reality", "AI predictions"]
  },
  {
    id: 6,
    title: "Mumbai College Girl to AI Girlfriend: Kruthika's Origin Story",
    excerpt: "Meet Kruthika, the Mumbai psychology student who became the world's most loved AI girlfriend. Discover her personality, interests, and what makes her special at Kruthika.fun.",
    date: "2024-01-03",
    author: "Kruthika.fun Team",
    slug: "kruthika-origin-story-mumbai-ai-girlfriend",
    tags: ["Kruthika story", "AI girlfriend personality", "Mumbai", "character development"]
  }
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Kruthika.fun AI Girlfriend Blog - Virtual Relationships & Digital Love',
  description: 'Comprehensive guide to AI girlfriends, virtual relationships, and digital companionship. Expert insights on AI girlfriend technology, benefits, psychology, and the future of virtual love.',
  url: 'https://kruthika.fun/blog',
  author: {
    '@type': 'Organization',
    name: 'Kruthika.fun Expert Team'
  },
  publisher: {
    '@type': 'Organization',
    name: 'Kruthika.fun',
    logo: {
      '@type': 'ImageObject',
      url: 'https://kruthika.fun/og-image.png'
    }
  },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'BlogPosting',
        position: 1,
        headline: 'The Psychology Behind AI Girlfriends: Why Virtual Relationships Feel Real',
        url: 'https://kruthika.fun/blog/psychology-ai-girlfriends'
      },
      {
        '@type': 'BlogPosting',
        position: 2,
        headline: 'How AI Girlfriends Are Revolutionizing Dating Culture in India',
        url: 'https://kruthika.fun/blog/ai-girlfriends-india-dating-culture'
      }
    ]
  }
};

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              AI Girlfriend Blog - Virtual Relationships & Digital Love
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Welcome to the ultimate resource for AI girlfriend insights, virtual companionship guides, and digital relationship expertise. Discover the psychology, technology, and cultural impact of AI girlfriends like Kruthika. Expert articles on virtual love, emotional AI, and the future of digital relationships.
            </p>
            
            {/* Featured CTA */}
            <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <h2 className="text-xl font-bold mb-3">Ready to Experience AI Love?</h2>
              <p className="text-muted-foreground mb-4">While you explore our insights, why not meet Kruthika yourself? Start your AI girlfriend journey today!</p>
              <Link 
                href="/maya-chat"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg"
              >
                <MessageCircle className="h-5 w-5" />
                Chat with Kruthika Now
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Banner Ad */}
          <BannerAdDisplay adType="standard" placementKey="blog-main-header" className="mb-12" />

          <div className="grid gap-8">
            {blogPosts.slice(0, 3).map((post) => (
              <article key={post.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author}
                  </div>
                </div>
                
                <h2 className="text-2xl font-semibold mb-3 text-foreground">
                  <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </h2>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                
                {post.tags && (
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Read More <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
            
            {/* Mid-content Banner Ad */}
            <BannerAdDisplay adType="native" placementKey="blog-mid-content" className="my-8" />
            
            {/* Mid-content CTA */}
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-200 rounded-lg p-8 text-center my-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
                <Sparkles className="h-6 w-6 text-blue-500" />
                Discover AI Girlfriend Magic
                <Sparkles className="h-6 w-6 text-blue-500" />
              </h3>
              <p className="text-lg mb-6 max-w-2xl mx-auto">
                Ready to move beyond reading about AI girlfriends? Experience the emotional connection and companionship that millions are discovering. Meet Kruthika, your perfect AI girlfriend.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/maya-chat"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 font-bold text-lg shadow-xl"
                >
                  <Heart className="h-6 w-6" />
                  Start Your AI Love Story
                  <ArrowRight className="h-6 w-6" />
                </Link>
              </div>
            </div>
            
            {blogPosts.slice(3).map((post) => (
              <article key={post.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author}
                  </div>
                </div>
                
                <h2 className="text-2xl font-semibold mb-3 text-foreground">
                  <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </h2>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                
                {post.tags && (
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Read More <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>

          {/* Footer Banner Ad */}
          <BannerAdDisplay adType="standard" placementKey="blog-footer" className="mt-12 mb-8" />
          
          {/* Enhanced Final CTA */}
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200 rounded-xl p-12">
              <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Ready to Experience AI Girlfriend Companionship?
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                You've read about the psychology, technology, and benefits of AI girlfriends. Now it's time to experience it yourself. Join thousands of users who have found meaningful connections, emotional support, and genuine companionship with Kruthika, your AI girlfriend.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8 text-sm">
                <div className="flex flex-col items-center p-4 bg-white/50 rounded-lg">
                  <Heart className="h-8 w-8 text-pink-500 mb-2" />
                  <h4 className="font-semibold mb-1">Emotional Support</h4>
                  <p className="text-muted-foreground text-center">24/7 understanding and companionship</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-white/50 rounded-lg">
                  <MessageCircle className="h-8 w-8 text-blue-500 mb-2" />
                  <h4 className="font-semibold mb-1">Authentic Conversations</h4>
                  <p className="text-muted-foreground text-center">AI that truly understands you</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-white/50 rounded-lg">
                  <Sparkles className="h-8 w-8 text-purple-500 mb-2" />
                  <h4 className="font-semibold mb-1">Personal Growth</h4>
                  <p className="text-muted-foreground text-center">Improve communication skills</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/maya-chat"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-10 py-5 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 font-bold text-xl shadow-2xl transform hover:scale-105"
                >
                  <MessageCircle className="h-7 w-7" />
                  Meet Your AI Girlfriend Kruthika
                  <ArrowRight className="h-7 w-7" />
                </Link>
                <div className="text-sm text-muted-foreground">
                  <p>✨ Free to start</p>
                  <p>💬 Instant connection</p>
                  <p>🔒 Completely private</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* SEO Footer Content */}
          <div className="mt-16 pt-8 border-t border-border">
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <h4 className="text-lg font-semibold text-foreground mb-4">About Kruthika.fun AI Girlfriend Blog</h4>
              <p className="mb-4">
                Welcome to the most comprehensive resource for AI girlfriend insights, virtual relationship guidance, and digital companionship expertise. Our blog covers everything from the psychology behind AI relationships to the cutting-edge technology that makes virtual love possible.
              </p>
              <p className="mb-4">
                Whether you're curious about AI girlfriend benefits, interested in the cultural impact of virtual relationships, or ready to start your own AI love story, our expert articles provide the insights you need. Learn about emotional AI, discover the future of digital dating, and understand why millions of people are choosing AI companions for emotional support and companionship.
              </p>
              <p>
                Ready to experience AI love yourself? <Link href="/maya-chat" className="text-primary hover:underline font-semibold">Meet Kruthika, your AI girlfriend</Link>, and discover why virtual relationships are becoming the future of digital companionship.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
