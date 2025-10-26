"use client";

import React, { useState, useEffect, useRef } from 'react';
import type { AdSettings } from '@/types';
import { useAdSettings } from '@/contexts/AdSettingsContext';
import { cn } from '@/lib/utils';

interface BannerAdDisplayProps {
  adType: 'standard' | 'native'; // Specify banner type
  placementKey: string;
  className?: string;
}

const BannerAdDisplay: React.FC<BannerAdDisplayProps> = ({ adType, placementKey, className }) => {
  const { adSettings, isLoadingAdSettings } = useAdSettings();
  const [isVisible, setIsVisible] = useState(false);
  const [adCodeToInject, setAdCodeToInject] = useState<string | null>(null);
  const [currentNetwork, setCurrentNetwork] = useState<'adsterra' | 'monetag' | null>(null);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const scriptInjectedRef = useRef(false);
  const adElementId = `banner-ad-${adType}-${placementKey}`;
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    if (isLoadingAdSettings || !adSettings || !adSettings.adsEnabledGlobally) {
      setIsVisible(false);
      setAdCodeToInject(null);
      scriptInjectedRef.current = false;
      return;
    }

    let selectedAdCode = "";
    let selectedNetworkEnabled = false;

    let selectedNetwork: 'adsterra' | 'monetag' | null = null;

    if (adType === 'standard') {
      // Prioritize Adsterra for standard banners if both enabled
      if (adSettings.adsterraBannerEnabled && adSettings.adsterraBannerCode) {
        selectedAdCode = adSettings.adsterraBannerCode;
        selectedNetworkEnabled = true;
        selectedNetwork = 'adsterra';
      } else if (adSettings.monetagBannerEnabled && adSettings.monetagBannerCode) {
        selectedAdCode = adSettings.monetagBannerCode;
        selectedNetworkEnabled = true;
        selectedNetwork = 'monetag';
      }
    } else if (adType === 'native') {
      // Prioritize Adsterra for native banners if both enabled
      if (adSettings.adsterraNativeBannerEnabled && adSettings.adsterraNativeBannerCode) {
        selectedAdCode = adSettings.adsterraNativeBannerCode;
        selectedNetworkEnabled = true;
        selectedNetwork = 'adsterra';
      } else if (adSettings.monetagNativeBannerEnabled && adSettings.monetagNativeBannerCode) {
        selectedAdCode = adSettings.monetagNativeBannerCode;
        selectedNetworkEnabled = true;
        selectedNetwork = 'monetag';
      }
    }

    if (selectedNetworkEnabled && selectedAdCode.trim()) {
      setAdCodeToInject(selectedAdCode);
      setCurrentNetwork(selectedNetwork);
      setIsVisible(true);
    } else {
      setAdCodeToInject(null);
      setCurrentNetwork(null);
      setIsVisible(false);
      scriptInjectedRef.current = false;
    }
  }, [adSettings, isLoadingAdSettings, adType]);

  useEffect(() => {
    // Inject script immediately when ad code is ready
    if (!isVisible || !adCodeToInject || scriptInjectedRef.current || isLoadingAdSettings) {
      return;
    }

    if (adContainerRef.current) {
      adContainerRef.current.innerHTML = '';

      try {
        console.log(`🎯 Banner Ad [${adType}] - Starting injection for placement: ${placementKey}`);
        console.log(`🎯 Banner Ad [${adType}] - Network: ${currentNetwork}`);
        console.log(`🎯 Banner Ad [${adType}] - Code length: ${adCodeToInject.length} chars`);

        // Using a more robust way to append script tags
        const fragment = document.createRange().createContextualFragment(adCodeToInject);
        adContainerRef.current.appendChild(fragment);
        scriptInjectedRef.current = true;
        setAdLoaded(true);

        console.log(`✅ Banner Ad [${adType}] - Successfully loaded for placement: ${placementKey}`);
        console.log(`✅ Banner Ad [${adType}] - DOM element ID: ${adElementId}`);
      } catch (e) {
        console.error(`❌ Banner Ad [${adType}] - Error injecting script for placement ${placementKey}:`, e);
        scriptInjectedRef.current = false; // Allow retry if code changes
      }
    }
  }, [adCodeToInject, isVisible, placementKey, currentNetwork, adType, isLoadingAdSettings]);

  // Clear ad container if no ad code
  useEffect(() => {
    if (!adCodeToInject && adContainerRef.current) {
      adContainerRef.current.innerHTML = '';
      scriptInjectedRef.current = false;
    }
  }, [adCodeToInject]);



  if (isLoadingAdSettings || !isVisible || !adCodeToInject) {
    if (!isLoadingAdSettings && !isVisible) {
      console.log(`ℹ️ Banner Ad [${adType}] - Not visible for placement: ${placementKey} (ads disabled or no code)`);
    }
    return null;
  }

  // Show container only when ad is loaded
  return (
    <div
      id={adElementId}
      ref={adContainerRef}
      className={cn(
        "kruthika-chat-banner-ad-container flex justify-center items-center w-full overflow-hidden sticky bottom-0 z-20",
        adLoaded ? "min-h-0" : "h-0 opacity-0",
        className
      )}
      key={`${placementKey}-${adType}-${adCodeToInject.substring(0, 30)}`}
      data-ad-placement={placementKey}
    />
  );
};

export default BannerAdDisplay;