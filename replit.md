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
- **Security:** Strong Content Security Policy (CSP) headers, XSS protection, Supabase RLS policies, file upload validation, and HTTPS-only enforcement.

**UI/UX:**
- WhatsApp-style UI for features like "View Once" images, enhancing user familiarity.
- Mobile viewport fixes and comprehensive CSS adjustments ensure a seamless experience across devices.

## External Dependencies
- **AI Engine:** Google Vertex AI (Gemini 2.0 Flash)
- **Database & Storage:** Supabase (PostgreSQL, Supabase Storage for media assets)
- **Ad Networks:** Adsterra, Monetag (integrated for monetization)