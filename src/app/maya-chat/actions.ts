
import { generate } from '@/ai/genkit';

export async function sendMessage(message: string) {
  try {
    console.log('Server Action: Received message:', message);
    
    const response = await generate({
      prompt: message,
      config: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    });
    
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
