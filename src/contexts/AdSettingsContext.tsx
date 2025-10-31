
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { AdSettings } from '@/types';
import { AD_SETTINGS_CONFIG_KEY } from '@/types';
import { defaultAdSettings } from '@/config/ai';
import { supabase } from '@/lib/supabaseClient';

interface AdSettingsContextType {
  adSettings: AdSettings | null;
  isLoadingAdSettings: boolean;
  fetchAdSettings: () => Promise<void>;
}

const AdSettingsContext = createContext<AdSettingsContextType | undefined>(undefined);

export const AdSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [adSettings, setAdSettings] = useState<AdSettings | null>(null);
  const [isLoadingAdSettings, setIsLoadingAdSettings] = useState(true);

  const fetchAdSettings = async () => {
    setIsLoadingAdSettings(true);
    if (!supabase) {
      console.warn("Supabase client not available. Using defaults.");
      setAdSettings(defaultAdSettings);
      setIsLoadingAdSettings(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('app_configurations')
        .select('settings')
        .eq('id', AD_SETTINGS_CONFIG_KEY)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching ad settings:', error);
        setAdSettings(defaultAdSettings);
      } else if (data && data.settings) {
        const mergedSettings = { ...defaultAdSettings, ...(data.settings as AdSettings) };
        setAdSettings(mergedSettings);
      } else {
        setAdSettings(defaultAdSettings);
      }
    } catch (error) {
      console.error("Error fetching ad settings:", error);
      setAdSettings(defaultAdSettings);
    } finally {
      setIsLoadingAdSettings(false);
    }
  };

  useEffect(() => {
    fetchAdSettings();
  }, []);

  return (
    <AdSettingsContext.Provider value={{ adSettings, isLoadingAdSettings, fetchAdSettings }}>
      {children}
    </AdSettingsContext.Provider>
  );
};

export const useAdSettings = (): AdSettingsContextType => {
  const context = useContext(AdSettingsContext);
  if (context === undefined) {
    throw new Error('useAdSettings must be used within an AdSettingsProvider');
  }
  return context;
};
