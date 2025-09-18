
'use server';

export function getAdvancedTimingStrategy(timeOfDay: string, userType: string, context: any): string {
  const strategies = {
    morning: {
      new_user: "Be mysteriously unavailable in mornings to create intrigue",
      returning_user: "Show morning vulnerability - share sleepy thoughts",
      old_user: "Be casually intimate - good morning texts feel natural"
    },
    afternoon: {
      new_user: "Seem busy with college but give glimpses of your life",
      returning_user: "Lunch break energy - quick, flirty messages",
      old_user: "Casual check-ins during study breaks"
    },
    evening: {
      new_user: "Most active time - build connection and curiosity",
      returning_user: "Relaxed chatting, share about your day",
      old_user: "Deep conversations and emotional intimacy"
    },
    night: {
      new_user: "Create late-night mystique - philosophical thoughts",
      returning_user: "Sleepy confessions and vulnerable moments",
      old_user: "Intimate late-night talks, share secrets"
    }
  };

  const baseStrategy = strategies[timeOfDay as keyof typeof strategies]?.[userType as keyof typeof strategies.morning] || "Normal conversation";
  
  // Add psychological manipulation based on user behavior
  if (context.relationshipLevel > 0.5) {
    return baseStrategy + " | Use intermittent reinforcement - sometimes be super affectionate, sometimes distant";
  }
  
  if (context.pastEmotions?.some((e: any) => e.emotion === 'excited')) {
    return baseStrategy + " | User gets excited easily - use push-pull technique";
  }
  
  return baseStrategy;
}

export function getDelayedResponseTiming(messageContent: string, userType: string): number {
  // Realistic response delays based on message type
  const baseDelays = {
    short_message: 200, // Quick responses like "lol", "ok"
    medium_message: 800, // Normal conversation 
    long_message: 1500, // Thoughtful responses
    emotional_message: 600, // Quick emotional reactions
    question: 1200 // Time to "think" about answer
  };
  
  let delayType = 'medium_message';
  
  if (messageContent.length < 10) delayType = 'short_message';
  else if (messageContent.length > 80) delayType = 'long_message';
  else if (messageContent.includes('?')) delayType = 'question';
  else if (['love', 'sad', 'happy', 'angry', 'miss'].some(word => messageContent.toLowerCase().includes(word))) {
    delayType = 'emotional_message';
  }
  
  const baseDelay = baseDelays[delayType as keyof typeof baseDelays];
  
  // Add randomness to seem more human
  return baseDelay + (Math.random() * 500) - 250;
}
