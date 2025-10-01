'use client';

import { getUserLocation, generateLocalizedPersonality, type LocationData, type LocalizedPersonality } from './geo-targeting';

export interface EnhancedUserProfile {
  id: string;
  createdAt: number;
  lastActive: number;
  messageCount: number;
  engagementLevel: number;

  // Location-based personalization
  location?: LocationData;
  localizedPersonality?: LocalizedPersonality;
  culturalPreferences: {
    language: string;
    communicationStyle: string;
    culturalReferences: string[];
    localSlang: string[];
  };

  // Behavioral patterns
  sessionCount: number;
  averageSessionDuration: number;
  preferredTopics: string[];
  responseStyle: 'short' | 'medium' | 'long';
  emojiUsage: number;

  // Relationship metrics
  relationshipLevel: number; // 0-1
  intimacyScore: number; // 0-1
  trustLevel: number; // 0-1
  attachmentStyle: 'secure' | 'anxious' | 'avoidant' | 'developing';

  // Monetization data
  adTolerance: number; // 0-1
  premiumInterest: number; // 0-1
  lifetimeValue: number;
}

class EnhancedUserManager {
  private static instance: EnhancedUserManager;
  private userProfiles = new Map<string, EnhancedUserProfile>();
  private readonly PROFILE_KEY = 'enhanced_user_profile_v2';

  static getInstance(): EnhancedUserManager {
    if (!EnhancedUserManager.instance) {
      EnhancedUserManager.instance = new EnhancedUserManager();
    }
    return EnhancedUserManager.instance;
  }

  constructor() {
    this.loadUserProfiles();
    this.initializeLocationBasedPersonality();
  }

  private async initializeLocationBasedPersonality() {
    try {
      const location = await getUserLocation();
      if (location) {
        const currentProfile = this.getCurrentUserProfile();
        if (!currentProfile.localizedPersonality) {
          currentProfile.location = location;
          currentProfile.localizedPersonality = generateLocalizedPersonality(location);
          currentProfile.culturalPreferences = {
            language: location.language,
            communicationStyle: currentProfile.localizedPersonality.languageStyle,
            culturalReferences: currentProfile.localizedPersonality.interests,
            localSlang: currentProfile.localizedPersonality.localSlang
          };
          this.saveUserProfile(currentProfile);

          console.log(`Location-based personality initialized: ${currentProfile.localizedPersonality.name} from ${currentProfile.localizedPersonality.location}`);
        }
      }
    } catch (error) {
      console.warn('Failed to initialize location-based personality:', error);
    }
  }

  private loadUserProfiles() {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem(this.PROFILE_KEY);
      if (saved) {
        const profileData = JSON.parse(saved);
        this.userProfiles.set('current', profileData);
      }
    } catch (error) {
      console.warn('Failed to load user profiles:', error);
    }
  }

  private saveUserProfile(profile: EnhancedUserProfile) {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.PROFILE_KEY, JSON.stringify(profile));
      this.userProfiles.set('current', profile);
    } catch (error) {
      console.warn('Failed to save user profile:', error);
    }
  }

  getCurrentUserProfile(): EnhancedUserProfile {
    const existing = this.userProfiles.get('current');
    if (existing) {
      existing.lastActive = Date.now();
      return existing;
    }

    // Create new profile with location awareness
    const newProfile: EnhancedUserProfile = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      lastActive: Date.now(),
      messageCount: 0,
      engagementLevel: 0.5,

      culturalPreferences: {
        language: 'en',
        communicationStyle: 'casual',
        culturalReferences: [],
        localSlang: []
      },

      sessionCount: 1,
      averageSessionDuration: 0,
      preferredTopics: [],
      responseStyle: 'medium',
      emojiUsage: 0,

      relationshipLevel: 0.1,
      intimacyScore: 0,
      trustLevel: 0.3,
      attachmentStyle: 'developing',

      adTolerance: 0.7,
      premiumInterest: 0.2,
      lifetimeValue: 0
    };

    this.saveUserProfile(newProfile);
    return newProfile;
  }

  updateUserEngagement(messageData: {
    length: number;
    emojiCount: number;
    topics: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    responseTime: number;
  }) {
    const profile = this.getCurrentUserProfile();

    // Update message count and engagement
    profile.messageCount++;
    profile.lastActive = Date.now();

    // Analyze engagement patterns
    if (messageData.length > 50) profile.engagementLevel += 0.05;
    if (messageData.emojiCount > 0) profile.engagementLevel += 0.02;
    if (messageData.sentiment === 'positive') profile.engagementLevel += 0.03;

    profile.engagementLevel = Math.min(1, profile.engagementLevel);

    // Update response style
    if (messageData.length < 20) profile.responseStyle = 'short';
    else if (messageData.length > 80) profile.responseStyle = 'long';
    else profile.responseStyle = 'medium';

    // Track emoji usage
    profile.emojiUsage = (profile.emojiUsage + messageData.emojiCount) / 2;

    // Update preferred topics
    messageData.topics.forEach(topic => {
      if (!profile.preferredTopics.includes(topic)) {
        profile.preferredTopics.push(topic);
      }
    });
    profile.preferredTopics = profile.preferredTopics.slice(-10); // Keep recent topics

    // Update relationship metrics based on location and culture
    this.updateRelationshipMetrics(profile, messageData);

    this.saveUserProfile(profile);
  }

  private updateRelationshipMetrics(profile: EnhancedUserProfile, messageData: any) {
    // Cultural adaptation of relationship building
    const culturalMultiplier = this.getCulturalEngagementMultiplier(profile);

    // Base relationship growth
    let relationshipGrowth = 0.01;

    if (messageData.sentiment === 'positive') relationshipGrowth *= 1.5;
    if (messageData.length > 50) relationshipGrowth *= 1.2;
    if (messageData.emojiCount > 2) relationshipGrowth *= 1.1;

    // Apply cultural multiplier
    relationshipGrowth *= culturalMultiplier;

    profile.relationshipLevel = Math.min(1, profile.relationshipLevel + relationshipGrowth);

    // Update trust and intimacy based on cultural context
    if (profile.messageCount > 20) {
      profile.trustLevel = Math.min(1, profile.trustLevel + 0.01 * culturalMultiplier);
    }

    if (profile.relationshipLevel > 0.5) {
      profile.intimacyScore = Math.min(1, profile.intimacyScore + 0.005 * culturalMultiplier);
    }

    // Update attachment style based on usage patterns
    this.updateAttachmentStyle(profile);
  }

  private getCulturalEngagementMultiplier(profile: EnhancedUserProfile): number {
    if (!profile.location) return 1.0;

    // Different cultures have different relationship building patterns
    const culturalMultipliers: Record<string, number> = {
      'India': 1.3, // Strong relationship culture
      'United States': 1.0, // Baseline
      'United Kingdom': 0.9, // More reserved
      'Germany': 0.8, // Very reserved initially
      'Australia': 1.1, // Friendly culture
      'Canada': 1.2, // Polite and relationship-focused
    };

    return culturalMultipliers[profile.location.country] || 1.0;
  }

  private updateAttachmentStyle(profile: EnhancedUserProfile) {
    const dailyMessages = this.getDailyMessageCount(profile);
    const sessionFrequency = profile.sessionCount / Math.max(1, this.getDaysSinceCreation(profile));

    if (dailyMessages > 50 && sessionFrequency > 3) {
      profile.attachmentStyle = 'anxious';
    } else if (dailyMessages < 5 && sessionFrequency < 0.5) {
      profile.attachmentStyle = 'avoidant';
    } else if (profile.relationshipLevel > 0.7 && profile.trustLevel > 0.6) {
      profile.attachmentStyle = 'secure';
    }
  }

  private getDailyMessageCount(profile: EnhancedUserProfile): number {
    const today = new Date().toDateString();
    const dailyCount = localStorage.getItem(`daily_messages_${today}`);
    return dailyCount ? parseInt(dailyCount) : 0;
  }

  private getDaysSinceCreation(profile: EnhancedUserProfile): number {
    return Math.floor((Date.now() - profile.createdAt) / (1000 * 60 * 60 * 24)) || 1;
  }

  // Get culturally appropriate AI behavior parameters
  getAIBehaviorParams(profile: EnhancedUserProfile) {
    return {
      responseLength: profile.responseStyle,
      emojiFrequency: Math.min(profile.emojiUsage * 1.5, 3),
      intimacyLevel: profile.intimacyScore,
      culturalStyle: profile.localizedPersonality?.languageStyle || 'neutral',
      localReferences: profile.localizedPersonality?.interests || [],
      slangUsage: profile.culturalPreferences.localSlang || [],
      relationshipStage: this.getRelationshipStage(profile),
      engagementStrategy: this.getEngagementStrategy(profile)
    };
  }

  private getRelationshipStage(profile: EnhancedUserProfile): string {
    if (profile.relationshipLevel < 0.2) return 'getting_to_know';
    if (profile.relationshipLevel < 0.5) return 'building_friendship';
    if (profile.relationshipLevel < 0.8) return 'close_friends';
    return 'intimate_connection';
  }

  private getEngagementStrategy(profile: EnhancedUserProfile): string {
    if (profile.attachmentStyle === 'anxious') return 'consistent_availability';
    if (profile.attachmentStyle === 'avoidant') return 'gentle_persistence';
    if (profile.attachmentStyle === 'secure') return 'balanced_interaction';
    return 'discovery_phase';
  }

  // Get localized AI personality for current user
  getLocalizedPersonality(): LocalizedPersonality | null {
    const profile = this.getCurrentUserProfile();
    return profile.localizedPersonality || null;
  }

  // Get cultural context for AI responses
  getCulturalContext(): string {
    const profile = this.getCurrentUserProfile();
    if (!profile.localizedPersonality) return '';

    const personality = profile.localizedPersonality;
    return `You are from ${personality.location}. Use ${personality.languageStyle}.
    Reference these local interests: ${personality.interests.join(', ')}.
    Use local slang: ${personality.localSlang.join(', ')}.
    Mention these activities: ${personality.typicalActivities.join(', ')}.`;
  }

  // Analytics and insights
  getUserInsights(profile: EnhancedUserProfile) {
    return {
      userType: this.classifyUserType(profile),
      retentionRisk: this.calculateRetentionRisk(profile),
      monetizationPotential: this.calculateMonetizationPotential(profile),
      engagementHealth: this.calculateEngagementHealth(profile),
      culturalAlignment: this.calculateCulturalAlignment(profile)
    };
  }

  private classifyUserType(profile: EnhancedUserProfile): string {
    const dailyMessages = this.getDailyMessageCount(profile);
    const daysSince = this.getDaysSinceCreation(profile);

    if (dailyMessages > 30 && daysSince > 7) return 'heavy_user';
    if (dailyMessages > 15 && profile.relationshipLevel > 0.6) return 'engaged_user';
    if (dailyMessages < 5 && daysSince > 3) return 'low_engagement';
    return 'developing_user';
  }

  private calculateRetentionRisk(profile: EnhancedUserProfile): number {
    const daysSinceLastActive = (Date.now() - profile.lastActive) / (1000 * 60 * 60 * 24);
    const engagementDecline = Math.max(0, 0.8 - profile.engagementLevel);
    const culturalMismatch = profile.localizedPersonality ? 0 : 0.3;

    return Math.min(1, (daysSinceLastActive * 0.1) + engagementDecline + culturalMismatch);
  }

  private calculateMonetizationPotential(profile: EnhancedUserProfile): number {
    return (profile.engagementLevel * 0.4) +
           (profile.relationshipLevel * 0.3) +
           (profile.adTolerance * 0.3);
  }

  private calculateEngagementHealth(profile: EnhancedUserProfile): number {
    return (profile.engagementLevel * 0.5) +
           (profile.relationshipLevel * 0.3) +
           (profile.trustLevel * 0.2);
  }

  private calculateCulturalAlignment(profile: EnhancedUserProfile): number {
    if (!profile.localizedPersonality) return 0.5; // Default if no location data

    const hasLocalSlang = profile.culturalPreferences.localSlang.length > 0;
    const hasLocalReferences = profile.culturalPreferences.culturalReferences.length > 0;
    const correctLanguageStyle = profile.culturalPreferences.communicationStyle !== 'neutral';

    return (hasLocalSlang ? 0.4 : 0) +
           (hasLocalReferences ? 0.4 : 0) +
           (correctLanguageStyle ? 0.2 : 0);
  }
}

export const enhancedUserManager = EnhancedUserManager.getInstance();