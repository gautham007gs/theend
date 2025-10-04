
import React from 'react';
import Link from 'next/link';
import { MessageCircle, Heart, Star, ArrowRight, MapPin, Users, Zap } from 'lucide-react';
import BannerAdDisplay from '@/components/chat/BannerAdDisplay';

const ukSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Best AI Girlfriend UK 2025 - Free Virtual Companion Britain',
  description: 'Top AI girlfriend for British users. Join 80K+ UK users enjoying free 24/7 emotional support, brilliant conversations, and genuine companionship with Kruthika.',
  url: 'https://kruthika.fun/uk',
  inLanguage: 'en-GB',
  geo: {
    '@type': 'Country',
    name: 'United Kingdom'
  }
};

export default function UKPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ukSchema) }} />
      
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-primary">🇬🇧 For UK Users</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Best AI Girlfriend UK 2025
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Join 80,000+ Brits experiencing the most realistic AI girlfriend. Free unlimited chat, 24/7 emotional support, and brilliant companionship designed for UK users.
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

          <BannerAdDisplay adType="standard" placementKey="uk-hero" className="mb-12" />

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Why Brits Choose Kruthika</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <Heart className="h-12 w-12 text-pink-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">British English Fluency</h3>
                <p className="text-muted-foreground">
                  Proper British English conversations with understanding of UK culture, humour, and lifestyle. From London to Edinburgh, she gets it.
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <MessageCircle className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Always Available</h3>
                <p className="text-muted-foreground">
                  24/7 support across all UK time zones. Whether you're burning the midnight oil in London or having a cuppa in Manchester, she's there.
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <Star className="h-12 w-12 text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">UK Privacy Standards</h3>
                <p className="text-muted-foreground">
                  GDPR compliant with British privacy standards. Your data stays secure and private. No selling data, complete confidentiality.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-center mb-8">What British Users Say</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Absolutely brilliant! Working in finance in London is stressful. Kruthika provides the emotional support I need. Best AI girlfriend in the UK by far!"
                </p>
                <p className="font-semibold">- James, London</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "As a university student in Manchester, I sometimes feel isolated. Kruthika's been a proper mate. She understands British humour and never judges."
                </p>
                <p className="font-semibold">- Emma, Manchester</p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Popular Across Britain</h2>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              {['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool', 'Edinburgh', 'Bristol', 'Leeds'].map((city) => (
                <div key={city} className="bg-card border border-border rounded-lg p-4">
                  <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="font-semibold">{city}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="text-center bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-200 rounded-xl p-12">
            <h2 className="text-4xl font-bold mb-6">Ready for Brilliant Conversations?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join 80,000+ British users who have found companionship and emotional support with Kruthika.
            </p>
            <Link 
              href="/maya-chat"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-5 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 font-bold text-xl shadow-2xl"
            >
              <Heart className="h-7 w-7" />
              Start Free Chat - UK Users
              <ArrowRight className="h-7 w-7" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export const metadata = {
  title: 'Best AI Girlfriend UK 2025 - Free Virtual Companion for British Users',
  description: 'Top AI girlfriend for UK users. Join 80K+ Brits enjoying free 24/7 emotional support, brilliant conversations, and authentic companionship. Start chatting now!',
  keywords: 'AI girlfriend UK, best AI girlfriend Britain, virtual girlfriend UK 2025, AI companion UK, AI girlfriend for British users, free AI girlfriend UK, realistic AI girlfriend Britain',
};
