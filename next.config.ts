
import type {NextConfig} from 'next';

const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY', // Use 'SAMEORIGIN' if you need to embed this app in an iframe on the same domain
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  }
  // Content-Security-Policy is powerful but complex. Add carefully if needed.
  // Example (very restrictive, would need detailed configuration):
  // {
  //   key: 'Content-Security-Policy',
  //   value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://placehold.co; font-src 'self';"
  // }
];

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
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
  // Enable static optimization and ISR
  output: 'standalone',
  
  // Performance optimizations for large scale
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // Keep pages in memory for 60 seconds
    pagesBufferLength: 5, // Number of pages to buffer
  },
  
  
  // HTTP/2 Push optimizations
  httpAgentOptions: {
    keepAlive: true,
  },
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/icons/{{kebabCase member}}',
    },
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
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@supabase/supabase-js'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  serverExternalPackages: ['@google-cloud/vertexai'],
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
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
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
