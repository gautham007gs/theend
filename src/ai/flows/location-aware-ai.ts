
'use server';

import { generateAIResponse } from '@/ai/vertex-ai';
import { generateLocationAwarePrompt, type LocalizedPersonality } from '@/lib/geo-targeting';
import { enhancedUserManager } from '@/lib/enhanced-user-manager';

export interface LocationAwareInput {
  userMessage: string;
  userLocation?: any;
  localizedPersonality?: LocalizedPersonality;
  culturalContext?: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  recentInteractions: string[];
}

export interface LocationAwareOutput {
  response: string;
  culturalReferences: string[];
  localSlangUsed: string[];
  locationMentions: string[];
  personalityAdaptation: string;
}

// Generate culturally aware AI response
export async function generateLocationAwareResponse(input: LocationAwareInput): Promise<LocationAwareOutput> {
  try {
    // Get user's localized personality
    const personality = input.localizedPersonality || enhancedUserManager.getLocalizedPersonality();
    
    if (!personality) {
      // Fallback to standard response if no location data
      const response = await generateAIResponse(input.userMessage);
      return {
        response,
        culturalReferences: [],
        localSlangUsed: [],
        locationMentions: [],
        personalityAdaptation: 'standard'
      };
    }

    // Generate location-aware system prompt
    const culturalContext = `
    Current time: ${input.timeOfDay}
    Recent conversation: ${input.recentInteractions.slice(-3).join('; ')}
    
    LOCATION-SPECIFIC BEHAVIORS:
    - Reference local weather/season when appropriate
    - Mention local landmarks, popular spots, or areas you know
    - Use timing references relevant to your location (traffic, local events)
    - Share experiences about local culture, food, or activities
    - Use appropriate regional expressions and communication style
    `;

    const systemPrompt = generateLocationAwarePrompt(personality, culturalContext);

    // Enhanced user message analysis for cultural context
    const userMsg = input.userMessage.toLowerCase();
    let enhancedContext = '';

    // Add contextual responses based on user's message content
    if (userMsg.includes('weather')) {
      enhancedContext += `Respond about weather in ${personality.location}. `;
    }
    if (userMsg.includes('food') || userMsg.includes('eat')) {
      enhancedContext += `Mention local food from ${personality.location}. `;
    }
    if (userMsg.includes('work') || userMsg.includes('college') || userMsg.includes('study')) {
      enhancedContext += `Reference your life as a ${personality.occupation} in ${personality.location}. `;
    }
    if (userMsg.includes('weekend') || userMsg.includes('plans')) {
      enhancedContext += `Suggest local activities in ${personality.location}. `;
    }

    const finalPrompt = enhancedContext ? 
      `${systemPrompt}\n\nADDITIONAL CONTEXT: ${enhancedContext}` : 
      systemPrompt;

    // Generate AI response with cultural awareness
    const response = await generateAIResponse(input.userMessage, finalPrompt);

    // Analyze response for cultural elements used
    const analysis = analyzeCulturalElements(response, personality);

    return {
      response,
      culturalReferences: analysis.culturalReferences,
      localSlangUsed: analysis.localSlangUsed,
      locationMentions: analysis.locationMentions,
      personalityAdaptation: personality.name
    };

  } catch (error) {
    console.error('Location-aware AI error:', error);
    
    // Graceful fallback
    const fallbackResponse = await generateAIResponse(input.userMessage);
    return {
      response: fallbackResponse,
      culturalReferences: [],
      localSlangUsed: [],
      locationMentions: [],
      personalityAdaptation: 'fallback'
    };
  }
}

// Analyze cultural elements in AI response
function analyzeCulturalElements(response: string, personality: LocalizedPersonality) {
  const responseLower = response.toLowerCase();
  
  const culturalReferences: string[] = [];
  const localSlangUsed: string[] = [];
  const locationMentions: string[] = [];

  // Check for local slang usage
  personality.localSlang.forEach(slang => {
    if (responseLower.includes(slang.toLowerCase())) {
      localSlangUsed.push(slang);
    }
  });

  // Check for cultural/interest references
  personality.interests.forEach(interest => {
    if (responseLower.includes(interest.toLowerCase())) {
      culturalReferences.push(interest);
    }
  });

  // Check for location mentions
  const locationTerms = [
    personality.location.toLowerCase(),
    ...personality.location.split(',').map(part => part.trim().toLowerCase())
  ];
  
  locationTerms.forEach(term => {
    if (responseLower.includes(term)) {
      locationMentions.push(term);
    }
  });

  return {
    culturalReferences,
    localSlangUsed,
    locationMentions
  };
}

// Get location-appropriate conversation starters
export function getLocationBasedConversationStarters(personality: LocalizedPersonality): string[] {
  const starters = [
    `How's the weather in ${personality.location} today?`,
    `Have you tried the ${personality.foodPreferences[0]} around here?`,
    `What's happening in ${personality.location} this weekend?`,
    `Are you from ${personality.location} originally?`,
    `I love ${personality.interests[0]} - do you too?`
  ];

  return starters;
}

// Generate location-specific small talk
export async function generateLocationSmallTalk(personality: LocalizedPersonality): Promise<string> {
  const topics = [
    `Tell me something interesting about living in ${personality.location}`,
    `What do you love most about ${personality.location}?`,
    `How's the ${personality.foodPreferences[0]} scene in ${personality.location}?`,
    `Have you been to any ${personality.localEvents[0]} events lately?`
  ];

  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  const prompt = generateLocationAwarePrompt(personality, `Start a casual conversation about: ${randomTopic}`);
  
  return await generateAIResponse(randomTopic, prompt);
}

console.log('Location-aware AI system loaded');
