
'use server';

export interface CallSimulation {
  shouldAllowCall: boolean;
  callResponse?: string;
  callDuration?: number; // in seconds
}

export function handleCallRequest(
  relationshipLevel: number,
  timeOfDay: string,
  recentInteractions: string[]
): CallSimulation {
  // Only allow calls for close relationships
  if (relationshipLevel < 0.7) {
    return {
      shouldAllowCall: false,
      callResponse: "arre not ready for calls yet yaar 😅 let's chat more first"
    };
  }

  // Time-based availability
  const hour = new Date().getHours();
  if (hour >= 22 || hour < 7) {
    return {
      shouldAllowCall: false,
      callResponse: "so late yaar! family will hear me 🙈 text karte hain"
    };
  }

  if (hour >= 11 && hour < 16) {
    return {
      shouldAllowCall: false,
      callResponse: "college hai yaar! can't take calls 📚 talk later?"
    };
  }

  // Random acceptance for established relationships
  if (Math.random() < 0.3) {
    return {
      shouldAllowCall: true,
      callResponse: "ok ok! calling you now 📞",
      callDuration: Math.floor(Math.random() * 180) + 120 // 2-5 min
    };
  }

  return {
    shouldAllowCall: false,
    callResponse: "shy ho rahi hu yaar 🙈 thoda aur baat karte hain pehle"
  };
}

console.log('Calling simulation system loaded');
