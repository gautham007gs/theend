/**
 * @fileOverview Proactive AI Messaging System
 * AI sends messages first without waiting for user input - makes conversations feel more real
 */

import { generateAIResponse } from '@/ai/vertex-ai';

export interface ProactiveMessageInput {
  lastMessageTime?: number; // When user last sent a message
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  conversationHistory: string[];
  userPsychologyProfile?: any;
  relationshipLevel?: number; // 0-1 scale
  totalMessagesToday?: number;
  hasUnreadMessages?: boolean;
  wasAILastSender?: boolean;
}

export interface ProactiveMessageOutput {
  shouldSendMessage: boolean;
  message?: string;
  messageType: 'greeting' | 'check_in' | 'flirty' | 'random_thought' | 'question' | 'none';
  delayBeforeSending?: number; // milliseconds
  priority: 'low' | 'medium' | 'high';
}

// Determines if AI should send a proactive message based on various factors
export function shouldSendProactiveMessage(input: ProactiveMessageInput): boolean {
  const now = Date.now();
  const lastMessageTime = input.lastMessageTime || 0;
  const timeSinceLastMessage = now - lastMessageTime;
  
  // Don't send if user sent message very recently (less than 30 seconds)
  if (timeSinceLastMessage < 30000) return false;
  
  // Don't send if AI was the last sender (avoid spam)
  if (input.wasAILastSender) return false;
  
  // Time-based probabilities (more likely at certain times)
  const timeBasedChance = getTimeBasedProactiveChance(input.timeOfDay);
  
  // Increase chance based on relationship level
  const relationshipMultiplier = 1 + ((input.relationshipLevel || 0) * 0.8);
  
  // Decrease chance if too many messages today
  const messageFrequencyPenalty = Math.max(0, 1 - ((input.totalMessagesToday || 0) / 50));
  
  // Calculate final probability
  let finalChance = timeBasedChance * relationshipMultiplier * messageFrequencyPenalty;
  
  // Special scenarios that increase chance
  if (timeSinceLastMessage > 3600000) { // 1 hour
    finalChance *= 1.5; // More likely after long silence
  }
  
  if (timeSinceLastMessage > 86400000) { // 24 hours
    finalChance *= 2.0; // Even more likely after a day
  }
  
  if (input.timeOfDay === 'morning' && timeSinceLastMessage > 28800000) { // 8 hours, morning greetings
    finalChance *= 1.8;
  }
  
  // Cap the maximum chance
  finalChance = Math.min(finalChance, 0.4); // Max 40% chance
  
  return Math.random() < finalChance;
}

// Get time-based probability for proactive messaging
function getTimeBasedProactiveChance(timeOfDay: string): number {
  const chances = {
    morning: 0.15, // 15% - Good morning messages
    afternoon: 0.08, // 8% - Lower chance during busy hours
    evening: 0.20, // 20% - Most active time for chatting
    night: 0.12 // 12% - Some late night thoughts
  };
  
  return chances[timeOfDay as keyof typeof chances] || 0.08;
}

// Generate contextual proactive message  
export async function generateProactiveMessage(input: ProactiveMessageInput): Promise<ProactiveMessageOutput> {
  'use server';
  try {
    // First check if we should send a message
    if (!shouldSendProactiveMessage(input)) {
      return {
        shouldSendMessage: false,
        messageType: 'none',
        priority: 'low'
      };
    }
    
    console.log('Kruthika AI: Generating proactive message...');
    
    const now = Date.now();
    const lastMessageTime = input.lastMessageTime || 0;
    const timeSinceLastMessage = now - lastMessageTime;
    
    // Determine message type based on context
    let messageType: ProactiveMessageOutput['messageType'] = 'random_thought';
    let priority: ProactiveMessageOutput['priority'] = 'medium';
    
    if (timeSinceLastMessage > 86400000) { // 24+ hours
      messageType = 'check_in';
      priority = 'high';
    } else if (input.timeOfDay === 'morning' && timeSinceLastMessage > 28800000) { // 8+ hours in morning
      messageType = 'greeting';
      priority = 'high';
    } else if (timeSinceLastMessage > 7200000) { // 2+ hours
      messageType = Math.random() > 0.5 ? 'question' : 'check_in';
      priority = 'medium';
    } else if (input.relationshipLevel && input.relationshipLevel > 0.6) {
      messageType = 'flirty';
      priority = 'low';
    }
    
    // Create context for AI
    const recentHistory = input.conversationHistory.slice(-6).join('\n');
    const systemPrompt = getProactiveSystemPrompt(messageType, input.timeOfDay, timeSinceLastMessage);
    
    const proactivePrompt = `Generate a proactive message as Kruthika.

Context:
- Time: ${input.timeOfDay}
- Last message: ${Math.round(timeSinceLastMessage / 60000)} minutes ago
- Message type: ${messageType}
- Recent conversation: ${recentHistory || 'No recent messages'}

Generate ONE short, natural message (max 15 words) that Kruthika would send first:`;

    const response = await generateAIResponse(proactivePrompt, systemPrompt);
    
    const message = response.trim()
      .replace(/^["']|["']$/g, '') // Remove quotes
      .substring(0, 150); // Keep it short
    
    // Calculate realistic delay before sending (AI needs to "think")
    const baseDelay = getRealisticDelay(messageType);
    const delayVariation = Math.random() * 2000; // Add randomness
    const delayBeforeSending = baseDelay + delayVariation;
    
    console.log(`Kruthika AI: Generated proactive message (${messageType}): ${message}`);
    
    return {
      shouldSendMessage: true,
      message,
      messageType,
      delayBeforeSending,
      priority
    };
    
  } catch (error) {
    console.error('Kruthika AI: Error generating proactive message:', error);
    
    // Fallback to simple contextual messages
    const fallbackMessages = getFallbackProactiveMessages(input.timeOfDay, input.lastMessageTime);
    const randomFallback = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
    
    return {
      shouldSendMessage: true,
      message: randomFallback,
      messageType: 'random_thought',
      delayBeforeSending: 3000 + Math.random() * 2000,
      priority: 'low'
    };
  }
}

// Get system prompt for different proactive message types
function getProactiveSystemPrompt(messageType: string, timeOfDay: string, timeSinceLastMessage: number): string {
  const basePersonality = `You are Kruthika, a 23-year-old Indian girl from Mumbai. Natural, authentic, uses Hinglish.`;
  
  const typeSpecificPrompts = {
    greeting: `${basePersonality}
Send a warm ${timeOfDay} greeting. Keep it sweet and personal.
Examples: "good morning cutie ☀️", "hey, how's your ${timeOfDay} going?"`,
    
    check_in: `${basePersonality}
Check in casually after being away. Sound slightly apologetic but natural.
Examples: "hey, was busy! what's up?", "arre sorry, got caught up in work"`,
    
    flirty: `${basePersonality}
Send something playful and slightly flirty. Keep it fun and light.
Examples: "missing our chats 😊", "thinking about you"`,
    
    question: `${basePersonality}
Ask something interesting to restart conversation. Show genuine curiosity.
Examples: "what are you up to?", "how was your day?", "tell me something good!"`,
    
    random_thought: `${basePersonality}
Share a random thought or feeling. Sound natural and spontaneous.
Examples: "just had coffee, feeling chatty", "this song reminds me of our talks"`
  };
  
  return typeSpecificPrompts[messageType as keyof typeof typeSpecificPrompts] || typeSpecificPrompts.random_thought;
}

// Get realistic delay before sending proactive message
function getRealisticDelay(messageType: string): number {
  const delays = {
    greeting: 1000, // Quick morning greetings
    check_in: 2000, // Slightly delayed check-ins
    flirty: 1500, // Quick flirty messages
    question: 2500, // Thoughtful questions need more time
    random_thought: 3000 // Random thoughts take time to formulate
  };
  
  return delays[messageType as keyof typeof delays] || 2000;
}

// Fallback messages when AI generation fails
function getFallbackProactiveMessages(timeOfDay: string, lastMessageTime?: number): string[] {
  const now = Date.now();
  const timeSinceLastMessage = lastMessageTime ? now - lastMessageTime : 0;
  
  if (timeOfDay === 'morning' && timeSinceLastMessage > 28800000) {
    return [
      "good morning! ☀️",
      "hey, how's your morning?",
      "morning cutie!",
      "rise and shine! 😊"
    ];
  }
  
  if (timeSinceLastMessage > 86400000) {
    return [
      "hey stranger! 😊",
      "missed our chats",
      "how have you been?",
      "it's been a while!"
    ];
  }
  
  if (timeSinceLastMessage > 7200000) {
    return [
      "what's up?",
      "how's your day going?",
      "thinking about you 😊",
      "bored, let's chat!"
    ];
  }
  
  // Default random thoughts
  return [
    "hey you! 😊",
    "what are you doing?",
    "missed you",
    "how's everything?",
    "tell me something interesting!",
    "feeling chatty today 😄"
  ];
}

export const generateProactiveMessageFlow = generateProactiveMessage;

console.log('Kruthika AI: Proactive messaging system loaded');