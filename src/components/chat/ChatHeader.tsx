"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreVertical, Phone, Video, Camera } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { defaultAIProfile } from '@/config/ai';
import { useAdSettings } from '@/contexts/AdSettingsContext';
import { tryShowRotatedAd } from '@/lib/ad-utils'; 

interface ChatHeaderProps {
  aiName: string;
  aiAvatarUrl: string; 
  onlineStatus: string;
  onAvatarClick: () => void;
  onCallClick: () => void; 
  onVideoClick: () => void; 
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  aiName,
  aiAvatarUrl, 
  onlineStatus,
  onAvatarClick,
  onCallClick,
  onVideoClick,
}) => {
  const router = useRouter();
  const { adSettings } = useAdSettings();

  let avatarUrlToUse = aiAvatarUrl; 
  if (!avatarUrlToUse || typeof avatarUrlToUse !== 'string' || avatarUrlToUse.trim() === '' || (!avatarUrlToUse.startsWith('http') && !avatarUrlToUse.startsWith('data:'))) {
    avatarUrlToUse = defaultAIProfile.avatarUrl;
  }

  // if (aiName === "Kruthika") {
    // console.log(`ChatHeader - Kruthika's final aiAvatarUrlToUse: ${avatarUrlToUse}`);
  // }

  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`ChatHeader - AvatarImage load error for ${aiName}. URL: ${avatarUrlToUse}`, e);
  };

  return (
    <header className="flex items-center p-3 bg-[#075E54] border-b border-[#064e46] shadow-md" style={{ minHeight: '64px', maxHeight: '64px' }}>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={(e) => {
          e.preventDefault();
          router.push('/');
        }} 
        className="text-white hover:bg-white/20 mr-2 rounded-full transition-all" 
        style={{ width: '40px', height: '40px', flexShrink: 0 }}
        aria-label="Go back"
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <button 
        onClick={onAvatarClick} 
        className={cn(
            "flex items-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-chat-header-bg rounded-full p-1 mr-3",
            aiName === "Kruthika" && "border-2 border-white p-0.5" 
        )}
        style={{ width: '48px', height: '48px', flexShrink: 0 }}
        key={`avatar-header-wrapper-${aiName}-${avatarUrlToUse || 'default_wrapper_key_ch'}`}
        aria-label={`View ${aiName}'s profile`}
      >
        <Avatar 
            className="h-10 w-10 cursor-pointer" 
            key={`avatar-comp-header-${aiName}-${avatarUrlToUse || 'default_avatar_comp_key_ch'}`}
            style={{ width: '40px', height: '40px', flexShrink: 0, contain: 'layout size style' }}
        >
          <AvatarImage 
            src={avatarUrlToUse || undefined} 
            alt={`${aiName} - AI girlfriend profile picture`} 
            data-ai-hint="profile woman" 
            key={`chat-header-avatar-img-${aiName}-${avatarUrlToUse || 'no_avatar_fallback_img_ch'}`}
            onError={handleAvatarError}
            width={40}
            height={40}
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            style={{ width: '40px', height: '40px', objectFit: 'cover', aspectRatio: '1/1' }}
          />
          <AvatarFallback style={{ width: '40px', height: '40px' }}>{(aiName || "K").charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </button>
      <div className="flex-grow cursor-pointer" onClick={onAvatarClick}>
        <h1 className="font-semibold text-lg text-white">{aiName}</h1>
        <p className="text-xs text-white/80">{onlineStatus}</p>
      </div >

      <Button 
        variant="ghost" 
        size="icon" 
        className="text-white hover:bg-white/20 rounded-full transition-all" 
        aria-label="Camera" 
        onClick={() => {
          tryShowRotatedAd(adSettings);
          router.push('/status');
        }}
      >
        <Camera className="h-5 w-5" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-white hover:bg-white/20 rounded-full transition-all" 
        aria-label="Video call" 
        onClick={() => {
          tryShowRotatedAd(adSettings);
          onVideoClick();
        }}
      >
        <Video className="h-5 w-5" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-white hover:bg-white/20 rounded-full transition-all mr-1" 
        aria-label="Call" 
        onClick={() => {
          tryShowRotatedAd(adSettings);
          onCallClick();
        }}
      >
        <Phone className="h-5 w-5" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20 rounded-full transition-all" 
            aria-label="More options"
            onClick={() => tryShowRotatedAd(adSettings)}
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => {
            tryShowRotatedAd(adSettings);
            onAvatarClick();
          }}>
            <span>View Contact</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert("Media, links, and docs: Non-functional placeholder")}>
            <span>Media, links, and docs</span>
          </DropdownMenuItem>
           <DropdownMenuItem onClick={() => alert("Search: Non-functional placeholder")}>
            <span>Search</span>
          </DropdownMenuItem>
           <DropdownMenuItem onClick={() => alert("Mute notifications: Non-functional placeholder")}>
            <span>Mute notifications</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/legal/terms')}>
            <span>Terms of Service</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/legal/privacy')}>
            <span>Privacy Policy</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
           <DropdownMenuItem onClick={() => router.push('/')}>
            <span>Exit Chat</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default ChatHeader;