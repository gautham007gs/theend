# Kruthika AI Girlfriend Chat Application

## Overview
A Next.js-powered AI girlfriend chat application featuring real-time conversations with Kruthika using Google's Vertex AI (Gemini). Built with modern web technologies including Next.js 15, Supabase, Tailwind CSS, and Radix UI components.

## Recent Changes (October 2025)

### Performance Optimizations & Media Upload Feature
**Date**: October 6, 2025

#### Completed Enhancements:
1. **Media Upload System**
   - Created `/api/upload` route with Supabase Storage integration
   - Added file upload UI in admin panel for images and audio files
   - Support for 10MB max file size with validation
   - Storage metadata tracking (path, bucket, uploadedAt)
   - Delete functionality with automatic storage cleanup

2. **Mobile Performance Optimizations**
   - Enabled production source maps for better debugging
   - Enhanced CSP headers (removed Trusted Types due to Next.js compatibility)
   - Optimized critical rendering path with resource hints
   - Added mobile-specific performance booster (`lib/performance-boost-mobile.ts`)
   - Preload critical LCP images (avatar) with high priority
   - Optimized image loading with eager/lazy strategies
   - Added font preloading with swap display strategy
   - Inline critical CSS for instant render

3. **Security Enhancements**
   - Strengthened Content Security Policy headers
   - Added comprehensive XSS protection
   - Enabled block-all-mixed-content
   - Enhanced permissions policy

4. **SEO Improvements**
   - Added aria-labels to navigation links
   - Improved descriptive text for all interactive elements
   - Enhanced accessibility attributes

5. **Configuration Optimizations**
   - Enabled typed routes for better type safety
   - Added recharts to package optimization list
   - Configured webpack build workers
   - Strict CSS chunking for better caching

#### Known Issues & Next Steps:
1. **CLS (Cumulative Layout Shift)**: Currently at 1.06 - needs improvement
   - Target: < 0.1 for optimal user experience
   - Cause: Images/components loading without reserved space
   - Solution: Add explicit dimensions to all critical images

2. **Supabase Storage Setup Required** (User Action Needed):
   - Create three buckets in Supabase dashboard:
     - `media-images` (public)
     - `media-audio` (public)
     - `media-videos` (public)
   - Without these, upload functionality will not work

3. **Lighthouse Audit Pending**:
   - Run Lighthouse on mobile device
   - Target: 80+ performance score (ideal: 95-100)
   - Focus areas: LCP, CLS, TBT

#### Files Modified:
- `src/app/api/upload/route.ts` - Upload API endpoint
- `src/types/index.ts` - Enhanced type definitions
- `src/app/admin/profile/page.tsx` - File upload UI
- `next.config.ts` - Performance & security config
- `src/app/layout.tsx` - Critical performance optimizations
- `src/lib/performance-boost-mobile.ts` - Mobile optimizations
- `src/app/page.tsx` - Image optimization attributes

## Project Architecture

### Core Technologies
- **Framework**: Next.js 15.5.4 with Turbopack
- **AI Engine**: Google Vertex AI (Gemini 2.0 Flash)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Styling**: Tailwind CSS + Radix UI
- **State Management**: React Context API
- **Form Handling**: React Hook Form + Zod

### Key Features
1. **AI Chat System**
   - Real-time conversations with Vertex AI
   - Authentic comeback messages
   - Language adaptation (never admits AI nature)
   - Cookie-based session management

2. **Admin Panel**
   - AI profile customization
   - Media asset management (images, audio, video)
   - Status/story management for demo contacts
   - Usage analytics dashboard
   - File upload with Supabase Storage

3. **Progressive Web App**
   - Service worker for offline functionality
   - Installable on mobile devices
   - Optimized for mobile performance

4. **Status/Stories Feature**
   - WhatsApp-style ephemeral stories
   - Global status management
   - Image/video support

## Development

### Environment Setup
```bash
npm install
npm run dev
```

### Required Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `GOOGLE_CLOUD_VERTEX_AI_CREDENTIALS` - Vertex AI service account JSON
- `VERTEX_AI_PROJECT_ID` - Google Cloud project ID
- `VERTEX_AI_LOCATION` - Vertex AI region (e.g., us-central1)

### Performance Monitoring
The app includes built-in performance monitoring:
- Core Web Vitals tracking (LCP, FID, CLS)
- Layout shift detection
- Resource loading optimization
- Mobile-specific optimizations

## User Preferences
- Focus on mobile-first design
- Performance is critical (target 95-100 Lighthouse score)
- Security-first approach with strong CSP
- Real data over mock data
- Clean, maintainable code structure

## Security Notes
- All API keys managed via environment variables
- CSP headers prevent XSS attacks
- Supabase RLS policies control data access
- File upload validation prevents malicious files
- HTTPS-only in production

## Future Enhancements
1. Reduce CLS to < 0.1 with explicit image dimensions
2. Further bundle size optimization
3. Implement code splitting for heavy components
4. Add service worker caching strategies
5. Optimize Time to Interactive (TTI)
