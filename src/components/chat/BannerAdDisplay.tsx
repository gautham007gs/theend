"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAdSettings } from '@/contexts/AdSettingsContext';
import { cn } from '@/lib/utils';

interface BannerAdDisplayProps {
  adType: 'standard' | 'native';
  placementKey: string;
  className?: string;
}

const BannerAdDisplay: React.FC<BannerAdDisplayProps> = ({ adType, placementKey, className }) => {
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

    if (adType === 'standard') {
      if (adSettings.adsterraBannerEnabled && adSettings.adsterraBannerCode) {
        selectedAdCode = adSettings.adsterraBannerCode;
      } else if (adSettings.monetagBannerEnabled && adSettings.monetagBannerCode) {
        selectedAdCode = adSettings.monetagBannerCode;
      }
    } else if (adType === 'native') {
      if (adSettings.adsterraNativeBannerEnabled && adSettings.adsterraNativeBannerCode) {
        selectedAdCode = adSettings.adsterraNativeBannerCode;
      } else if (adSettings.monetagNativeBannerEnabled && adSettings.monetagNativeBannerCode) {
        selectedAdCode = adSettings.monetagNativeBannerCode;
      }
    }

    if (selectedAdCode.trim()) {
      setAdCodeToInject(selectedAdCode);
      setIsVisible(true);
    } else {
      setAdCodeToInject(null);
      setIsVisible(false);
      scriptInjectedRef.current = false;
    }
  }, [adSettings, isLoadingAdSettings, adType]);

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
        console.error(`Error injecting ${adType} banner ad:`, e);
      }
    }
  }, [adCodeToInject, isVisible, adType, isLoadingAdSettings]);

  if (isLoadingAdSettings || !isVisible || !adCodeToInject) {
    return null;
  }

  return (
    <div
      ref={adContainerRef}
      className={cn(
        "flex justify-center items-center w-full overflow-visible sticky bottom-0 z-20",
        "min-h-[90px]",
        className
      )}
      style={{
        minHeight: adType === 'native' ? '100px' : '90px'
      }}
      data-ad-placement={placementKey}
      data-ad-type={adType}
    />
  );
};

export default BannerAdDisplay;