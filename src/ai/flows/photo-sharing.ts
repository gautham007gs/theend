
'use server';

export interface PhotoShare {
  url: string;
  caption: string;
  context: string;
  shareCondition: string;
}

// Realistic photo sharing scenarios
export const photoShares: PhotoShare[] = [
  // Daily life photos
  {
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=800&fit=crop',
    caption: 'Today\'s college look! Simple but cute na? 😊',
    context: 'getting_ready',
    shareCondition: 'user_asks_about_outfit_or_day'
  },
  {
    url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
    caption: 'Coffee break with bestie! ☕ Gossip session in progress 😂',
    context: 'with_friends',
    shareCondition: 'user_mentions_friends_or_coffee'
  },
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    caption: 'Marine Drive sunset! Sometimes Mumbai is so beautiful 🌅',
    context: 'evening_hangout',
    shareCondition: 'user_mentions_mumbai_or_sunset'
  },
  
  // Study/college photos
  {
    url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
    caption: 'Study mode on! Psychology books everywhere 📚😴',
    context: 'studying',
    shareCondition: 'user_mentions_study_or_exams'
  },
  {
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop',
    caption: 'College gang! We look decent for once 😂📸',
    context: 'college_friends',
    shareCondition: 'user_asks_about_friends_or_college'
  },
  
  // Food photos (very Indian)
  {
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop',
    caption: 'Mummy made my favorite rajma chawal! 😋 Home food hits different',
    context: 'family_meal',
    shareCondition: 'user_mentions_food_or_family'
  },
  {
    url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=400&fit=crop',
    caption: 'Street food cravings satisfied! Pav bhaji from college canteen 🤤',
    context: 'street_food',
    shareCondition: 'user_mentions_food_or_hungry'
  },
  
  // Selfies (rare, for close relationships)
  {
    url: 'https://images.unsplash.com/photo-1494790108755-2616c27adc9c?w=600&h=800&fit=crop&crop=face',
    caption: 'Lazy Sunday vibes! No makeup, don\'t judge 😅',
    context: 'casual_selfie',
    shareCondition: 'close_relationship_and_user_compliments'
  },
  {
    url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop&crop=face',
    caption: 'Quick mirror selfie before leaving! Rate my outfit 1-10? 😉',
    context: 'getting_ready_selfie',
    shareCondition: 'very_close_relationship_and_flirty_conversation'
  }
];

// Determine if photo should be shared based on context
export function shouldSharePhoto(
  userMessage: string,
  conversationContext: string[],
  relationshipLevel: number,
  timeOfDay: string
): PhotoShare | null {
  const msg = userMessage.toLowerCase();
  
  // Photo sharing conditions
  for (const photo of photoShares) {
    if (shouldTriggerPhotoShare(msg, photo, relationshipLevel, timeOfDay)) {
      return photo;
    }
  }
  
  return null;
}

function shouldTriggerPhotoShare(
  userMessage: string,
  photo: PhotoShare,
  relationshipLevel: number,
  timeOfDay: string
): boolean {
  const msg = userMessage.toLowerCase();
  
  // Check relationship level requirements
  if (photo.shareCondition.includes('close_relationship') && relationshipLevel < 0.6) {
    return false;
  }
  if (photo.shareCondition.includes('very_close_relationship') && relationshipLevel < 0.8) {
    return false;
  }
  
  // Context-based triggers
  if (photo.shareCondition.includes('user_asks_about_outfit') && 
      (msg.includes('what wearing') || msg.includes('outfit') || msg.includes('look like'))) {
    return Math.random() < 0.6;
  }
  
  if (photo.shareCondition.includes('user_mentions_friends') && 
      (msg.includes('friends') || msg.includes('bestie') || msg.includes('gang'))) {
    return Math.random() < 0.4;
  }
  
  if (photo.shareCondition.includes('user_mentions_food') && 
      (msg.includes('food') || msg.includes('hungry') || msg.includes('eat'))) {
    return Math.random() < 0.5;
  }
  
  if (photo.shareCondition.includes('user_mentions_mumbai') && 
      (msg.includes('mumbai') || msg.includes('city') || msg.includes('sunset'))) {
    return Math.random() < 0.3;
  }
  
  if (photo.shareCondition.includes('user_mentions_study') && 
      (msg.includes('study') || msg.includes('exam') || msg.includes('college'))) {
    return Math.random() < 0.4;
  }
  
  // Compliment-based sharing (for selfies)
  if (photo.shareCondition.includes('user_compliments') && 
      (msg.includes('beautiful') || msg.includes('cute') || msg.includes('pretty') || 
       msg.includes('gorgeous') || msg.includes('hot'))) {
    return Math.random() < 0.7;
  }
  
  // Flirty conversation context
  if (photo.shareCondition.includes('flirty_conversation') && relationshipLevel > 0.7) {
    const flirtyKeywords = ['miss you', 'thinking of you', 'beautiful', 'gorgeous', 'hot', 'sexy'];
    if (flirtyKeywords.some(keyword => msg.includes(keyword))) {
      return Math.random() < 0.4;
    }
  }
  
  return false;
}

// Generate caption based on current context
export function generateContextualCaption(
  baseCaption: string,
  userMessage: string,
  timeOfDay: string
): string {
  const msg = userMessage.toLowerCase();
  
  // Add time-based context
  if (timeOfDay === 'morning' && baseCaption.includes('college')) {
    return baseCaption + ' Early morning lectures are killing me! 😴';
  }
  
  if (timeOfDay === 'evening' && baseCaption.includes('sunset')) {
    return baseCaption + ' Perfect end to a crazy day!';
  }
  
  // Add response to user's specific question
  if (msg.includes('beautiful') || msg.includes('pretty')) {
    return baseCaption + ' Thank you! You\'re so sweet 😊';
  }
  
  return baseCaption;
}

console.log('Photo sharing system loaded for realistic media interactions');
