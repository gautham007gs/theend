import { VertexAI } from '@google-cloud/vertexai';
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

    console.log('Vertex AI: Checking environment variables...');
    console.log('Project ID:', projectId ? 'Found' : 'Missing');
    console.log('Location:', location);
    console.log('Credentials JSON:', credentialsJson ? 'Found' : 'Missing');

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

    console.log(`Vertex AI: Initializing with project ${projectId} in location ${location}`);
    
    // Initialize Vertex AI with service account credentials
    const vertexAI = new VertexAI({
      project: projectId,
      location: location,
      googleAuthOptions: {
        credentials: credentials,
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
      }
    });

    console.log('Vertex AI: Successfully initialized with service account credentials');
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

// Main chat function using Vertex AI with token optimization
export async function generateAIResponse(
  userMessage: string,
  systemPrompt?: string,
  model?: string,
  context?: string[]
): Promise<string> {
  
  console.log('Vertex AI: Starting optimized generateAIResponse...');
  console.log('User message length:', userMessage.length);
  console.log('System prompt provided:', !!systemPrompt);
  
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
    console.log('Token Optimization: Returned cached response, 100% token savings!');
    return cachedResponse;
  }

  // Analyze task complexity for smart model selection
  const complexity = analyzeTaskComplexity(userMessage, !!context);
  const optimizedModel = model || selectOptimalModel(complexity === 'simple' ? 'simple' : 'conversation');
  console.log(`Token Optimization: Selected ${optimizedModel} for ${complexity} task`);

  // Optimize generation config based on expected response length
  const messageType = userMessage.length < 20 ? 'short' : userMessage.length > 100 ? 'detailed' : 'normal';
  const generationConfig = getOptimizedGenerationConfig(messageType);
  console.log(`Token Optimization: Using ${messageType} config, max tokens: ${generationConfig.maxOutputTokens}`);

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

    // Track token usage for cost monitoring
    const estimatedInputTokens = Math.ceil(prompt.length / 4);
    const estimatedOutputTokens = Math.ceil(text.length / 4);
    trackTokenUsage(estimatedInputTokens, estimatedOutputTokens, false);
    
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

// Advanced language style detection system - analyzes mixing patterns
function detectUserLanguageStyle(message: string): {
  language: string;
  mixingStyle: 'pure' | 'mixed' | 'heavy_mixed';
  confidence: number;
} {
  // First check Unicode script ranges for Indian and international writing systems
  
  // INDIAN LANGUAGES - Full Unicode support for ALL major Indian scripts
  if (/[\u0900-\u097f]/u.test(message)) {
    const purity = analyzePurityLevel(message, 'Hindi');
    return { language: 'Hindi', mixingStyle: purity.mixingStyle, confidence: purity.confidence };
  }
  if (/[\u0980-\u09ff]/u.test(message)) {
    const purity = analyzePurityLevel(message, 'Bengali');
    return { language: 'Bengali', mixingStyle: purity.mixingStyle, confidence: purity.confidence };
  }
  if (/[\u0a00-\u0a7f]/u.test(message)) {
    const purity = analyzePurityLevel(message, 'Gujarati');
    return { language: 'Gujarati', mixingStyle: purity.mixingStyle, confidence: purity.confidence };
  }
  if (/[\u0a80-\u0aff]/u.test(message)) {
    const purity = analyzePurityLevel(message, 'Punjabi');
    return { language: 'Punjabi', mixingStyle: purity.mixingStyle, confidence: purity.confidence };
  }
  if (/[\u0b00-\u0b7f]/u.test(message)) {
    const purity = analyzePurityLevel(message, 'Odia');
    return { language: 'Odia', mixingStyle: purity.mixingStyle, confidence: purity.confidence };
  }
  if (/[\u0b80-\u0bff]/u.test(message)) {
    const purity = analyzePurityLevel(message, 'Tamil');
    return { language: 'Tamil', mixingStyle: purity.mixingStyle, confidence: purity.confidence };
  }
  if (/[\u0c00-\u0c7f]/u.test(message)) {
    const purity = analyzePurityLevel(message, 'Telugu');
    return { language: 'Telugu', mixingStyle: purity.mixingStyle, confidence: purity.confidence };
  }
  if (/[\u0c80-\u0cff]/u.test(message)) {
    const purity = analyzePurityLevel(message, 'Kannada');
    return { language: 'Kannada', mixingStyle: purity.mixingStyle, confidence: purity.confidence };
  }
  if (/[\u0d00-\u0d7f]/u.test(message)) {
    const purity = analyzePurityLevel(message, 'Malayalam');
    return { language: 'Malayalam', mixingStyle: purity.mixingStyle, confidence: purity.confidence };
  }
  if (/[\u0d80-\u0dff]/u.test(message)) {
    const purity = analyzePurityLevel(message, 'Sinhala');
    return { language: 'Sinhala', mixingStyle: purity.mixingStyle, confidence: purity.confidence };
  }
  if (/[\u1000-\u109f]/u.test(message)) {
    const purity = analyzePurityLevel(message, 'Myanmar');
    return { language: 'Myanmar', mixingStyle: purity.mixingStyle, confidence: purity.confidence };
  }
  
  // International languages
  if (/[\u4e00-\u9fff\u3400-\u4dbf]/u.test(message)) {
    return { language: 'Chinese', mixingStyle: 'pure', confidence: 0.9 };
  }
  if (/[\u3040-\u309f\u30a0-\u30ff]/u.test(message)) {
    return { language: 'Japanese', mixingStyle: 'pure', confidence: 0.9 };
  }
  if (/[\uac00-\ud7af]/u.test(message)) {
    return { language: 'Korean', mixingStyle: 'pure', confidence: 0.9 };
  }
  if (/[\u0400-\u04ff]/u.test(message)) {
    return { language: 'Russian', mixingStyle: 'pure', confidence: 0.9 };
  }
  if (/[\u0370-\u03ff]/u.test(message)) {
    return { language: 'Greek', mixingStyle: 'pure', confidence: 0.9 };
  }
  if (/[\u0e00-\u0e7f]/u.test(message)) {
    return { language: 'Thai', mixingStyle: 'pure', confidence: 0.9 };
  }
  if (/[\u0600-\u06ff]/u.test(message)) {
    return { language: 'Arabic', mixingStyle: 'pure', confidence: 0.9 };
  }
  
  // Continue with pattern analysis for romanized text
  return analyzeRomanizedLanguage(message);
}

// Analyze language purity and mixing patterns
function analyzePurityLevel(message: string, detectedLanguage: string): {
  mixingStyle: 'pure' | 'mixed' | 'heavy_mixed';
  confidence: number;
} {
  const englishWords = message.match(/\b[a-zA-Z]+\b/g) || [];
  const totalWords = message.split(/\s+/).length;
  const englishRatio = englishWords.length / totalWords;
  
  if (englishRatio < 0.2) {
    return { mixingStyle: 'pure', confidence: 0.9 };
  } else if (englishRatio < 0.6) {
    return { mixingStyle: 'mixed', confidence: 0.8 };
  } else {
    return { mixingStyle: 'heavy_mixed', confidence: 0.7 };
  }
}

// Analyze romanized Indian languages
function analyzeRomanizedLanguage(message: string): {
  language: string;
  mixingStyle: 'pure' | 'mixed' | 'heavy_mixed';
  confidence: number;
} {
  // Advanced pattern detection for Indian languages using Latin script (Hinglish, etc.)
  const indianLanguagePatterns = {
    Hindi: /\b(namaste|namaskar|kaise|ho|aap|tum|main|hoon|hai|tha|tha|kya|kahan|kab|kyun|kaise|accha|theek|sach|jhooth|paani|khana|ghar|pyaar|dost|family|mummy|papa|bhai|behen|school|college|padhai|kaam|time|jagah|logo|samay|din|raat|subah|sham|kal|aaj|parso|haan|nahi|bilkul|shayad|pata|malum|samjha|dekha|suna|bola|kaha|gaya|aaya|jaana|aana|lena|dena|karna|hona|jana|chahiye|zaroor|bas|sirf|kitna|kuch|sabko|sabse)\b/i,
    
    Bengali: /\b(namaskar|ki|kemon|acho|tumi|ami|ache|chilo|kothay|kokhon|keno|kemne|bhalo|thik|sotti|mithya|jol|khawa|bari|bhalobasha|bondhu|family|ma|baba|bhai|bon|school|college|pora|kaj|time|jaiga|manush|din|raat|sokal|bikel|kal|aj|porshoo|hyan|na|ekdom|hoyto|jani|bujhi|dekhechi|shunechi|bolechi|giyechi|eshechi|jete|aste|nite|dite|korte|hote|jawa|lagbe|dorkar|oto|sudhu|koto|kichu|sobai|sobcheye)\b/i,
    
    Tamil: /\b(vanakkam|eppadi|irukinga|neenga|naan|irukku|irundhuchu|enga|eppo|yen|eppadi|nalla|sari|unmai|poi|thanni|saapadu|veedu|kadhal|nanban|kudumbam|amma|appa|anna|akka|school|college|padikka|velai|time|idam|makkal|naal|raatri|kaalai|maalai|naalai|innikku|naalaikku|aamam|illa|romba|konjam|theriyum|purinjidhu|paarthen|kaeten|sonnaru|ponaru|vandaru|poga|vara|edukka|kudukka|panna|aaga|poga|vendum|avasiyam|adhaan|mattum|evlo|edhaavadhu|ellaarum|ellaaththu)\b/i,
    
    Telugu: /\b(namaste|ela|unnaru|meeru|nenu|undi|undindi|ekkada|eppudu|enduku|ela|manchi|correct|nijam|abaddham|neellu|thindam|intlo|prema|snehitudu|family|amma|nanna|anna|akka|school|college|chaduvukovadam|pani|time|chotu|manushulu|roju|raatri|udayam|saayantram|repu|eeoju|ninna|avunu|ledu|chaala|koncham|teliyali|arthamaindi|chusanu|vinanu|cheppanu|vellanu|vachanu|vellaali|ravaali|teesukonu|ichaali|chestha|avuthundi|vellaali|kaavali|avasaram|anthe|mathrame|entha|emi|andarini|andharkanna)\b/i,
    
    Kannada: /\b(namaskara|hege|iddira|neevu|naanu|ide|ittu|elli|yaavaga|yaake|hege|chennaagi|sari|nijavaada|sullu|neeru|oota|mane|preeti|snehita|family|amma|appa|anna|akka|school|college|odu|kelasa|time|stala|janaru|dina|raatri|belalge|saayam|naale|ivattu|ninna|haudu|illa|thumba|swalpa|gottide|artha|nodidde|kelide|helide|hodaru|bandaru|hogabeku|rabeku|tagoli|kodi|maadabeku|aagabeku|hogabeku|bekku|avasya|anthe|maatra|eshtu|yaavaduva|ellarigu|ellakkinta)\b/i,
    
    Malayalam: /\b(namaskaram|engane|unde|ningal|njan|undu|undayirunnu|evide|eppol|enthukond|engane|nallathu|sheri|satyam|poyi|vellam|bhojanam|veedu|sneham|snehitan|family|amma|achan|chettan|chechi|school|college|padikkuka|pani|time|sthalam|aalukal|divasam|raatri|raavile|vaikeet|naale|innu|innale|aanu|alla|valare|konjam|ariyam|manasilaayi|kandu|kettu|paranju|poyi|vannu|pokanum|varanam|edukkanam|kodukkanam|cheyyanum|aaganum|pokanam|venam|aavashyam|athaanu|mathram|ethra|enthaakilum|ellaavareyum|ellaathekkaal)\b/i,
    
    Gujarati: /\b(namaste|kem|cho|tame|hu|che|hatu|kya|kyare|shu|mate|kevi|rite|sachu|jhuthu|paani|jaman|ghar|prem|mitra|family|mummy|papa|bhai|ben|school|college|vanchvu|kaam|time|jagya|manas|din|raat|savaar|saanj|kale|aaj|gaykale|haa|na|khub|thodu|khabar|samjay|joyu|saambhlu|kahyu|gayo|avyo|jaavu|aavvu|levu|aapu|karvu|thavu|jaavu|joye|jarur|bas|ketlu|kai|badha|sabthee)\b/i,
    
    Punjabi: /\b(sat sri akal|ki haal|hai|tusi|main|hai|si|kithe|kado|kyun|kive|changa|theek|sach|jhooth|paani|khana|ghar|pyaar|yaar|family|mummy|papa|veer|bhen|school|college|padhna|kaam|time|jagah|lok|din|raat|savere|sham|kal|ajj|parso|haan|nahin|bahut|thoda|pata|samjha|dekhya|suneya|keha|gaya|aaya|jana|auna|lena|dena|karna|hona|jana|chahida|zaroor|bas|kinna|kujh|sabnu|sabton)\b/i,
    
    Marathi: /\b(namaskar|kasa|aahes|tumhi|mi|aahe|hota|kuthe|kevha|ka|kasa|chaan|barobar|kharach|khota|paani|jevan|ghar|prem|mitra|family|aai|baba|bhau|bahin|school|college|shikne|kaam|vel|jagah|lok|din|raat|sakal|sandhyakaal|udya|aaj|kal|ho|nahi|khup|thoda|mahit|samajle|pahile|aikle|sangitle|gelo|aalo|jaayche|yaayche|ghene|dene|karne|hone|jaane|pahije|avashya|tevhech|fakt|kiti|kahi|sarvanna|sarvaat)\b/i,
    
    Odia: /\b(namaskar|kemiti|achanti|apana|mun|achi|thila|kouthi|kebe|kaha|kemiti|bhala|thik|satya|misa|paani|khana|ghara|prema|bandhu|family|maa|bapa|bhai|bhauni|school|college|padhiba|kama|samaya|jagaha|loka|dina|raati|sakala|sandhya|kali|ajikali|gata|han|na|bahuta|thoda|jani|bujhi|dekhi|suni|kahi|gali|aasi|jiba|asiba|nei|debe|kariba|heba|jiba|darkar|avashya|sethi|keba|kete|kichhi|sabu|sabukari)\b/i,
    
    Nepali: /\b(namaste|kasto|cha|tapai|ma|cha|thiyo|kaha|kile|kina|kasari|ramro|thik|satyam|jhuto|paani|khana|ghar|maya|sathi|family|ama|ba|dai|didi|school|college|padhne|kaam|samaya|thau|manche|din|raat|bihaana|beluka|bholi|aja|hija|ho|hoina|dherai|ali|thaaha|bujhe|dekhe|sune|bhane|gayo|aayo|jane|aune|line|dine|garne|hune|jane|chahincha|jarur|bas|kati|kehi|sabailai|sabai)\b/i
  };
  
  // Extended European and International language patterns  
  const internationalPatterns = {
    Spanish: /\b(hola|gracias|como|estas|muy|bien|que|donde|cuando|porque|si|no|soy|eres|es|somos|son|la|el|de|en|para|con|por|esta|este|todo|nada|mas|menos|tiempo|casa|vida|amor|familia|trabajo|escuela|dinero|comida|agua|luz|dia|noche|bueno|malo|grande|pequeño|nuevo|viejo|feliz|triste|cansado|enfermo|salud|ayuda|gracias|lo siento|disculpa|por favor|perdon|buen|buena|hasta|luego|pronto|manana|ayer|ahora|aqui|alli|alla|mucho|poco|bastante|demasiado|quiero|necesito|puedo|debo|tengo|tienes|tiene|tenemos|tienen|voy|vas|va|vamos|van|hace|hacemos|hacen|digo|dices|dice|decimos|dicen|veo|ves|ve|vemos|ven)\b/i,
    French: /\b(bonjour|merci|comment|allez|vous|tres|bien|que|ou|quand|pourquoi|oui|non|suis|etes|est|sommes|sont|la|le|de|en|pour|avec|par|cette|ce|tout|rien|plus|moins|temps|maison|vie|amour|famille|travail|ecole|argent|nourriture|eau|lumiere|jour|nuit|bon|mauvais|grand|petit|nouveau|vieux|heureux|triste|fatigue|malade|sante|aide|merci|desole|excusez|moi|sil|vous|plait|pardon|bonne|au|revoir|a|bientot|demain|hier|maintenant|ici|la|bas|beaucoup|peu|assez|trop|veux|besoin|peux|dois|ai|avez|a|avons|ont|vais|allez|va|allons|vont|fais|faites|fait|faisons|font|dis|dites|dit|disons|disent|vois|voyez|voit|voyons|voient)\b/i,
    German: /\b(hallo|danke|wie|geht|sehr|gut|was|wo|wann|warum|ja|nein|bin|bist|ist|sind|seid|die|der|das|von|in|zu|mit|bei|auf|diese|dieses|alles|nichts|mehr|weniger|zeit|haus|leben|liebe|familie|arbeit|schule|geld|essen|wasser|licht|tag|nacht|gut|schlecht|gross|klein|neu|alt|glucklich|traurig|mude|krank|gesundheit|hilfe|danke|entschuldigung|bitte|verzeihung|gute|auf|wiedersehen|bis|bald|morgen|gestern|jetzt|hier|dort|da|viel|wenig|genug|zu|will|brauche|kann|muss|habe|hast|hat|haben|habt|gehe|gehst|geht|gehen|mache|machst|macht|machen|sage|sagst|sagt|sagen|sehe|siehst|sieht|sehen)\b/i,
    Italian: /\b(ciao|grazie|come|stai|molto|bene|che|dove|quando|perche|si|no|sono|sei|e|siamo|siete|la|il|di|in|per|con|da|questa|questo|tutto|niente|piu|meno|tempo|casa|vita|amore|famiglia|lavoro|scuola|soldi|cibo|acqua|luce|giorno|notte|buono|cattivo|grande|piccolo|nuovo|vecchio|felice|triste|stanco|malato|salute|aiuto|grazie|scusa|per|favore|perdono|buona|arrivederci|a|presto|domani|ieri|adesso|qui|li|la|molto|poco|abbastanza|troppo|voglio|ho|bisogno|posso|devo|ho|hai|ha|abbiamo|avete|hanno|vado|vai|va|andiamo|andate|vanno|faccio|fai|fa|facciamo|fate|fanno|dico|dici|dice|diciamo|dite|dicono|vedo|vedi|vede|vediamo|vedete|vedono)\b/i,
    Portuguese: /\b(ola|obrigado|obrigada|como|esta|muito|bem|que|onde|quando|porque|sim|nao|sou|es|e|somos|sao|a|o|de|em|para|com|por|esta|este|tudo|nada|mais|menos|tempo|casa|vida|amor|familia|trabalho|escola|dinheiro|comida|agua|luz|dia|noite|bom|mau|grande|pequeno|novo|velho|feliz|triste|cansado|doente|saude|ajuda|obrigado|desculpa|por|favor|perdao|boa|tchau|ate|logo|amanha|ontem|agora|aqui|ali|la|muito|pouco|bastante|demais|quero|preciso|posso|devo|tenho|tens|tem|temos|tem|vou|vais|vai|vamos|vao|faco|fazes|faz|fazemos|fazem|digo|dizes|diz|dizemos|dizem|vejo|ves|ve|vemos|veem)\b/i
  };

  const messageLower = message.toLowerCase().replace(/[^\u0000-\u007F]/g, ' '); // Handle Unicode properly
  const messageOriginal = message.toLowerCase(); // Keep original for script detection
  
  // First priority: Check Indian language patterns
  for (const [language, pattern] of Object.entries(indianLanguagePatterns)) {
    if (pattern.test(messageLower) || pattern.test(messageOriginal)) {
      console.log(`Language detected: ${language} (pattern match)`);
      return language;
    }
  }
  
  // Second priority: Check international language patterns
  for (const [language, pattern] of Object.entries(internationalPatterns)) {
    if (pattern.test(messageLower)) {
      console.log(`Language detected: ${language} (pattern match)`);
      return language;
    }
  }
  
  const messageLower = message.toLowerCase().replace(/[^\u0000-\u007F]/g, ' ');
  const messageOriginal = message.toLowerCase();
  
  let bestMatch = { language: 'English', score: 0 };
  
  // Check Indian language patterns
  for (const [language, pattern] of Object.entries(indianLanguagePatterns)) {
    const matches = (messageLower.match(pattern) || []).length;
    if (matches > bestMatch.score) {
      bestMatch = { language, score: matches };
    }
  }
  
  // Check international language patterns
  for (const [language, pattern] of Object.entries(internationalPatterns)) {
    const matches = (messageLower.match(pattern) || []).length;
    if (matches > bestMatch.score) {
      bestMatch = { language, score: matches };
    }
  }
  
  // Hinglish detection (mix of Hindi and English)
  const hinglishIndicators = /\b(yaar|arre|bas|kya|hai|haan|nahi|acha|theek|matlab|samjha|bhai|didi|uncle|aunty|ji|sahab|madam)\b/i;
  if (hinglishIndicators.test(messageLower)) {
    const englishWords = message.match(/\b[a-zA-Z]+\b/g) || [];
    const totalWords = message.split(/\s+/).length;
    const englishRatio = englishWords.length / totalWords;
    
    if (englishRatio > 0.7) {
      return { language: 'Hinglish', mixingStyle: 'heavy_mixed', confidence: 0.8 };
    } else if (englishRatio > 0.3) {
      return { language: 'Hinglish', mixingStyle: 'mixed', confidence: 0.9 };
    } else {
      return { language: bestMatch.language || 'Hindi', mixingStyle: 'pure', confidence: 0.7 };
    }
  }
  
  if (bestMatch.score > 0) {
    const purity = analyzePurityLevel(message, bestMatch.language);
    console.log(`Language detected: ${bestMatch.language} (${purity.mixingStyle} style)`);
    return { language: bestMatch.language, mixingStyle: purity.mixingStyle, confidence: purity.confidence };
  }
  
  console.log('Language detected: English (default fallback)');
  return { language: 'English', mixingStyle: 'pure', confidence: 0.6 };
}

// Backward compatibility function
function detectUserLanguage(message: string): string {
  const result = detectUserLanguageStyle(message);
  return result.language;
}

// Enhanced multilingual response generation with style mirroring
export async function generateMultilingualResponse(
  userMessage: string,
  targetLanguage: string = 'English',
  characterName: string = 'Kruthika'
): Promise<string> {
  
  const languageStyle = detectUserLanguageStyle(userMessage);
  
  let styleInstruction = '';
  if (languageStyle.mixingStyle === 'mixed') {
    styleInstruction = 'Mix languages naturally like the user did. ';
  } else if (languageStyle.mixingStyle === 'heavy_mixed') {
    styleInstruction = 'Use heavy language mixing with lots of English words mixed in. ';
  } else {
    styleInstruction = 'Keep the language pure and avoid mixing. ';
  }
  
  const systemPrompt = `You are ${characterName}, responding in ${targetLanguage}. ${styleInstruction}
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