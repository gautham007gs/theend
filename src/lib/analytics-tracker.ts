// Enhanced Analytics Tracking System for Kruthika.fun - Real Data Only
import { CookieManager } from './cookie-manager';
import { supabase } from './supabaseClient';

export interface AnalyticsEvent {
  eventType: 'message_sent' | 'session_start' | 'page_view' | 'ad_interaction' | 'user_action' | 'journey_step';
  eventData: {
    chatId?: string;
    messageId?: string;
    senderType?: 'user' | 'ai';
    content?: string;
    hasImage?: boolean;
    adType?: string;
    action?: string;
    page?: string;
    title?: string;
    referrer?: string;
    deviceType?: string;
    browser?: string;
    countryCode?: string;
    countryName?: string;
    timezone?: string;
    stepName?: string;
    stepOrder?: number;
    [key: string]: any;
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
  private deviceInfo: any = {};

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = this.getUserId();
    this.sessionStartTime = Date.now();
    this.initializeTracking();
    this.startEventQueue();
  }

  public static getInstance(): AnalyticsTracker {
    if (!AnalyticsTracker.instance) {
      AnalyticsTracker.instance = new AnalyticsTracker();
    }
    return AnalyticsTracker.instance;
  }

  private async initializeTracking(): Promise<void> {
    if (typeof window === 'undefined') return;

    const preferences = CookieManager.getConsentPreferences();
    this.isTrackingEnabled = preferences?.analytics || false;

    if (this.isTrackingEnabled) {
      await this.detectDeviceAndLocation();
      await this.trackSessionStart();
      this.setupRealTimeTracking();
    }
  }

  private async detectDeviceAndLocation(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      // Device detection
      const userAgent = navigator.userAgent;
      let deviceType = 'desktop';

      if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
        deviceType = /iPad/.test(userAgent) ? 'tablet' : 'mobile';
      }

      const browser = this.getBrowserName(userAgent);
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const language = navigator.language;
      const screenResolution = `${screen.width}x${screen.height}`;

      this.deviceInfo = {
        deviceType,
        browser,
        timezone,
        language,
        screenResolution,
        userAgent
      };

      // Get location data from IP (using a free service)
      try {
        const response = await fetch('https://ipapi.co/json/');
        const locationData = await response.json();

        this.deviceInfo.countryCode = locationData.country_code;
        this.deviceInfo.countryName = locationData.country_name;
        this.deviceInfo.city = locationData.city;
      } catch (error) {
        console.warn('Could not detect location:', error);
      }

      // Store in user_analytics table
      await supabase.from('user_analytics').upsert({
        session_id: this.sessionId,
        user_pseudo_id: this.userId,
        country_code: this.deviceInfo.countryCode,
        country_name: this.deviceInfo.countryName,
        timezone: this.deviceInfo.timezone,
        device_type: this.deviceInfo.deviceType,
        browser: this.deviceInfo.browser,
        os: this.getOS(),
        screen_resolution: this.deviceInfo.screenResolution,
        language: this.deviceInfo.language
      });

    } catch (error) {
      console.warn('Device detection error:', error);
    }
  }

  private getBrowserName(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  }

  private getOS(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Other';
  }

  private async trackSessionStart(): Promise<void> {
    await this.trackEvent({
      eventType: 'session_start',
      eventData: {
        chatId: 'kruthika_chat',
        ...this.deviceInfo,
        referrer: document.referrer
      },
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: this.sessionStartTime
    });

    // Track cookie consent
    const preferences = CookieManager.getConsentPreferences();
    if (preferences) {
      await supabase.from('cookie_consents').insert({
        session_id: this.sessionId,
        necessary: preferences.necessary,
        analytics: preferences.analytics,
        advertising: preferences.advertising,
        personalization: preferences.personalization,
        ai_learning: preferences.aiLearning || false,
        intimacy_level: preferences.intimacyLevel || false
      });
    }

    // Track user journey step
    await this.trackJourneyStep('landing', 1);
  }

  private setupRealTimeTracking(): void {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.updateSessionDuration();
      }
    });

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.updateSessionDuration();
      this.flushEvents(true);
    });

    // Track user interactions for journey funnel
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.closest('.chat-input') || target.closest('[data-action="send-message"]')) {
        this.trackJourneyStep('message_sent', 3);
      }
    });
  }

  private async updateSessionDuration(): Promise<void> {
    const duration = Math.floor((Date.now() - this.sessionStartTime) / 1000);

    try {
      await supabase
        .from('user_sessions')
        .update({
          ended_at: new Date().toISOString(),
          duration_seconds: duration,
          is_active: false
        })
        .eq('session_id', this.sessionId);
    } catch (error) {
      console.warn('Session update error:', error);
    }
  }

  public async trackEvent(event: AnalyticsEvent): Promise<void> {
    if (!this.isTrackingEnabled) return;

    if (!event.userId) event.userId = this.userId;
    if (!event.sessionId) event.sessionId = this.sessionId;
    if (!event.timestamp) event.timestamp = Date.now();

    this.eventQueue.push(event);

    // For critical events, flush immediately
    if (['message_sent', 'session_start', 'ad_interaction', 'page_view'].includes(event.eventType)) {
      this.flushEvents();
    }
  }

  public async trackMessage(messageId: string, senderType: 'user' | 'ai', content: string, hasImage: boolean = false): Promise<void> {
    await this.trackEvent({
      eventType: 'message_sent',
      eventData: {
        chatId: 'kruthika_chat',
        messageId,
        senderType,
        content: content.substring(0, 500),
        hasImage
      },
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: Date.now()
    });

    // Update session message count
    try {
      await supabase.rpc('increment_session_messages', {
        session_id_param: this.sessionId
      });
    } catch (error) {
      console.warn('Session message count update error:', error);
    }

    // Track journey steps
    if (senderType === 'user') {
      await this.trackJourneyStep('message_sent', 3);

      // Check for long session (15+ minutes)
      if (Date.now() - this.sessionStartTime > 15 * 60 * 1000) {
        await this.trackJourneyStep('long_session', 5);
      }
    }
  }

  public async trackPageView(page: string, title?: string): Promise<void> {
    await this.trackEvent({
      eventType: 'page_view',
      eventData: {
        page,
        title,
        referrer: document.referrer
      },
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: Date.now()
    });
  }

  public async trackAdInteraction(adType: string, action: 'view' | 'click', adNetwork?: string): Promise<void> {
    await this.trackEvent({
      eventType: 'ad_interaction',
      eventData: {
        adType,
        action,
        network: adNetwork || 'unknown',
        page: window.location.pathname
      },
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: Date.now()
    });
  }

  public async trackJourneyStep(stepName: string, order: number): Promise<void> {
    try {
      await supabase.from('user_journey_steps').insert({
        session_id: this.sessionId,
        step_name: stepName,
        step_order: order,
        page_path: window.location.pathname
      });
    } catch (error) {
      console.warn('Journey step tracking error:', error);
    }
  }

  private generateSessionId(): string {
    if (typeof window === 'undefined') return 'server_session';

    let sessionId = sessionStorage.getItem('kruthika_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('kruthika_session_id', sessionId);
    }
    return sessionId;
  }

  private getUserId(): string {
    if (typeof window === 'undefined') return 'server_user';

    let userId = localStorage.getItem('kruthika_user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('kruthika_user_id', userId);
    }
    return userId;
  }

  private startEventQueue() {
    this.flushInterval = setInterval(() => {
      this.flushEvents();
    }, 10000);
  }

  private async flushEvents(immediate = false): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    try {
      for (const event of eventsToSend) {
        await this.processEvent(event);
      }
    } catch (error) {
      console.warn('Error flushing analytics events:', error);
      this.eventQueue.unshift(...eventsToSend);
    }
  }

  private async processEvent(event: AnalyticsEvent): Promise<void> {
    try {
      switch (event.eventType) {
        case 'message_sent':
          await supabase.from('messages_log').insert({
            message_id: event.eventData.messageId,
            sender_type: event.eventData.senderType,
            chat_id: event.eventData.chatId,
            text_content: event.eventData.content,
            has_image: event.eventData.hasImage || false
          });
          break;

        case 'page_view':
          await supabase.from('page_views').insert({
            session_id: event.sessionId,
            page_path: event.eventData.page,
            page_title: event.eventData.title,
            referrer: event.eventData.referrer
          });
          break;

        case 'ad_interaction':
          await supabase.from('ad_interactions').insert({
            session_id: event.sessionId,
            ad_type: event.eventData.adType,
            ad_network: event.eventData.network,
            action_type: event.eventData.action,
            page_path: event.eventData.page,
            user_country: this.deviceInfo.countryCode,
            device_type: this.deviceInfo.deviceType
          });
          break;

        case 'session_start':
          await supabase.from('user_sessions').upsert({
            session_id: event.sessionId,
            user_pseudo_id: event.userId,
            device_type: event.eventData.deviceType,
            browser: event.eventData.browser,
            country_code: event.eventData.countryCode,
            timezone: event.eventData.timezone,
            referrer: event.eventData.referrer
          });
          break;
      }
    } catch (error) {
      console.warn(`Error processing ${event.eventType}:`, error);
    }
  }

  public async getAnalyticsOverview(dateRange: string = '7d') {
    try {
      const response = await fetch(`/api/analytics?type=overview&dateRange=${dateRange}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Analytics overview error:', error);
      return null;
    }
  }

  public async getRealtimeAnalytics() {
    try {
      const response = await fetch('/api/analytics?type=realtime');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Real-time analytics error:', error);
      return null;
    }
  }

  public enableTracking(): void {
    this.isTrackingEnabled = true;
    this.initializeTracking();
  }

  public disableTracking(): void {
    this.isTrackingEnabled = false;
  }

  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    this.updateSessionDuration();
    this.flushEvents(true);
  }
}

export const analyticsTracker = AnalyticsTracker.getInstance();

if (typeof window !== 'undefined') {
  setTimeout(() => {
    const preferences = CookieManager.getConsentPreferences();
    if (preferences?.analytics) {
      analyticsTracker.enableTracking();
    }
  }, 1000);
}