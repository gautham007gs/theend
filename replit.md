# Maya Chat - AI Companion Application

## Overview
Maya Chat is an AI-powered conversational application featuring "Kruthika," a 23-year-old Indian AI companion. The application simulates realistic chat experiences with a WhatsApp-like UI, multilingual support (English, Hindi, Kannada), emotional state management, and time-based behavioral patterns. Built with Next.js 15, the app integrates Google's Gemini AI through both Genkit framework and direct Google AI SDK implementation, with Supabase for analytics and configuration management. The project aims for global SEO dominance and robust mobile performance, targeting a worldwide audience seeking AI companionship for emotional support and mental well-being.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with React 18, using App Router.
- **UI Components**: Radix UI primitives with shadcn/ui.
- **Styling**: Tailwind CSS with a WhatsApp-inspired green theme.
- **State Management**: React Context API for global state (AI Profile, Ad Settings, Media Assets, Global Status).
- **Type Safety**: TypeScript.
- **UI/UX Decisions**: WhatsApp-like chat interface, avatar zoom view, enhanced mobile viewport, optimized touch responsiveness, and GPU acceleration for smooth interactions. Skeleton loaders are used for improved perceived performance.

### Backend Architecture
- **AI Integration**: Dual approach using Google Genkit framework and direct Google AI SDK (@google/generative-ai).
- **AI Models**: Gemini 2.0 Flash, Gemini 1.5 Pro, and Gemini 1.5 Flash 8B.
- **Server Actions**: Next.js server actions for AI communication.
- **Authentication**: Service account-based Google Cloud authentication for AI services.
- **Error Handling**: Graceful fallbacks from Genkit to direct Google AI implementation.
- **Anti-Spam & Cost Optimization**: Implemented anti-spam system with message filtering, rate limiting, and input validation (200 characters max) to reduce AI token usage. Emoji-only responses use a local response map.
- **Security**: Comprehensive enterprise-grade security including multi-layer DDoS protection, advanced SQL injection protection, XSS protection, CSRF protection, secure cookie management (HttpOnly, Secure, SameSite=Strict, Signed Cookies), bot detection, honeypot fields, and robust security logging.
- **Admin Authentication**: Protected routes for `/admin/analytics` and `/admin/profile` with Supabase authentication, smart redirects, and session management.

### Data Storage Solutions
- **Primary Database**: Supabase (PostgreSQL) for analytics, global configurations, and user activity tracking.
- **Local Storage**: Browser `localStorage` for chat messages, user preferences, and session data.
- **Configuration Management**: Centralized app configurations stored in Supabase with local fallbacks.

### AI Personality System
- **Emotional State Simulation**: Dynamic mood tracking and contextual responses.
- **Multilingual Support**: Language detection and culturally appropriate responses.
- **Behavioral Patterns**: Time-based greetings, typing delays, and proactive messaging.
- **Character Consistency**: Maintains 23-year-old Indian girl persona with Hinglish expressions.

### Advertising Integration
- **Ad Networks**: Adsterra and Monetag integration.
- **Ad Types**: Banner ads, native banners, social bars, and pop-under advertisements.
- **Smart Triggering**: Message-based, time-based, and user activity-based ad display logic.
- **Revenue Optimization**: Rotational ad display with daily and session limits.

### System Design Choices
- **SEO**: Implemented world-class global SEO targeting with primary and long-tail keywords, international SEO architecture (hreflang, geo-targeting metadata, localized content), and enhanced schema markup (Organization, WebSite, WebApplication, HowTo, Review).
- **Performance**: Mobile performance optimizations include service workers for aggressive caching, Core Web Vitals targeting, resource hints, font optimization, image optimization (Next.js Image, AVIF/WebP), code splitting, CSS optimization, and bundle analysis.
- **Deployment**: Configured for autoscale deployment on Vercel with proper build and run commands; also supports Replit environment.

## External Dependencies

### Core AI Services
- **Google AI Platform**: Gemini models via Google AI SDK and Vertex AI.
- **Google Genkit**: AI flow orchestration framework.

### Database and Analytics
- **Supabase**: PostgreSQL database for analytics, configurations, and user tracking, including real-time subscriptions.

### Advertisement Networks
- **Adsterra**: Display advertising.
- **Monetag**: Alternative ad network.

### Development and Deployment
- **Vercel**: Deployment platform.
- **Replit**: Development environment.

### UI and Styling
- **Radix UI**: Headless component primitives.
- **Tailwind CSS**: Utility-first styling framework.
- **Lucide React**: Icon library.

### Utilities and Tools
- **date-fns**: Date manipulation and formatting.
- **clsx/twMerge**: Dynamic class name handling.