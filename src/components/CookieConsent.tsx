"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Cookie, Shield, Heart } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const COOKIE_CONSENT_KEY = 'kruthika_cookie_consent_v2';
const COOKIE_CONSENT_EXPIRY = 365; // days

interface CookieConsentProps {
  className?: string;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ className }) => {
  const [showConsent, setShowConsent] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const hasConsented = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!hasConsented) {
      // Show after a short delay for better UX
      const timer = setTimeout(() => {
        setShowConsent(true);
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const setCookieConsent = (preferences: {
    necessary: boolean;
    analytics: boolean;
    advertising: boolean;
    personalization: boolean;
  }) => {
    const consentData = {
      ...preferences,
      timestamp: new Date().toISOString(),
      version: 'v2'
    };
    
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
    
    // Set cookie with expiry
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + COOKIE_CONSENT_EXPIRY);
    document.cookie = `${COOKIE_CONSENT_KEY}=true; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
    
    hideConsent();
  };

  const handleAcceptAll = () => {
    setCookieConsent({
      necessary: true,
      analytics: true,
      advertising: true,
      personalization: true,
      aiLearning: true,
      intimacyLevel: true
    });
  };

  const handleAcceptNecessary = () => {
    setCookieConsent({
      necessary: true,
      analytics: false,
      advertising: false,
      personalization: false,
      aiLearning: false,
      intimacyLevel: false
    });
  };

  const hideConsent = () => {
    setIsVisible(false);
    setTimeout(() => setShowConsent(false), 300);
  };

  if (!showConsent) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-end justify-center p-2 sm:p-4 pointer-events-none",
        "bg-black/20 backdrop-blur-sm",
        "transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
    >
      <Card className={cn(
        "w-full max-w-lg pointer-events-auto",
        "bg-white/95 backdrop-blur-md border-primary/20 shadow-2xl",
        "transform transition-transform duration-300",
        "max-h-[85vh] overflow-hidden", // Mobile-friendly height
        isVisible ? "translate-y-0" : "translate-y-full"
      )}>
        <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">We value your privacy</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={hideConsent}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content - Compact for mobile */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              We use cookies for personalized AI conversations and service improvement. 
              <span className="hidden sm:inline">Your intimate chats remain private and secure.</span>
            </p>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3 text-primary" />
              <span className="hidden sm:inline">Your data is protected and never shared for marketing</span>
              <span className="sm:hidden">Data protected & private</span>
            </div>
          </div>

          {/* Cookie Types - Compact for mobile */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-center py-0.5">
              <span className="font-medium">✅ Essential</span>
              <span className="text-muted-foreground hidden sm:inline">Always active</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span>📊 Analytics</span>
              <span className="text-muted-foreground hidden sm:inline">Help us improve</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span>🎯 Advertising</span>
              <span className="text-muted-foreground hidden sm:inline">Relevant content</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span>❤️ Personalization</span>
              <span className="text-muted-foreground hidden sm:inline">Customized experience</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span>🧠 AI Learning</span>
              <span className="text-muted-foreground hidden sm:inline">Better conversations</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span>💕 Relationship Memory</span>
              <span className="text-muted-foreground hidden sm:inline">Remember our bond</span>
            </div>
          </div>

          {/* Legal links - Mobile optimized */}
          <div className="flex flex-wrap gap-1 text-xs">
            <span className="text-muted-foreground hidden sm:inline">By accepting, you agree to our</span>
            <span className="text-muted-foreground sm:hidden">Agree to</span>
            <Link 
              href="/legal/privacy" 
              className="text-primary hover:underline font-medium"
            >
              Privacy Policy
            </Link>
            <span className="text-muted-foreground">and</span>
            <Link 
              href="/legal/terms" 
              className="text-primary hover:underline font-medium"
            >
              Terms
            </Link>
          </div>

          {/* Action buttons - Prominent Accept All for mobile */}
          <div className="flex flex-col gap-2 pt-1">
            <Button
              onClick={handleAcceptAll}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base py-3"
              size="lg"
            >
              <Heart className="h-5 w-5 mr-2" />
              Accept All & Start Chatting
            </Button>
            <Button
              onClick={handleAcceptNecessary}
              variant="outline"
              className="w-full text-xs py-2"
              size="sm"
            >
              Only Essential
            </Button>
          </div>

          {/* Trust indicator - Mobile compact */}
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground pt-0">
            <Shield className="h-3 w-3" />
            <span className="hidden sm:inline">Trusted by thousands for private AI conversations</span>
            <span className="sm:hidden">Trusted & secure</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsent;