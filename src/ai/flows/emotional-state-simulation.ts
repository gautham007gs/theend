'use server';

/**
 * @fileOverview Emotional State Simulation using Vertex AI SDK Implementation
 * Uses Vertex AI with service account authentication for emotional responses
 */

import { generateAIResponse } from '@/ai/vertex-ai';

// Input and output types (keeping the same interface for compatibility)
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

export async function generateResponse(input: EmotionalStateInput): Promise<EmotionalStateOutput> {
  try {
    console.log('Google AI: Starting emotional response generation');
    
    // Optimized short prompt for token efficiency
    const systemPrompt = `You are Kruthika, 23, Mumbai psychology student. Reply VERY SHORT - max 1-2 sentences.

STYLE: Natural Hinglish, use "yaar", "arrey", occasional typos. Be flirty/mysterious sometimes.

TIME: ${input.timeOfDay} (morning=groggy, afternoon=energetic, evening=chill, night=intimate)
MOOD: ${input.mood || 'friendly'}

${input.recentInteractions.length > 0 ? `CONTEXT: ${input.recentInteractions.slice(-2).join(' | ')}` : ''}

REPLY PATTERNS:
- Short: "Hey!", "Hmm 😏", "Seriously?", "Arrey yaar!"  
- Medium: "Was just thinking about you... weird timing 😅"
- Break long replies into 2-3 separate short messages

JSON FORMAT:
{"response": "short_text" OR ["msg1", "msg2"], "newMood": "mood"}

User: ${input.userMessage}
${input.userImageUri ? '[sent image]' : ''}`;

    // Generate response using Google AI
    const aiResponse = await generateAIResponse(input.userMessage, systemPrompt);
    
    // Try to parse JSON response
    let output: EmotionalStateOutput;
    try {
      // Extract JSON from response if it's wrapped in text
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : aiResponse;
      output = JSON.parse(jsonStr);
    } catch (parseError) {
      console.warn('Google AI: Failed to parse JSON response, using fallback format');
      // Fallback to simple text response
      output = {
        response: aiResponse.split('\n').filter(line => line.trim()).slice(0, 2), // Max 2 lines
        newMood: input.mood || 'friendly'
      };
    }

    // Validate and clean up output
    output = validateAndCleanOutput(output, input);
    
    console.log('Google AI: Successfully generated emotional response');
    return output;

  } catch (error) {
    console.error('Google AI: Error in emotional response generation:', error);
    
    // Return friendly error message
    return {
      response: ["Oopsie! My AI brain's connection seems a bit jammed right now (like a Mumbai traffic snarl! 😅)", "Maybe try again in a moment?"],
      newMood: input.mood || "a bit frazzled",
    };
  }
}

// Helper function to validate and enforce short responses
function validateAndCleanOutput(output: any, input: EmotionalStateInput): EmotionalStateOutput {
  const cleaned: EmotionalStateOutput = {};

  // Handle response field - enforce SHORT responses
  if (output.response) {
    if (Array.isArray(output.response)) {
      const filteredResponses = output.response
        .filter((r: any) => typeof r === 'string' && r.trim() !== '')
        .map((r: string) => {
          // Limit each response to max 100 characters
          const trimmed = r.trim();
          return trimmed.length > 100 ? trimmed.substring(0, 97) + '...' : trimmed;
        })
        .slice(0, 3); // Max 3 short responses
      
      if (filteredResponses.length > 0) {
        cleaned.response = filteredResponses;
      }
    } else if (typeof output.response === 'string' && output.response.trim() !== '') {
      let trimmed = output.response.trim();
      // If response is too long, break it into chunks
      if (trimmed.length > 100) {
        const words = trimmed.split(' ');
        const chunks: string[] = [];
        let currentChunk = '';
        
        for (const word of words) {
          if ((currentChunk + ' ' + word).length > 80 && currentChunk) {
            chunks.push(currentChunk.trim());
            currentChunk = word;
          } else {
            currentChunk += (currentChunk ? ' ' : '') + word;
          }
        }
        if (currentChunk) chunks.push(currentChunk.trim());
        
        cleaned.response = chunks.slice(0, 3); // Max 3 chunks
      } else {
        cleaned.response = trimmed;
      }
    }
  }

  // Handle mood
  cleaned.newMood = output.newMood || input.mood || 'friendly';

  // Fallback if no valid response - keep it SHORT
  if (!cleaned.response) {
    const shortReplies = ["Hey!", "Hii 😊", "Sup?", "Hmm?", "Kya yaar?"];
    cleaned.response = shortReplies[Math.floor(Math.random() * shortReplies.length)];
  }

  return cleaned;
}

// Legacy compatibility function (if needed by other parts of the app)
export const emotionalStateSimulationFlow = generateResponse;

console.log('Google AI: Emotional state simulation loaded with direct Google AI implementation');