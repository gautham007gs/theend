
// Emergency Recovery System - Last Resort Freeze Prevention
// This will automatically reload the page if recovery fails

class EmergencyRecovery {
  private static instance: EmergencyRecovery;
  private recoveryTimer: NodeJS.Timeout | null = null;
  private isRecovering: boolean = false;

  static getInstance(): EmergencyRecovery {
    if (!EmergencyRecovery.instance) {
      EmergencyRecovery.instance = new EmergencyRecovery();
    }
    return EmergencyRecovery.instance;
  }

  startRecoveryTimeout() {
    if (typeof window === 'undefined') return;
    if (this.isRecovering) return;

    this.isRecovering = true;
    console.log('⏱️ Emergency Recovery: Starting 3-second timeout');

    // Clear any existing timer
    if (this.recoveryTimer) {
      clearTimeout(this.recoveryTimer);
    }

    // Set 3-second emergency reload timer
    this.recoveryTimer = setTimeout(() => {
      const wasHidden = sessionStorage.getItem('page_was_hidden');
      const needsRecovery = sessionStorage.getItem('needs_recovery');
      
      if (wasHidden === 'true' || needsRecovery === 'true') {
        console.error('🚨 Emergency Recovery: Page still frozen after 3s - FORCE RELOAD');
        
        // Clear all flags before reload
        sessionStorage.clear();
        localStorage.setItem('emergency_reload', 'true');
        
        // Force reload
        window.location.reload();
      } else {
        console.log('✅ Emergency Recovery: Page recovered successfully within timeout');
        this.isRecovering = false;
      }
    }, 3000);
  }

  cancelRecoveryTimeout() {
    if (this.recoveryTimer) {
      clearTimeout(this.recoveryTimer);
      this.recoveryTimer = null;
    }
    this.isRecovering = false;
    console.log('✅ Emergency Recovery: Timeout cancelled - recovery successful');
  }

  checkEmergencyReload() {
    if (typeof window === 'undefined') return;
    
    const wasEmergencyReload = localStorage.getItem('emergency_reload');
    if (wasEmergencyReload === 'true') {
      console.log('📢 Page was emergency reloaded - clearing flags');
      localStorage.removeItem('emergency_reload');
      sessionStorage.clear();
    }
  }
}

// Auto-initialize
if (typeof window !== 'undefined') {
  const emergency = EmergencyRecovery.getInstance();
  emergency.checkEmergencyReload();

  // Listen for visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      sessionStorage.setItem('page_was_hidden', 'true');
    } else if (document.visibilityState === 'visible') {
      const wasHidden = sessionStorage.getItem('page_was_hidden');
      if (wasHidden === 'true') {
        console.log('🚨 Emergency Recovery: Initiating emergency timeout');
        emergency.startRecoveryTimeout();
      }
    }
  });

  // Listen for successful recovery
  window.addEventListener('freeze-recovery-complete', () => {
    emergency.cancelRecoveryTimeout();
  });
}

export default EmergencyRecovery;
