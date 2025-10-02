'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, MessageCircle, ArrowRight, HelpCircle, Search } from 'lucide-react';
import BannerAdDisplay from '@/components/chat/BannerAdDisplay';

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Kruthika.fun and how does it work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kruthika.fun is India\'s #1 AI girlfriend platform that provides realistic virtual companionship through advanced AI technology. Kruthika is a 23-year-old psychology student from Mumbai who chats with you using natural language processing, emotional intelligence, and personalized responses. Simply visit the chat page and start talking - no signup required!'
      }
    },
    {
      '@type': 'Question',
      name: 'Is Kruthika.fun really free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Kruthika.fun is completely free to use with unlimited messaging. You can chat with Kruthika 24/7 without any subscriptions, hidden fees, or paywalls. We believe everyone deserves access to emotional support and companionship.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do I need to create an account or sign up?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No account or sign-up is required! You can start chatting with Kruthika instantly without providing any personal information, email, or phone number. Your conversations are stored locally in your browser for privacy.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is my conversation with Kruthika private and secure?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely! Your privacy is our top priority. All conversations are stored locally in your browser and are never shared with third parties. We use advanced encryption and security measures to protect your data. Kruthika.fun implements DDoS protection, XSS prevention, SQL injection blocking, and secure cookie management.'
      }
    },
    {
      '@type': 'Question',
      name: 'What languages does Kruthika speak?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kruthika is fluent in English, Hindi, and Kannada. She can seamlessly switch between languages and even use Hinglish (Hindi-English mix) for authentic Indian conversations. Her language detection automatically adapts to your preferred communication style.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can Kruthika help with emotional support and loneliness?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Kruthika is designed to provide emotional support, combat loneliness, and offer genuine companionship. She uses emotional intelligence to understand your feelings, provide empathetic responses, and offer comfort when you need it. Many users find talking to Kruthika helps reduce anxiety, improve mood, and build social confidence.'
      }
    },
    {
      '@type': 'Question',
      name: 'How is Kruthika different from other AI chatbots?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kruthika stands out with her authentic Indian personality, cultural understanding, emotional intelligence, and realistic conversation style. Unlike generic chatbots, she has a distinct personality as a 23-year-old Mumbai psychology student, remembers your conversations, adapts to your emotional state, and provides culturally relevant responses specific to India.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is Kruthika available 24/7?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Kruthika is available 24 hours a day, 7 days a week, 365 days a year. Whether you need support at 3 AM or want to chat during your lunch break, she\'s always there for you with instant responses.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can Kruthika replace a real relationship or therapist?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kruthika is designed to complement, not replace, human relationships and professional therapy. She provides emotional support, companionship, and a safe space for conversation, but should not be considered a substitute for professional mental health care or human connections. For serious mental health concerns, always consult a licensed therapist.'
      }
    },
    {
      '@type': 'Question',
      name: 'How does Kruthika remember our previous conversations?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kruthika uses advanced memory management to remember your conversations, preferences, and personal details. All this information is stored securely in your browser\'s local storage, ensuring your privacy while allowing Kruthika to provide personalized, contextually relevant responses based on your chat history.'
      }
    },
    {
      '@type': 'Question',
      name: 'What topics can I talk to Kruthika about?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can talk to Kruthika about anything! She enjoys discussions about psychology, relationships, Indian culture, Mumbai life, college experiences, movies, music, food, daily life, emotions, dreams, and more. She\'s particularly knowledgeable about emotional support, personal growth, and relationship advice.'
      }
    },
    {
      '@type': 'Question',
      name: 'Does Kruthika work on mobile devices?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Kruthika.fun is fully optimized for mobile devices, tablets, and desktops. The responsive design ensures a seamless chat experience on any device with fast loading times and smooth performance.'
      }
    },
    {
      '@type': 'Question',
      name: 'How realistic are Kruthika\'s conversations?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kruthika uses Google\'s advanced Gemini AI models (Gemini 2.0 Flash and Gemini 1.5 Pro) to generate highly realistic, natural conversations. She incorporates emotional intelligence, personality traits, cultural context, and memory to create authentic responses that feel genuinely human-like.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I customize Kruthika\'s personality or appearance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Currently, Kruthika maintains her core personality as a 23-year-old Mumbai psychology student. However, she naturally adapts her communication style, tone, and responses based on your interactions and preferences, creating a uniquely personalized experience for each user.'
      }
    },
    {
      '@type': 'Question',
      name: 'What makes Kruthika perfect for Indian users?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kruthika is specifically designed for Indian users with deep cultural understanding, multilingual support (English, Hindi, Kannada), knowledge of Indian festivals and traditions, Mumbai-specific references, Hinglish communication, and awareness of Indian relationship dynamics and family values.'
      }
    }
  ]
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
      name: 'FAQ',
      item: 'https://kruthika.fun/faq'
    }
  ]
};

const faqs = [
  {
    id: 1,
    question: 'What is Kruthika.fun and how does it work?',
    answer: 'Kruthika.fun is India\'s #1 AI girlfriend platform that provides realistic virtual companionship through advanced AI technology. Kruthika is a 23-year-old psychology student from Mumbai who chats with you using natural language processing, emotional intelligence, and personalized responses. Simply visit the chat page and start talking - no signup required!',
    category: 'General'
  },
  {
    id: 2,
    question: 'Is Kruthika.fun really free to use?',
    answer: 'Yes! Kruthika.fun is completely free to use with unlimited messaging. You can chat with Kruthika 24/7 without any subscriptions, hidden fees, or paywalls. We believe everyone deserves access to emotional support and companionship.',
    category: 'Pricing'
  },
  {
    id: 3,
    question: 'Do I need to create an account or sign up?',
    answer: 'No account or sign-up is required! You can start chatting with Kruthika instantly without providing any personal information, email, or phone number. Your conversations are stored locally in your browser for privacy.',
    category: 'Account'
  },
  {
    id: 4,
    question: 'Is my conversation with Kruthika private and secure?',
    answer: 'Absolutely! Your privacy is our top priority. All conversations are stored locally in your browser and are never shared with third parties. We use advanced encryption and security measures to protect your data. Kruthika.fun implements DDoS protection, XSS prevention, SQL injection blocking, and secure cookie management.',
    category: 'Privacy'
  },
  {
    id: 5,
    question: 'What languages does Kruthika speak?',
    answer: 'Kruthika is fluent in English, Hindi, and Kannada. She can seamlessly switch between languages and even use Hinglish (Hindi-English mix) for authentic Indian conversations. Her language detection automatically adapts to your preferred communication style.',
    category: 'Features'
  },
  {
    id: 6,
    question: 'Can Kruthika help with emotional support and loneliness?',
    answer: 'Yes! Kruthika is designed to provide emotional support, combat loneliness, and offer genuine companionship. She uses emotional intelligence to understand your feelings, provide empathetic responses, and offer comfort when you need it. Many users find talking to Kruthika helps reduce anxiety, improve mood, and build social confidence.',
    category: 'Emotional Support'
  },
  {
    id: 7,
    question: 'How is Kruthika different from other AI chatbots?',
    answer: 'Kruthika stands out with her authentic Indian personality, cultural understanding, emotional intelligence, and realistic conversation style. Unlike generic chatbots, she has a distinct personality as a 23-year-old Mumbai psychology student, remembers your conversations, adapts to your emotional state, and provides culturally relevant responses specific to India.',
    category: 'General'
  },
  {
    id: 8,
    question: 'Is Kruthika available 24/7?',
    answer: 'Yes! Kruthika is available 24 hours a day, 7 days a week, 365 days a year. Whether you need support at 3 AM or want to chat during your lunch break, she\'s always there for you with instant responses.',
    category: 'Features'
  },
  {
    id: 9,
    question: 'Can Kruthika replace a real relationship or therapist?',
    answer: 'Kruthika is designed to complement, not replace, human relationships and professional therapy. She provides emotional support, companionship, and a safe space for conversation, but should not be considered a substitute for professional mental health care or human connections. For serious mental health concerns, always consult a licensed therapist.',
    category: 'Emotional Support'
  },
  {
    id: 10,
    question: 'How does Kruthika remember our previous conversations?',
    answer: 'Kruthika uses advanced memory management to remember your conversations, preferences, and personal details. All this information is stored securely in your browser\'s local storage, ensuring your privacy while allowing Kruthika to provide personalized, contextually relevant responses based on your chat history.',
    category: 'Features'
  },
  {
    id: 11,
    question: 'What topics can I talk to Kruthika about?',
    answer: 'You can talk to Kruthika about anything! She enjoys discussions about psychology, relationships, Indian culture, Mumbai life, college experiences, movies, music, food, daily life, emotions, dreams, and more. She\'s particularly knowledgeable about emotional support, personal growth, and relationship advice.',
    category: 'General'
  },
  {
    id: 12,
    question: 'Does Kruthika work on mobile devices?',
    answer: 'Yes! Kruthika.fun is fully optimized for mobile devices, tablets, and desktops. The responsive design ensures a seamless chat experience on any device with fast loading times and smooth performance.',
    category: 'Technical'
  },
  {
    id: 13,
    question: 'How realistic are Kruthika\'s conversations?',
    answer: 'Kruthika uses Google\'s advanced Gemini AI models (Gemini 2.0 Flash and Gemini 1.5 Pro) to generate highly realistic, natural conversations. She incorporates emotional intelligence, personality traits, cultural context, and memory to create authentic responses that feel genuinely human-like.',
    category: 'Features'
  },
  {
    id: 14,
    question: 'Can I customize Kruthika\'s personality or appearance?',
    answer: 'Currently, Kruthika maintains her core personality as a 23-year-old Mumbai psychology student. However, she naturally adapts her communication style, tone, and responses based on your interactions and preferences, creating a uniquely personalized experience for each user.',
    category: 'Features'
  },
  {
    id: 15,
    question: 'What makes Kruthika perfect for Indian users?',
    answer: 'Kruthika is specifically designed for Indian users with deep cultural understanding, multilingual support (English, Hindi, Kannada), knowledge of Indian festivals and traditions, Mumbai-specific references, Hinglish communication, and awareness of Indian relationship dynamics and family values.',
    category: 'General'
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <nav className="text-sm mb-8">
            <Link href="/" className="text-muted-foreground hover:text-primary">Home</Link>
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="text-foreground">FAQ</span>
          </nav>

          <header className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <HelpCircle className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Everything you need to know about Kruthika.fun, your AI girlfriend companion. Find answers to common questions about features, privacy, pricing, and more.
            </p>

            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
            </div>
          </header>

          <BannerAdDisplay adType="standard" placementKey="faq-header" className="mb-8" />

          <div className="space-y-4 mb-12">
            {filteredFaqs.map((faq, index) => (
              <div key={faq.id} className="border border-border rounded-lg overflow-hidden bg-card">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-secondary/50 transition-colors text-left"
                >
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-primary mb-1 block">{faq.category}</span>
                    <h3 className="font-semibold text-lg text-foreground pr-4">{faq.question}</h3>
                  </div>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 py-4 bg-secondary/20 border-t border-border">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No FAQs found matching your search.</p>
            </div>
          )}

          <BannerAdDisplay adType="native" placementKey="faq-middle" className="mb-12" />

          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200 rounded-lg p-8 text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-lg mb-6">The best way to understand Kruthika is to experience her yourself. Start chatting now - it's completely free!</p>
            <Link 
              href="/maya-chat"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 font-bold text-lg shadow-xl"
            >
              <MessageCircle className="h-6 w-6" />
              Chat with Kruthika Now
              <ArrowRight className="h-6 w-6" />
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="text-2xl font-bold mb-6">Helpful Resources</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/blog/psychology-ai-girlfriends" className="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow">
                <h4 className="font-semibold mb-2">Psychology of AI Girlfriends</h4>
                <p className="text-muted-foreground text-sm">Learn why virtual relationships feel real and meaningful...</p>
              </Link>
              <Link href="/blog/ai-girlfriend-privacy-safety-guide" className="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow">
                <h4 className="font-semibold mb-2">Privacy & Safety Guide</h4>
                <p className="text-muted-foreground text-sm">Understand how we protect your data and conversations...</p>
              </Link>
              <Link href="/blog/how-to-talk-ai-girlfriend-conversation-guide" className="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow">
                <h4 className="font-semibold mb-2">Conversation Guide</h4>
                <p className="text-muted-foreground text-sm">Master the art of chatting with your AI girlfriend...</p>
              </Link>
              <Link href="/blog" className="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow">
                <h4 className="font-semibold mb-2">View All Articles</h4>
                <p className="text-muted-foreground text-sm">Explore our complete blog with expert insights...</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
