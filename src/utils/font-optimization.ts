// Font optimization utilities for better performance

/**
 * Preload critical fonts for better performance
 */
export function preloadFonts() {
  if (typeof document === 'undefined') return;

  const fonts = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  ];

  fonts.forEach(fontUrl => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = fontUrl;
    link.as = 'style';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

/**
 * Load fonts with font-display: swap for better performance
 */
export function optimizeFontDisplay() {
  if (typeof document === 'undefined') return;

  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2') format('woff2');
    }
  `;
  document.head.appendChild(style);
}

/**
 * Reduce layout shift by calculating font metrics
 */
export function calculateFontMetrics(fontFamily: string) {
  if (typeof window === 'undefined') return { height: 20, lineHeight: 1.5 };

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  if (!context) return { height: 20, lineHeight: 1.5 };

  context.font = `16px ${fontFamily}`;
  const metrics = context.measureText('Ag');
  
  return {
    height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
    lineHeight: 1.5
  };
}