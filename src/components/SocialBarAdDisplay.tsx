
"use client";

import React, { useState, useEffect, useRef } from 'react';
import type { AdSettings } from '@/types';
import { useAdSettings } from '@/contexts/AdSettingsContext';
import { cn } from '@/lib/utils';

const SocialBarAdDisplay: React.FC = () => {
  const { adSettings, isLoadingAdSettings } = useAdSettings();
  const [isVisible, setIsVisible] = useState(false);
  const [adCodeToInject, setAdCodeToInject] = useState<string | null>(null);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const scriptInjectedRef = useRef(false); // To prevent re-injecting the same script

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
      }
      setAdCodeToInject(selectedAdCode);
      setIsVisible(true);
    } else {
      setAdCodeToInject(null);
      setIsVisible(false);
      scriptInjectedRef.current = false;
    }
  }, [adSettings, isLoadingAdSettings, adCodeToInject]); // adCodeToInject in dep array for re-eval when it changes

  useEffect(() => {
    // Inject script only when adCodeToInject is set, container is available, and script hasn't been injected yet
    if (adCodeToInject && adContainerRef.current && !scriptInjectedRef.current) {
      // Clear previous content to handle potential ad code changes
      adContainerRef.current.innerHTML = '';
      
      try {
        console.log('Social Bar: Injecting ad script...', adCodeToInject.substring(0, 100));
        const fragment = document.createRange().createContextualFragment(adCodeToInject);
        adContainerRef.current.appendChild(fragment);
        scriptInjectedRef.current = true; // Mark as injected for this specific code
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
      } catch (e) {
        console.error("Social Bar: Error injecting ad script:", e);
        scriptInjectedRef.current = false; // Allow retry on next render
      }
    } else if (!adCodeToInject && adContainerRef.current) {
      // If no ad code is to be injected (e.g., disabled), clear the container
      adContainerRef.current.innerHTML = '';
      scriptInjectedRef.current = false;
    }
  }, [adCodeToInject]); // Re-run effect when adCodeToInject changes

  if (isLoadingAdSettings || !isVisible || !adCodeToInject) {
    return null; 
  }

  return (
    <div
      ref={adContainerRef}
      className={cn(
        "kruthika-social-bar-ad-container fixed bottom-0 left-0 right-0 z-[90] w-full", // Ensure it's above most content
        "flex justify-center items-center" // Basic styling, actual ad script will control appearance
      )}
      key={`social-bar-${adCodeToInject.substring(0,30)}`} // Re-key if ad code changes
    />
  );
};

export default SocialBarAdDisplay;
