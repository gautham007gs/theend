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
      personalization: true
    });
  };

  const handleAcceptNecessary = () => {
    setCookieConsent({
      necessary: true,
      analytics: false,
      advertising: false,
      personalization: false
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
        "fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none",
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
        isVisible ? "translate-y-0" : "translate-y-full"
      )}>
        <CardContent className="p-6 space-y-4">
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

          {/* Content */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              We use cookies to enhance your experience with Kruthika, provide personalized AI conversations, 
              and analyze usage to improve our service. Your intimate chats remain private and secure.
            </p>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3 text-primary" />
              <span>Your data is protected and never shared for marketing</span>
            </div>
          </div>

          {/* Cookie Types */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="font-medium">✅ Essential cookies</span>
              <span className="text-muted-foreground">Always active</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span>📊 Analytics cookies</span>
              <span className="text-muted-foreground">Help us improve</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span>🎯 Advertising cookies</span>
              <span className="text-muted-foreground">Relevant content</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span>❤️ Personalization cookies</span>
              <span className="text-muted-foreground">Customized experience</span>
            </div>
          </div>

          {/* Legal links */}
          <div className="flex flex-wrap gap-1 text-xs">
            <span className="text-muted-foreground">By accepting, you agree to our</span>
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
              Terms of Service
            </Link>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              onClick={handleAcceptAll}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              size="sm"
            >
              <Heart className="h-4 w-4 mr-2" />
              Accept All & Start Chatting
            </Button>
            <Button
              onClick={handleAcceptNecessary}
              variant="outline"
              className="sm:flex-none text-xs px-3"
              size="sm"
            >
              Only Essential
            </Button>
          </div>

          {/* Trust indicator */}
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground pt-1">
            <Shield className="h-3 w-3" />
            <span>Trusted by thousands for private AI conversations</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsent;