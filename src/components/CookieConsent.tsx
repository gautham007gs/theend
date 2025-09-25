"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie } from 'lucide-react';
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
  const [showCustomize, setShowCustomize] = useState(false);

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
    aiLearning?: boolean;
    intimacyLevel?: boolean;
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

  const toggleCustomize = () => {
    setShowCustomize(!showCustomize);
  };

  if (!showConsent) return null;

  return (
    <div 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 pointer-events-none p-4",
        "transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
    >
      <Card className={cn(
        "w-full max-w-2xl mx-auto pointer-events-auto",
        "bg-white/95 backdrop-blur-md border-primary/20 shadow-2xl rounded-lg",
        "transform transition-transform duration-300",
        showCustomize ? "max-h-[400px]" : "max-h-[200px]", // Dynamic height
        "overflow-hidden transition-all duration-300",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}>
        <CardContent className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Cookie className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground text-lg">We use cookies</h3>
          </div>

          {/* Simplified Content */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            We use cookies to personalize your chat experience and improve our services. You can choose which to allow.
          </p>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleAcceptAll}
              className="bg-[#25D366] hover:bg-[#25D366]/90 text-white font-semibold px-6"
              size="default"
            >
              Accept All
            </Button>
            <Button
              onClick={handleAcceptNecessary}
              variant="outline"
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
              size="default"
            >
              Only Essential
            </Button>
            <Button
              onClick={toggleCustomize}
              variant="ghost"
              className="text-primary hover:bg-primary/5"
              size="default"
            >
              Customize
            </Button>
          </div>

          {/* Expandable Customize Section */}
          {showCustomize && (
            <div className="space-y-3 border-t pt-4 animate-in slide-in-from-top-2 duration-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-1">
                  <span className="font-medium">Essential</span>
                  <span className="text-xs text-muted-foreground bg-green-100 text-green-800 px-2 py-1 rounded">Always active</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>Analytics</span>
                  <span className="text-xs text-muted-foreground">Help us improve</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>Advertising</span>
                  <span className="text-xs text-muted-foreground">Relevant content</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>Personalization</span>
                  <span className="text-xs text-muted-foreground">Customized experience</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>AI Learning</span>
                  <span className="text-xs text-muted-foreground">Better conversations</span>
                </div>
              </div>
              
              {/* Legal links in customize section */}
              <div className="flex flex-wrap gap-1 text-xs pt-2 border-t">
                <span className="text-muted-foreground">By continuing, you agree to our</span>
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsent;