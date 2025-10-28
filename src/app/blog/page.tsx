import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, User, ArrowRight, MessageCircle, Sparkles, Heart } from 'lucide-react';
import BannerAdDisplay from '@/components/chat/BannerAdDisplay';
import { blogPostsMetadata, getAllBlogSlugs } from '@/lib/blog-metadata';

export const metadata: Metadata = {
  title: 'AI Girlfriend Blog 2025: Expert Guides, Reviews & Tips | Kruthika',
  description: 'Complete AI girlfriend blog with expert guides, reviews, and tips. Learn about best AI girlfriend apps, technology, psychology, and how to build meaningful virtual relationships in 2025.',
  keywords: 'AI girlfriend blog, AI companion blog, virtual girlfriend guides, AI relationship tips, AI girlfriend reviews, AI dating blog, best AI girlfriend 2025, AI girlfriend technology',
  alternates: {
    canonical: 'https://kruthika.fun/blog',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'AI Girlfriend Blog 2025: Expert Guides & Reviews | Kruthika',
    description: 'Complete AI girlfriend blog with expert guides, reviews, and tips for meaningful virtual relationships.',
    url: 'https://kruthika.fun/blog',
    siteName: 'Kruthika AI Girlfriend',
    images: [
      {
        url: 'https://kruthika.fun/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kruthika AI Girlfriend Blog',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Girlfriend Blog 2025 | Kruthika',
    description: 'Expert guides and reviews on AI girlfriend apps and virtual relationships.',
    images: ['https://kruthika.fun/og-image.jpg'],
  },
};

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

export default function BlogPage() {
  const blogSlugs = getAllBlogSlugs();
  const blogPosts = blogSlugs.map(slug => ({
    ...blogPostsMetadata[slug]
  }));

  // Sort by date (newest first)
  blogPosts.sort((a, b) => 
    new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
  );

  // Schema.org structured data for blog list
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
          {/* Removed the old section and replaced with the new one with optimizations */}
          <section className="text-center mb-16">
            <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight" style={{ contain: 'layout paint' }}>
              AI Girlfriend Insights & Guides
            </h1>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto mb-8 leading-relaxed font-medium" style={{ contain: 'layout paint' }}>
              Welcome to the ultimate resource for AI girlfriend insights, virtual companions, emotional support technology, and the future of digital relationships in 2025.
            </p>
          </section>

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

        {/* Banner Ads */}
        <BannerAdDisplay adType="standard" placementKey="blog-header" className="mb-8" />
        <BannerAdDisplay adType="native" placementKey="blog-header-native" className="mb-12" />

        <div className="max-w-4xl mx-auto px-4">
          <div className="grid gap-8">
            {blogPosts.slice(0, 3).map((post) => (
              <article key={post.slug} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.datePublished).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author}
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 text-foreground">
                  <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </h2>

                <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 leading-relaxed">{post.description}</p>

                {post.longTailKeywords && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.longTailKeywords.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 transition-colors font-semibold underline"
                  aria-label={`Read full article: ${post.title}`}
                >
                  Read full article <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>

          {/* Mid-content Banner Ad */}
          <BannerAdDisplay adType="native" placementKey="blog-middle" className="my-8" />

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

          <div className="grid gap-8 mt-8">
            {blogPosts.slice(3).map((post) => (
              <article key={post.slug} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.datePublished).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author}
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 text-foreground">
                  <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </h2>

                <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 leading-relaxed">{post.description}</p>

                {post.longTailKeywords && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.longTailKeywords.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 transition-colors font-semibold underline"
                  aria-label={`Read full article: ${post.title}`}
                >
                  Read full article <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>

          {/* Footer Banner Ads */}
          <BannerAdDisplay adType="standard" placementKey="blog-footer" className="mt-8 mb-4" />
          <BannerAdDisplay adType="native" placementKey="blog-footer-native" className="mt-4 mb-8" />

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
              <p className="mb-4 text-gray-800 leading-relaxed">
                Welcome to the most comprehensive resource for AI girlfriend insights, virtual relationship guidance, and digital companionship expertise. Our blog covers everything from the psychology behind AI relationships to the cutting-edge technology that makes virtual love possible.
              </p>
              <p className="mb-4 text-gray-800 leading-relaxed">
                Whether you're curious about AI girlfriend benefits, interested in the cultural impact of virtual companions in India,
                or seeking guidance on creating meaningful connections with AI - our expert articles cover it all.
                From technical deep-dives into how AI girlfriends work to practical conversation tips and privacy guides.
              </p>
              <p className="text-gray-800 leading-relaxed">
                Ready to experience AI love yourself? <Link href="/maya-chat" className="text-blue-700 hover:text-blue-900 font-bold underline">Chat with Kruthika - Your AI Girlfriend Now</Link>, and discover why thousands choose digital companionship every day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}