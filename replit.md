# Maya Chat - AI Companion Application

## Overview

Maya Chat is an AI-powered conversational application featuring "Kruthika," a 23-year-old Indian AI companion. The application simulates realistic chat experiences with WhatsApp-like UI, multilingual support (English, Hindi, Kannada), emotional state management, and time-based behavioral patterns. Built with Next.js 15, the app integrates Google's Gemini AI through both Genkit framework and direct Google AI SDK implementation, with Supabase for analytics and configuration management.

## Recent Changes (October 1, 2025)

### 🔒 MAJOR SECURITY ENHANCEMENTS - Maximum Protection (October 1, 2025)

Implemented **comprehensive enterprise-grade security** to protect against all major cyber threats:

#### Multi-Layer DDoS Protection
- **Global Rate Limiting**: 10,000 requests/minute application-wide
- **Per-IP Adaptive Limiting**: 30-120 requests/minute based on endpoint
- **Burst Protection**: Blocks rapid-fire attacks (max 20 requests in 10 seconds)
- **Progressive Blocking**: Escalating temporary blocks for repeat offenders
- **IP Reputation System**: 0-100 scoring with automatic blocking at low scores

#### Advanced SQL Injection Protection
- **Pattern Detection**: Blocks SQL commands (SELECT, DROP, UNION, etc.)
- **Comment Blocking**: Prevents SQL comment exploits (--, /*, ;)
- **Boolean Logic Detection**: Catches OR 1=1 and AND 1=1 patterns
- **Schema Protection**: Blocks information_schema access attempts
- **Triple Sanitization**: Three layers of input sanitization before database operations

#### Comprehensive XSS Protection
- **Script Tag Blocking**: All <script> tags blocked
- **Event Handler Blocking**: Blocks onclick, onload, onerror, etc.
- **Protocol Blocking**: Blocks javascript:, vbscript:, data: protocols
- **HTML Entity Encoding**: All user input HTML-encoded
- **Strict CSP Headers**: Content Security Policy enforced

#### CSRF Protection
- **Cryptographic Tokens**: 256-bit random CSRF tokens
- **One-Time Use**: Tokens expire after single use
- **SameSite=Strict**: Strong cookie-based CSRF protection
- **Origin Validation**: Request origin header verification

#### Cookie Security
- **HttpOnly**: Prevents JavaScript access (XSS protection)
- **Secure**: HTTPS-only in production
- **SameSite=Strict**: Prevents CSRF attacks
- **Signed Cookies**: HMAC-SHA256 signatures prevent tampering
- **Session Rotation**: Prevents session fixation attacks

#### Additional Security Measures
- **Bot Detection**: User-agent analysis and behavior patterns
- **Honeypot Fields**: Hidden fields trap automated bots
- **Request Signatures**: HMAC-SHA256 signed requests prevent tampering
- **Security Headers**: Comprehensive HTTP security headers
- **IP Blocking**: Permanent blocklist for severe violators
- **Security Logging**: Complete audit trail of security events

#### Security Files Added
- `src/lib/enhanced-security.ts` - Maximum security implementation
- `src/lib/secure-cookies.ts` - Secure cookie management
- `SECURITY.md` - Complete security documentation

**All API routes and middleware now use triple-layer security protection!**

---

### Latest Updates - Anti-Spam & Cost Optimization (September 30, 2025)
- **Anti-Spam System**: Implemented comprehensive spam detection that blocks users after 3 meaningless messages (single characters, emojis, punctuation only) within 10 seconds to reduce AI costs
- **Rate Limiting**: Added 2-second cooldown between messages to prevent rapid spam submissions
- **Input Validation**: Messages are now limited to 200 characters maximum to optimize token usage
- **Emoji Optimization**: Emoji-only responses now use a local response map instead of consuming AI tokens
- **Cost Reduction**: Smart message filtering prevents meaningless inputs from being sent to AI, significantly reducing operational costs

### WhatsApp-Style UI Enhancements
- **Avatar Zoom View**: Updated avatar zoom modal to match WhatsApp's dark theme with proper colors (#0b141a, #202c33, #00a884)
- **Improved Modal**: Better header and footer design with X close icon instead of arrow
- **Clickable AI Avatars**: AI avatars in chat messages are now clickable to open zoom view, just like WhatsApp
- **Better UX**: Enhanced modal layout with improved spacing and visual hierarchy

### Mobile Performance Optimizations (Enhanced)
- **GPU Acceleration**: Added enhanced touch event optimization with hardware acceleration for smooth interactions
- **Viewport Settings**: Improved mobile viewport configuration for better rendering
- **Touch Responsiveness**: Eliminated tap highlighting and improved touch feedback across all device types
- **Scrolling Performance**: Optimized scroll behavior for smoother chat experience on mobile devices

### SEO Improvements (Enhanced)
- **Enhanced Metadata**: Added metadataBase, applicationName, and category fields for better search visibility
- **Google Bot Optimization**: Improved Google-specific settings and robots configuration
- **Better Indexing**: Optimized metadata structure for improved search engine crawling

### Critical Bug Fixes
- **Fixed Duplicate Message ID Bug**: Implemented UUID-based message ID generation using `crypto.randomUUID()` to prevent Supabase constraint violations
- **Fixed Analytics Tracking**: Corrected message.media reference to message.userImageUrl in ChatView.tsx to prevent TypeScript errors
- **Fixed Next.js Configuration Issues**: Removed duplicate `compress` property in next.config.ts
- **Migrated Turbopack Configuration**: Moved from deprecated `experimental.turbo` to stable `turbopack` configuration
- **Fixed Cross-Origin Warnings**: Updated `allowedDevOrigins` with current Replit domain
- **Resolved Hydration Errors**: Wrapped all Recharts ResponsiveContainer components with ClientOnly to prevent server/client HTML mismatches
- **Fixed TypeScript Errors**: Corrected class/className issues in all blog pages

### Performance Enhancements
- **Code Splitting**: Enhanced webpack configuration for optimal code splitting with vendor and common chunk strategies
- **CSS Optimization**: Enabled `optimizeCss` experimental flag for smaller CSS bundles
- **Package Import Optimization**: Optimized imports for lucide-react, recharts, @supabase/supabase-js, @radix-ui packages
- **Skeleton Loaders**: Created comprehensive skeleton components (ChatSkeleton, AnalyticsSkeleton, BlogSkeleton, ProfileSkeleton) instead of plain "Loading..." text
- **Lazy Loading**: Added loading.tsx files with skeleton loaders for maya-chat and admin/analytics routes

### Configuration Updates
- Next.js now uses stable Turbopack with optimizeCss enabled for faster development builds
- Cross-origin requests properly configured for Replit environment
- Deployment ready with proper build and start commands
- Enhanced security headers and CSRF protection already in place

### Known Issues Requiring Setup
- Supabase database tables need to be created (see SUPABASE_SETUP.md for SQL scripts)
- Environment variables NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY need to be configured

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with React 18, using App Router architecture
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom WhatsApp-inspired green theme
- **State Management**: React Context API for global state (AI Profile, Ad Settings, Media Assets, Global Status)
- **Type Safety**: TypeScript with strict configuration

### Backend Architecture
- **AI Integration**: Dual approach using Google Genkit framework and direct Google AI SDK (@google/generative-ai)
- **AI Models**: Gemini 2.0 Flash, Gemini 1.5 Pro, and Gemini 1.5 Flash 8B
- **Server Actions**: Next.js server actions for AI communication
- **Authentication**: Service account-based Google Cloud authentication
- **Error Handling**: Graceful fallbacks from Genkit to direct Google AI implementation

### Data Storage Solutions
- **Primary Database**: Supabase (PostgreSQL) for analytics, global configurations, and user activity tracking
- **Local Storage**: Browser localStorage for chat messages, user preferences, and session data
- **Configuration Management**: Centralized app configurations stored in Supabase with local fallbacks

### AI Personality System
- **Emotional State Simulation**: Dynamic mood tracking and contextual responses
- **Multilingual Support**: Language detection and culturally appropriate responses
- **Behavioral Patterns**: Time-based greetings, typing delays, and proactive messaging
- **Character Consistency**: Maintains 23-year-old Indian girl persona with Hinglish expressions

### Authentication and Authorization
- **Google Cloud**: Service account authentication for AI services
- **Environment Variables**: Secure API key management with multiple fallback keys
- **Client-side Security**: No authentication required for end users

### Advertising Integration
- **Ad Networks**: Adsterra and Monetag integration with configurable settings
- **Ad Types**: Banner ads, native banners, social bars, and pop-under advertisements
- **Smart Triggering**: Message-based, time-based, and user activity-based ad display logic
- **Revenue Optimization**: Rotational ad display with daily and session limits

## External Dependencies

### Core AI Services
- **Google AI Platform**: Gemini models via Google AI SDK and Vertex AI
- **Google Genkit**: AI flow orchestration framework (with fallback mechanisms)

### Database and Analytics
- **Supabase**: PostgreSQL database for analytics, configurations, and user tracking
- **Real-time subscriptions**: For live configuration updates

### Advertisement Networks
- **Adsterra**: Display advertising with multiple ad formats
- **Monetag**: Alternative ad network for revenue diversification

### Development and Deployment
- **Vercel**: Deployment platform (configured for production)
- **Replit**: Development environment with custom server configurations

### UI and Styling
- **Radix UI**: Headless component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library for consistent iconography

### Utilities and Tools
- **TanStack Query**: Data fetching and caching (configured but not actively used)
- **date-fns**: Date manipulation and formatting
- **clsx/twMerge**: Dynamic class name handling