if (typeof window !== 'undefined') {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    const optimizeForMobile = () => {
      const images = document.querySelectorAll('img:not([loading])');
      images.forEach((img: Element) => {
        const htmlImg = img as HTMLImageElement;
        if (!htmlImg.loading) {
          const rect = htmlImg.getBoundingClientRect();
          if (rect.top > window.innerHeight * 2) {
            htmlImg.loading = 'lazy';
          } else {
            htmlImg.loading = 'eager';
            if (rect.top < window.innerHeight) {
              htmlImg.fetchPriority = 'high';
            }
          }
        }
        
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
      
      const videos = document.querySelectorAll('video');
      videos.forEach((video: HTMLVideoElement) => {
        video.preload = 'metadata';
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                video.preload = 'auto';
                observer.unobserve(video);
              }
            });
          });
          observer.observe(video);
        }
      });
      
      if ('fonts' in document) {
        (document as any).fonts.ready.then(() => {
          document.documentElement.classList.add('fonts-loaded');
        });
      }
    };
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', optimizeForMobile);
    } else {
      optimizeForMobile();
    }
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          optimizeForMobile();
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}

export {};
