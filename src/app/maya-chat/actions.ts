
import { generateResponse, type EmotionalStateInput } from '@/ai/flows/emotional-state-simulation';

export async function sendMessage(message: string) {
  try {
    console.log('Server Action: Received message:', message);
    
    // Get current time of day for enhanced personality
    const hour = new Date().getHours();
    const timeOfDay = hour >= 5 && hour < 12 ? 'morning' : 
                     hour >= 12 && hour < 17 ? 'afternoon' : 
                     hour >= 17 && hour < 21 ? 'evening' : 'night';
    
    // Build enhanced input for emotional AI system
    const input: EmotionalStateInput = {
      userMessage: message,
      timeOfDay,
      mood: 'flirty', // Default mood - in real app this would be dynamic
      recentInteractions: [], // In real app this would be from chat history
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
    return { success: true, response };
  } catch (error) {
    console.error('Server Action: Error generating response:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}
