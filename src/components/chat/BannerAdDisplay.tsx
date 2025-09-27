
"use client";

import React, { useState, useEffect, useRef } from 'react';
import type { AdSettings } from '@/types';
import { useAdSettings } from '@/contexts/AdSettingsContext';
import { cn } from '@/lib/utils';
import { registerAdRefresh, unregisterAdRefresh } from '@/lib/ad-refresh-system';

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
      if (adSettings.adsterraBannerEnabled && adSettings.adsterraBannerCode && !adSettings.adsterraBannerCode.toLowerCase().includes("placeholder")) {
        selectedAdCode = adSettings.adsterraBannerCode;
        selectedNetworkEnabled = true;
        selectedNetwork = 'adsterra';
      } else if (adSettings.monetagBannerEnabled && adSettings.monetagBannerCode && !adSettings.monetagBannerCode.toLowerCase().includes("placeholder")) {
        selectedAdCode = adSettings.monetagBannerCode;
        selectedNetworkEnabled = true;
        selectedNetwork = 'monetag';
      }
    } else if (adType === 'native') {
      // Prioritize Adsterra for native banners if both enabled
      if (adSettings.adsterraNativeBannerEnabled && adSettings.adsterraNativeBannerCode && !adSettings.adsterraNativeBannerCode.toLowerCase().includes("placeholder")) {
        selectedAdCode = adSettings.adsterraNativeBannerCode;
        selectedNetworkEnabled = true;
        selectedNetwork = 'adsterra';
      } else if (adSettings.monetagNativeBannerEnabled && adSettings.monetagNativeBannerCode && !adSettings.monetagNativeBannerCode.toLowerCase().includes("placeholder")) {
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

  // Set up ad refresh system
  useEffect(() => {
    if (isVisible && currentNetwork && adElementId) {
      // Register for safe ad refresh with network-specific settings
      registerAdRefresh({
        adElementId,
        networkName: currentNetwork,
        adType: adType === 'standard' ? 'banner' : 'native',
        maxRefreshesPerHour: currentNetwork === 'adsterra' ? 6 : 8, // Conservative rates
        respectUserActivity: true, // Only refresh when user is active
      });

      return () => {
        unregisterAdRefresh(adElementId);
      };
    }
  }, [isVisible, currentNetwork, adElementId, adType]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (adElementId) {
        unregisterAdRefresh(adElementId);
      }
    };
  }, [adElementId]);

  useEffect(() => {
    // Inject script only when adCodeToInject is set and container is available
    // and script hasn't been injected yet for this specific code.
    if (adCodeToInject && adContainerRef.current && !scriptInjectedRef.current) {
      // Clear previous content
      adContainerRef.current.innerHTML = '';
      
      try {
        // Using a more robust way to append script tags
        const fragment = document.createRange().createContextualFragment(adCodeToInject);
        adContainerRef.current.appendChild(fragment);
        scriptInjectedRef.current = true;
      } catch (e) {
        console.error(`Error injecting ${adType} ad script for placement ${placementKey}:`, e);
        scriptInjectedRef.current = false; // Allow retry if code changes
      }
    } else if (!adCodeToInject && adContainerRef.current) {
      adContainerRef.current.innerHTML = ''; // Clear if no ad code
      scriptInjectedRef.current = false;
    }
  }, [adCodeToInject, placementKey, adType]);


  if (isLoadingAdSettings || !isVisible || !adCodeToInject) {
    return null; 
  }
  
  // Key includes adCodeToInject to attempt re-render if the code itself changes.
  // However, direct script injection might need more nuanced handling if the *same*
  // container is reused for *different* ad codes frequently.
  return (
    <div
      id={adElementId}
      ref={adContainerRef}
      className={cn(
        "kruthika-chat-banner-ad-container my-2 flex justify-center items-center bg-secondary/10 w-full overflow-hidden rounded-lg",
        adType === 'standard' ? "min-h-[90px] max-h-[250px]" : "min-h-[50px] max-h-[200px]",
        "mx-auto max-w-full",
        className
      )}
      style={{
        aspectRatio: adType === 'standard' ? '728/90' : 'auto',
        maxWidth: adType === 'standard' ? '728px' : '100%',
      }}
      key={`${placementKey}-${adType}-${adCodeToInject.substring(0, 30)}`} 
    />
  );
};

export default BannerAdDisplay;
