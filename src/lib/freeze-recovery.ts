
// Freeze Detection and Auto-Recovery System
// Detects when the page becomes unresponsive after ad interactions and auto-recovers

class FreezeRecoverySystem {
  private static instance: FreezeRecoverySystem;
  private lastActivityTime: number = Date.now();
  private recoveryAttempts: number = 0;
  private maxRecoveryAttempts: number = 3;
  private freezeThreshold: number = 3000; // 3 seconds of no activity = freeze
  private monitorInterval: NodeJS.Timeout | null = null;

  static getInstance(): FreezeRecoverySystem {
    if (!FreezeRecoverySystem.instance) {
      FreezeRecoverySystem.instance = new FreezeRecoverySystem();
    }
    return FreezeRecoverySystem.instance;
  }

  initialize() {
    if (typeof window === 'undefined') return;

    console.log('🛡️ Freeze Recovery: System initialized');

    // Monitor user activity
    const activityEvents = ['click', 'keypress', 'scroll', 'touchstart', 'mousemove'];
    activityEvents.forEach(event => {
      window.addEventListener(event, () => {
        this.lastActivityTime = Date.now();
      }, { passive: true });
    });

    // Start monitoring for freezes
    this.startMonitoring();

    // Listen for page visibility changes (returning from ad)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        console.log('🛡️ Freeze Recovery: User returned, checking for freeze...');
        this.checkForFreeze();
      }
    });
  }

  private startMonitoring() {
    if (this.monitorInterval) return;

    this.monitorInterval = setInterval(() => {
      this.checkForFreeze();
    }, 1000); // Check every second
  }

  private checkForFreeze() {
    const timeSinceActivity = Date.now() - this.lastActivityTime;

    // If we detect a freeze and user is trying to interact
    if (timeSinceActivity > this.freezeThreshold && this.recoveryAttempts < this.maxRecoveryAttempts) {
      const wasHidden = sessionStorage.getItem('page_was_hidden');
      
      if (wasHidden === 'true') {
        console.warn('⚠️ Freeze Recovery: FREEZE DETECTED after ad interaction!');
        this.performRecovery();
      }
    }
  }

  private async performRecovery() {
    this.recoveryAttempts++;
    console.log(`🔧 Freeze Recovery: Attempt ${this.recoveryAttempts}/${this.maxRecoveryAttempts}`);

    try {
      // Step 1: Clear all timers and intervals
      const highestTimeoutId = setTimeout(() => {}, 0);
      for (let i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i);
      }

      const highestIntervalId = setInterval(() => {}, 99999);
      for (let i = 0; i < highestIntervalId; i++) {
        clearInterval(i);
      }

      // Step 2: Clear Service Worker caches
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CLEAR_ALL_CACHES'
        });
      }

      // Step 3: Clear localStorage corruption
      try {
        const testKey = '__freeze_recovery_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
      } catch (e) {
        console.warn('🔧 Freeze Recovery: localStorage corrupted, clearing...');
        // Keep essential data
        const messagesToKeep = localStorage.getItem('messages_kruthika');
        const moodToKeep = localStorage.getItem('aiMood_kruthika');
        
        localStorage.clear();
        
        if (messagesToKeep) localStorage.setItem('messages_kruthika', messagesToKeep);
        if (moodToKeep) localStorage.setItem('aiMood_kruthika', moodToKeep);
      }

      // Step 4: Force DOM cleanup
      document.querySelectorAll('[data-ad-network]').forEach(el => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });

      // Step 5: Reset session state
      sessionStorage.removeItem('page_was_hidden');
      sessionStorage.setItem('needs_recovery', 'false');

      // Step 6: Trigger React re-render by dispatching custom event
      window.dispatchEvent(new CustomEvent('freeze-recovery-complete'));

      console.log('✅ Freeze Recovery: Recovery completed successfully');
      
      // Reset last activity time
      this.lastActivityTime = Date.now();
      
      // Show user notification
      if (this.recoveryAttempts === 1) {
        this.showRecoveryNotification();
      }

    } catch (error) {
      console.error('❌ Freeze Recovery: Recovery failed', error);
      
      // If recovery fails multiple times, suggest page reload
      if (this.recoveryAttempts >= this.maxRecoveryAttempts) {
        this.suggestPageReload();
      }
    }
  }

  private showRecoveryNotification() {
    if (typeof window === 'undefined') return;

    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 999999;
      font-family: system-ui, -apple-system, sans-serif;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = '✅ Page recovered successfully';
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  private suggestPageReload() {
    if (typeof window === 'undefined') return;

    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      color: #1f2937;
      padding: 24px;
      border-radius: 12px;
      z-index: 999999;
      font-family: system-ui, -apple-system, sans-serif;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      max-width: 90%;
      width: 400px;
      text-align: center;
    `;
    
    notification.innerHTML = `
      <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">Page Recovery Needed</h3>
      <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px;">
        The page became unresponsive. Please refresh to continue.
      </p>
      <button onclick="location.reload()" style="
        background: #3b82f6;
        color: white;
        border: none;
        padding: 10px 24px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      ">Refresh Page</button>
    `;
    
    document.body.appendChild(notification);
  }

  cleanup() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
  }
}

// Auto-initialize
if (typeof window !== 'undefined') {
  const freezeRecovery = FreezeRecoverySystem.getInstance();
  freezeRecovery.initialize();

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    freezeRecovery.cleanup();
  });
}

export default FreezeRecoverySystem;
