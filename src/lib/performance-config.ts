export const performanceConfig = {
  lcp: {
    targetTime: 2500,
    criticalImages: ['/kruthika-avatar.svg', '/og-image.jpg'],
    preloadFonts: ['Inter-400.woff2', 'Inter-600.woff2'],
  },
  
  cls: {
    targetScore: 0.1,
    reserveSpace: true,
    aspectRatios: {
      avatar: '1/1',
      banner: '16/9',
      card: '4/3',
    },
  },
  
  fid: {
    targetTime: 100,
    deferScripts: true,
    lazyLoadThreshold: '200px',
  },
  
  inp: {
    targetTime: 200,
    debounceDelay: 300,
    throttleDelay: 150,
  },
  
  tbt: {
    targetTime: 300,
    chunkSize: 50,
    idleTimeout: 50,
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
