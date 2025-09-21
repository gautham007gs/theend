
export const getCacheHeaders = (maxAge: number = 60) => ({
  'Cache-Control': `public, max-age=${maxAge}, s-maxage=${maxAge * 2}`,
  'Vary': 'Accept-Encoding',
});

export const getStaticCacheHeaders = () => ({
  'Cache-Control': 'public, max-age=31536000, immutable',
  'Vary': 'Accept-Encoding',
});

export const getNoCacheHeaders = () => ({
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
});
