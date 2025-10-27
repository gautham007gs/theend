
export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export class HapticFeedback {
  private static patterns: Record<HapticPattern, number | number[]> = {
    light: 10,
    medium: 20,
    heavy: 50,
    success: [10, 50, 10],
    warning: [20, 100, 20],
    error: [50, 100, 50, 100, 50],
  };

  static trigger(pattern: HapticPattern = 'light'): void {
    if (typeof window === 'undefined') return;
    if (!navigator.vibrate) return;

    const vibrationPattern = this.patterns[pattern];
    navigator.vibrate(vibrationPattern);
  }

  static impact(intensity: 'light' | 'medium' | 'heavy' = 'medium'): void {
    // iOS Haptic Feedback API (if available)
    if ('TapticEngine' in window) {
      try {
        (window as any).TapticEngine.impact({
          style: intensity,
        });
        return;
      } catch (e) {
        // Fallback to vibration
      }
    }

    this.trigger(intensity);
  }

  static selection(): void {
    this.trigger('light');
  }

  static notification(type: 'success' | 'warning' | 'error'): void {
    this.trigger(type);
  }
}
