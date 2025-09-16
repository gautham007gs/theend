
import { generateResponse, type EmotionalStateInput } from '@/ai/flows/emotional-state-simulation';

export async function sendMessage(message: string, currentMood?: string, chatHistory?: string[]) {
  try {
    console.log('Server Action: Received message:', message);
    
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
    
    // Ignore system - randomly ignore messages sometimes to simulate real girl behavior
    const ignoreChance = Math.random();
    const shouldIgnore = ignoreChance < 0.05 && message.length > 5; // 5% chance to ignore non-trivial messages
    
    if (shouldIgnore) {
      console.log('Server Action: Simulating authentic ignore behavior');
      // 50% chance to truly ignore (no response), 50% chance to respond with delay/excuse
      const trulyIgnore = Math.random() < 0.5;
      
      if (trulyIgnore) {
        // Return special flag to indicate the message should be ignored completely
        return {
          success: true,
          response: null, // No response at all
          newMood: 'busy_ignoring',
          usedMood: dynamicMood,
          wasIgnored: true,
          shouldIgnore: true
        };
      } else {
        // Delayed "busy" response
        const busyResponses = [
          "Sorry yaar, was in class 📚",
          "Arrey was helping mummy with something",
          "Phone was on silent, sorry! 🙈",
          "Was stuck in Mumbai traffic 🚗💨"
        ];
        
        return {
          success: true,
          response: busyResponses[Math.floor(Math.random() * busyResponses.length)],
          newMood: 'slightly_distracted',
          usedMood: dynamicMood,
          wasIgnored: true,
          delayedResponse: true
        };
      }
    }

    // Build enhanced input for emotional AI system with memory
    const input: EmotionalStateInput = {
      userMessage: message,
      timeOfDay,
      mood: dynamicMood,
      recentInteractions: chatHistory?.slice(-5) || [], // Last 5 interactions for context
      availableImages: availableImages,
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
    
    // Return response with mood and media for persistence
    return { 
      success: true, 
      response,
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
