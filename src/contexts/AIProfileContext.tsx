"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { AIProfile } from '@/types';
import { AI_PROFILE_CONFIG_KEY } from '@/types';
import { defaultAIProfile } from '@/config/ai';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

interface AIProfileContextType {
  aiProfile: AIProfile | null;
  isLoadingAIProfile: boolean;
  fetchAIProfile: () => Promise<void>; 
  updateAIProfile: (newProfileData: Partial<AIProfile>) => Promise<void>; 
}

// This global variable approach for a setter is not standard React practice and can lead to issues.
// It's better for AdminProfilePage to manage its own loading state if it needs to combine context loading with its own.
// For now, I'll keep the mechanism but comment it out if it's causing confusion or isn't strictly necessary.
let setIsLoadingContextAIProfileExternal: React.Dispatch<React.SetStateAction<boolean>> | null = null;


const AIProfileContext = createContext<AIProfileContextType | undefined>(undefined);

export const AIProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [aiProfile, setAIProfile] = useState<AIProfile | null>(null);
  const [isLoadingAIProfile, setIsLoadingAIProfile] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // This was for AdminProfilePage to control this context's loading state.
    // It might be simpler for AdminProfilePage to have its own combined loading state.
    // setIsLoadingContextAIProfileExternal = setIsLoadingAIProfile;
    // return () => {
    //   setIsLoadingContextAIProfileExternal = null;
    // };
  }, []);


  const fetchAIProfile = useCallback(async () => {
    setIsLoadingAIProfile(true);
    logger.dev("[AIProfileContext] fetchAIProfile: Starting to fetch AI profile...");
    if (!supabase) {
      logger.warn("[AIProfileContext] fetchAIProfile: Supabase client not available. Using defaults for AI profile.");
      setAIProfile(defaultAIProfile);
      logger.dev("[AIProfileContext] fetchAIProfile: Set AI profile to default (Supabase unavailable):", JSON.stringify(defaultAIProfile, null, 2));
      setIsLoadingAIProfile(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('app_configurations')
        .select('settings')
        .eq('id', AI_PROFILE_CONFIG_KEY)
        .single();

      logger.dev("[AIProfileContext] fetchAIProfile: Fetched from Supabase - raw data:", JSON.stringify(data, null, 2), "error:", error);

      if (error && error.code !== 'PGRST116') {
        console.error('[AIProfileContext] fetchAIProfile: Error fetching AI profile from Supabase:', error);
        toast({ title: "Error Loading AI Profile", description: `Could not load AI profile. Using defaults. ${error.message}`, variant: "destructive" });
        
        // Try to get profile from localStorage as fallback
        try {
          const localProfile = localStorage.getItem('ai_profile_backup');
          if (localProfile) {
            const parsedProfile = JSON.parse(localProfile);
            setAIProfile(parsedProfile);
            logger.dev('[AIProfileContext] Using local backup profile');
            return;
          }
        } catch (localError) {
          console.warn('[AIProfileContext] Local backup also failed:', localError);
        }

        setAIProfile(defaultAIProfile);
        logger.dev("[AIProfileContext] fetchAIProfile: Set AI profile to default (Supabase error):", JSON.stringify(defaultAIProfile, null, 2));
      } else if (data && data.settings) {
        let fetchedProfile = data.settings as Partial<AIProfile>; 
        logger.dev("[AIProfileContext] fetchAIProfile: Raw profile settings from Supabase:", JSON.stringify(fetchedProfile, null, 2));

        if (!fetchedProfile.avatarUrl || typeof fetchedProfile.avatarUrl !== 'string' || fetchedProfile.avatarUrl.trim() === '' || (!fetchedProfile.avatarUrl.startsWith('http') && !fetchedProfile.avatarUrl.startsWith('data:'))) {
            console.warn(`[AIProfileContext] fetchAIProfile: Fetched avatarUrl ('${fetchedProfile.avatarUrl}') is invalid or empty. Falling back to default AI avatarUrl: ${defaultAIProfile.avatarUrl}`);
            fetchedProfile.avatarUrl = defaultAIProfile.avatarUrl;
        }

        const mergedProfile: AIProfile = { 
          ...defaultAIProfile, 
          ...fetchedProfile 
        };

        setAIProfile(mergedProfile);
        logger.dev("[AIProfileContext] fetchAIProfile: Set AI profile from Supabase (merged with defaults):", JSON.stringify(mergedProfile, null, 2));
        // Backup to local storage after successful fetch
        try {
          localStorage.setItem('ai_profile_backup', JSON.stringify(mergedProfile));
          logger.dev('[AIProfileContext] AI profile backed up to local storage');
        } catch (backupError) {
          console.warn('[AIProfileContext] Failed to back up AI profile to local storage:', backupError);
        }
      } else {
        logger.dev("[AIProfileContext] fetchAIProfile: No AI profile found in Supabase (error code PGRST116 or no data.settings). Using default values.");
        setAIProfile(defaultAIProfile);
        logger.dev("[AIProfileContext] fetchAIProfile: Set AI profile to default (no data in Supabase):", JSON.stringify(defaultAIProfile, null, 2));
      }
    } catch (e: any) {
      console.error('[AIProfileContext] fetchAIProfile: Unexpected error fetching AI profile:', e);
      toast({ title: "Error Loading AI Profile", description: `Unexpected error. Using defaults. ${e.message}`, variant: "destructive" });
      
      // Try to get profile from localStorage as fallback
      try {
        const localProfile = localStorage.getItem('ai_profile_backup');
        if (localProfile) {
          const parsedProfile = JSON.parse(localProfile);
          setAIProfile(parsedProfile);
          logger.dev('[AIProfileContext] Using local backup profile after unexpected error');
          return;
        }
      } catch (localError) {
        console.warn('[AIProfileContext] Local backup also failed after unexpected error:', localError);
      }

      setAIProfile(defaultAIProfile);
      logger.dev("[AIProfileContext] fetchAIProfile: Set AI profile to default (catch block error):", JSON.stringify(defaultAIProfile, null, 2));
    } finally {
      setIsLoadingAIProfile(false);
      logger.dev("[AIProfileContext] fetchAIProfile: Finished fetching AI profile. Loading state:", false);
    }
  }, [toast]);

  const updateAIProfile = useCallback(async (newProfileData: Partial<AIProfile>) => {
    if (!supabase) {
      toast({ title: "Supabase Error", description: "Supabase client not available. Cannot save AI profile.", variant: "destructive" });
      return;
    }

    logger.dev("[AIProfileContext] updateAIProfile: Received newProfileData:", JSON.stringify(newProfileData, null, 2));

    const currentProfileForUpdate = aiProfile || defaultAIProfile;

    // Prepare avatarUrl: if explicitly cleared (empty string) make it undefined,
    // otherwise use the new value or keep the current one.
    let processedAvatarUrl = newProfileData.hasOwnProperty('avatarUrl') 
        ? (newProfileData.avatarUrl?.trim() === '' ? undefined : newProfileData.avatarUrl) 
        : currentProfileForUpdate.avatarUrl;

    // Validate and fallback to default if the processed URL is still invalid or undefined
    if (!processedAvatarUrl || typeof processedAvatarUrl !== 'string' || (!processedAvatarUrl.startsWith('http') && !processedAvatarUrl.startsWith('data:'))) {
        console.warn(`[AIProfileContext updateAIProfile] Processed avatarUrl ('${processedAvatarUrl}') is invalid. Falling back to default: ${defaultAIProfile.avatarUrl}`);
        processedAvatarUrl = defaultAIProfile.avatarUrl;
    }
    logger.dev("[AIProfileContext] updateAIProfile: Processed avatarUrl for optimistic update:", processedAvatarUrl);

    const optimisticProfile: AIProfile = {
      ...currentProfileForUpdate,
      ...newProfileData, 
      avatarUrl: processedAvatarUrl, 
    };

    console.log("[AIProfileContext] updateAIProfile: Optimistic profile for UI update:", JSON.stringify(optimisticProfile, null, 2));
    setAIProfile(optimisticProfile); // Optimistic UI update

    try {
      const { error: upsertError } = await supabase
        .from('app_configurations')
        .upsert(
          { id: AI_PROFILE_CONFIG_KEY, settings: optimisticProfile, updated_at: new Date().toISOString() },
          { onConflict: 'id' }
        );

      if (upsertError) {
        console.error("[AIProfileContext] updateAIProfile: Failed to save AI profile to Supabase:", upsertError);
        toast({ title: "Error Saving AI Profile", description: `Could not save AI profile to Supabase. ${upsertError.message || ''}. Reverting optimistic update.`, variant: "destructive" });
        setAIProfile(currentProfileForUpdate); // Revert optimistic update on error
        await fetchAIProfile(); // Re-fetch from DB to ensure consistency
        return; 
      }

      console.log("[AIProfileContext] updateAIProfile: AI Profile successfully saved to Supabase.");
      toast({ title: "AI Profile Saved!", description: "Kruthika's profile has been saved globally to Supabase." });

      // Backup to local storage after successful save
      try {
        localStorage.setItem('ai_profile_backup', JSON.stringify(optimisticProfile));
        console.log('[AIProfileContext] AI profile backed up to local storage after update');
      } catch (backupError) {
        console.warn('[AIProfileContext] Failed to back up AI profile to local storage after update:', backupError);
      }

      // Re-fetch after successful save to ensure UI reflects DB state, though optimistic update helps.
      await fetchAIProfile();

    } catch (error: any) {
      console.error("[AIProfileContext] updateAIProfile: Unexpected error during Supabase save:", error);
      toast({ title: "Error Saving AI Profile", description: `Unexpected error. ${error.message || ''}. Reverting optimistic update.`, variant: "destructive" });
      setAIProfile(currentProfileForUpdate); // Revert optimistic update
      await fetchAIProfile(); // Re-fetch from DB
    }
  }, [toast, aiProfile, fetchAIProfile]); 

  useEffect(() => {
    fetchAIProfile();
  }, [fetchAIProfile]);

  return (
    <AIProfileContext.Provider value={{ aiProfile, isLoadingAIProfile, fetchAIProfile, updateAIProfile }}>
      {children}
    </AIProfileContext.Provider>
  );
};

export const useAIProfile = (): AIProfileContextType => {
  const context = useContext(AIProfileContext);
  if (context === undefined) {
    throw new Error('useAIProfile must be used within an AIProfileProvider');
  }
  return context;
};

// This function is intended for AdminProfilePage to manually set this context's loading state.
// This might be an anti-pattern; consider if AdminProfilePage can manage a combined loading state itself.
export const setExternalIsLoadingAIProfile = (isLoading: boolean) => {
  // This external setter mechanism is tricky. If AIProfileContext is still loading itself,
  // AdminProfilePage setting this to false prematurely could be problematic.
  // This function should ideally not be needed if contexts manage their own loading states well.
  // if (setIsLoadingContextAIProfileExternal) {
  //   setIsLoadingContextAIProfileExternal(isLoading);
  // }
};