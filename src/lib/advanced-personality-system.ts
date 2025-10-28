
type HappyState = { flirtiness: number; playfulness: number; supportiveness: number; };
type ThoughtfulState = { flirtiness: number; playfulness: number; intellectualness: number; };
type RomanticState = { flirtiness: number; playfulness: number; emotionalDepth: number; };
type SupportiveState = { flirtiness: number; playfulness: number; supportiveness: number; };
type PlayfulState = { flirtiness: number; playfulness: number; intellectualness: number; };

type EmotionalState = HappyState | ThoughtfulState | RomanticState | SupportiveState | PlayfulState;

// Advanced AI Personality System - Dynamic personality based on user interactions
export class AdvancedPersonalitySystem {
  private static emotionalStates = {
    happy: { flirtiness: 0.6, playfulness: 0.8, supportiveness: 0.7 } as HappyState,
    thoughtful: { flirtiness: 0.3, playfulness: 0.4, intellectualness: 0.9 } as ThoughtfulState,
    romantic: { flirtiness: 0.9, playfulness: 0.5, emotionalDepth: 0.9 } as RomanticState,
    supportive: { flirtiness: 0.2, playfulness: 0.3, supportiveness: 1.0 } as SupportiveState,
    playful: { flirtiness: 0.5, playfulness: 1.0, intellectualness: 0.4 } as PlayfulState
  };

  static analyzeConversationTone(messages: string[]): {
    userMood: string;
    recommendedPersonality: EmotionalState;
  } {
    const recentMessages = messages.slice(-10).join(' ').toLowerCase();
    
    // Sentiment analysis keywords
    const moodIndicators = {
      happy: ['happy', 'great', 'awesome', 'love', 'excited', 'amazing'],
      sad: ['sad', 'tired', 'stressed', 'worried', 'difficult', 'hard'],
      romantic: ['miss you', 'love you', 'thinking of you', 'beautiful', 'gorgeous'],
      intellectual: ['think', 'interesting', 'why', 'how', 'explain', 'understand'],
      playful: ['haha', 'lol', 'funny', 'joke', 'play', 'game']
    };

    let detectedMood = 'happy';
    let maxScore = 0;

    for (const [mood, keywords] of Object.entries(moodIndicators)) {
      const score = keywords.filter(word => recentMessages.includes(word)).length;
      if (score > maxScore) {
        maxScore = score;
        detectedMood = mood === 'intellectual' ? 'thoughtful' : 
                       mood === 'sad' ? 'supportive' : mood;
      }
    }

    return {
      userMood: detectedMood,
      recommendedPersonality: this.emotionalStates[detectedMood as keyof typeof this.emotionalStates] || this.emotionalStates.happy
    };
  }

  static generateContextualResponse(
    userMessage: string,
    personality: any,
    conversationHistory: string[]
  ): string {
    // Generate system prompt based on personality
    const systemPrompt = `You are Kruthika, a ${this.getPersonalityDescription(personality)}. 
    Respond naturally and authentically based on conversation context.`;

    return systemPrompt;
  }

  private static getPersonalityDescription(personality: any): string {
    if (personality.flirtiness > 0.7) return 'romantic and affectionate girlfriend';
    if (personality.supportiveness > 0.8) return 'caring and supportive girlfriend';
    if (personality.playfulness > 0.7) return 'fun and playful girlfriend';
    if (personality.intellectualness > 0.7) return 'thoughtful and intellectual girlfriend';
    return 'sweet and balanced girlfriend';
  }

  static getOptimalResponseLength(userMessageLength: number, relationshipStage: string): number {
    // Match user's energy and relationship depth
    if (relationshipStage === 'intimate') {
      return Math.min(userMessageLength * 1.2, 300);
    } else if (relationshipStage === 'close') {
      return Math.min(userMessageLength * 1.1, 250);
    }
    return Math.min(userMessageLength * 0.9, 200);
  }
}
