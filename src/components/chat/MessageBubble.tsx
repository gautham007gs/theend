
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Check, CheckCheck, Reply, Heart, ThumbsUp, Smile } from 'lucide-react';
import type { Message, MessageStatus, MessageReaction } from '@/types';
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
  onLikeMessage?: (messageId: string) => void;
  onReactToMessage?: (messageId: string, reaction: MessageReaction) => void;
  currentlySwipingMessageId?: string | null;
  onSwipeStart?: (messageId: string) => void;
  onSwipeEnd?: () => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, aiAvatarUrl, aiName, onTriggerAd, onQuickReply, onLikeMessage, onReactToMessage, currentlySwipingMessageId, onSwipeStart, onSwipeEnd }) => {
  const isUser = message.sender === 'user';
  const isAd = message.sender === 'ad' || message.isNativeAd;
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

  // Double tap to like state
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const lastTapRef = useRef<number>(0);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const DOUBLE_TAP_DELAY = 300;

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
    if (isUser || isAd) return; // Only allow swiping on AI messages (not user or ad messages)
    
    // Prevent starting swipe if another message is already being swiped
    if (currentlySwipingMessageId && currentlySwipingMessageId !== message.id) {
      return;
    }
    
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isUser) return;
    
    // Prevent moving if another message is being swiped
    if (currentlySwipingMessageId && currentlySwipingMessageId !== message.id) {
      return;
    }
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const deltaX = touchX - touchStartX.current;
    const deltaY = touchY - touchStartY.current;
    
    // More strict threshold for horizontal swipes (WhatsApp-like)
    if (Math.abs(deltaY) > 30 || Math.abs(deltaX) < 15) return;
    
    // Swipe right to reply with enhanced feedback
    if (deltaX > 15) {
      // Notify parent that this message is being swiped
      if (!isDragging && onSwipeStart) {
        onSwipeStart(message.id);
      }
      
      setIsDragging(true);
      // Smooth resistance curve like WhatsApp with better easing
      const progress = Math.min(deltaX / maxSwipeDistance, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 2); // Easing out quad
      const clampedOffset = easedProgress * maxSwipeDistance;
      setSwipeOffset(clampedOffset);
      
      // Haptic feedback at threshold points
      if (deltaX > swipeThreshold && !showQuickReplies) {
        if (navigator.vibrate) navigator.vibrate(10); // Subtle feedback
      }
      
      // Prevent scrolling while swiping
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (isUser) return;
    
    if (swipeOffset > swipeThreshold && !showQuickReplies) {
      setShowQuickReplies(true);
      // Stronger haptic feedback for action completion
      if (navigator.vibrate) navigator.vibrate([30, 10, 30]);
    } else {
      // If swipe didn't trigger, notify parent to clear swiping state
      if (onSwipeEnd) {
        onSwipeEnd();
      }
    }
    
    // Smooth animation back to position
    setSwipeOffset(0);
    setIsDragging(false);
  };

  const handleQuickReplySelect = (replyText: string) => {
    if (onQuickReply) {
      onQuickReply(replyText, message);
    }
    setShowQuickReplies(false);
    
    // Notify parent that swiping is done
    if (onSwipeEnd) {
      onSwipeEnd();
    }
  };

  // Double-tap to like handler
  const handleDoubleTap = () => {
    if (!isUser && onLikeMessage) {
      onLikeMessage(message.id);
      setShowHeartAnimation(true);
      // Add haptic feedback
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      
      // Hide heart animation after 2 seconds
      setTimeout(() => setShowHeartAnimation(false), 2000);
    }
  };

  const handleTap = () => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;
    
    if (timeSinceLastTap < DOUBLE_TAP_DELAY) {
      // This is a double tap
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
        tapTimeoutRef.current = null;
      }
      handleDoubleTap();
    } else {
      // This might be a single tap, wait to see if there's another
      lastTapRef.current = now;
      tapTimeoutRef.current = setTimeout(() => {
        tapTimeoutRef.current = null;
        // Handle single tap if needed (currently no action)
      }, DOUBLE_TAP_DELAY);
    }
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const renderTicks = (status: MessageStatus) => {
    if (!isUser) return null;
    
    // Use readAt timestamp if available, otherwise fall back to timestamp
    const readTime = message.readAt ? new Date(message.readAt) : timestamp;
    const deliveryTime = message.deliveredAt ? new Date(message.deliveredAt) : timestamp;
    const now = new Date();
    
    if (status === 'read') {
      const timeSinceRead = now.getTime() - readTime.getTime();
      
      // More realistic timing - show online indicator based on when actually read
      let tickClass = 'text-blue-500'; // Default read (blue)
      if (timeSinceRead < 30 * 1000) {
        tickClass = 'text-green-500'; // Very recent read (green - she's online)
      } else if (timeSinceRead < 2 * 60 * 1000) {
        tickClass = 'text-blue-400'; // Recent read
      }
      
      return <CheckCheck className={`h-4 w-4 ${tickClass} ml-1`} />;
    }
    if (status === 'delivered') {
      return <CheckCheck className="h-4 w-4 text-muted-foreground ml-1" />;
    }
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


  const renderNativeAdContent = () => {
    if (!message.isNativeAd || !message.nativeAdCode) return null;

    // Use a ref to inject the script after component mounts
    const adRef = useRef<HTMLDivElement>(null);
    const [adInjected, setAdInjected] = useState(false);

    useEffect(() => {
      if (adRef.current && message.nativeAdCode && !adInjected) {
        try {
          // Clear any existing content
          adRef.current.innerHTML = '';
          
          // Create a unique timestamp for this ad injection
          const timestamp = Date.now();
          
          // Modify the ad code to include unique identifiers if needed
          let modifiedAdCode = message.nativeAdCode;
          
          // Replace any generic IDs with unique ones based on message ID
          if (modifiedAdCode.includes('id=')) {
            modifiedAdCode = modifiedAdCode.replace(/id="([^"]*)"/, `id="$1_${message.id}"`);
          }
          
          // Create a fragment and inject the ad code
          const fragment = document.createRange().createContextualFragment(modifiedAdCode);
          adRef.current.appendChild(fragment);
          setAdInjected(true);
          
          console.log('Native ad rendered for message:', message.id, 'with container ID:', message.nativeAdId);
        } catch (error) {
          console.error('Error injecting native ad:', error);
          try {
            // Fallback to innerHTML if fragment creation fails
            adRef.current.innerHTML = message.nativeAdCode;
            setAdInjected(true);
          } catch (fallbackError) {
            console.error('Fallback ad injection also failed:', fallbackError);
          }
        }
      }
    }, [message.nativeAdCode, message.id, adInjected]);

    return (
      <div className="native-ad-container w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground font-medium bg-muted/30 px-2 py-1 rounded-full">
            Sponsored
          </span>
        </div>
        <div 
          ref={adRef}
          className="native-ad-content min-h-[80px]"
          id={message.nativeAdId || `native-ad-${message.id}`}
          key={`native-ad-${message.id}-${message.timestamp.getTime()}`}
        />
      </div>
    );
  };

  const renderMessageContent = () => {
    if (message.isNativeAd) {
      return renderNativeAdContent();
    }

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
      <div className={cn(
        "flex items-end relative",
        isAd ? "max-w-[85%] sm:max-w-[80%]" : "max-w-[75%] sm:max-w-[65%]"
      )}
           ref={bubbleRef}>
        {!isUser && !isAd && (
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
        {isAd && (
          <div className="h-8 w-8 mr-2 self-end shrink-0 flex items-center justify-center bg-blue-500/20 text-blue-600 rounded-full text-xs font-medium">
            Ad
          </div>
        )}
        {/* Enhanced WhatsApp-like reply icon that appears during swipe */}
        {!isUser && swipeOffset > 15 && (
          <div 
            className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-100"
            style={{ 
              opacity: Math.min(swipeOffset / swipeThreshold, 1),
              transform: `translateY(-50%) scale(${Math.min(0.8 + (swipeOffset / swipeThreshold) * 0.4, 1.2)})`,
            }}
          >
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200",
              swipeOffset > swipeThreshold ? "bg-blue-500/20 text-blue-600" : "bg-muted/30 text-muted-foreground"
            )}>
              <Reply className="h-4 w-4" />
            </div>
          </div>
        )}
        
        <div
          className={cn(
            'px-3 py-2 shadow-md break-words transition-transform duration-100 relative',
            isUser
              ? 'bg-chat-bg-user text-chat-text-user rounded-lg rounded-br-sm'
              : isAd
              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 text-foreground rounded-lg border border-blue-200 dark:border-blue-800'
              : 'bg-chat-bg-ai text-chat-text-ai rounded-lg rounded-bl-sm'
          )}
          style={{ 
            transform: !isUser && !isAd ? `translateX(${swipeOffset}px)` : 'none',
            transition: isDragging ? 'none' : 'transform 0.2s ease-out'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={!isAd ? handleTap : undefined}
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
          {!isAd && (
            <div className="flex items-center justify-end mt-1">
              <span className={cn('text-xs',
                isUser ? 'text-chat-text-user/70' : 'text-muted-foreground/90'
              )}>
                {formatTime(timestamp)}
              </span>
              {renderTicks(message.status)}
              {message.isLiked && (
                <Heart className="h-3 w-3 text-red-500 ml-1 fill-current" />
              )}
            </div>
          )}
          {isAd && (
            <div className="flex items-center justify-center mt-2">
              <span className="text-xs text-muted-foreground/60">
                Advertisement
              </span>
            </div>
          )}
          
          {/* Heart animation overlay for double-tap */}
          {showHeartAnimation && !isUser && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Heart 
                className="h-8 w-8 text-red-500 fill-current animate-ping" 
                style={{
                  animationDuration: '0.5s',
                  animationIterationCount: '4'
                }}
              />
            </div>
          )}
        </div>
        
        {/* Enhanced Quick Reply Options with WhatsApp-like styling */}
        {showQuickReplies && !isUser && !isAd && (
          <div className="absolute top-full left-0 mt-2 flex flex-wrap gap-2 bg-background/98 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-border/50 z-20 max-w-[300px] animate-in slide-in-from-left-2 fade-in-0 duration-200">
            <div className="flex items-center gap-1 mb-2 w-full">
              <Reply className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">Quick Reply</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs px-1 py-1 h-auto min-h-[20px] rounded-full text-muted-foreground hover:text-foreground ml-auto"
                onClick={() => setShowQuickReplies(false)}
              >
                ✕
              </Button>
            </div>
            {getQuickReplies().slice(0, 6).map((reply, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs px-3 py-2 h-auto min-h-[32px] rounded-full bg-card hover:bg-accent hover:scale-105 transition-all duration-200 border-border/30"
                onClick={() => handleQuickReplySelect(reply)}
              >
                {reply}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
