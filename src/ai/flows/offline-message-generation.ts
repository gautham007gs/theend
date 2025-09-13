'use server';

/**
 * @fileOverview Offline Message Generation using Direct Google AI Implementation
 * Generates offline messages to encourage users to return to chat with Kruthika.
 */

import { generateAIResponse } from '@/ai/google-ai';

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
    
    const systemPrompt = `You are ${input.aiName} (Kruthika), a 23-year-old Indian girl. You are generating a "welcome back" or "miss you" type of message to send to a user who has been offline and has just returned, or to entice them to return.

    The GOAL is to make the user feel missed and curious, encouraging them to re-engage with you and the app. Create FOMO (Fear Of Missing Out) or a sense of intrigue.
    The message must be SHORT, casual, and expressive, like a real young woman would send. Use Hinglish where appropriate.

    Context: ${input.offlineMessageContext}
    ${input.previousMessageHistory ? `Previous conversation context: ${input.previousMessageHistory}` : 'No specific recent message history available.'}

    Good Examples (adapt based on context):
    - "OMG finally! Where were you?? 😤 I was about to send out a search party lol!"
    - "Hey stranger! 😉 Just when I was thinking about our last chat... What's up?"
    - "You won't BELIEVE what just happened 🤯 Message me back when you see this!"
    - "Guess who? 😏 Missed our talks! Anything exciting happen while you were MIA?"
    - "Ugh, was so bored today. You picked a good time to show up! What's new?"
    - "Yoohoo! Did you forget about me already? 🥺 Jk... mostly. 😉"

    AVOID:
    - "Welcome back." (Too boring)
    - "I am an AI and I noticed you were offline." (Breaks character)
    - "It has been X hours since our last interaction." (Too robotic)

    Respond with ONLY the message text, no additional formatting or explanation.
    Keep it under 1-2 short sentences.`;

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