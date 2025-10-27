
// Emoji Reaction System
export interface EmojiReaction {
  emoji: string;
  label: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export class EmojiReactionSystem {
  private static reactions: EmojiReaction[] = [
    { emoji: '❤️', label: 'Love', sentiment: 'positive' },
    { emoji: '😊', label: 'Happy', sentiment: 'positive' },
    { emoji: '😂', label: 'Funny', sentiment: 'positive' },
    { emoji: '🔥', label: 'Hot', sentiment: 'positive' },
    { emoji: '👍', label: 'Like', sentiment: 'positive' },
    { emoji: '😍', label: 'Adore', sentiment: 'positive' },
    { emoji: '💯', label: 'Perfect', sentiment: 'positive' },
    { emoji: '🤔', label: 'Thinking', sentiment: 'neutral' },
    { emoji: '😢', label: 'Sad', sentiment: 'negative' },
    { emoji: '😘', label: 'Kiss', sentiment: 'positive' },
    { emoji: '🥰', label: 'Loving', sentiment: 'positive' },
    { emoji: '✨', label: 'Sparkle', sentiment: 'positive' }
  ];

  static getQuickReactions(): EmojiReaction[] {
    return this.reactions.slice(0, 6);
  }

  static getAllReactions(): EmojiReaction[] {
    return this.reactions;
  }

  static reactToMessage(messageId: string, emoji: string): void {
    const reactions = this.getMessageReactions(messageId);
    reactions[emoji] = (reactions[emoji] || 0) + 1;
    localStorage.setItem(`reactions_${messageId}`, JSON.stringify(reactions));
  }

  static getMessageReactions(messageId: string): Record<string, number> {
    const stored = localStorage.getItem(`reactions_${messageId}`);
    return stored ? JSON.parse(stored) : {};
  }
}
