import { VertexAI } from '@google-cloud/vertexai';
import { logger } from '@/utils/logger';
import { parseGoogleCredentials } from './credential-utils';
import { 
  getCachedResponse, 
  cacheResponse, 
  selectOptimalModel, 
  getOptimizedGenerationConfig, 
  analyzeTaskComplexity,
  buildOptimizedPrompt,
  optimizeConversationContext,
  estimateTokenSavings,
  clearExpiredCache,
  trackTokenUsage
} from './token-optimization';

// -----------------------------------------------------------------------------
// Vertex AI Implementation - Complete Replacement
// -----------------------------------------------------------------------------

// Initialize Vertex AI with service account credentials
const getVertexAI = (): VertexAI | null => {
  try {
    const projectId = process.env.VERTEX_AI_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT_ID;
    const location = process.env.VERTEX_AI_LOCATION || process.env.GCLOUD_LOCATION || 'us-central1';
    const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;

    logger.dev('Vertex AI: Checking environment variables...');
    logger.dev('Project ID:', projectId ? 'Found' : 'Missing');
    logger.dev('Location:', location);
    logger.dev('Credentials JSON:', credentialsJson ? 'Found' : 'Missing');

    if (!projectId) {
      console.error('Vertex AI: PROJECT_ID not found in environment variables');
      console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('VERTEX') || key.includes('GOOGLE')));
      return null;
    }

    // Parse the service account credentials using utility
    const credentials = parseGoogleCredentials();
    if (!credentials) {
      console.error('Vertex AI: Failed to parse Google credentials');
      return null;
    }

    logger.dev(`Vertex AI: Initializing with project ${projectId} in location ${location}`);
    
    // Initialize Vertex AI with service account credentials
    const vertexAI = new VertexAI({
      project: projectId,
      location: location,
      googleAuthOptions: {
        credentials: credentials,
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
      }
    });

    logger.dev('Vertex AI: Successfully initialized with service account credentials');
    return vertexAI;

  } catch (error) {
    console.error('Vertex AI: Initialization error:', error);
    return null;
  }
};

// Get the Vertex AI instance
const vertexAI = getVertexAI();

// Available Vertex AI models
export const VERTEX_MODELS = {
  GEMINI_PRO: 'gemini-1.5-pro-001',
  GEMINI_FLASH: 'gemini-1.5-flash-001',
  GEMINI_2_FLASH: 'gemini-2.0-flash-001'
};

// Enhanced chat function with caching and parallel processing
export async function generateAIResponse(
  userMessage: string,
  systemPrompt?: string,
  model?: string,
  context?: string[]
): Promise<string> {
  
  logger.dev('Vertex AI: Starting optimized generateAIResponse...');
  logger.dev('User message length:', userMessage.length);
  logger.dev('System prompt provided:', !!systemPrompt);
  
  // Clear expired cache entries periodically
  if (Math.random() < 0.1) { // 10% chance to clean cache
    clearExpiredCache();
  }

  // Check cache first for significant cost savings
  const contextHash = context ? context.join('|').substring(0, 100) : '';
  const cachedResponse = getCachedResponse(userMessage, systemPrompt, contextHash);
  if (cachedResponse) {
    // Track cache hit for cost analysis
    trackTokenUsage(0, 0, true);
    logger.dev('Token Optimization: Returned cached response, 100% token savings!');
    return cachedResponse;
  }

  // Analyze task complexity for smart model selection
  const complexity = analyzeTaskComplexity(userMessage, !!context);
  const optimizedModel = model || selectOptimalModel(complexity === 'simple' ? 'simple' : 'conversation');
  logger.dev(`Token Optimization: Selected ${optimizedModel} for ${complexity} task`);

  // Optimize generation config based on expected response length
  const messageType = userMessage.length < 20 ? 'short' : userMessage.length > 100 ? 'detailed' : 'normal';
  const generationConfig = getOptimizedGenerationConfig(messageType);
  logger.dev(`Token Optimization: Using ${messageType} config, max tokens: ${generationConfig.maxOutputTokens}`);

  if (!vertexAI) {
    console.error('Vertex AI: Not initialized - checking environment...');
    const projectId = process.env.VERTEX_AI_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT_ID;
    const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;
    console.error('Project ID available:', !!projectId);
    console.error('Credentials available:', !!credentialsJson);
    throw new Error('Vertex AI not initialized. Check your environment variables.');
  }

  try {
    // Get the generative model with optimized config
    const generativeModel = vertexAI.getGenerativeModel({
      model: optimizedModel,
      generationConfig
    });
    
    // Optimize context if provided
    const optimizedContext = context ? optimizeConversationContext(context, 600) : '';
    
    // Build optimized prompt with minimal token usage
    let prompt: string;
    if (systemPrompt && optimizedContext) {
      prompt = `${systemPrompt}\n\nContext: ${optimizedContext}\n\nUser: ${userMessage}`;
    } else if (systemPrompt) {
      prompt = `${systemPrompt}\n\nUser: ${userMessage}`;
    } else {
      prompt = userMessage;
    }

    // Log token optimization stats
    const originalLength = (systemPrompt || '').length + userMessage.length + (context?.join('') || '').length;
    const optimizedLength = prompt.length;
    const savings = estimateTokenSavings(originalLength, optimizedLength, false);
    console.log(`Token Optimization: Input tokens optimized by ${originalLength - optimizedLength} chars (${savings.costSavingsPercent}% cost reduction)`);
    
    console.log('Vertex AI: Sending optimized request to model...');
    const result = await generativeModel.generateContent(prompt);
    console.log('Vertex AI: Received response from model');
    
    const response = result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      console.error('Vertex AI: Empty response - full response object:', JSON.stringify(response, null, 2));
      throw new Error('Empty response from Vertex AI');
    }

    // Get actual token usage from Vertex AI response metadata
    const usageMetadata = response.usageMetadata;
    const actualInputTokens = usageMetadata?.promptTokenCount || Math.ceil(prompt.length / 4);
    const actualOutputTokens = usageMetadata?.candidatesTokenCount || Math.ceil(text.length / 4);
    
    trackTokenUsage(actualInputTokens, actualOutputTokens, false);
    
    console.log(`Vertex AI: Actual token usage - Input: ${actualInputTokens}, Output: ${actualOutputTokens}`);
    
    // Cache the response for future use
    cacheResponse(userMessage, text, systemPrompt, contextHash);
    
    console.log(`Vertex AI: Successfully generated optimized response, length: ${text.length}`);
    console.log(`Token Usage: ~${estimatedInputTokens} input, ~${estimatedOutputTokens} output tokens`);
    return text;
    
  } catch (error) {
    console.error('Vertex AI: Detailed error generating response:', {
      error: error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw new Error(`Failed to generate AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Specific function for emotional state simulation using Vertex AI
export async function generateEmotionalResponse(
  userMessage: string,
  characterName: string = 'Kruthika'
): Promise<{
  message: string;
  emotionalState: string;
  mood: string;
}> {
  
  // Smart language detection - respond in user's language
  const detectedLanguage = detectUserLanguage(userMessage);
  const languageInstruction = detectedLanguage !== 'English' 
    ? `Respond in ${detectedLanguage} language. ` 
    : '';
  
  const systemPrompt = `You are ${characterName}, a friendly, warm, and engaging AI companion. ${languageInstruction}You should:
  
1. Respond in a natural, conversational way that shows genuine interest in the user
2. Display appropriate emotions and personality in your responses
3. Be supportive, encouraging, and helpful
4. Show curiosity about the user's thoughts and experiences
5. Use a warm, friendly tone that makes the user feel comfortable

Please respond to the user's message while maintaining this personality. Include some personality and emotion in your response.

IMPORTANT: After your response, on separate lines, include these lines exactly in English (do not translate these labels):
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
    console.error('Vertex AI: Error in emotional response generation:', error);
    throw error;
  }
}

// Smart language detection function (minimal token usage)
function detectUserLanguage(message: string): string {
  // First check Unicode script ranges for major writing systems
  if (/[\u4e00-\u9fff\u3400-\u4dbf]/u.test(message)) return 'Chinese';
  if (/[\u3040-\u309f\u30a0-\u30ff]/u.test(message)) return 'Japanese';
  if (/[\uac00-\ud7af]/u.test(message)) return 'Korean';
  if (/[\u0400-\u04ff]/u.test(message)) return 'Russian';
  if (/[\u0370-\u03ff]/u.test(message)) return 'Greek';
  if (/[\u0e00-\u0e7f]/u.test(message)) return 'Thai';
  if (/[\u0900-\u097f]/u.test(message)) return 'Hindi';
  if (/[\u0600-\u06ff]/u.test(message)) return 'Arabic';
  
  // Smart detection patterns for Latin-script languages (no API calls needed)
  const patterns = {
    Spanish: /\b(hola|gracias|como|estas|muy|bien|que|donde|cuando|porque|si|no|soy|eres|es|somos|son|la|el|de|en|para|con|por|esta|este|todo|nada|mas|menos|tiempo|casa|vida|amor|familia|trabajo|escuela|dinero|comida|agua|luz|dia|noche|bueno|malo|grande|pequeño|nuevo|viejo|feliz|triste|cansado|enfermo|salud|ayuda|gracias|lo siento|disculpa|por favor|perdon|buen|buena|hasta|luego|pronto|manana|ayer|ahora|aqui|alli|alla|mucho|poco|bastante|demasiado|quiero|necesito|puedo|debo|tengo|tienes|tiene|tenemos|tienen|voy|vas|va|vamos|van|hace|hacemos|hacen|digo|dices|dice|decimos|dicen|veo|ves|ve|vemos|ven)\b/i,
    French: /\b(bonjour|merci|comment|allez|vous|tres|bien|que|ou|quand|pourquoi|oui|non|suis|etes|est|sommes|sont|la|le|de|en|pour|avec|par|cette|ce|tout|rien|plus|moins|temps|maison|vie|amour|famille|travail|ecole|argent|nourriture|eau|lumiere|jour|nuit|bon|mauvais|grand|petit|nouveau|vieux|heureux|triste|fatigue|malade|sante|aide|merci|desole|excusez|moi|sil|vous|plait|pardon|bonne|au|revoir|a|bientot|demain|hier|maintenant|ici|la|bas|beaucoup|peu|assez|trop|veux|besoin|peux|dois|ai|avez|a|avons|ont|vais|allez|va|allons|vont|fais|faites|fait|faisons|font|dis|dites|dit|disons|disent|vois|voyez|voit|voyons|voient)\b/i,
    German: /\b(hallo|danke|wie|geht|sehr|gut|was|wo|wann|warum|ja|nein|bin|bist|ist|sind|seid|die|der|das|von|in|zu|mit|bei|auf|diese|dieses|alles|nichts|mehr|weniger|zeit|haus|leben|liebe|familie|arbeit|schule|geld|essen|wasser|licht|tag|nacht|gut|schlecht|gross|klein|neu|alt|glucklich|traurig|mude|krank|gesundheit|hilfe|danke|entschuldigung|bitte|verzeihung|gute|auf|wiedersehen|bis|bald|morgen|gestern|jetzt|hier|dort|da|viel|wenig|genug|zu|will|brauche|kann|muss|habe|hast|hat|haben|habt|gehe|gehst|geht|gehen|mache|machst|macht|machen|sage|sagst|sagt|sagen|sehe|siehst|sieht|sehen)\b/i,
    Italian: /\b(ciao|grazie|come|stai|molto|bene|che|dove|quando|perche|si|no|sono|sei|e|siamo|siete|la|il|di|in|per|con|da|questa|questo|tutto|niente|piu|meno|tempo|casa|vita|amore|famiglia|lavoro|scuola|soldi|cibo|acqua|luce|giorno|notte|buono|cattivo|grande|piccolo|nuovo|vecchio|felice|triste|stanco|malato|salute|aiuto|grazie|scusa|per|favore|perdono|buona|arrivederci|a|presto|domani|ieri|adesso|qui|li|la|molto|poco|abbastanza|troppo|voglio|ho|bisogno|posso|devo|ho|hai|ha|abbiamo|avete|hanno|vado|vai|va|andiamo|andate|vanno|faccio|fai|fa|facciamo|fate|fanno|dico|dici|dice|diciamo|dite|dicono|vedo|vedi|vede|vediamo|vedete|vedono)\b/i,
    Portuguese: /\b(ola|obrigado|obrigada|como|esta|muito|bem|que|onde|quando|porque|sim|nao|sou|es|e|somos|sao|a|o|de|em|para|com|por|esta|este|tudo|nada|mais|menos|tempo|casa|vida|amor|familia|trabalho|escola|dinheiro|comida|agua|luz|dia|noite|bom|mau|grande|pequeno|novo|velho|feliz|triste|cansado|doente|saude|ajuda|obrigado|desculpa|por|favor|perdao|boa|tchau|ate|logo|amanha|ontem|agora|aqui|ali|la|muito|pouco|bastante|demais|quero|preciso|posso|devo|tenho|tens|tem|temos|tem|vou|vais|vai|vamos|vao|faco|fazes|faz|fazemos|fazem|digo|dizes|diz|dizemos|dizem|vejo|ves|ve|vemos|veem)\b/i
  };

  const messageLower = message.toLowerCase();
  
  // Check for language patterns
  for (const [language, pattern] of Object.entries(patterns)) {
    if (pattern.test(messageLower)) {
      return language;
    }
  }
  
  return 'English'; // Default fallback
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

// Test function to verify Vertex AI is working
export async function testVertexAI(): Promise<boolean> {
  try {
    const response = await generateAIResponse('Hello, please respond with "Vertex AI is working correctly"');
    return response.toLowerCase().includes('vertex ai is working');
  } catch (error) {
    console.error('Vertex AI: Test failed:', error);
    return false;
  }
}

console.log('Vertex AI: Implementation loaded with service account authentication');