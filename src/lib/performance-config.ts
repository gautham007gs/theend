export const performanceConfig = {
  lcp: {
    targetTime: 1500, // More aggressive for mobile
    criticalImages: ['/kruthika-avatar.svg'],
    preloadFonts: [], // Skip font preload on low-end devices
  },
  
  cls: {
    targetScore: 0.05,
    reserveSpace: true,
    aspectRatios: {
      avatar: '1/1',
      banner: '16/9',
      card: '4/3',
    },
  },
  
  fid: {
    targetTime: 50, // Faster interaction
    deferScripts: true,
    lazyLoadThreshold: '100px', // Reduced for faster loading
  },
  
  inp: {
    targetTime: 100, // Reduced for smoother interaction
    debounceDelay: 150, // Faster debounce
    throttleDelay: 100, // Faster throttle
  },
  
  tbt: {
    targetTime: 150, // Reduced blocking time
    chunkSize: 25, // Smaller chunks for low-end devices
    idleTimeout: 25, // Faster idle timeout
  },
  
  caching: {
    staticAssets: 'public, max-age=31536000, immutable',
    dynamicContent: 'public, max-age=3600, must-revalidate',
    apiResponses: 's-maxage=60, stale-while-revalidate=300',
  },
  
  bundleSplitting: {
    maxInitialRequests: 25,
    minSize: 20000,
    chunks: {
      react: ['react', 'react-dom', 'scheduler'],
      icons: ['lucide-react'],
      recharts: ['recharts'],
      radix: ['@radix-ui/*'],
    },
  },
};

export function getOptimizedImageUrl(src: string, width?: number, quality = 75): string {
  if (src.startsWith('data:') || src.startsWith('blob:')) {
    return src;
  }
  
  if (src.includes('supabase')) {
    const url = new URL(src);
    if (width) url.searchParams.set('width', width.toString());
    url.searchParams.set('quality', quality.toString());
    return url.toString();
  }
  
  return src;
}

export function shouldPreload(assetType: 'font' | 'image' | 'script', assetName: string): boolean {
  const preloadMap = {
    font: ['Inter'],
    image: ['/kruthika-avatar.svg', '/og-image.jpg'],
    script: ['webpack', 'main-app'],
  };
  
  return preloadMap[assetType]?.some(name => assetName.includes(name)) || false;
}

export function getCacheHeaders(contentType: 'static' | 'dynamic' | 'api'): Record<string, string> {
  const headers: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
  };
  
  switch (contentType) {
    case 'static':
      headers['Cache-Control'] = performanceConfig.caching.staticAssets;
      break;
    case 'dynamic':
      headers['Cache-Control'] = performanceConfig.caching.dynamicContent;
      break;
    case 'api':
      headers['Cache-Control'] = performanceConfig.caching.apiResponses;
      break;
  }
  
  return headers;
}
