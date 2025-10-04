
'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  connectionLatency: number;
  fps: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
}

interface ResourceTiming {
  name: string;
  duration: number;
  size: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Defer performance optimizer to reduce TBT
    setTimeout(() => {
      import('@/utils/performance-optimization').then(({ PerformanceOptimizer }) => {
        PerformanceOptimizer.getInstance();
      });
    }, 3000);

    // Send performance data to analytics
    const sendPerformanceData = (metrics: PerformanceMetrics) => {
      // Only send if analytics is enabled
      const preferences = localStorage.getItem('cookie_preferences');
      if (preferences && JSON.parse(preferences).analytics) {
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'performance_metrics',
            eventData: {
              loadTime: metrics.loadTime,
              renderTime: metrics.renderTime,
              memoryUsage: metrics.memoryUsage,
              fps: metrics.fps,
              timestamp: Date.now()
            }
          })
        }).catch(console.warn);
      }
    };

    // Enhanced performance metrics collection
    const collectMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const memory = (performance as any).memory;
      
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      const renderTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
      const memoryUsage = memory ? memory.usedJSHeapSize / 1024 / 1024 : 0; // MB
      const timeToInteractive = navigation.loadEventEnd - navigation.fetchStart;
      
      // Collect Web Vitals
      let largestContentfulPaint = 0;
      let firstInputDelay = 0;
      let cumulativeLayoutShift = 0;
      let fps = 0;
      
      // LCP
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        largestContentfulPaint = lastEntry.startTime;
      });
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {}
      
      // FID
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          firstInputDelay = entry.processingStart - entry.startTime;
        });
      });
      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {}
      
      // CLS
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        cumulativeLayoutShift = clsValue;
      });
      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {}
      
      // FPS measurement
      let frames = 0;
      let lastTime = performance.now();
      const measureFPS = () => {
        frames++;
        const currentTime = performance.now();
        if (currentTime >= lastTime + 1000) {
          fps = Math.round((frames * 1000) / (currentTime - lastTime));
          frames = 0;
          lastTime = currentTime;
        }
        requestAnimationFrame(measureFPS);
      };
      requestAnimationFrame(measureFPS);
      
      // Measure API latency
      const startTime = Date.now();
      fetch('/api/test-vertex', { method: 'HEAD' })
        .then(() => {
          const connectionLatency = Date.now() - startTime;
          setTimeout(() => {
            setMetrics({
              loadTime,
              renderTime,
              memoryUsage,
              connectionLatency,
              fps,
              largestContentfulPaint,
              firstInputDelay,
              cumulativeLayoutShift,
              timeToInteractive
            });
          }, 2000); // Wait for metrics to populate
        })
        .catch(() => {
          setTimeout(() => {
            setMetrics({
              loadTime,
              renderTime,
              memoryUsage,
              connectionLatency: -1,
              fps,
              largestContentfulPaint,
              firstInputDelay,
              cumulativeLayoutShift,
              timeToInteractive
            });
          }, 2000);
        });
    };

    // Collect metrics after page load
    if (document.readyState === 'complete') {
      collectMetrics();
    } else {
      window.addEventListener('load', collectMetrics);
    }

    // Show/hide with keyboard shortcut (Ctrl+Shift+P)
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('load', collectMetrics);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isVisible]);

  // Prevent hydration mismatch
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Disable in production to save resources
  if (process.env.NODE_ENV === 'production') return null;
  if (!isClient || !isVisible || !metrics) return null;

  // Performance score calculation
  const calculateScore = () => {
    if (!metrics) return 0;
    let score = 100;
    
    // More precise scoring based on Core Web Vitals
    if (metrics.largestContentfulPaint > 4000) score -= 30;
    else if (metrics.largestContentfulPaint > 2500) score -= 20;
    else if (metrics.largestContentfulPaint > 1500) score -= 10;
    
    if (metrics.firstInputDelay > 300) score -= 25;
    else if (metrics.firstInputDelay > 100) score -= 15;
    else if (metrics.firstInputDelay > 50) score -= 5;
    
    if (metrics.cumulativeLayoutShift > 0.25) score -= 20;
    else if (metrics.cumulativeLayoutShift > 0.1) score -= 15;
    else if (metrics.cumulativeLayoutShift > 0.05) score -= 5;
    
    if (metrics.connectionLatency > 2000) score -= 15;
    else if (metrics.connectionLatency > 1000) score -= 10;
    else if (metrics.connectionLatency > 500) score -= 5;
    
    if (metrics.fps < 20) score -= 15;
    else if (metrics.fps < 30) score -= 10;
    else if (metrics.fps < 50) score -= 5;
    
    if (metrics.memoryUsage > 100) score -= 15;
    else if (metrics.memoryUsage > 50) score -= 10;
    else if (metrics.memoryUsage > 25) score -= 5;
    
    return Math.max(0, score);
  };

  const score = calculateScore();
  const scoreColor = score >= 90 ? 'text-green-400' : score >= 70 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-sm backdrop-blur-sm">
      <div className="mb-3 font-bold flex items-center justify-between">
        Performance Monitor
        <span className={`${scoreColor} font-bold`}>Score: {score}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>Load: {metrics.loadTime.toFixed(0)}ms</div>
        <div>TTI: {metrics.timeToInteractive.toFixed(0)}ms</div>
        <div>LCP: {metrics.largestContentfulPaint.toFixed(0)}ms</div>
        <div>FID: {metrics.firstInputDelay.toFixed(0)}ms</div>
        <div>CLS: {metrics.cumulativeLayoutShift.toFixed(3)}</div>
        <div>FPS: {metrics.fps}</div>
        <div>Memory: {metrics.memoryUsage.toFixed(1)}MB</div>
        <div>
          API: {metrics.connectionLatency === -1 ? 'Failed' : `${metrics.connectionLatency}ms`}
        </div>
      </div>
      
      <div className="mt-3 text-xs opacity-70 border-t border-gray-600 pt-2">
        <div>Web Vitals: {score >= 90 ? '🟢 Good' : score >= 70 ? '🟡 Needs Work' : '🔴 Poor'}</div>
        <div>Press Ctrl+Shift+P to toggle</div>
      </div>
    </div>
  );
}
