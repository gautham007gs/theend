import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Check, CheckCheck, Reply, Heart, ThumbsUp, Smile, X } from 'lucide-react';
import type { Message, MessageStatus, MessageReaction } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { defaultAIProfile } from '@/config/ai';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

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
  onAvatarClick?: () => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, aiAvatarUrl, aiName, onTriggerAd, onQuickReply, onLikeMessage, onReactToMessage, currentlySwipingMessageId, onSwipeStart, onSwipeEnd, onAvatarClick }) => {
  const { toast } = useToast(); // Added toast hook
  const isUser = message.sender === 'user';
  const isAd = message.isNativeAd;
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

  // Reaction picker state
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [reactionPickerPosition, setReactionPickerPosition] = useState({ x: 0, y: 0 });

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
    const [lastAdCode, setLastAdCode] = useState(message.nativeAdCode);

    useEffect(() => {
      // Check if ad code has changed (for rotation)
      if (message.nativeAdCode !== lastAdCode) {
        setAdInjected(false);
        setLastAdCode(message.nativeAdCode || '');
      }

      if (adRef.current && message.nativeAdCode && !adInjected) {
        try {
          // Clear any existing content first
          adRef.current.innerHTML = '';

          // Small delay to ensure cleanup
          setTimeout(() => {
            if (adRef.current && message.nativeAdCode) {
              // Create a fragment and inject the new ad code
              const fragment = document.createRange().createContextualFragment(message.nativeAdCode);
              adRef.current.appendChild(fragment);
              setAdInjected(true);

              console.log('Native ad content updated in bubble:', message.id,
                         'Ad ID:', message.nativeAdId);
            }
          }, 50);
        } catch (error) {
          console.error('Error injecting native ad:', error);
          // Fallback to innerHTML if fragment creation fails
          setTimeout(() => {
            if (adRef.current && message.nativeAdCode) {
              adRef.current.innerHTML = message.nativeAdCode;
              setAdInjected(true);
            }
          }, 50);
        }
      }
    }, [message.nativeAdCode, adInjected, lastAdCode]);

    return (
      <div className="native-ad-container w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground font-medium bg-muted/30 px-2 py-1 rounded-full">
            Sponsored
          </span>
          {/* Add subtle refresh indicator */}
          <span className="text-xs text-muted-foreground/60">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div
          ref={adRef}
          className="native-ad-content min-h-[80px]"
          id={message.nativeAdId}
          key={message.nativeAdId} // Force re-render on ID change
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

    // Render view-once image if present (for both AI and user messages)
    if (message.isViewOnce) {
      const viewOnceImageUrl = message.aiImageUrl || message.userImageUrl;
      if (viewOnceImageUrl) {
        return <ViewOnceImage imageUrl={viewOnceImageUrl} messageId={message.id} isUserSent={message.sender === 'user'} />;
      }
    }

    return message.text && <p className="text-sm whitespace-pre-wrap">{message.text}</p>;
  };

  // WhatsApp-style View Once Image Component with Dialog - Similar to DP zoom
  const ViewOnceImage: React.FC<{ imageUrl: string; messageId: string; isUserSent?: boolean }> = ({ imageUrl, messageId, isUserSent = false }) => {
    const [isViewed, setIsViewed] = useState(false);
    const [showImageDialog, setShowImageDialog] = useState(false);
    const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      const viewedKey = `viewed_${messageId}`;
      const alreadyViewed = localStorage.getItem(viewedKey) === 'true';
      setIsViewed(alreadyViewed);
    }, [messageId]);

    useEffect(() => {
      // Cleanup timer on unmount
      return () => {
        if (autoCloseTimerRef.current) {
          clearTimeout(autoCloseTimerRef.current);
        }
      };
    }, []);

    const handleViewImage = () => {
      if (isViewed) return;

      setShowImageDialog(true);
      if (navigator.vibrate) navigator.vibrate(50);

      // Auto-close after 5 seconds and mark as viewed
      autoCloseTimerRef.current = setTimeout(() => {
        setShowImageDialog(false);
        setIsViewed(true);
        localStorage.setItem(`viewed_${messageId}`, 'true');
      }, 5000);
    };

    const handleCloseDialog = () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
      setShowImageDialog(false);
      setIsViewed(true);
      localStorage.setItem(`viewed_${messageId}`, 'true');
    };

    // WhatsApp-style compact bubble
    return (
      <>
        <div
          className={cn(
            "inline-flex items-center gap-1 py-0.5 px-1 cursor-pointer select-none rounded-md max-w-[120px]",
            !isViewed && "hover:opacity-90 transition-opacity"
          )}
          onClick={handleViewImage}
          style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
        >
          {!isViewed ? (
            <>
              <div className="relative w-6 h-6 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#25D366" strokeWidth="2" strokeDasharray="31.4 31.4" strokeDashoffset="15.7"/>
                  <text x="12" y="16.5" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#25D366">1</text>
                </svg>
              </div>
              <div className="flex items-center gap-0.5 min-w-0">
                <svg className="w-3 h-3 text-[#25D366] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <span className="text-[#25D366] text-[10px] font-medium truncate">Photo</span>
              </div>
            </>
          ) : (
            <>
              <div className="w-6 h-6 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="2" />
                  <path fillRule="evenodd" d="M10 4C5.5 4 1.73 6.943.458 10 1.732 13.057 5.522 16 10 16s8.268-2.943 9.542-6C18.268 6.943 14.478 4 10 4zm0 10a4 4 0 110-8 4 4 0 010 8z" clipRule="evenodd" />
                  <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-gray-500 dark:text-gray-400 text-[10px] truncate">Opened</span>
            </>
          )}
        </div>

        {/* Full-screen Dialog like DP zoom */}
        <Dialog open={showImageDialog} onOpenChange={(open) => !open && handleCloseDialog()}>
          <DialogContent className="fixed left-[50%] top-[50%] z-[100] w-[95vw] max-w-2xl h-auto translate-x-[-50%] translate-y-[-50%] bg-black border-0 shadow-2xl rounded-2xl p-0 overflow-hidden [&>button]:hidden">
            {/* Header with view-once indicator */}
            <div className="relative">
              <div className="absolute inset-0 bg-black"></div>
              <div className="relative flex items-center justify-between p-4 text-white border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCloseDialog}
                    className="text-white hover:bg-white/10 h-10 w-10 rounded-full p-0"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="#25D366" strokeWidth="2" strokeDasharray="31.4 31.4" strokeDashoffset="15.7"/>
                      <text x="12" y="16.5" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">1</text>
                    </svg>
                    <DialogTitle className="text-white text-lg font-medium">
                      View Once Photo
                    </DialogTitle>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Section with screenshot protection */}
            <div className="flex flex-col items-center py-8 px-6 bg-black min-h-[400px] max-h-[70vh] justify-center">
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={imageUrl}
                  alt="View once photo"
                  width={600}
                  height={600}
                  className="max-w-full max-h-[60vh] w-auto h-auto object-contain rounded-lg select-none"
                  style={{
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    WebkitTouchCallout: 'none'
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                  draggable={false}
                  priority={true}
                  unoptimized
                />
              </div>
              <p className="text-white/70 text-sm mt-4 text-center">
                This photo will disappear after closing
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  };


  // Reaction picker component
  const ReactionPicker: React.FC<{ messageId: string }> = ({ messageId }) => {
    const reactions: MessageReaction[] = ['❤️', '👍', '😂', '😮', '😢', '😠'];

    const handleReactionClick = (reaction: MessageReaction) => {
      if (onReactToMessage) {
        onReactToMessage(messageId, reaction);
      }
      setShowReactionPicker(false);
    };

    return (
      <div
        className="absolute z-50 flex items-center gap-2 p-2 bg-background/95 border border-border rounded-full shadow-lg backdrop-blur-md animate-in slide-in-from-bottom-2 fade-in-0 duration-200"
        style={{ top: reactionPickerPosition.y, left: reactionPickerPosition.x }}
      >
        {reactions.map((reaction) => (
          <button
            key={reaction}
            className="text-2xl p-1 hover:scale-110 transition-transform duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded-full"
            onClick={() => handleReactionClick(reaction)}
            aria-label={`React with ${reaction}`}
          >
            {reaction}
          </button>
        ))}
      </div>
    );
  };

  const handleLongPress = (e: React.TouchEvent | React.MouseEvent, messageId: string) => {
    e.preventDefault();
    const targetElement = e.target as HTMLElement;
    const rect = targetElement.getBoundingClientRect();

    // Adjust position to be above and centered, or adjust as needed
    let xPos = rect.left + (rect.width / 2);
    let yPos = rect.top - 60; // 60px above the element

    // Ensure it doesn't go off-screen left
    if (xPos < 100) xPos = 100;

    setReactionPickerPosition({ x: xPos, y: yPos });
    setShowReactionPicker(true);
    if (navigator.vibrate) navigator.vibrate(50);
  };


  const renderMessage = () => {
    // Render the reaction picker if active for this message
    if (showReactionPicker && message.id === 'currently_reacting_message_id') { // Placeholder for actual message ID logic
      return <ReactionPicker messageId={message.id} />;
    }

    return (
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
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          contain: 'layout style paint',
          willChange: isDragging ? 'transform' : 'auto'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        // Use onClick for tap and onContextMenu/longpress for reactions
        onClick={!isAd ? handleTap : undefined}
        onContextMenu={(e) => {
            if (!isUser && !isAd) { // Only allow reactions on AI messages
                handleLongPress(e, message.id);
            }
        }}
        onTouchStartCapture={(e) => { // Use touchStartCapture for mobile long press
            if (!isUser && !isAd) {
                // Implement a simple long press detection
                const touch = e.touches[0];
                const messageElement = e.currentTarget as HTMLElement;
                const startX = touch.clientX;
                const startY = touch.clientY;
                const startTime = Date.now();

                const handleMove = (moveEvent: TouchEvent) => {
                    const deltaX = moveEvent.touches[0].clientX - startX;
                    const deltaY = moveEvent.touches[0].clientY - startY;
                    if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
                        messageElement.removeEventListener('touchmove', handleMove);
                        messageElement.removeEventListener('touchend', handleEnd);
                    }
                };

                const handleEnd = () => {
                    messageElement.removeEventListener('touchmove', handleMove);
                    messageElement.removeEventListener('touchend', handleEnd);
                };

                messageElement.addEventListener('touchmove', handleMove);
                messageElement.addEventListener('touchend', handleEnd);

                const longPressTimer = setTimeout(() => {
                    messageElement.removeEventListener('touchmove', handleMove);
                    messageElement.removeEventListener('touchend', handleEnd);
                    handleLongPress(e as any, message.id); // Pass the original event
                }, 700); // 700ms for long press

                messageElement.addEventListener('touchend', () => clearTimeout(longPressTimer));
            }
        }}
      >
        {/* Only show regular images if NOT view-once */}
        {isValidImageSrc && imageToShowUrl && !message.isViewOnce && (
          <Image
            src={imageToShowUrl}
            alt="Sent image"
            width={200}
            height={200}
            className="rounded-md mb-1 max-w-full h-auto"
            data-ai-hint={imageHint}
            key={`${message.id}-content-img-${imageToShowUrl}`}
            onError={handleContentImageError}
            priority={false}
            loading="lazy"
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
            {/* Display reaction if present */}
            {message.reaction && (
              <span className="ml-1 text-lg">{message.reaction}</span>
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
    );
  };


  return (
    <div className={cn('flex w-full relative', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn(
        "flex items-end relative",
        isAd ? "max-w-[85%] sm:max-w-[80%]" : "max-w-[75%] sm:max-w-[65%]"
      )}
           ref={bubbleRef}>
        {!isUser && !isAd && (
          <button
            onClick={onAvatarClick}
            className="h-8 w-8 mr-2 self-end shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded-full"
            aria-label={`View ${aiName}'s profile`}
          >
            <Avatar
              className="h-8 w-8"
              key={`ai-msg-avatar-comp-${message.id}-${aiAvatarUrlToUse || 'default_avatar_comp_key_mb'}`}
              style={{ width: '32px', height: '32px', flexShrink: 0 }}
            >
              <AvatarImage
                src={aiAvatarUrlToUse || undefined}
                alt={`${aiName} - AI girlfriend`}
                data-ai-hint="profile woman"
                key={`ai-msg-avatar-img-${message.id}-${aiAvatarUrlToUse || 'no_avatar_fallback_img_mb'}`}
                onError={handleAIAvatarError}
                width={32}
                height={32}
                style={{ width: '32px', height: '32px', aspectRatio: '1/1' }}
              />
              <AvatarFallback>{(aiName || "K").charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </button>
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

        {renderMessage()}


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