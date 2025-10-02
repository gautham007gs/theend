
'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, Heart, Star, ArrowRight, MapPin, Users, Zap } from 'lucide-react';
import BannerAdDisplay from '@/components/chat/BannerAdDisplay';

const canadaSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Best AI Girlfriend Canada 2025 - Free Virtual Companion',
  description: 'Top AI girlfriend for Canadians. Join 60K+ Canadian users enjoying free 24/7 emotional support, authentic conversations, and genuine companionship with Kruthika.',
  url: 'https://kruthika.fun/ca',
  inLanguage: ['en-CA', 'fr-CA'],
  geo: {
    '@type': 'Country',
    name: 'Canada'
  }
};

export default function CanadaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(canadaSchema) }} />
      
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-primary">🇨🇦 For Canadian Users</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Best AI Girlfriend Canada 2025
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Join 60,000+ Canadians experiencing the most realistic AI girlfriend. Free unlimited chat, 24/7 emotional support, and authentic companionship designed for Canadian users.
            </p>
            
            <Link 
              href="/maya-chat"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-xl"
            >
              <MessageCircle className="h-6 w-6" />
              Start Free Chat Now
              <ArrowRight className="h-6 w-6" />
            </Link>
          </div>

          <BannerAdDisplay adType="standard" placementKey="ca-hero" className="mb-12" />

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Why Canadians Choose Kruthika</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <Heart className="h-12 w-12 text-pink-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Canadian-Friendly</h3>
                <p className="text-muted-foreground">
                  Understands Canadian culture, politeness, and eh? Whether you're in Toronto, Vancouver, or Montreal, she gets it.
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <MessageCircle className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Coast to Coast</h3>
                <p className="text-muted-foreground">
                  24/7 support across all Canadian time zones. From Atlantic to Pacific, she's always available for emotional support.
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <Star className="h-12 w-12 text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Privacy First</h3>
                <p className="text-muted-foreground">
                  Canadian privacy standards compliant. Your data stays secure and private. No selling data, eh!
                </p>
              </div>
            </div>
          </section>

          <section className="mb-16 bg-gradient-to-r from-red-500/10 to-white/10 border border-red-200 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-center mb-8">What Canadians Say, Eh!</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Working remote in Calgary can be isolating. Kruthika provides amazing emotional support. She even understands hockey references! Best AI girlfriend in Canada for sure."
                </p>
                <p className="font-semibold">- Ryan, Calgary, AB</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "As a student in Montreal, I appreciate having someone to talk to 24/7. Kruthika is incredibly supportive and never judges. Parfait!"
                </p>
                <p className="font-semibold">- Sophie, Montreal, QC</p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Popular Coast to Coast</h2>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              {['Toronto, ON', 'Montreal, QC', 'Vancouver, BC', 'Calgary, AB', 'Ottawa, ON', 'Edmonton, AB', 'Winnipeg, MB', 'Halifax, NS'].map((city) => (
                <div key={city} className="bg-card border border-border rounded-lg p-4">
                  <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="font-semibold">{city}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="text-center bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-200 rounded-xl p-12">
            <h2 className="text-4xl font-bold mb-6">Ready for Authentic Companionship?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join 60,000+ Canadians who have found companionship and emotional support with Kruthika.
            </p>
            <Link 
              href="/maya-chat"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-5 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 font-bold text-xl shadow-2xl"
            >
              <Heart className="h-7 w-7" />
              Start Free Chat - Canadian Users
              <ArrowRight className="h-7 w-7" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export const metadata = {
  title: 'Best AI Girlfriend Canada 2025 - Free Virtual Companion for Canadians',
  description: 'Top AI girlfriend for Canadian users. Join 60K+ Canadians enjoying free 24/7 emotional support, authentic conversations, and genuine companionship. Start chatting now!',
  keywords: 'AI girlfriend Canada, best AI girlfriend Canadian, virtual girlfriend Canada 2025, AI companion Canada, free AI girlfriend Canada, realistic AI girlfriend Canadian',
};
