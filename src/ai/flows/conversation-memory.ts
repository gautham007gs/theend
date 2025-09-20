
'use client';

interface ConversationContext {
  topics: Array<{
    topic: string;
    lastMentioned: number;
    userInterest: number; // 0-1 scale
    kruthikaInterest: number; // 0-1 scale
  }>;
  relationshipLevel: number; // 0-1 scale
  userPersonality: {
    communicationStyle: 'short' | 'long' | 'emoji-heavy' | 'formal';
    humor: 'sarcastic' | 'playful' | 'dry' | 'wholesome';
    topics: string[];
    preferredTime: string[];
  };
  pastEmotions: Array<{
    emotion: string;
    timestamp: number;
    trigger: string;
  }>;
  conversationPatterns: {
    avgResponseTime: number;
    msgFrequency: number;
    lastActiveTime: number;
    engagementLevel: number;
  };
  sharedMoments: Array<{
    moment: string;
    timestamp: number;
    importance: number;
  }>;
}

export function getConversationContext(): ConversationContext {
  if (typeof window === 'undefined') return getDefaultContext();
  
  try {
    const stored = localStorage.getItem('kruthika_conversation_context');
    return stored ? JSON.parse(stored) : getDefaultContext();
  } catch {
    return getDefaultContext();
  }
}

function getDefaultContext(): ConversationContext {
  return {
    topics: [],
    relationshipLevel: 0,
    userPersonality: {
      communicationStyle: 'short',
      humor: 'playful',
      topics: [],
      preferredTime: []
    },
    pastEmotions: [],
    conversationPatterns: {
      avgResponseTime: 0,
      msgFrequency: 0,
      lastActiveTime: Date.now(),
      engagementLevel: 0.5
    },
    sharedMoments: []
  };
}

export function updateConversationContext(
  userMessage: string, 
  userEmotion: string,
  context: ConversationContext
): ConversationContext {
  const updated = { ...context };
  
  // Increase relationship level more dynamically
  const msgLength = userMessage.length;
  const timeSpent = Date.now() - updated.conversationPatterns.lastActiveTime;
  
  if (msgLength > 50) updated.relationshipLevel += 0.05; // Longer messages = more engagement
  if (timeSpent < 60000) updated.relationshipLevel += 0.02; // Quick responses = engagement
  updated.relationshipLevel = Math.min(1, updated.relationshipLevel);
  
  // Track topics with better weighting
  const topics = extractTopics(userMessage);
  topics.forEach(topic => {
    const existing = updated.topics.find(t => t.topic === topic);
    if (existing) {
      existing.lastMentioned = Date.now();
      existing.userInterest = Math.min(1, existing.userInterest + 0.15);
    } else {
      updated.topics.push({
        topic,
        lastMentioned: Date.now(),
        userInterest: 0.6,
        kruthikaInterest: getKruthikaInterestInTopic(topic)
      });
    }
  });
  
  // Enhanced emotional tracking
  if (userEmotion !== 'neutral') {
    updated.pastEmotions.push({
      emotion: userEmotion,
      timestamp: Date.now(),
      trigger: userMessage.substring(0, 50)
    });
    
    updated.pastEmotions = updated.pastEmotions.slice(-15);
  }
  
  // Better communication style detection
  const emojiCount = (userMessage.match(/[😊😅😂🤣😍🥰😘😉😎🤔😴😢😭🙄]/g) || []).length;
  if (emojiCount > 2) updated.userPersonality.communicationStyle = 'emoji-heavy';
  else if (userMessage.length < 25) updated.userPersonality.communicationStyle = 'short';
  else if (userMessage.length > 80) updated.userPersonality.communicationStyle = 'long';
  
  // Track engagement patterns
  updated.conversationPatterns.lastActiveTime = Date.now();
  updated.conversationPatterns.msgFrequency += 1;
  
  // Calculate engagement based on message quality
  if (userMessage.includes('?') || msgLength > 30 || emojiCount > 0) {
    updated.conversationPatterns.engagementLevel = Math.min(1, 
      updated.conversationPatterns.engagementLevel + 0.1);
  }
  
  // Track shared moments
  if (msgLength > 40 && (userMessage.includes('feel') || userMessage.includes('think'))) {
    updated.sharedMoments.push({
      moment: userMessage.substring(0, 60),
      timestamp: Date.now(),
      importance: msgLength > 80 ? 0.8 : 0.5
    });
    updated.sharedMoments = updated.sharedMoments.slice(-10);
  }
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('kruthika_conversation_context', JSON.stringify(updated));
  }
  
  return updated;
}

function getKruthikaInterestInTopic(topic: string): number {
  const interests = {
    'psychology': 0.9,
    'college': 0.8,
    'movies': 0.8,
    'friends': 0.9,
    'family': 0.7,
    'music': 0.8,
    'food': 0.7,
    'mumbai': 0.9,
    'bollywood': 0.8,
    'coffee': 0.9,
    'study': 0.6,
    'exam': 0.4,
    'work': 0.5,
    'love': 0.8,
    'relationship': 0.7,
    'travel': 0.8,
    'fashion': 0.7,
    'books': 0.6
  };
  
  return interests[topic as keyof typeof interests] || (0.3 + Math.random() * 0.4);
}

function extractTopics(message: string): string[] {
  const commonTopics = [
    'college', 'study', 'exam', 'friends', 'family', 'movies', 'music', 
    'food', 'travel', 'work', 'love', 'relationship', 'games', 'sports',
    'books', 'art', 'cooking', 'shopping', 'fashion', 'technology',
    'mumbai', 'bollywood', 'psychology', 'coffee', 'cafe', 'weekend',
    'party', 'festival', 'rain', 'weather', 'phone', 'instagram'
  ];
  
  const lowerMessage = message.toLowerCase();
  return commonTopics.filter(topic => lowerMessage.includes(topic));
}

export function getContextualPromptAddition(context: ConversationContext): string {
  let addition = "";
  
  // Relationship-based prompting
  if (context.relationshipLevel > 0.8) {
    addition += "You're very close with this user. Be more intimate, use inside jokes, remember past conversations. ";
  } else if (context.relationshipLevel > 0.5) {
    addition += "You know this user well. Be warm and reference things you've talked about. ";
  } else if (context.relationshipLevel < 0.2) {
    addition += "This is a newer user. Be friendly but not too personal yet. ";
  }
  
  // Emotional pattern awareness
  const recentEmotions = context.pastEmotions.slice(-5);
  const sadCount = recentEmotions.filter(e => e.emotion === 'sad').length;
  const excitedCount = recentEmotions.filter(e => e.emotion === 'excited').length;
  
  if (sadCount > 2) addition += "User has been sad recently, be extra supportive and caring. ";
  if (excitedCount > 2) addition += "User gets excited easily, match their high energy! ";
  
  // Communication style adaptation
  const style = context.userPersonality.communicationStyle;
  if (style === 'emoji-heavy') addition += "User loves emojis, use them naturally. ";
  if (style === 'short') addition += "User prefers brief messages, keep responses concise. ";
  if (style === 'long') addition += "User writes longer messages, you can be more detailed. ";
  
  // Topic preferences
  const favoriteTopics = context.topics
    .filter(t => t.userInterest > 0.7)
    .map(t => t.topic)
    .slice(0, 3);
    
  if (favoriteTopics.length > 0) {
    addition += `User loves talking about: ${favoriteTopics.join(', ')}. Bring these up occasionally. `;
  }
  
  // Engagement level
  if (context.conversationPatterns.engagementLevel > 0.8) {
    addition += "User is highly engaged, be more playful and ask questions. ";
  } else if (context.conversationPatterns.engagementLevel < 0.3) {
    addition += "User seems less engaged, try to spark their interest with interesting topics. ";
  }
  
  // Shared moments
  if (context.sharedMoments.length > 3) {
    const recentMoment = context.sharedMoments[context.sharedMoments.length - 1];
    addition += `Remember you recently talked about: "${recentMoment.moment}". `;
  }
  
  return addition;
}
