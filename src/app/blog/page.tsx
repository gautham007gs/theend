
'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Girlfriend Blog - Tips, Guides & Stories | Kruthika.fun',
  description: 'Read the latest articles about AI girlfriends, virtual relationships, and digital companionship. Expert insights on AI girlfriend technology, benefits, and the future of virtual love.',
  keywords: 'AI girlfriend blog, virtual relationship tips, AI companion guides, digital dating advice, AI girlfriend technology, virtual love stories, AI relationship blog',
};

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
  name: 'Kruthika.fun AI Girlfriend Blog',
  description: 'Expert insights on AI girlfriends, virtual relationships, and digital companionship technology.',
  url: 'https://kruthika.fun/blog',
  publisher: {
    '@type': 'Organization',
    name: 'Kruthika.fun',
  },
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
            <h1 className="text-4xl font-bold text-foreground mb-4">
              AI Girlfriend Blog - Virtual Relationships & Digital Love
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Expert insights into AI girlfriends, virtual companionship, and the future of digital relationships. Learn about AI girlfriend technology and virtual love stories.
            </p>
          </div>

          <div className="grid gap-8">
            {blogPosts.map((post) => (
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

          <div className="text-center mt-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Ready to Experience AI Girlfriend Companionship?</h3>
              <p className="text-muted-foreground">Join thousands of users who have found meaningful connections with their AI girlfriend Kruthika.</p>
              <Link 
                href="/maya-chat"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Meet Your AI Girlfriend Kruthika <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
