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

  const updateRelationshipStage = (stage: UserBehaviorCookies['relationshipStage']) => {
    if (consentGiven?.personalization) {
      CookieManager.updateRelationshipStage(stage);
      setUserBehavior(prev => ({ ...prev, relationshipStage: stage }));
    }
  };

  const trackUserValue = (messageCount: number, sessionDuration: number, imagesSent: number) => {
    if (consentGiven?.analytics) {
      CookieManager.trackUserValueMetrics(messageCount, sessionDuration, imagesSent);
    }
  };

  const trackSEO = (pageType: string, source?: string) => {
    if (consentGiven?.analytics) {
      CookieManager.trackSEOMetrics(pageType, source);
    }
  };

  const getAIPersonality = () => {
    if (consentGiven?.aiLearning) {
      return CookieManager.getAIPersonalityProfile();
    }
    return null;
  };

  return {
    consentGiven,
    userBehavior,
    updateChatBehavior,
    updateRelationshipStage,
    trackUserValue,
    trackSEO,
    getAIPersonality,
    
    // Utility functions
    hasConsent: (type: keyof CookiePreferences) => consentGiven?.[type] || false,
    isNewUser: !userBehavior.relationshipStage || userBehavior.relationshipStage === 'new'
  };
};

console.log('Cookie Hook: AI girlfriend cookie management hook loaded');