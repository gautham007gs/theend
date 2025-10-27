
export class SmartNotificationManager {
  private static instance: SmartNotificationManager;
  private permission: NotificationPermission = 'default';
  private lastNotificationTime = 0;
  private notificationCooldown = 60000; // 1 minute

  private constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  public static getInstance(): SmartNotificationManager {
    if (!SmartNotificationManager.instance) {
      SmartNotificationManager.instance = new SmartNotificationManager();
    }
    return SmartNotificationManager.instance;
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;

    if (this.permission === 'granted') return true;

    const result = await Notification.requestPermission();
    this.permission = result;
    return result === 'granted';
  }

  async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (this.permission !== 'granted') return;

    // Rate limiting
    const now = Date.now();
    if (now - this.lastNotificationTime < this.notificationCooldown) return;
    this.lastNotificationTime = now;

    // Don't show if page is visible
    if (!document.hidden) return;

    const notification = new Notification(title, {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [200, 100, 200],
      ...options,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }

  async notifyNewMessage(aiName: string, preview: string): Promise<void> {
    await this.showNotification(`${aiName} sent a message`, {
      body: preview.substring(0, 100),
      tag: 'new-message',
      requireInteraction: false,
    });
  }
}

export const notificationManager = SmartNotificationManager.getInstance();
