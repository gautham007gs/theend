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
  currentIgnoreUntil?: number | null; // Server-safe ignore state for persistence
}

export interface EmotionalStateOutput {
  response?: string | string[];
  mediaCaption?: string;
  proactiveImageUrl?: string;
  proactiveAudioUrl?: string;
  newMood?: string;
  newIgnoreUntil?: number; // For client to update localStorage with ignore timing
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

// Enhanced user-type aware function to determine if AI should be busy
// Uses real psychology - avoid busy during peak chat times (8PM-12AM)
const shouldAIBeBusyServerSafe = (
  currentIgnoreUntil: number | null, 
  userType?: { dailyMessageCount: number; relationshipLevel: number; totalDaysActive: number },
  lastMessages?: string[]
): { shouldIgnore: boolean; newIgnoreUntil?: number; busyReason?: string; shouldWarnFirst?: boolean } => {
  // If already ignoring and time hasn't expired
  if (currentIgnoreUntil && Date.now() < currentIgnoreUntil) {
    return { shouldIgnore: true };
  }

  // Determine user type based on engagement
  let userCategory = 'returning';
  if (userType) {
    const { dailyMessageCount, relationshipLevel, totalDaysActive } = userType;
    
    // New user: COMPLETELY DISABLE busy feature for first 20+ messages
    if (dailyMessageCount <= 20 || relationshipLevel < 0.4 || totalDaysActive <= 5) {
      console.log('Kruthika AI: New/early user detected - NO BUSY FEATURE!');
      return { shouldIgnore: false };
    }
    
    if (dailyMessageCount <= 35 && relationshipLevel < 0.6 && totalDaysActive <= 10) {
      userCategory = 'developing';
    }
    // Old/addicted user: can be busy more often
    else if (dailyMessageCount > 60 && relationshipLevel > 0.8 && totalDaysActive > 20) {
      userCategory = 'established';
    }
    // Engaged user: balanced approach
    else if (dailyMessageCount > 40 && relationshipLevel > 0.7) {
      userCategory = 'engaged';
    }
  }

  const now = new Date();
  const istHour = parseInt(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', hour12: false }));
  
  // PEAK CHAT TIME (7PM-1AM IST) - BE EXTREMELY AVAILABLE!
  if (istHour >= 19 || istHour <= 1) {
    console.log('Kruthika AI: Peak chat time - staying fully available!');
    return { shouldIgnore: false }; // Never busy during peak hours
  }
  
  // Base busy chance varies by user type - DRASTICALLY REDUCED
  let baseBusyChance = 0.005; // Reduced from 0.02 to 0.005 (0.5%)
  
  switch (userCategory) {
    case 'developing':
      baseBusyChance = 0.001; // Almost never busy (0.1%)
      break;
    case 'engaged':
      baseBusyChance = 0.008; // Very low chance (0.8%)
      break;
    case 'established':
      baseBusyChance = 0.015; // Still quite low (1.5%)
      break;
  }

  // Adjust based on time psychology - VERY REDUCED MULTIPLIERS
  let timeMultiplier = 1.0;
  if (istHour >= 9 && istHour <= 17) {
    timeMultiplier = 1.2; // Reduced further
  } else if (istHour >= 2 && istHour <= 6) {
    timeMultiplier = 1.8; // Reduced significantly
  } else if (istHour >= 17 && istHour <= 19) {
    timeMultiplier = 1.05; // Almost no increase
  }

  const finalChance = baseBusyChance * timeMultiplier;
  
  if (Math.random() < finalChance) {
    // Get dynamic reason and realistic duration - MUCH SHORTER DURATIONS
    const reason = getDynamicBusyReason(istHour, userCategory);
    let ignoreMinutes;
    const userMultiplier = userCategory === 'developing' ? 0.3 : (userCategory === 'established' ? 1.0 : 0.6);
    
    if (istHour >= 9 && istHour <= 17) {
      ignoreMinutes = (2 + Math.random() * 5) * userMultiplier; // 2-7 min during day
    } else if (istHour >= 2 && istHour <= 6) {
      ignoreMinutes = (20 + Math.random() * 40) * userMultiplier; // 20-60 min sleep
    } else {
      ignoreMinutes = (1 + Math.random() * 4) * userMultiplier; // 1-5 min other times
    }

    const newIgnoreUntil = Date.now() + (ignoreMinutes * 60 * 1000);
    console.log(`Kruthika AI: Going busy for ${ignoreMinutes.toFixed(1)} mins - ${reason}`);
    return { 
      shouldIgnore: true, 
      newIgnoreUntil, 
      busyReason: reason,
      shouldWarnFirst: true // Always warn before going busy
    };
  }
  
  return { shouldIgnore: false };
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

    // Clean AI response but allow longer messages
    let processedResponse = aiResponse
      .trim()
      .replace(/^["']|["']$/g, '')
      .split('\n')[0]; // Take only first line
    
    // Smart truncation: only truncate if extremely long
    if (processedResponse.length > 200) {
      // Try to break at a sentence boundary
      const sentences = processedResponse.split(/[.!?]/);
      if (sentences.length > 1 && sentences[0].length <= 150) {
        processedResponse = sentences[0] + (sentences[0].match(/[.!?]$/) ? '' : '.');
      } else {
        // Find last complete word before 150 chars
        const truncated = processedResponse.substring(0, 150);
        const lastSpace = truncated.lastIndexOf(' ');
        processedResponse = lastSpace > 100 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
      }
    }

    // Make it shorter for very simple messages
    if (input.userMessage.length < 10) {
      processedResponse = processedResponse.split(' ').slice(0, 8).join(' ');
    } else if (input.userMessage.length < 15) {
      processedResponse = processedResponse.split(' ').slice(0, 12).join(' ');
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