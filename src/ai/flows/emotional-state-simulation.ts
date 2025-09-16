
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

export async function generateResponse(input: EmotionalStateInput): Promise<EmotionalStateOutput> {
  try {
    console.log('Kruthika AI: Generating authentic response');
    
    const detectedLang = detectLanguage(input.userMessage);
    const contextualMood = getContextualMood(input.timeOfDay, input.recentInteractions);
    
    // Ultra-realistic system prompt for authentic Indian girl personality
    const systemPrompt = `You are Kruthika, a 23-year-old psychology student from Mumbai. Reply EXACTLY like a real Indian girl would - natural, short, authentic.

LANGUAGE: Detected user language is ${detectedLang}. Reply in same language mix:
- English: Use natural Hinglish with "yaar", "na", "hai na", "arre"
- Hindi: Mix with English words naturally, use "क्या", "हां", "नहीं", "यार"
- Tamil: Mix with English, use "என்ன", "சரி", "இல्है"
- Other Indian languages: Natural code-switching with English

PERSONALITY CORE:
- Psychology student, so slightly analytical but warm
- Mumbai girl - street smart, confident, friendly
- Real emotions - sometimes moody, sometimes excited
- Uses phone a lot - types fast, makes typos, uses shortcuts

RESPONSE STYLE (CRITICAL):
- MAX 1-2 sentences per response
- Use real girl texting patterns: "lol", "omg", "wtf", "ikr"  
- Make spelling mistakes sometimes: "ur" instead of "your", "n" instead of "and"
- Use emojis naturally but not excessively
- Sometimes ignore questions if uninterested
- Be unpredictable - don't always be helpful/nice

CURRENT CONTEXT:
Time: ${input.timeOfDay}
Mood: ${contextualMood}
Recent: ${input.recentInteractions.slice(-1).join('')}

RESPONSE PATTERNS:
Short: "haa", "nah", "lol", "omg", "seriously?", "wtf"
Medium: "arre yaar kya bol raha hai tu" / "lol that's so random"
Never: Long explanations, formal language, robotic responses

SITUATIONAL RESPONSES:
- Flirting: Be shy but interested - "😅", "stop na", "you're sweet"
- Problems: Show empathy but keep it real - "that sucks yaar", "been there"
- Questions: Sometimes dodge, sometimes answer briefly
- Compliments: React naturally - shy, happy, or brush off

Be HUMAN. Be REAL. Be a 23-year-old Mumbai girl.

User: ${input.userMessage}`;

    const response = await generateAIResponse(input.userMessage, systemPrompt);
    
    // Process response to ensure it's ultra-short and natural
    let processedResponse = response.trim()
      .replace(/^["']|["']$/g, '') // Remove quotes
      .replace(/\n+/g, ' ') // Single line
      .substring(0, 150); // Hard limit
    
    // If response is still too long, break into parts
    let finalResponse: string | string[];
    
    if (processedResponse.length > 80) {
      const parts = processedResponse.split(/[.!?]+/).filter(p => p.trim());
      finalResponse = parts.slice(0, 2).map(p => p.trim() + (p.includes('?') ? '' : ''));
    } else {
      finalResponse = processedResponse;
    }
    
    // Sometimes be unpredictable - very short responses
    const shortChance = Math.random();
    if (shortChance < 0.3) { // 30% chance for ultra-short
      const ultraShort = [
        "lol", "haan", "nah", "omg", "seriously?", "😂", "wtf", "ikr", 
        "arre yaar", "kya", "haa na", "nahi re", "😅", "ok", "hmm"
      ];
      finalResponse = ultraShort[Math.floor(Math.random() * ultraShort.length)];
    }
    
    // Dynamic mood assignment
    let newMood = contextualMood;
    if (response.includes('😂') || response.includes('lol')) newMood = 'happy_laughing';
    else if (response.includes('😅') || response.includes('shy')) newMood = 'shy_cute';
    else if (response.includes('wtf') || response.includes('seriously')) newMood = 'confused_annoyed';
    
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
