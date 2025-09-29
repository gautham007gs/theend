// Performance-optimized logging utility
const isDevelopment = process.env.NODE_ENV === 'development';
const isClient = typeof window !== 'undefined';

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    // Always log errors, but only in development for non-critical ones
    console.error(...args);
  },
  // Critical logs that should appear in development only
  dev: (...args: any[]) => {
    if (isDevelopment && isClient) {
      console.log(...args);
    }
  }
};