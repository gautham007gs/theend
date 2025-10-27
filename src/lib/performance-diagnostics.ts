
// Advanced performance diagnostics and monitoring
export class PerformanceDiagnostics {
  private static metrics: Map<string, number[]> = new Map();
  private static observers: PerformanceObserver[] = [];

  // Core Web Vitals monitoring
  static initializeWebVitals() {
    if (typeof window === 'undefined') return;

    // LCP (Largest Contentful Paint)
    this.observeLCP();
    
    // FID (First Input Delay)
    this.observeFID();
    
    // CLS (Cumulative Layout Shift)
    this.observeCLS();
    
    // INP (Interaction to Next Paint)
    this.observeINP();
    
    // TTFB (Time to First Byte)
    this.observeTTFB();
  }

  private static observeLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        const lcp = lastEntry.renderTime || lastEntry.loadTime;
        this.recordMetric('LCP', lcp);
        
        console.log(`📊 LCP: ${lcp.toFixed(2)}ms ${this.getScoreEmoji(lcp, 2500, 4000)}`);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('LCP observer not supported');
    }
  }

  private static observeFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime;
          this.recordMetric('FID', fid);
          console.log(`📊 FID: ${fid.toFixed(2)}ms ${this.getScoreEmoji(fid, 100, 300)}`);
        });
      });
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('FID observer not supported');
    }
  }

  private static observeCLS() {
    let clsValue = 0;
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.recordMetric('CLS', clsValue);
            console.log(`📊 CLS: ${clsValue.toFixed(3)} ${this.getScoreEmoji(clsValue * 1000, 100, 250)}`);
          }
        });
      });
      observer.observe({ entryTypes: ['layout-shift'], buffered: true });
      this.observers.push(observer);
    } catch (e) {
      console.warn('CLS observer not supported');
    }
  }

  private static observeINP() {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          const inp = entry.duration;
          this.recordMetric('INP', inp);
          console.log(`📊 INP: ${inp.toFixed(2)}ms ${this.getScoreEmoji(inp, 200, 500)}`);
        });
      });
      observer.observe({ entryTypes: ['event'], buffered: true });
      this.observers.push(observer);
    } catch (e) {
      console.warn('INP observer not supported');
    }
  }

  private static observeTTFB() {
    if (typeof window === 'undefined') return;
    
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const ttfb = navigation.responseStart - navigation.requestStart;
        this.recordMetric('TTFB', ttfb);
        console.log(`📊 TTFB: ${ttfb.toFixed(2)}ms ${this.getScoreEmoji(ttfb, 800, 1800)}`);
      }
    });
  }

  // Resource timing analysis
  static analyzeResourceLoading() {
    if (typeof window === 'undefined') return;

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const analysis = {
      scripts: [] as any[],
      styles: [] as any[],
      images: [] as any[],
      fonts: [] as any[],
      total: resources.length
    };

    resources.forEach((resource) => {
      const data = {
        name: resource.name.split('/').pop(),
        duration: resource.duration,
        size: (resource as any).transferSize || 0,
        cached: (resource as any).transferSize === 0
      };

      if (resource.name.includes('.js')) analysis.scripts.push(data);
      else if (resource.name.includes('.css')) analysis.styles.push(data);
      else if (resource.name.match(/\.(png|jpg|jpeg|gif|webp|svg)/)) analysis.images.push(data);
      else if (resource.name.match(/\.(woff|woff2|ttf)/)) analysis.fonts.push(data);
    });

    console.log('📦 Resource Analysis:', {
      totalResources: analysis.total,
      scripts: `${analysis.scripts.length} (${this.getTotalSize(analysis.scripts)}KB)`,
      styles: `${analysis.styles.length} (${this.getTotalSize(analysis.styles)}KB)`,
      images: `${analysis.images.length} (${this.getTotalSize(analysis.images)}KB)`,
      fonts: `${analysis.fonts.length} (${this.getTotalSize(analysis.fonts)}KB)`
    });

    return analysis;
  }

  // Memory monitoring
  static monitorMemory() {
    if (typeof window === 'undefined' || !(performance as any).memory) return;

    const memory = (performance as any).memory;
    const used = (memory.usedJSHeapSize / 1048576).toFixed(2);
    const total = (memory.totalJSHeapSize / 1048576).toFixed(2);
    const limit = (memory.jsHeapSizeLimit / 1048576).toFixed(2);

    console.log(`🧠 Memory: ${used}MB / ${total}MB (Limit: ${limit}MB)`);

    return { used: parseFloat(used), total: parseFloat(total), limit: parseFloat(limit) };
  }

  // Network quality detection
  static detectNetworkQuality() {
    if (typeof navigator === 'undefined' || !(navigator as any).connection) return;

    const connection = (navigator as any).connection;
    console.log('📡 Network:', {
      type: connection.effectiveType,
      downlink: `${connection.downlink}Mbps`,
      rtt: `${connection.rtt}ms`,
      saveData: connection.saveData
    });

    return {
      type: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };
  }

  // Generate performance report
  static generateReport() {
    console.log('\n🎯 PERFORMANCE DIAGNOSTICS REPORT');
    console.log('═'.repeat(50));
    
    this.analyzeResourceLoading();
    this.monitorMemory();
    this.detectNetworkQuality();
    
    console.log('\n📊 Core Web Vitals Summary:');
    ['LCP', 'FID', 'CLS', 'INP', 'TTFB'].forEach(metric => {
      const values = this.metrics.get(metric);
      if (values && values.length > 0) {
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        console.log(`${metric}: ${avg.toFixed(2)}`);
      }
    });
    
    console.log('═'.repeat(50));
  }

  private static recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  private static getScoreEmoji(value: number, good: number, poor: number): string {
    if (value <= good) return '🟢';
    if (value <= poor) return '🟡';
    return '🔴';
  }

  private static getTotalSize(resources: any[]): number {
    return Math.round(resources.reduce((sum, r) => sum + r.size, 0) / 1024);
  }

  static cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Auto-initialize
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    PerformanceDiagnostics.initializeWebVitals();
    
    // Generate report after 5 seconds
    setTimeout(() => {
      PerformanceDiagnostics.generateReport();
    }, 5000);
  });
  
  window.addEventListener('beforeunload', () => {
    PerformanceDiagnostics.cleanup();
  });
}
