// ============================================================================
// DYNAMIC BUSY BEHAVIORS - Enhanced Contextual AI Responses
// Present-tense, chat-flow-aware, language-appropriate busy reasons
// ============================================================================

export interface ContextualBusyInput {
  recentMessages: string[];
  userLanguage: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  chatTone: 'flirty' | 'casual' | 'serious' | 'playful';
  relationshipLevel: number; // 0-1, how close they are
}

export interface BusyResponse {
  shouldGoBusy: boolean;
  presentTenseReason?: string;
  warningMessage?: string; // Message to send before going busy
  busyDuration: number; // in minutes
}

// Detect user's primary language from recent chat
export function detectChatLanguage(recentMessages: string[]): string {
  // Language detection removed - now relying on Gemini's built-in language detection
  return 'auto';
}

// Get contextual busy reason based on chat flow and current context
export function getContextualBusyReason(input: ContextualBusyInput): BusyResponse {
  const { recentMessages, userLanguage, timeOfDay, chatTone, relationshipLevel } = input;
  
  // Analyze recent chat context
  const lastMessage = recentMessages[recentMessages.length - 1]?.toLowerCase() || '';
  const recentText = recentMessages.slice(-3).join(' ').toLowerCase();
  
  // Check if user is being romantic/flirty and AI needs to cool down
  const isRomanticContext = /\b(love|pyaar|mine|baby|darling|beautiful|cute|hot|kiss|hug|marry|girlfriend|boyfriend|feelings|heart|dil)\b/.test(recentText);
  
  // Check if user asked for pics/media
  const askedForPic = /\b(pic|photo|image|selfie|bhejo|send|dikha|show|dekhna|dekh)\b/.test(recentText);
  
  // Check if conversation is getting repetitive  
  const isRepetitive = recentMessages.slice(-3).some(msg => 
    recentMessages.slice(-3).filter(m => m.toLowerCase().includes(msg.toLowerCase().substring(0, 10))).length > 1
  );

  // Time-based realistic activities
  const getTimeBasedActivity = (): string => {
    const now = new Date();
    const istHour = parseInt(now.toLocaleString('en-US', { 
      timeZone: 'Asia/Kolkata', 
      hour: '2-digit', 
      hour12: false 
    }));
    const dayOfWeek = now.getDay();
    
    // Weekend vs weekday activities
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      if (istHour >= 9 && istHour <= 11) return 'getting_ready';
      if (istHour >= 12 && istHour <= 15) return 'out_shopping';  
      if (istHour >= 16 && istHour <= 18) return 'with_friends';
      if (istHour >= 19 && istHour <= 21) return 'family_time';
    } else {
      if (istHour >= 8 && istHour <= 10) return 'college_travel';
      if (istHour >= 11 && istHour <= 13) return 'in_lecture';
      if (istHour >= 14 && istHour <= 16) return 'college_break';
      if (istHour >= 17 && istHour <= 19) return 'traveling_home';
      if (istHour >= 20 && istHour <= 22) return 'family_dinner';
    }
    
    return 'general_busy';
  };

  const activity = getTimeBasedActivity();
  
  // Language-specific present-tense warning messages
  const getWarningMessage = (reason: string): string => {
    const warnings = {
      hindi: {
        getting_ready: "arre wait yaar, ready ho rahi hun",
        college_travel: "mumbai local mein hun, signal weak hai",
        in_lecture: "psychology class chal rahi hai, prof dekh raha",
        family_time: "mummy calling kar rahi, 2 min",
        with_friends: "friends ke saath hun, baad mein baat krte",
        too_romantic: "arre yaar slow down, friendship hai na",
        pic_request: "pics nahi share karti online yaar",
        repetitive: "same questions mat puch yaar"
      },
      kannada: {
        getting_ready: "wait madi guru, ready agtha idini",
        college_travel: "bus alli idini, signal swalpa weak",
        in_lecture: "class naditha ide, sir nodthare",
        family_time: "amma kartha idare, 2 minute",
        with_friends: "friends jote idini, nachhe mathadona",
        too_romantic: "slow madi, friendship ge limit beku",
        pic_request: "photos share madalla online alli",
        repetitive: "same questions kelbeda guru"
      },
      english: {
        getting_ready: "wait babe, getting ready rn",
        college_travel: "in mumbai local, signal weak",
        in_lecture: "psychology lecture going on",
        family_time: "mummy calling me, 2 mins",
        with_friends: "with friends rn, talk later",
        too_romantic: "slow down yaar, we're just friends",
        pic_request: "don't share pics online yaar",
        repetitive: "stop asking same things na"
      }
    };
    
    const langWarnings = warnings[userLanguage] || warnings.english;
    return langWarnings[reason] || langWarnings.getting_ready;
  };

  // Determine if should go busy based on context
  let shouldGoBusy = false;
  let warningReason = '';
  let busyDuration = 2; // Default 2 minutes

  if (isRomanticContext && relationshipLevel < 0.7) {
    shouldGoBusy = Math.random() < 0.4; // 40% chance
    warningReason = 'too_romantic';
    busyDuration = 3;
  } else if (askedForPic) {
    shouldGoBusy = Math.random() < 0.6; // 60% chance for pic requests
    warningReason = 'pic_request';
    busyDuration = 2;
  } else if (isRepetitive) {
    shouldGoBusy = Math.random() < 0.3; // 30% chance
    warningReason = 'repetitive';  
    busyDuration = 1;
  } else {
    // Regular time-based busy behavior (much reduced from original)
    const busyChance = relationshipLevel > 0.8 ? 0.02 : 0.05; // 2-5% chance
    shouldGoBusy = Math.random() < busyChance;
    warningReason = activity;
    busyDuration = Math.random() < 0.5 ? 1 : 2; // 1-2 minutes
  }

  if (shouldGoBusy) {
    return {
      shouldGoBusy: true,
      warningMessage: getWarningMessage(warningReason),
      presentTenseReason: warningReason,
      busyDuration
    };
  }

  return {
    shouldGoBusy: false,
    busyDuration: 0
  };
}

// Enhanced comeback messages after being busy
export function getComebackMessage(
  busyReason: string, 
  language: string, 
  wasAwayMinutes: number
): string {
  const comebacks = {
    hindi: {
      getting_ready: "back! finally ready ho gayi",
      college_travel: "phew! mumbai local se nikal gayi",
      in_lecture: "class over! prof kitna bore kar raha tha",
      family_time: "arre mummy ne bahut baat ki",
      with_friends: "back! friends ke saath bahut fun tha",
      too_romantic: "ok ok, normal baat karte hain na",
      pic_request: "anyway, pics ki baat chod.. kya kar rahe ho?",
      repetitive: "chalo kuch naya baat karte hain",
      general_busy: "sorry yaar, thoda busy thi"
    },
    kannada: {
      getting_ready: "back! ready aayithu finally",
      college_travel: "bus nalli signal illa tha guru",  
      in_lecture: "class mugisithu! boring aayithu",
      family_time: "amma jote bhojan madidini",
      with_friends: "friends jote entertainment aayithu",
      too_romantic: "sari sari, normal agi mathadona",
      pic_request: "photos bidi.. enu madthaidiya?",
      repetitive: "hosa vishaya mathadona guru",
      general_busy: "sorry maga, kelsa itthu"
    },
    english: {
      getting_ready: "back! finally ready lol",
      college_travel: "escaped mumbai local traffic",
      in_lecture: "class over! prof was so boring",
      family_time: "mummy had long chat with me",
      with_friends: "back! had fun with friends",
      too_romantic: "ok let's just chat normally na",
      pic_request: "forget pics yaar.. what u doing?",
      repetitive: "let's talk about something new",
      general_busy: "sorry was bit busy"
    }
  };

  const langComebacks = comebacks[language] || comebacks.english;
  return langComebacks[busyReason] || langComebacks.general_busy;
}

console.log('Dynamic Busy Behaviors: Context-aware, present-tense system loaded');