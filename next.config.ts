
import type {NextConfig} from 'next';

const securityHeaders = [
  // XSS Protection
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY', // Prevent clickjacking attacks
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  // HSTS - Force HTTPS in production
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  // Referrer Policy - Limit referrer information
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  // Cross-Origin Protection
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'cross-origin',
  },
  {
    key: 'Cross-Origin-Embedder-Policy',
    value: 'unsafe-none',
  },
  // Permissions Policy - Disable dangerous features
  {
    key: 'Permissions-Policy',
    value: 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
  },
  // Content Security Policy - Comprehensive protection against XSS and data injection
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com https://www.googletagmanager.com https://www.google-analytics.com *.replit.dev *.replit.app https://adsterranet.com http://adsterranet.com https://judicialphilosophical.com http://judicialphilosophical.com https://js.adsterranet.com http://js.adsterranet.com https://cdn.adsterra.com http://cdn.adsterra.com *.adsterra.com *.monetag.io *.propellerads.com *.popads.net *.exoclick.com *.trafficjunky.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
      "img-src 'self' data: blob: https: http: *.supabase.co *.supabase.io https://placehold.co https://i.imghippo.com https://images.unsplash.com",
      "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
      "connect-src 'self' https: wss: *.supabase.co *.supabase.io https://api.openai.com https://generativelanguage.googleapis.com *.replit.dev *.replit.app https://adsterra.com https://monetag.com https://adsterranet.com https://judicialphilosophical.com https://js.adsterranet.com https://cdn.adsterra.com *.adsterra.com *.monetag.io",
      "frame-src 'self' https://www.youtube.com https://player.vimeo.com",
      "media-src 'self' data: blob: https:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "block-all-mixed-content",
    ].join('; '),
  },
  // Additional security headers
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'off',
  },
  {
    key: 'X-Download-Options',
    value: 'noopen',
  },
  {
    key: 'X-Permitted-Cross-Domain-Policies',
    value: 'none',
  },
  // Cache Control for security
  {
    key: 'Cache-Control',
    value: 'public, max-age=31536000, immutable',
  },
];

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: false, // Enable for production safety
  },
  eslint: {
    ignoreDuringBuilds: false, // Enable for code quality
  },
  // Vercel-specific optimizations
  output: 'standalone', // Optimal for serverless deployment
  swcMinify: true, // Use SWC for faster minification
  // Performance optimizations for high traffic and Google rankings
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  reactStrictMode: false, // Disable strict mode to prevent double rendering
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Performance optimizations for large scale
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // Keep pages in memory for 60 seconds
    pagesBufferLength: 5, // Number of pages to buffer
  },
  
  // HTTP/2 Push optimizations
  httpAgentOptions: {
    keepAlive: true,
  },
  // Configure for Replit environment
  experimental: {
    serverActions: {
      allowedOrigins: [
        "*.replit.dev",
        "*.replit.app", 
        "localhost:5000",
        "0.0.0.0:5000"
      ],
      bodySizeLimit: '2mb'
    },
    optimizePackageImports: ['@radix-ui/react-dialog'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'], // AVIF first for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year for better caching
    dangerouslyAllowSVG: false,
    loader: 'default',
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imghippo.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ibb.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'freeimage.host',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: [
          ...securityHeaders,
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Forwarded-Host, X-Forwarded-Proto, X-Forwarded-For, Host, Origin',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ];
  },
  // Additional configuration for Replit compatibility
  async rewrites() {
    return [];
  },
};

export default nextConfig;
