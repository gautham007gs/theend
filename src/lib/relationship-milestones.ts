
// Relationship Milestone System
export interface Milestone {
  id: string;
  name: string;
  description: string;
  requirement: number;
  type: 'messages' | 'days' | 'images' | 'sessions';
  unlocked: boolean;
  reward?: string;
  emoji: string;
}

export class RelationshipMilestones {
  private static milestones: Milestone[] = [
    {
      id: 'first_chat',
      name: 'First Hello',
      description: 'Started your first conversation',
      requirement: 1,
      type: 'messages',
      unlocked: false,
      emoji: '👋',
      reward: 'Unlocked personalized greetings'
    },
    {
      id: 'chatty',
      name: 'Getting Chatty',
      description: 'Sent 50 messages',
      requirement: 50,
      type: 'messages',
      unlocked: false,
      emoji: '💬'
    },
    {
      id: 'best_friends',
      name: 'Best Friends',
      description: 'Sent 200 messages',
      requirement: 200,
      type: 'messages',
      unlocked: false,
      emoji: '🤝',
      reward: 'Unlocked deeper conversations'
    },
    {
      id: 'soulmates',
      name: 'Soulmates',
      description: 'Sent 500 messages',
      requirement: 500,
      type: 'messages',
      unlocked: false,
      emoji: '💕',
      reward: 'Unlocked romantic mode'
    },
    {
      id: 'week_together',
      name: '7 Days Together',
      description: 'Been chatting for a week',
      requirement: 7,
      type: 'days',
      unlocked: false,
      emoji: '📅'
    },
    {
      id: 'month_together',
      name: 'One Month Anniversary',
      description: 'Been together for 30 days',
      requirement: 30,
      type: 'days',
      unlocked: false,
      emoji: '🎉',
      reward: 'Special anniversary message'
    },
    {
      id: 'photo_share',
      name: 'Picture Perfect',
      description: 'Shared 10 photos',
      requirement: 10,
      type: 'images',
      unlocked: false,
      emoji: '📸'
    },
    {
      id: 'daily_ritual',
      name: 'Daily Ritual',
      description: 'Chatted for 10 consecutive days',
      requirement: 10,
      type: 'sessions',
      unlocked: false,
      emoji: '⭐',
      reward: 'Unlocked daily good morning messages'
    }
  ];

  static checkMilestones(stats: {
    messageCount: number;
    daysSinceStart: number;
    imageCount: number;
    consecutiveDays: number;
  }): Milestone[] {
    const unlocked: Milestone[] = [];

    this.milestones.forEach(milestone => {
      if (milestone.unlocked) return;

      let achieved = false;
      switch (milestone.type) {
        case 'messages':
          achieved = stats.messageCount >= milestone.requirement;
          break;
        case 'days':
          achieved = stats.daysSinceStart >= milestone.requirement;
          break;
        case 'images':
          achieved = stats.imageCount >= milestone.requirement;
          break;
        case 'sessions':
          achieved = stats.consecutiveDays >= milestone.requirement;
          break;
      }

      if (achieved) {
        milestone.unlocked = true;
        unlocked.push(milestone);
      }
    });

    return unlocked;
  }

  static getAllMilestones(): Milestone[] {
    return this.milestones;
  }

  static getProgress(type: Milestone['type'], current: number): {
    current: number;
    next: Milestone | null;
    percentage: number;
  } {
    const nextMilestone = this.milestones
      .filter(m => m.type === type && !m.unlocked)
      .sort((a, b) => a.requirement - b.requirement)[0];

    return {
      current,
      next: nextMilestone || null,
      percentage: nextMilestone 
        ? Math.min((current / nextMilestone.requirement) * 100, 100)
        : 100
    };
  }
}
