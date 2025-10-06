"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import AppHeader from '@/components/AppHeader';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { AIProfile } from '@/types';
import { defaultAIProfile } from '@/config/ai';
import { MessageSquarePlus, Camera, Search, MoreVertical, Share2, Settings, Info, Star, Zap } from 'lucide-react';
import { useAIProfile } from '@/contexts/AIProfileContext';
import { cn } from '@/lib/utils';

const BannerAdDisplay = dynamic(() => import('@/components/chat/BannerAdDisplay'), {
  ssr: false,
  loading: () => <div className="h-24" />
});

const ChatListItem: React.FC<{ profile: AIProfile; lastMessage?: string; timestamp?: string; unreadCount?: number; }> = ({
  profile,
  lastMessage,
  timestamp = "",
  unreadCount,
}) => {
  const displayLastMessage = lastMessage || `Click to chat with ${profile.name}!`;

  let avatarUrlToUse = profile.avatarUrl;
  if (!avatarUrlToUse || typeof avatarUrlToUse !== 'string' || avatarUrlToUse.trim() === '' || (!avatarUrlToUse.startsWith('http') && !avatarUrlToUse.startsWith('data:'))) {
    avatarUrlToUse = defaultAIProfile.avatarUrl;
  }

  // if (profile.name === "Kruthika") {
    // console.log(`ChatListItem - Kruthika's final avatarUrlToUse: ${avatarUrlToUse}`);
  // }

  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`ChatListItem - AvatarImage load error for ${profile.name}. URL: ${avatarUrlToUse}`, e);
  };

  return (
    <div className="flex items-center p-3 bg-transparent hover:bg-secondary/50 cursor-pointer border-b border-border transition-colors">
      <div
        className={cn(
          "relative rounded-full mr-4 shrink-0",
          profile.name === "Kruthika" && "border-2 border-primary p-0.5"
        )}
         key={`avatar-wrapper-${profile.name}-${avatarUrlToUse || 'default_wrapper_key_cli'}`}
      >
        <Avatar
          className="h-12 w-12"
          key={`avatar-comp-${profile.name}-${avatarUrlToUse || 'default_avatar_comp_key_cli'}`}
          style={{ width: '48px', height: '48px', minWidth: '48px', minHeight: '48px', aspectRatio: '1/1', contain: 'strict' }}
        >
          <AvatarImage
            src={avatarUrlToUse || undefined}
            alt={`${profile.name} - AI girlfriend virtual companion profile picture for emotional support chat`}
            data-ai-hint="profile woman"
            key={`chat-list-item-avatar-img-${profile.name}-${avatarUrlToUse || 'no_avatar_fallback_img_cli'}`}
            onError={handleAvatarError}
            width={48}
            height={48}
            loading="eager"
            fetchPriority="high"
            style={{ width: '48px', height: '48px', aspectRatio: '1/1' }}
          />
          <AvatarFallback>{(profile.name || "K").charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-grow overflow-hidden min-w-0">
        <h2 className="font-semibold text-md truncate text-foreground">{profile.name}</h2>
        <p className="text-sm text-muted-foreground truncate">{displayLastMessage}</p>
        <div className="flex items-center mt-1">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span className="text-xs text-green-700 font-medium">Online</span>
        </div>
      </div>
      <div className="flex flex-col items-end text-xs ml-2 shrink-0">
        <span className="text-muted-foreground mb-1">{timestamp}</span>
        {unreadCount && unreadCount > 0 && (
          <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-semibold">
            {unreadCount}
          </span>
        )}
      </div>
    </div>
  );
};


const ChatListPage: React.FC = () => {
  const { aiProfile: globalAIProfile, isLoadingAIProfile } = useAIProfile();
  const [lastMessageTime, setLastMessageTime] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const unreadCount = 1;

  useEffect(() => {
    const lastInteraction = localStorage.getItem('messages_kruthika');
    if (lastInteraction) {
      try {
        const messagesArray = JSON.parse(lastInteraction);
        const lastMsg = messagesArray[messagesArray.length - 1];
        if (lastMsg && lastMsg.timestamp) {
          const date = new Date(lastMsg.timestamp);
          const today = new Date();
          if (date.toDateString() === today.toDateString()) {
            setLastMessageTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
          } else {
             setLastMessageTime(date.toLocaleDateString([], { month: 'short', day: 'numeric' }));
          }
        } else if (!lastMessageTime) {
          setLastMessageTime("9:15 AM");
        }
      } catch (e) {
        console.warn("Could not parse last message time from localStorage", e);
        if (!lastMessageTime) {
          setLastMessageTime("9:15 AM");
        }
      }
    } else if (!lastMessageTime) {
      setLastMessageTime("9:15 AM");
    }
  }, []);

  const effectiveAIProfile = globalAIProfile || defaultAIProfile;

  // if (globalAIProfile) {
    // console.log("[ChatListPage] Using AIProfile from context:", JSON.stringify(globalAIProfile, null, 2));
  // } else if (!isLoadingAIProfile) {
    // console.log("[ChatListPage] AIProfile from context is null (and not loading), using defaultAIProfile:", JSON.stringify(defaultAIProfile, null, 2));
  // }


  if (isLoadingAIProfile) {
    return (
      <div className="flex flex-col h-screen max-w-3xl mx-auto bg-background shadow-2xl">
        <AppHeader title="Chats" />
        <div className="flex-grow flex items-center justify-center text-muted-foreground">
          Loading Kruthika's profile...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-screen max-w-3xl mx-auto bg-background shadow-2xl">
      {/* WhatsApp-style Header */}
      <header className="bg-[#1a7a3e] shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">Chats</h1>
          <nav className="flex items-center space-x-3" aria-label="Main navigation">
            <button className="hover:bg-green-400 rounded-full p-2 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center" aria-label="Open camera">
              <Camera size={20} className="text-white" />
            </button>
            <button className="hover:bg-green-400 rounded-full p-2 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center" aria-label="Search chats">
              <Search size={20} className="text-white" />
            </button>
            <div className="relative">
              <button
                className="hover:bg-green-400 rounded-full p-2 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
                onClick={() => setShowDropdown(!showDropdown)}
                aria-label="Open menu"
                aria-expanded={showDropdown}
                aria-haspopup="true"
              >
                <MoreVertical size={20} className="text-white" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50" role="menu">
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 min-h-[48px]" role="menuitem">
                    <Info size={16} />
                    New group
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 min-h-[48px]" role="menuitem">
                    <Star size={16} />
                    Starred messages
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 min-h-[48px]" role="menuitem">
                    <Settings size={16} />
                    Settings
                  </button>
                  <Link href="/blog" className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 min-h-[48px]">
                    <Zap size={16} />
                    Blog
                  </Link>
                  <div className="px-4 py-2 text-xs text-gray-400 text-center border-t border-gray-100 mt-1">
                    <span>Enhanced conversations</span>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-[#1a7a3e]">
          <div className="flex-1">
            <button className="w-full py-4 px-4 text-center font-medium border-b-2 border-white text-white min-h-[48px]" aria-label="View chats" aria-current="page">
              CHATS
            </button>
          </div>
          <div className="flex-1">
            <Link href="/status" className="block w-full">
              <button className="w-full py-4 px-4 text-center font-medium border-b-2 border-transparent hover:border-green-300 text-white opacity-90 hover:opacity-100 min-h-[48px]" aria-label="View status updates">
                STATUS
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto custom-scrollbar relative bg-gray-50">
        {/* Chat Item showing AI profile */}
        <div className="bg-white">
          <Link href="/maya-chat" className="block" aria-label={`Chat with ${effectiveAIProfile.name}, ${unreadCount ? `${unreadCount} unread message` : 'online now'}`}>
            <ChatListItem
              profile={effectiveAIProfile}
              lastMessage={effectiveAIProfile.status || `Let's chat! 😊`}
              timestamp={lastMessageTime || "07:21 PM"}
              unreadCount={1}
            />
          </Link>
        </div>

        {/* Welcome Section */}
        <div className="flex flex-col items-center justify-center px-8 py-12 text-center bg-white mt-4 mx-4 rounded-lg shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Chat with {effectiveAIProfile.name}
            </h2>
            <p className="text-xs text-gray-500">
              Smart conversations
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3 w-full max-w-sm">
            <Link href="/maya-chat">
              <button className="w-full bg-[#1a7a3e] hover:bg-[#156030] text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 min-h-[48px]" aria-label="Start chatting with Kruthika">
                <MessageSquarePlus size={20} />
                <span>Start Chatting</span>
              </button>
            </Link>

            <div className="flex space-x-3">
              <Link href="/status" className="flex-1">
                <button className="w-full bg-[#0d5f5f] hover:bg-[#0a4a4a] text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 min-h-[48px]" aria-label="View status updates">
                  <span>👁️</span>
                  <span>View Status</span>
                </button>
              </Link>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center min-w-[48px] min-h-[48px]" aria-label="Share with friends">
                <Share2 size={20} />
              </button>
            </div>
          </div>

        </div>

        <BannerAdDisplay adType="standard" placementKey="chatListBottom" className="mx-auto max-w-md mt-2 mb-1" />
      </main>

      {/* Floating Action Button */}
      <Link
        href="/maya-chat"
        aria-label={`New chat with ${effectiveAIProfile.name}`}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 lg:bottom-10 lg:right-10 z-10 bg-[#1a7a3e] hover:bg-[#156030] text-white p-4 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 min-w-[56px] min-h-[56px] flex items-center justify-center"
      >
        <span>
          <MessageSquarePlus size={24} />
        </span>
      </Link>
      </div>
    </>
  );
};

export default ChatListPage;