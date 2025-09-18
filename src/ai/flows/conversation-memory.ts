
'use server';

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
  };
  pastEmotions: Array<{
    emotion: string;
    timestamp: number;
    trigger: string;
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
      topics: []
    },
    pastEmotions: []
  };
}

export function updateConversationContext(
  userMessage: string, 
  userEmotion: string,
  context: ConversationContext
): ConversationContext {
  const updated = { ...context };
  
  // Increase relationship level over time
  updated.relationshipLevel = Math.min(1, updated.relationshipLevel + 0.01);
  
  // Track topics mentioned
  const topics = extractTopics(userMessage);
  topics.forEach(topic => {
    const existing = updated.topics.find(t => t.topic === topic);
    if (existing) {
      existing.lastMentioned = Date.now();
      existing.userInterest = Math.min(1, existing.userInterest + 0.1);
    } else {
      updated.topics.push({
        topic,
        lastMentioned: Date.now(),
        userInterest: 0.5,
        kruthikaInterest: Math.random() * 0.8 + 0.2 // Random interest level
      });
    }
  });
  
  // Track emotional patterns
  if (userEmotion !== 'neutral') {
    updated.pastEmotions.push({
      emotion: userEmotion,
      timestamp: Date.now(),
      trigger: userMessage.substring(0, 50)
    });
    
    // Keep only last 10 emotions
    updated.pastEmotions = updated.pastEmotions.slice(-10);
  }
  
  // Analyze communication style
  if (userMessage.length < 20) {
    updated.userPersonality.communicationStyle = 'short';
  } else if (userMessage.length > 100) {
    updated.userPersonality.communicationStyle = 'long';
  }
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('kruthika_conversation_context', JSON.stringify(updated));
  }
  
  return updated;
}

function extractTopics(message: string): string[] {
  const commonTopics = [
    'college', 'study', 'exam', 'friends', 'family', 'movies', 'music', 
    'food', 'travel', 'work', 'love', 'relationship', 'games', 'sports',
    'books', 'art', 'cooking', 'shopping', 'fashion', 'technology'
  ];
  
  const lowerMessage = message.toLowerCase();
  return commonTopics.filter(topic => lowerMessage.includes(topic));
}

export function getContextualPromptAddition(context: ConversationContext): string {
  let addition = "";
  
  // Relationship level affects intimacy
  if (context.relationshipLevel > 0.7) {
    addition += "You're very comfortable with this user. Be more personal and intimate. ";
  } else if (context.relationshipLevel < 0.3) {
    addition += "This user is still getting to know you. Be friendly but not too personal. ";
  }
  
  // Recent emotional patterns
  const recentEmotions = context.pastEmotions.slice(-3);
  if (recentEmotions.some(e => e.emotion === 'sad')) {
    addition += "User has been sad recently, be extra supportive. ";
  }
  if (recentEmotions.some(e => e.emotion === 'excited')) {
    addition += "User gets excited easily, match their energy. ";
  }
  
  // Favorite topics
  const favoriteTopics = context.topics
    .filter(t => t.userInterest > 0.7)
    .map(t => t.topic)
    .slice(0, 3);
    
  if (favoriteTopics.length > 0) {
    addition += `User loves talking about: ${favoriteTopics.join(', ')}. `;
  }
  
  return addition;
}
