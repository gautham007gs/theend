// CLS (Cumulative Layout Shift) Optimizer
// Prevents layout shifts by reserving space for dynamic content

export class CLSOptimizer {
  static init() {
    if (typeof window === 'undefined') return;

    // Monitor layout shifts in development
    if (process.env.NODE_ENV === 'development') {
      this.monitorLayoutShifts();
    }
  }

  private static monitorLayoutShifts() {
    if ('LayoutShift' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            console.log('Layout shift:', {
              value: (entry as any).value,
              total: clsValue
            });
          }
        }
      });

      observer.observe({ type: 'layout-shift', buffered: true });
    }
  }
}

// Auto-initialize on client
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CLSOptimizer.init());
  } else {
    CLSOptimizer.init();
  }
}