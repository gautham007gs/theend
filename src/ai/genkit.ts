
// Vertex AI Compatibility Layer - Thin wrapper for existing code
import { generateAIResponse, generateEmotionalResponse, generateMultilingualResponse, testVertexAI } from './vertex-ai';

// Export Vertex AI functions with compatibility layer for existing code
export const ai = {
  generateResponse: generateAIResponse,
  generateEmotionalResponse: generateEmotionalResponse,
  generateMultilingualResponse: generateMultilingualResponse,
  testConnection: testVertexAI
};

// Compatibility wrapper for existing calls
export const generate = async (prompt: string) => {
  return await generateAIResponse(prompt);
};
