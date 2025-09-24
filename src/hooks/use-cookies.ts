
import { useEffect, useState } from 'react';
import { CookieManager, AIGirlfriendCookies, type UserBehaviorCookies, type CookiePreferences } from '@/lib/cookie-manager';

export const useCookies = () => {
  const [consentGiven, setConsentGiven] = useState<CookiePreferences | null>(null);
  const [userBehavior, setUserBehavior] = useState<Partial<UserBehaviorCookies>>({});

  useEffect(() => {
    // Check if user has given consent
    const consent = CookieManager.getConsentPreferences();
    setConsentGiven(consent);

    if (consent) {
      // Load user behavior data from cookies
      const behavior = AIGirlfriendCookies.getPersonalizedBehavior();
      setUserBehavior(behavior);
      
      // Initialize new user if no data exists
      if (!behavior.relationshipStage) {
        AIGirlfriendCookies.initializeNewUser();
      }
    }
  }, []);

  const updateChatBehavior = (messageCount: number, topics: string[], sentiment: string) => {
    if (consentGiven?.aiLearning) {
      AIGirlfriendCookies.updateFromConversation(messageCount, topics, sentiment);
      setUserBehavior(AIGirlfriendCookies.getPersonalizedBehavior());
    }
  };

  const trackAdInteraction = (adType: string, action: 'view' | 'click' | 'close') => {
    if (consentGiven?.advertising) {
      CookieManager.trackAdInteraction(adType, action);
    }
  };

  const updateRelationshipStage = (stage: UserBehaviorCookies['relationshipStage']) => {
    if (consentGiven?.personalization) {
      CookieManager.updateRelationshipStage(stage);
      setUserBehavior(prev => ({ ...prev, relationshipStage: stage }));
    }
  };

  const getOptimalAdTiming = () => {
    return CookieManager.getOptimalAdTiming();
  };

  return {
    consentGiven,
    userBehavior,
    updateChatBehavior,
    trackAdInteraction,
    updateRelationshipStage,
    getOptimalAdTiming,
    
    // Utility functions
    hasConsent: (type: keyof CookiePreferences) => consentGiven?.[type] || false,
    isNewUser: !userBehavior.relationshipStage || userBehavior.relationshipStage === 'new'
  };
};

console.log('Cookie Hook: AI girlfriend cookie management hook loaded');
