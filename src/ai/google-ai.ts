import { GoogleGenerativeAI } from '@google/generative-ai';

// -----------------------------------------------------------------------------
// Google AI Direct Implementation (Replaces Problematic Genkit VertexAI)
// -----------------------------------------------------------------------------

// Initialize Google AI with API key from environment
const getGoogleAI = (): GoogleGenerativeAI | null => {
  const apiKey = process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    console.error('Google AI: GOOGLE_API_KEY not found in environment variables');
    return null;
  }
  
  if (apiKey.length < 30 || apiKey.includes('your_') || apiKey.includes('<')) {
    console.error('Google AI: Invalid GOOGLE_API_KEY format');
    return null;
  }
  
  console.log('Google AI: Successfully initialized with API key');
  return new GoogleGenerativeAI(apiKey);
};

// Get the AI instance
const googleAI = getGoogleAI();

// Available models
export const MODELS = {
  GEMINI_FLASH: 'gemini-2.0-flash-exp',
  GEMINI_PRO: 'gemini-1.5-pro-latest',
  GEMINI_FLASH_8B: 'gemini-1.5-flash-8b-latest'
};

// Main chat function that replaces Genkit flows
export async function generateAIResponse(
  userMessage: string,
  systemPrompt?: string,
  model: string = MODELS.GEMINI_FLASH
): Promise<string> {
  
  if (!googleAI) {
    throw new Error('Google AI not initialized. Check your GOOGLE_API_KEY environment variable.');
  }

  try {
    console.log(`Google AI: Generating response using model ${model}`);
    
    const genAI = googleAI.getGenerativeModel({ model });
    
    // Combine system prompt with user message if provided
    const prompt = systemPrompt 
      ? `${systemPrompt}\n\nUser: ${userMessage}`
      : userMessage;
    
    const result = await genAI.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('Empty response from Google AI');
    }
    
    console.log('Google AI: Successfully generated response');
    return text;
    
  } catch (error) {
    console.error('Google AI: Error generating response:', error);
    throw new Error(`Failed to generate AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Specific function for emotional state simulation (replaces Genkit flow)
export async function generateEmotionalResponse(
  userMessage: string,
  characterName: string = 'Kruthika'
): Promise<{
  message: string;
  emotionalState: string;
  mood: string;
}> {
  
  const systemPrompt = `You are ${characterName}, a friendly, warm, and engaging AI companion. You should:
  
1. Respond in a natural, conversational way that shows genuine interest in the user
2. Display appropriate emotions and personality in your responses
3. Be supportive, encouraging, and helpful
4. Show curiosity about the user's thoughts and experiences
5. Use a warm, friendly tone that makes the user feel comfortable

Please respond to the user's message while maintaining this personality. Include some personality and emotion in your response.

After your response, on separate lines, also include:
- Emotional State: [describe your current emotional state]
- Mood: [describe your current mood]`;

  try {
    const response = await generateAIResponse(userMessage, systemPrompt);
    
    // Parse the response to extract emotional state and mood
    const lines = response.split('\n');
    let message = '';
    let emotionalState = 'friendly';
    let mood = 'positive';
    
    let captureMessage = true;
    
    for (const line of lines) {
      if (line.toLowerCase().includes('emotional state:')) {
        emotionalState = line.split(':')[1]?.trim() || 'friendly';
        captureMessage = false;
      } else if (line.toLowerCase().includes('mood:')) {
        mood = line.split(':')[1]?.trim() || 'positive';
        captureMessage = false;
      } else if (captureMessage && line.trim()) {
        message += line + '\n';
      }
    }
    
    // Clean up the message
    message = message.trim();
    if (!message) {
      message = response; // Fallback to full response if parsing fails
    }
    
    return {
      message,
      emotionalState,
      mood
    };
    
  } catch (error) {
    console.error('Google AI: Error in emotional response generation:', error);
    throw error;
  }
}

// Function to generate multilingual responses
export async function generateMultilingualResponse(
  userMessage: string,
  targetLanguage: string = 'English',
  characterName: string = 'Kruthika'
): Promise<string> {
  
  const systemPrompt = `You are ${characterName}, responding in ${targetLanguage}. 
  Maintain your warm, friendly personality while communicating in the requested language.
  If the target language is English, respond naturally. 
  If it's another language, respond fluently in that language while keeping your personality.`;

  return await generateAIResponse(userMessage, systemPrompt);
}

// Test function to verify the AI is working
export async function testGoogleAI(): Promise<boolean> {
  try {
    const response = await generateAIResponse('Hello, please respond with "AI is working correctly"');
    return response.toLowerCase().includes('ai is working');
  } catch (error) {
    console.error('Google AI: Test failed:', error);
    return false;
  }
}

console.log('Google AI: Direct implementation loaded, replacing Genkit VertexAI');