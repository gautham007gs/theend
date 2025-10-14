
// Ad CDN Preloader - Load ad resources early to prevent blank bubbles
export class AdCDNPreloader {
  private static preloadedUrls = new Set<string>();
  
  // Common ad CDN domains to preconnect
  private static AD_CDN_DOMAINS = [
    'https://perchincomenotorious.com',
    'https://judicialphilosophical.com',
    'https://adsterranet.com',
    'https://js.adsterranet.com',
    'https://cdn.adsterra.com',
    'https://monetag.com',
    'https://otieu.com'
  ];

  // Preconnect to ad CDN domains early
  static preconnectAdCDNs() {
    if (typeof window === 'undefined') return;

    this.AD_CDN_DOMAINS.forEach(domain => {
      // DNS prefetch
      const dnsPrefetch = document.createElement('link');
      dnsPrefetch.rel = 'dns-prefetch';
      dnsPrefetch.href = domain;
      document.head.appendChild(dnsPrefetch);

      // Preconnect
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = domain;
      preconnect.crossOrigin = 'anonymous';
      document.head.appendChild(preconnect);
    });

    console.log('Ad CDN preconnect complete - faster ad loading enabled');
  }

  // Extract and preload resources from ad code
  static preloadAdResources(adCode: string, priority: 'high' | 'low' = 'low') {
    if (typeof window === 'undefined' || !adCode) return;

    // Extract script URLs
    const scriptRegex = /src=["']([^"']+\.js[^"']*)["']/g;
    let match;
    
    while ((match = scriptRegex.exec(adCode)) !== null) {
      const url = match[1];
      if (!this.preloadedUrls.has(url)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'script';
        link.href = url;
        link.crossOrigin = 'anonymous';
        if (priority === 'high') {
          (link as any).fetchpriority = 'high';
        }
        document.head.appendChild(link);
        this.preloadedUrls.add(url);
      }
    }

    // Extract image URLs
    const imgRegex = /https?:\/\/[^\s"']+\.(?:jpg|jpeg|png|gif|webp|svg|avif)/gi;
    while ((match = imgRegex.exec(adCode)) !== null) {
      const url = match[0];
      if (!this.preloadedUrls.has(url)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = url;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
        this.preloadedUrls.add(url);
      }
    }
  }

  // Preload all configured ads early
  static async preloadAllAds(adSettings: any) {
    if (!adSettings || !adSettings.adsEnabledGlobally) return;

    const adCodes = [
      adSettings.adsterraBannerCode,
      adSettings.adsterraNativeBannerCode,
      adSettings.adsterraSocialBarCode,
      adSettings.monetagBannerCode,
      adSettings.monetagNativeBannerCode,
      adSettings.monetagSocialBarCode
    ];

    adCodes.forEach(code => {
      if (code && code.trim() && !code.includes('Placeholder')) {
        this.preloadAdResources(code, 'low');
      }
    });

    console.log('Ad resources preloaded - ready for instant display');
  }
}

// Auto-initialize preconnect on load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      AdCDNPreloader.preconnectAdCDNs();
    });
  } else {
    AdCDNPreloader.preconnectAdCDNs();
  }
}
