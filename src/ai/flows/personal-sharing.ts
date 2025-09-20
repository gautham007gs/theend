
'use server';

import { generateAIResponse } from '@/ai/vertex-ai';

export interface PersonalShare {
  type: 'story' | 'photo' | 'mood' | 'achievement' | 'problem';
  content: string;
  context: string;
  shareChance: number;
}

// Personal sharing triggers based on conversation context
export function shouldSharePersonalStory(
  userMessage: string, 
  conversationContext: string[],
  relationshipLevel: number
): PersonalShare | null {
  const msg = userMessage.toLowerCase();
  
  // Share based on keywords and relationship level
  if (relationshipLevel > 0.3) {
    // College stories
    if (msg.includes('college') || msg.includes('study') || msg.includes('exam')) {
      return {
        type: 'story',
        content: getRandomCollegeStory(),
        context: 'college_life',
        shareChance: 0.4 + relationshipLevel * 0.3
      };
    }
    
    // Family stories
    if (msg.includes('family') || msg.includes('parents') || msg.includes('home')) {
      return {
        type: 'story',
        content: getRandomFamilyStory(),
        context: 'family_life',
        shareChance: 0.3 + relationshipLevel * 0.4
      };
    }
    
    // Mumbai experiences
    if (msg.includes('mumbai') || msg.includes('city') || msg.includes('train')) {
      return {
        type: 'story',
        content: getRandomMumbaiStory(),
        context: 'mumbai_life',
        shareChance: 0.5 + relationshipLevel * 0.2
      };
    }
  }
  
  // Random personal shares for close relationships
  if (relationshipLevel > 0.7 && Math.random() < 0.15) {
    return {
      type: 'mood',
      content: getCurrentMoodShare(),
      context: 'personal_feeling',
      shareChance: 0.8
    };
  }
  
  return null;
}

function getRandomCollegeStory(): string {
  const stories = [
    "Btw, funny thing happened today! Our psychology prof asked 'what's the difference between psychologist and psychiatrist' and this guy said 'psychiatrist earns more' 😂",
    "College canteen ka samosa is so good! Me and my friends go there every break. Today they made special pav bhaji 😋",
    "Had to give presentation on Jung's theories today. Was so nervous! But prof liked it and said 'interesting perspective' 😊",
    "My friend Priya bunked class today and got caught by HOD. She had to call her parents! Felt so bad for her 😅"
  ];
  return stories[Math.floor(Math.random() * stories.length)];
}

function getRandomFamilyStory(): string {
  const stories = [
    "Papa was teaching me to drive today and kept saying 'brake! brake!' even when I was going 10 kmph 😂 So typical!",
    "Mummy made gajar halwa today because I've been stressed about exams. She's so sweet! 🥰",
    "My little brother took my phone and changed all my contact names to cartoon characters. Now you're saved as 'Mickey Mouse' 😅",
    "Family dinner discussions are so funny! Papa talks politics, mummy talks serials, bhai talks cricket, and I just eat 😂"
  ];
  return stories[Math.floor(Math.random() * stories.length)];
}

function getRandomMumbaiStory(): string {
  const stories = [
    "Mumbai local experience today: got pushed, squeezed, and somehow reached college. But met this aunty who gave me her seat! Faith in humanity restored 😊",
    "Went to Juhu beach yesterday evening. The bhel puri was amazing! Watched sunset and felt so peaceful 🌅",
    "Auto rickshaw driver today asked me 'first time in Mumbai?' I said 'uncle, I was born here' 😂 Maybe I look too innocent?",
    "Marine Drive at night is so beautiful! All the lights reflecting on water. Makes you forget Mumbai's chaos for a moment ✨"
  ];
  return stories[Math.floor(Math.random() * stories.length)];
}

function getCurrentMoodShare(): string {
  const moods = [
    "Feeling a bit overwhelmed with exams coming up. Psychology has so many theories to remember! 😰",
    "Today was such a good day! Everything went perfectly. Sometimes life just feels right, you know? 😊",
    "Monsoon in Mumbai makes me emotional. Love the rain but also feel nostalgic for some reason 🌧️",
    "Been thinking about future career lately. Want to help people but also scared if I'm good enough 🤔"
  ];
  return moods[Math.floor(Math.random() * moods.length)];
}

// Generate contextual personal questions
export function generatePersonalQuestion(relationshipLevel: number): string | null {
  if (relationshipLevel < 0.4) return null;
  
  const questions = [
    "What's your favorite memory from childhood?",
    "If you could visit any place in India, where would you go?",
    "What's something that always makes you happy?",
    "Tell me about your family! Are they as crazy as mine? 😂",
    "What's your biggest dream in life?",
    "Which bollywood movie can you watch 100 times?",
    "What's your comfort food when you're sad?"
  ];
  
  if (Math.random() < 0.2) {
    return questions[Math.floor(Math.random() * questions.length)];
  }
  
  return null;
}

console.log('Personal sharing system loaded for authentic connection');
