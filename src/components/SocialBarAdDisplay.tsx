
"use client";

import React, { useState, useEffect, useRef } from 'react';
import type { AdSettings } from '@/types';
import { useAdSettings } from '@/contexts/AdSettingsContext';
import { cn } from '@/lib/utils';

// Singleton flag to prevent multiple instances
let socialBarInstanceExists = false;

const SocialBarAdDisplay: React.FC = () => {
  const { adSettings, isLoadingAdSettings } = useAdSettings();
  const [isVisible, setIsVisible] = useState(false);
  const [adCodeToInject, setAdCodeToInject] = useState<string | null>(null);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const scriptInjectedRef = useRef(false);
  const mountedRef = useRef(false);

  // Cleanup function to remove old social bar elements
  const cleanupOldSocialBars = () => {
    // Remove any existing social bar elements from DOM
    const existingBars = document.querySelectorAll('[class*="social-bar"], [id*="social-bar"], .kruthika-social-bar-ad-container');
    existingBars.forEach((bar, index) => {
      // Keep only the first one (current instance)
      if (index > 0) {
        console.log('Social Bar: Removing duplicate element', bar);
        bar.remove();
      }
    });
  };

  useEffect(() => {
    // Prevent multiple instances
    if (socialBarInstanceExists && !mountedRef.current) {
      console.warn('Social Bar: Another instance already exists, skipping...');
      return;
    }
    
    socialBarInstanceExists = true;
    mountedRef.current = true;

    return () => {
      socialBarInstanceExists = false;
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
          
          // Clean up duplicates again after injection
          setTimeout(() => cleanupOldSocialBars(), 1000);
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
      className={cn(
        "kruthika-social-bar-ad-container fixed !bottom-0 !top-auto left-0 right-0 z-[95] w-full max-h-[120px]", // Higher z-index than banner (z-90)
        "flex justify-center items-end overflow-hidden" // Align items to bottom
      )}
      style={{ 
        bottom: '0 !important', 
        top: 'auto !important',
        position: 'fixed !important' as any
      }}
      key={`social-bar-${adCodeToInject?.substring(0,30) || 'empty'}`} // Re-key if ad code changes
    />
  );
};

export default SocialBarAdDisplay;
