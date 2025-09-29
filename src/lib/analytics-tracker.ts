// Enhanced Analytics Tracking System for Kruthika.fun
import { CookieManager } from './cookie-manager';
import { supabase } from './supabaseClient';

export interface AnalyticsEvent {
  eventType: 'message_sent' | 'session_start' | 'image_shared' | 'ad_interaction' | 'page_view' | 'user_action' | 'session_pause' | 'session_resume';
  eventData: {
    chatId?: string;
    messageId?: string;
    senderType?: 'user' | 'ai';
    content?: string;
    hasImage?: boolean;
    adType?: string;
    action?: string;
    pageType?: string;
    duration?: number;
    userAgent?: string;
    referrer?: string;
    timestamp?: number;
    screenResolution?: string;
    timezone?: string;
    page?: string;
    imageUrl?: string;
    messageLength?: number;
    network?: string;
    details?: any;
  };
  userId?: string;
  sessionId?: string;
  timestamp: number;
}

export class AnalyticsTracker {
  private static instance: AnalyticsTracker;
  private sessionId: string;
  private userId: string | null = null;
  private sessionStartTime: number;
  private isTrackingEnabled: boolean = false;
  private eventQueue: AnalyticsEvent[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private isOnline: boolean = true;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = this.getUserId();
    this.sessionStartTime = Date.now();
    this.initializeTracking();
    this.startEventQueue();
    this.setupConnectionMonitoring();
  }

  public static getInstance(): AnalyticsTracker {
    if (!AnalyticsTracker.instance) {
      AnalyticsTracker.instance = new AnalyticsTracker();
    }
    return AnalyticsTracker.instance;
  }

  private initializeTracking(): void {
    if (typeof window === 'undefined') return;

    // Check user consent
    const preferences = CookieManager.getConsentPreferences();
    this.isTrackingEnabled = preferences?.analytics || false;

    if (this.isTrackingEnabled) {
      // Track session start
      this.trackEvent({
        eventType: 'session_start',
        eventData: {
          chatId: 'kruthika_chat',
          timestamp: this.sessionStartTime,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          screenResolution: `${screen.width}x${screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        userId: this.userId,
        sessionId: this.sessionId,
        timestamp: this.sessionStartTime
      });

      // Set up periodic session tracking
      this.setupPeriodicTracking();

      // Track page visibility changes
      this.setupVisibilityTracking();

      // Track user interactions
      this.setupInteractionTracking();

      console.log('Analytics Tracker: Real-time tracking initialized');
    }
  }

  private generateSessionId(): string {
    if (typeof window === 'undefined') return 'server_session';

    // Check if session ID exists in sessionStorage
    let sessionId = sessionStorage.getItem('kruthika_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('kruthika_session_id', sessionId);
    }
    return sessionId;
  }

  private getUserId(): string {
    if (typeof window === 'undefined') return 'server_user';

    // Check for persistent user ID in localStorage
    let userId = localStorage.getItem('kruthika_user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('kruthika_user_id', userId);
    }
    return userId;
  }

  private setupPeriodicTracking(): void {
    // Track session activity every 5 minutes
    setInterval(() => {
      if (this.isTrackingEnabled && !document.hidden) {
        this.updateSessionMetrics();
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  private setupVisibilityTracking(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent({
          eventType: 'session_pause',
          eventData: {
            timestamp: Date.now()
          },
          userId: this.userId,
          sessionId: this.sessionId,
          timestamp: Date.now()
        });
      } else {
        this.trackEvent({
          eventType: 'session_resume',
          eventData: {
            timestamp: Date.now()
          },
          userId: this.userId,
          sessionId: this.sessionId,
          timestamp: Date.now()
        });
      }
    });

    // Track when user leaves the page
    window.addEventListener('beforeunload', () => {
      const sessionDuration = Date.now() - this.sessionStartTime;
      this.trackEvent({
        eventType: 'user_action',
        eventData: {
          action: 'session_end',
          duration: sessionDuration,
          timestamp: Date.now()
        },
        userId: this.userId,
        sessionId: this.sessionId,
        timestamp: Date.now()
      });
      this.flushEvents(true); // Force immediate flush
    });
  }

  private setupInteractionTracking(): void {
    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
      const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;

        // Track significant scroll milestones
        if (maxScrollDepth % 25 === 0 && maxScrollDepth > 0) {
          this.trackEvent({
            eventType: 'user_action',
            eventData: {
              action: 'scroll_depth',
              duration: maxScrollDepth,
              timestamp: Date.now()
            },
            userId: this.userId,
            sessionId: this.sessionId,
            timestamp: Date.now()
          });
        }
      }
    });

    // Track click interactions
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        this.trackEvent({
          eventType: 'user_action',
          eventData: {
            action: 'click',
            content: target.textContent?.substring(0, 100) || 'unknown',
            timestamp: Date.now()
          },
          userId: this.userId,
          sessionId: this.sessionId,
          timestamp: Date.now()
        });
      }
    });
  }

  public async trackEvent(event: AnalyticsEvent): Promise<void> {
    if (!this.isTrackingEnabled) return;

    // Add session and user info if not provided
    if (!event.userId) event.userId = this.userId;
    if (!event.sessionId) event.sessionId = this.sessionId;
    if (!event.timestamp) event.timestamp = Date.now();


    // Update local storage metrics for immediate dashboard updates
    this.updateLocalMetrics(event);

    this.eventQueue.push(event);

    // For critical events, flush immediately
    if (['message_sent', 'session_start', 'ad_interaction', 'page_view'].includes(event.eventType)) {
      this.flushEvents();
    }
  }

  private setupConnectionMonitoring() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.flushEvents(); // Flush queued events when back online
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
    }
  }

  private startEventQueue() {
    // Flush events every 10 seconds
    this.flushInterval = setInterval(() => {
      this.flushEvents();
    }, 10000);
  }

  private async flushEvents(immediate = false): Promise<void> {
    if (this.eventQueue.length === 0 || (!this.isOnline && !immediate)) return;

    const eventsToSend = [...this.eventQueue];
    this.eventQueue = []; // Clear queue immediately

    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert(eventsToSend.map(event => ({
          event_type: event.eventType,
          event_data: event.eventData,
          user_id: event.userId,
          session_id: event.sessionId,
          timestamp: new Date(event.timestamp)
        })));

      if (error) {
        console.warn('Failed to flush analytics events to Supabase:', error.message);
        // Re-queue events if they failed to send
        this.eventQueue.unshift(...eventsToSend);
      } else {
        console.log(`Flushed ${eventsToSend.length} analytics events to Supabase.`);
      }
    } catch (error) {
      console.warn('Error flushing analytics events:', error);
      // Re-queue events for retry
      this.eventQueue.unshift(...eventsToSend);
    }
  }


  private updateLocalMetrics(event: AnalyticsEvent): void {
    const today = new Date().toDateString();
    const lastDate = CookieManager.getCookie('metrics_last_date');

    // Reset daily counters if it's a new day
    if (lastDate !== today) {
      localStorage.setItem('daily_message_count', '0');
      localStorage.setItem('daily_images_shared', '0');
      CookieManager.setCookie('metrics_last_date', today, 'analytics');
    }

    // Update metrics based on event type
    switch (event.eventType) {
      case 'message_sent':
        const currentMsgCount = parseInt(localStorage.getItem('daily_message_count') || '0');
        localStorage.setItem('daily_message_count', (currentMsgCount + 1).toString());

        if (event.eventData?.hasImage) {
          const currentImgCount = parseInt(localStorage.getItem('daily_images_shared') || '0');
          localStorage.setItem('daily_images_shared', (currentImgCount + 1).toString());
        }
        break;

      case 'session_start':
        localStorage.setItem('session_start_time', this.sessionStartTime.toString());
        break;

      case 'ad_interaction':
        const adAction = (event.eventData.action as 'view' | 'click' | 'close') || 'view';
        // Assuming CookieManager has a method like trackAdInteraction
        // CookieManager.trackAdInteraction(event.eventData.adType || 'unknown', adAction);
        break;
    }

    // Update session duration
    const currentDuration = (Date.now() - this.sessionStartTime) / 1000 / 60; // minutes
    localStorage.setItem('current_session_duration', currentDuration.toString());
  }

  private updateSessionMetrics(): void {
    const messageCount = parseInt(localStorage.getItem('daily_message_count') || '0');
    const imagesShared = parseInt(localStorage.getItem('daily_images_shared') || '0');
    const sessionDuration = (Date.now() - this.sessionStartTime) / 1000; // seconds

    // Update cookie-based metrics
    // CookieManager.trackUserValueMetrics(messageCount, sessionDuration, imagesShared);
  }

  // Public methods for specific tracking scenarios

  public trackMessage(messageId: string, senderType: 'user' | 'ai', content: string, hasImage: boolean = false): void {
    this.trackEvent({
      eventType: 'message_sent',
      eventData: {
        chatId: 'kruthika_chat',
        messageId,
        senderType,
        content: content.substring(0, 500), // Truncate for privacy
        hasImage,
        timestamp: Date.now(),
        messageLength: content.length
      },
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: Date.now()
    });
  }

  public trackPageView(pageType: string): void {
    this.trackEvent({
      eventType: 'page_view',
      eventData: {
        pageType,
        referrer: document.referrer,
        timestamp: Date.now()
      },
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: Date.now()
    });

    // Update SEO metrics in cookies
    // CookieManager.trackSEOMetrics(pageType);
  }

  public trackAdInteractionPublic(adType: string, action: 'view' | 'click', adNetwork?: string): void {
    this.trackEvent({
      eventType: 'ad_interaction',
      eventData: {
        adType,
        action,
        network: adNetwork || 'unknown',
        timestamp: Date.now()
      },
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: Date.now()
    });
  }

  public trackImageShare(imageUrl: string): void {
    this.trackEvent({
      eventType: 'image_shared',
      eventData: {
        chatId: 'kruthika_chat',
        content: 'image_shared',
        hasImage: true,
        timestamp: Date.now(),
        imageUrl: imageUrl.substring(0, 100) // Truncate for privacy
      },
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: Date.now()
    });
  }

  public trackUserAction(action: string, details: any = {}): void {
    this.trackEvent({
      eventType: 'user_action',
      eventData: {
        action,
        details,
        timestamp: Date.now()
      },
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: Date.now()
    });
  }


  public enableTracking(): void {
    this.isTrackingEnabled = true;
    this.initializeTracking();
  }

  public disableTracking(): void {
    this.isTrackingEnabled = false;
    // Optionally clear session data or stop tracking
  }

  public getSessionInfo() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      sessionStartTime: this.sessionStartTime,
      isTrackingEnabled: this.isTrackingEnabled,
      sessionDuration: Date.now() - this.sessionStartTime
    };
  }

  // Real-time analytics data for dashboard
  public async getRealtimeAnalytics() {
    try {
      // Fetch from Supabase directly for real-time data if possible, or use an API endpoint
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100); // Example: fetch last 100 events

      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Real-time analytics error:', error);
      return null;
    }
  }

  public async getAnalyticsOverview(dateRange: string = '7d') {
    try {
      // This would typically query aggregated data from Supabase
      // For now, we'll simulate an API call or implement Supabase queries
      const endDate = new Date();
      const startDate = new Date();
      switch (dateRange) {
        case '1d':
          startDate.setDate(endDate.getDate() - 1);
          break;
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        default:
          startDate.setDate(endDate.getDate() - 7);
      }

      const { data, error } = await supabase
        .from('analytics_events')
        .select('eventType, eventData, timestamp')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString());

      if (error) {
        throw error;
      }

      // Process data to create an overview (e.g., counts of event types)
      const overview = data.reduce((acc, event) => {
        acc[event.eventType] = (acc[event.eventType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return overview;

    } catch (error) {
      console.error('Analytics overview error:', error);
      return null;
    }
  }

  // Cleanup method
  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flushEvents(true);
  }
}

// Export singleton instance
export const analyticsTracker = AnalyticsTracker.getInstance();

// Initialize tracking when module loads
if (typeof window !== 'undefined') {
  // Wait for consent to be loaded
  setTimeout(() => {
    const preferences = CookieManager.getConsentPreferences();
    if (preferences?.analytics) {
      analyticsTracker.enableTracking();
      console.log('Analytics Tracker: Tracking enabled based on user consent');
    }
  }, 1000);
}

console.log('Analytics Tracker: Enhanced tracking system loaded');