
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAdSettings } from '@/contexts/AdSettingsContext';
import { cn } from '@/lib/utils';

interface BannerAdDisplayProps {
  placementKey: string;
  className?: string;
}

const BannerAdDisplay: React.FC<BannerAdDisplayProps> = ({ placementKey, className }) => {
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

    // Only standard banners - prioritize Adsterra, fall back to Monetag
    if (adSettings.adsterraBannerEnabled && adSettings.adsterraBannerCode) {
      selectedAdCode = adSettings.adsterraBannerCode;
    } else if (adSettings.monetagBannerEnabled && adSettings.monetagBannerCode) {
      selectedAdCode = adSettings.monetagBannerCode;
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
    if (!isVisible || !adCodeToInject || scriptInjectedRef.current || isLoadingAdSettings) {
      return;
    }

    if (adContainerRef.current) {
      adContainerRef.current.innerHTML = '';

      try {
        const fragment = document.createRange().createContextualFragment(adCodeToInject);
        adContainerRef.current.appendChild(fragment);
        scriptInjectedRef.current = true;
      } catch (e) {
        console.error(`Error injecting banner ad:`, e);
      }
    }
  }, [adCodeToInject, isVisible, isLoadingAdSettings]);

  if (isLoadingAdSettings || !isVisible || !adCodeToInject) {
    return null;
  }

  return (
    <div
      ref={adContainerRef}
      className={cn(
        "flex justify-center items-center w-full overflow-visible",
        className
      )}
      data-ad-placement={placementKey}
      data-ad-type="standard"
    />
  );
};

export default BannerAdDisplay;
