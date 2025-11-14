"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { Metadata } from "next";
import AppHeader from "@/components/AppHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Camera,
  X as XIcon,
  ArrowLeft,
  Search,
  MoreVertical,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type {
  AdminStatusDisplay,
  ManagedContactStatus,
  AdSettings,
  AIProfile,
} from "@/types";
import {
  defaultAIProfile,
  defaultAdminStatusDisplay,
  defaultManagedContactStatuses,
} from "@/config/ai";
import BannerAdDisplay from "@/components/chat/BannerAdDisplay";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { useAIProfile } from "@/contexts/AIProfileContext";
import { useGlobalStatus } from "@/contexts/GlobalStatusContext";
import { useAdSettings } from "@/contexts/AdSettingsContext";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ScreenshotProtection } from "@/components/ScreenshotProtection";

const STATUS_VIEW_AD_DELAY_MS = 3000;

const StatusPage: React.FC = () => {
  const { aiProfile: globalAIProfile, isLoadingAIProfile } = useAIProfile();
  const {
    adminOwnStatus: globalAdminOwnStatus,
    managedDemoContacts: globalManagedDemoContacts,
    isLoadingGlobalStatuses,
  } = useGlobalStatus();
  const { adSettings, isLoadingAdSettings } = useAdSettings();
  const { toast } = useToast();

  const StatusItemDisplay: React.FC<{
    statusKey: string;
    displayName: string;
    rawAvatarUrl: string;
    statusText: string;
    hasUpdateRing: boolean;
    storyImageUrl?: string;
    dataAiHint?: string;
    isMyStatusStyle?: boolean;
    isKruthikaProfile?: boolean;
  }> = ({
    statusKey,
    displayName,
    rawAvatarUrl,
    statusText,
    hasUpdateRing,
    storyImageUrl,
    dataAiHint,
    isMyStatusStyle,
    isKruthikaProfile,
  }) => {
    const [showStoryImageViewer, setShowStoryImageViewer] = useState(false);
    const storyViewTimerRef = useRef<NodeJS.Timeout | null>(null);
    const storyViewedLongEnoughRef = useRef(false);

    let avatarUrlToUse = rawAvatarUrl;
    if (
      !avatarUrlToUse ||
      typeof avatarUrlToUse !== "string" ||
      avatarUrlToUse.trim() === "" ||
      (!avatarUrlToUse.startsWith("http") &&
        !avatarUrlToUse.startsWith("data:"))
    ) {
      avatarUrlToUse = defaultAIProfile.avatarUrl;
    }

    // if (isKruthikaProfile) {
    // console.log(`[StatusItemDisplay-Kruthika] Final avatarUrlToUse for list/dialog avatar: ${avatarUrlToUse}`);
    // }

    let isValidStoryImageSrc = false;
    if (
      storyImageUrl &&
      typeof storyImageUrl === "string" &&
      storyImageUrl.trim() !== ""
    ) {
      try {
        if (storyImageUrl.startsWith("data:image")) {
          isValidStoryImageSrc = true;
        } else {
          new URL(storyImageUrl);
          isValidStoryImageSrc = true;
        }
      } catch (e) {
        isValidStoryImageSrc = false;
      }
    }

    const handleItemClick = React.useCallback(() => {
      if (isValidStoryImageSrc && storyImageUrl) {
        // Use requestIdleCallback for better INP
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            setShowStoryImageViewer(true);
            storyViewedLongEnoughRef.current = false;
            if (storyViewTimerRef.current) clearTimeout(storyViewTimerRef.current);
            storyViewTimerRef.current = setTimeout(() => {
              storyViewedLongEnoughRef.current = true;
            }, STATUS_VIEW_AD_DELAY_MS);
          }, { timeout: 100 });
        } else {
          requestAnimationFrame(() => {
            setShowStoryImageViewer(true);
            storyViewedLongEnoughRef.current = false;
            if (storyViewTimerRef.current) clearTimeout(storyViewTimerRef.current);
            storyViewTimerRef.current = setTimeout(() => {
              storyViewedLongEnoughRef.current = true;
            }, STATUS_VIEW_AD_DELAY_MS);
          });
        }
      }
    }, [isValidStoryImageSrc, storyImageUrl]);

    const handleCloseStoryViewer = () => {
      setShowStoryImageViewer(false);
      if (storyViewTimerRef.current) clearTimeout(storyViewTimerRef.current);

      if (
        storyImageUrl &&
        storyViewedLongEnoughRef.current &&
        adSettings &&
        adSettings.adsEnabledGlobally
      ) {
        tryShowRotatedAd(adSettings);
      }
      storyViewedLongEnoughRef.current = false;
    };

    const handleAvatarError = (
      e: React.SyntheticEvent<HTMLImageElement, Event>,
      context: string,
    ) => {
      process.env.NODE_ENV === "development" &&
        console.error(
          `StatusItemDisplay - ${context} AvatarImage load error for ${displayName}. URL: ${avatarUrlToUse}`,
          e,
        );
    };

    const handleStoryImageError = (
      e: React.SyntheticEvent<HTMLImageElement, Event>,
    ) => {
      process.env.NODE_ENV === "development" &&
        console.error(
          `StatusItemDisplay - Story Image load error for ${displayName}. URL: ${storyImageUrl}`,
          e,
        );
      toast({
        title: "Image Load Failed",
        description: `Could not load story image for ${displayName}. The image might be unavailable or the URL incorrect.`,
        variant: "destructive",
        duration: 4000,
      });
      // Keep dialog open to show the error, user can close manually if needed.
    };

    return (
      <React.Fragment
        key={`${statusKey}-${avatarUrlToUse || "no_avatar_frag"}`}
      >
        <div
          className="flex items-center px-5 py-4 hover:bg-secondary/60 cursor-pointer border-b border-border/50 transition-all duration-200 group active:bg-secondary/80"
          onClick={handleItemClick}
        >
          <div className="relative">
            <Avatar
              className={cn(
                "h-14 w-14 shadow-sm",
                hasUpdateRing
                  ? "ring-[3px] ring-[#25d366] ring-offset-2 ring-offset-background p-0.5"
                  : isMyStatusStyle && !hasUpdateRing
                    ? "ring-2 ring-muted/50 p-0.5"
                    : "",
              )}
              style={{ contain: 'layout style paint' }}
              key={`status-avatar-comp-${statusKey}-${avatarUrlToUse || "default_avatar_comp_key_sp"}`}
            >
              <AvatarImage
                src={avatarUrlToUse || undefined}
                alt={displayName}
                data-ai-hint={dataAiHint || "profile person"}
                className="object-cover"
                loading={isKruthikaProfile || isMyStatusStyle ? "eager" : "lazy"}
                fetchPriority={isKruthikaProfile || isMyStatusStyle ? "high" : "auto"}
                key={`${statusKey}-avatar-img-${avatarUrlToUse || "no_avatar_fallback_img_sp"}`}
                onError={(e) => handleAvatarError(e, "List")}
              />
              <AvatarFallback>
                {(displayName || "S").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isMyStatusStyle && !hasUpdateRing && !storyImageUrl && (
              <div className="absolute -bottom-0.5 -right-0.5 bg-gradient-to-br from-[#25d366] to-green-600 text-white rounded-full p-1 border-[3px] border-background shadow-md">
                <PlusCircle size={18} />
              </div>
            )}
          </div>
          <div className="ml-4 flex-grow overflow-hidden">
            <h2 className="font-semibold text-base truncate text-foreground group-hover:text-primary transition-colors" style={{ contain: 'layout' }}>
              {displayName}
            </h2>
            <p className="text-sm text-muted-foreground truncate mt-0.5" style={{ contain: 'layout' }}>
              {statusText}
            </p>
          </div>
        </div>

        {isValidStoryImageSrc && storyImageUrl && (
          <Dialog
            open={showStoryImageViewer}
            onOpenChange={(open) => {
              if (!open) {
                handleCloseStoryViewer();
              } else {
                setShowStoryImageViewer(true);
                if (storyViewTimerRef.current)
                  clearTimeout(storyViewTimerRef.current);
                storyViewedLongEnoughRef.current = false;
                storyViewTimerRef.current = setTimeout(() => {
                  storyViewedLongEnoughRef.current = true;
                }, STATUS_VIEW_AD_DELAY_MS);
              }
            }}
          >
            <DialogContent className="!fixed !inset-0 !z-[60] flex !w-screen !h-screen flex-col !bg-black !p-0 !border-0 !shadow-2xl !outline-none !rounded-none !max-w-none !translate-x-0 !translate-y-0">
              <div className="absolute top-0 left-0 right-0 z-20 p-3 flex items-center justify-between bg-gradient-to-b from-black/70 via-black/30 to-transparent">
                <div className="flex items-center gap-3">
                  <Avatar
                    className="h-9 w-9 border-2 border-white/50"
                    key={`status-dialog-avatar-comp-${statusKey}-${avatarUrlToUse || "default_avatar_dialog_comp_key_sp"}`}
                  >
                    <AvatarImage
                      src={avatarUrlToUse || undefined}
                      alt={displayName}
                      key={`${statusKey}-dialog-avatar-img-${avatarUrlToUse || "no_avatar_fallback_dialog_img_sp"}`}
                      onError={(e) => handleAvatarError(e, "Dialog")}
                    />
                    <AvatarFallback>
                      {(displayName || "S").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <DialogTitle className="text-white text-sm font-semibold">
                    {displayName}
                  </DialogTitle>
                  <DialogDescription>Viewing {displayName}&apos;s story update</DialogDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseStoryViewer}
                  className="text-white hover:bg-white/10"
                >
                  <XIcon size={24} />
                </Button>
              </div>

              <div className="relative flex-grow w-full flex items-center justify-center overflow-hidden">
                <Image
                  src={storyImageUrl}
                  alt={`${displayName}'s story`}
                  fill={true}
                  style={{ objectFit: "contain" }}
                  data-ai-hint="story image content large"
                  quality={100}
                  unoptimized={true}
                  sizes="100vw"
                  key={`${statusKey}-story-image-${storyImageUrl}`}
                  onError={handleStoryImageError}
                />
              </div>

              {statusText &&
                !statusText.toLowerCase().includes("tap to add") &&
                !statusText.toLowerCase().includes("no story update") && (
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-8 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                    <p className="text-white text-center text-sm drop-shadow-md">
                      {statusText}
                    </p>
                  </div>
                )}
            </DialogContent>
          </Dialog>
        )}
      </React.Fragment>
    );
  };

  const effectiveAIProfile = globalAIProfile || defaultAIProfile;
  const displayAdminOwnStatus =
    globalAdminOwnStatus || defaultAdminStatusDisplay;
  const displayManagedDemoContacts =
    globalManagedDemoContacts || defaultManagedContactStatuses;

  // Preload critical avatar images for LCP optimization
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const preloadImages = [
      displayAdminOwnStatus.avatarUrl,
      effectiveAIProfile.avatarUrl
    ].filter(url => url && typeof url === 'string' && url.trim() !== '');

    preloadImages.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      link.fetchPriority = 'high';
      document.head.appendChild(link);
    });
  }, [displayAdminOwnStatus.avatarUrl, effectiveAIProfile.avatarUrl]);

  if (isLoadingAIProfile || isLoadingGlobalStatuses || isLoadingAdSettings) {
    return (
      <div className="flex flex-col h-screen max-w-3xl mx-auto bg-background shadow-2xl">
        <AppHeader title="Status" />
        <div className="flex-grow flex items-center justify-center text-muted-foreground">
          Loading statuses...
        </div>
      </div>
    );
  }

  return (
    <>
      <ScreenshotProtection />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://kruthika.fun/' },
        { name: 'Status Updates', url: 'https://kruthika.fun/status' }
      ]} />
      <div className="flex flex-col h-screen max-w-3xl mx-auto bg-background shadow-2xl">
      {/* WhatsApp-style Header with Back Navigation */}
      <div className="bg-[#25d366] shadow-md">
        <div className="px-6 py-4 flex items-center">
          <button
            onClick={() => window.history.back()}
            className="mr-5 hover:bg-white/20 rounded-full p-2 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Go back"
          >
            <ArrowLeft size={22} className="text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">Status</h1>
          <div className="flex items-center space-x-2 ml-auto">
            <button
              className="hover:bg-white/20 rounded-full p-2 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Search status"
            >
              <Search size={20} className="text-white" />
            </button>
            <button
              className="hover:bg-white/20 rounded-full p-2 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="More options"
            >
              <MoreVertical size={20} className="text-white" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto custom-scrollbar">
        <StatusItemDisplay
          statusKey="admin-own-status-item"
          displayName={displayAdminOwnStatus.name}
          rawAvatarUrl={displayAdminOwnStatus.avatarUrl}
          statusText={displayAdminOwnStatus.statusText}
          hasUpdateRing={displayAdminOwnStatus.hasUpdate}
          storyImageUrl={displayAdminOwnStatus.statusImageUrl}
          dataAiHint="profile self admin"
          isMyStatusStyle={true}
          isKruthikaProfile={false}
        />

        <div className="px-6 py-3 text-xs font-bold text-muted-foreground/80 bg-secondary/20 border-y border-border/30 tracking-wider uppercase">
          Recent Updates
        </div>

        {(effectiveAIProfile.statusStoryHasUpdate ||
          (effectiveAIProfile.statusStoryText &&
            effectiveAIProfile.statusStoryText !==
              defaultAIProfile.statusStoryText) ||
          effectiveAIProfile.statusStoryImageUrl) && (
          <StatusItemDisplay
            statusKey="kruthika-status-story-item"
            displayName={effectiveAIProfile.name}
            rawAvatarUrl={effectiveAIProfile.avatarUrl}
            statusText={
              effectiveAIProfile.statusStoryText || "No story update."
            }
            hasUpdateRing={effectiveAIProfile.statusStoryHasUpdate || false}
            storyImageUrl={effectiveAIProfile.statusStoryImageUrl}
            dataAiHint="profile woman ai"
            isKruthikaProfile={true}
          />
        )}

        {displayManagedDemoContacts.map(
          (contact) =>
            (contact.hasUpdate ||
              contact.statusImageUrl ||
              (contact.statusText &&
                contact.statusText !== "Tap to add status")) && (
              <StatusItemDisplay
                key={contact.id}
                statusKey={contact.id}
                displayName={contact.name}
                rawAvatarUrl={contact.avatarUrl}
                statusText={contact.statusText}
                hasUpdateRing={contact.hasUpdate}
                storyImageUrl={contact.statusImageUrl}
                dataAiHint={contact.dataAiHint}
                isKruthikaProfile={false}
              />
            ),
        )}

        </div>
      
      {/* Banner Ads - Fixed to Bottom */}
      <div className="flex-shrink-0 sticky bottom-0 z-10 bg-white border-t border-border/30">
        <BannerAdDisplay
          placementKey="status-banner"
          className="mb-0"
        />
        <BannerAdDisplay
          placementKey="status-native"
          className="mb-0"
        />
      </div>

      <div className="p-5 border-t border-border/50 flex justify-end bg-background/95 backdrop-blur-sm">
        <Button
          variant="default"
          size="lg"
          className="rounded-full p-4 shadow-xl bg-gradient-to-r from-[#25d366] to-green-600 hover:from-[#1faa55] hover:to-green-700 transition-all hover:scale-105"
          onClick={() => alert("Camera access for status - not implemented")}
          aria-label="Add status"
        >
          <Camera size={26} />
        </Button>
      </div>
    </div>
    </>
  );
};

export default StatusPage;