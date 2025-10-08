'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface RelatedPost {
  title: string;
  slug: string;
  excerpt: string;
}

interface RelatedBlogPostsProps {
  posts: RelatedPost[];
}

export default function RelatedBlogPosts({ posts }: RelatedBlogPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="mt-16 pt-8 border-t border-border">
      <h2 className="text-3xl font-bold text-foreground mb-6">Related Articles</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}` as `/blog/${string}`}
            className="group block p-6 bg-secondary/30 hover:bg-secondary/50 rounded-lg transition-all duration-200 hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {post.excerpt}
            </p>
            <div className="flex items-center text-primary text-sm font-medium">
              Read More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
