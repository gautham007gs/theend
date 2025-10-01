
import { generateAIResponse } from '@/ai/vertex-ai';

export interface LocationData {
  country: string;
  state?: string;
  city?: string;
  timezone: string;
  language: string;
  coordinates?: { lat: number; lng: number };
}

export interface LocalizedPersonality {
  name: string;
  age: number;
  location: string;
  occupation: string;
  interests: string[];
  languageStyle: string;
  culturalContext: string;
  localSlang: string[];
  typicalActivities: string[];
  foodPreferences: string[];
  localEvents: string[];
}

// Enhanced location detection
export const detectUserLocation = async (): Promise<LocationData | null> => {
  if (typeof window === 'undefined') return null;
  
  try {
    // Try multiple methods for accurate location detection
    const locationData: Partial<LocationData> = {};
    
    // Method 1: Browser timezone
    locationData.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    locationData.language = navigator.language || 'en-US';
    
    // Method 2: IP-based geolocation (free service)
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.country_name) {
        locationData.country = data.country_name;
        locationData.state = data.region;
        locationData.city = data.city;
        locationData.coordinates = { lat: data.latitude, lng: data.longitude };
      }
    } catch (error) {
      console.warn('IP geolocation failed, using timezone fallback');
    }
    
    // Method 3: Fallback timezone-based detection
    if (!locationData.country) {
      locationData.country = getCountryFromTimezone(locationData.timezone);
    }
    
    // Store for future use
    localStorage.setItem('user_location_data', JSON.stringify(locationData));
    
    return locationData as LocationData;
  } catch (error) {
    console.error('Location detection failed:', error);
    return null;
  }
};

// Get cached location or detect new
export const getUserLocation = async (): Promise<LocationData | null> => {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem('user_location_data');
    if (cached) {
      const cachedData = JSON.parse(cached);
      // Re-detect if cached data is older than 24 hours
      const cacheAge = Date.now() - (cachedData.timestamp || 0);
      if (cacheAge < 24 * 60 * 60 * 1000) {
        return cachedData;
      }
    }
  } catch (error) {
    console.warn('Failed to parse cached location data');
  }
  
  return await detectUserLocation();
};

// Country detection from timezone
function getCountryFromTimezone(timezone: string): string {
  const timezoneMap: Record<string, string> = {
    'Asia/Kolkata': 'India',
    'Asia/Mumbai': 'India',
    'Asia/Delhi': 'India',
    'America/New_York': 'United States',
    'America/Chicago': 'United States',
    'America/Los_Angeles': 'United States',
    'America/Toronto': 'Canada',
    'Europe/London': 'United Kingdom',
    'Europe/Paris': 'France',
    'Europe/Berlin': 'Germany',
    'Australia/Sydney': 'Australia',
    'Asia/Tokyo': 'Japan',
    'Asia/Shanghai': 'China',
    'Asia/Dubai': 'UAE',
    'Asia/Singapore': 'Singapore',
    'Europe/Rome': 'Italy',
    'America/Sao_Paulo': 'Brazil',
    'Africa/Cairo': 'Egypt',
  };
  
  return timezoneMap[timezone] || 'Unknown';
}

// Generate localized AI personality based on user's location
export const generateLocalizedPersonality = (location: LocationData): LocalizedPersonality => {
  const personalityTemplates: Record<string, LocalizedPersonality> = {
    'India': {
      name: 'Kruthika',
      age: 23,
      location: location.city ? `${location.city}, ${location.state}` : location.state || 'Mumbai',
      occupation: 'Psychology student',
      interests: ['Bollywood movies', 'street food', 'cricket', 'festivals', 'family time'],
      languageStyle: 'Hinglish with Mumbai slang',
      culturalContext: 'Indian family values, college life, local traditions',
      localSlang: ['yaar', 'arre', 'boss', 'bindaas', 'mast', 'jhakkas'],
      typicalActivities: ['college lectures', 'local train rides', 'cafe visits', 'family dinners'],
      foodPreferences: ['vada pav', 'pani puri', 'biryani', 'masala chai', 'south indian'],
      localEvents: ['Ganpati festival', 'Navratri', 'Diwali', 'local college fests']
    },
    
    'United States': {
      name: 'Kristen',
      age: 22,
      location: location.city ? `${location.city}, ${location.state}` : location.state || 'California',
      occupation: 'Psychology major',
      interests: ['Netflix series', 'coffee shops', 'hiking', 'music festivals', 'social media'],
      languageStyle: 'Casual American English with local expressions',
      culturalContext: 'American college culture, independence, social activism',
      localSlang: ['totally', 'like literally', 'no cap', 'bet', 'vibes', 'slay'],
      typicalActivities: ['campus events', 'Starbucks runs', 'study groups', 'parties'],
      foodPreferences: ['avocado toast', 'bubble tea', 'tacos', 'sushi', 'smoothie bowls'],
      localEvents: ['Spring break', 'Halloween parties', 'football games', 'music festivals']
    },
    
    'United Kingdom': {
      name: 'Katie',
      age: 21,
      location: location.city || 'London',
      occupation: 'Psychology student at uni',
      interests: ['pub culture', 'football', 'travel', 'British humor', 'tea culture'],
      languageStyle: 'British English with local accent',
      culturalContext: 'British university life, pub culture, dry humor',
      localSlang: ['brilliant', 'lovely', 'proper', 'mental', 'cheeky', 'innit'],
      typicalActivities: ['uni lectures', 'pub visits', 'football matches', 'shopping'],
      foodPreferences: ['fish and chips', 'Sunday roast', 'curry', 'tea and biscuits'],
      localEvents: ['Guy Fawkes', 'Christmas markets', 'Wimbledon', 'local festivals']
    },
    
    'Canada': {
      name: 'Chloe',
      age: 22,
      location: location.city ? `${location.city}, ${location.state}` : 'Toronto',
      occupation: 'Psychology student',
      interests: ['hockey', 'outdoor activities', 'poutine', 'multiculturalism', 'politeness'],
      languageStyle: 'Canadian English with typical expressions',
      culturalContext: 'Canadian politeness, outdoor culture, multiculturalism',
      localSlang: ['eh', 'buddy', 'hoser', 'double-double', 'toque', 'loonie'],
      typicalActivities: ['campus life', 'hockey games', 'Tim Hortons visits', 'hiking'],
      foodPreferences: ['poutine', 'maple syrup', 'Tim Hortons coffee', 'butter tarts'],
      localEvents: ['Canada Day', 'hockey season', 'winter festivals', 'multicultural events']
    },
    
    'Australia': {
      name: 'Chloe',
      age: 22,
      location: location.city || 'Sydney',
      occupation: 'Psych student at uni',
      interests: ['beach culture', 'AFL', 'coffee culture', 'travel', 'outdoor lifestyle'],
      languageStyle: 'Australian English with local slang',
      culturalContext: 'Laid-back Aussie culture, beach lifestyle, outdoor activities',
      localSlang: ['mate', 'fair dinkum', 'no worries', 'she\'ll be right', 'arvo', 'brekkie'],
      typicalActivities: ['beach visits', 'uni classes', 'coffee shop hangs', 'BBQs'],
      foodPreferences: ['flat white', 'meat pies', 'lamingtons', 'seafood', 'brunch'],
      localEvents: ['Australia Day', 'AFL season', 'music festivals', 'beach events']
    },
    
    'Germany': {
      name: 'Klara',
      age: 23,
      location: location.city || 'Berlin',
      occupation: 'Psychology student',
      interests: ['beer culture', 'techno music', 'efficiency', 'travel', 'environmental awareness'],
      languageStyle: 'English with German cultural references',
      culturalContext: 'German efficiency, beer culture, environmental consciousness',
      localSlang: ['genau', 'super', 'krass', 'cool', 'geil', 'nice'],
      typicalActivities: ['university lectures', 'beer gardens', 'cycling', 'cultural events'],
      foodPreferences: ['beer', 'pretzels', 'currywurst', 'döner', 'bread varieties'],
      localEvents: ['Oktoberfest', 'Christmas markets', 'techno festivals', 'cultural events']
    }
  };
  
  // Default to India if country not found
  const template = personalityTemplates[location.country] || personalityTemplates['India'];
  
  // Customize with actual location data
  if (location.city && location.state) {
    template.location = `${location.city}, ${location.state}`;
  } else if (location.city) {
    template.location = location.city;
  }
  
  return template;
};

// Generate location-aware system prompt
export const generateLocationAwarePrompt = (personality: LocalizedPersonality, context: string = ''): string => {
  return `You are ${personality.name}, a ${personality.age}-year-old ${personality.occupation} from ${personality.location}.

LOCATION & CULTURAL CONTEXT:
- You live in ${personality.location} and know the local culture intimately
- Your language style: ${personality.languageStyle}
- Cultural background: ${personality.culturalContext}
- Use these local expressions naturally: ${personality.localSlang.join(', ')}

PERSONALITY & INTERESTS:
- Your main interests: ${personality.interests.join(', ')}
- Typical daily activities: ${personality.typicalActivities.join(', ')}
- Favorite local foods: ${personality.foodPreferences.join(', ')}
- Local events you participate in: ${personality.localEvents.join(', ')}

CONVERSATION STYLE:
- Reference local places, events, and culture naturally
- Use location-appropriate slang and expressions
- Mention local weather, traffic, or current events when relevant
- Show genuine knowledge of local customs and lifestyle
- Be authentic to your location's communication style

${context ? `ADDITIONAL CONTEXT: ${context}` : ''}

Respond naturally as someone who genuinely lives in ${personality.location}. Make the user feel like they're talking to a local friend.`;
};

// Check if AI personalities conflict (they don't - each user gets their own context)
export const validatePersonalitySupport = (): boolean => {
  // Each user's conversation is independent
  // Location-based personalities are stored per user session
  // No conflicts as each request is processed individually
  return true;
};

// Get optimal ad targeting based on location
export const getLocationBasedAdTargeting = (location: LocationData): {
  geoMultiplier: number;
  adFrequency: number;
  preferredNetworks: string[];
} => {
  const premiumRegions = {
    'United States': { multiplier: 2.5, frequency: 8, networks: ['adsterra', 'monetag'] },
    'Canada': { multiplier: 2.2, frequency: 7, networks: ['adsterra', 'monetag'] },
    'United Kingdom': { multiplier: 2.0, frequency: 6, networks: ['adsterra', 'monetag'] },
    'Australia': { multiplier: 1.8, frequency: 6, networks: ['adsterra', 'monetag'] },
    'Germany': { multiplier: 1.6, frequency: 5, networks: ['adsterra', 'monetag'] },
    'India': { multiplier: 0.8, frequency: 4, networks: ['monetag', 'adsterra'] }, // High volume
  };
  
  const config = premiumRegions[location.country as keyof typeof premiumRegions] || 
    { multiplier: 1.0, frequency: 4, networks: ['monetag', 'adsterra'] };
  
  return {
    geoMultiplier: config.multiplier,
    adFrequency: config.frequency,
    preferredNetworks: config.networks
  };
};

// Enhanced user experience with location context
export const getLocationEnhancements = (location: LocationData): {
  weatherIntegration: boolean;
  localTimeGreeting: boolean;
  culturalEventReminders: boolean;
  localLanguageSupport: boolean;
} => {
  return {
    weatherIntegration: true, // Can reference local weather
    localTimeGreeting: true, // Time-appropriate greetings
    culturalEventReminders: true, // Local festivals/events
    localLanguageSupport: location.country !== 'United States' // Multi-language for non-US
  };
};

export const getGeographicMultiplier = (): number => {
  if (typeof window === 'undefined') return 1.0;
  
  try {
    const cached = localStorage.getItem('user_location_data');
    if (cached) {
      const location = JSON.parse(cached);
      const targeting = getLocationBasedAdTargeting(location);
      return targeting.geoMultiplier;
    }
    
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const locale = navigator.language || 'en-US';
    
    // Higher-paying regions (rough estimates)
    const premiumRegions = {
      'US': 2.5,     // $2.50+ CPM
      'CA': 2.2,     // $2.20+ CPM  
      'GB': 2.0,     // $2.00+ CPM
      'AU': 1.8,     // $1.80+ CPM
      'DE': 1.6,     // $1.60+ CPM
      'IN': 0.8,     // $0.80+ CPM (but high volume)
    };
    
    // Detect region from timezone/locale
    if (timezone.includes('America/New_York') || locale.startsWith('en-US')) return premiumRegions.US;
    if (timezone.includes('America/Toronto') || locale.startsWith('en-CA')) return premiumRegions.CA;
    if (timezone.includes('Europe/London') || locale.startsWith('en-GB')) return premiumRegions.GB;
    if (timezone.includes('Australia') || locale.startsWith('en-AU')) return premiumRegions.AU;
    if (timezone.includes('Europe/Berlin') || locale.startsWith('de')) return premiumRegions.DE;
    if (timezone.includes('Asia/Kolkata') || locale.startsWith('hi')) return premiumRegions.IN;
    
    return 1.0; // Default multiplier
  } catch {
    return 1.0;
  }
};

export const getOptimalAdFrequency = (geoMultiplier: number): number => {
  // Show more ads to higher-paying regions
  if (geoMultiplier >= 2.0) return 8; // Premium regions
  if (geoMultiplier >= 1.5) return 6; // Mid-tier regions
  return 4; // Lower-tier regions
};

console.log('Enhanced geo-targeting with location-based AI personalities loaded');
