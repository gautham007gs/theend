# Maya Chat - AI Companion Application

## Overview

Maya Chat is an AI-powered conversational application featuring "Kruthika," a 23-year-old Indian AI companion. The application simulates realistic chat experiences with WhatsApp-like UI, multilingual support (English, Hindi, Kannada), emotional state management, and time-based behavioral patterns. Built with Next.js 15, the app integrates Google's Gemini AI through both Genkit framework and direct Google AI SDK implementation, with Supabase for analytics and configuration management.

## Recent Changes (September 30, 2025)

### Critical Bug Fixes
- **Fixed Duplicate Message ID Bug**: Implemented UUID-based message ID generation using `crypto.randomUUID()` to prevent Supabase constraint violations. This eliminates the "duplicate key value violates unique constraint 'messages_log_message_id_key'" error that occurred when users sent messages rapidly
- **Fixed Next.js Configuration Issues**: Removed duplicate `compress` property in next.config.ts
- **Migrated Turbopack Configuration**: Moved from deprecated `experimental.turbo` to stable `turbopack` configuration
- **Fixed Cross-Origin Warnings**: Updated `allowedDevOrigins` with current Replit domain
- **Resolved Hydration Errors**: Wrapped all Recharts ResponsiveContainer components with ClientOnly to prevent server/client HTML mismatches
- **Fixed TypeScript Errors**: Corrected class/className issues in all blog pages

### Mobile Performance Optimizations
- **Passive Event Listeners**: Implemented passive touch event handlers for smoother scrolling on mobile devices
- **Memory Leak Prevention**: Added `useMessageCleanup` hook that monitors message count and warns when it exceeds 150 messages to prevent memory issues in long chat sessions
- **Touch Optimization**: Reduced animation duration on mobile for snappier interactions
- **Bundle Size Reduction**: Enabled CSS optimization and added more packages to `optimizePackageImports` for smaller JavaScript bundles
- **Lazy Loading**: Added loading.tsx files with skeleton loaders for maya-chat and admin/analytics routes

### Performance Enhancements
- **Code Splitting**: Enhanced webpack configuration for optimal code splitting with vendor and common chunk strategies
- **CSS Optimization**: Enabled `optimizeCss` experimental flag for smaller CSS bundles
- **Package Import Optimization**: Optimized imports for lucide-react, recharts, @supabase/supabase-js, @radix-ui packages
- **Skeleton Loaders**: Created comprehensive skeleton components (ChatSkeleton, AnalyticsSkeleton, BlogSkeleton, ProfileSkeleton) instead of plain "Loading..." text

### SEO Improvements
- **Structured Data**: Added JSON-LD structured data to chat page with SoftwareApplication and WebApplication schemas for better search engine visibility
- **Rich Snippets**: Included aggregate ratings, feature lists, and application metadata

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