
// Enhanced Freeze Prevention and Recovery System
// Prevents page freezing after pop-under ads by properly pausing/resuming operations

class FreezeRecoverySystem {
  private static instance: FreezeRecoverySystem;
  private isPageHidden: boolean = false;
  private isPaused: boolean = false;
  private activeTimers: Set<number> = new Set();
  private activeIntervals: Set<number> = new Set();
  private recoveryInProgress: boolean = false;
  private recoveryDebounceTimer: number | null = null;
  private visibilityChangeCount: number = 0;
  
  static getInstance(): FreezeRecoverySystem {
    if (!FreezeRecoverySystem.instance) {
      FreezeRecoverySystem.instance = new FreezeRecoverySystem();
    }
    return FreezeRecoverySystem.instance;
  }

  initialize() {
    if (typeof window === 'undefined') return;

    console.log('🛡️ Freeze Prevention: System initialized');

    // Track page visibility with IMMEDIATE response
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    }, { capture: true }); // Use capture to run before other handlers

    // Track when page goes to background (for pop-under detection)
    window.addEventListener('blur', () => {
      this.handlePageBlur();
    }, { capture: true });

    // Track when page comes to foreground
    window.addEventListener('focus', () => {
      this.handlePageFocus();
    }, { capture: true });

    // Intercept setTimeout/setInterval to track timers
    this.interceptTimers();

    // Emergency recovery on beforeunload
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }

  private handleVisibilityChange() {
    this.visibilityChangeCount++;
    
    if (document.visibilityState === 'hidden') {
      console.log('🔴 Freeze Prevention: Page HIDDEN - PAUSING all operations');
      this.pauseAllOperations();
      sessionStorage.setItem('page_was_hidden', 'true');
      sessionStorage.setItem('hidden_at', Date.now().toString());
    } else {
      console.log('🟢 Freeze Prevention: Page VISIBLE - RESUMING operations');
      const hiddenAt = sessionStorage.getItem('hidden_at');
      const hiddenDuration = hiddenAt ? Date.now() - parseInt(hiddenAt) : 0;
      
      // If hidden for >500ms, likely an ad
      if (hiddenDuration > 500) {
        console.log(`⚠️ Freeze Prevention: Was hidden for ${hiddenDuration}ms - triggering RECOVERY`);
        this.scheduleRecovery();
      } else {
        this.resumeAllOperations();
      }
    }
  }

  private handlePageBlur() {
    console.log('👁️ Freeze Prevention: Page BLUR detected');
    this.isPageHidden = true;
    this.pauseAllOperations();
  }

  private handlePageFocus() {
    console.log('👁️ Freeze Prevention: Page FOCUS detected');
    this.isPageHidden = false;
    
    // Check if we need recovery
    const wasHidden = sessionStorage.getItem('page_was_hidden');
    if (wasHidden === 'true') {
      this.scheduleRecovery();
    } else {
      this.resumeAllOperations();
    }
  }

  private pauseAllOperations() {
    if (this.isPaused) return;
    
    console.log('⏸️ Freeze Prevention: PAUSING all operations');
    this.isPaused = true;
    
    // Clear ALL active timers/intervals
    this.clearAllTimers();
    
    // Dispatch pause event for React components
    window.dispatchEvent(new CustomEvent('freeze-prevention-pause'));
  }

  private resumeAllOperations() {
    if (!this.isPaused) return;
    
    console.log('▶️ Freeze Prevention: RESUMING operations');
    this.isPaused = false;
    
    // Dispatch resume event for React components
    window.dispatchEvent(new CustomEvent('freeze-prevention-resume'));
  }

  private scheduleRecovery() {
    // Debounce recovery to prevent multiple simultaneous attempts
    if (this.recoveryDebounceTimer) {
      clearTimeout(this.recoveryDebounceTimer);
    }

    this.recoveryDebounceTimer = window.setTimeout(() => {
      this.performRecovery();
    }, 100); // 100ms debounce
  }

  private async performRecovery() {
    if (this.recoveryInProgress) {
      console.log('⏳ Freeze Prevention: Recovery already in progress, skipping');
      return;
    }

    this.recoveryInProgress = true;
    console.log('🔧 Freeze Prevention: Starting COMPREHENSIVE recovery');

    try {
      // Step 1: Clear ALL timers and intervals IMMEDIATELY
      this.clearAllTimers();
      
      // Step 2: Clear all browser-level timers (fallback)
      const maxId = window.setTimeout(() => {}, 0) as unknown as number;
      for (let i = 0; i < maxId; i++) {
        try {
          clearTimeout(i);
        } catch (e) {}
      }
      
      const maxIntervalId = window.setInterval(() => {}, 999999) as unknown as number;
      for (let i = 0; i < maxIntervalId; i++) {
        try {
          clearInterval(i);
        } catch (e) {}
      }

      // Step 3: Remove ALL ad-related scripts and elements
      this.cleanupAdElements();

      // Step 4: Cancel any pending network requests
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CANCEL_PENDING_REQUESTS'
        });
      }

      // Step 5: Clear render-blocking resources
      this.clearRenderBlockers();

      // Step 6: Force garbage collection if available
      if ((window as any).gc) {
        try {
          (window as any).gc();
        } catch (e) {}
      }

      // Step 7: Reset session flags
      sessionStorage.removeItem('page_was_hidden');
      sessionStorage.removeItem('hidden_at');
      sessionStorage.setItem('recovery_completed', 'true');

      // Step 8: Dispatch recovery complete event
      window.dispatchEvent(new CustomEvent('freeze-recovery-complete', {
        detail: { timestamp: Date.now(), visibilityChanges: this.visibilityChangeCount }
      }));

      // Step 9: Resume operations
      this.resumeAllOperations();

      console.log('✅ Freeze Prevention: Recovery completed successfully');

    } catch (error) {
      console.error('❌ Freeze Prevention: Recovery failed', error);
    } finally {
      this.recoveryInProgress = false;
    }
  }

  private clearAllTimers() {
    console.log(`🧹 Freeze Prevention: Clearing ${this.activeTimers.size} timers and ${this.activeIntervals.size} intervals`);
    
    // Clear tracked timers
    this.activeTimers.forEach(id => {
      try {
        clearTimeout(id);
      } catch (e) {}
    });
    this.activeIntervals.forEach(id => {
      try {
        clearInterval(id);
      } catch (e) {}
    });
    
    this.activeTimers.clear();
    this.activeIntervals.clear();
  }

  private cleanupAdElements() {
    console.log('🧹 Freeze Prevention: Removing ad elements');
    
    // Remove ad-related DOM elements
    const selectors = [
      '[data-ad-network]',
      '[class*="adsterra"]',
      '[class*="monetag"]',
      '[id*="ad-"]',
      'iframe[src*="ad"]',
      'script[src*="adsterra"]',
      'script[src*="monetag"]',
      'script[src*="ads"]'
    ];

    selectors.forEach(selector => {
      try {
        document.querySelectorAll(selector).forEach(el => {
          el.remove();
        });
      } catch (e) {
        console.warn('Failed to remove element:', selector, e);
      }
    });
  }

  private clearRenderBlockers() {
    // Remove any elements that might be blocking rendering
    try {
      // Clear stuck modals/overlays
      document.querySelectorAll('[role="dialog"], .modal, .overlay').forEach(el => {
        if (el instanceof HTMLElement) {
          const style = window.getComputedStyle(el);
          if (style.position === 'fixed' || style.position === 'absolute') {
            const zIndex = parseInt(style.zIndex || '0');
            if (zIndex > 1000) { // High z-index might be blocking
              console.log('Removing potential blocker:', el);
              el.remove();
            }
          }
        }
      });
    } catch (e) {
      console.warn('Error clearing render blockers:', e);
    }
  }

  private interceptTimers() {
    if (typeof window === 'undefined') return;

    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;
    const originalClearTimeout = window.clearTimeout;
    const originalClearInterval = window.clearInterval;

    // Intercept setTimeout
    window.setTimeout = ((callback: any, delay?: number, ...args: any[]) => {
      // Don't create new timers when paused (except recovery timer)
      if (this.isPaused && !this.recoveryInProgress) {
        console.log('⏸️ Freeze Prevention: Blocked setTimeout during pause');
        return 0;
      }
      
      const id = originalSetTimeout(callback, delay, ...args);
      this.activeTimers.add(id);
      return id;
    }) as typeof setTimeout;

    // Intercept setInterval
    window.setInterval = ((callback: any, delay?: number, ...args: any[]) => {
      // Don't create new intervals when paused
      if (this.isPaused) {
        console.log('⏸️ Freeze Prevention: Blocked setInterval during pause');
        return 0;
      }
      
      const id = originalSetInterval(callback, delay, ...args);
      this.activeIntervals.add(id);
      return id;
    }) as typeof setInterval;

    // Intercept clearTimeout
    window.clearTimeout = ((id: number) => {
      this.activeTimers.delete(id);
      originalClearTimeout(id);
    }) as typeof clearTimeout;

    // Intercept clearInterval
    window.clearInterval = ((id: number) => {
      this.activeIntervals.delete(id);
      originalClearInterval(id);
    }) as typeof clearInterval;
  }

  public getStatus() {
    return {
      isPageHidden: this.isPageHidden,
      isPaused: this.isPaused,
      recoveryInProgress: this.recoveryInProgress,
      activeTimers: this.activeTimers.size,
      activeIntervals: this.activeIntervals.size,
      visibilityChangeCount: this.visibilityChangeCount
    };
  }

  cleanup() {
    console.log('🧹 Freeze Prevention: System cleanup');
    this.clearAllTimers();
    if (this.recoveryDebounceTimer) {
      clearTimeout(this.recoveryDebounceTimer);
    }
  }
}

// Auto-initialize IMMEDIATELY
if (typeof window !== 'undefined') {
  const freezeRecovery = FreezeRecoverySystem.getInstance();
  freezeRecovery.initialize();
  
  // Expose for debugging
  (window as any).__freezeRecovery = freezeRecovery;
}

export default FreezeRecoverySystem;
