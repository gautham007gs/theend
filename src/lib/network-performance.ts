// Network Performance Optimization for Low-End Devices and Slow Networks

export type ConnectionQuality = 'fast' | 'medium' | 'slow' | 'offline';

export class NetworkPerformanceOptimizer {
  private static quality: ConnectionQuality = 'medium';
  private static listeners: ((quality: ConnectionQuality) => void)[] = [];

  static initialize() {
    if (typeof window === 'undefined') return;

    this.detectConnectionQuality();
    this.setupConnectionMonitoring();
  }

  private static detectConnectionQuality(): ConnectionQuality {
    if (typeof window === 'undefined') return 'medium';

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

    if (!connection) {
      const deviceMemory = (navigator as any).deviceMemory || 4;
      const hardwareConcurrency = navigator.hardwareConcurrency || 2;
      
      if (deviceMemory < 2 || hardwareConcurrency < 4) {
        this.quality = 'slow';
      } else if (deviceMemory >= 4 && hardwareConcurrency >= 4) {
        this.quality = 'fast';
      } else {
        this.quality = 'medium';
      }
      return this.quality;
    }

    const effectiveType = connection.effectiveType;
    const saveData = connection.saveData;
    const downlink = connection.downlink || 0;

    if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
      this.quality = 'slow';
    } else if (effectiveType === '3g' || downlink < 1.5) {
      this.quality = 'medium';
    } else if (effectiveType === '4g' || downlink >= 1.5) {
      this.quality = 'fast';
    } else {
      this.quality = 'medium';
    }

    console.log(`📶 Network Quality: ${this.quality} (Type: ${effectiveType}, Downlink: ${downlink}Mbps, Save Data: ${saveData})`);
    return this.quality;
  }

  private static setupConnectionMonitoring() {
    if (typeof window === 'undefined') return;

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

    if (connection) {
      connection.addEventListener('change', () => {
        const oldQuality = this.quality;
        const newQuality = this.detectConnectionQuality();
        
        if (oldQuality !== newQuality) {
          console.log(`📶 Network quality changed: ${oldQuality} → ${newQuality}`);
          this.notifyListeners(newQuality);
        }
      });
    }

    window.addEventListener('online', () => {
      console.log('📶 Connection restored');
      this.detectConnectionQuality();
      this.notifyListeners(this.quality);
    });

    window.addEventListener('offline', () => {
      console.log('📶 Connection lost');
      this.quality = 'offline';
      this.notifyListeners('offline');
    });
  }

  static getQuality(): ConnectionQuality {
    return this.quality;
  }

  static isSlow(): boolean {
    return this.quality === 'slow' || this.quality === 'offline';
  }

  static isMedium(): boolean {
    return this.quality === 'medium';
  }

  static isFast(): boolean {
    return this.quality === 'fast';
  }

  static onQualityChange(callback: (quality: ConnectionQuality) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private static notifyListeners(quality: ConnectionQuality) {
    this.listeners.forEach(listener => listener(quality));
  }

  static getOptimalImageQuality(): number {
    switch (this.quality) {
      case 'slow':
      case 'offline':
        return 40;
      case 'medium':
        return 60;
      case 'fast':
        return 75;
      default:
        return 60;
    }
  }

  static shouldPreloadImages(): boolean {
    return this.quality === 'fast';
  }

  static getVideoQuality(): 'low' | 'medium' | 'high' {
    switch (this.quality) {
      case 'slow':
      case 'offline':
        return 'low';
      case 'medium':
        return 'medium';
      case 'fast':
        return 'high';
      default:
        return 'medium';
    }
  }

  static shouldEnableAnimations(): boolean {
    if (this.quality === 'slow' || this.quality === 'offline') return false;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return !prefersReducedMotion;
  }

  static getOptimalFetchPriority(isAboveFold: boolean): 'high' | 'low' | 'auto' {
    if (this.quality === 'slow') {
      return isAboveFold ? 'high' : 'low';
    }
    return isAboveFold ? 'high' : 'auto';
  }
}

// Low-end device detection
export class DeviceCapabilityDetector {
  private static isLowEnd: boolean | null = null;

  static detect(): boolean {
    if (this.isLowEnd !== null) return this.isLowEnd;
    if (typeof window === 'undefined') return false;

    const deviceMemory = (navigator as any).deviceMemory || 4;
    const hardwareConcurrency = navigator.hardwareConcurrency || 2;
    const hasGPU = this.hasGPUAcceleration();

    this.isLowEnd = 
      deviceMemory < 2 || 
      hardwareConcurrency < 4 || 
      !hasGPU;

    console.log(`📱 Device Capability: ${this.isLowEnd ? 'Low-End' : 'High-End'} (Memory: ${deviceMemory}GB, Cores: ${hardwareConcurrency}, GPU: ${hasGPU})`);
    return this.isLowEnd;
  }

  private static hasGPUAcceleration(): boolean {
    if (typeof window === 'undefined') return false;

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  }

  static shouldUseReducedEffects(): boolean {
    return this.detect();
  }

  static getMaxConcurrentRequests(): number {
    return this.detect() ? 4 : 8;
  }

  static shouldLimitMessageHistory(): boolean {
    return this.detect();
  }

  static getMaxMessages(): number {
    return this.detect() ? 30 : 100;
  }
}

// Adaptive loading manager
export class AdaptiveLoadingManager {
  static applyAdaptiveSettings() {
    if (typeof window === 'undefined') return;

    NetworkPerformanceOptimizer.initialize();
    const isLowEnd = DeviceCapabilityDetector.detect();
    const isSlow = NetworkPerformanceOptimizer.isSlow();

    if (isLowEnd || isSlow) {
      document.documentElement.classList.add('reduce-motion');
      document.documentElement.classList.add('low-performance-mode');
      
      console.log('⚡ Performance Mode: Enabled reduced effects for optimal performance');
    }

    this.optimizeImages();
    this.setupAdaptiveLoading();
  }

  private static optimizeImages() {
    if (typeof window === 'undefined') return;

    const quality = NetworkPerformanceOptimizer.getQuality();
    const images = document.querySelectorAll('img');

    images.forEach((img) => {
      if (img.loading !== 'eager' && img.loading !== 'lazy') {
        const rect = img.getBoundingClientRect();
        const isAboveFold = rect.top < window.innerHeight;
        
        img.loading = isAboveFold ? 'eager' : 'lazy';
        
        if (isAboveFold && quality === 'fast') {
          (img as any).fetchPriority = 'high';
        }
      }

      if (quality === 'slow') {
        img.decoding = 'async';
      }
    });
  }

  private static setupAdaptiveLoading() {
    NetworkPerformanceOptimizer.onQualityChange((quality) => {
      console.log(`🔄 Adapting to ${quality} network...`);
      
      if (quality === 'slow' || quality === 'offline') {
        document.documentElement.classList.add('reduce-motion');
        document.documentElement.classList.add('low-performance-mode');
      } else {
        document.documentElement.classList.remove('low-performance-mode');
        if (NetworkPerformanceOptimizer.shouldEnableAnimations()) {
          document.documentElement.classList.remove('reduce-motion');
        }
      }
    });
  }
}
