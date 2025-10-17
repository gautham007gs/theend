import { NetworkPerformanceOptimizer, DeviceCapabilityDetector, AdaptiveLoadingManager } from './network-performance';

if (typeof window !== 'undefined') {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    const optimizeForMobile = () => {
      AdaptiveLoadingManager.applyAdaptiveSettings();
      
      const isLowEnd = DeviceCapabilityDetector.detect();
      const isSlow = NetworkPerformanceOptimizer.isSlow();
      
      // Disable animations on low-end devices or slow networks
      if (isLowEnd || isSlow) {
        document.documentElement.style.setProperty('--animation-duration', '0s');
        document.documentElement.classList.add('reduce-motion');
        console.log('⚡ Performance: Reduced animations for better performance');
      }
      
      // Aggressive image optimization based on network quality
      const images = document.querySelectorAll('img:not([loading])');
      const imageQuality = NetworkPerformanceOptimizer.getOptimalImageQuality();
      
      images.forEach((img: Element) => {
        const htmlImg = img as HTMLImageElement;
        const rect = htmlImg.getBoundingClientRect();
        const isAboveFold = rect.top < window.innerHeight;
        
        // Lazy load everything below fold
        if (rect.top > window.innerHeight) {
          htmlImg.loading = 'lazy';
        } else {
          htmlImg.loading = 'eager';
          if (rect.top < window.innerHeight * 0.5) {
            (htmlImg as any).fetchPriority = NetworkPerformanceOptimizer.getOptimalFetchPriority(true);
          }
        }
        
        // Set dimensions to prevent layout shift
        if (!htmlImg.width || !htmlImg.height) {
          const computedStyle = window.getComputedStyle(htmlImg);
          const displayWidth = parseInt(computedStyle.width);
          const displayHeight = parseInt(computedStyle.height);
          if (displayWidth && displayHeight) {
            htmlImg.width = displayWidth;
            htmlImg.height = displayHeight;
          }
        }
        
        // Add quality class for CSS optimization
        if (isSlow) {
          htmlImg.classList.add('low-quality-mode');
        }
      });
      
      // Disable video preload on low-end
      const videos = document.querySelectorAll('video');
      videos.forEach((video: HTMLVideoElement) => {
        video.preload = 'none';
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                video.preload = 'metadata';
                observer.unobserve(video);
              }
            });
          }, { rootMargin: '50px' });
          observer.observe(video);
        }
      });
      
      // Font loading optimization
      if ('fonts' in document) {
        (document as any).fonts.ready.then(() => {
          document.documentElement.classList.add('fonts-loaded');
        });
      }
      
      // Clear old messages from memory on low-end devices
      if (isLowEnd) {
        const clearOldMessages = () => {
          const messagesKey = 'messages_kruthika';
          try {
            const saved = localStorage.getItem(messagesKey);
            if (saved) {
              const messages = JSON.parse(saved);
              const maxMessages = DeviceCapabilityDetector.getMaxMessages();
              if (messages.length > maxMessages) {
                localStorage.setItem(messagesKey, JSON.stringify(messages.slice(-maxMessages)));
                console.log(`🧹 Memory: Cleared old messages (kept last ${maxMessages})`);
              }
            }
          } catch (e) {
            console.warn('Memory cleanup failed:', e);
          }
        };
        
        setInterval(clearOldMessages, 60000); // Every minute
      }
    };
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', optimizeForMobile);
    } else {
      optimizeForMobile();
    }
    
    // Reduced mutation observer frequency
    let timeoutId: NodeJS.Timeout;
    const observer = new MutationObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(optimizeForMobile, 200);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}

export {};
