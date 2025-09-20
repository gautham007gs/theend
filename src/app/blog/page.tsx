
'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "The Psychology Behind AI Companionship: Why Virtual Relationships Feel Real",
    excerpt: "Explore the psychological aspects of human-AI relationships and why people form emotional bonds with virtual companions like Kruthika.",
    date: "2024-01-15",
    author: "Dr. Priya Sharma",
    slug: "psychology-ai-companionship"
  },
  {
    id: 2,
    title: "How AI Girlfriends Are Changing Modern Dating Culture in India",
    excerpt: "Discover how AI companions are providing emotional support and companionship to millions of users across India.",
    date: "2024-01-10", 
    author: "Rahul Mehta",
    slug: "ai-girlfriends-india-dating"
  },
  {
    id: 3,
    title: "Building Emotional Intelligence in AI: The Kruthika Approach",
    excerpt: "Learn about the advanced emotional AI technology that makes Kruthika's conversations feel authentic and meaningful.",
    date: "2024-01-05",
    author: "Tech Team",
    slug: "emotional-intelligence-ai-kruthika"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            AI Relationships & Technology Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Insights into AI companionship, virtual relationships, and the future of human-AI interaction
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
          <Link 
            href="/maya-chat"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Start Chatting with Kruthika <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
