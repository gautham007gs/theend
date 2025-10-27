
type ConnectionQuality = 'excellent' | 'good' | 'fair' | 'poor' | 'offline';

interface ConnectionMetrics {
  quality: ConnectionQuality;
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

class ConnectionMonitor {
  private static instance: ConnectionMonitor;
  private quality: ConnectionQuality = 'good';
  private listeners: ((metrics: ConnectionMetrics) => void)[] = [];

  private constructor() {
    this.initializeMonitoring();
  }

  public static getInstance(): ConnectionMonitor {
    if (!ConnectionMonitor.instance) {
      ConnectionMonitor.instance = new ConnectionMonitor();
    }
    return ConnectionMonitor.instance;
  }

  private initializeMonitoring() {
    if (typeof window === 'undefined' || !('connection' in navigator)) return;

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

    if (connection) {
      this.updateQuality(connection);
      connection.addEventListener('change', () => this.updateQuality(connection));
    }

    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }

  private updateQuality(connection: any) {
    const { effectiveType, downlink, rtt, saveData } = connection;
    
    let quality: ConnectionQuality = 'good';
    
    if (effectiveType === '4g' && downlink > 5) {
      quality = 'excellent';
    } else if (effectiveType === '4g' || (effectiveType === '3g' && downlink > 2)) {
      quality = 'good';
    } else if (effectiveType === '3g' || effectiveType === '2g') {
      quality = 'fair';
    } else if (rtt > 2000 || downlink < 0.5) {
      quality = 'poor';
    }

    this.quality = quality;
    this.notifyListeners({ quality, effectiveType, downlink, rtt, saveData });
  }

  private handleOnline() {
    this.quality = 'good';
    this.notifyListeners({
      quality: 'good',
      effectiveType: 'unknown',
      downlink: 0,
      rtt: 0,
      saveData: false,
    });
  }

  private handleOffline() {
    this.quality = 'offline';
    this.notifyListeners({
      quality: 'offline',
      effectiveType: 'none',
      downlink: 0,
      rtt: 0,
      saveData: false,
    });
  }

  private notifyListeners(metrics: ConnectionMetrics) {
    this.listeners.forEach(listener => listener(metrics));
  }

  public subscribe(callback: (metrics: ConnectionMetrics) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  public getQuality(): ConnectionQuality {
    return this.quality;
  }

  public shouldReduceQuality(): boolean {
    return this.quality === 'poor' || this.quality === 'fair' || this.quality === 'offline';
  }
}

export const connectionMonitor = ConnectionMonitor.getInstance();
