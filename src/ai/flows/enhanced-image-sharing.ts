// ============================================================================
// ENHANCED IMAGE SHARING SYSTEM
// Handle image requests smartly with psychological and contextual responses
// ============================================================================

export interface ImageSharingContext {
  userMessage: string;
  recentMessages: string[];
  relationshipLevel: number; // 0-1
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  userLanguage: string;
  chatTone: 'casual' | 'flirty' | 'romantic' | 'friendly';
}

export interface ImageSharingResponse {
  shouldShareImage: boolean;
  responseMessage: string;
  imageType?: 'selfie' | 'casual' | 'activity' | 'food' | 'place';
  imageUrl?: string;
  delayBeforeSharing?: number; // seconds
}

// Detect if user is requesting images/photos
export function detectImageRequest(message: string): boolean {
  const imageKeywords = [
    // English
    'pic', 'picture', 'photo', 'selfie', 'image', 'show', 'see you', 'how you look',
    // Hindi/Hinglish  
    'pic bhejo', 'photo send', 'selfie bhej', 'dikha', 'dekhna', 'dikhao', 'bhej do',
    // Kannada
    'photo kali', 'selfie share madi', 'ninna photo', 'kannu', 'nodirbeku',
    // Tamil
    'photo anuppu', 'selfie share pannu', 'unna pakkanum',
    // General patterns
    'apni', 'teri', 'tumhari', 'ninna', 'your pic', 'ur pic'
  ];

  const lowerMessage = message.toLowerCase();
  return imageKeywords.some(keyword => lowerMessage.includes(keyword));
}

// Get contextual response to image requests based on relationship and psychology
export function getImageSharingResponse(context: ImageSharingContext): ImageSharingResponse {
  const { userMessage, recentMessages, relationshipLevel, timeOfDay, userLanguage, chatTone } = context;
  
  // Analyze request intent and appropriateness
  const isInappropriateRequest = /\b(hot|sexy|nude|without|remove|expose|private|intimate)\b/i.test(userMessage);
  const isPoliteRequest = /\b(please|plz|pyaar se|ache se|thoda|if possible|agar|request)\b/i.test(userMessage);
  const isFirstTimeAsking = !recentMessages.some(msg => detectImageRequest(msg));

  // Base sharing decision on relationship level and context
  let shouldShare = false;
  let responseType = 'decline';

  if (isInappropriateRequest) {
    responseType = 'inappropriate_decline';
  } else if (relationshipLevel < 0.3) {
    responseType = 'new_friend_decline';
  } else if (relationshipLevel < 0.6) {
    shouldShare = Math.random() < 0.5; // 50% chance for developing friendship (increased)
    responseType = shouldShare ? 'casual_share' : 'shy_decline';
  } else if (relationshipLevel < 0.8) {
    shouldShare = Math.random() < 0.75; // 75% chance for good friends (increased)
    responseType = shouldShare ? 'friend_share' : 'playful_decline';
  } else {
    shouldShare = Math.random() < 0.9; // 90% chance for close friends (increased)
    responseType = shouldShare ? 'close_friend_share' : 'teasing_decline';
  }

  // Time-based sharing preferences
  if (timeOfDay === 'night' && shouldShare) {
    shouldShare = Math.random() < 0.4; // Reduced at night
    if (!shouldShare) responseType = 'night_decline';
  }

  // Language-specific responses
  const responses: Record<string, Record<string, string>> = {
    hindi: {
      inappropriate_decline: "arre yaar, aise baat nahi karte 😤",
      new_friend_decline: "abhi toh naya dost hun, pics nahi share karti",
      shy_decline: "arre shy aa rahi hun yaar 🙈",
      playful_decline: "nahi yaar, aaj mood nahi hai pics ka 😛",
      teasing_decline: "earning karni padegi pic ke liye 😉",
      night_decline: "raat mein pics? nahi yaar, kal share karungi",
      casual_share: "arre wait, casual pic bhej rahi hun",
      friend_share: "ok yaar, ek cute pic share kar rahi hun 😊",
      close_friend_share: "sirf tumhare liye special pic bhej rahi hun ❤️"
    },
    kannada: {
      inappropriate_decline: "yen guru, hige mathadbaarde 😤",
      new_friend_decline: "hosadagi friend aagidini, photos share madalla",
      shy_decline: "shy aagtaide guru 🙈",
      playful_decline: "illa guru, today mood illa pics share madoke 😛",
      teasing_decline: "pic ge deserve madbeku 😉",
      night_decline: "raatri pics? illa guru, naale share madtini",
      casual_share: "wait madi, ond casual pic share madtini",
      friend_share: "sari guru, ond cute pic share madtini 😊",
      close_friend_share: "nin jothe special pic share madtini ❤️"
    },
    english: {
      inappropriate_decline: "ew no way, don't talk like that 😤",
      new_friend_decline: "we just became friends, don't share pics yet",
      shy_decline: "getting shy yaar 🙈",
      playful_decline: "nah not in mood for pics today 😛",
      teasing_decline: "gotta earn it first 😉",
      night_decline: "pics at night? nah, maybe tomorrow",
      casual_share: "wait, sending a casual pic",
      friend_share: "ok fine, here's a cute pic 😊",
      close_friend_share: "special pic just for you ❤️"
    }
  };

  const langResponses = responses[userLanguage as keyof typeof responses] || responses.english;
  const responseMessage = langResponses[responseType] || langResponses.shy_decline;

  // If sharing, determine image type and URL
  let imageType: 'selfie' | 'casual' | 'activity' | 'food' | 'place' | undefined;
  let imageUrl: string | undefined;
  let delayBeforeSharing = 0;

  if (shouldShare) {
    // Choose image type based on context and time
    if (timeOfDay === 'morning') {
      imageType = Math.random() < 0.5 ? 'casual' : 'food'; // Morning coffee/breakfast
    } else if (timeOfDay === 'afternoon') {
      imageType = Math.random() < 0.4 ? 'selfie' : 'activity'; // College/activities
    } else if (timeOfDay === 'evening') {
      imageType = Math.random() < 0.6 ? 'selfie' : 'place'; // Evening selfies/places
    } else {
      imageType = 'casual'; // Night casual pics only
    }

    // Realistic delay before sharing (AI needs time to "take" or "find" pic)
    delayBeforeSharing = relationshipLevel > 0.7 ? 
      3 + Math.random() * 5 : // 3-8 seconds for close friends
      8 + Math.random() * 12; // 8-20 seconds for others

    // Generate placeholder image URL based on type (these would be real images in production)
    imageUrl = generatePlaceholderImageUrl(imageType, context);
  }

  return {
    shouldShareImage: shouldShare,
    responseMessage,
    imageType,
    imageUrl,
    delayBeforeSharing
  };
}

// Generate appropriate placeholder image URLs (replace with real image logic in production)
function generatePlaceholderImageUrl(imageType: string, context: ImageSharingContext): string {
  const baseUrl = 'https://placehold.co/400x600/E91E63/FFFFFF?text=';
  
  switch (imageType) {
    case 'selfie':
      return `${baseUrl}Kruthika+Selfie`;
    case 'casual':
      return `${baseUrl}Casual+Pic`;
    case 'activity':
      return `${baseUrl}College+Life`;
    case 'food':
      return `${baseUrl}Mumbai+Food`;
    case 'place':
      return `${baseUrl}Mumbai+Scene`;
    default:
      return `${baseUrl}K`;
  }
}

// Track recently shared images globally to prevent repetition
const recentlySharedImageTypes = new Set<string>();
const MAX_IMAGE_HISTORY = 10;

// Handle when AI wants to proactively share images (mood-based, time-based)
export function getProactiveImageShare(
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night',
  mood: string,
  relationshipLevel: number,
  language: string
): ImageSharingResponse | null {
  
  // Only share proactively with close friends (relationship > 0.6) - lowered threshold
  if (relationshipLevel < 0.6) return null;
  
  // Random chance for proactive sharing (12% chance - increased from 5%)
  if (Math.random() > 0.12) return null;

  const proactiveMessages: Record<string, Record<string, string>> = {
    hindi: {
      morning: "good morning! dekho aaj ka fit 😊",
      afternoon: "college mein bore ho rahi, selfie leli",
      evening: "mumbai sunset dekho kitna beautiful 🌅",
      night: "late night vibes ✨"
    },
    kannada: {
      morning: "good morning guru! today look hogide",
      afternoon: "college alli bore aagtha ide, selfie tegedini",
      evening: "mumbai sunset chennagide 🌅",
      night: "night time mood ✨"
    },
    english: {
      morning: "good morning! check out today's fit 😊",
      afternoon: "bored in college, random selfie",
      evening: "look at this mumbai sunset 🌅",
      night: "late night vibes ✨"
    }
  };

  const langMessages = proactiveMessages[language as keyof typeof proactiveMessages] || proactiveMessages.english;
  const message = langMessages[timeOfDay];
  
  // Choose appropriate image type for time with variety
  const availableTypes: Array<'selfie' | 'casual' | 'activity' | 'food' | 'place'> = [];
  
  if (timeOfDay === 'morning') availableTypes.push('casual', 'food');
  else if (timeOfDay === 'afternoon') availableTypes.push('selfie', 'activity');
  else if (timeOfDay === 'evening') availableTypes.push('place', 'selfie');
  else availableTypes.push('casual');

  // Filter out recently used types for variety
  const freshTypes = availableTypes.filter(t => !recentlySharedImageTypes.has(t));
  const imageType = freshTypes.length > 0 
    ? freshTypes[Math.floor(Math.random() * freshTypes.length)]
    : availableTypes[Math.floor(Math.random() * availableTypes.length)];

  // Track this image type
  recentlySharedImageTypes.add(imageType);
  if (recentlySharedImageTypes.size > MAX_IMAGE_HISTORY) {
    const firstItem = recentlySharedImageTypes.values().next().value;
    recentlySharedImageTypes.delete(firstItem);
  }

  return {
    shouldShareImage: true,
    responseMessage: message,
    imageType,
    imageUrl: generatePlaceholderImageUrl(imageType, { 
      userMessage: '', 
      recentMessages: [], 
      relationshipLevel, 
      timeOfDay, 
      userLanguage: language, 
      chatTone: 'casual' 
    }),
    delayBeforeSharing: 2
  };
}

console.log('Enhanced Image Sharing: Psychological, contextual image handling loaded');