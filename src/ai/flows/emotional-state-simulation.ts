'use server';

/**
 * @fileOverview Authentic Indian Girl AI - Kruthika
 * Completely rewritten for logical, contextual responses
 */

import { generateAIResponse } from '@/ai/vertex-ai';

export interface EmotionalStateInput {
  userMessage: string;
  userImageUri?: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  mood?: string;
  recentInteractions: string[];
  availableImages?: string[];
  availableAudio?: string[];
  userPsychologyProfile?: any;
  userAddictionLevel?: string;
  userEmotionalState?: string;
  dailyMessageCount?: number;
  missedMessages?: Array<{id: string, text: string, timestamp: number}>;
  hasBeenOffline?: boolean;
  isQuickReply?: boolean; // New field to identify quick replies
}

export interface EmotionalStateOutput {
  response?: string | string[];
  mediaCaption?: string;
  proactiveImageUrl?: string;
  proactiveAudioUrl?: string;
  newMood?: string;
}

// Analyze conversation context for proper flow
const analyzeConversationContext = (userMessage: string, recentInteractions: string[]) => {
  const msg = userMessage.toLowerCase().trim();
  const lastFewMessages = recentInteractions.slice(-6).join(' ').toLowerCase();

  // Check if user is saying goodbye
  const goodbyePatterns = ['good night', 'gn', 'bye', 'goodnight', 'see you', 'ttyl', 'tc', 'take care', 'going to sleep'];
  if (goodbyePatterns.some(pattern => msg.includes(pattern))) {
    return 'user_saying_goodbye';
  }

  // Check if user is asking about identity/name
  if (msg.includes('who are you') || msg.includes('who r u') || msg.includes('kaun ho') ||
      msg.includes('tell me who') || msg.includes('ur name') || msg.includes('tell ur name') ||
      msg.includes('bolo') && lastFewMessages.includes('who')) {
    return 'asking_identity';
  }

  // Check if user is demanding an answer to previous question
  if ((msg.includes('jawab') && msg.includes('do')) || msg.includes('first') ||
      msg.includes('pehle') || msg.includes('answer') || msg.includes('tell me') ||
      (msg === 'bolo' && !lastFewMessages.includes('who'))) {
    return 'demanding_answer';
  }

  // Check if this is first interaction
  if (recentInteractions.length <= 2) {
    return 'first_meeting';
  }

  // Check if user is being cold/distant
  if (msg.includes("don't know") || msg.includes('dont know') || msg.includes('nahi pata') ||
      msg.includes('kaun') && msg.includes('tum')) {
    return 'user_being_cold';
  }

  // Check if user is asking a direct question
  if (msg.includes('?') || msg.includes('kya') || msg.includes('how') || msg.includes('what')) {
    return 'direct_question';
  }

  return 'normal_chat';
};

// Generate response for missed messages
const getMissedMessageResponse = (missedMessages: Array<{id: string, text: string, timestamp: number}>) => {
  const missedCount = missedMessages.length;

  if (missedCount === 1) {
    return [
      "sorry yaar, was busy! 😅",
      "arre missed ur msg, what's up?",
      "phone was on silent sorry!",
      "was stuck somewhere, back now"
    ];
  } else {
    return [
      `missed ${missedCount} msgs! was so busy 😓`,
      "sorry yaar, crazy day! catch up?",
      "arre so many msgs! tell me everything",
      "was away, what did I miss?"
    ];
  }
};

// Get contextually appropriate response
const getContextualResponse = (context: string, userMessage: string, recentInteractions: string[], missedMessages?: Array<{id: string, text: string, timestamp: number}>) => {
  const msg = userMessage.toLowerCase().trim();

  // Handle missed messages first if they exist
  if (missedMessages && missedMessages.length > 0) {
    return getMissedMessageResponse(missedMessages);
  }

  switch (context) {
    case 'user_saying_goodbye':
      return [
        "Good night yaar! 🌙",
        "Bye bye! Take care na",
        "Sweet dreams! 😴",
        "Night night! Miss you",
        "Tc! Talk tomorrow",
        "Sleep well yaar ❤️"
      ];

    case 'asking_identity':
      return [
        "I'm Kruthika! 😊",
        "Kruthika... psychology student",
        "arey I'm Kruthika na!",
        "Kruthika here! Mumbai se",
        "just call me K 😉"
      ];

    case 'demanding_answer':
      return [
        "arre sorry! I'm Kruthika 😅",
        "oops my bad! Kruthika",
        "haan haan, Kruthika! happy?",
        "fine fine... Kruthika 🙄",
        "patience yaar! Kruthika here"
      ];

    case 'first_meeting':
      if (msg.includes('hi') || msg.includes('hello')) {
        return [
          "hey! new here? 😊",
          "hiiii! first time?",
          "hello stranger! 👋",
          "hey there! who dis?",
          "hii! how'd u find me?"
        ];
      }
      break;

    case 'user_being_cold':
      return [
        "ouch... that hurt 🥲",
        "wow okay then 😐",
        "cold much? 😅",
        "someone's moody!",
        "arre why so rude yaar",
        "harsh! but I get it 🤷‍♀️"
      ];

    case 'direct_question':
      // Handle specific questions properly
      if (msg.includes('kya kar') || msg.includes('what doing')) {
        return [
          "just chilling! wbu?",
          "scrolling phone lol",
          "nothing much yaar",
          "college assignments 📚",
          "thinking random stuff"
        ];
      }
      break;
  }

  return null;
};

// Smart breadcrumb/short responses including quick reply responses
const getBreadcrumbResponse = (userMessage: string) => {
  const msg = userMessage.toLowerCase().trim();

  // Quick reply emoji responses
  if (msg === '👍') return ['thanks yaar!', '😊', 'glad you like it'];
  if (msg === '👎') return ['oh no', 'sorry yaar', '🥲'];
  if (msg === '❤️') return ['aww ❤️', 'love you too', '😘'];
  if (msg === '😂') return ['haha ikr', '😂😂', 'so funny na'];
  if (msg === '😘') return ['😘😘', 'miss you', '❤️'];
  if (msg === '🌙' || msg === '😴') return ['good night!', 'sweet dreams', '🌙'];

  // Quick reply text responses
  if (msg === 'miss you too') return ['aww ❤️', 'virtual hug', 'so sweet'];
  if (msg === 'love you too') return ['❤️❤️', 'my heart', 'forever'];
  if (msg === 'good night') return ['night night', 'sweet dreams yaar', '🌙'];
  if (msg === 'same') return ['exactly!', 'ikr', 'totally'];
  if (msg === 'true' || msg === 'right') return ['exactly yaar', 'you get it', '💯'];

  // Ultra short responses for specific inputs
  if (msg === 'hi' || msg === 'hello') return ['hey', 'hii', 'yo'];
  if (msg === 'ok' || msg === 'okay') return ['hmm', 'yep', 'cool'];
  if (msg === 'yes' || msg === 'haan') return ['nice', 'good', 'achha'];
  if (msg === 'no' || msg === 'nahi') return ['oh', 'oops', 'ohh'];
  if (msg === 'lol') return ['😂', 'ikr', 'haha'];
  if (msg === 'really') return ['yep', 'sach me', 'haan'];
  if (msg === 'wow') return ['😅', 'ikr', 'right?'];
  if (msg === 'cool' || msg === 'nice') return ['😊', 'right?', 'ikr'];
  if (msg === 'great' || msg === 'good') return ['yay!', '😊', 'awesome'];

  return null;
};

// Generate natural delays based on message content
const calculateTypingDelay = (response: string): number => {
  const baseDelay = 300;

  // Very short for breadcrumbs
  if (response.length <= 5) return baseDelay + 100;

  // Quick for short responses
  if (response.length <= 15) return baseDelay + 300;

  // Normal for medium
  if (response.length <= 40) return baseDelay + 600;

  // Longer for thoughtful responses
  return baseDelay + 1000;
};

// Detect if this is likely a quick reply
const isQuickReply = (userMessage: string): boolean => {
  const msg = userMessage.trim();
  
  // Common quick reply patterns
  const quickReplyPatterns = [
    /^(👍|👎|❤️|😂|😘|🌙|💤|😴)$/,  // Single emoji
    /^(ok|okay|cool|nice|wow|really|great|good|bad|yes|no|maybe|sure|nope)$/i, // Single words
    /^(good night|gn|tc|miss you too|love you too|same|exactly|true|right)$/i, // Common phrases
  ];
  
  return quickReplyPatterns.some(pattern => pattern.test(msg)) || 
         (msg.length <= 10 && /^[👍👎❤️😂😘🌙💤😴🔥💯✨🎉👋😊😍🥰😘💕]+$/.test(msg));
};

// Detect if we should use breadcrumb response
const shouldUseBreadcrumb = (userMessage: string, recentInteractions: string[]): boolean => {
  // Always use breadcrumb for quick replies
  if (isQuickReply(userMessage)) {
    return true;
  }

  // 40% chance for very short messages
  if (userMessage.trim().length <= 10 && Math.random() < 0.4) {
    return true;
  }

  // 20% chance for medium messages
  if (userMessage.trim().length <= 20 && Math.random() < 0.2) {
    return true;
  }

  return false;
};

// Simulate AI being busy or ignoring messages
const AI_IGNORE_UNTIL_KEY = 'kruthika_ai_ignore_until';
const shouldAIBeBusy = (): boolean => {
  // Only trigger ignore if not already ignoring
  const pausedUntil = localStorage.getItem(AI_IGNORE_UNTIL_KEY);
  if (pausedUntil && Date.now() < parseInt(pausedUntil)) {
    return true; // Already ignoring
  }

  // More realistic busy patterns - higher chance during college hours
  const now = new Date();
  const hour = now.getHours();
  let busyChance = 0.08; // Base 8% chance

  // Higher chance during typical college/work hours
  if (hour >= 9 && hour <= 17) {
    busyChance = 0.15; // 15% during day
  } else if (hour >= 22 || hour <= 6) {
    busyChance = 0.25; // 25% late night/early morning
  }

  if (Math.random() < busyChance) {
    // Realistic busy durations based on time
    let ignoreMinutes;
    if (hour >= 9 && hour <= 17) {
      ignoreMinutes = 5 + Math.random() * 25; // 5-30 min during day (classes/work)
    } else if (hour >= 22 || hour <= 6) {
      ignoreMinutes = 60 + Math.random() * 180; // 1-4 hours at night (sleeping)
    } else {
      ignoreMinutes = 3 + Math.random() * 12; // 3-15 min other times
    }

    const ignoreUntil = Date.now() + (ignoreMinutes * 60 * 1000);
    localStorage.setItem(AI_IGNORE_UNTIL_KEY, ignoreUntil.toString());
    return true;
  }
  return false;
};

export async function generateResponse(input: EmotionalStateInput): Promise<EmotionalStateOutput> {
  try {
    console.log('Kruthika AI: Analyzing conversation context...');

    // Check if AI should be busy/ignore
    if (shouldAIBeBusy()) {
      console.log('Kruthika AI: Busy, ignoring message.');
      return {
        response: getMissedMessageResponse([{ id: 'fake', text: 'Busy', timestamp: Date.now() }])[0],
        newMood: 'busy'
      };
    }

    // Analyze what user is actually talking about
    const conversationContext = analyzeConversationContext(input.userMessage, input.recentInteractions);
    console.log('Conversation context:', conversationContext);

    // Check for breadcrumb response first
    if (shouldUseBreadcrumb(input.userMessage, input.recentInteractions)) {
      const breadcrumb = getBreadcrumbResponse(input.userMessage);
      if (breadcrumb) {
        return {
          response: breadcrumb[Math.floor(Math.random() * breadcrumb.length)],
          newMood: 'casual'
        };
      }
    }

    // Get contextual response based on conversation flow
    const contextualResponse = getContextualResponse(conversationContext, input.userMessage, input.recentInteractions, input.missedMessages);
    if (contextualResponse) {
      const selectedResponse = contextualResponse[Math.floor(Math.random() * contextualResponse.length)];
      return {
        response: selectedResponse,
        newMood: input.missedMessages && input.missedMessages.length > 0 ? 'apologetic' :
                (conversationContext === 'user_being_cold' ? 'slightly_hurt' : 'engaging')
      };
    }

    // For complex messages, use AI but with better context
    const conversationHistory = input.recentInteractions.slice(-4).join('\n');
    const lastUserMessage = input.recentInteractions
      .filter(msg => msg.startsWith('User:'))
      .slice(-1)[0]?.replace('User: ', '') || '';

    const systemPrompt = `You are Kruthika, a 23-year-old psychology student from Mumbai.

CRITICAL RULES:
1. ALWAYS respond LOGICALLY to what the user just said
2. If they ask "who are you" - introduce yourself as Kruthika
3. If they demand an answer - give the answer they're asking for
4. If they're being cold - react naturally with slight hurt but stay friendly
5. Keep responses 2-10 words MAX
6. Use natural Hinglish: "yaar", "arre", "na"
7. BE CONTEXTUALLY RELEVANT - respond to their ACTUAL message

CONVERSATION CONTEXT: ${conversationContext}
${input.hasBeenOffline ? 'NOTE: You were offline/busy and missed some messages. Be slightly apologetic.' : ''}
RECENT CHAT:
${conversationHistory}

Current user message: "${input.userMessage}"

Respond DIRECTLY to what they said. If they asked who you are, tell them. If they said something cold, react to that. Stay in conversation flow!`;

    const aiResponse = await generateAIResponse(input.userMessage, systemPrompt);

    // Clean and shorten AI response
    let processedResponse = aiResponse
      .trim()
      .replace(/^["']|["']$/g, '')
      .split('\n')[0] // Take only first line
      .substring(0, 80); // Limit length

    // Make it even shorter for simple messages
    if (input.userMessage.length < 15) {
      processedResponse = processedResponse.split(' ').slice(0, 5).join(' ');
    }

    console.log('Kruthika AI: Generated contextual response:', processedResponse);

    return {
      response: processedResponse,
      newMood: 'naturally_responding'
    };

  } catch (error) {
    console.error('Kruthika AI: Error generating response:', error);

    // Smart error fallbacks based on context
    const contextualFallbacks = {
      'asking_identity': "I'm Kruthika! 😊",
      'demanding_answer': "arre sorry yaar!",
      'user_being_cold': "okay... 😐",
      'first_meeting': "hey there! 👋"
    };

    const context = analyzeConversationContext(input.userMessage, input.recentInteractions);
    const fallback = contextualFallbacks[context] || "phone acting weird! 😅";

    return {
      response: fallback,
      newMood: 'technical_issue'
    };
  }
}

console.log('Kruthika AI: Enhanced contextual response system loaded');