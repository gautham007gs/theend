
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Check, CheckCheck, Reply, Heart, ThumbsUp, Smile } from 'lucide-react';
import type { Message, MessageStatus } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { defaultAIProfile } from '@/config/ai'; 

interface MessageBubbleProps {
  message: Message;
  aiAvatarUrl: string;
  aiName: string;
  onTriggerAd?: () => void;
  onQuickReply?: (replyText: string, originalMessage: Message) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, aiAvatarUrl, aiName, onTriggerAd, onQuickReply }) => {
  const isUser = message.sender === 'user';
  const timestamp = new Date(message.timestamp);
  
  // Swipe gesture state
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const swipeThreshold = 80; // Minimum swipe distance to trigger
  const maxSwipeDistance = 120; // Maximum swipe distance

  // Quick reply options based on message content and sender
  const getQuickReplies = () => {
    if (isUser) return []; // No quick replies for user's own messages
    
    const msgLower = message.text.toLowerCase();
    
    // Context-aware quick replies
    if (msgLower.includes('good morning') || msgLower.includes('good night')) {
      return ['❤️', '😘', 'Good night! 🌙'];
    }
    if (msgLower.includes('how are you') || msgLower.includes('kaise ho')) {
      return ['👍', 'Great!', 'Good yaar'];
    }
    if (msgLower.includes('?')) {
      return ['👍', '👎', 'Maybe'];
    }
    if (msgLower.includes('love') || msgLower.includes('miss')) {
      return ['❤️', 'Miss you too', '😘'];
    }
    
    // Default quick replies
    return ['👍', '😂', 'Ok', 'Really?', '❤️', 'Cool'];
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isUser) return; // Only allow swiping on AI messages
    
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isUser) return;
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const deltaX = touchX - touchStartX.current;
    const deltaY = touchY - touchStartY.current;
    
    // Only consider horizontal swipes (ignore vertical scrolling)
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;
    
    // Swipe right to reply
    if (deltaX > 10) {
      setIsDragging(true);
      const clampedOffset = Math.min(deltaX, maxSwipeDistance);
      setSwipeOffset(clampedOffset);
      
      // Prevent scrolling while swiping
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (isUser) return;
    
    if (swipeOffset > swipeThreshold && !showQuickReplies) {
      setShowQuickReplies(true);
      // Add haptic feedback if available
      if (navigator.vibrate) navigator.vibrate(50);
    }
    
    setSwipeOffset(0);
    setIsDragging(false);
  };

  const handleQuickReplySelect = (replyText: string) => {
    if (onQuickReply) {
      onQuickReply(replyText, message);
    }
    setShowQuickReplies(false);
  };

  // Close quick replies when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bubbleRef.current && !bubbleRef.current.contains(event.target as Node)) {
        setShowQuickReplies(false);
      }
    };

    if (showQuickReplies) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showQuickReplies]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const renderTicks = (status: MessageStatus) => {
    if (!isUser) return null;
    if (status === 'read') return <CheckCheck className="h-4 w-4 text-blue-500 ml-1" />;
    if (status === 'delivered') return <CheckCheck className="h-4 w-4 text-muted-foreground ml-1" />;
    return <Check className="h-4 w-4 text-muted-foreground ml-1" />;
  };

  const imageToShowUrl = isUser ? message.userImageUrl : message.aiImageUrl;
  const imageHint = isUser ? "user upload" : "chat image";

  let isValidImageSrc = false;
  if (imageToShowUrl && typeof imageToShowUrl === 'string' && imageToShowUrl.trim() !== '') {
    try {
      if (imageToShowUrl.startsWith('data:image')) {
        isValidImageSrc = true;
      } else {
        new URL(imageToShowUrl); 
        isValidImageSrc = true;
      }
    } catch (e) {
      isValidImageSrc = false;
    }
  }

  let aiAvatarUrlToUse = aiAvatarUrl;
  if (!aiAvatarUrlToUse || typeof aiAvatarUrlToUse !== 'string' || aiAvatarUrlToUse.trim() === '' || (!aiAvatarUrlToUse.startsWith('http') && !aiAvatarUrlToUse.startsWith('data:'))) {
    aiAvatarUrlToUse = defaultAIProfile.avatarUrl;
  }

  const handleAIAvatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`MessageBubble - AI AvatarImage load error for ${aiName}. URL: ${aiAvatarUrlToUse}`, e);
  };
  
  const handleContentImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`MessageBubble - Content Image load error for message ${message.id}. URL: ${imageToShowUrl}`, e);
  };


  const renderMessageContent = () => {
    if (message.sender === 'ai' && message.text.includes("[CLICKABLE_AD_LINK text='")) {
      const parts = [];
      let lastIndex = 0;
      const adLinkRegex = /\[CLICKABLE_AD_LINK text='(.*?)'\]/g;
      let match;

      while ((match = adLinkRegex.exec(message.text)) !== null) {
        if (match.index > lastIndex) {
          parts.push(<span key={`text-${lastIndex}`}>{message.text.substring(lastIndex, match.index)}</span>);
        }
        const linkText = match[1];
        parts.push(
          <Button
            key={`adlink-${match.index}`}
            variant="link"
            className="text-sm p-0 h-auto inline whitespace-normal text-left hover:underline text-accent-foreground/90 dark:text-accent-foreground"
            onClick={onTriggerAd}
          >
            {linkText}
          </Button>
        );
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < message.text.length) {
        parts.push(<span key={`text-${lastIndex}-end`}>{message.text.substring(lastIndex)}</span>);
      }
      return <p className="text-sm whitespace-pre-wrap">{parts}</p>;
    }
    return message.text && <p className="text-sm whitespace-pre-wrap">{message.text}</p>;
  };


  return (
    <div className={cn('flex w-full relative', isUser ? 'justify-end' : 'justify-start')}>
      <div className="flex items-end max-w-[75%] sm:max-w-[65%] relative"
           ref={bubbleRef}>
        {!isUser && (
          <Avatar 
            className="h-8 w-8 mr-2 self-end shrink-0"
            key={`ai-msg-avatar-comp-${message.id}-${aiAvatarUrlToUse || 'default_avatar_comp_key_mb'}`}
          >
            <AvatarImage
              src={aiAvatarUrlToUse || undefined}
              alt={aiName}
              data-ai-hint="profile woman"
              key={`ai-msg-avatar-img-${message.id}-${aiAvatarUrlToUse || 'no_avatar_fallback_img_mb'}`}
              onError={handleAIAvatarError}
            />
            <AvatarFallback>{(aiName || "K").charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        )}
        {/* Reply icon that appears during swipe */}
        {!isUser && swipeOffset > 20 && (
          <div 
            className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10"
            style={{ opacity: Math.min(swipeOffset / swipeThreshold, 1) }}
          >
            <Reply className="h-5 w-5" />
          </div>
        )}
        
        <div
          className={cn(
            'px-3 py-2 shadow-md break-words transition-transform duration-100',
            isUser
              ? 'bg-chat-bg-user text-chat-text-user rounded-lg rounded-br-sm'
              : 'bg-chat-bg-ai text-chat-text-ai rounded-lg rounded-bl-sm'
          )}
          style={{ 
            transform: !isUser ? `translateX(${swipeOffset}px)` : 'none',
            transition: isDragging ? 'none' : 'transform 0.2s ease-out'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {isValidImageSrc && imageToShowUrl && (
            <Image
              src={imageToShowUrl}
              alt="Sent image"
              width={200}
              height={200}
              className="rounded-md mb-1 max-w-full h-auto"
              data-ai-hint={imageHint}
              key={`${message.id}-content-img-${imageToShowUrl}`} 
              onError={handleContentImageError}
              unoptimized={true} 
            />
          )}
          {message.audioUrl && (
            <audio controls src={message.audioUrl} className="w-full my-1">
              Your browser does not support the audio element.
            </audio>
          )}
          {renderMessageContent()}
          <div className="flex items-center justify-end mt-1">
            <span className={cn('text-xs',
              isUser ? 'text-chat-text-user/70' : 'text-muted-foreground/90'
            )}>
              {formatTime(timestamp)}
            </span>
            {renderTicks(message.status)}
          </div>
        </div>
        
        {/* Quick Reply Options */}
        {showQuickReplies && !isUser && (
          <div className="absolute top-full left-0 mt-2 flex flex-wrap gap-2 bg-background/95 backdrop-blur-sm rounded-lg p-2 shadow-lg border z-20 max-w-[280px]">
            {getQuickReplies().slice(0, 6).map((reply, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs px-2 py-1 h-auto min-h-[28px] rounded-full bg-card hover:bg-accent transition-colors"
                onClick={() => handleQuickReplySelect(reply)}
              >
                {reply}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="text-xs px-2 py-1 h-auto min-h-[28px] rounded-full text-muted-foreground hover:text-foreground"
              onClick={() => setShowQuickReplies(false)}
            >
              ✕
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
