
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie, Settings } from 'lucide-react';
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
    <>
      {/* Blurred background overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-40" />
      
      <div 
        className={cn(
          "fixed bottom-4 left-4 right-4 z-50 pointer-events-none",
          "transition-all duration-300 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full",
          className
        )}
      >
        <Card className={cn(
          "w-full max-w-md mx-auto pointer-events-auto",
          "bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl rounded-2xl",
          "transform transition-all duration-300",
          showCustomize ? "max-h-[400px]" : "max-h-[200px]",
          "overflow-hidden"
        )}>
          <CardContent className="p-5 space-y-4">
            {/* Compact Header */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2 bg-[#25D366]/10 rounded-lg">
                <Cookie className="h-5 w-5 text-[#25D366]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">Cookie Settings</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  We use cookies to enhance your chat experience with Kruthika. 
                  <Link href="/legal/privacy" className="text-[#25D366] hover:underline ml-1">
                    Learn more
                  </Link>
                </p>
              </div>
            </div>

            {/* Customize Panel */}
            {showCustomize && (
              <div className="space-y-3 border-t border-gray-100 pt-3 animate-in slide-in-from-top-2 duration-200">
                <div className="space-y-2">
                  {[
                    { name: "Essential", desc: "Required for basic functionality", required: true },
                    { name: "Analytics", desc: "Help us improve our service" },
                    { name: "Personalization", desc: "Customize your experience" },
                    { name: "Marketing", desc: "Show relevant content" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1">
                      <div>
                        <span className="text-xs font-medium text-gray-700">{item.name}</span>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                      {item.required ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Required
                        </span>
                      ) : (
                        <div className="w-8 h-4 bg-[#25D366] rounded-full relative">
                          <div className="w-3 h-3 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button
                  onClick={handleAcceptAll}
                  className="flex-1 bg-[#25D366] hover:bg-[#25D366]/90 text-white text-sm py-2 h-9 font-medium shadow-sm"
                >
                  Accept All
                </Button>
                <Button
                  onClick={toggleCustomize}
                  variant="outline"
                  className="flex-shrink-0 border-gray-300 text-gray-600 hover:bg-gray-50 text-sm py-2 h-9 px-3"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleAcceptNecessary}
                  variant="ghost"
                  className="flex-1 text-gray-600 hover:bg-gray-100 text-xs py-1.5 h-7"
                >
                  Essential Only
                </Button>
                {showCustomize && (
                  <Button
                    onClick={handleAcceptAll}
                    className="flex-1 bg-[#25D366] hover:bg-[#25D366]/90 text-white text-xs py-1.5 h-7"
                  >
                    Save Preferences
                  </Button>
                )}
              </div>
            </div>

            {/* Legal Links */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                By continuing, you agree to our{' '}
                <Link href="/legal/terms" className="text-[#25D366] hover:underline">
                  Terms
                </Link>{' '}
                and{' '}
                <Link href="/legal/privacy" className="text-[#25D366] hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CookieConsent;
