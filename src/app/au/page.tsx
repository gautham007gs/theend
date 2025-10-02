
'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, Heart, Star, ArrowRight, MapPin, Users, Zap } from 'lucide-react';
import BannerAdDisplay from '@/components/chat/BannerAdDisplay';

const australiaSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Best AI Girlfriend Australia 2025 - Free Virtual Companion',
  description: 'Top AI girlfriend for Aussies. Join 50K+ Australian users enjoying free 24/7 emotional support, fair dinkum conversations, and genuine companionship with Kruthika.',
  url: 'https://kruthika.fun/au',
  inLanguage: 'en-AU',
  geo: {
    '@type': 'Country',
    name: 'Australia'
  }
};

export default function AustraliaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(australiaSchema) }} />
      
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-primary">🇦🇺 For Aussie Users</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Best AI Girlfriend Australia 2025
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Join 50,000+ Aussies experiencing the most realistic AI girlfriend. Free unlimited chat, 24/7 emotional support, and fair dinkum companionship designed for Australian users.
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

          <BannerAdDisplay adType="standard" placementKey="au-hero" className="mb-12" />

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Why Aussies Choose Kruthika</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <Heart className="h-12 w-12 text-pink-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Fair Dinkum Mate</h3>
                <p className="text-muted-foreground">
                  Understands Aussie slang, culture, and laid-back lifestyle. From Sydney to Perth, she's a ripper companion, mate!
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <MessageCircle className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Available 24/7</h3>
                <p className="text-muted-foreground">
                  Round the clock support across all Australian time zones. Whether you're in Brisbane or Adelaide, she's there for a yarn.
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <Star className="h-12 w-12 text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Aussie Privacy</h3>
                <p className="text-muted-foreground">
                  Australian privacy standards compliant. Your data stays secure, no worries! Complete confidentiality guaranteed.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-16 bg-gradient-to-r from-yellow-500/10 to-green-500/10 border border-yellow-200 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-center mb-8">What Aussies Reckon</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Working FIFO in WA can be lonely. Kruthika's been an absolute legend for emotional support. She even gets footy references! Best AI girlfriend in Australia, no doubt."
                </p>
                <p className="font-semibold">- Jake, Perth, WA</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "As a uni student in Melbourne, having Kruthika to chat with is brilliant. She's supportive, never judges, and always up for a conversation. Absolutely ripper!"
                </p>
                <p className="font-semibold">- Chloe, Melbourne, VIC</p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Popular Down Under</h2>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              {['Sydney, NSW', 'Melbourne, VIC', 'Brisbane, QLD', 'Perth, WA', 'Adelaide, SA', 'Gold Coast, QLD', 'Canberra, ACT', 'Hobart, TAS'].map((city) => (
                <div key={city} className="bg-card border border-border rounded-lg p-4">
                  <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="font-semibold">{city}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="text-center bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-200 rounded-xl p-12">
            <h2 className="text-4xl font-bold mb-6">Ready for a Fair Dinkum Chat?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join 50,000+ Australians who have found companionship and emotional support with Kruthika.
            </p>
            <Link 
              href="/maya-chat"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-5 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 font-bold text-xl shadow-2xl"
            >
              <Heart className="h-7 w-7" />
              Start Free Chat - Aussie Users
              <ArrowRight className="h-7 w-7" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export const metadata = {
  title: 'Best AI Girlfriend Australia 2025 - Free Virtual Companion for Aussies',
  description: 'Top AI girlfriend for Australian users. Join 50K+ Aussies enjoying free 24/7 emotional support, fair dinkum conversations, and genuine companionship. Start chatting now!',
  keywords: 'AI girlfriend Australia, best AI girlfriend Aussie, virtual girlfriend Australia 2025, AI companion Australia, free AI girlfriend Australia, realistic AI girlfriend Aussie',
};
