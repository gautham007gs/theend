class LCPOptimizer {
  private static isInitialized = false;

  static init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    // Prioritize LCP element immediately
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.optimizeLCP());
    } else {
      this.optimizeLCP();
    }
  }

  private static optimizeLCP() {
    // Force immediate render of LCP candidates
    const lcpCandidates = document.querySelectorAll('p.text-xl, h1, img[fetchpriority="high"]');
    lcpCandidates.forEach(el => {
      const element = el as HTMLElement;
      element.style.contentVisibility = 'auto';
      element.style.contain = 'layout';
    });

    // Preconnect to critical origins
    const criticalOrigins = [
      'https://fonts.gstatic.com',
      'https://wubzdjzosbbbghdlfcgc.supabase.co'
    ];

    criticalOrigins.forEach(origin => {
      if (!document.querySelector(`link[href="${origin}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = origin;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    });
  }
}

// Auto-initialize
LCPOptimizer.init();

export default LCPOptimizer;