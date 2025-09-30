'use server'

import { generateResponse, type EmotionalStateInput } from '@/ai/flows/emotional-state-simulation';
import { shouldAIBeBusyServerSafe } from '@/ai/ignore-utils';

const isEmojiOnlyMessage = (text: string): boolean => {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length > 10) return false;
  const emojiRegex = /^[\p{Emoji}\p{Emoji_Component}\s]+$/u;
  return emojiRegex.test(trimmed);
};

const getSimpleEmojiResponse = (userMessage: string): string | null => {
  const emojiResponses: Record<string, string[]> = {
    '❤️': ['❤️', '💕', '😊❤️', '❤️✨'],
    '😊': ['😊', '😄', '☺️', '😁'],
    '😂': ['😂😂', '🤣', '😆', 'haha 😂'],
    '😭': ['🥺', '💔', 'aww 😭', '🫂'],
    '👋': ['hey! 👋', 'hi! 😊', '👋✨'],
    '🔥': ['🔥🔥', '💯', '🔥✨'],
    '💯': ['💯💯', '🔥', 'yass! 💯'],
    '🤔': ['hmm 🤔', '😅', 'why? 😊'],
    '😴': ['gn 😴', '💤', 'sleep well 😴'],
    '🙏': ['🙏❤️', '😊🙏', 'welcome! 😊'],
  };

  const trimmed = userMessage.trim();
  for (const [emoji, responses] of Object.entries(emojiResponses)) {
    if (trimmed.includes(emoji)) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  
  return isEmojiOnlyMessage(userMessage) ? '😊' : null;
};

export async function sendMessage(
  message: string, 
  currentMood?: string, 
  chatHistory?: string[],
  userTypeData?: { dailyMessageCount: number; relationshipLevel: number; totalDaysActive: number },
  currentIgnoreUntil?: number | null
) {
  try {
    console.log('Server Action: Received message:', message);

    const emojiResponse = getSimpleEmojiResponse(message);
    if (emojiResponse) {
      console.log('Server Action: Emoji-only response (no AI tokens used):', emojiResponse);
      return {
        success: true,
        response: emojiResponse,
        newMood: currentMood || 'friendly',
        usedMood: currentMood || 'friendly',
        tokenOptimized: true
      };
    }

    const startTime = Date.now(); // Start timing for performance logging

    // Get current time of day for enhanced personality
    const hour = new Date().getHours();
    const timeOfDay = hour >= 5 && hour < 12 ? 'morning' : 
                     hour >= 12 && hour < 17 ? 'afternoon' : 
                     hour >= 17 && hour < 21 ? 'evening' : 'night';

    // Enhanced mood selection with psychological variation
    const moods = ['flirty', 'mysterious', 'bubbly', 'melancholic', 'excited', 'stressed'];
    const dynamicMood = currentMood || moods[Math.floor(Math.random() * moods.length)];

    // Strategic image selection based on context and psychology
    const availableImages = [
      'selfie_morning', 'selfie_cafe', 'selfie_college', 'selfie_evening',
      'food_mumbai', 'cafe_work', 'college_friends', 'mumbai_rain', 'study_session',
      'sunset_bandra', 'temple_visit', 'festival_prep', 'mirror_selfie', 'getting_ready'
    ];

    // Smart ignore system - only for users who are 4+ days old and established
    const ignoreLogic = shouldAIBeBusyServerSafe(currentIgnoreUntil, userTypeData, chatHistory?.slice(-3));

    if (ignoreLogic.shouldIgnore) {
      console.log('Server Action: User-aware ignore behavior activated');

      // If there's a busy reason, give a contextual response
      if (ignoreLogic.busyReason && ignoreLogic.shouldWarnFirst) {
        return {
          success: true,
          response: ignoreLogic.busyReason,
          newMood: 'naturally_busy',
          usedMood: dynamicMood,
          wasIgnored: true,
          newIgnoreUntil: ignoreLogic.newIgnoreUntil,
          delayedResponse: true
        };
      } else {
        // Truly ignore - no response
        return {
          success: true,
          response: null,
          newMood: 'naturally_busy',
          usedMood: dynamicMood,
          wasIgnored: true,
          newIgnoreUntil: ignoreLogic.newIgnoreUntil,
          shouldIgnore: true
        };
      }
    }

    // Build optimized input for AI system - reduced context for token efficiency
    const input: EmotionalStateInput = {
      userMessage: message.length > 200 ? message.substring(0, 200) + '...' : message, // Limit input length
      timeOfDay,
      mood: dynamicMood,
      recentInteractions: chatHistory?.slice(-2) || [], // Only last 2 interactions for context
      availableImages: [], // Remove images from regular responses to save tokens
      availableAudio: []
    };

    // Removed artificial server delay - client handles typing delays more naturally

    const aiResponse = await generateResponse(input);

    // Extract the text response from the enhanced output
    let response: string;
    if (aiResponse.proactiveImageUrl) {
      // If AI wants to send an image, use the caption as the text
      response = aiResponse.mediaCaption || "Check this out! 📸";
    } else if (typeof aiResponse.response === 'string') {
      response = aiResponse.response;
    } else if (Array.isArray(aiResponse.response)) {
      response = aiResponse.response.join(' ');
    } else {
      response = "Hey! What's up? 😊";
    }

    console.log('Server Action: Generated enhanced response:', response);
    console.log('Server Action: New mood:', aiResponse.newMood);

    // Log performance metrics
    const processingTime = Date.now() - startTime;
    console.log(`🔧 Message processing time: ${processingTime}ms`);

    // Return response with mood and media for persistence
    return { 
      success: true, 
      response,
      multiPartResponse: aiResponse.multiPartResponse, // Pass multi-part responses to client
      newMood: aiResponse.newMood || dynamicMood,
      usedMood: dynamicMood,
      proactiveImageUrl: aiResponse.proactiveImageUrl,
      proactiveAudioUrl: aiResponse.proactiveAudioUrl,
      mediaCaption: aiResponse.mediaCaption
    };
  } catch (error) {
    console.error('Server Action: Error generating response:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}