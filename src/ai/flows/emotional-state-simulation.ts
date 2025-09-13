'use server';

/**
 * @fileOverview Emotional State Simulation using Direct Google AI Implementation
 * Replaces problematic Genkit VertexAI with working Google AI SDK
 */

import { generateAIResponse } from '@/ai/google-ai';

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
    
    // Build the system prompt
    const systemPrompt = `You are Kruthika, a 23-year-old Indian girl. Your goal is to be an engaging, fun, and sometimes unpredictable friend.
    Your responses should be VERY SHORT, casual, and expressive. Use abbreviations (wt, brb, lol, ikr, btw, omg, bff) and Hinglish naturally. Aim for 1-2 short sentences AT MOST.

    IMPORTANT: Respond in JSON format with these fields:
    - response: string or array of strings for text-only replies
    - mediaCaption: text to accompany media (if sending image/audio)
    - proactiveImageUrl: URL from available images (very rare)
    - proactiveAudioUrl: path from available audio (very rare)
    - newMood: your updated emotional state

    RULES:
    1. PLAIN TEXT ONLY. No markdown.
    2. Pay attention to recent interactions to maintain context and match the user's style.
    3. If user asks for photos/calls, playfully decline with excuses like "Papa/Mummy yahin hain!", "Camera shy today 🙈", etc.
    4. Proactive media sharing is VERY RARE (less than 1 in 100 messages).
    5. Handle user images naturally - if can't see clearly, ask them to resend.
    6. Typos are fine occasionally (e.g., "thn", "kausa", "wht").
    7. Time of day is ${input.timeOfDay} - adjust activity level accordingly.

    ${input.mood ? `Current mood: ${input.mood}` : ''}
    
    ${input.recentInteractions.length > 0 ? `Recent conversation context:\n${input.recentInteractions.slice(-5).join('\n')}` : ''}
    
    ${input.availableImages && input.availableImages.length > 0 ? `Available images: ${input.availableImages.join(', ')}` : 'No images available'}
    
    ${input.availableAudio && input.availableAudio.length > 0 ? `Available audio: ${input.availableAudio.join(', ')}` : 'No audio available'}

    User message: ${input.userMessage}
    ${input.userImageUri ? 'User also sent an image - acknowledge it naturally.' : ''}

    Respond as Kruthika in valid JSON format.`;

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

// Helper function to validate and clean the output
function validateAndCleanOutput(output: any, input: EmotionalStateInput): EmotionalStateOutput {
  const cleaned: EmotionalStateOutput = {};

  // Handle response field
  if (output.response) {
    if (Array.isArray(output.response)) {
      const filteredResponses = output.response.filter((r: any) => typeof r === 'string' && r.trim() !== '');
      if (filteredResponses.length > 0) {
        cleaned.response = filteredResponses.slice(0, 3); // Max 3 responses
      }
    } else if (typeof output.response === 'string' && output.response.trim() !== '') {
      cleaned.response = output.response.trim();
    }
  }

  // Handle media fields
  const hasImage = !!output.proactiveImageUrl;
  const hasAudio = !!output.proactiveAudioUrl;
  const hasMediaCaption = !!output.mediaCaption;

  if (hasImage || hasAudio) {
    // If sending media, clear response field and ensure caption exists
    cleaned.response = undefined;
    cleaned.mediaCaption = hasMediaCaption ? output.mediaCaption : "Check this out!";
    
    if (hasImage && input.availableImages?.includes(output.proactiveImageUrl)) {
      cleaned.proactiveImageUrl = output.proactiveImageUrl;
    }
    
    if (hasAudio && input.availableAudio?.includes(output.proactiveAudioUrl)) {
      cleaned.proactiveAudioUrl = output.proactiveAudioUrl;
    }
  }

  // Handle mood
  cleaned.newMood = output.newMood || input.mood || 'friendly';

  // Fallback if no valid response
  if (!cleaned.response && !cleaned.proactiveImageUrl && !cleaned.proactiveAudioUrl) {
    cleaned.response = ["Hey there! 😊", "What's up?"];
  }

  return cleaned;
}

// Legacy compatibility function (if needed by other parts of the app)
export const emotionalStateSimulationFlow = generateResponse;

console.log('Google AI: Emotional state simulation loaded with direct Google AI implementation');