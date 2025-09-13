# Maya Chat - AI Companion Application

## Overview

Maya Chat is an AI-powered conversational application featuring "Kruthika," a 23-year-old Indian AI companion. The application simulates realistic chat experiences with WhatsApp-like UI, multilingual support (English, Hindi, Kannada), emotional state management, and time-based behavioral patterns. Built with Next.js 15, the app integrates Google's Gemini AI through both Genkit framework and direct Google AI SDK implementation, with Supabase for analytics and configuration management.

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