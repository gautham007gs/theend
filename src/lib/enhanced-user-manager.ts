'use client';

// Enhanced User Management System
// Prevents conflicts, ensures data isolation, and optimizes session handling

interface UserSession {
  id: string;
  userId: string;
  fingerprint: string;
  startTime: number;
  lastActivity: number;
  messageCount: number;
  isActive: boolean;
  deviceInfo: {
    userAgent: string;
    screen: string;
    timezone: string;
    language: string;
  };
}

interface UserProfile {
  id: string;
  sessionHistory: string[];
  preferences: Record<string, any>;
  analytics: {
    totalSessions: number;
    totalMessages: number;
    averageSessionDuration: number;
    lastSeen: number;
  };
  isolation: {
    namespace: string;
    encryptionKey?: string;
  };
}

export class EnhancedUserManager {
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private static readonly MAX_CONCURRENT_SESSIONS = 3;
  private static userSessions = new Map<string, UserSession>();
  private static userProfiles = new Map<string, UserProfile>();

  // Generate unique, collision-resistant user ID
  static generateUniqueUserId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    const fingerprint = this.generateDeviceFingerprint();
    
    return `usr_${timestamp}_${randomPart}_${fingerprint.substring(0, 8)}`;
  }

  // Enhanced device fingerprinting for user identification
  static generateDeviceFingerprint(): string {
    if (typeof window === 'undefined') {
      return 'server_' + Math.random().toString(36);
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
    }

    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset().toString(),
      navigator.hardwareConcurrency?.toString() || '4',
      canvas.toDataURL().substring(0, 50), // Canvas fingerprint
      navigator.platform,
      navigator.cookieEnabled.toString()
    ];

    return this.hashString(components.join('|'));
  }

  // Create new user session with conflict prevention
  static async createUserSession(existingUserId?: string): Promise<{
    userId: string;
    sessionId: string;
    isNewUser: boolean;
  }> {
    const fingerprint = this.generateDeviceFingerprint();
    const deviceInfo = this.getDeviceInfo();

    // Check for existing user by fingerprint
    let userId = existingUserId;
    let isNewUser = false;

    if (!userId) {
      // Look for existing user with same fingerprint
      const existingSession = Array.from(this.userSessions.values())
        .find(session => session.fingerprint === fingerprint);
      
      if (existingSession) {
        userId = existingSession.userId;
      } else {
        userId = this.generateUniqueUserId();
        isNewUser = true;
      }
    }

    // Clean up old sessions for this user
    await this.cleanupUserSessions(userId);

    // Create new session
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const session: UserSession = {
      id: sessionId,
      userId,
      fingerprint,
      startTime: Date.now(),
      lastActivity: Date.now(),
      messageCount: 0,
      isActive: true,
      deviceInfo
    };

    this.userSessions.set(sessionId, session);

    // Update or create user profile
    await this.updateUserProfile(userId, sessionId, isNewUser);

    // Store in localStorage for persistence
    localStorage.setItem('current_session_id', sessionId);
    localStorage.setItem('current_user_id', userId);

    return { userId, sessionId, isNewUser };
  }

  // Enhanced session validation with security checks
  static validateSession(sessionId: string): {
    isValid: boolean;
    session?: UserSession;
    reason?: string;
  } {
    const session = this.userSessions.get(sessionId);
    
    if (!session) {
      return { isValid: false, reason: 'Session not found' };
    }

    // Check if session expired
    if (Date.now() - session.lastActivity > this.SESSION_TIMEOUT) {
      this.userSessions.delete(sessionId);
      return { isValid: false, reason: 'Session expired' };
    }

    // Check device fingerprint for security
    const currentFingerprint = this.generateDeviceFingerprint();
    if (session.fingerprint !== currentFingerprint) {
      return { isValid: false, reason: 'Device fingerprint mismatch' };
    }

    return { isValid: true, session };
  }

  // User data isolation namespace
  static getUserNamespace(userId: string): string {
    const profile = this.userProfiles.get(userId);
    if (profile?.isolation.namespace) {
      return profile.isolation.namespace;
    }

    // Generate isolated namespace
    const namespace = `ns_${this.hashString(userId)}_${Date.now().toString(36)}`;
    
    if (profile) {
      profile.isolation.namespace = namespace;
    }

    return namespace;
  }

  // Prevent data conflicts between users
  static isolateUserData(userId: string, data: any): any {
    const namespace = this.getUserNamespace(userId);
    
    return {
      ...data,
      _namespace: namespace,
      _userId: userId,
      _timestamp: Date.now(),
      _version: '1.0'
    };
  }

  // Secure user data access
  static accessUserData(userId: string, data: any): any {
    if (!data._namespace || !data._userId) {
      console.warn('UserManager: Accessing non-isolated data');
      return data;
    }

    if (data._userId !== userId) {
      console.error('UserManager: Data access violation prevented');
      return null;
    }

    return data;
  }

  // Update session activity and track usage
  static updateSessionActivity(sessionId: string, messageCount: number = 0): void {
    const session = this.userSessions.get(sessionId);
    if (session) {
      session.lastActivity = Date.now();
      session.messageCount += messageCount;
      
      // Update analytics
      this.updateUserAnalytics(session.userId, {
        lastActivity: session.lastActivity,
        messageCount: session.messageCount
      });
    }
  }

  // Enhanced session cleanup with smart retention
  static async cleanupUserSessions(userId: string): Promise<void> {
    const userSessions = Array.from(this.userSessions.entries())
      .filter(([_, session]) => session.userId === userId)
      .sort(([_, a], [__, b]) => b.lastActivity - a.lastActivity);

    // Keep only the most recent active sessions
    const sessionsToKeep = userSessions.slice(0, this.MAX_CONCURRENT_SESSIONS);
    const sessionsToRemove = userSessions.slice(this.MAX_CONCURRENT_SESSIONS);

    // Remove old sessions
    for (const [sessionId, _] of sessionsToRemove) {
      this.userSessions.delete(sessionId);
    }

    // Mark kept sessions as active
    for (const [sessionId, session] of sessionsToKeep) {
      if (Date.now() - session.lastActivity < this.SESSION_TIMEOUT) {
        session.isActive = true;
      } else {
        this.userSessions.delete(sessionId);
      }
    }
  }

  // User preferences with conflict resolution
  static setUserPreference(userId: string, key: string, value: any): void {
    let profile = this.userProfiles.get(userId);
    if (!profile) {
      profile = this.createUserProfile(userId);
    }

    // Conflict resolution: last write wins with timestamp
    const prefKey = `${key}_${Date.now()}`;
    profile.preferences[key] = {
      value,
      timestamp: Date.now(),
      version: 1
    };

    // Clean up old preference versions
    Object.keys(profile.preferences).forEach(k => {
      if (k.startsWith(key + '_') && k !== key) {
        const prefTimestamp = parseInt(k.split('_').pop() || '0');
        if (Date.now() - prefTimestamp > 24 * 60 * 60 * 1000) { // 24 hours
          delete profile.preferences[k];
        }
      }
    });

    this.userProfiles.set(userId, profile);
  }

  static getUserPreference(userId: string, key: string): any {
    const profile = this.userProfiles.get(userId);
    if (!profile) return null;

    const pref = profile.preferences[key];
    return pref ? pref.value : null;
  }

  // Get comprehensive user statistics
  static getUserStats(userId: string): {
    sessions: number;
    messages: number;
    avgSessionDuration: number;
    lastSeen: number;
    isActive: boolean;
    currentSessions: number;
  } {
    const profile = this.userProfiles.get(userId);
    const activeSessions = Array.from(this.userSessions.values())
      .filter(session => session.userId === userId && session.isActive);

    return {
      sessions: profile?.analytics.totalSessions || 0,
      messages: profile?.analytics.totalMessages || 0,
      avgSessionDuration: profile?.analytics.averageSessionDuration || 0,
      lastSeen: profile?.analytics.lastSeen || 0,
      isActive: activeSessions.length > 0,
      currentSessions: activeSessions.length
    };
  }

  // Detect and prevent user conflicts
  static detectUserConflicts(): Array<{
    type: 'duplicate_session' | 'fingerprint_conflict' | 'data_corruption';
    users: string[];
    severity: 'low' | 'medium' | 'high';
    recommendation: string;
  }> {
    const conflicts = [];
    const fingerprintMap = new Map<string, string[]>();
    
    // Check for fingerprint conflicts
    for (const session of this.userSessions.values()) {
      if (!fingerprintMap.has(session.fingerprint)) {
        fingerprintMap.set(session.fingerprint, []);
      }
      fingerprintMap.get(session.fingerprint)!.push(session.userId);
    }

    for (const [fingerprint, userIds] of fingerprintMap.entries()) {
      if (userIds.length > 1) {
        conflicts.push({
          type: 'fingerprint_conflict' as const,
          users: [...new Set(userIds)],
          severity: 'medium' as const,
          recommendation: 'Merge user sessions or enhance fingerprinting'
        });
      }
    }

    return conflicts;
  }

  private static updateUserProfile(userId: string, sessionId: string, isNewUser: boolean): void {
    let profile = this.userProfiles.get(userId);
    
    if (!profile || isNewUser) {
      profile = this.createUserProfile(userId);
    }

    profile.sessionHistory.push(sessionId);
    profile.sessionHistory = profile.sessionHistory.slice(-10); // Keep last 10 sessions
    profile.analytics.totalSessions++;
    profile.analytics.lastSeen = Date.now();

    this.userProfiles.set(userId, profile);
  }

  private static createUserProfile(userId: string): UserProfile {
    return {
      id: userId,
      sessionHistory: [],
      preferences: {},
      analytics: {
        totalSessions: 0,
        totalMessages: 0,
        averageSessionDuration: 0,
        lastSeen: Date.now()
      },
      isolation: {
        namespace: this.getUserNamespace(userId)
      }
    };
  }

  private static updateUserAnalytics(userId: string, updates: any): void {
    const profile = this.userProfiles.get(userId);
    if (profile) {
      Object.assign(profile.analytics, updates);
    }
  }

  private static getDeviceInfo() {
    if (typeof window === 'undefined') {
      return {
        userAgent: 'server',
        screen: '0x0',
        timezone: 'UTC',
        language: 'en'
      };
    }

    return {
      userAgent: navigator.userAgent,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language
    };
  }

  private static hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }
}

// Auto-cleanup expired sessions every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [sessionId, session] of EnhancedUserManager['userSessions'].entries()) {
      if (now - session.lastActivity > EnhancedUserManager['SESSION_TIMEOUT']) {
        EnhancedUserManager['userSessions'].delete(sessionId);
      }
    }
  }, 5 * 60 * 1000);
}

console.log('Enhanced User Manager: Advanced user management system loaded');