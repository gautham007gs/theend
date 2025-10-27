
type BatteryLevel = 'critical' | 'low' | 'medium' | 'high';

interface BatteryStatus {
  level: BatteryLevel;
  charging: boolean;
  percentage: number;
}

class BatteryOptimizer {
  private static instance: BatteryOptimizer;
  private batteryStatus: BatteryStatus = {
    level: 'high',
    charging: false,
    percentage: 100,
  };
  private listeners: ((status: BatteryStatus) => void)[] = [];

  private constructor() {
    this.initializeBatteryMonitoring();
  }

  public static getInstance(): BatteryOptimizer {
    if (!BatteryOptimizer.instance) {
      BatteryOptimizer.instance = new BatteryOptimizer();
    }
    return BatteryOptimizer.instance;
  }

  private async initializeBatteryMonitoring() {
    if (typeof navigator === 'undefined' || !('getBattery' in navigator)) return;

    try {
      const battery = await (navigator as any).getBattery();
      
      this.updateBatteryStatus(battery);

      battery.addEventListener('levelchange', () => this.updateBatteryStatus(battery));
      battery.addEventListener('chargingchange', () => this.updateBatteryStatus(battery));
    } catch (error) {
      console.log('[Battery Optimizer] Battery API not available');
    }
  }

  private updateBatteryStatus(battery: any) {
    const percentage = Math.round(battery.level * 100);
    let level: BatteryLevel = 'high';

    if (percentage <= 10) {
      level = 'critical';
    } else if (percentage <= 20) {
      level = 'low';
    } else if (percentage <= 50) {
      level = 'medium';
    }

    this.batteryStatus = {
      level,
      charging: battery.charging,
      percentage,
    };

    this.notifyListeners(this.batteryStatus);
  }

  private notifyListeners(status: BatteryStatus) {
    this.listeners.forEach(listener => listener(status));
  }

  public subscribe(callback: (status: BatteryStatus) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  public shouldReduceAnimations(): boolean {
    return !this.batteryStatus.charging && 
           (this.batteryStatus.level === 'critical' || this.batteryStatus.level === 'low');
  }

  public shouldReduceRefreshRate(): boolean {
    return !this.batteryStatus.charging && this.batteryStatus.level === 'critical';
  }

  public getRecommendedRefreshInterval(): number {
    if (this.batteryStatus.charging) return 1000;
    
    switch (this.batteryStatus.level) {
      case 'critical': return 5000;
      case 'low': return 3000;
      case 'medium': return 2000;
      default: return 1000;
    }
  }

  public getBatteryStatus(): BatteryStatus {
    return { ...this.batteryStatus };
  }
}

export const batteryOptimizer = BatteryOptimizer.getInstance();
