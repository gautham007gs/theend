
'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  connectionLatency: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Collect performance metrics
    const collectMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const memory = (performance as any).memory;
      
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      const renderTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
      const memoryUsage = memory ? memory.usedJSHeapSize / 1024 / 1024 : 0; // MB
      
      // Measure API latency
      const startTime = Date.now();
      fetch('/api/test-vertex', { method: 'HEAD' })
        .then(() => {
          const connectionLatency = Date.now() - startTime;
          setMetrics({
            loadTime,
            renderTime,
            memoryUsage,
            connectionLatency
          });
        })
        .catch(() => {
          setMetrics({
            loadTime,
            renderTime,
            memoryUsage,
            connectionLatency: -1
          });
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
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('load', collectMetrics);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isVisible]);

  if (!isVisible || !metrics) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-xs">
      <div className="mb-2 font-bold">Performance Metrics</div>
      <div>Load Time: {metrics.loadTime.toFixed(2)}ms</div>
      <div>Render Time: {metrics.renderTime.toFixed(2)}ms</div>
      <div>Memory: {metrics.memoryUsage.toFixed(2)}MB</div>
      <div>
        API Latency: {metrics.connectionLatency === -1 ? 'Failed' : `${metrics.connectionLatency}ms`}
      </div>
      <div className="mt-2 text-xs opacity-70">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  );
}
