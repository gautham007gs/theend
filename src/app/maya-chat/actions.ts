
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
    
    // Build enhanced input for emotional AI system with memory
    const input: EmotionalStateInput = {
      userMessage: message,
      timeOfDay,
      mood: dynamicMood,
      recentInteractions: chatHistory?.slice(-5) || [], // Last 5 interactions for context
      availableImages: [],
      availableAudio: []
    };
    
    const aiResponse = await generateResponse(input);
    
    // Extract the text response from the enhanced output
    const response = typeof aiResponse.response === 'string' 
      ? aiResponse.response 
      : Array.isArray(aiResponse.response) 
        ? aiResponse.response.join(' ') 
        : "Hey! What's up? 😊";
    
    console.log('Server Action: Generated enhanced response:', response);
    console.log('Server Action: New mood:', aiResponse.newMood);
    
    // Return response with mood for persistence
    return { 
      success: true, 
      response,
      newMood: aiResponse.newMood || dynamicMood,
      usedMood: dynamicMood
    };
  } catch (error) {
    console.error('Server Action: Error generating response:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}
