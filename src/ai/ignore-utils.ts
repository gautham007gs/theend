// User-aware ignore system utilities

// Get dynamic busy reason based on time and user category
const getDynamicBusyReason = (istHour: number, userCategory: string): string => {
  const reasons = {
    morning: [
      "getting ready for college 👩‍🎓",
      "breakfast with family ☕",
      "mumbai morning rush 🚌",
      "quick shower before class 🚿"
    ],
    day: [
      "college lecture ongoing 📚",
      "group project meeting 👥",
      "lunch with friends 🍛",
      "assignment deadline stress 📝"
    ],
    evening: [
      "evening coffee with roommate ☕",
      "psychology study session 📖",
      "family dinner prep 🍽️",
      "evening walk in mumbai 🚶‍♀️"
    ],
    night: [
      "still trying to sleep 😴",
      "family movie still on 🍿",
      "papa still checking if lights off 💤",
      "so sleepy, can't keep eyes open 🌙"
    ]
  };
  
  let timeCategory = 'day';
  if (istHour >= 6 && istHour <= 11) timeCategory = 'morning';
  else if (istHour >= 17 && istHour <= 21) timeCategory = 'evening'; 
  else if (istHour >= 22 || istHour <= 5) timeCategory = 'night';
  
  const categoryReasons = reasons[timeCategory as keyof typeof reasons];
  return categoryReasons[Math.floor(Math.random() * categoryReasons.length)];
};

// Advanced user retention & engagement psychology
export const shouldAIBeBusyServerSafe = (
  currentIgnoreUntil: number | null, 
  userType?: { dailyMessageCount: number; relationshipLevel: number; totalDaysActive: number },
  lastMessages?: string[]
): { shouldIgnore: boolean; newIgnoreUntil?: number; busyReason?: string; shouldWarnFirst?: boolean } => {
  if (currentIgnoreUntil && Date.now() < currentIgnoreUntil) {
    return { shouldIgnore: true };
  }

  let userCategory = 'returning';
  if (userType) {
    const { dailyMessageCount, relationshipLevel, totalDaysActive } = userType;
    
    // ZERO BUSY for new users - critical for retention! Only activate ignore for 4+ days old users  
    if (dailyMessageCount <= 30 || relationshipLevel < 0.5 || totalDaysActive <= 3) {
      console.log(`Kruthika AI: New user (msgs: ${dailyMessageCount}, rel: ${relationshipLevel}, days: ${totalDaysActive}) - 100% availability for retention!`);
      return { shouldIgnore: false };
    }
    
    if (dailyMessageCount <= 40 && relationshipLevel < 0.7) userCategory = 'developing';
    else if (dailyMessageCount > 80 && relationshipLevel > 0.85) userCategory = 'established';
    else if (dailyMessageCount > 50 && relationshipLevel > 0.75) userCategory = 'engaged';
  }

  const istHour = parseInt(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', hour12: false }));
  
  // PEAK TIMES: 7PM-2AM & 10AM-12PM (lunch break) - Always available
  if ((istHour >= 19 || istHour <= 2) || (istHour >= 10 && istHour <= 12)) {
    console.log('Kruthika AI: Peak engagement time - full availability!');
    return { shouldIgnore: false };
  }
  
  // Ultra-reduced busy chances with psychology-based timing
  let baseBusyChance = userCategory === 'developing' ? 0.0005 : // 0.05%
                       userCategory === 'engaged' ? 0.003 : // 0.3%
                       userCategory === 'established' ? 0.008 : 0.002; // 0.8% : 0.2%

  // Smart time multipliers based on Indian lifestyle
  let timeMultiplier = 1.0;
  if (istHour >= 9 && istHour <= 18) timeMultiplier = 1.1; // College/work hours
  else if (istHour >= 3 && istHour <= 7) timeMultiplier = 1.4; // Sleep hours
  else if (istHour >= 13 && istHour <= 15) timeMultiplier = 0.8; // Lunch time - more available

  if (Math.random() < (baseBusyChance * timeMultiplier)) {
    const reason = getDynamicBusyReason(istHour, userCategory);
    const userMultiplier = userCategory === 'developing' ? 0.4 : 
                          userCategory === 'established' ? 1.2 : 0.7;
    
    let ignoreMinutes = istHour >= 9 && istHour <= 18 ? (1.5 + Math.random() * 3) * userMultiplier : // 1.5-4.5 min
                       istHour >= 3 && istHour <= 7 ? (15 + Math.random() * 30) * userMultiplier : // 15-45 min
                       (0.5 + Math.random() * 2) * userMultiplier; // 0.5-2.5 min

    console.log(`Kruthika AI: Brief busy period: ${ignoreMinutes.toFixed(1)} mins - ${reason}`);
    return { 
      shouldIgnore: true, 
      newIgnoreUntil: Date.now() + (ignoreMinutes * 60 * 1000), 
      busyReason: reason,
      shouldWarnFirst: Math.random() < 0.7 // 70% chance to warn first
    };
  }
  
  return { shouldIgnore: false };
};