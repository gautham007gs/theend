"use client";

import React, { useEffect, useRef } from 'react';
import { useAdSettings } from '@/contexts/AdSettingsContext';

const SocialBarAdDisplay: React.FC = () => {
  const { adSettings, isLoadingAdSettings } = useAdSettings();
  const scriptInjectedRef = useRef(false);
  const cleanupFnRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (isLoadingAdSettings || !adSettings || !adSettings.adsEnabledGlobally) {
      return;
    }

    if (scriptInjectedRef.current) {
      return;
    }

    let selectedSocialBarCode = "";

    // Prioritize Adsterra, fall back to Monetag
    if (adSettings.adsterraSocialBarEnabled && adSettings.adsterraSocialBarCode) {
      selectedSocialBarCode = adSettings.adsterraSocialBarCode;
    } else if (adSettings.monetagSocialBarEnabled && adSettings.monetagSocialBarCode) {
      selectedSocialBarCode = adSettings.monetagSocialBarCode;
    }

    if (!selectedSocialBarCode.trim()) {
      return;
    }

    try {
      const fragment = document.createRange().createContextualFragment(selectedSocialBarCode);
      document.body.appendChild(fragment);
      scriptInjectedRef.current = true;

      cleanupFnRef.current = () => {
        const socialBarElements = document.querySelectorAll('[data-social-bar], [class*="social-bar"], [id*="social-bar"]');
        socialBarElements.forEach(el => el.remove());
      };

    } catch (e) {
      console.error('Error injecting social bar ad:', e);
    }

    return () => {
      if (cleanupFnRef.current) {
        cleanupFnRef.current();
        cleanupFnRef.current = null;
      }
      scriptInjectedRef.current = false;
    };
  }, [adSettings, isLoadingAdSettings]);

  return null;
};

export default SocialBarAdDisplay;
