export function ChatStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Kruthika AI Girlfriend Chat",
    "applicationCategory": "SocialApplication",
    "operatingSystem": "Web, Android, iOS",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "description": "Chat with Kruthika, your AI girlfriend. Experience authentic conversations with natural language understanding, emotional intelligence, and personalized responses in English, Hindi, and Kannada.",
    "featureList": [
      "Real-time AI chat",
      "Image sharing",
      "Voice messages",
      "Multi-language support (English, Hindi, Kannada)",
      "Emotional intelligence",
      "Personality adaptation",
      "24/7 availability"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250",
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Organization",
      "name": "Kruthika.fun"
    },
    "datePublished": "2024-01-15",
    "screenshot": "https://kruthika.fun/og-image.png",
    "softwareVersion": "2.5.0",
    "applicationSubCategory": "AI Companion"
  };

  const conversationData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Kruthika AI Chat Interface",
    "description": "Advanced AI-powered chat interface featuring natural language processing, emotional intelligence, and multi-modal communication including text and images.",
    "applicationCategory": "CommunicationApplication",
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/CommentAction",
      "userInteractionCount": 50000
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(conversationData) }}
      />
    </>
  );
}
