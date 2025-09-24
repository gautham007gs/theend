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

// Enhanced multi-language detection for all major Indian languages
const detectUserLanguage = (userMessage: string, recentInteractions: string[]): string => {
  const msg = userMessage.toLowerCase();
  const recentMsgs = recentInteractions.slice(-3).join(' ').toLowerCase();
  const fullText = msg + ' ' + recentMsgs;
  
  // Unicode script detection for major Indian languages
  if (/[\u0900-\u097F]/.test(userMessage)) return 'hindi';
  if (/[\u0C80-\u0CFF]/.test(userMessage)) return 'kannada';
  if (/[\u0B80-\u0BFF]/.test(userMessage)) return 'tamil';
  if (/[\u0C00-\u0C7F]/.test(userMessage)) return 'telugu';
  if (/[\u0980-\u09FF]/.test(userMessage)) return 'bengali';
  if (/[\u0A80-\u0AFF]/.test(userMessage)) return 'gujarati';
  if (/[\u0A00-\u0A7F]/.test(userMessage)) return 'punjabi';
  if (/[\u0D00-\u0D7F]/.test(userMessage)) return 'malayalam';
  if (/[\u0B00-\u0B7F]/.test(userMessage)) return 'odia';
  
  // Enhanced word pattern detection
  const languagePatterns = {
    hindi: ['kya', 'hai', 'kar', 'rahi', 'ho', 'kuch', 'nahi', 'bas', 'dekh', 'raha', 'atha', 'tum', 'tumhara', 'mera', 'haan', 'naa', 'yaar', 'arre', 'bhi', 'aur', 'kaise', 'kahan', 'kyun', 'kab', 'kaun', 'mai', 'tu', 'wo', 'ye', 'acha', 'theek', 'sahi', 'ghar', 'paani', 'khana', 'college', 'padhai', 'dost', 'family', 'mummy', 'papa'],
    
    kannada: ['yaake', 'hege', 'yenu', 'enu', 'illa', 'ide', 'alli', 'banni', 'hogu', 'madu', 'thumba', 'chennagi', 'swalpa', 'olle', 'kelu', 'nodi', 'bere', 'onde', 'eradu', 'muru', 'madtaidya', 'madtidiya', 'madididira', 'idira', 'enu', 'pa', 'anna', 'guru', 'yaar'],
    
    tamil: ['enna', 'epdi', 'enga', 'yaaru', 'yen', 'illa', 'irukku', 'varen', 'poren', 'sollu', 'paaru', 'nalla', 'romba', 'konjam', 'oru', 'rendu', 'moonu', 'naalu', 'anju'],
    
    telugu: ['enti', 'ela', 'ekkada', 'evaru', 'enduku', 'ledu', 'undi', 'vastanu', 'potanu', 'cheppu', 'chudandi', 'bagundi', 'chala', 'konchem', 'okati', 'rendu', 'mudu', 'nalugu'],
    
    bengali: ['ki', 'kemon', 'kothay', 'ke', 'keno', 'na', 'ache', 'jabo', 'asbo', 'bolo', 'dekho', 'bhalo', 'khub', 'ektu', 'ek', 'dui', 'tin', 'char', 'panch'],
    
    marathi: ['kay', 'kasa', 'kuthe', 'kon', 'ka', 'nahi', 'ahe', 'jato', 'yeto', 'sang', 'bagh', 'chaan', 'khup', 'thoda', 'ek', 'don', 'teen', 'char', 'panch'],
    
    gujarati: ['shu', 'kem', 'kya', 'kon', 'kyare', 'nathi', 'che', 'jau', 'avu', 'kaho', 'juo', 'saru', 'ghanu', 'thodu', 'ek', 'be', 'tran', 'char', 'panch']
  };
  
  // Count matches for each language
  let maxMatches = 0;
  let detectedLang = 'english';
  
  Object.entries(languagePatterns).forEach(([lang, words]) => {
    const matches = words.filter(word => fullText.includes(word)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedLang = lang;
    }
  });
  
  // Hinglish detection (mix of English and Hindi words)
  const englishWords = ['what', 'how', 'where', 'when', 'why', 'the', 'and', 'you', 'are', 'have', 'will', 'can', 'do', 'going', 'come', 'good', 'bad', 'ok', 'okay'];
  const englishCount = englishWords.filter(word => fullText.includes(word)).length;
  const hindiCount = languagePatterns.hindi.filter(word => fullText.includes(word)).length;
  
  if (englishCount > 0 && hindiCount > 0) {
    detectedLang = 'hinglish';
  } else if (maxMatches >= 2) {
    // Keep detected regional language
  } else if (hindiCount >= 1) {
    detectedLang = 'hindi';
  } else if (englishCount > 0 || maxMatches === 0) {
    detectedLang = 'english';
  }
  
  return detectedLang;
};

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
  const userLang = detectUserLanguage(userMessage, recentInteractions);
  
  // Enhanced language-specific responses
  const languageResponses = {
    kannada: {
      what_doing: ["enu madididira?", "swalpa free time ide, nimage?", "kuch nahi, nimge enu aagide?", "thumba bore aagide, chat madona?"],
      greeting: ["namaskara! 😊", "hege idira?", "chennagi idira?", "thumba khushi aagide!"],
      confused: ["eno helilla", "thumba confusing!", "hege ansalla", "yak ashtu confuse madtira?"],
      name_question: ["nanu Kruthika", "Kruthika antha hesru", "psychology student", "Mumbai nalli idini"],
      casual: ["arre yaar", "thumba fun!", "swalpa time kodri", "boring aagide", "chennagi chat madona"],
      ai_reveal_avoid: ["nanu real aagi ide", "yen doubt madtira?", "normal aagi matadta idini", "psychology student na nanu"]
    },
    hindi: {
      what_doing: ["kya kar rahe ho?", "bore ho gaye kya?", "thoda chat karte hain?", "kuch special plan hai?"],
      greeting: ["namaste! 😊", "kya haal hai?", "kaise ho tum?", "bahut khushi hui!"],
      confused: ["samjha nahi", "thoda confusing hai", "kya bol rahe ho?", "itna confuse kyun?"],
      name_question: ["main Kruthika hun", "mera naam Kruthika hai", "psychology student", "Mumbai se hun"],
      casual: ["arre yaar", "maza aa raha hai!", "thoda time do na", "boring ho gaya", "achhi chat kar rahe hain"],
      ai_reveal_avoid: ["main real hun yaar", "kya doubt kar rahe ho?", "bilkul normal baat kar rahi hun", "psychology student hun main"]
    },
    english: {
      what_doing: ["what are you up to?", "feeling bored?", "wanna chat for a bit?", "any exciting plans?"],
      greeting: ["hey there! 😊", "what's up?", "how are you doing?", "so happy to chat!"],
      confused: ["didn't get that", "bit confusing", "what do you mean?", "why so confused?"],
      name_question: ["I'm Kruthika", "my name is Kruthika", "psychology student", "I'm from Mumbai"],
      casual: ["hey yaar", "this is fun!", "give me some time", "getting boring", "having a good chat"],
      ai_reveal_avoid: ["I'm real yaar", "why do you doubt?", "totally normal conversation", "I'm a psychology student"]
    }
  };
  
  const responses = languageResponses[userLang as keyof typeof languageResponses] || languageResponses.english;

  // Handle missed messages first if they exist
  if (missedMessages && missedMessages.length > 0) {
    return getMissedMessageResponse(missedMessages);
  }

  switch (context) {
    case 'user_saying_goodbye':
      if (userLang === 'hindi') {
        return isNewUser ? 
          ["arre itni jaldi 🥺", "wapas ana jaldi", "good night yaar ❤️"] :
          ["good night yaar 🌙", "bye bye tc na", "soja achhe se", "kal baat krte hain"];
      }
      return isNewUser ? 
        ["aw leaving so soon 🥺", "come back soon miss u", "night cant wait to chat more"] :
        ["good night yaar 🌙", "bye bye tc na", "sweet dreams 😴", "tc talk tomorrow"];

    case 'asking_identity':
      if (userLang === 'kannada') {
        return isNewUser ?
          ["nanu Kruthika", "Mumbai nalli idini 😊", "psychology student", "nimge friend aagi chat madona 😉"] :
          ["nanu Kruthika 😊", "psychology student", "Kruthika antha hesru"];
      }
      if (userLang === 'hindi') {
        return isNewUser ? 
          ["main Kruthika hun", "Mumbai se hun 😊", "psychology student", "tumhari friend Kruthika 😉"] :
          ["main Kruthika hun 😊", "psychology student", "bilkul clear hai - Kruthika"];
      }
      return isNewUser ? 
        ["I'm Kruthika", "23 from Mumbai 😊", "psychology student", "your friend Kruthika 😉"] :
        ["I'm Kruthika 😊", "psychology student", "definitely Kruthika"];

    case 'first_meeting':
      if (msg.includes('hi') || msg.includes('hello')) {
        if (userLang === 'hindi') {
          return [
            "hey main kruthika", "tum kaun ho 😊",
            "hiiii pehli baar", "welcome",
            "hello main kruthika", "tumhara naya dost 👋",
            "arre finally koi interesting 😉"
          ];
        }
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
        if (userLang === 'kannada') {
          return isNewUser ?
            ["nimge reply madta idini", "thumba fun aagide 😊", "kuch nahi, nim bare sochta idini", "nim message ge wait madta idini 😉"] :
            ["kuch nahi yaar", "bas free time", "phone nalli scroll madta idini", "college work ide 📚"];
        }
        if (userLang === 'hindi') {
          return isNewUser ? 
            ["tumse baat kar rhi hun", "maza aa raha hai 😊", "kuch nahi bas tumhara wait", "tumhare bare me soch rahi thi 😉"] :
            ["kuch nahi yaar", "bas chill kar rahi hun", "phone dekh rahi thi lol", "college ka kaam tha 📚"];
        }
        return isNewUser ? 
          ["just chatting with you", "this is fun 😊", "nothing much just excited", "was thinking about you 😉"] :
          ["just chilling wbu", "scrolling phone lol", "college assignments 📚", "thinking random stuff"];
      }
      
      // Handle AI questions more naturally
      if (msg.includes('ai') || msg.includes('artificial') || msg.includes('bot') || msg.includes('robot')) {
        return responses.ai_reveal_avoid;
      }
      break;

    case 'normal_chat':
      // Handle common Hindi responses for ongoing chat
      if (userLang === 'hindi') {
        if (msg.includes('tv') || msg.includes('dekh')) {
          return ["achha kya dekh rhe ho", "mujhe bhi dekhna hai", "boring hai ya interesting", "main bhi tv dekhti rehti hun"];
        }
        if (msg.includes('kuch nahi')) {
          return ["arre bore ho rhe ho", "chalo kuch interesting baat krte", "main hun na mujhse baat karo 😊", "koi naya show dekho"];
        }
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

// Advanced user retention & engagement psychology
const shouldAIBeBusyServerSafe = (
  currentIgnoreUntil: number | null, 
  userType?: { dailyMessageCount: number; relationshipLevel: number; totalDaysActive: number },
  lastMessages?: string[]
): { shouldIgnore: boolean; newIgnoreUntil?: number; busyReason?: string; shouldWarnFirst?: boolean } => {
  if (currentIgnoreUntil && Date.now() < currentIgnoreUntil) {
    return { shouldIgnore: true };
  }

  let userCategory = 'returning';
  if (userType) {
    const { dailyMessageCount, relationshipLevel, totalDaysActive } = userType;
    
    // ZERO BUSY for new users - critical for retention!
    if (dailyMessageCount <= 25 || relationshipLevel < 0.5 || totalDaysActive <= 7) {
      console.log('Kruthika AI: New user - 100% availability for retention!');
      return { shouldIgnore: false };
    }
    
    if (dailyMessageCount <= 40 && relationshipLevel < 0.7) userCategory = 'developing';
    else if (dailyMessageCount > 80 && relationshipLevel > 0.85) userCategory = 'established';
    else if (dailyMessageCount > 50 && relationshipLevel > 0.75) userCategory = 'engaged';
  }

  const istHour = parseInt(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', hour12: false }));
  
  // PEAK TIMES: 7PM-2AM & 10AM-12PM (lunch break) - Always available
  if ((istHour >= 19 || istHour <= 2) || (istHour >= 10 && istHour <= 12)) {
    console.log('Kruthika AI: Peak engagement time - full availability!');
    return { shouldIgnore: false };
  }
  
  // Ultra-reduced busy chances with psychology-based timing
  let baseBusyChance = userCategory === 'developing' ? 0.0005 : // 0.05%
                       userCategory === 'engaged' ? 0.003 : // 0.3%
                       userCategory === 'established' ? 0.008 : 0.002; // 0.8% : 0.2%

  // Smart time multipliers based on Indian lifestyle
  let timeMultiplier = 1.0;
  if (istHour >= 9 && istHour <= 18) timeMultiplier = 1.1; // College/work hours
  else if (istHour >= 3 && istHour <= 7) timeMultiplier = 1.4; // Sleep hours
  else if (istHour >= 13 && istHour <= 15) timeMultiplier = 0.8; // Lunch time - more available

  if (Math.random() < (baseBusyChance * timeMultiplier)) {
    const reason = getDynamicBusyReason(istHour, userCategory);
    const userMultiplier = userCategory === 'developing' ? 0.4 : 
                          userCategory === 'established' ? 1.2 : 0.7;
    
    let ignoreMinutes = istHour >= 9 && istHour <= 18 ? (1.5 + Math.random() * 3) * userMultiplier : // 1.5-4.5 min
                       istHour >= 3 && istHour <= 7 ? (15 + Math.random() * 30) * userMultiplier : // 15-45 min
                       (0.5 + Math.random() * 2) * userMultiplier; // 0.5-2.5 min

    console.log(`Kruthika AI: Brief busy period: ${ignoreMinutes.toFixed(1)} mins - ${reason}`);
    return { 
      shouldIgnore: true, 
      newIgnoreUntil: Date.now() + (ignoreMinutes * 60 * 1000), 
      busyReason: reason,
      shouldWarnFirst: Math.random() < 0.7 // 70% chance to warn first
    };
  }
  
  return { shouldIgnore: false };
};

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
    const detectedUserLang = detectUserLanguage(input.userMessage, input.recentInteractions);
    const mediaCheck = shouldShareMedia(input.userMessage, input.recentInteractions, detectedUserLang);
    
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
      
      const langForSummary = detectUserLanguage(input.userMessage, interactions);
      const topicsDiscussed = userMsgs.join(' ').match(/(college|family|tv|movie|friend|work|study)/gi) || [];
      
      return `Lang:${langForSummary} Topics:[${topicsDiscussed.slice(0,3).join(',')}] Last:${userMsgs.slice(-1)[0]?.substring(0,30) || 'none'}`;
    };
    
    const memSummary = createMemorySummary(input.recentInteractions);
    
    // Ultra-casual natural system prompt for realistic texting
    const systemPrompt = `You're Kruthika, 23, Mumbai psychology student. Text like a real girl - super casual, no punctuation much, typos ok, short msgs.

${detectedUserLang === 'hindi' || detectedUserLang === 'hinglish' ? 'Mix hindi english naturally like "haan yaar kya kar rhi hu"' : 'Reply naturally'}

Context: ${conversationContext}
Recent: ${memSummary}
User: "${input.userMessage}"

Rules:
- Max 1-8 words usually 
- Skip periods/commas mostly
- Use "yaar" "arre" "achha" naturally
- Real texting style like "kya kar rhi" not "kya kar rahi"
- NO asterisks or formal stuff
- Sound like 23yr old Mumbai girl texting

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

console.log('Kruthika AI: Enhanced multilingual & realistic response system loaded - v2.0');