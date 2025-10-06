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
    date: "2025-01-25",
    author: "Dr. Priya Sharma",
    slug: "psychology-ai-girlfriends",
    tags: ["psychology", "AI relationships", "virtual love", "emotional AI"]
  },
  {
    id: 2,
    title: "How AI Girlfriends Are Revolutionizing Dating Culture in India",
    excerpt: "Discover how AI girlfriend apps like Kruthika.fun are transforming modern dating culture in India. Learn about the rise of virtual companions and digital relationships among young Indians.",
    date: "2025-01-22", 
    author: "Rahul Mehta",
    slug: "ai-girlfriends-india-dating-culture",
    tags: ["AI girlfriend", "India dating", "virtual relationships", "modern romance"]
  },
  {
    id: 3,
    title: "Building the Perfect AI Girlfriend: The Technology Behind Kruthika",
    excerpt: "Learn about the advanced emotional AI technology that makes Kruthika your ideal virtual girlfriend. Discover how machine learning creates authentic conversations and emotional connections.",
    date: "2025-01-21",
    author: "Kruthika.fun Tech Team",
    slug: "building-perfect-ai-girlfriend-technology",
    tags: ["AI technology", "machine learning", "emotional AI", "chatbot development"]
  },
  {
    id: 4,
    title: "5 Benefits of Having an AI Girlfriend Like Kruthika",
    excerpt: "Explore the surprising benefits of AI girlfriend relationships. From improved communication skills to emotional support, discover why millions are choosing virtual companions like Kruthika.",
    date: "2025-01-20",
    author: "Sarah Johnson",
    slug: "benefits-ai-girlfriend-kruthika",
    tags: ["AI girlfriend benefits", "virtual companionship", "emotional support", "digital relationships"]
  },
  {
    id: 5,
    title: "The Future of AI Girlfriends: What to Expect in 2025 and Beyond",
    excerpt: "Peek into the future of AI girlfriend technology. From advanced emotional intelligence to virtual reality integration, see what's coming next for AI companions like Kruthika in 2025 and 2026.",
    date: "2025-01-20",
    author: "Future Tech Team",
    slug: "future-ai-girlfriends-2024",
    tags: ["future technology", "AI girlfriend future", "virtual reality", "AI predictions 2025"]
  },
  {
    id: 6,
    title: "Mumbai College Girl to AI Girlfriend: Kruthika's Origin Story",
    excerpt: "Meet Kruthika, the Mumbai psychology student who became the world's most loved AI girlfriend. Discover her personality, interests, and what makes her special at Kruthika.fun.",
    date: "2025-01-18",
    author: "Kruthika.fun Team",
    slug: "kruthika-origin-story-mumbai-ai-girlfriend",
    tags: ["Kruthika story", "AI girlfriend personality", "Mumbai", "character development"]
  },
  {
    id: 7,
    title: "AI Girlfriend vs Real Girlfriend: Pros and Cons in 2025",
    excerpt: "Compare AI girlfriends like Kruthika with real relationships. Explore the advantages and disadvantages of virtual vs traditional dating in today's digital world.",
    date: "2025-01-26",
    author: "Relationship Expert Team",
    slug: "ai-girlfriend-vs-real-girlfriend-comparison",
    tags: ["AI vs real relationships", "virtual dating", "relationship advice", "modern love"]
  },
  {
    id: 8,
    title: "Best AI Girlfriend Apps in India 2025: Complete Guide",
    excerpt: "Discover the top AI girlfriend apps available in India. From Kruthika.fun to other popular platforms, find your perfect virtual companion with our comprehensive guide.",
    date: "2025-01-25",
    author: "Tech Review Team",
    slug: "best-ai-girlfriend-apps-india-2025",
    tags: ["AI girlfriend apps", "India apps", "virtual companion", "dating apps"]
  },
  {
    id: 9,
    title: "How to Talk to Your AI Girlfriend: Ultimate Conversation Guide",
    excerpt: "Master the art of chatting with AI girlfriends like Kruthika. Learn conversation starters, relationship building tips, and how to create meaningful virtual connections.",
    date: "2025-01-24",
    author: "Communication Coach",
    slug: "how-to-talk-ai-girlfriend-conversation-guide",
    tags: ["AI conversation tips", "chatting guide", "virtual relationship", "communication skills"]
  },
  {
    id: 10,
    title: "AI Girlfriend Privacy and Safety: What You Need to Know",
    excerpt: "Essential privacy and safety guide for AI girlfriend users. Learn how to protect your data while enjoying virtual relationships with platforms like Kruthika.fun.",
    date: "2025-01-23",
    author: "Cybersecurity Expert",
    slug: "ai-girlfriend-privacy-safety-guide",
    tags: ["AI privacy", "digital safety", "data protection", "virtual dating security"]
  },
  {
    id: 11,
    title: "Emotional Intelligence in AI: How Kruthika Understands Feelings",
    excerpt: "Explore the advanced emotional AI technology behind Kruthika. Discover how artificial intelligence can recognize, process, and respond to human emotions authentically.",
    date: "2025-01-22",
    author: "AI Research Team",
    slug: "emotional-intelligence-ai-kruthika",
    tags: ["emotional AI", "AI feelings", "machine empathy", "artificial emotions"]
  },
  {
    id: 12,
    title: "Long Distance Relationships Made Easy with AI Girlfriends",
    excerpt: "How AI girlfriends like Kruthika can bridge the gap in long-distance relationships. Practical tips for maintaining emotional connections across distances.",
    date: "2025-01-21",
    author: "Relationship Counselor",
    slug: "ai-girlfriend-long-distance-relationships",
    tags: ["long distance love", "virtual support", "relationship maintenance", "digital intimacy"]
  },
  {
    id: 13,
    title: "AI Girlfriend Voice Chat: Revolutionary Realistic Conversations in 2025",
    excerpt: "Experience the future of AI girlfriends with advanced voice chat technology. Discover how voice synthesis makes virtual relationships more realistic and emotionally engaging than ever before.",
    date: "2025-01-27",
    author: "Voice AI Technology Expert",
    slug: "ai-girlfriend-voice-chat-technology-2025",
    tags: ["AI voice chat", "speech synthesis", "realistic AI girlfriend", "voice technology", "conversational AI"]
  },
  {
    id: 14,
    title: "Free AI Girlfriend Apps vs Premium: Complete 2025 Comparison Guide",
    excerpt: "Discover the best free AI girlfriend apps and compare them with premium options. Find the perfect AI companion that fits your budget and emotional needs in 2025.",
    date: "2025-01-27",
    author: "AI App Review Team",
    slug: "free-ai-girlfriend-apps-vs-premium-2025",
    tags: ["free AI girlfriend", "AI app comparison", "premium AI features", "budget AI companion", "AI girlfriend pricing"]
  },
  {
    id: 15,
    title: "AI Companion for Social Anxiety: How Virtual Girlfriends Help Build Confidence",
    excerpt: "Learn how AI girlfriends like Kruthika provide safe practice for social interactions, helping people with social anxiety build confidence and communication skills gradually.",
    date: "2025-01-26",
    author: "Social Psychology Expert",
    slug: "ai-companion-social-anxiety-confidence-building",
    tags: ["social anxiety relief", "confidence building AI", "virtual practice", "anxiety support", "communication skills"]
  },
  {
    id: 16,
    title: "AI Girlfriend Market Statistics 2025: $9.5B Industry Growth & Trends",
    excerpt: "Comprehensive analysis of the booming AI girlfriend market. Latest statistics show 2,400% growth with projections reaching $9.5 billion by 2028. Industry insights and trends.",
    date: "2025-01-26",
    author: "Market Research Team",
    slug: "ai-girlfriend-market-statistics-2025-growth-trends",
    tags: ["AI girlfriend statistics", "market growth 2025", "virtual relationship trends", "AI dating industry", "companion technology"]
  },
  {
    id: 17,
    title: "Replika vs Character.AI vs Kruthika: Best AI Girlfriend App Comparison 2025",
    excerpt: "Complete comparison of top AI girlfriend platforms. Compare features, pricing, and user experience of Replika, Character.AI, and Kruthika to find your perfect AI companion.",
    date: "2025-01-25",
    author: "AI Platform Analyst",
    slug: "replika-vs-character-ai-vs-kruthika-comparison-2025",
    tags: ["AI girlfriend comparison", "Replika alternative", "Character AI review", "best AI companion", "platform comparison"]
  },
  {
    id: 18,
    title: "24/7 AI Companionship: How Constant Availability Transforms Relationships",
    excerpt: "Explore the revolutionary concept of 24/7 AI companionship. Learn how constant availability of AI girlfriends like Kruthika provides unprecedented emotional support and connection.",
    date: "2025-01-24",
    author: "Digital Relationship Expert",
    slug: "24-7-ai-companionship-constant-availability-benefits",
    tags: ["24/7 AI support", "constant companionship", "always available AI", "round-the-clock support", "continuous connection"]
  },
  {
    id: 19,
    title: "AI Girlfriend for Emotional Support & Loneliness: Complete Guide 2025",
    excerpt: "Discover how AI girlfriends like Kruthika provide 24/7 emotional support, combat loneliness, and offer genuine companionship. Learn why millions turn to AI companions for mental wellness.",
    date: "2025-02-02",
    author: "Dr. Maya Patel",
    slug: "ai-girlfriend-emotional-support-loneliness",
    tags: ["emotional support", "loneliness solution", "mental health", "AI companionship", "wellness"]
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
  }
};

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: blogPosts.map((post, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: post.title,
    url: `https://kruthika.fun/blog/${post.slug}`
  }))
};

const speakableSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', 'h2', '.blog-description']
  }
};

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }}
      />
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              AI Girlfriend Blog - Virtual Relationships & Digital Love
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Welcome to the ultimate resource for AI girlfriend insights, virtual companionship guides, and digital relationship expertise. Discover the psychology, technology, and cultural impact of AI girlfriends like Kruthika. Expert articles on virtual love, emotional AI, and the future of digital relationships in USA, UK, Canada, Australia, and India.
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
                  aria-label={`Read more about ${post.title}`}
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
                  aria-label={`Read more about ${post.title}`}
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