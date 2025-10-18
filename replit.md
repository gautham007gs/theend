# Kruthika AI Girlfriend Chat Application

## Overview
Kruthika is a Next.js-powered AI girlfriend chat application offering real-time conversations with an AI named Kruthika, utilizing Google's Vertex AI (Gemini). The project aims to provide an engaging and authentic conversational experience, optimized for mobile performance and global SEO. It incorporates modern web technologies and a strong focus on monetization through smart ad integration and a rich user experience.

## User Preferences
- Focus on mobile-first design
- Performance is critical (target 95-100 Lighthouse score)
- Security-first approach with strong CSP
- Real data over mock data
- Clean, maintainable code structure

## System Architecture
The application is built on Next.js 15.5.4 with Turbopack, styled using Tailwind CSS and Radix UI components. State management is handled by React Context API, with form handling via React Hook Form and Zod.

**Key Features:**
- **AI Chat System:** Real-time conversations powered by Google Vertex AI (Gemini 2.0 Flash), designed for authentic responses and language adaptation without revealing its AI nature.
- **Admin Panel:** Comprehensive interface for AI profile customization, media asset management (images, audio, video), story management for demo contacts, and usage analytics.
- **Progressive Web App (PWA):** Features offline functionality via a service worker and is installable on mobile devices.
- **Status/Stories Feature:** WhatsApp-style ephemeral stories with image and video support for engaging demo contacts.
- **Monetization:** Aggressive ad integration strategy including banner, native, social bar, pop-under, and direct link ads, strategically placed and loaded for maximum revenue while balancing performance.
- **SEO & Performance:** Extensive SEO optimization with trending keywords, FAQ schema for voice search, sitemap cleanup, and comprehensive structured data. Mobile performance is critical, with optimizations like adaptive loading based on network quality, dynamic image adjustment, and preloading strategies.
- **Security:** Strong Content Security Policy (CSP) headers, XSS protection, Supabase RLS policies, file upload validation, and HTTPS-only enforcement.

**UI/UX:**
- WhatsApp-style UI for features like "View Once" images, enhancing user familiarity.
- Mobile viewport fixes and comprehensive CSS adjustments ensure a seamless experience across devices.

## External Dependencies
- **AI Engine:** Google Vertex AI (Gemini 2.0 Flash)
- **Database & Storage:** Supabase (PostgreSQL, Supabase Storage for media assets)
- **Ad Networks:** Adsterra, Monetag (integrated for monetization)