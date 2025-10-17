"use client";

import React, { useState, useEffect, useRef } from 'react';
import type { AdSettings } from '@/types';
import { useAdSettings } from '@/contexts/AdSettingsContext';
import { cn } from '@/lib/utils';
import { CPMOptimizer } from '@/lib/cpm-optimizer';

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
  const [shouldLoadAd, setShouldLoadAd] = useState(false); // Lazy load control
  const adContainerRef = useRef<HTMLDivElement>(null);
  const scriptInjectedRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
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

  // Lazy load ad when near viewport (200px before visible)
  useEffect(() => {
    if (!adContainerRef.current || !isVisible) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoadAd(true);
            observerRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: '200px', // Load 200px before entering viewport
        threshold: 0.01
      }
    );

    observerRef.current.observe(adContainerRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [isVisible]);

  useEffect(() => {
    // Inject script only when:
    // 1. Ad code is ready
    // 2. Container is available
    // 3. Lazy load flag is true (near viewport)
    // 4. Script hasn't been injected yet
    if (!isVisible || !adCodeToInject || scriptInjectedRef.current || isLoadingAdSettings) {
      return;
    }

    // Defer ad loading on low-end devices
    const isLowEnd = (performance as any).memory?.jsHeapSizeLimit < 1073741824;
    const loadDelay = isLowEnd ? 2000 : 500;

    const loadTimer = setTimeout(() => {
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

          // Track impression for CPM optimization
          CPMOptimizer.trackAdPerformance(placementKey, { impression: true });

          console.log(`✅ Banner Ad [${adType}] - Successfully loaded for placement: ${placementKey}`);
          console.log(`✅ Banner Ad [${adType}] - DOM element ID: ${adElementId}`);
        } catch (e) {
          console.error(`❌ Banner Ad [${adType}] - Error injecting script for placement ${placementKey}:`, e);
          scriptInjectedRef.current = false; // Allow retry if code changes
        }
      }
    }, loadDelay);

    return () => clearTimeout(loadTimer);
  }, [adCodeToInject, isVisible, placementKey, currentNetwork, adType, isLoadingAdSettings]);

  // Clear ad container if no ad code
  useEffect(() => {
    if (!adCodeToInject && adContainerRef.current) {
      adContainerRef.current.innerHTML = '';
      scriptInjectedRef.current = false;
    }
  }, [adCodeToInject]);

  // Track viewability for analytics only (no refresh)
  useEffect(() => {
    if (!adContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
            setTimeout(() => {
              if (entry.isIntersecting) {
                CPMOptimizer.trackAdPerformance(placementKey, { 
                  viewableTime: 2000 // 2 seconds viewable
                });
              }
            }, 2000);
          }
        });
      },
      { threshold: [0.7] }
    );

    observer.observe(adContainerRef.current);
    return () => observer.disconnect();
  }, [placementKey]);


  if (isLoadingAdSettings || !isVisible || !adCodeToInject) {
    if (!isLoadingAdSettings && !isVisible) {
      console.log(`ℹ️ Banner Ad [${adType}] - Not visible for placement: ${placementKey} (ads disabled or no code)`);
    }
    return null; 
  }

  // Show skeleton loader while ad is being lazy loaded
  if (!shouldLoadAd) {
    return (
      <div
        className={cn(
          "kruthika-chat-banner-ad-container my-2 flex justify-center items-center bg-secondary/10 min-h-[50px] w-full overflow-hidden",
          className
        )}
      >
        <div className="w-full h-full bg-gradient-to-r from-secondary/5 via-secondary/20 to-secondary/5 animate-pulse" />
      </div>
    );
  }

  // Key includes adCodeToInject to attempt re-render if the code itself changes.
  return (
    <div
      id={adElementId}
      ref={adContainerRef}
      className={cn(
        "kruthika-chat-banner-ad-container my-2 flex justify-center items-center bg-secondary/10 min-h-[50px] w-full overflow-hidden transition-opacity duration-300",
        !scriptInjectedRef.current && "opacity-0",
        scriptInjectedRef.current && "opacity-100",
        className
      )}
      key={`${placementKey}-${adType}-${adCodeToInject.substring(0, 30)}`}
      onClick={() => {
        // Track click for CPM optimization
        CPMOptimizer.trackAdPerformance(placementKey, { click: true });
      }}
      data-ad-placement={placementKey}
    />
  );
};

export default BannerAdDisplay;