
import { generateAIResponse } from '@/ai/vertex-ai';

export async function sendMessage(message: string) {
  try {
    console.log('Server Action: Received message:', message);
    
    const response = await generateAIResponse(message);
    
    console.log('Server Action: Generated response:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Server Action: Error generating response:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}
