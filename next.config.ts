import type {NextConfig} from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

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
  // Content Security Policy - Balanced security without breaking Next.js
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com https://www.googletagmanager.com https://www.google-analytics.com https://cdn.onesignal.com https://onesignal.com *.onesignal.com *.replit.dev *.replit.app *.adsterra.com *.monetag.io *.propellerads.com *.popads.net *.exoclick.com *.trafficjunky.com https://perchincomenotorious.com https://preferencenail.com https://wayfarerorthodox.com https://weirdopt.com https://skinnycrawlinglax.com https://rashcolonizeexpand.com https://kettledroopingcontinuation.com https://torchfriendlypay.com https://creative-sb1.com https://sourshaped.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
      "img-src 'self' data: blob: https: http: *.supabase.co *.supabase.io https://placehold.co https://i.imghippo.com https://images.unsplash.com",
      "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
      "connect-src 'self' https: wss: *.supabase.co *.supabase.io https://api.openai.com https://generativelanguage.googleapis.com https://cdn.onesignal.com https://onesignal.com *.onesignal.com *.replit.dev *.replit.app *.adsterra.com *.monetag.io https://perchincomenotorious.com https://preferencenail.com https://wayfarerorthodox.com https://weirdopt.com https://skinnycrawlinglax.com https://rashcolonizeexpand.com https://kettledroopingcontinuation.com https://torchfriendlypay.com https://creative-sb1.com https://sourshaped.com",
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
  // Cache Control moved to specific paths (see headers function below)
];

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true, // Skip during build to reduce memory usage (checked in dev)
  },

  eslint: {
    ignoreDuringBuilds: true, // Skip during build to reduce memory usage (checked in dev)
  },

  // Vercel-specific optimizations
  // output: 'standalone', // Disabled for development - only enable for production deployment
  // swcMinify is deprecated in Next.js 14+, SWC is default now
  // Performance optimizations for high traffic and Google rankings
  skipMiddlewareUrlNormalize: true,

  skipTrailingSlashRedirect: true,

  // Enable Gzip/Brotli compression
  compress: true,

  poweredByHeader: false,
  reactStrictMode: true,

  // Disable for faster builds
  productionBrowserSourceMaps: false,

  // Disable for faster compilation
  typedRoutes: false,

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
    reactRemoveProperties: process.env.NODE_ENV === 'production' ? {
      properties: ['^data-test', '^data-testid']
    } : false,
  },

  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
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
  // External packages for server-side rendering
  serverExternalPackages: ['@google-cloud/vertexai', 'google-auth-library'],

  experimental: {
    scrollRestoration: true,

    serverActions: {
      allowedOrigins: ['localhost:3000', '127.0.0.1:3000', '0.0.0.0:3000', 'localhost:5000', '127.0.0.1:5000', '0.0.0.0:5000', '*.replit.dev', '*.replit.app'],
      bodySizeLimit: '2mb',
    },

    optimizePackageImports: [
      'lucide-react',
      '@supabase/supabase-js',
      '@radix-ui/react-dialog',
      '@radix-ui/react-tabs',
      '@radix-ui/react-accordion',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-toast',
      'date-fns',
      'react-hook-form',
      '@hookform/resolvers',
      'zod',
      'recharts'
    ],

    optimizeCss: true,
    webpackBuildWorker: true,
    cssChunking: 'strict',
    inlineCss: true
  },

  // Turbopack configuration 
  turbopack: {
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },

  // Bundle optimization
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Enhanced bundle splitting for production with modern target
      config.target = ['web', 'es2022'];

      // Tree-shake lucide-react and date-fns properly
      config.resolve = config.resolve || {};
      config.resolve.alias = {
        ...config.resolve.alias,
        'lucide-react': 'lucide-react/dist/esm/lucide-react.js',
      };

      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 30,
        minSize: 15000,
        maxSize: 244000,
        cacheGroups: {
          defaultVendors: false,
          default: false,
          // Framework chunks
          framework: {
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
            name: 'framework',
            priority: 50,
            enforce: true,
          },
          // Recharts (admin only - async)
          recharts: {
            test: /[\\/]node_modules[\\/](recharts|d3-)[\\/]/,
            name: 'recharts',
            priority: 45,
            chunks: 'async',
            enforce: true,
          },
          // Icons split by usage
          icons: {
            test: /[\\/]node_modules[\\/](lucide-react)[\\/]/,
            name: 'icons',
            priority: 40,
            maxSize: 50000,
          },
          // Radix UI components
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix',
            priority: 35,
          },
          // Supabase
          supabase: {
            test: /[\\/]node_modules[\\/]@supabase[\\/]/,
            name: 'supabase',
            priority: 30,
          },
          // Other vendors
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module: any) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)?.[1];
              return `vendor.${packageName?.replace('@', '')}`;
            },
            priority: 20,
            minChunks: 1,
            maxSize: 100000,
          },
          // Common chunks
          common: {
            name: 'common',
            minChunks: 2,
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };

      // Enhanced minification with Terser
      config.optimization.minimize = true;
      if (config.optimization.minimizer) {
        config.optimization.minimizer.forEach((minimizer: any) => {
          if (minimizer.constructor.name === 'TerserPlugin') {
            minimizer.options = {
              ...minimizer.options,
              terserOptions: {
                ...minimizer.options?.terserOptions,
                compress: {
                  drop_console: true,
                  drop_debugger: true,
                  pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
                  passes: 2,
                },
                mangle: true,
                format: {
                  comments: false,
                },
              },
              extractComments: false,
            };
          }
        });
      }
    }
    return config;
  },

  // Fix cross-origin warnings for Replit and allow all dev origins
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,

  allowedDevOrigins: [
    ...(process.env.REPLIT_DEV_DOMAIN ? [process.env.REPLIT_DEV_DOMAIN, `https://${process.env.REPLIT_DEV_DOMAIN}`] : []),
    '*.replit.dev',
    '*.replit.app',
    'localhost:5000',
    '127.0.0.1:5000',
    '0.0.0.0:5000'
  ],

  images: {
    formats: ['image/avif', 'image/webp'], // AVIF first for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year for better caching
    dangerouslyAllowSVG: true, // Allow SVG avatars
    loader: 'default',
    unoptimized: false,
    contentDispositionType: 'inline',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wubzdjzosbbbghdlfcgc.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
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
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ],
      },
      {
        // Next.js static files - long cache
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Static image assets - long cache
        source: '/(.*)\\.(jpg|jpeg|png|gif|ico|svg|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // CSS/JS files - long cache
        source: '/(.*)\\.(css|js)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // API routes - no cache
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
      {
        // All other routes (HTML pages) - short cache with revalidation
        source: '/:path*',
        headers: [
          ...securityHeaders.filter(h => h.key !== 'Cache-Control' && h.key !== 'X-Robots-Tag'),
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          },
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

  turbopack: {
    resolveAlias: {
      'lucide-react': 'lucide-react/dist/esm/lucide-react.js'
    }
  }
};

export default withBundleAnalyzer(nextConfig);