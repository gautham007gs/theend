
interface UserProfile {
  chatFrequency: 'low' | 'medium' | 'high';
  preferredLanguage: string;
  timeZone: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  sessionLength: 'short' | 'medium' | 'long';
}

export const getTargetedAdContent = (userProfile: UserProfile): string => {
  const adVariations = {
    highFrequencyUsers: [
      'dating_apps_premium',    // Higher converting for engaged users
      'entertainment_streaming', // Long session users
      'social_platforms'        // Frequent chatters
    ],
    lowFrequencyUsers: [
      'casual_games',          // Easy engagement
      'lifestyle_products',    // Broad appeal
      'educational_content'    // Value-driven
    ]
  };
  
  const targetAds = userProfile.chatFrequency === 'high' 
    ? adVariations.highFrequencyUsers 
    : adVariations.lowFrequencyUsers;
    
  return targetAds[Math.floor(Math.random() * targetAds.length)];
};

export const calculateOptimalAdTiming = (userProfile: UserProfile): number => {
  // Longer sessions = less frequent but higher-value ads
  const baseInterval = userProfile.sessionLength === 'long' ? 180 : // 3 minutes
                      userProfile.sessionLength === 'medium' ? 120 : // 2 minutes
                      90; // 1.5 minutes for short sessions
                      
  // Adjust for device type (mobile users more tolerant of ads)
  return userProfile.deviceType === 'mobile' ? baseInterval * 0.8 : baseInterval;
};
