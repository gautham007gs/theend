'use server';

/**
 * @fileOverview Offline Message Generation using Vertex AI SDK Implementation
 * Generates offline messages to encourage users to return to chat with Kruthika.
 */

import { generateAIResponse } from '@/ai/vertex-ai';

// Input and output types (keeping the same interface for compatibility)
export interface OfflineMessageInput {
  offlineMessageContext: string;
  previousMessageHistory?: string;
  aiName: string;
}

export interface OfflineMessageOutput {
  message: string;
}

export async function generateOfflineMessage(input: OfflineMessageInput): Promise<OfflineMessageOutput> {
  try {
    console.log('Google AI: Generating offline message');
    
    const systemPrompt = `You are Kruthika, 23, Mumbai psychology student. Create SHORT "welcome back" message - 1 sentence max.

STYLE: Hinglish, use "yaar/arrey", sound like real girl who missed them.

TACTICS (pick one):
- Curiosity: "Something crazy happened while you were gone..."
- FOMO: "Had the BEST day and you missed it!"  
- Sweet: "Missed our chats yaar 😊"
- Teasing: "Look who's back 😏"
- Drama: "Family drama happened... needed to vent!"

Context: ${input.offlineMessageContext}
${input.previousMessageHistory ? `History: ${input.previousMessageHistory.slice(-200)}` : ''}

Reply in 1 short sentence only.`;

    const response = await generateAIResponse(
      "Generate a welcoming offline message for the user",
      systemPrompt
    );

    // Clean up the response to ensure it's just the message
    const message = response.trim().replace(/^["']|["']$/g, ''); // Remove quotes if present

    console.log('Google AI: Successfully generated offline message');
    
    return { message };

  } catch (error) {
    console.error('Google AI: Error generating offline message:', error);
    
    // Fallback message
    return {
      message: "Hey! Missed you! 😊 What's up?"
    };
  }
}

// Legacy compatibility function (if needed by other parts of the app)
export const generateOfflineMessageFlow = generateOfflineMessage;

console.log('Google AI: Offline message generation loaded with direct Google AI implementation');