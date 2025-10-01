
interface LocationAnalytics {
  location: string;
  personalityType: string;
  engagementMetrics: {
    messagesPerSession: number;
    sessionDuration: number;
    responseTime: number;
    sentimentScore: number;
  };
  culturalAdaptation: {
    slangUsageAccuracy: number;
    culturalReferenceRelevance: number;
    languageStyleMatch: number;
    localContextAccuracy: number;
  };
  userSatisfaction: {
    conversationQuality: number;
    personalConnection: number;
    culturalAuthenticity: number;
    retentionRate: number;
  };
}

class LocationAnalyticsTracker {
  private static instance: LocationAnalyticsTracker;
  private analytics: Map<string, LocationAnalytics> = new Map();

  static getInstance(): LocationAnalyticsTracker {
    if (!LocationAnalyticsTracker.instance) {
      LocationAnalyticsTracker.instance = new LocationAnalyticsTracker();
    }
    return LocationAnalyticsTracker.instance;
  }

  trackLocationBasedInteraction(data: {
    location: string;
    personalityUsed: string;
    messageLength: number;
    responseTime: number;
    culturalElementsUsed: string[];
    userEngagementScore: number;
    sentimentScore: number;
  }) {
    const key = `${data.location}_${data.personalityUsed}`;
    let analytics = this.analytics.get(key);

    if (!analytics) {
      analytics = {
        location: data.location,
        personalityType: data.personalityUsed,
        engagementMetrics: {
          messagesPerSession: 0,
          sessionDuration: 0,
          responseTime: 0,
          sentimentScore: 0
        },
        culturalAdaptation: {
          slangUsageAccuracy: 0,
          culturalReferenceRelevance: 0,
          languageStyleMatch: 0,
          localContextAccuracy: 0
        },
        userSatisfaction: {
          conversationQuality: 0,
          personalConnection: 0,
          culturalAuthenticity: 0,
          retentionRate: 0
        }
      };
    }

    // Update engagement metrics
    analytics.engagementMetrics.messagesPerSession++;
    analytics.engagementMetrics.responseTime = 
      (analytics.engagementMetrics.responseTime + data.responseTime) / 2;
    analytics.engagementMetrics.sentimentScore = 
      (analytics.engagementMetrics.sentimentScore + data.sentimentScore) / 2;

    // Update cultural adaptation based on elements used
    const culturalScore = data.culturalElementsUsed.length > 0 ? 
      Math.min(1, data.culturalElementsUsed.length / 3) : 0;
    analytics.culturalAdaptation.localContextAccuracy = 
      (analytics.culturalAdaptation.localContextAccuracy + culturalScore) / 2;

    // Update user satisfaction
    analytics.userSatisfaction.conversationQuality = 
      (analytics.userSatisfaction.conversationQuality + data.userEngagementScore) / 2;

    this.analytics.set(key, analytics);
  }

  getLocationEffectiveness(): Record<string, any> {
    const results: Record<string, any> = {};

    this.analytics.forEach((analytics, key) => {
      results[key] = {
        overallScore: this.calculateOverallScore(analytics),
        engagementLevel: this.calculateEngagementLevel(analytics),
        culturalAccuracy: this.calculateCulturalAccuracy(analytics),
        userSatisfaction: this.calculateUserSatisfaction(analytics),
        recommendations: this.generateRecommendations(analytics)
      };
    });

    return results;
  }

  private calculateOverallScore(analytics: LocationAnalytics): number {
    const engagement = this.calculateEngagementLevel(analytics);
    const cultural = this.calculateCulturalAccuracy(analytics);
    const satisfaction = this.calculateUserSatisfaction(analytics);
    
    return (engagement * 0.4 + cultural * 0.3 + satisfaction * 0.3);
  }

  private calculateEngagementLevel(analytics: LocationAnalytics): number {
    const metrics = analytics.engagementMetrics;
    return (
      Math.min(1, metrics.messagesPerSession / 20) * 0.4 +
      Math.min(1, metrics.sentimentScore) * 0.3 +
      (1 - Math.min(1, metrics.responseTime / 10000)) * 0.3
    );
  }

  private calculateCulturalAccuracy(analytics: LocationAnalytics): number {
    const cultural = analytics.culturalAdaptation;
    return (
      cultural.slangUsageAccuracy * 0.3 +
      cultural.culturalReferenceRelevance * 0.3 +
      cultural.languageStyleMatch * 0.2 +
      cultural.localContextAccuracy * 0.2
    );
  }

  private calculateUserSatisfaction(analytics: LocationAnalytics): number {
    const satisfaction = analytics.userSatisfaction;
    return (
      satisfaction.conversationQuality * 0.4 +
      satisfaction.personalConnection * 0.3 +
      satisfaction.culturalAuthenticity * 0.3
    );
  }

  private generateRecommendations(analytics: LocationAnalytics): string[] {
    const recommendations: string[] = [];
    
    if (analytics.culturalAdaptation.slangUsageAccuracy < 0.6) {
      recommendations.push(`Increase local slang usage for ${analytics.location}`);
    }
    
    if (analytics.engagementMetrics.sentimentScore < 0.7) {
      recommendations.push(`Improve emotional connection for ${analytics.personalityType}`);
    }
    
    if (analytics.culturalAdaptation.localContextAccuracy < 0.5) {
      recommendations.push(`Add more location-specific references for ${analytics.location}`);
    }
    
    return recommendations;
  }
}

export const locationAnalytics = LocationAnalyticsTracker.getInstance();
