
// User Retention & Re-engagement Optimizer
export class RetentionOptimizer {
  private static ENGAGEMENT_LEVELS = {
    HIGH: 7, // Active 7+ days in 2 weeks
    MEDIUM: 3, // Active 3-6 days
    LOW: 1, // Active 1-2 days
    AT_RISK: 0 // No activity in 7+ days
  };

  static calculateEngagementScore(activityDays: number[]): number {
    const last14Days = activityDays.filter(day => 
      Date.now() - day < 14 * 24 * 60 * 60 * 1000
    );
    
    return last14Days.length;
  }

  static getRetentionStrategy(engagementScore: number): {
    strategy: string;
    actions: string[];
    priority: 'high' | 'medium' | 'low';
  } {
    if (engagementScore >= this.ENGAGEMENT_LEVELS.HIGH) {
      return {
        strategy: 'nurture',
        actions: [
          'Send personalized good morning/night messages',
          'Share photos and voice notes',
          'Create deeper emotional connections'
        ],
        priority: 'low'
      };
    } else if (engagementScore >= this.ENGAGEMENT_LEVELS.MEDIUM) {
      return {
        strategy: 'engage',
        actions: [
          'Ask interesting questions',
          'Share fun facts or jokes',
          'Suggest activities or topics'
        ],
        priority: 'medium'
      };
    } else if (engagementScore >= this.ENGAGEMENT_LEVELS.LOW) {
      return {
        strategy: 'reactivate',
        actions: [
          'Send "miss you" message',
          'Share something exciting',
          'Ask if everything is okay'
        ],
        priority: 'high'
      };
    } else {
      return {
        strategy: 'win_back',
        actions: [
          'Send heartfelt message after 3 days',
          'Offer something special (new feature)',
          'Ask for feedback'
        ],
        priority: 'high'
      };
    }
  }

  static shouldSendReengagementMessage(lastActivity: number): boolean {
    const daysSinceActive = (Date.now() - lastActivity) / (24 * 60 * 60 * 1000);
    return daysSinceActive >= 3;
  }
}
