
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAdSettings } from '@/contexts/AdSettingsContext';
import { cn } from '@/lib/utils';

const SocialBarAdDisplay: React.FC = () => {
  const { adSettings, isLoadingAdSettings } = useAdSettings();
  const [isVisible, setIsVisible] = useState(false);
  const [adCodeToInject, setAdCodeToInject] = useState<string | null>(null);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const scriptInjectedRef = useRef(false);

  useEffect(() => {
    if (isLoadingAdSettings || !adSettings || !adSettings.adsEnabledGlobally) {
      setIsVisible(false);
      setAdCodeToInject(null);
      scriptInjectedRef.current = false;
      return;
    }

    let selectedAdCode = "";

    if (adSettings.adsterraSocialBarEnabled && adSettings.adsterraSocialBarCode) {
      selectedAdCode = adSettings.adsterraSocialBarCode;
    } else if (adSettings.monetagSocialBarEnabled && adSettings.monetagSocialBarCode) {
      selectedAdCode = adSettings.monetagSocialBarCode;
    }

    if (selectedAdCode.trim()) {
      setAdCodeToInject(selectedAdCode);
      setIsVisible(true);
    } else {
      setAdCodeToInject(null);
      setIsVisible(false);
      scriptInjectedRef.current = false;
    }
  }, [adSettings, isLoadingAdSettings]);

  useEffect(() => {
    if (adCodeToInject && adContainerRef.current && !scriptInjectedRef.current) {
      adContainerRef.current.innerHTML = '';

      try {
        const fragment = document.createRange().createContextualFragment(adCodeToInject);
        adContainerRef.current.appendChild(fragment);
        scriptInjectedRef.current = true;
      } catch (e) {
        console.error("Error injecting social bar ad:", e);
      }
    }
  }, [adCodeToInject]);

  if (isLoadingAdSettings || !isVisible || !adCodeToInject) {
    return null;
  }

  return (
    <div
      ref={adContainerRef}
      className={cn(
        "!fixed !bottom-0 !left-0 !right-0",
        "!z-[95] !w-full !max-h-[120px]",
        "flex justify-center items-end overflow-hidden"
      )}
      style={{
        bottom: '0px',
        left: '0px',
        right: '0px',
        position: 'fixed',
        zIndex: 95,
        maxHeight: '120px'
      }}
    />
  );
};

export default SocialBarAdDisplay;
