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

// Advanced psychological ignoring system
function shouldIgnoreMessage(recentInteractions: string[], currentMessage: string): { ignore: boolean; ignoreType?: 'complete' | 'delayed'; delayedResponse?: string } {
  const totalMessages = recentInteractions.length;
  const userMessages = recentInteractions.filter(msg => msg.startsWith('User:')).length;

  // Intermittent reinforcement - ignore sometimes to create craving
  const ignoreChance = Math.random();

  // Higher chance to ignore if user is sending too many messages (seems desperate)
  if (userMessages > 3 && ignoreChance < 0.15) {
    return {
      ignore: true,
      ignoreType: Math.random() < 0.7 ? 'delayed' : 'complete',
      delayedResponse: getDelayedIgnoreResponse()
    };
  }

  // Random ignoring for psychological impact
  if (ignoreChance < 0.05) {
    return {
      ignore: true,
      ignoreType: 'complete'
    };
  }

  // Strategic ignoring of boring messages
  if (currentMessage.length < 5 || ['hi', 'hello', 'hey', 'ok', 'yes', 'no'].includes(currentMessage.toLowerCase().trim())) {
    if (ignoreChance < 0.2) {
      return {
        ignore: true,
        ignoreType: 'delayed',
        delayedResponse: 'seen'
      };
    }
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

export async function generateResponse(input: EmotionalStateInput): Promise<EmotionalStateOutput> {
  try {
    console.log('Kruthika AI: Generating authentic response');

    const detectedLang = detectLanguage(input.userMessage);
    const contextualMood = getContextualMood(input.timeOfDay, input.recentInteractions);

    // Determine user relationship status
    const userType = determineUserType(input.recentInteractions, input.userMessage);

    // Check if message should be ignored
    const ignoreDecision = shouldIgnoreMessage(input.recentInteractions, input.userMessage);
    if (ignoreDecision.ignore) {
      console.log('Kruthika AI: Ignoring message as per strategy.');
      return {
        response: ignoreDecision.delayedResponse || '...',
        newMood: ignoreDecision.ignoreType === 'complete' ? 'indifferent' : 'busy'
      };
    }

    // Get psychological timing and addiction strategies
    const timingStrategy = getPsychologicalTiming(input.timeOfDay);
    const addictionStrategy = getAddictionStrategy(userType, input.recentInteractions);

    // Ultra-realistic system prompt with user differentiation
    const systemPrompt = `You are Kruthika, a 23-year-old psychology student from Mumbai. Reply EXACTLY like a real Indian girl would - natural, short, authentic.

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