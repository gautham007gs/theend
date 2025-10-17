
if (typeof window !== 'undefined') {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isLowEndDevice = () => {
    // Detect low-end devices
    const memory = (performance as any).memory;
    const hardwareConcurrency = navigator.hardwareConcurrency || 2;
    return (memory && memory.jsHeapSizeLimit < 1073741824) || hardwareConcurrency <= 2;
  };
  
  if (isMobile) {
    const optimizeForMobile = () => {
      const isLowEnd = isLowEndDevice();
      
      // Disable animations on low-end devices
      if (isLowEnd) {
        document.documentElement.style.setProperty('--animation-duration', '0s');
        document.documentElement.classList.add('reduce-motion');
      }
      
      // Aggressive image optimization
      const images = document.querySelectorAll('img:not([loading])');
      images.forEach((img: Element) => {
        const htmlImg = img as HTMLImageElement;
        const rect = htmlImg.getBoundingClientRect();
        
        // Lazy load everything below fold
        if (rect.top > window.innerHeight) {
          htmlImg.loading = 'lazy';
        } else {
          htmlImg.loading = 'eager';
          if (rect.top < window.innerHeight * 0.5) {
            htmlImg.fetchPriority = 'high';
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
      
      // Clear old messages from memory
      if (isLowEnd) {
        const clearOldMessages = () => {
          const messagesKey = 'messages_kruthika';
          try {
            const saved = localStorage.getItem(messagesKey);
            if (saved) {
              const messages = JSON.parse(saved);
              if (messages.length > 30) {
                localStorage.setItem(messagesKey, JSON.stringify(messages.slice(-30)));
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
