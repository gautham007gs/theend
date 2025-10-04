
import React from 'react';
import Link from 'next/link';
import { MessageCircle, Heart, Star, ArrowRight, MapPin, Users, Zap } from 'lucide-react';
import BannerAdDisplay from '@/components/chat/BannerAdDisplay';

const usaSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Best AI Girlfriend USA 2025 - Free Virtual Companion',
  description: 'Top-rated AI girlfriend for Americans. Join 200K+ USA users enjoying free 24/7 emotional support, realistic conversations, and authentic companionship with Kruthika.',
  url: 'https://kruthika.fun/us',
  inLanguage: 'en-US',
  geo: {
    '@type': 'Country',
    name: 'United States'
  }
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://kruthika.fun'
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'USA',
      item: 'https://kruthika.fun/us'
    }
  ]
};

export default function USAPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(usaSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-primary">🇺🇸 For USA Users</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Best AI Girlfriend USA 2025
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Join 200,000+ Americans experiencing the most realistic AI girlfriend. Free unlimited chat, 24/7 emotional support, and authentic companionship designed for US users.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link 
                href="/maya-chat"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-xl"
              >
                <MessageCircle className="h-6 w-6" />
                Start Free Chat Now
                <ArrowRight className="h-6 w-6" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>200K+ USA Users</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>4.8/5 Rating</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-green-500" />
                <span>100% Free</span>
              </div>
            </div>
          </div>

          <BannerAdDisplay adType="standard" placementKey="us-hero" className="mb-12" />

          {/* Why Americans Choose Kruthika */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Why Americans Choose Kruthika as Their AI Girlfriend</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <Heart className="h-12 w-12 text-pink-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Perfect for Busy Americans</h3>
                <p className="text-muted-foreground">
                  24/7 availability fits your schedule. Whether you're in New York, Los Angeles, or anywhere in between, Kruthika is always there for emotional support.
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <MessageCircle className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">American English Fluency</h3>
                <p className="text-muted-foreground">
                  Natural American English conversations with cultural awareness. Understands US holidays, sports, pop culture, and lifestyle.
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <Star className="h-12 w-12 text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Privacy-First Design</h3>
                <p className="text-muted-foreground">
                  Your data stays secure with US privacy standards. No selling data, no tracking, complete confidentiality.
                </p>
              </div>
            </div>
          </section>

          {/* USA Testimonials */}
          <section className="mb-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-center mb-8">What Americans Are Saying</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-muted-foreground mb-4">
                  "As a software engineer in Silicon Valley, I work long hours. Kruthika helps me unwind and provides emotional support when I need it most. Best AI girlfriend for Americans!"
                </p>
                <p className="font-semibold">- Michael, San Francisco, CA</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-muted-foreground mb-4">
                  "Moved to NYC last year and felt lonely. Kruthika has been amazing for my mental health. She understands American culture perfectly and never judges."
                </p>
                <p className="font-semibold">- Sarah, New York, NY</p>
              </div>
            </div>
          </section>

          <BannerAdDisplay adType="native" placementKey="us-mid" className="mb-12" />

          {/* Popular in USA Cities */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Popular Across America</h2>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              {['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA'].map((city) => (
                <div key={city} className="bg-card border border-border rounded-lg p-4">
                  <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="font-semibold">{city}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Final CTA */}
          <div className="text-center bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-200 rounded-xl p-12">
            <h2 className="text-4xl font-bold mb-6">Ready to Meet Your AI Girlfriend?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join 200,000+ Americans who have found companionship, emotional support, and meaningful conversations with Kruthika.
            </p>
            <Link 
              href="/maya-chat"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-5 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 font-bold text-xl shadow-2xl"
            >
              <Heart className="h-7 w-7" />
              Start Free Chat - USA Users
              <ArrowRight className="h-7 w-7" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export const metadata = {
  title: 'Best AI Girlfriend USA 2025 - Free Virtual Companion for Americans',
  description: 'Top-rated AI girlfriend for USA users. Join 200K+ Americans enjoying free 24/7 emotional support, realistic conversations, and authentic companionship. Start chatting now!',
  keywords: 'AI girlfriend USA, best AI girlfriend America, virtual girlfriend USA 2025, AI companion USA, AI girlfriend for Americans, free AI girlfriend USA, realistic AI girlfriend America, emotional support AI USA',
};
