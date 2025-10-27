
"use client";

import React, { useState, useEffect, useRef } from 'react';
import type { AdSettings } from '@/types';
import { useAdSettings } from '@/contexts/AdSettingsContext';
import { cn } from '@/lib/utils';

// GLOBAL singleton flag - only ONE social bar EVER
const SOCIAL_BAR_KEY = '__KRUTHIKA_SOCIAL_BAR_MOUNTED__';
const CLEANUP_TIMER_KEY = '__KRUTHIKA_SOCIAL_BAR_CLEANUP__';

if (typeof window !== 'undefined') {
  (window as any)[SOCIAL_BAR_KEY] = false;
}

// Declare cleanup timer outside component to persist across re-renders
let socialBarCleanupTimer: NodeJS.Timeout | null = null;

const SocialBarAdDisplay: React.FC = () => {
  // IMMEDIATE CHECK: Block render if another instance exists
  if (typeof window !== 'undefined' && (window as any)[SOCIAL_BAR_KEY]) {
    return null;
  }

  const { adSettings, isLoadingAdSettings } = useAdSettings();
  const [isVisible, setIsVisible] = useState(false);
  const [adCodeToInject, setAdCodeToInject] = useState<string | null>(null);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const scriptInjectedRef = useRef(false);
  const mountedRef = useRef(false);
  const instanceIdRef = useRef(Math.random().toString(36).substr(2, 9));

  // Aggressive cleanup function to remove ALL duplicate social bars
  const cleanupOldSocialBars = () => {
    if (socialBarCleanupTimer) {
      clearTimeout(socialBarCleanupTimer);
    }

    socialBarCleanupTimer = setTimeout(() => {
      // Remove any existing social bar containers except current
      const allBars = document.querySelectorAll('.kruthika-social-bar-ad-container');
      allBars.forEach((bar) => {
        if (bar !== adContainerRef.current) {
          console.log('Social Bar: Removing duplicate container', bar);
          bar.remove();
        }
      });

      // Also remove any orphaned ad scripts in body
      const adScripts = document.querySelectorAll('script[src*="socialbar"], script[src*="social-bar"], ins[class*="socialbar"]');
      adScripts.forEach((script, index) => {
        if (index > 0) { // Keep first instance only
          console.log('Social Bar: Removing duplicate ad script', script);
          script.remove();
        }
      });
    }, 100);
  };

  useEffect(() => {
    // CRITICAL: Check global window flag to prevent ANY duplicates
    if (typeof window !== 'undefined') {
      if ((window as any).__SOCIAL_BAR_MOUNTED__) {
        console.warn('Social Bar: BLOCKED - Another instance already mounted globally');
        return;
      }
      
      // Mark as mounted IMMEDIATELY
      (window as any).__SOCIAL_BAR_MOUNTED__ = true;
      mountedRef.current = true;
      
      console.log('Social Bar: First instance mounted successfully');
    }
    
    // Aggressive cleanup on mount
    cleanupOldSocialBars();

    return () => {
      if (socialBarCleanupTimer) {
        clearTimeout(socialBarCleanupTimer);
      }
      if (typeof window !== 'undefined') {
        (window as any).__SOCIAL_BAR_MOUNTED__ = false;
      }
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (isLoadingAdSettings || !adSettings || !adSettings.adsEnabledGlobally) {
      setIsVisible(false);
      setAdCodeToInject(null);
      scriptInjectedRef.current = false;
      return;
    }

    let selectedAdCode = "";
    let selectedNetworkEnabled = false;

    // Prioritize Adsterra Social Bar if both are enabled and have valid code
    if (adSettings.adsterraSocialBarEnabled && adSettings.adsterraSocialBarCode) {
      selectedAdCode = adSettings.adsterraSocialBarCode;
      selectedNetworkEnabled = true;
    } else if (adSettings.monetagSocialBarEnabled && adSettings.monetagSocialBarCode) {
      selectedAdCode = adSettings.monetagSocialBarCode;
      selectedNetworkEnabled = true;
    }
    
    if (selectedNetworkEnabled && selectedAdCode.trim()) {
      // If the code changes, allow re-injection
      if (adCodeToInject !== selectedAdCode) {
        scriptInjectedRef.current = false;
        setAdCodeToInject(selectedAdCode);
      }
      setIsVisible(true);
    } else {
      setAdCodeToInject(null);
      setIsVisible(false);
      scriptInjectedRef.current = false;
    }
  }, [adSettings, isLoadingAdSettings]);

  useEffect(() => {
    // Inject script only when adCodeToInject is set, container is available, and script hasn't been injected yet
    if (adCodeToInject && adContainerRef.current && !scriptInjectedRef.current && mountedRef.current) {
      // Clean up any duplicate social bars first
      cleanupOldSocialBars();
      
      // Clear previous content to handle potential ad code changes
      adContainerRef.current.innerHTML = '';
      
      // Delay injection to ensure DOM is ready
      const injectionTimer = setTimeout(() => {
        if (!adContainerRef.current || !mountedRef.current) return;
        
        try {
          console.log('Social Bar: Injecting ad script...', adCodeToInject.substring(0, 100));
          const fragment = document.createRange().createContextualFragment(adCodeToInject);
          adContainerRef.current.appendChild(fragment);
          scriptInjectedRef.current = true;
          console.log('Social Bar: Script successfully injected into DOM');
          
          // Force execution of any inline scripts
          const scripts = adContainerRef.current.querySelectorAll('script');
          scripts.forEach((oldScript) => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => {
              newScript.setAttribute(attr.name, attr.value);
            });
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            oldScript.parentNode?.replaceChild(newScript, oldScript);
          });
          console.log('Social Bar: Forced script re-execution complete');
          
          // Continuous cleanup monitoring - check every 2 seconds for duplicates
          const cleanupInterval = setInterval(() => {
            cleanupOldSocialBars();
          }, 2000);
          
          // Stop monitoring after 30 seconds
          setTimeout(() => clearInterval(cleanupInterval), 30000);
          
        } catch (e) {
          console.error("Social Bar: Error injecting ad script:", e);
          scriptInjectedRef.current = false;
        }
      }, 500);

      return () => clearTimeout(injectionTimer);
    } else if (!adCodeToInject && adContainerRef.current) {
      // If no ad code is to be injected (e.g., disabled), clear the container
      adContainerRef.current.innerHTML = '';
      scriptInjectedRef.current = false;
    }
  }, [adCodeToInject]);

  if (isLoadingAdSettings || !isVisible || !adCodeToInject) {
    return null; 
  }

  return (
    <div
      ref={adContainerRef}
      data-social-bar-instance={instanceIdRef.current}
      className={cn(
        "kruthika-social-bar-ad-container",
        "!fixed !bottom-0 !left-0 !right-0 !top-[unset]",
        "!z-[95] !w-full !max-h-[120px]",
        "flex justify-center items-end overflow-hidden"
      )}
      style={{ 
        bottom: '0px',
        top: 'unset',
        left: '0px',
        right: '0px',
        position: 'fixed',
        zIndex: 95,
        maxHeight: '120px',
        pointerEvents: 'auto'
      }}
      key={`social-bar-${instanceIdRef.current}`}
    />
  );
};

export default SocialBarAdDisplay;
