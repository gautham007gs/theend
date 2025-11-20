# Kruthika AI Girlfriend Chat Application

## Overview
Kruthika is a Next.js-powered AI girlfriend chat application offering real-time conversations with an AI named Kruthika, utilizing Google's Vertex AI (Gemini). The project aims to provide an engaging and authentic conversational experience, optimized for mobile performance and global SEO. It incorporates modern web technologies and a strong focus on monetization through smart ad integration and a rich user experience.

## User Preferences
- Focus on mobile-first design
- Performance is critical (target 95-100 Lighthouse score)
- Security-first approach with strong CSP
- Real data over mock data
- Clean, maintainable code structure
- Professional, human-like blog content with proper spacing and formatting
- All pages must be indexed and crawlable by search engines

## System Architecture
The application is built on Next.js 15.5.4 with Turbopack, styled using Tailwind CSS and Radix UI components. State management is handled by React Context API, with form handling via React Hook Form and Zod.

**Key Features:**
- **AI Chat System:** Real-time conversations powered by Google Vertex AI (Gemini 2.0 Flash), designed for authentic responses and language adaptation without revealing its AI nature.
- **Admin Panel:** Comprehensive interface for AI profile customization, media asset management (images, audio, video), story management for demo contacts, and usage analytics.
- **Progressive Web App (PWA):** Features offline functionality via a service worker and is installable on mobile devices.
- **Status/Stories Feature:** WhatsApp-style ephemeral stories with image and video support for engaging demo contacts.
- **Monetization:** Ad integration via Adsterra and Monetag networks. CPM optimization code removed to let ad networks handle optimization automatically.
- **SEO & Performance:** Comprehensive SEO optimization targeting "ai girlfriend" keyword globally and locally. Features include:
  - Optimized keyword density (0.5-1.5%) to avoid stuffing while maintaining relevance
  - FAQ schema markup on all blog posts for featured snippets
  - Complete blog indexing via robots.txt and sitemap.ts
  - Unique, SEO-optimized blog content (2000+ words per post)
  - Strategic internal linking across all pages
  - Structured data (JSON-LD) for search engine understanding
  - Mobile-first performance optimizations with adaptive loading
  - Clean, focused metadata (removed keyword stuffing)
  - Professional blog typography following 2025 best practices:
    * 18px base font (16px mobile) with 1.8 line height
    * Generous paragraph spacing (2em bottom, 1.25em top)
    * Large heading margins for clear visual hierarchy
    * Mobile-responsive design for optimal readability
    * Text selection enabled for better UX (removed harmful user-select:none)
- **Security:** Strong Content Security Policy (CSP) headers, XSS protection, Supabase RLS policies, file upload validation, and HTTPS-only enforcement.

**UI/UX:**
- WhatsApp-style UI for features like "View Once" images, enhancing user familiarity.
- Mobile viewport fixes and comprehensive CSS adjustments ensure a seamless experience across devices.

## External Dependencies
- **AI Engine:** Google Vertex AI (Gemini 2.0 Flash)
- **Database & Storage:** Supabase (PostgreSQL, Supabase Storage for media assets)
- **Ad Networks:** Adsterra, Monetag (integrated for monetization)

## Recent Optimizations (Nov 20, 2025)
Comprehensive codebase optimization completed to improve performance, reduce server load, and enhance maintainability:

**Performance & Analytics:**
- Consolidated 3 performance monitoring files into single unified system (src/lib/performance.ts)
- Optimized analytics batching: increased batch size from 10→50 events (5x reduction in API calls)
- Reduced analytics flush interval from 10s→30s (70% reduction in database writes)
- Reduced real-time analytics polling from 5s→30s intervals (6x reduction in server load)

**Code Quality:**
- Removed 8 redundant/duplicate files to improve maintainability
- Consolidated SEO utilities into single comprehensive system (src/lib/seo.ts)
- Eliminated overlapping error recovery systems (freeze-recovery, emergency-recovery)
- Cleaned up all unused imports and references

**Security:**
- Removed invasive DevToolsBlocker (bypassable and poor UX)
- Made screenshot protection optional via NEXT_PUBLIC_ENABLE_SCREENSHOT_PROTECTION env variable
- Simplified security to focus on essential protections only

**Results:**
- 80% reduction in API calls through smarter batching
- 70% reduction in database writes through optimized intervals
- Smaller bundle size from removed duplicate code
- Better user experience from less aggressive security measures
- Improved code maintainability with single source of truth for each utility type