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
    <header className="flex items-center px-3 py-2 bg-[#008069] dark:bg-[#1f2c33] border-b border-black/5 shadow-sm" style={{ minHeight: '60px', maxHeight: '60px' }}>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={(e) => {
          e.preventDefault();
          router.push('/');
        }} 
        className="text-white hover:bg-white/10 mr-1 rounded-full transition-colors active:bg-white/20" 
        style={{ width: '40px', height: '40px', flexShrink: 0 }}
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <button 
        onClick={onAvatarClick} 
        className="flex items-center focus:outline-none rounded-full mr-2.5 transition-opacity active:opacity-70"
        style={{ width: '42px', height: '42px', flexShrink: 0 }}
        key={`avatar-header-wrapper-${aiName}-${avatarUrlToUse || 'default_wrapper_key_ch'}`}
        aria-label={`View ${aiName}'s profile`}
      >
        <Avatar 
            className="h-[42px] w-[42px] cursor-pointer ring-0" 
            key={`avatar-comp-header-${aiName}-${avatarUrlToUse || 'default_avatar_comp_key_ch'}`}
            style={{ width: '42px', height: '42px', flexShrink: 0 }}
        >
          <AvatarImage 
            src={avatarUrlToUse || undefined} 
            alt={`${aiName} - AI girlfriend profile picture`} 
            data-ai-hint="profile woman" 
            key={`chat-header-avatar-img-${aiName}-${avatarUrlToUse || 'no_avatar_fallback_img_ch'}`}
            onError={handleAvatarError}
            width={42}
            height={42}
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            style={{ width: '42px', height: '42px', objectFit: 'cover', aspectRatio: '1/1' }}
          />
          <AvatarFallback style={{ width: '42px', height: '42px' }}>{(aiName || "K").charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </button>
      <div className="flex-grow cursor-pointer min-w-0" onClick={onAvatarClick}>
        <h1 className="font-medium text-[16px] text-white leading-tight truncate">{aiName}</h1>
        <p className="text-[13px] text-white/85 leading-tight truncate">{onlineStatus}</p>
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        className="text-white hover:bg-white/10 rounded-full transition-colors active:bg-white/20 ml-1" 
        aria-label="Video call" 
        onClick={() => {
          onVideoClick();
        }}
        style={{ width: '40px', height: '40px', flexShrink: 0 }}
      >
        <Video className="h-[22px] w-[22px]" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-white hover:bg-white/10 rounded-full transition-colors active:bg-white/20" 
        aria-label="Call" 
        onClick={() => {
          onCallClick();
        }}
        style={{ width: '40px', height: '40px', flexShrink: 0 }}
      >
        <Phone className="h-[22px] w-[22px]" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/10 rounded-full transition-colors active:bg-white/20" 
            aria-label="More options"
            style={{ width: '40px', height: '40px', flexShrink: 0 }}
          >
            <MoreVertical className="h-[20px] w-[20px]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => {
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