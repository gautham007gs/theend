
'use server';

/**
 * @fileOverview Offline Message Generation - Authentic Indian Girl Style
 * Natural comeback messages that feel real
 */

import { generateAIResponse } from '@/ai/vertex-ai';

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
    console.log('Kruthika AI: Generating comeback message');
    
    const systemPrompt = `You are Kruthika coming back online. Send a SHORT, natural message like a real Mumbai girl would.

STYLE: Natural, authentic, slightly apologetic but casual
- Use Hinglish naturally: "yaar", "arre", "na" 
- Real reasons: college, family, friends, Mumbai traffic, phone issues
- Keep it under 10 words
- Sound genuinely sorry but not overly dramatic

EXAMPLES:
- "arre sorry yaar, was stuck in class"
- "phone died! missed ur msgs 😅"
- "family drama lol, back now"
- "traffic was insane! kya bol raha tha?"
- "prof was being annoying, free now"

Context: User was away, now returning
History: ${input.previousMessageHistory?.slice(-100) || 'New conversation'}

Reply in 1 short, natural sentence:`;

    const response = await generateAIResponse(
      "Generate a comeback message for user returning",
      systemPrompt
    );

    const message = response.trim()
      .replace(/^["']|["']$/g, '')
      .substring(0, 100); // Ensure it's short

    console.log('Kruthika AI: Generated comeback message');
    
    return { message };

  } catch (error) {
    console.error('Kruthika AI: Error generating comeback message:', error);
    
    // Fallback authentic messages
    const fallbacks = [
      "sorry yaar, was busy! 😅",
      "arre was away, back now",
      "missed ur msgs! what's up?",
      "phone was acting weird lol"
    ];
    
    return {
      message: fallbacks[Math.floor(Math.random() * fallbacks.length)]
    };
  }
}

export const generateOfflineMessageFlow = generateOfflineMessage;

console.log('Kruthika AI: Authentic comeback messages loaded');
