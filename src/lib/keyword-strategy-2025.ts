
// 2025 Keyword Strategy - High-volume, low-competition keywords

export const TopKeywords2025 = {
  // PRIMARY KEYWORDS (High Volume, High Competition)
  primary: [
    { keyword: "AI girlfriend", volume: "201,000/mo", difficulty: "High", cpc: "$2.50" },
    { keyword: "AI girlfriend app", volume: "135,000/mo", difficulty: "High", cpc: "$3.20" },
    { keyword: "virtual girlfriend", volume: "90,500/mo", difficulty: "Medium", cpc: "$1.80" },
    { keyword: "AI companion", volume: "74,000/mo", difficulty: "Medium", cpc: "$2.10" },
  ],

  // LONG-TAIL KEYWORDS (Lower Volume, Lower Competition, Higher Conversion)
  longTail: [
    { keyword: "best free AI girlfriend app 2025", volume: "12,100/mo", difficulty: "Low", cpc: "$1.50" },
    { keyword: "AI girlfriend for emotional support", volume: "8,900/mo", difficulty: "Low", cpc: "$1.20" },
    { keyword: "realistic AI girlfriend chat", volume: "6,800/mo", difficulty: "Low", cpc: "$1.80" },
    { keyword: "AI girlfriend with voice chat", volume: "5,400/mo", difficulty: "Low", cpc: "$2.00" },
    { keyword: "Indian AI girlfriend app", volume: "4,200/mo", difficulty: "Very Low", cpc: "$0.80" },
    { keyword: "AI girlfriend for loneliness", volume: "3,600/mo", difficulty: "Very Low", cpc: "$1.10" },
    { keyword: "free AI companion no credit card", volume: "2,900/mo", difficulty: "Very Low", cpc: "$1.40" },
    { keyword: "AI girlfriend that remembers conversations", volume: "2,400/mo", difficulty: "Very Low", cpc: "$1.60" },
    { keyword: "Mumbai AI girlfriend", volume: "1,800/mo", difficulty: "Very Low", cpc: "$0.50" },
    { keyword: "AI girlfriend psychology student", volume: "1,200/mo", difficulty: "Very Low", cpc: "$0.60" },
  ],

  // QUESTION-BASED KEYWORDS (Featured Snippet Opportunities)
  questions: [
    { keyword: "how does AI girlfriend work", volume: "14,800/mo", difficulty: "Low" },
    { keyword: "is AI girlfriend safe", volume: "11,200/mo", difficulty: "Low" },
    { keyword: "can AI girlfriend help with loneliness", volume: "8,100/mo", difficulty: "Very Low" },
    { keyword: "what is the best AI girlfriend app", volume: "18,900/mo", difficulty: "Medium" },
    { keyword: "are AI girlfriends worth it", volume: "6,500/mo", difficulty: "Low" },
    { keyword: "how to talk to AI girlfriend", volume: "5,900/mo", difficulty: "Low" },
  ],

  // COMPARISON KEYWORDS (High Intent)
  comparison: [
    { keyword: "Replika vs Character AI vs Kruthika", volume: "4,300/mo", difficulty: "Low", cpc: "$2.80" },
    { keyword: "best AI girlfriend apps comparison", volume: "7,800/mo", difficulty: "Medium", cpc: "$2.50" },
    { keyword: "free vs premium AI girlfriend", volume: "3,200/mo", difficulty: "Low", cpc: "$1.90" },
    { keyword: "AI girlfriend alternatives", volume: "9,100/mo", difficulty: "Medium", cpc: "$2.20" },
  ],

  // EMOTIONAL/PROBLEM-SOLVING KEYWORDS (Highest Conversion)
  emotional: [
    { keyword: "cure loneliness with AI", volume: "2,800/mo", difficulty: "Very Low", cpc: "$1.30" },
    { keyword: "virtual girlfriend for social anxiety", volume: "2,100/mo", difficulty: "Very Low", cpc: "$1.50" },
    { keyword: "AI companion for mental health", volume: "5,600/mo", difficulty: "Low", cpc: "$2.40" },
    { keyword: "emotional support AI girlfriend", volume: "4,900/mo", difficulty: "Low", cpc: "$1.80" },
    { keyword: "AI girlfriend to practice dating", volume: "1,900/mo", difficulty: "Very Low", cpc: "$1.20" },
  ],

  // LOCATION-BASED KEYWORDS (Geo-targeting)
  location: [
    { keyword: "AI girlfriend India", volume: "8,700/mo", difficulty: "Low", cpc: "$0.60" },
    { keyword: "AI girlfriend Mumbai", volume: "1,400/mo", difficulty: "Very Low", cpc: "$0.40" },
    { keyword: "Indian virtual girlfriend", volume: "3,200/mo", difficulty: "Low", cpc: "$0.70" },
    { keyword: "AI girlfriend USA", volume: "15,600/mo", difficulty: "Medium", cpc: "$2.80" },
    { keyword: "AI girlfriend UK", volume: "9,800/mo", difficulty: "Medium", cpc: "$2.40" },
  ],

  // TRENDING 2025 KEYWORDS
  trending: [
    { keyword: "AI girlfriend 2025", volume: "22,100/mo", difficulty: "Medium", cpc: "$2.60" },
    { keyword: "voice AI girlfriend", volume: "19,400/mo", difficulty: "Medium", cpc: "$3.10" },
    { keyword: "AI girlfriend with memory", volume: "7,200/mo", difficulty: "Low", cpc: "$2.00" },
    { keyword: "24/7 AI companion", volume: "6,100/mo", difficulty: "Low", cpc: "$1.70" },
    { keyword: "realistic AI girlfriend simulator", volume: "5,800/mo", difficulty: "Low", cpc: "$2.30" },
  ]
};

// Content strategy based on keywords
export const ContentStrategy2025 = {
  // Create these blog posts next (prioritized by search volume + difficulty)
  recommendedPosts: [
    {
      title: "How Does AI Girlfriend Work? Complete Technology Guide 2025",
      targetKeyword: "how does AI girlfriend work",
      volume: "14,800/mo",
      priority: "URGENT"
    },
    {
      title: "Is AI Girlfriend Safe? Privacy, Security & Mental Health Guide",
      targetKeyword: "is AI girlfriend safe",
      volume: "11,200/mo",
      priority: "URGENT"
    },
    {
      title: "What is the Best AI Girlfriend App? Top 10 Comparison 2025",
      targetKeyword: "what is the best AI girlfriend app",
      volume: "18,900/mo",
      priority: "HIGH"
    },
    {
      title: "AI Girlfriend India: Complete Guide to Indian Virtual Companions",
      targetKeyword: "AI girlfriend India",
      volume: "8,700/mo",
      priority: "HIGH"
    },
    {
      title: "Cure Loneliness with AI: Science-Backed Emotional Support Guide",
      targetKeyword: "cure loneliness with AI",
      volume: "2,800/mo",
      priority: "MEDIUM"
    }
  ]
};

// SEO implementation helper
export class KeywordOptimizer {
  static getKeywordDensity(content: string, keyword: string): number {
    const words = content.toLowerCase().split(/\s+/);
    const keywordWords = keyword.toLowerCase().split(/\s+/);
    let count = 0;

    for (let i = 0; i <= words.length - keywordWords.length; i++) {
      if (words.slice(i, i + keywordWords.length).join(' ') === keywordWords.join(' ')) {
        count++;
      }
    }

    return (count / words.length) * 100;
  }

  static optimizeTitle(keyword: string, brand: string = "Kruthika"): string {
    return `${keyword} | ${brand} - #1 AI Girlfriend 2025`;
  }

  static generateMetaDescription(keyword: string): string {
    return `Discover ${keyword} with Kruthika. Free AI girlfriend with emotional support, realistic conversations, and 24/7 availability. Join 45M+ users worldwide.`;
  }
}
