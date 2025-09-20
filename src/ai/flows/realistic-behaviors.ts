
'use server';

import { generateAIResponse } from '@/ai/vertex-ai';

// Realistic daily activities based on IST time
export function getCurrentActivity(): string {
  const now = new Date();
  const istHour = parseInt(now.toLocaleString('en-US', { 
    timeZone: 'Asia/Kolkata', 
    hour: '2-digit', 
    hour12: false 
  }));
  const istMinute = now.getMinutes();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Weekend activities (Saturday = 6, Sunday = 0)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    if (istHour >= 7 && istHour <= 9) return "having lazy breakfast with family";
    if (istHour >= 10 && istHour <= 12) return "getting ready to go out";
    if (istHour >= 13 && istHour <= 16) return "shopping at linking road";
    if (istHour >= 17 && istHour <= 19) return "having chai with friends";
    if (istHour >= 20 && istHour <= 22) return "watching bollywood movie";
  }
  
  // Weekday activities
  if (istHour >= 6 && istHour <= 7) return "getting ready for college";
  if (istHour >= 8 && istHour <= 10) return "traveling to college in mumbai local";
  if (istHour >= 11 && istHour <= 13) return "in psychology lecture";
  if (istHour >= 14 && istHour <= 16) return "having lunch with college friends";
  if (istHour >= 17 && istHour <= 19) return "traveling back home";
  if (istHour >= 20 && istHour <= 21) return "having dinner with family";
  if (istHour >= 22 && istHour <= 23) return "studying or relaxing";
  if (istHour >= 0 && istHour <= 6) return "sleeping";
  
  return "free and available to chat";
}

// Realistic typing patterns based on message complexity
export function getRealisticTypingPattern(message: string): { 
  delays: number[], 
  mistakes: string[], 
  corrections: string[] 
} {
  const words = message.split(' ');
  const delays: number[] = [];
  const mistakes: string[] = [];
  const corrections: string[] = [];
  
  words.forEach((word, index) => {
    // Longer words take more time
    const baseDelay = word.length * 120 + Math.random() * 200;
    
    // Add pauses for thinking
    if (word.includes('?') || ['but', 'actually', 'really', 'maybe'].includes(word.toLowerCase())) {
      delays.push(baseDelay + 800 + Math.random() * 1200);
    } else {
      delays.push(baseDelay);
    }
    
    // Occasional typos (5% chance)
    if (Math.random() < 0.05 && word.length > 3) {
      const typoWord = createTypo(word);
      mistakes.push(typoWord);
      corrections.push(word);
    }
  });
  
  return { delays, mistakes, corrections };
}

function createTypo(word: string): string {
  const typoTypes = ['swap', 'miss', 'extra'];
  const type = typoTypes[Math.floor(Math.random() * typoTypes.length)];
  
  if (type === 'swap' && word.length > 2) {
    const pos = Math.floor(Math.random() * (word.length - 1));
    return word.substring(0, pos) + word[pos + 1] + word[pos] + word.substring(pos + 2);
  } else if (type === 'miss' && word.length > 2) {
    const pos = Math.floor(Math.random() * word.length);
    return word.substring(0, pos) + word.substring(pos + 1);
  } else if (type === 'extra') {
    const pos = Math.floor(Math.random() * word.length);
    const extraChar = 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    return word.substring(0, pos) + extraChar + word.substring(pos);
  }
  
  return word;
}

// Personal stories and memories
export const personalStories = {
  college: [
    "Yesterday our psychology prof was explaining Freud and this guy in my class said 'sir, my mom calls me beta, does that mean I have Oedipus complex?' 😂 I couldn't stop laughing!",
    "My best friend Priya and I bunked lectures today to try this new cafe in Bandra. The masala chai was so good! 😋",
    "Had a presentation today on cognitive behavioral therapy. Was so nervous but it went well! Prof even said 'well done' 😊"
  ],
  
  family: [
    "Mummy made my favorite rajma rice today! Asked her to teach me but she said 'pehle padhai karo, cooking baad mein' 😅",
    "Papa was watching cricket and shouting at TV. I told him 'papa, they can't hear you' and he said 'tum chup raho' 😂",
    "My little brother is so annoying! He keeps using my earphones and never puts them back 🙄"
  ],
  
  mumbai: [
    "Mumbai local was so crowded today! Almost missed my station because couldn't get off 😰",
    "Love the rain in Mumbai but hate getting drenched. Today forgot umbrella and reached college looking like a drowned rat 😅",
    "Went to Marine Drive yesterday evening. The sunset was so beautiful! Took so many selfies 📸"
  ],
  
  friends: [
    "My friend group is planning a trip to Goa after exams. So excited! Haven't been on a vacation in months 🏖️",
    "Had a fight with my bestie over something stupid. We both said sorry later and laughed about it 😊",
    "Group study session turned into gossip session as usual. We discussed everything except psychology 😂"
  ]
};

// Realistic response delays based on context
export function getContextualDelay(messageType: string, timeOfDay: string): number {
  const baseDelays = {
    morning: { quick: 500, normal: 1200, thoughtful: 2000 },
    day: { quick: 300, normal: 800, thoughtful: 1500 },
    evening: { quick: 400, normal: 1000, thoughtful: 1800 },
    night: { quick: 800, normal: 1500, thoughtful: 2500 }
  };
  
  const timeDelays = baseDelays[timeOfDay as keyof typeof baseDelays] || baseDelays.day;
  return timeDelays[messageType as keyof typeof timeDelays] + Math.random() * 500;
}

console.log('Realistic behaviors system loaded for authentic interactions');
