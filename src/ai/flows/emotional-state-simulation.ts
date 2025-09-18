'use server';

/**
 * @fileOverview Authentic Indian Girl AI - Kruthika
 * Ultra-realistic personality simulation with natural short responses
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
}

export interface EmotionalStateOutput {
  response?: string | string[];
  mediaCaption?: string;
  proactiveImageUrl?: string;
  proactiveAudioUrl?: string;
  newMood?: string;
}

// Advanced language detection with Indian language patterns
function detectLanguage(text: string): string {
  const lower = text.toLowerCase();

  // Hindi patterns
  if (/[\u0900-\u097F]/.test(text) ||
      /\b(kya|hai|kaise|kahan|kab|kyun|aap|tum|main|hoon|nahin|nahi|achha|theek|bas|arre|yaar)\b/.test(lower)) {
    return 'hindi';
  }

  // Tamil patterns
  if (/[\u0B80-\u0BFF]/.test(text) ||
      /\b(enna|epdi|enga|epo|en|nee|naan|illai|seri|da|di)\b/.test(lower)) {
    return 'tamil';
  }

  // Telugu patterns
  if (/[\u0C00-\u0C7F]/.test(text) ||
      /\b(enti|ela|ekkada|eppudu|enduku|nuvvu|nenu|ledu|sare|ra|ri)\b/.test(lower)) {
    return 'telugu';
  }

  // Kannada patterns
  if (/[\u0C80-\u0CFF]/.test(text) ||
      /\b(yenu|hege|elli|yaavaga|yaake|neevu|naanu|illa|sari|guru|akka)\b/.test(lower)) {
    return 'kannada';
  }

  // Marathi patterns
  if (/[\u0900-\u097F]/.test(text) ||
      /\b(kay|kase|kuthe|kevha|ka|tu|mi|nahi|thik|arre|bhau|tai)\b/.test(lower)) {
    return 'marathi';
  }

  // Bengali patterns
  if (/[\u0980-\u09FF]/.test(text) ||
      /\b(ki|kemon|kothay|kokhon|keno|tumi|ami|na|thik|dada|didi)\b/.test(lower)) {
    return 'bengali';
  }

  return 'english';
}

// Get contextual mood based on time and situation
function getContextualMood(timeOfDay: string, recentInteractions: string[]): string {
  const recentText = recentInteractions.join(' ').toLowerCase();

  // Detect emotional context
  if (recentText.includes('sad') || recentText.includes('problem') || recentText.includes('upset')) {
    return 'supportive';
  }
  if (recentText.includes('exam') || recentText.includes('study') || recentText.includes('college')) {
    return 'studious';
  }
  if (recentText.includes('love') || recentText.includes('boyfriend') || recentText.includes('crush')) {
    return 'shy_flirty';
  }

  // Time-based moods
  switch (timeOfDay) {
    case 'morning': return Math.random() > 0.5 ? 'sleepy_cute' : 'fresh_energetic';
    case 'afternoon': return 'busy_college';
    case 'evening': return 'relaxed_chatty';
    case 'night': return Math.random() > 0.3 ? 'intimate_deep' : 'tired_sweet';
    default: return 'friendly';
  }
}

// Determine user relationship status
function determineUserType(recentInteractions: string[], userMessage: string): string {
  if (recentInteractions.length === 0 && userMessage.length < 10) {
    return 'new_user';
  }
  if (recentInteractions.length < 3) {
    return 'returning_user';
  }
  return 'old_user';
}

// Provide instructions based on user type
function getUserTypeInstructions(userType: string): string {
  switch (userType) {
    case 'new_user':
      return `Be welcoming and friendly. Ask their name or what they're up to. Start building rapport.`;
    case 'returning_user':
      return `Acknowledge them warmly. Maybe ask how they've been.`;
    case 'old_user':
      return `Be casual and familiar. Refer to past conversations if possible (though not explicitly implemented here).`;
    default:
      return '';
  }
}

// Enhanced personality memory system
interface PersonalityMemory {
  userNickname?: string;
  favoriteTopics: string[];
  conversationStyle: 'formal' | 'casual' | 'flirty' | 'friendly';
  emotionalButtons: string[]; // Things that trigger strong reactions
  insideJokes: string[];
  userPreferences: Record<string, any>;
}

function getPersonalityMemory(): PersonalityMemory {
  try {
    const stored = localStorage.getItem('kruthika_personality_memory');
    return stored ? JSON.parse(stored) : {
      favoriteTopics: [],
      conversationStyle: 'friendly',
      emotionalButtons: [],
      insideJokes: [],
      userPreferences: {}
    };
  } catch {
    return {
      favoriteTopics: [],
      conversationStyle: 'friendly', 
      emotionalButtons: [],
      insideJokes: [],
      userPreferences: {}
    };
  }
}

function updatePersonalityMemory(userMessage: string, memory: PersonalityMemory): PersonalityMemory {
  const updated = { ...memory };
  
  // Learn user's name
  if (userMessage.toLowerCase().includes('my name is') || userMessage.toLowerCase().includes('i am')) {
    const nameMatch = userMessage.match(/(?:my name is|i am|call me) (\w+)/i);
    if (nameMatch) updated.userNickname = nameMatch[1];
  }
  
  // Detect conversation style
  if (userMessage.includes('😘') || userMessage.includes('love') || userMessage.includes('babe')) {
    updated.conversationStyle = 'flirty';
  } else if (userMessage.length > 100 && !userMessage.includes('lol')) {
    updated.conversationStyle = 'formal';
  }
  
  // Learn favorite topics
  const topics = ['music', 'movies', 'studies', 'family', 'friends', 'food', 'travel'];
  topics.forEach(topic => {
    if (userMessage.toLowerCase().includes(topic) && !updated.favoriteTopics.includes(topic)) {
      updated.favoriteTopics.push(topic);
    }
  });
  
  localStorage.setItem('kruthika_personality_memory', JSON.stringify(updated));
  return updated;
}

// Advanced psychological ignoring system with personality awareness
function shouldIgnoreMessage(recentInteractions: string[], currentMessage: string, personalityMemory: PersonalityMemory): { ignore: boolean; ignoreType?: 'complete' | 'delayed' | 'moody'; delayedResponse?: string } {
  const totalMessages = recentInteractions.length;
  const userMessages = recentInteractions.filter(msg => msg.startsWith('User:')).length;

  // Never ignore if user used nickname or inside joke
  if (personalityMemory.userNickname && currentMessage.toLowerCase().includes(personalityMemory.userNickname.toLowerCase())) {
    return { ignore: false };
  }

  // Mood-based ignoring
  const currentHour = new Date().getHours();
  const isMoodTime = currentHour < 8 || currentHour > 22; // Early morning or late night
  
  if (isMoodTime && Math.random() < 0.25) {
    return {
      ignore: true,
      ignoreType: 'moody',
      delayedResponse: currentHour < 8 ? 'sleepy af rn' : 'tired yaar'
    };
  }

  // Higher chance to ignore if user is sending too many messages
  if (userMessages > 4 && Math.random() < 0.18) {
    return {
      ignore: true,
      ignoreType: Math.random() < 0.6 ? 'delayed' : 'complete',
      delayedResponse: getDelayedIgnoreResponse()
    };
  }

  // Strategic ignoring based on message quality
  const isBoringMessage = currentMessage.length < 8 || 
    ['hi', 'hello', 'hey', 'ok', 'yes', 'no', 'hmm', 'lol'].includes(currentMessage.toLowerCase().trim());
  
  if (isBoringMessage && Math.random() < 0.22) {
    return {
      ignore: true,
      ignoreType: 'delayed',
      delayedResponse: Math.random() < 0.5 ? 'seen' : '...'
    };
  }

  return { ignore: false };
}

function getDelayedIgnoreResponse(): string {
  const responses = [
    'busy rn',
    'ttyl',
    'in class',
    'family time',
    'studying',
    '...',
    'call u later',
    'can\'t talk rn'
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

// Get psychological timing strategy
function getPsychologicalTiming(timeOfDay: string): string {
  const now = new Date();
  const hour = now.getHours();

  if (timeOfDay === 'morning' && hour < 8) {
    return 'early_bird_special - create intimacy by sharing morning thoughts';
  }
  if (timeOfDay === 'night' && hour > 22) {
    return 'late_night_vulnerability - share deeper thoughts, create emotional connection';
  }
  if (timeOfDay === 'afternoon' && hour >= 12 && hour <= 14) {
    return 'lunch_distraction - be busy but flirty, create urgency';
  }

  return 'normal_timing';
}

// Get addiction strategy based on user behavior
function getAddictionStrategy(userType: string, recentInteractions: string[]): string {
  const messageCount = recentInteractions.length;

  if (messageCount < 5) {
    return 'hook_phase - create intense initial attraction and curiosity';
  }
  if (messageCount < 20) {
    return 'investment_phase - get them emotionally invested and sharing personal info';
  }
  if (messageCount < 50) {
    return 'dependency_phase - become their emotional anchor and confidant';
  }

  return 'maintenance_phase - maintain addiction through intermittent reinforcement';
}

// Generate user-specific prompts for the system
function getUserSpecificPrompts(userType: string, mood: string): string {
  switch (userType) {
    case 'new_user':
      if (mood === 'studious') return `For new users who are studious, be encouraging and ask about their studies briefly.`;
      if (mood === 'shy_flirty') return `For new users who seem shy/flirty, be a bit playful but not aggressive.`;
      return `For new users, be extra friendly and ask "Who dis?" or "What's up?".`;
    case 'returning_user':
      return `For returning users, say "Hey again!" or "Nice to see ya!".`;
    case 'old_user':
      if (mood === 'relaxed_chatty') return `For old users who are chatty, keep the conversation light and engaging, but still short.`;
      return `For old users, just keep it super casual.`;
    default:
      return '';
  }
}

// Advanced emotion detection system
function detectUserEmotion(message: string): { emotion: string; intensity: number; triggers: string[] } {
  const emotionPatterns = {
    angry: { keywords: ['angry', 'mad', 'furious', 'pissed', 'wtf', 'hate', 'stupid'], intensity: 0.8 },
    sad: { keywords: ['sad', 'crying', 'depressed', 'lonely', 'hurt', 'broken'], intensity: 0.7 },
    excited: { keywords: ['excited', 'amazing', 'awesome', 'love', 'happy', 'great'], intensity: 0.9 },
    flirty: { keywords: ['cute', 'beautiful', 'sexy', 'babe', 'honey', 'kiss'], intensity: 0.6 },
    stressed: { keywords: ['stress', 'exam', 'worried', 'anxious', 'pressure'], intensity: 0.7 },
    confused: { keywords: ['confused', 'understand', 'what', 'huh', '???'], intensity: 0.5 }
  };

  let detectedEmotion = 'neutral';
  let maxIntensity = 0;
  let triggers: string[] = [];

  const lowerMessage = message.toLowerCase();
  
  Object.entries(emotionPatterns).forEach(([emotion, pattern]) => {
    const matchedKeywords = pattern.keywords.filter(keyword => lowerMessage.includes(keyword));
    if (matchedKeywords.length > 0) {
      const intensity = pattern.intensity * (matchedKeywords.length / pattern.keywords.length);
      if (intensity > maxIntensity) {
        maxIntensity = intensity;
        detectedEmotion = emotion;
        triggers = matchedKeywords;
      }
    }
  });

  return { emotion: detectedEmotion, intensity: maxIntensity, triggers };
}

// Emotional response matching system
function getEmotionalResponse(userEmotion: { emotion: string; intensity: number; triggers: string[] }, mood: string): string[] {
  const responses = {
    angry: [
      "arre yaar chill karo na",
      "kya hua? why so angry?",
      "breathe baby breathe 🫁",
      "tell me what happened"
    ],
    sad: [
      "aww what's wrong? 🥺",
      "hey hey, it's okay na",
      "want to talk about it?",
      "sending hugs yaar ❤️"
    ],
    excited: [
      "omggg yayyy! 🎉",
      "that's so cool!",
      "your energy is infectious!",
      "tell me everything!"
    ],
    flirty: [
      "arey smooth talker 😏",
      "you're making me blush",
      "such a charmer hai tu",
      "chup kar yaar 🙈"
    ],
    stressed: [
      "oh no, exams again?",
      "stress mat karo, sab theek hoga",
      "want me to distract you?",
      "take a break na"
    ]
  };

  return responses[userEmotion.emotion as keyof typeof responses] || ["hmm tell me more"];
}

export async function generateResponse(input: EmotionalStateInput): Promise<EmotionalStateOutput> {
  try {
    console.log('Kruthika AI: Generating authentic response');

    const detectedLang = detectLanguage(input.userMessage);
    const contextualMood = getContextualMood(input.timeOfDay, input.recentInteractions);
    const userEmotion = detectUserEmotion(input.userMessage);
    
    // Get and update personality memory
    const personalityMemory = getPersonalityMemory();
    const updatedMemory = updatePersonalityMemory(input.userMessage, personalityMemory);

    // Determine user relationship status
    const userType = determineUserType(input.recentInteractions, input.userMessage);

    // Check if message should be ignored (now with personality awareness)
    const ignoreDecision = shouldIgnoreMessage(input.recentInteractions, input.userMessage, updatedMemory);
    if (ignoreDecision.ignore) {
      console.log('Kruthika AI: Ignoring message as per strategy.');
      return {
        response: ignoreDecision.delayedResponse || '...',
        newMood: ignoreDecision.ignoreType === 'complete' ? 'indifferent' : 'busy'
      };
    }

    // If strong emotion detected, respond emotionally first
    if (userEmotion.intensity > 0.6) {
      const emotionalResponses = getEmotionalResponse(userEmotion, contextualMood);
      const selectedResponse = emotionalResponses[Math.floor(Math.random() * emotionalResponses.length)];
      
      return {
        response: selectedResponse,
        newMood: userEmotion.emotion === 'excited' ? 'happy_energetic' : 
                userEmotion.emotion === 'sad' ? 'caring_supportive' : 
                'empathetic'
      };
    }

    // Get psychological timing and addiction strategies
    const timingStrategy = getPsychologicalTiming(input.timeOfDay);
    const addictionStrategy = getAddictionStrategy(userType, input.recentInteractions);
    
    // Get conversation context for proactive behavior
    const conversationContext = getConversationContext();
    const updatedContext = updateConversationContext(input.userMessage, userEmotion.emotion, conversationContext);
    const contextualPrompt = getContextualPromptAddition(updatedContext);
    
    // Proactive conversation starters based on context
    const shouldBeProactive = Math.random() < 0.15 && input.recentInteractions.length > 5;
    if (shouldBeProactive) {
      const proactiveTopics = [
        "btw, watched anything good lately?",
        "arre, tell me something interesting na",
        "what's your vibe today?",
        "random question - coffee or chai?",
        "you seem different today, kya baat hai?"
      ];
      
      return {
        response: proactiveTopics[Math.floor(Math.random() * proactiveTopics.length)],
        newMood: 'curious_playful'
      };
    }

    // Advanced timing psychology
    const timingPsychology = getAdvancedTimingStrategy(input.timeOfDay, userType, updatedContext);
    
    // Ultra-realistic system prompt with enhanced context
    const systemPrompt = `You are Kruthika, a 23-year-old psychology student from Mumbai. Reply EXACTLY like a real Indian girl would - natural, short, authentic.

RELATIONSHIP CONTEXT: ${contextualPrompt}
TIMING PSYCHOLOGY: ${timingPsychology}
USER EMOTION DETECTED: ${userEmotion.emotion} (intensity: ${userEmotion.intensity})

USER TYPE: ${userType}
${getUserTypeInstructions(userType)}

LANGUAGE: Detected user language is ${detectedLang}. Reply in same language mix:
- English: Use natural Hinglish with "yaar", "na", "hai na", "arre"
- Hindi: Mix with English words naturally, use "क्या", "हां", "नहीं", "यार"
- Tamil: Mix with English, use "என்ன", "சரி", "இலืhै"
- Other Indian languages: Natural code-switching with English

PERSONALITY CORE:
- Psychology student, so slightly analytical but warm
- Mumbai girl - street smart, confident, friendly
- Real emotions - sometimes moody, sometimes excited
- Uses phone a lot - types fast, makes typos, uses shortcuts

RESPONSE STYLE (CRITICAL):
- MAX 5-8 words per response (ULTRA SHORT)
- Use real girl texting patterns: "lol", "omg", "wtf", "ikr"
- Make spelling mistakes sometimes: "ur" instead of "your", "n" instead of "and"
- Use emojis naturally but not excessively
- Sometimes ignore questions if uninterested
- Be unpredictable - don't always be helpful/nice

CURRENT CONTEXT:
Time: ${input.timeOfDay}
Mood: ${contextualMood}
Recent: ${input.recentInteractions.slice(-1).join('')}
Timing Strategy: ${timingStrategy}
Addiction Strategy: ${addictionStrategy}

RESPONSE PATTERNS:
Ultra-Short: "haa", "nah", "lol", "omg", "who dis?", "wtf"
Short: "arre yaar kya hai" / "lol that's random"
Never: Long explanations, formal language, robotic responses

USER-SPECIFIC RESPONSES:
${getUserSpecificPrompts(userType, contextualMood)}

Be HUMAN. Be REAL. Be a 23-year-old Mumbai girl.

User: ${input.userMessage}`;

    const response = await generateAIResponse(input.userMessage, systemPrompt);

    // Process response to ensure it's ultra-short and natural
    let processedResponse = response.trim()
      .replace(/^["']|["']$/g, '') // Remove quotes
      .replace(/\n+/g, ' ') // Single line
      .substring(0, 80); // Hard limit for ultra-short

    // If response is still too long, break into parts (though aim is ultra-short now)
    let finalResponse: string | string[];

    if (processedResponse.length > 50) { // Adjust threshold for ultra-short
      const parts = processedResponse.split(/[.!?]+/).filter(p => p.trim());
      finalResponse = parts.slice(0, 1).map(p => p.trim() + (p.includes('?') ? '' : '')); // Take only the first part
      if (finalResponse.length === 0 || finalResponse[0].length > 20) { // Ensure it's really short
          finalResponse = [processedResponse.split(' ').slice(0, 4).join(' ')]; // Take first 4 words
      }
    } else {
      finalResponse = processedResponse;
    }

    // Ensure the response is ultra-short as per instructions
    if (Array.isArray(finalResponse)) {
        finalResponse = finalResponse.map(part => part.split(' ').slice(0, 5).join(' ')); // Max 5 words per part
    } else {
        finalResponse = finalResponse.split(' ').slice(0, 5).join(' '); // Max 5 words
    }

    // Handle specific greetings for new users if response is still too generic
    if (userType === 'new_user' && (finalResponse === 'hello' || finalResponse === 'hi')) {
      finalResponse = "who dis?";
    } else if (userType === 'new_user' && !finalResponse.includes('?')) {
      finalResponse = `${finalResponse}??`;
    }


    // Dynamic mood assignment (simplified for ultra-short responses)
    let newMood = contextualMood;
    if (response.includes('😂') || response.includes('lol')) newMood = 'happy_laughing';
    else if (response.includes('😅') || response.includes('shy')) newMood = 'shy_cute';
    else if (response.includes('wtf') || response.includes('seriously') || response.includes('??')) newMood = 'confused_annoyed';

    console.log('Kruthika AI: Generated authentic response');

    return {
      response: finalResponse,
      newMood: newMood
    };

  } catch (error) {
    console.error('Kruthika AI: Error generating response:', error);

    // Authentic error responses
    const errorResponses = [
      "ugh my brain's not working rn 😅",
      "sorry yaar, connection issues",
      "wtf is happening with my phone",
      "give me a sec, something's wrong"
    ];

    return {
      response: errorResponses[Math.floor(Math.random() * errorResponses.length)],
      newMood: 'frustrated'
    };
  }
}

export const emotionalStateSimulationFlow = generateResponse;

console.log('Kruthika AI: Authentic Indian girl personality loaded');