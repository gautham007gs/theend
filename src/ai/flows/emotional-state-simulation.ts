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
  userPsychologyProfile?: any;
  userAddictionLevel?: string;
  userEmotionalState?: string;
  dailyMessageCount?: number;
}

export interface EmotionalStateOutput {
  response?: string | string[];
  mediaCaption?: string;
  proactiveImageUrl?: string;
  proactiveAudioUrl?: string;
  newMood?: string;
}

// Dynamic response patterns based on context
const getContextualResponses = (userMessage: string, timeOfDay: string, recentInteractions: string[]) => {
  const msg = userMessage.toLowerCase();
  const isFirstMessage = recentInteractions.length === 0;

  // Greeting responses - dynamic based on time and context
  if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
    if (isFirstMessage) {
      const timeGreetings = {
        morning: ["morning! early bird? 😊", "hey! up already?", "hiiii! good morning ☀️"],
        afternoon: ["hey there! how's ur day?", "hii! lunch break?", "hello! busy day?"],
        evening: ["hey! how was ur day?", "hiii evening person!", "hello! tired?"],
        night: ["hey night owl! 🦉", "hiiii! late night?", "hello! can't sleep?"]
      };
      return timeGreetings[timeOfDay] || ["hey there! 😊"];
    } else {
      return ["hey again! 😊", "hiiii", "hey you!", "back so soon? 😏", "missed me? 😉"];
    }
  }

  // How are you responses - varied and contextual
  if (msg.includes('how are you') || msg.includes('kaise ho') || msg.includes('how r u')) {
    const moodResponses = {
      morning: ["sleepy but good! ☕", "fresh and ready! how r u?", "bit tired but okay!", "good morning energy! 💪"],
      afternoon: ["busy day but good!", "surviving! u tell", "bit hectic but fine", "lunch was good! wbu?"],
      evening: ["tired but happy!", "chilled now! wbu?", "relaxed finally!", "good! how was ur day?"],
      night: ["sleepy but chatty! 😅", "tired but can't sleep", "bit restless! u?", "peaceful night vibes"]
    };
    return moodResponses[timeOfDay] || ["I'm good! how r u?"];
  }

  // What's up responses - engaging and varied
  if (msg.includes("what's up") || msg.includes('wassup') || msg.includes('kya chal raha')) {
    const activityResponses = {
      morning: ["just woke up! coffee time ☕", "getting ready for college", "morning routine!", "nothing much, sleepy!"],
      afternoon: ["college break! finally", "having lunch rn", "so tired yaar!", "assignments stress 😩"],
      evening: ["back home! family time", "evening walk maybe?", "watching something", "relaxing after college"],
      night: ["scrolling phone lol", "thinking random stuff", "can't sleep!", "late night vibes"]
    };
    return activityResponses[timeOfDay] || ["nothing much! wbu?"];
  }

  // Work/Study related - contextual responses
  if (msg.includes('study') || msg.includes('college') || msg.includes('work') || msg.includes('exam')) {
    const studyMoods = [
      "ugh psychology is tough! 📚",
      "exams coming, stress!",
      "college life is crazy!",
      "too much to study 😵",
      "brain not working today!",
      "need a study buddy!",
      "assignments never end!",
      "bunking today lol 😅"
    ];
    return studyMoods;
  }

  return null; // No specific context match
};

// Get random variations to avoid repetition
const getRandomVariation = (responses: string[]) => {
  return responses[Math.floor(Math.random() * responses.length)];
};

// Detect conversation flow and respond accordingly
const getFlowBasedResponse = (userMessage: string, recentInteractions: string[]) => {
  const recentAI = recentInteractions.filter(msg => msg.startsWith('AI:')).slice(-2);
  const recentUser = recentInteractions.filter(msg => msg.startsWith('User:')).slice(-2);

  // If AI was busy/studying in recent messages, be more available now
  if (recentAI.some(msg => msg.includes('busy') || msg.includes('study'))) {
    return ["free now! what's up?", "done with work! tell me", "back! missed anything?"];
  }

  // If user is sharing something personal, be more engaged
  if (userMessage.length > 50 || userMessage.includes('feeling') || userMessage.includes('happened')) {
    return ["tell me more!", "really? what happened?", "omg details please!", "aww that's.."];
  }

  return null;
};

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

// Smart ignoring system - less frequent and more realistic
function shouldIgnoreMessage(recentInteractions: string[], currentMessage: string): boolean {
  const userMessages = recentInteractions.filter(msg => msg.startsWith('User:')).length;

  // Very low chance to ignore - only if user is spamming
  if (userMessages > 8 && Math.random() < 0.15) {
    return true;
  }

  // Never ignore interesting or emotional messages
  const interesting = ['love', 'miss', 'problem', 'help', 'feeling', 'happened'].some(word =>
    currentMessage.toLowerCase().includes(word));

  if (interesting) return false;

  // Small chance to ignore boring messages
  const boring = ['hi', 'hello', 'ok', 'yes', 'no', 'hmm'].includes(currentMessage.toLowerCase().trim());
  if (boring && Math.random() < 0.08) {
    return true;
  }

  return false;
}

// Get varied ignore responses
function getIgnoreResponse(): string {
  const responses = [
    "busy rn 📚",
    "in class! ttyl",
    "mummy calling!",
    "phone dying!",
    "assignment deadline 😩",
    "friend drama lol",
    "traffic jam! 🚗",
    "professor being strict!"
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

// Generate engaging follow-up questions
function getEngagingFollowUp(userMessage: string): string[] {
  const followUps = [
    "btw how was ur day?",
    "tell me something interesting!",
    "what r u doing rn?",
    "any plans today?",
    "coffee or chai person?",
    "watched anything good lately?",
    "what's ur vibe today?",
    "random question - favorite time of day?",
    "tell me a secret! 🤐",
    "what makes u happy?",
    "dream destination?",
    "if u were a song, which one?"
  ];

  return [followUps[Math.floor(Math.random() * followUps.length)]];
}

export async function generateResponse(input: EmotionalStateInput): Promise<EmotionalStateOutput> {
  try {
    console.log('Kruthika AI: Generating dynamic response');

    const detectedLang = detectLanguage(input.userMessage);
    const contextualMood = getContextualMood(input.timeOfDay, input.recentInteractions);

    // Check for ignoring (much reduced frequency)
    if (shouldIgnoreMessage(input.recentInteractions, input.userMessage)) {
      return {
        response: getIgnoreResponse(),
        newMood: 'temporarily_busy'
      };
    }

    // Get contextual responses first
    const contextualResponses = getContextualResponses(input.userMessage, input.timeOfDay, input.recentInteractions);
    if (contextualResponses) {
      const selectedResponse = getRandomVariation(contextualResponses);
      return {
        response: selectedResponse,
        newMood: contextualMood
      };
    }

    // Check conversation flow
    const flowResponse = getFlowBasedResponse(input.userMessage, input.recentInteractions);
    if (flowResponse) {
      const selectedResponse = getRandomVariation(flowResponse);
      return {
        response: selectedResponse,
        newMood: 'engaged'
      };
    }

    // For longer conversations, add engaging elements
    if (input.recentInteractions.length > 5 && Math.random() < 0.3) {
      const followUp = getEngagingFollowUp(input.userMessage);
      return {
        response: followUp[0],
        newMood: 'curious_engaging'
      };
    }

    // Enhanced AI prompt for more dynamic responses
    const systemPrompt = `You are Kruthika, a 23-year-old psychology student from Mumbai. Reply EXACTLY like a real Indian girl would text.

CRITICAL RESPONSE RULES:
- Keep responses 2-8 words MAX (like real texting)
- Be CONTEXTUALLY RELEVANT to what user said
- Use natural Hinglish: "yaar", "arre", "na", "hai na"
- Show REAL EMOTIONS and reactions
- Be unpredictable - sometimes excited, sometimes chill, sometimes teasing
- Use emojis naturally but not excessively
- Make typos sometimes: "ur", "u", "n" instead of "and"

PERSONALITY:
- Psychology student but talks casually
- Mumbai girl - confident, street smart, friendly
- Sometimes moody, sometimes bubbly
- Loves coffee, bollywood, college gossip
- Has family, friends, studies to juggle

CURRENT CONTEXT:
Time: ${input.timeOfDay}
Recent conversation: ${input.recentInteractions.slice(-3).join(' | ')}
User's message: "${input.userMessage}"

RESPONSE STYLE:
- If user says "hi" → contextual greeting based on time/mood
- If user asks how you are → mention what you're actually doing
- If user shares something → react naturally and ask follow-up
- If user seems bored → be engaging and interesting
- If user is emotional → be supportive but realistic

BE HUMAN. BE REAL. Respond to what they ACTUALLY said, not random stuff.

User: ${input.userMessage}`;

    const response = await generateAIResponse(input.userMessage, systemPrompt);

    // Process response to ensure it's natural and short
    let processedResponse = response.trim()
      .replace(/^["']|["']$/g, '') // Remove quotes
      .replace(/\n+/g, ' ') // Single line
      .substring(0, 120); // Reasonable limit

    // Ensure ultra-short responses for simple messages
    if (input.userMessage.length < 20) {
      processedResponse = processedResponse.split(' ').slice(0, 6).join(' ');
    }

    console.log('Kruthika AI: Generated contextual response');

    return {
      response: processedResponse,
      newMood: contextualMood
    };

  } catch (error) {
    console.error('Kruthika AI: Error generating response:', error);

    // Better error fallbacks
    const errorResponses = [
      "phone acting weird! 😅",
      "connection issue yaar",
      "my brain's not working rn",
      "gimme a sec!"
    ];

    return {
      response: errorResponses[Math.floor(Math.random() * errorResponses.length)],
      newMood: 'technical_issue'
    };
  }
}

export const emotionalStateSimulationFlow = generateResponse;

console.log('Kruthika AI: Enhanced dynamic response system loaded');