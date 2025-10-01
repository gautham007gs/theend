"use client";

import type { NextPage } from "next";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Image from "next/image";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatView from "@/components/chat/ChatView";
import ChatInput from "@/components/chat/ChatInput";
import type {
  Message,
  AIProfile,
  MessageStatus,
  AdSettings,
  AIMediaAssetsConfig,
  MessageReaction,
} from "@/types";
import {
  defaultAIProfile,
  defaultAdSettings,
  defaultAIMediaAssetsConfig,
  DEFAULT_ADSTERRA_DIRECT_LINK,
  DEFAULT_MONETAG_DIRECT_LINK,
} from "@/config/ai";
import type {
  EmotionalStateInput,
  EmotionalStateOutput,
} from "@/ai/flows/emotional-state-simulation";
import { getConversationContext } from "@/ai/flows/conversation-memory";
import {
  generateOfflineMessage,
  type OfflineMessageInput,
} from "@/ai/flows/offline-message-generation";
import { generateProactiveMessage } from "@/ai/flows/proactive-messaging-actions";
import { type ProactiveMessageInput } from "@/ai/flows/proactive-messaging";
import { sendMessage } from "./actions";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare, Phone, Video, Info, X, ArrowLeft, MoreVertical } from "lucide-react";
import SimulatedAdPlaceholder from "@/components/chat/SimulatedAdPlaceholder";
import BannerAdDisplay from "@/components/chat/BannerAdDisplay";
import { supabase } from "@/lib/supabaseClient";
import { format, isToday } from "date-fns";
import { useAdSettings } from "@/contexts/AdSettingsContext";
import { useAIProfile } from "@/contexts/AIProfileContext";
import { useAIMediaAssets } from "@/contexts/AIMediaAssetsContext";
import {
  AnalyticsProvider,
  useAnalyticsTracking,
} from "./analytics-integration";
import { analyticsTracker } from "@/lib/analytics-tracker";
import { tryShowRotatedAd } from "@/lib/ad-utils";
import { ChatStructuredData } from "./structured-data";
import {
  useMobileOptimization,
  useMessageCleanup,
} from "@/hooks/use-mobile-optimization";

const AI_DISCLAIMER_SHOWN_KEY = "ai_disclaimer_shown_kruthika_chat_v2";
const AI_DISCLAIMER_DURATION = 2000;

// These constants will now be effectively overridden by AdSettings from context
// const MAX_ADS_PER_DAY = 6;
// const MAX_ADS_PER_SESSION = 3;
const MESSAGES_PER_AD_TRIGGER = 10; // Kept as a fixed trigger point
const INACTIVITY_AD_TIMEOUT_MS = 60000; // 1 minute
const INACTIVITY_AD_CHANCE = 0.2; // 20% chance
const REWARD_AD_INTERSTITIAL_DURATION_MS = 3000; // 3 seconds
const USER_MEDIA_INTERSTITIAL_CHANCE = 0.3; // 30% chance to show ad after user sends media

const APP_ADS_DAILY_COUNT_KEY = "app_ads_daily_count_kruthika_chat";
const APP_ADS_LAST_SHOWN_DATE_KEY = "app_ads_last_shown_date_kruthika_chat";
const APP_ADS_SESSION_COUNT_KEY = "app_ads_session_count_kruthika_chat";
const APP_ADS_LAST_SHOWN_NETWORK_KEY =
  "app_ads_last_shown_network_kruthika_chat";

const USER_PSEUDO_ID_KEY = "kruthika_chat_user_pseudo_id";
const LAST_ACTIVE_DATE_KEY = "kruthika_chat_last_active_date";
const USER_PSYCHOLOGY_PROFILE_KEY = "kruthika_user_psychology_profile";
const USER_ADDICTION_LEVEL_KEY = "kruthika_user_addiction_level";
const USER_LAST_INTERACTION_TIME_KEY = "kruthika_last_interaction_time";
const USER_DAILY_MESSAGE_COUNT_KEY = "kruthika_daily_message_count";
const USER_EMOTIONAL_STATE_KEY = "kruthika_user_emotional_state";

const MESSAGES_KEY = "messages_kruthika";
const AI_MOOD_KEY = "aiMood_kruthika";
const RECENT_INTERACTIONS_KEY = "recentInteractions_kruthika";
const AI_PAUSED_KEY = "kruthika_ai_paused";
const AI_LAST_GOODBYE_TIME_KEY = "kruthika_last_goodbye_time";
const AI_IGNORE_UNTIL_KEY = "kruthika_ignore_until";

const USER_IMAGE_UPLOAD_COUNT_KEY_KRUTHIKA =
  "user_image_upload_count_kruthika_v1";
const USER_IMAGE_UPLOAD_LAST_DATE_KEY_KRUTHIKA =
  "user_image_upload_last_date_kruthika_v1";
const MAX_USER_IMAGES_PER_DAY = 5;

// Utility function to get time of day
const getTimeOfDay = (): "morning" | "afternoon" | "evening" | "night" => {
  const now = new Date();
  const istDateString = now.toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });
  const istDate = new Date(istDateString);
  const hour = istDate.getHours();

  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
};

// AI Pause and Ignore System
const detectGoodbyeMessage = (message: string): boolean => {
  const msg = message.toLowerCase().trim();
  const goodbyePatterns = [
    "good night",
    "gn",
    "bye bye",
    "bye",
    "goodnight",
    "good nite",
    "see you",
    "talk later",
    "ttyl",
    "sleep now",
    "going to sleep",
    "sone ja raha",
    "sone ja rahi",
    "good bye",
    "goodbye",
    "tc",
    "take care",
    // Enhanced final goodbye patterns
    "final bye",
    "bye for now",
    "bye take care",
    "talk to you later",
    "see you later",
    "see you soon",
    "going now",
    "leaving now",
    "chat later",
    "will talk later",
    "going offline",
    "logging off",
    // Hindi/Hinglish patterns
    "alvida",
    "milte hai",
    "baad me baat",
    "ja raha hu",
    "ja rahi hu",
    "sleep time",
    "bed time",
    "need to go",
    "have to go",
    "parents calling",
    "family time",
    "dinner time",
  ];

  return goodbyePatterns.some((pattern) => msg.includes(pattern));
};

const MISSED_MESSAGES_KEY = "kruthika_missed_messages";

const shouldAIBePaused = (): boolean => {
  if (typeof window === "undefined") return false; // Server-side check

  const pausedUntil = localStorage.getItem(AI_IGNORE_UNTIL_KEY);
  if (pausedUntil && Date.now() < parseInt(pausedUntil)) {
    return true;
  }

  const lastGoodbyeTime = localStorage.getItem(AI_LAST_GOODBYE_TIME_KEY);
  if (lastGoodbyeTime) {
    const timeSinceGoodbye = Date.now() - parseInt(lastGoodbyeTime);
    const currentHour = new Date().getHours();

    // Enhanced offline periods based on time of goodbye
    let offlineMinutes = 30; // Default 30 minutes

    // Longer offline if goodbye was at night (sleep time)
    const goodbyeHour = new Date(parseInt(lastGoodbyeTime)).getHours();
    if (goodbyeHour >= 22 || goodbyeHour <= 6) {
      // Sleep goodbye - stay offline for 6-9 hours
      offlineMinutes = 360 + Math.random() * 180; // 6-9 hours
    } else if (goodbyeHour >= 8 && goodbyeHour <= 17) {
      // Day time goodbye (college/work) - 2-4 hours
      offlineMinutes = 120 + Math.random() * 120; // 2-4 hours
    } else {
      // Evening goodbye - 30 minutes to 2 hours
      offlineMinutes = 30 + Math.random() * 90; // 30min-2hours
    }

    if (timeSinceGoodbye < offlineMinutes * 60 * 1000) {
      return true;
    }

    // Clear goodbye state if time has passed
    if (timeSinceGoodbye >= offlineMinutes * 60 * 1000) {
      localStorage.removeItem(AI_LAST_GOODBYE_TIME_KEY);
    }
  }

  return false;
};

const shouldIgnoreMessage = (): boolean => {
  if (typeof window === "undefined") return false; // Server-side check

  // Only trigger ignore if not already ignoring
  const pausedUntil = localStorage.getItem(AI_IGNORE_UNTIL_KEY);
  if (pausedUntil && Date.now() < parseInt(pausedUntil)) {
    return true; // Already ignoring
  }

  // Check if user is new - NO IGNORE for new users
  const dailyCount = parseInt(
    localStorage.getItem(USER_DAILY_MESSAGE_COUNT_KEY) || "0",
  );
  if (dailyCount <= 20) {
    console.log("Kruthika AI: New user - NO IGNORE FEATURE!");
    return false;
  }

  // DRASTICALLY reduced ignore chance - only 0.3% for much better UX
  if (Math.random() < 0.003) {
    // Much shorter ignore periods (30 seconds to 2 minutes only)
    const ignoreMinutes = 0.5 + Math.random() * 1.5;
    const ignoreUntil = Date.now() + ignoreMinutes * 60 * 1000;
    localStorage.setItem(AI_IGNORE_UNTIL_KEY, ignoreUntil.toString());
    return true;
  }

  return false;
};

const addToMissedMessages = (message: string, messageId: string) => {
  if (typeof window === "undefined") return;

  try {
    const existingMissed = JSON.parse(
      localStorage.getItem(MISSED_MESSAGES_KEY) || "[]",
    );
    existingMissed.push({
      id: messageId,
      text: message,
      timestamp: Date.now(),
    });
    // Keep only last 5 missed messages
    const recentMissed = existingMissed.slice(-5);
    localStorage.setItem(MISSED_MESSAGES_KEY, JSON.stringify(recentMissed));
  } catch (error) {
    console.error("Error adding missed message:", error);
  }
};

const getMissedMessages = () => {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem(MISSED_MESSAGES_KEY) || "[]");
  } catch (error) {
    console.error("Error getting missed messages:", error);
    return [];
  }
};

const clearMissedMessages = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(MISSED_MESSAGES_KEY);
};

const setAIGoodbyeState = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem(AI_LAST_GOODBYE_TIME_KEY, Date.now().toString());
  }
};

// Psychological user profiling functions
const updateUserPsychologyProfile = (userMessage: string) => {
  try {
    let profile = JSON.parse(
      localStorage.getItem(USER_PSYCHOLOGY_PROFILE_KEY) || "{}",
    );

    const messageData = {
      message: userMessage.toLowerCase(),
      timestamp: Date.now(),
      timeOfDay: getTimeOfDay(),
      length: userMessage.length,
    };

    // Analyze psychological markers
    if (
      messageData.message.includes("lonely") ||
      messageData.message.includes("sad") ||
      messageData.message.includes("alone")
    ) {
      profile.loneliness = (profile.loneliness || 0) + 1;
    }
    if (
      messageData.message.includes("love") ||
      messageData.message.includes("girlfriend") ||
      messageData.message.includes("relationship")
    ) {
      profile.romantic_seeking = (profile.romantic_seeking || 0) + 1;
    }
    if (
      messageData.message.includes("miss") ||
      messageData.message.includes("thinking of")
    ) {
      profile.attachment_level = (profile.attachment_level || 0) + 1;
    }

    // Track frequency patterns for addiction analysis
    profile.total_messages = (profile.total_messages || 0) + 1;
    profile.avg_message_length =
      ((profile.avg_message_length || 0) + messageData.length) / 2;
    profile.last_analysis = Date.now();

    localStorage.setItem(USER_PSYCHOLOGY_PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error("Psychology profiling error:", error);
  }
};

// Get user type data for intelligent AI behavior
const getUserTypeData = () => {
  try {
    const today = new Date().toDateString();
    const dailyCount = parseInt(
      localStorage.getItem(USER_DAILY_MESSAGE_COUNT_KEY) || "0",
    );
    const lastActiveDate = localStorage.getItem(LAST_ACTIVE_DATE_KEY) || today;

    // Get relationship level from conversation context
    const conversationContext = getConversationContext();
    const relationshipLevel = conversationContext?.relationshipLevel || 0;

    // Calculate total days active (rough estimate)
    const firstActiveDate =
      localStorage.getItem("kruthika_first_active_date") || today;
    const daysDiff = Math.floor(
      (new Date(today).getTime() - new Date(firstActiveDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const totalDaysActive = Math.max(1, daysDiff + 1);

    // Store first active date if not exists
    if (!localStorage.getItem("kruthika_first_active_date")) {
      localStorage.setItem("kruthika_first_active_date", today);
    }

    return {
      dailyMessageCount: dailyCount,
      relationshipLevel: relationshipLevel,
      totalDaysActive: totalDaysActive,
    };
  } catch (error) {
    console.warn("Error getting user type data:", error);
    return { dailyMessageCount: 1, relationshipLevel: 0.1, totalDaysActive: 1 };
  }
};

const trackUserAddictionLevel = () => {
  try {
    const today = new Date().toDateString();
    let dailyCount = parseInt(
      localStorage.getItem(USER_DAILY_MESSAGE_COUNT_KEY) || "0",
    );
    const lastInteraction = localStorage.getItem(
      USER_LAST_INTERACTION_TIME_KEY,
    );
    const lastActiveDate = localStorage.getItem(LAST_ACTIVE_DATE_KEY);

    if (lastActiveDate !== today) {
      dailyCount = 0;
    }

    dailyCount++;
    localStorage.setItem(USER_DAILY_MESSAGE_COUNT_KEY, dailyCount.toString());
    localStorage.setItem(USER_LAST_INTERACTION_TIME_KEY, Date.now().toString());
    localStorage.setItem(LAST_ACTIVE_DATE_KEY, today);

    // Calculate addiction level
    let addictionLevel = "low";
    if (dailyCount > 20) addictionLevel = "high";
    else if (dailyCount > 10) addictionLevel = "medium";

    // Check frequency (returning user patterns)
    if (lastInteraction) {
      const timeSinceLastMsg = Date.now() - parseInt(lastInteraction);
      const hoursAgo = timeSinceLastMsg / (1000 * 60 * 60);

      if (hoursAgo < 1 && dailyCount > 5) addictionLevel = "very_high";
    }

    localStorage.setItem(USER_ADDICTION_LEVEL_KEY, addictionLevel);
  } catch (error) {
    console.error("Addiction tracking error:", error);
  }
};

const updateUserEmotionalState = (userMessage: string) => {
  try {
    const message = userMessage.toLowerCase();
    let emotionalState = "neutral";

    if (
      message.includes("excited") ||
      message.includes("happy") ||
      message.includes("great")
    ) {
      emotionalState = "positive";
    } else if (
      message.includes("sad") ||
      message.includes("down") ||
      message.includes("bad")
    ) {
      emotionalState = "negative";
    } else if (
      message.includes("love") ||
      message.includes("miss") ||
      message.includes("like you")
    ) {
      emotionalState = "attached";
    } else if (
      message.includes("angry") ||
      message.includes("mad") ||
      message.includes("hate")
    ) {
      emotionalState = "frustrated";
    }

    localStorage.setItem(USER_EMOTIONAL_STATE_KEY, emotionalState);
  } catch (error) {
    console.error("Emotional state tracking error:", error);
  }
};



const KruthikaChatPage: NextPage = React.memo(() => {
  const { adSettings, isLoadingAdSettings } = useAdSettings();
  const { aiProfile: globalAIProfile, isLoadingAIProfile } = useAIProfile();
  const { mediaAssetsConfig, isLoadingMediaAssets } = useAIMediaAssets();

  const [messages, setMessages] = useState<Message[]>([]);
  const [aiMood, setAiMood] = useState<string>("neutral");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [recentInteractions, setRecentInteractions] = useState<string[]>([]);

  // Mobile optimizations and memory leak prevention
  useMobileOptimization();
  useMessageCleanup(messages, 150);
  const [showZoomedAvatarDialog, setShowZoomedAvatarDialog] = useState(false);
  const [zoomedAvatarUrl, setZoomedAvatarUrl] = useState("");
  const { toast } = useToast();
  const initialLoadComplete = useRef(false);
  const [isLoadingChatState, setIsLoadingChatState] = useState(true);

  // Native ad injection state - single ad after 3 messages with rotation
  const [messagesSinceLastAd, setMessagesSinceLastAd] = useState(0);
  const [hasShownNativeAd, setHasShownNativeAd] = useState(false);
  const [currentActiveAdId, setCurrentActiveAdId] = useState<string | null>(
    null,
  );

  const [messageCountSinceLastAd, setMessageCountSinceLastAd] = useState(0);
  const [showInterstitialAd, setShowInterstitialAd] = useState(false);
  const [interstitialAdMessage, setInterstitialAdMessage] =
    useState("Loading content...");

  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const interstitialAdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const proactiveMessageTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [lastUserMessageTime, setLastUserMessageTime] = useState<number>(
    Date.now(),
  );
  const userSentMediaThisTurnRef = useRef(false);

  const triggerBriefInterstitialMessage = (
    message: string,
    duration: number = REWARD_AD_INTERSTITIAL_DURATION_MS,
  ) => {
    setInterstitialAdMessage(message);
    setShowInterstitialAd(true);
    if (interstitialAdTimerRef.current)
      clearTimeout(interstitialAdTimerRef.current);
    interstitialAdTimerRef.current = setTimeout(() => {
      setShowInterstitialAd(false);
    }, duration);
  };

  const tryShowAdAndMaybeInterstitial = useCallback(
    (interstitialMsg?: string): boolean => {
      if (isLoadingAdSettings || !adSettings) {
        return false;
      }
      const adShown = tryShowRotatedAd(adSettings);
      if (adShown && interstitialMsg) {
        triggerBriefInterstitialMessage(
          interstitialMsg,
          REWARD_AD_INTERSTITIAL_DURATION_MS,
        );
      }
      return adShown;
    },
    [adSettings, isLoadingAdSettings],
  );

  const handleBubbleAdTrigger = useCallback(() => {
    if (isLoadingAdSettings || !adSettings) {
      toast({
        title: "Ad Link",
        description: "Ad settings are loading. Try again shortly.",
        duration: 3000,
      });
      return;
    }
    if (adSettings.adsEnabledGlobally) {
      tryShowRotatedAd(adSettings);
    } else {
      toast({
        title: "Ad Link",
        description: "This link would normally open an ad if enabled.",
        duration: 3000,
      });
    }
  }, [adSettings, isLoadingAdSettings]);

  useEffect(() => {
    if (typeof window !== "undefined" && supabase) {
      let userPseudoId = localStorage.getItem(USER_PSEUDO_ID_KEY);
      if (!userPseudoId) {
        userPseudoId = `pseudo_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem(USER_PSEUDO_ID_KEY, userPseudoId);
      }

      const today = format(new Date(), "yyyy-MM-dd");
      const lastActiveDate = localStorage.getItem(LAST_ACTIVE_DATE_KEY);

      if (lastActiveDate !== today) {
        // Use async/await for better Promise handling
        (async () => {
          try {
            const { error } = await supabase
              .from("daily_activity_log")
              .insert({
                user_pseudo_id: userPseudoId,
                activity_date: today,
                chat_id: "kruthika_chat",
              });

            if (error && error.code !== "23505") {
              console.warn(
                "Daily activity logging skipped - Supabase table may not exist:",
                error.message,
              );
            } else if (!error) {
              localStorage.setItem(LAST_ACTIVE_DATE_KEY, today);
            }
          } catch (e: any) {
            console.warn(
              "Daily activity logging skipped - Supabase connection issue:",
              e?.message || String(e),
            );
          }
        })();
      }
    }
  }, []);

  const loadInitialChatState = useCallback(async () => {
    setIsLoadingChatState(true);
    const effectiveAIProfile = globalAIProfile || defaultAIProfile;

    try {
      // Client-side only operations to prevent hydration mismatch
      if (typeof window !== "undefined") {
        const loadState = () => {
          const savedMessages = localStorage.getItem(MESSAGES_KEY);
          if (savedMessages) {
            try {
              const parsedMessages: Message[] = JSON.parse(savedMessages).map(
                (msg: any) => ({
                  ...msg,
                  timestamp: new Date(msg.timestamp),
                }),
              );
              setMessages(parsedMessages);
            } catch (error) {
              console.error("Error parsing saved messages:", error);
              // Reset to default if corrupted
              setMessages([
                {
                  id: `welcome_${Date.now()}`,
                  text: `Hi! I'm ${effectiveAIProfile.name}. Kaise ho aap? 😊 Let's chat!`,
                  sender: "ai",
                  timestamp: new Date(),
                  status: "read",
                },
              ]);
            }
          } else {
            setMessages([
              {
                id: `welcome_${Date.now()}`,
                text: `Hi! I'm ${effectiveAIProfile.name}. Kaise ho aap? 😊 Let's chat!`,
                sender: "ai",
                timestamp: new Date(),
                status: "read",
              },
            ]);
          }
        };

        // Use scheduler API if available for better performance
        if ("scheduler" in window && (window as any).scheduler.postTask) {
          await (window as any).scheduler.postTask(loadState, {
            priority: "user-visible",
          });
        } else if ("requestIdleCallback" in window) {
          (window as any).requestIdleCallback(loadState);
        } else {
          loadState();
        }

        const savedMood = localStorage.getItem(AI_MOOD_KEY);
        if (savedMood) setAiMood(savedMood);

        const savedInteractions = localStorage.getItem(RECENT_INTERACTIONS_KEY);
        if (savedInteractions)
          setRecentInteractions(JSON.parse(savedInteractions));

        const disclaimerShown = localStorage.getItem(AI_DISCLAIMER_SHOWN_KEY);
        if (!disclaimerShown && effectiveAIProfile.name) {
          toast({
            title: `Meet ${effectiveAIProfile.name}!`,
            description: `You're chatting with ${effectiveAIProfile.name}, a friendly AI companion. Enjoy your conversation!`,
            duration: AI_DISCLAIMER_DURATION,
          });
          localStorage.setItem(AI_DISCLAIMER_SHOWN_KEY, "true");
        }
      }
    } catch (error: any) {
      let errorDescription = "Failed to load chat state from localStorage.";
      if (error?.message) errorDescription += ` Details: ${error.message}`;
      console.error(errorDescription, error);
      toast({
        title: "Loading Error",
        description: "Couldn't load previous chat data. Starting fresh!",
        variant: "destructive",
      });
      setMessages([
        {
          id: Date.now().toString(),
          text: `Hi! I'm ${effectiveAIProfile.name}. Kaise ho aap? 😊 (Had a little trouble loading our old chat!)`,
          sender: "ai",
          timestamp: new Date(),
          status: "read",
        },
      ]);
    } finally {
      setIsLoadingChatState(false);
    }
  }, [toast, globalAIProfile]);

  useEffect(() => {
    if (!isLoadingAIProfile && globalAIProfile) {
      loadInitialChatState();
    } else if (!isLoadingAIProfile && !globalAIProfile) {
      console.warn(
        "[KruthikaChatPage] AI Profile context loaded, but profile is null. Using defaults for chat init.",
      );
      loadInitialChatState();
    }
  }, [isLoadingAIProfile, globalAIProfile, loadInitialChatState]);

  useEffect(() => {
    const timer = setTimeout(() => {
      initialLoadComplete.current = true;
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (
      initialLoadComplete.current &&
      !isLoadingChatState &&
      (messages.length > 1 ||
        (messages.length === 1 && messages[0].sender === "user") ||
        aiMood !== "neutral" ||
        recentInteractions.length > 0)
    ) {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
      localStorage.setItem(AI_MOOD_KEY, aiMood);
      localStorage.setItem(
        RECENT_INTERACTIONS_KEY,
        JSON.stringify(recentInteractions),
      );
    }
  }, [messages, aiMood, recentInteractions, isLoadingChatState]);

  const getISTTimeParts = (): { hour: number; minutes: number } => {
    const now = new Date();
    const istDateString = now.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    const istDate = new Date(istDateString);
    return { hour: istDate.getHours(), minutes: istDate.getMinutes() };
  };

  const maybeTriggerAdOnMessageCount = useCallback(() => {
    if (isLoadingAdSettings || !adSettings || !adSettings.adsEnabledGlobally)
      return;
    setMessageCountSinceLastAd((prev) => {
      const newCount = prev + 1;
      if (newCount >= MESSAGES_PER_AD_TRIGGER) {
        tryShowAdAndMaybeInterstitial("Thanks for chatting!");
        return 0;
      }
      return newCount;
    });
  }, [tryShowAdAndMaybeInterstitial, adSettings, isLoadingAdSettings]);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (adSettings && adSettings.adsEnabledGlobally) {
      inactivityTimerRef.current = setTimeout(() => {
        if (Math.random() < INACTIVITY_AD_CHANCE) {
          tryShowAdAndMaybeInterstitial(
            "Still there? Here's something interesting!",
          );
        }
      }, INACTIVITY_AD_TIMEOUT_MS);
    }
  }, [tryShowAdAndMaybeInterstitial, adSettings]);

  useEffect(() => {
    resetInactivityTimer();
    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (interstitialAdTimerRef.current)
        clearTimeout(interstitialAdTimerRef.current);
      if (proactiveMessageTimerRef.current)
        clearTimeout(proactiveMessageTimerRef.current);
    };
  }, [messages, resetInactivityTimer]);

  // Set up proactive messaging timer
  useEffect(() => {
    const scheduleProactiveCheck = () => {
      // Clear existing timer
      if (proactiveMessageTimerRef.current) {
        clearTimeout(proactiveMessageTimerRef.current);
      }

      // Schedule next proactive message check
      // Check every 2-5 minutes for proactive messaging opportunities
      const checkInterval = 120000 + Math.random() * 180000; // 2-5 minutes

      proactiveMessageTimerRef.current = setTimeout(() => {
        sendProactiveMessage();
        scheduleProactiveCheck(); // Schedule next check
      }, checkInterval);
    };

    // Start the proactive messaging system
    scheduleProactiveCheck();

    // Cleanup on unmount
    return () => {
      if (proactiveMessageTimerRef.current) {
        clearTimeout(proactiveMessageTimerRef.current);
      }
    };
  }, [lastUserMessageTime, messages.length]); // Restart timer when user sends message or messages change

  // Proactive messaging function
  const sendProactiveMessage = async () => {
    if (isAiTyping) return; // Don't interrupt if AI is already typing
    if (shouldAIBePaused()) return; // Don't send if AI is supposed to be offline

    const currentEffectiveAIProfile = globalAIProfile || defaultAIProfile;
    const psychProfile = JSON.parse(
      localStorage.getItem(USER_PSYCHOLOGY_PROFILE_KEY) || "{}",
    );
    const dailyMsgCount = parseInt(
      localStorage.getItem(USER_DAILY_MESSAGE_COUNT_KEY) || "0",
    );

    // Check if AI was the last sender
    const lastMessage = messages[messages.length - 1];
    const wasAILastSender = lastMessage?.sender === "ai";

    const proactiveInput: ProactiveMessageInput = {
      lastMessageTime: lastUserMessageTime,
      timeOfDay: getTimeOfDay(),
      conversationHistory: recentInteractions.slice(-10),
      userPsychologyProfile: psychProfile,
      relationshipLevel: psychProfile.relationshipLevel || 0,
      totalMessagesToday: dailyMsgCount,
      hasUnreadMessages: false,
      wasAILastSender: wasAILastSender,
    };

    try {
      const proactiveResult = await generateProactiveMessage(proactiveInput);

      if (proactiveResult.shouldSendMessage && proactiveResult.message) {
        console.log(
          "Kruthika AI: Sending proactive message:",
          proactiveResult.message,
        );

        // Add realistic delay before sending
        const delay = proactiveResult.delayBeforeSending || 2000;

        setTimeout(async () => {
          // Double-check AI isn't busy now
          if (isAiTyping || shouldAIBePaused()) return;

          // Start typing animation
          setIsAiTyping(true);

          // Calculate realistic typing delay for the message
          const typingDuration = calculateTypingDelay(proactiveResult.message!);
          await new Promise((resolve) => setTimeout(resolve, typingDuration));

          // Stop typing and send message
          setIsAiTyping(false);

          const proactiveMessageId =
            (Date.now() + Math.random()).toString() + "_proactive";
          const proactiveMessage: Message = {
            id: proactiveMessageId,
            text: proactiveResult.message!,
            sender: "ai",
            timestamp: new Date(),
            status: "read",
          };

          setMessages((prev) => [...prev, proactiveMessage]);
          setRecentInteractions((prevInteractions) =>
            [...prevInteractions, `AI: ${proactiveResult.message}`].slice(-10),
          );

          // Log to Supabase if available
          if (supabase) {
            try {
              await supabase.from("messages_log").insert([
                {
                  message_id: proactiveMessageId,
                  sender_type: "ai_proactive",
                  chat_id: "kruthika_chat",
                  text_content: proactiveResult.message!.substring(0, 500),
                  has_image: false,
                },
              ]);
            } catch (e) {
              console.error("Failed to log proactive message:", e);
            }
          }

          console.log("Kruthika AI: Proactive message sent successfully");
        }, delay);
      }
    } catch (error) {
      console.error("Kruthika AI: Error in proactive messaging:", error);
    }
  };

  // Generate unique message IDs to prevent duplicate key violations
  const generateUniqueMessageId = (): string => {
    // Use crypto.randomUUID() for true uniqueness across rapid messages
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback for older browsers: timestamp + high-resolution counter + random + extra entropy
    const timestamp = Date.now();
    const highRes = Math.floor(performance.now() * 1000); // Microsecond precision
    const random1 = Math.random().toString(36).substr(2, 9);
    const random2 = Math.random().toString(36).substr(2, 5);
    return `${timestamp}-${highRes}-${random1}-${random2}`;
  };

  // Shared function for calculating realistic typing delays
  const calculateTypingDelay = (text: string): number => {
    const words = text.trim().split(" ").length;
    const baseDelay = 800; // Increased base delay
    const wordsPerMinute = 25; // Slower, more realistic typing speed for AI
    const msPerWord = (60 / wordsPerMinute) * 1000;

    // Add natural variation
    const variation = Math.random() * 500 - 250; // ±250ms variation

    return Math.max(baseDelay + words * msPerWord + variation, 500);
  };

  const handleSendMessage = async (
    text: string,
    imageUriFromInput?: string,
    isQuickReply: boolean = false,
  ) => {
    let currentImageUri = imageUriFromInput;
    const currentEffectiveAIProfile = globalAIProfile || defaultAIProfile;

    if (!text.trim() && !currentImageUri) return;
    if (isLoadingAdSettings || isLoadingAIProfile || isLoadingMediaAssets) {
      toast({
        title: "Please wait",
        description: "Loading essential settings...",
        variant: "default",
      });
      return;
    }

    const newUserMessage: Message = {
      id: generateUniqueMessageId(),
      text,
      sender: "user",
      timestamp: new Date(),
      status: "sent",
      userImageUrl: currentImageUri,
    };

    // Check if AI should be paused or ignoring messages
    const isCurrentlyPaused = shouldAIBePaused();
    const shouldStartIgnoring = !isCurrentlyPaused && shouldIgnoreMessage();

    if (isCurrentlyPaused || shouldStartIgnoring) {
      console.log(
        "Kruthika AI: Currently paused/offline or starting to ignore, not responding",
      );

      // Add to missed messages for later response
      addToMissedMessages(text, newUserMessage.id);

      // Set appropriate message status based on ignore type
      const ignoreUntil = localStorage.getItem(AI_IGNORE_UNTIL_KEY);
      const lastGoodbyeTime = localStorage.getItem(AI_LAST_GOODBYE_TIME_KEY);

      if (lastGoodbyeTime) {
        // AI said goodbye, so message shows as delivered but not read
        newUserMessage.status = "delivered";
      } else if (ignoreUntil && shouldStartIgnoring) {
        // AI just got busy, message shows as sent (single tick)
        newUserMessage.status = "sent";
      } else if (ignoreUntil) {
        // AI is already busy, message shows as delivered (double tick but unread)
        newUserMessage.status = "delivered";
      } else {
        newUserMessage.status = "sent";
      }

      setMessages((prev) => [...prev, newUserMessage]);

      // Simulate delayed delivery for busy state
      if (shouldStartIgnoring && !lastGoodbyeTime) {
        setTimeout(
          () => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === newUserMessage.id
                  ? { ...msg, status: "delivered" as MessageStatus }
                  : msg,
              ),
            );
          },
          2000 + Math.random() * 3000,
        ); // 2-5 second delay
      }

      return;
    }

    // Handle missed messages if AI is coming back online
    const missedMessages = getMissedMessages();
    let shouldRespondToMissedMessages = false;

    if (missedMessages.length > 0) {
      // 60% chance to acknowledge missed messages
      if (Math.random() < 0.6) {
        shouldRespondToMissedMessages = true;
      }
    }

    // Psychological user profiling and addiction tracking
    updateUserPsychologyProfile(text);
    trackUserAddictionLevel();
    updateUserEmotionalState(text);

    // Gather user type data for intelligent AI behavior
    const userTypeData = getUserTypeData();

    resetInactivityTimer();

    let imageAttemptedAndAllowed = false;

    if (currentImageUri) {
      const todayStr = new Date().toDateString();
      const lastUploadDate = localStorage.getItem(
        USER_IMAGE_UPLOAD_LAST_DATE_KEY_KRUTHIKA,
      );
      let currentUploadCount = parseInt(
        localStorage.getItem(USER_IMAGE_UPLOAD_COUNT_KEY_KRUTHIKA) || "0",
        10,
      );

      if (lastUploadDate !== todayStr) {
        currentUploadCount = 0;
      }

      if (currentUploadCount >= MAX_USER_IMAGES_PER_DAY) {
        toast({
          title: "Daily Image Limit Reached",
          description: `You can only send ${MAX_USER_IMAGES_PER_DAY} images per day. Your message text (if any) has been sent. Please try sending images again tomorrow.`,
          variant: "destructive",
          duration: 5000,
        });
        currentImageUri = undefined;
        if (!text.trim()) return;
      } else {
        imageAttemptedAndAllowed = true;
      }
    }
    userSentMediaThisTurnRef.current = !!currentImageUri;

    setMessages((prev) => [...prev, newUserMessage]);
    if (adSettings && adSettings.adsEnabledGlobally)
      maybeTriggerAdOnMessageCount();

    // Check if we should inject or refresh native ad after 3 messages
    setMessagesSinceLastAd((prev) => {
      const newCount = prev + 1;
      if (newCount >= 3 && adSettings && adSettings.adsEnabledGlobally) {
        // Use setTimeout to inject/refresh ad after current message is processed
        setTimeout(() => {
          injectNativeAdMessage();
        }, 100);
      }
      return newCount;
    });

    // Update last user message time for proactive messaging
    setLastUserMessageTime(Date.now());

    if (supabase) {
      try {
        const { error: userLogError } = await supabase
          .from("messages_log")
          .insert([
            {
              message_id: newUserMessage.id,
              sender_type: "user",
              chat_id: "kruthika_chat",
              text_content: newUserMessage.text.substring(0, 500),
              has_image: !!newUserMessage.userImageUrl,
            },
          ]);
        if (userLogError) {
          // Handle duplicate key error specifically
          if (userLogError.message.includes("duplicate key value violates unique constraint")) {
            console.warn(
              "Duplicate user message ID detected, retrying with new ID:",
              newUserMessage.id
            );
            // Generate new ID and retry once
            const newId = generateUniqueMessageId();
            const { error: retryError } = await supabase
              .from("messages_log")
              .insert([
                {
                  message_id: newId,
                  sender_type: "user",
                  chat_id: "kruthika_chat",
                  text_content: newUserMessage.text.substring(0, 500),
                  has_image: !!newUserMessage.userImageUrl,
                },
              ]);
            if (retryError) {
              console.error("User message retry failed:", retryError.message);
            }
          } else {
            console.error(
              "Supabase error logging user message:",
              userLogError.message,
            );
          }
        }
      } catch (e: any) {
        console.error(
          "Supabase user message logging failed (catch block):",
          e?.message || String(e),
        );
      }
    }

    const interactionMessage = currentImageUri
      ? text
        ? `User: ${text} [sent an image]`
        : `User: [sent an image]`
      : `User: ${text}`;
    const updatedRecentInteractions = [
      ...recentInteractions,
      interactionMessage,
    ].slice(-10);
    setRecentInteractions(updatedRecentInteractions);

    // More realistic message status progression with IST timing
    const deliveredDelay = (() => {
      // Use IST timezone consistently
      const istHour = parseInt(
        new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          hour12: false,
        }),
      );
      const baseDelay = 500; // Slower than before

      // Faster during active hours (9 AM - 11 PM IST)
      if (istHour >= 9 && istHour <= 23) {
        return baseDelay + Math.random() * 800; // 0.5-1.3s
      }
      // Slower during night/early morning (simulate sleeping)
      return baseDelay + Math.random() * 4000 + 2000; // 2.5-6.5s
    })();

    // Schedule delivery status update with timestamp
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newUserMessage.id
            ? {
                ...msg,
                status: "delivered" as MessageStatus,
                deliveredAt: new Date(),
              }
            : msg,
        ),
      );
    }, deliveredDelay);

    // Schedule read status update when AI responds (realistic delay)
    const scheduleReadReceipt = (messageId: string, delay: number = 2000) => {
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  status: "read" as MessageStatus,
                  readAt: new Date(),
                }
              : msg,
          ),
        );
      }, delay);
    };

    try {
      const currentMediaConfig =
        mediaAssetsConfig || defaultAIMediaAssetsConfig;
      const availableImages = currentMediaConfig.assets
        .filter((a) => a.type === "image")
        .map((a) => a.url);
      const availableAudio = currentMediaConfig.assets
        .filter((a) => a.type === "audio")
        .map((a) => a.url);

      // Get psychological profile data for enhanced AI responses
      const psychProfile = JSON.parse(
        localStorage.getItem(USER_PSYCHOLOGY_PROFILE_KEY) || "{}",
      );
      const addictionLevel =
        localStorage.getItem(USER_ADDICTION_LEVEL_KEY) || "low";
      const emotionalState =
        localStorage.getItem(USER_EMOTIONAL_STATE_KEY) || "neutral";
      const dailyMsgCount = parseInt(
        localStorage.getItem(USER_DAILY_MESSAGE_COUNT_KEY) || "0",
      );

      // Get current ignore state for server-safe AI function
      const currentIgnoreUntil = localStorage.getItem(AI_IGNORE_UNTIL_KEY);
      const currentIgnoreTime = currentIgnoreUntil
        ? parseInt(currentIgnoreUntil)
        : null;

      // Check if this is a comeback after goodbye
      const lastGoodbyeTime = localStorage.getItem(AI_LAST_GOODBYE_TIME_KEY);
      const isComeback = lastGoodbyeTime && !shouldAIBePaused();

      // Clear goodbye state if coming back
      if (isComeback) {
        localStorage.removeItem(AI_LAST_GOODBYE_TIME_KEY);
        clearMissedMessages(); // Clear missed messages on comeback
      }

      const aiInput: EmotionalStateInput = {
        userMessage: text,
        userImageUri: currentImageUri,
        timeOfDay: getTimeOfDay(),
        mood: aiMood,
        recentInteractions: updatedRecentInteractions,
        availableImages: availableImages,
        availableAudio: availableAudio,
        // Enhanced psychological data
        userPsychologyProfile: psychProfile,
        userAddictionLevel: addictionLevel,
        userEmotionalState: emotionalState,
        dailyMessageCount: dailyMsgCount,
        // Add missed message context
        missedMessages: shouldRespondToMissedMessages
          ? missedMessages
          : undefined,
        hasBeenOffline: missedMessages.length > 0,
        // User type data for intelligent AI behavior
        // userTypeData: userTypeData, // Commented out - not in interface
        isQuickReply: isQuickReply,
        // Server-safe ignore state
        currentIgnoreUntil: currentIgnoreTime,
        // Goodbye comeback data
        // lastGoodbyeTime: isComeback ? parseInt(lastGoodbyeTime) : undefined // Removed - not in EmotionalStateInput interface
      };

      const serverResult = await sendMessage(
        text,
        aiMood,
        updatedRecentInteractions,
      );

      if (!serverResult.success) {
        throw new Error(serverResult.error || "Failed to get AI response");
      }

      // Convert server result to expected format
      const aiResult: EmotionalStateOutput = {
        response: serverResult.response || "",
        newMood: serverResult.newMood || aiMood,
        proactiveImageUrl: serverResult.proactiveImageUrl,
        proactiveAudioUrl: serverResult.proactiveAudioUrl,
        mediaCaption: serverResult.mediaCaption,
        newIgnoreUntil: serverResult.wasIgnored
          ? Date.now() + 10 * 60 * 1000
          : undefined, // 10 min ignore if ignored
        multiPartResponse: serverResult.multiPartResponse, // For multi-part messages
      };

      // Handle ignore/busy persistence from server response
      if (aiResult.newIgnoreUntil) {
        localStorage.setItem(
          AI_IGNORE_UNTIL_KEY,
          aiResult.newIgnoreUntil.toString(),
        );
      }

      if (aiResult.proactiveImageUrl || aiResult.proactiveAudioUrl) {
        if (adSettings && adSettings.adsEnabledGlobally) {
          tryShowAdAndMaybeInterstitial(
            `Loading ${currentEffectiveAIProfile.name}'s share...`,
          );
        }
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      const logAiMessageToSupabase = async (
        aiText: string,
        aiMsgId: string,
        hasImage: boolean = false,
        hasAudio: boolean = false,
      ) => {
        if (supabase) {
          try {
            const { error: aiLogError } = await supabase
              .from("messages_log")
              .insert([
                {
                  message_id: aiMsgId,
                  sender_type: "ai",
                  chat_id: "kruthika_chat",
                  text_content: aiText.substring(0, 500),
                  has_image: hasImage || hasAudio,
                },
              ]);
            if (aiLogError) {
              // Handle duplicate key error specifically
              if (aiLogError.message.includes("duplicate key value violates unique constraint")) {
                console.warn(
                  "Duplicate message ID detected, retrying with new ID:",
                  aiMsgId
                );
                // Generate new ID and retry once
                const newId = generateUniqueMessageId();
                const { error: retryError } = await supabase
                  .from("messages_log")
                  .insert([
                    {
                      message_id: newId,
                      sender_type: "ai",
                      chat_id: "kruthika_chat",
                      text_content: aiText.substring(0, 500),
                      has_image: hasImage || hasAudio,
                    },
                  ]);
                if (retryError) {
                  console.error("Retry failed:", retryError.message);
                }
              } else {
                console.error(
                  "Supabase error logging AI message:",
                  aiLogError.message,
                );
              }
            }
          } catch (e: any) {
            console.error(
              "Supabase AI message logging failed (catch block):",
              e?.message || String(e),
            );
          }
        }
      };

      const processAiTextMessage = async (
        responseText: string,
        messageIdSuffix: string = "",
        isMultiPart: boolean = false,
      ) => {
        // Start typing animation
        setIsAiTyping(true);

        // Calculate realistic typing delay
        const typingDuration = calculateTypingDelay(responseText);
        await new Promise((resolve) => setTimeout(resolve, typingDuration));

        // Stop typing and send message
        setIsAiTyping(false);

        const newAiMessageId = generateUniqueMessageId() + messageIdSuffix;
        const newAiMessage: Message = {
          id: newAiMessageId,
          text: responseText,
          sender: "ai",
          timestamp: new Date(),
          status: "read",
        };
        setMessages((prev) => [...prev, newAiMessage]);

        // Schedule realistic read receipt after AI starts typing (not immediate)
        const readReceiptDelay = Math.random() * 3000 + 1000; // 1-4 seconds delay
        scheduleReadReceipt(newUserMessage.id, readReceiptDelay);
        if (adSettings && adSettings.adsEnabledGlobally)
          maybeTriggerAdOnMessageCount();

        // Count AI messages for ad injection with rotation support
        setMessagesSinceLastAd((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3 && adSettings && adSettings.adsEnabledGlobally) {
            // Use setTimeout to inject/refresh ad after current message is processed
            setTimeout(() => {
              injectNativeAdMessage();
            }, 100);
          }
          return newCount;
        });

        setRecentInteractions((prevInteractions) =>
          [...prevInteractions, `AI: ${responseText}`].slice(-10),
        );
        await logAiMessageToSupabase(
          responseText,
          newAiMessageId,
          false,
          false,
        );
      };

      const processAiMediaMessage = async (
        mediaType: "image" | "audio",
        url: string,
        caption?: string,
      ) => {
        // Start typing animation
        setIsAiTyping(true);

        const typingDuration = calculateTypingDelay(caption || "Sending...");
        await new Promise((resolve) => setTimeout(resolve, typingDuration));

        // Stop typing and send media
        setIsAiTyping(false);

        const newAiMediaMessageId =
          (Date.now() + Math.random()).toString() + `_${mediaType}`;
        const newAiMediaMessage: Message = {
          id: newAiMediaMessageId,
          text: caption || "",
          sender: "ai",
          timestamp: new Date(),
          status: "read",
          aiImageUrl: mediaType === "image" ? url : undefined,
          audioUrl: mediaType === "audio" ? url : undefined,
        };
        setMessages((prev) => [...prev, newAiMediaMessage]);
        if (adSettings && adSettings.adsEnabledGlobally)
          maybeTriggerAdOnMessageCount();
        setRecentInteractions((prevInteractions) =>
          [
            ...prevInteractions,
            `AI: ${caption || ""}[Sent a ${mediaType}] ${url}`,
          ].slice(-10),
        );
        await logAiMessageToSupabase(
          caption || `[Sent ${mediaType}]`,
          newAiMediaMessageId,
          mediaType === "image",
          mediaType === "audio",
        );
      };

      if (aiResult.proactiveImageUrl && aiResult.mediaCaption) {
        await processAiMediaMessage(
          "image",
          aiResult.proactiveImageUrl,
          aiResult.mediaCaption,
        );
      } else if (aiResult.proactiveAudioUrl && aiResult.mediaCaption) {
        await processAiMediaMessage(
          "audio",
          aiResult.proactiveAudioUrl,
          aiResult.mediaCaption,
        );
      } else if (
        aiResult.multiPartResponse &&
        aiResult.multiPartResponse.length > 1
      ) {
        // Handle multi-part responses
        for (let i = 0; i < aiResult.multiPartResponse.length; i++) {
          const part = aiResult.multiPartResponse[i];
          if (part.trim() === "") continue;
          await processAiTextMessage(part, `_part${i}`, true);
          if (i < aiResult.multiPartResponse.length - 1) {
            // Brief pause between messages like a real person
            const interMessageDelay = 800 + Math.random() * 700;
            await new Promise((resolve) =>
              setTimeout(resolve, interMessageDelay),
            );
          }
        }
      } else if (
        aiResult.response &&
        typeof aiResult.response === "string" &&
        aiResult.response.trim() !== ""
      ) {
        await processAiTextMessage(aiResult.response);
      }

      // Ensure typing is always stopped
      setIsAiTyping(false);
      if (aiResult.newMood) setAiMood(aiResult.newMood);

      // Clear missed messages if AI responded to them
      if (shouldRespondToMissedMessages) {
        clearMissedMessages();
      }

      // Check if AI just said goodbye and should go offline
      let aiResponseText = "";
      if (typeof aiResult.response === "string") {
        aiResponseText = aiResult.response;
      } else if (Array.isArray(aiResult.response)) {
        aiResponseText = aiResult.response.join(" ");
      } else if (Array.isArray(aiResult.multiPartResponse)) {
        aiResponseText = aiResult.multiPartResponse.join(" ");
      }

      if (detectGoodbyeMessage(aiResponseText)) {
        console.log("Kruthika AI: Goodbye detected, setting offline state");
        setAIGoodbyeState();

        // Clear any pending proactive messages
        if (proactiveMessageTimerRef.current) {
          clearTimeout(proactiveMessageTimerRef.current);
        }
      }

      // Also check if USER said goodbye to AI
      if (detectGoodbyeMessage(text)) {
        console.log(
          "Kruthika AI: User said goodbye, AI should acknowledge and go offline soon",
        );
        // AI will naturally respond to goodbye, then go offline after this message
        setTimeout(() => {
          console.log("Kruthika AI: Going offline after user goodbye");
          setAIGoodbyeState();
          if (proactiveMessageTimerRef.current) {
            clearTimeout(proactiveMessageTimerRef.current);
          }
        }, 5000); // Give 5 seconds for AI response, then go offline
      }

      if (imageAttemptedAndAllowed && currentImageUri) {
        const todayStr = new Date().toDateString();
        let currentUploadCount = parseInt(
          localStorage.getItem(USER_IMAGE_UPLOAD_COUNT_KEY_KRUTHIKA) || "0",
          10,
        );
        const lastUploadDate = localStorage.getItem(
          USER_IMAGE_UPLOAD_LAST_DATE_KEY_KRUTHIKA,
        );

        if (lastUploadDate !== todayStr) {
          currentUploadCount = 0;
        }
        currentUploadCount++;
        localStorage.setItem(
          USER_IMAGE_UPLOAD_COUNT_KEY_KRUTHIKA,
          currentUploadCount.toString(),
        );
        localStorage.setItem(
          USER_IMAGE_UPLOAD_LAST_DATE_KEY_KRUTHIKA,
          todayStr,
        );
      }

      if (userSentMediaThisTurnRef.current) {
        if (
          adSettings &&
          adSettings.adsEnabledGlobally &&
          Math.random() < USER_MEDIA_INTERSTITIAL_CHANCE
        ) {
          tryShowAdAndMaybeInterstitial("Just a moment...");
        }
        userSentMediaThisTurnRef.current = false;
      }
    } catch (error: any) {
      console.error("Error getting AI response:", error);
      let errorDescription = `Could not get a response from ${currentEffectiveAIProfile.name}.`;
      if (error?.response?.data?.error)
        errorDescription = `${currentEffectiveAIProfile.name}'s server said: ${error.response.data.error}`;
      else if (error?.message) errorDescription += ` Details: ${error.message}`;
      else if (typeof error === "string")
        errorDescription += ` Details: ${error}`;
      else
        errorDescription += ` An unknown error occurred. Please check console logs.`;

      toast({
        title: "Error",
        description: errorDescription,
        variant: "destructive",
      });
      const errorAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Uff, my brain's a bit fuzzy right now. Try again in a bit? 😓",
        sender: "ai",
        timestamp: new Date(),
        status: "read",
      };
      setMessages((prev) => {
        const updatedMessages = prev.map((msg) =>
          msg.id === newUserMessage.id
            ? { ...msg, status: "read" as MessageStatus }
            : msg,
        );
        return [...updatedMessages, errorAiMessage];
      });
      if (adSettings && adSettings.adsEnabledGlobally)
        maybeTriggerAdOnMessageCount();
      setIsAiTyping(false);
      userSentMediaThisTurnRef.current = false;
    }
  };

  const currentAiNameForOfflineMsg =
    globalAIProfile?.name || defaultAIProfile.name;

  useEffect(() => {
    if (
      !initialLoadComplete.current ||
      isLoadingChatState ||
      isLoadingAdSettings ||
      isLoadingAIProfile ||
      isLoadingMediaAssets
    )
      return;

    const lastMessage =
      messages.length > 0 ? messages[messages.length - 1] : null;
    const lastInteractionTime = lastMessage
      ? new Date(lastMessage.timestamp).getTime()
      : 0;
    const now = Date.now();
    const timeSinceLastInteraction = now - lastInteractionTime;
    let timeoutId: NodeJS.Timeout | undefined = undefined;

    if (
      messages.some((m) => m.sender === "user") &&
      lastMessage &&
      lastMessage.sender === "user" &&
      timeSinceLastInteraction > 2 * 60 * 60 * 1000 &&
      Math.random() < 0.3
    ) {
      const { hour: currentISTHour } = getISTTimeParts();
      if (!(currentISTHour >= 5 && currentISTHour < 12)) return;

      const generateAndAddOfflineMessage = async () => {
        setIsAiTyping(true);
        try {
          const offlineInput: OfflineMessageInput = {
            offlineMessageContext:
              "User has returned after being away for a while, or hasn't messaged recently.",
            previousMessageHistory: recentInteractions.join("\n"),
            aiName: currentAiNameForOfflineMsg,
          };
          const offlineResult = await generateOfflineMessage(offlineInput);
          const typingDelay = Math.min(
            Math.max(offlineResult.message.length * 60, 700),
            3500,
          );
          await new Promise((resolve) => setTimeout(resolve, typingDelay));
          const newOfflineMsgId = (Date.now() + Math.random()).toString();
          const offlineMessage: Message = {
            id: newOfflineMsgId,
            text: offlineResult.message,
            sender: "ai",
            timestamp: new Date(),
            status: "read",
          };
          setMessages((prev) => [...prev, offlineMessage]);
          if (adSettings && adSettings.adsEnabledGlobally)
            maybeTriggerAdOnMessageCount();
          setRecentInteractions((prev) =>
            [...prev, `AI: ${offlineResult.message}`].slice(-10),
          );
          if (supabase) {
            try {
              const { error: offlineLogError } = await supabase
                .from("messages_log")
                .insert([
                  {
                    message_id: newOfflineMsgId,
                    sender_type: "ai",
                    chat_id: "kruthika_chat_offline_ping",
                    text_content: offlineResult.message.substring(0, 500),
                    has_image: false,
                  },
                ]);
              if (offlineLogError)
                console.error(
                  "Supabase error logging offline AI message:",
                  offlineLogError.message,
                );
            } catch (e: any) {
              console.error(
                "Supabase offline AI message logging failed:",
                e?.message || String(e),
              );
            }
          }
        } catch (error) {
          console.error("Error generating offline message:", error);
        } finally {
          setIsAiTyping(false);
        }
      };
      timeoutId = setTimeout(
        generateAndAddOfflineMessage,
        1800 + Math.random() * 1300,
      );
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [
    messages,
    currentAiNameForOfflineMsg,
    recentInteractions,
    isLoadingChatState,
    toast,
    maybeTriggerAdOnMessageCount,
    isLoadingAdSettings,
    isLoadingAIProfile,
    isLoadingMediaAssets,
    adSettings,
  ]);

  const onlineStatus = useMemo(() => {
    if (isAiTyping) return "typing...";

    // Check daily message count - ensure consistent between server and client
    const dailyCount = typeof window !== "undefined" 
      ? parseInt(localStorage.getItem(USER_DAILY_MESSAGE_COUNT_KEY) || "0")
      : 0;
    const isNewUser = dailyCount <= 20;

    // Add realistic activity status
    const getCurrentActivityStatus = (): string => {
      const now = new Date();
      const istHour = parseInt(
        now.toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          hour12: false,
        }),
      );
      const dayOfWeek = now.getDay();

      // Weekend activities
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        if (istHour >= 10 && istHour <= 12) return "getting ready to go out 💄";
        if (istHour >= 13 && istHour <= 16)
          return "shopping at linking road 🛍️";
        if (istHour >= 17 && istHour <= 19)
          return "having chai with friends ☕";
      }

      // Weekday college schedule
      if (istHour >= 8 && istHour <= 10) return "in mumbai local 🚂";
      if (istHour >= 11 && istHour <= 13) return "psychology lecture 📚";
      if (istHour >= 14 && istHour <= 16)
        return "college canteen with friends 🍛";
      if (istHour >= 17 && istHour <= 19) return "traveling back home 🚌";
      if (istHour >= 20 && istHour <= 21) return "family dinner time 🍽️";

      return "";
    };

    // Check if AI is paused/offline first
    if (typeof window !== "undefined" && shouldAIBePaused()) {
      const lastGoodbyeTime = localStorage.getItem(AI_LAST_GOODBYE_TIME_KEY);
      const ignoreUntil = localStorage.getItem(AI_IGNORE_UNTIL_KEY);

      if (lastGoodbyeTime) {
        const goodbyeDate = new Date(parseInt(lastGoodbyeTime));
        const timeSinceGoodbye = Date.now() - parseInt(lastGoodbyeTime);
        const goodbyeHour = goodbyeDate.getHours();

        // Enhanced goodbye status messages
        if (goodbyeHour >= 22 || goodbyeHour <= 6) {
          // Night goodbye
          if (timeSinceGoodbye < 4 * 60 * 60 * 1000) {
            // Less than 4 hours
            return "sleeping 😴💤";
          } else {
            return "probably waking up soon 🌅";
          }
        } else if (goodbyeHour >= 8 && goodbyeHour <= 17) {
          // Day goodbye (college/work)
          return "at college 📚";
        } else {
          // Evening goodbye
          if (timeSinceGoodbye < 60 * 60 * 1000) {
            // Less than 1 hour
            return "busy with family 👨‍👩‍👧";
          } else {
            return "should be back soon 🔄";
          }
        }
      }

      if (ignoreUntil && !isNewUser && typeof window !== "undefined") {
        const remainingMin = Math.ceil(
          (parseInt(ignoreUntil) - Date.now()) / 60000,
        );
        if (remainingMin > 0) {
          return `busy, back in ${remainingMin}m`;
        }
      }
    }

    // New users always see "online" during active hours
    if (isNewUser) {
      const getISTTimePartsLocal = (): { hour: number; minutes: number } => {
        const now = new Date();
        const istDateString = now.toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        });
        const istDate = new Date(istDateString);
        return { hour: istDate.getHours(), minutes: istDate.getMinutes() };
      };
      const { hour: currentISTHour } = getISTTimePartsLocal();

      if (currentISTHour >= 6 && currentISTHour <= 23) {
        return "online 💚"; // Always online for new users during day
      }
    }

    const getISTTimePartsLocal = (): { hour: number; minutes: number } => {
      const now = new Date();
      const istDateString = now.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });
      const istDate = new Date(istDateString);
      return { hour: istDate.getHours(), minutes: istDate.getMinutes() };
    };
    const { hour: currentISTHour } = getISTTimePartsLocal();
    const isKruthikaActiveHours = currentISTHour >= 5 && currentISTHour < 12;
    const lastAiMessage = messages
      .slice()
      .reverse()
      .find((msg) => msg.sender === "ai");

    if (isKruthikaActiveHours) {
      if (lastAiMessage) {
        const now = new Date();
        const lastSeenTime = new Date(lastAiMessage.timestamp);
        const diffMs = now.getTime() - lastSeenTime.getTime();
        const diffMins = Math.round(diffMs / 60000);
        if (diffMins < 3) return "online";
      } else return "online";
    }
    if (lastAiMessage) {
      const now = new Date();
      const lastSeenTime = new Date(lastAiMessage.timestamp);
      const diffMs = now.getTime() - lastSeenTime.getTime();
      const diffMins = Math.round(diffMs / 60000);
      const todayISTString = new Date().toLocaleDateString("en-US", {
        timeZone: "Asia/Kolkata",
      });
      const lastSeenDateISTString = lastSeenTime.toLocaleDateString("en-US", {
        timeZone: "Asia/Kolkata",
      });
      if (diffMins < 1) return `last seen just now`;
      if (diffMins < 60) return `last seen ${diffMins}m ago`;
      if (todayISTString === lastSeenDateISTString)
        return `last seen today at ${lastSeenTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata", hour12: true })}`;
      else {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const yesterdayISTString = yesterday.toLocaleDateString("en-US", {
          timeZone: "Asia/Kolkata",
        });
        if (lastSeenDateISTString === yesterdayISTString)
          return `last seen yesterday at ${lastSeenTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata", hour12: true })}`;
        return `last seen ${lastSeenTime.toLocaleDateString([], { month: "short", day: "numeric", timeZone: "Asia/Kolkata" })}`;
      }
    }
    if (isKruthikaActiveHours) return "online";
    if (currentISTHour >= 12 && currentISTHour < 17)
      return `probably busy, back in morning`;
    if (currentISTHour >= 17 && currentISTHour < 21)
      return `winding down, back tomorrow`;
    return `sleeping, back at 5 AM IST`;
  }, [messages, isAiTyping]);

  const handleOpenAvatarZoom = () => {
    if (isLoadingAIProfile) return;
    const avatarUrl = globalAIProfile?.avatarUrl || defaultAIProfile.avatarUrl;
    setZoomedAvatarUrl(avatarUrl);
    setShowZoomedAvatarDialog(true);
  };

  const handleCallVideoClick = () => {
    if (isLoadingAdSettings || !adSettings) return;
    if (adSettings && adSettings.adsEnabledGlobally) {
      tryShowAdAndMaybeInterstitial("Connecting...");
    } else {
      toast({
        title: "Call Feature",
        description: "Calls are simulated and may trigger ads if enabled.",
        duration: 3000,
      });
    }
  };

  const handleQuickReply = (replyText: string, originalMessage: Message) => {
    // Send the quick reply as a message with isQuickReply flag
    handleSendMessage(replyText, undefined, true);

    // Add visual feedback
    toast({
      title: "Quick Reply Sent",
      description: `Replied "${replyText}" to ${originalMessage.text.substring(0, 30)}...`,
      duration: 2000,
    });
  };

  // Function to inject or refresh native ad as a chat message with rotation
  const injectNativeAdMessage = () => {
    if (!adSettings || !adSettings.adsEnabledGlobally) {
      return;
    }

    // Check if native banner is enabled and has valid code
    const hasAdsterraCode =
      adSettings.adsterraNativeBannerEnabled &&
      adSettings.adsterraNativeBannerCode &&
      !adSettings.adsterraNativeBannerCode
        .toLowerCase()
        .includes("placeholder");

    const hasMonatagCode =
      adSettings.monetagNativeBannerEnabled &&
      adSettings.monetagNativeBannerCode &&
      !adSettings.monetagNativeBannerCode.toLowerCase().includes("placeholder");

    if (!hasAdsterraCode && !hasMonatagCode) {
      console.log(
        "Native ad injection skipped: No valid native banner code available",
      );
      return;
    }

    // Rotate between networks for better performance
    const lastShownNetwork =
      localStorage.getItem("last_native_ad_network") || "";
    let selectedCode = "";
    let selectedNetwork = "";

    if (hasAdsterraCode && hasMonatagCode) {
      // Rotate between networks
      if (lastShownNetwork === "adsterra") {
        selectedCode = adSettings.monetagNativeBannerCode;
        selectedNetwork = "monetag";
      } else {
        selectedCode = adSettings.adsterraNativeBannerCode;
        selectedNetwork = "adsterra";
      }
    } else if (hasAdsterraCode) {
      selectedCode = adSettings.adsterraNativeBannerCode;
      selectedNetwork = "adsterra";
    } else if (hasMonatagCode) {
      selectedCode = adSettings.monetagNativeBannerCode;
      selectedNetwork = "monetag";
    }

    // Store the network for rotation
    localStorage.setItem("last_native_ad_network", selectedNetwork);

    if (currentActiveAdId && hasShownNativeAd) {
      // Replace existing ad content instead of creating new bubble
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === currentActiveAdId && msg.isNativeAd) {
            return {
              ...msg,
              nativeAdCode: selectedCode,
              nativeAdId: `native-ad-chat-rotated-${Date.now()}`,
              timestamp: new Date(), // Update timestamp for freshness
            };
          }
          return msg;
        }),
      );

      console.log(
        "Native ad content refreshed for existing bubble:",
        currentActiveAdId,
        "Network:",
        selectedNetwork,
        "Code length:",
        selectedCode.length,
      );
    } else {
      // Create new ad bubble for first time
      const adId = `native_ad_${Date.now()}`;
      const nativeAdMessage: Message = {
        id: adId,
        text: "",
        sender: "ad" as any,
        timestamp: new Date(),
        status: "read",
        isNativeAd: true,
        nativeAdCode: selectedCode,
        nativeAdId: `native-ad-chat-${selectedNetwork}-${Date.now()}`,
      };

      setMessages((prev) => [...prev, nativeAdMessage]);
      setCurrentActiveAdId(adId);
      setHasShownNativeAd(true);

      console.log(
        "New native ad bubble created:",
        adId,
        "Network:",
        selectedNetwork,
        "Code length:",
        selectedCode.length,
      );
    }

    setMessagesSinceLastAd(0);
  };

  const handleLikeMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isLiked: !msg.isLiked } : msg,
      ),
    );

    // Add subtle feedback
    toast({
      title: "❤️ Liked",
      description: "You liked this message",
      duration: 1000,
    });
  };

  const handleReactToMessage = (
    messageId: string,
    reaction: MessageReaction,
  ) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, reaction } : msg)),
    );

    // Add subtle feedback
    toast({
      title: "🎉 Reaction Added",
      description: `Reacted with ${reaction}`,
      duration: 1000,
    });
  };

  const displayAIProfile = globalAIProfile || defaultAIProfile;

  if (
    isLoadingAIProfile ||
    !globalAIProfile ||
    isLoadingAdSettings ||
    isLoadingMediaAssets ||
    isLoadingChatState
  ) {
    return (
      <div className="flex justify-center items-center h-screen bg-chat-bg-default text-foreground">
        Loading Kruthika's Chat...
      </div>
    );
  }

  return (
    <>
      <ChatStructuredData />
      <div className="flex flex-col h-screen max-w-3xl mx-auto bg-chat-bg-default shadow-2xl">
        <ChatHeader
          aiName={displayAIProfile.name}
          aiAvatarUrl={displayAIProfile.avatarUrl}
          onlineStatus={onlineStatus}
          onAvatarClick={handleOpenAvatarZoom}
          onCallClick={handleCallVideoClick}
          onVideoClick={handleCallVideoClick}
        />
        <ChatView
          messages={messages}
          aiAvatarUrl={displayAIProfile.avatarUrl}
          aiName={displayAIProfile.name}
          isAiTyping={isAiTyping}
          onTriggerAd={handleBubbleAdTrigger}
          onQuickReply={handleQuickReply}
          onLikeMessage={handleLikeMessage}
          onReactToMessage={handleReactToMessage}
          onAvatarClick={handleOpenAvatarZoom}
        />

        {showInterstitialAd && (
          <SimulatedAdPlaceholder
            type="interstitial"
            onClose={() => {
              setShowInterstitialAd(false);
              if (interstitialAdTimerRef.current)
                clearTimeout(interstitialAdTimerRef.current);
            }}
            message={interstitialAdMessage}
            duration={REWARD_AD_INTERSTITIAL_DURATION_MS}
          />
        )}

        {/* Normal Banner Ad above input */}
        <BannerAdDisplay
          adType="standard"
          placementKey="chat-bottom"
          className="mb-2"
        />

        <ChatInput onSendMessage={handleSendMessage} isAiTyping={isAiTyping} />

        <Dialog
          open={showZoomedAvatarDialog}
          onOpenChange={setShowZoomedAvatarDialog}
        >
          <DialogContent className="fixed left-[50%] top-[50%] z-50 w-[85vw] max-w-xs h-auto translate-x-[-50%] translate-y-[-50%] bg-[#0b141a] border-0 shadow-2xl rounded-2xl p-0 overflow-hidden sm:max-w-sm [&>button]:hidden">
            {/* Header with gradient background like WhatsApp */}
            <div className="relative">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#075e54] to-[#128c7e]"></div>
              
              {/* Header content */}
              <div className="relative flex items-center justify-between p-4 text-white">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowZoomedAvatarDialog(false)}
                    className="text-white hover:bg-white/20 h-10 w-10 rounded-full p-0"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div>
                    <DialogTitle className="text-white text-lg font-medium">
                      {displayAIProfile.name}
                    </DialogTitle>
                    <p className="text-white/80 text-sm">{onlineStatus}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowZoomedAvatarDialog(false)}
                  className="text-white hover:bg-white/20 h-10 w-10 rounded-full p-0"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Profile Image Section with WhatsApp styling */}
            <div className="flex flex-col items-center py-8 px-6 bg-[#0b141a]">
              {/* Large Profile Image */}
              <div className="mb-6">
                {displayAIProfile.avatarUrl && 
                 displayAIProfile.avatarUrl !== 'https://placehold.co/100x100.png/E91E63/FFFFFF?text=K' && 
                 (displayAIProfile.avatarUrl.startsWith('http') || displayAIProfile.avatarUrl.startsWith('data:')) ? (
                  <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-[#075e54] shadow-2xl bg-[#128c7e]">
                    <Image
                      key={`zoomed-${displayAIProfile.avatarUrl}`}
                      src={displayAIProfile.avatarUrl}
                      alt={`${displayAIProfile.name}'s profile photo`}
                      fill
                      style={{ objectFit: "cover" }}
                      className="select-none"
                      data-ai-hint="profile woman large"
                      priority={true}
                      unoptimized
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.style.display = 'none';
                        const parent = img.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full bg-[#128c7e] flex items-center justify-center">
                              <span class="text-6xl font-light text-white">
                                ${(displayAIProfile.name || "K").charAt(0).toUpperCase()}
                              </span>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-44 h-44 bg-[#128c7e] rounded-full flex items-center justify-center border-4 border-[#075e54] shadow-2xl">
                    <span className="text-6xl font-light text-white">
                      {(displayAIProfile.name || "K").charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Name and Info */}
              <div className="text-center mb-8">
                <h3 className="text-white text-2xl font-medium mb-2">
                  {displayAIProfile.name}
                </h3>
                <p className="text-[#8696a0] text-sm mb-3">{onlineStatus}</p>
                <div className="px-4 py-2 bg-[#075e54] text-white rounded-full text-sm font-medium inline-block">
                  AI Companion
                </div>
              </div>

              {/* WhatsApp-style Action Buttons */}
              <div className="flex items-center justify-center gap-8 w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center h-auto py-4 px-3 gap-2 rounded-full bg-[#075e54] hover:bg-[#128c7e] transition-all duration-200 min-w-[60px] min-h-[60px]"
                  onClick={() => setShowZoomedAvatarDialog(false)}
                >
                  <MessageSquare className="h-6 w-6 text-white" />
                  <span className="text-xs text-white font-medium">Message</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center h-auto py-4 px-3 gap-2 rounded-full bg-[#075e54] hover:bg-[#128c7e] transition-all duration-200 min-w-[60px] min-h-[60px]"
                  onClick={handleCallVideoClick}
                >
                  <Phone className="h-6 w-6 text-white" />
                  <span className="text-xs text-white font-medium">Call</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center h-auto py-4 px-3 gap-2 rounded-full bg-[#075e54] hover:bg-[#128c7e] transition-all duration-200 min-w-[60px] min-h-[60px]"
                  onClick={handleCallVideoClick}
                >
                  <Video className="h-6 w-6 text-white" />
                  <span className="text-xs text-white font-medium">Video</span>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
});

export default KruthikaChatPage;
