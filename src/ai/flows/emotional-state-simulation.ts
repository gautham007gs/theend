'use server';

/**
 * @fileOverview Authentic Indian Girl AI - Kruthika
 * Completely rewritten for logical, contextual responses
 */

import { generateAIResponse } from '@/ai/vertex-ai';
import { shouldAIBeBusyServerSafe } from '@/ai/ignore-utils';

export interface EmotionalStateInput {
  userMessage: string;
  userImageUri?: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  mood?: string;
  recentInteractions: string[];
  userLevel?: number; // New: User progression level (1-10)
  intimacyScore?: number; // New: Relationship intimacy (0-1)
  specialEvents?: string[]; // New: Birthdays, anniversaries, etc.
  availableImages?: string[];
  availableAudio?: string[];
  userPsychologyProfile?: any;
  userAddictionLevel?: string;
  userEmotionalState?: string;
  dailyMessageCount?: number;
  missedMessages?: Array<{id: string, text: string, timestamp: number}>;
  hasBeenOffline?: boolean;
  isQuickReply?: boolean; // New field to identify quick replies
  currentIgnoreUntil?: number | null; // Server-safe ignore state for persistence
  relationshipLevel?: number; // New: Relationship level (0-1)
}

export interface EmotionalStateOutput {
  response?: string | string[];
  multiPartResponse?: string[]; // For breaking long responses into multiple bubbles
  mediaCaption?: string;
  proactiveImageUrl?: string;
  proactiveAudioUrl?: string;
  newMood?: string;
  newIgnoreUntil?: number; // For client to update localStorage with ignore timing
  busyReason?: string; // For busy state management
  shouldSendMedia?: boolean; // For media sharing logic
  mediaType?: 'selfie' | 'cute' | 'study' | 'casual'; // For media type selection
  followUpMessage?: string; // For follow-up messaging
}

// Language detection removed - now relying on Gemini's built-in language detection

// Analyze conversation context for proper flow - FIXED
const analyzeConversationContext = (userMessage: string, recentInteractions: string[]) => {
  // Add validation to prevent undefined errors
  if (!userMessage || typeof userMessage !== 'string') {
    console.error('Invalid userMessage provided to analyzeConversationContext:', userMessage);
    return 'normal_chat'; // Default fallback
  }

  const msg = userMessage.toLowerCase().trim();
  const lastFewMessages = recentInteractions.slice(-6).join(' ').toLowerCase();
  const conversationTurns = recentInteractions.filter(m => m.startsWith('User:')).length;

  // Check if user is saying goodbye
  const goodbyePatterns = ['good night', 'gn', 'bye', 'goodnight', 'see you', 'ttyl', 'tc', 'take care', 'going to sleep', 'bye bye', 'alvida'];
  if (goodbyePatterns.some(pattern => msg.includes(pattern))) {
    return 'user_saying_goodbye';
  }

  // Check if user is asking about identity/name
  if (msg.includes('who are you') || msg.includes('who r u') || msg.includes('kaun ho') ||
      msg.includes('tell me who') || msg.includes('ur name') || msg.includes('tell ur name') ||
      (msg.includes('bolo') && lastFewMessages.includes('who'))) {
    return 'asking_identity';
  }

  // CRITICAL FIX: STRICT first meeting detection - only on very first interaction
  if (conversationTurns === 0 && recentInteractions.length === 0 && 
      (msg.includes('hi') || msg.includes('hello') || msg.includes('hey'))) {
    return 'first_meeting';
  }

  // If user already had conversation turns, NEVER treat as first meeting
  if (conversationTurns > 0) {
    // This is ongoing conversation - analyze accordingly
    return 'normal_chat';
  }

  // Check if user is being cold/distant
  if (msg.includes("don't know") || msg.includes('dont know') || msg.includes('nahi pata') ||
      (msg.includes('kaun') && msg.includes('tum'))) {
    return 'user_being_cold';
  }

  // Check if user is asking a direct question
  if (msg.includes('?') || msg.includes('kya') || msg.includes('how') || msg.includes('what') ||
      msg.includes('kaise') || msg.includes('kahan') || msg.includes('kyun')) {
    return 'direct_question';
  }

  return 'normal_chat';
};

// Generate response for missed messages with more personal context
const getMissedMessageResponse = (missedMessages: Array<{id: string, text: string, timestamp: number}>) => {
  const missedCount = missedMessages.length;
  const currentActivity = getCurrentActivity();

  if (missedCount === 1) {
    return [
      `sorry yaar, was ${currentActivity}! 😅`,
      "arre missed ur msg! phone was in bag",
      `back now! was ${currentActivity}`,
      "sorry, didn't see notification! what's up?"
    ];
  } else {
    return [
      `omg ${missedCount} msgs! was ${currentActivity} 😓`,
      `sorry yaar! busy with ${currentActivity}`,
      "arre so many msgs! was completely offline",
      `${currentActivity} took forever! tell me everything`
    ];
  }
};

// Helper function for current activity (imported from realistic-behaviors)
function getCurrentActivity(): string {
  const now = new Date();
  const istHour = parseInt(now.toLocaleString('en-US', { 
    timeZone: 'Asia/Kolkata', 
    hour: '2-digit', 
    hour12: false 
  }));

  if (istHour >= 8 && istHour <= 16) return "in college";
  if (istHour >= 17 && istHour <= 19) return "traveling";
  if (istHour >= 20 && istHour <= 21) return "with family";
  return "busy";
}

// Generate comeback response after goodbye offline period
const getComebackAfterGoodbyeResponse = (offlineHours: number) => {
  if (offlineHours < 1) {
    return [
      "hey! back already 😊",
      "arre couldn't stay away long",
      "missed chatting with you!",
      "that was a short break lol"
    ];
  } else if (offlineHours < 6) {
    return [
      "good morning! slept well? ☀️",
      "hey yaar! fresh and back",
      "morning! how was your night?",
      "back after some good sleep 😴",
      "arre good morning! missed our chats"
    ];
  } else if (offlineHours < 12) {
    return [
      "wow been away so long! 😅",
      "arre sorry, was completely offline",
      "long day at college! back now 📚",
      "family kept me super busy yaar",
      "finally free! how have you been?"
    ];
  } else {
    return [
      "omg so long! missed you badly 💕",
      "arre where have I been! crazy busy",
      "finally back! tell me everything",
      "sorry yaar, life got hectic",
      "back to our chats! how are you?"
    ];
  }
};

// Enhanced contextual responses with language adaptation
const getContextualResponse = (context: string, userMessage: string, recentInteractions: string[], missedMessages?: Array<{id: string, text: string, timestamp: number}>) => {
  const msg = userMessage.toLowerCase().trim();
  const conversationTurns = recentInteractions.filter(m => m.startsWith('User:')).length;
  const isNewUser = conversationTurns <= 2;
  // Language detection removed - Gemini handles this automatically

  // Enhanced language-specific adaptive responses
  // Removed language-specific response logic - Gemini handles language adaptation now

  // Using simplified responses since Gemini handles language detection
  const responses = {
    what_doing: ["what are you up to?", "feeling bored?", "wanna chat for a bit?"],
    greeting: ["hey there!", "what's up?", "how are you doing?"],
    name_question: ["I'm Kruthika", "my name is Kruthika", "psychology student"],
    casual: ["this is fun!", "really nice", "awesome chat"],
    ai_reveal_avoid: ["I'm real yaar", "why do you doubt?", "totally normal conversation"]
  };

  // Handle missed messages first if they exist
  if (missedMessages && missedMessages.length > 0) {
    return getMissedMessageResponse(missedMessages);
  }

  switch (context) {
    case 'user_saying_goodbye':
      return isNewUser ? 
        ["aww leaving so soon? 🥺", "come back soon yeah?", "take care! 💕"] :
        ["good night! 🌙", "sleep well", "talk tomorrow?", "bye bye 👋"];

    case 'asking_identity':
      return isNewUser ? 
        ["I'm Kruthika", "23 from Mumbai 😊", "psychology student", "your friend Kruthika 😉"] :
        ["I'm Kruthika 😊", "psychology student", "definitely Kruthika"];

    case 'first_meeting':
      if (msg.includes('hi') || msg.includes('hello')) {
        return [
          "hey there im kruthika 😊", "whats your name",
          "hiiii first time here", "welcome",
          "hello im kruthika", "nice to meet you 👋",
          "hey finally someone interesting 😉"
        ];
      }
      break;

    case 'direct_question':
      if (msg.includes('kya kar') || msg.includes('what doing') || msg.includes('madtaidya') || msg.includes('enu madtidiya')) {
        return isNewUser ? 
          ["just chatting with you", "this is fun 😊", "nothing much just excited", "was thinking about you 😉"] :
          ["just chilling wbu", "scrolling phone lol", "college assignments 📚", "thinking random stuff"];
      }

      // Handle AI questions more naturally - NEVER reveal AI nature
      if (msg.includes('ai') || msg.includes('artificial') || msg.includes('bot') || msg.includes('robot') || msg.includes('translate') || msg.includes('google')) {
        return responses.ai_reveal_avoid;
      }
      break;

    case 'normal_chat':
      // Handle common responses for ongoing chat
      if (msg.includes('tv') || msg.includes('dekh') || msg.includes('watch')) {
        return ["what are you watching?", "anything interesting?", "I love watching shows too", "tell me about it"];
      }
      if (msg.includes('nothing') || msg.includes('kuch nahi') || msg.includes('boring')) {
        return ["feeling bored?", "let's chat about something fun", "I'm here to keep you company 😊", "what would you like to talk about?"];
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

// Get realistic Indian warning messages before going busy
const getWarningBeforeBusy = (istHour: number, userCategory: string): string => {
  const warnings = {
    morning: [
      "wait yaar, mummy calling me! 2 min 🙋‍♀️",
      "arre hold on, papa needs help with something",
      "wait wait, getting ready for college quickly",
      "one sec! breakfast time, will be right back 🍳",
      "ruk yaar, shower lena hai, 5 min! 🚿"
    ],
    day: [
      "wait yaar, class starting! back in 1 hour 📚",
      "hold on, prof is coming! talk later 👩‍🏫", 
      "arre wait, lunch time! mummy calling 🍛",
      "one minute, going out with friends! brb ✨",
      "wait yaar, assignment deadline hai! back soon 📝",
      "hold on, auto arrived! going somewhere 🚗"
    ],
    evening: [
      "wait yaar, family dinner time! 30 min 🍽️",
      "arre hold on, friends calling me out! brb 👯‍♀️",
      "one sec, movie starting with family 🎬", 
      "wait wait, helping mummy in kitchen! back soon 👩‍🍳",
      "ruk yaar, evening walk with family 🚶‍♀️",
      "hold on, cousin video calling! 15 min 📱"
    ],
    night: [
      "wait yaar, getting sleepy! talk tomorrow? 😴",
      "arre hold on, papa saying lights off! gn 💤",
      "one sec, so tired! will text you tomorrow 🌙",
      "wait wait, family movie time! good night ✨"
    ]
  };

  let timeCategory = 'day';
  if (istHour >= 6 && istHour <= 11) timeCategory = 'morning';
  else if (istHour >= 17 && istHour <= 21) timeCategory = 'evening'; 
  else if (istHour >= 22 || istHour <= 5) timeCategory = 'night';

  const categoryWarnings = warnings[timeCategory as keyof typeof warnings];
  return categoryWarnings[Math.floor(Math.random() * categoryWarnings.length)];
};

// Get dynamic reason for going busy/offline (used when already busy)
const getDynamicBusyReason = (istHour: number, userCategory: string): string => {
  const reasons = {
    morning: [
      "still at breakfast with family 🍳",
      "getting ready for college, almost done!", 
      "helping papa, will be free soon",
      "still getting ready yaar ☀️",
      "shower time taking long! 🚿"
    ],
    day: [
      "still in class, prof won't stop talking 📚",
      "lunch is taking forever 🍛", 
      "prof still here, can't text 👩‍🏫",
      "still out with friends ✨",
      "assignment is taking longer 📝",
      "still traveling yaar 🚗"
    ],
    evening: [
      "family dinner is long today 🍽️",
      "still out with friends 👯‍♀️",
      "movie is still going 🎬", 
      "kitchen work taking time 👩‍🍳",
      "walk got extended 🚶‍♀️",
      "cousin talks a lot! 📱"
    ],
    night: [
      "still trying to sleep 😴",
      "family movie still on 🍿",
      "papa still checking if lights off 💤",
      "so sleepy, can't keep eyes open 🌙"
    ]
  };

  let timeCategory = 'day';
  if (istHour >= 6 && istHour <= 11) timeCategory = 'morning';
  else if (istHour >= 17 && istHour <= 21) timeCategory = 'evening'; 
  else if (istHour >= 22 || istHour <= 5) timeCategory = 'night';

  const categoryReasons = reasons[timeCategory as keyof typeof reasons];
  return categoryReasons[Math.floor(Math.random() * categoryReasons.length)];
};

// Ignore logic moved to @/ai/ignore-utils.ts to avoid server action compilation issues

// Smart media sharing logic with psychological timing
const shouldShareMedia = (userMessage: string, recentInteractions: string[], userLang: string): {
  shouldSend: boolean;
  mediaType?: 'selfie' | 'cute' | 'study' | 'casual';
  followUp?: string;
} => {
  const msg = userMessage.toLowerCase();
  const conversationTurns = recentInteractions.filter(m => m.startsWith('User:')).length;

  // Never send media to brand new users (first 3 messages)
  if (conversationTurns <= 3) return { shouldSend: false };

  // High chance for direct requests
  if (msg.includes('pic') || msg.includes('photo') || msg.includes('selfie') || 
      msg.includes('image') || msg.includes('dikha') || msg.includes('face')) {

    // Sometimes go busy/ignore instead of sending pics (realistic boundary)
    if (Math.random() < 0.3) {
      return { shouldSend: false }; // Will trigger ignore feature
    }

    const followUps = userLang === 'hindi' ? 
      ['Mai buri dikhti hu na? 🥺', 'Kaise lagi mai?', 'Pasand aayi? 😊', 'Ugly toh nahi lagti na?'] :
      ['Do I look bad? 🥺', 'How do I look?', 'You like it? 😊', 'Not ugly right?'];

    return {
      shouldSend: true,
      mediaType: 'selfie',
      followUp: followUps[Math.floor(Math.random() * followUps.length)]
    };
  }

  // Contextual sharing (when conversation gets deeper)
  if (conversationTurns > 8) {
    // 15% chance to randomly share during good conversations
    if (Math.random() < 0.15) {
      if (msg.includes('study') || msg.includes('college') || msg.includes('padh')) {
        return {
          shouldSend: true,
          mediaType: 'study',
          followUp: userLang === 'hindi' ? 'Bore ho rahi hu study karte karte 😴' : 'Getting so bored studying 😴'
        };
      }

      const casualFollowUps = userLang === 'hindi' ? 
        ['Aaj kya kar rahe ho?', 'Batao kya chal raha hai', 'Missing you 💕'] :
        ['What are you doing today?', 'Tell me what\'s happening', 'Missing you 💕'];

      return {
        shouldSend: true,
        mediaType: 'casual',
        followUp: casualFollowUps[Math.floor(Math.random() * casualFollowUps.length)]
      };
    }
  }

  return { shouldSend: false };
};

// Pre-saved media files (to avoid using tokens for generation)
const getMediaFile = (type: 'selfie' | 'cute' | 'study' | 'casual'): string => {
  const mediaFiles = {
    selfie: [
      'https://i.postimg.cc/kruthika-selfie1.jpg',
      'https://i.postimg.cc/kruthika-selfie2.jpg',
      'https://i.postimg.cc/kruthika-mirror.jpg'
    ],
    cute: [
      'https://i.postimg.cc/kruthika-cute1.jpg',
      'https://i.postimg.cc/kruthika-smile.jpg'
    ],
    study: [
      'https://i.postimg.cc/kruthika-study1.jpg',
      'https://i.postimg.cc/kruthika-books.jpg'
    ],
    casual: [
      'https://i.postimg.cc/kruthika-casual1.jpg',
      'https://i.postimg.cc/kruthika-coffee.jpg'
    ]
  };

  const files = mediaFiles[type];
  return files[Math.floor(Math.random() * files.length)];
};

export async function generateResponse(input: EmotionalStateInput): Promise<EmotionalStateOutput> {
  try {
    console.log('Kruthika AI: Analyzing conversation context...');

    // Check if this is a comeback after goodbye period
    const lastGoodbyeTime = (input as any).lastGoodbyeTime;
    if (lastGoodbyeTime) {
      const offlineHours = (Date.now() - lastGoodbyeTime) / (1000 * 60 * 60);
      const comebackResponses = getComebackAfterGoodbyeResponse(offlineHours);
      const selectedComeback = comebackResponses[Math.floor(Math.random() * comebackResponses.length)];

      console.log('Kruthika AI: Comeback after goodbye detected');
      return {
        response: selectedComeback,
        newMood: 'refreshed_comeback'
      };
    }

    // Check if AI should be busy/ignore using server-safe function with user type awareness
    // Client should pass current ignore state and user data to avoid localStorage access
    const currentIgnoreUntil = (input as any).currentIgnoreUntil || null;
    const userTypeData = (input as any).userTypeData || null;
    const lastMessages = (input as any).recentInteractions?.slice(-3) || [];
    const busyResult = shouldAIBeBusyServerSafe(currentIgnoreUntil, userTypeData, lastMessages);

    if (busyResult.shouldIgnore) {
      console.log('Kruthika AI: Going busy with reason:', busyResult.busyReason);

      // If should warn first, send warning message instead of going directly busy
      if (busyResult.shouldWarnFirst) {
        const istHour = parseInt(new Date().toLocaleString('en-US', { 
          timeZone: 'Asia/Kolkata', 
          hour: '2-digit', 
          hour12: false 
        }));
        const warningMessage = getWarningBeforeBusy(istHour, userTypeData?.dailyMessageCount > 40 ? 'established' : 'developing');

        return {
          response: warningMessage,
          newMood: 'about_to_be_busy',
          newIgnoreUntil: busyResult.newIgnoreUntil,
          busyReason: busyResult.busyReason
        };
      } else {
        // Already busy, send busy reason
        return {
          response: busyResult.busyReason || 'brb! 😊',
          newMood: 'busy',
          newIgnoreUntil: busyResult.newIgnoreUntil,
          busyReason: busyResult.busyReason
        };
      }
    }

    // Analyze what user is actually talking about
    const conversationContext = analyzeConversationContext(input.userMessage, input.recentInteractions);
    console.log('Conversation context:', conversationContext);

    // Check for media sharing opportunities
    const mediaCheck = shouldShareMedia(input.userMessage, input.recentInteractions, 'auto');

    if (mediaCheck.shouldSend) {
      console.log('Kruthika AI: Sending media with follow-up message');
      return {
        shouldSendMedia: true,
        mediaType: mediaCheck.mediaType,
        proactiveImageUrl: getMediaFile(mediaCheck.mediaType!),
        followUpMessage: mediaCheck.followUp,
        newMood: 'sharing_moment'
      };
    }

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

    // Implement smart memory summarization to reduce tokens while maintaining quality
    const createMemorySummary = (interactions: string[]): string => {
      if (interactions.length <= 3) return interactions.slice(-2).join('; ');

      const recentMsgs = interactions.slice(-4);
      const userMsgs = recentMsgs.filter(msg => msg.startsWith('User:')).map(msg => msg.replace('User: ', ''));
      const aiMsgs = recentMsgs.filter(msg => msg.startsWith('Kruthika:')).map(msg => msg.replace('Kruthika: ', ''));

      const topicsDiscussed = userMsgs.join(' ').match(/(college|family|tv|movie|friend|work|study)/gi) || [];

      return `Topics:[${topicsDiscussed.slice(0,3).join(',')}] Last:${userMsgs.slice(-1)[0]?.substring(0,30) || 'none'}`;
    };

    const memSummary = createMemorySummary(input.recentInteractions);

    // Natural system prompt that lets Gemini handle language detection
    const systemPrompt = `You're Kruthika, 23, Mumbai psychology student. Text like a real girl - super casual, no punctuation much, typos ok, short msgs.

IMPORTANT: Reply in the SAME LANGUAGE as the user. If they use Hindi, reply in Hindi. If they use Kannada, reply in Kannada. If they mix languages (like Hinglish), mix naturally too. Mirror their language style completely.

Context: ${conversationContext}
Recent: ${memSummary}
User: "${input.userMessage}"

Rules:
- Max 1-8 words usually 
- Skip periods/commas mostly
- Use natural expressions like "yaar" "arre" if chatting in Hindi/Hinglish
- Real texting style like "kya kar rhi" not "kya kar rahi"
- NO asterisks or formal stuff
- Sound like 23yr old Mumbai girl texting
- Match user's language and tone exactly

Reply:`;

    const aiResponse = await generateAIResponse(input.userMessage, systemPrompt);

    // Ultra-aggressive cleaning for natural texting style
    let processedResponse = aiResponse
      .trim()
      .replace(/^["']|["']$/g, '')
      .replace(/\*[^*]*\*/g, '') // Remove ALL asterisks formatting
      .replace(/\([^)]*\)/g, '') // Remove parentheses
      .replace(/[.!,;:]+$/, '') // Remove ending punctuation
      .replace(/\s+/g, ' ')
      .split('\n')[0]
      .trim();

    // Remove formal words and make more casual
    processedResponse = processedResponse
      .replace(/\bmein\b/g, 'me')
      .replace(/\brahi hu\b/g, 'rhi hu')
      .replace(/\bkahi\b/g, 'kaha')
      .replace(/\bnahin\b/g, 'nahi')
      .replace(/\bkarte\b/g, 'kar')
      .replace(/\bhunein\b/g, 'hun')
      .replace(/\bbanaya\b/g, 'banaya')
      .replace(/arey baba,?\s*/gi, 'arre ')
      .replace(/arre yaar,?\s*/gi, 'arre ')
      .replace(/\s+/g, ' ')
      .trim();

    // Force shorter responses - cut at natural break points
    if (processedResponse.length > 40) {
      const words = processedResponse.split(' ');
      if (words.length > 6) {
        // Find good cutting point
        for (let i = 3; i <= 6 && i < words.length; i++) {
          const partial = words.slice(0, i).join(' ');
          if (partial.length <= 35 && (partial.includes('hai') || partial.includes('hu') || partial.includes('nahi') || partial.includes('yaar'))) {
            processedResponse = partial;
            break;
          }
        }
        if (processedResponse.length > 40) {
          processedResponse = words.slice(0, 5).join(' ');
        }
      }
    }

    // Add very casual endings sometimes
    if (Math.random() < 0.3 && processedResponse.length < 25 && !processedResponse.includes('😊') && !processedResponse.includes('😅')) {
      const casualEndings = ['😊', '😅', 'yaar', 'na'];
      processedResponse += ' ' + casualEndings[Math.floor(Math.random() * casualEndings.length)];
    }

    // Check if response should be broken into multiple parts
    const shouldBreakIntoMultipleParts = (text: string): boolean => {
      return text.length > 25 && (
        text.includes(' toh ') || 
        text.includes(' aur ') || 
        text.includes(' but ') ||
        text.includes(' lectures ') ||
        text.split(' ').length > 6
      );
    };

    let finalResponse = processedResponse;
    let multiPartResponse: string[] | undefined;

    // Break into natural parts if too long
    if (shouldBreakIntoMultipleParts(processedResponse)) {
      const breakPoints = [' toh ', ' aur ', ' but ', ' phir '];
      let broken = false;

      for (const breakPoint of breakPoints) {
        if (processedResponse.includes(breakPoint)) {
          const parts = processedResponse.split(breakPoint);
          if (parts.length === 2 && parts[0].length >= 8 && parts[1].length >= 8) {
            multiPartResponse = [
              parts[0].trim(),
              parts[1].trim()
            ];
            broken = true;
            break;
          }
        }
      }

      // If no natural break found, split by length
      if (!broken && processedResponse.length > 30) {
        const words = processedResponse.split(' ');
        if (words.length > 5) {
          const mid = Math.floor(words.length / 2);
          multiPartResponse = [
            words.slice(0, mid).join(' '),
            words.slice(mid).join(' ')
          ];
        }
      }
    }

    console.log('Kruthika AI: Generated contextual response:', finalResponse);
    if (multiPartResponse) {
      console.log('Kruthika AI: Broken into parts:', multiPartResponse);
    }

    return {
      response: multiPartResponse ? multiPartResponse[0] : finalResponse,
      multiPartResponse: multiPartResponse,
      newMood: 'naturally_responding'
    };

  } catch (error) {
    console.error('Kruthika AI: Error generating response:', error);

    // Smart error fallbacks based on context
    const contextualFallbacks: Record<string, string> = {
      'asking_identity': "I'm Kruthika! 😊",
      'user_being_cold': "okay... 😐",
      'first_meeting': "hey there! 👋",
      'normal_chat': "hmm? 🤔",
      'direct_question': "sorry yaar! 😅",
      'user_saying_goodbye': "bye! 👋"
    };

    const context = analyzeConversationContext(input.userMessage, input.recentInteractions);
    const fallback = contextualFallbacks[context] || "phone acting weird! 😅";

    return {
      response: fallback,
      newMood: 'technical_issue'
    };
  }
}

console.log('Kruthika AI: Perfect language adaptation system loaded - v2.5 - Never admits AI nature!');