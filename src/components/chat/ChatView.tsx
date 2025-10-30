import React, { useEffect, useRef, useState } from 'react';
import type { Message, MessageReaction } from '@/types';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { analyticsTracker } from '@/lib/analytics-tracker';

interface ChatViewProps {
  messages: Message[];
  aiAvatarUrl: string;
  aiName: string;
  isAiTyping: boolean;
  onTriggerAd?: () => void;
  onQuickReply?: (replyText: string, originalMessage: Message) => void;
  onLikeMessage?: (messageId: string) => void;
  onReactToMessage?: (messageId: string, reaction: MessageReaction) => void;
  onAvatarClick?: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ messages, aiAvatarUrl, aiName, isAiTyping, onTriggerAd, onQuickReply, onLikeMessage, onReactToMessage, onAvatarClick }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentlySwipingMessageId, setCurrentlySwipingMessageId] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSwipeStart = (messageId: string) => {
    setCurrentlySwipingMessageId(messageId);
  };

  const handleSwipeEnd = () => {
    setCurrentlySwipingMessageId(null);
  };

  useEffect(scrollToBottom, [messages, isAiTyping]);

  // Track message interactions for analytics
  useEffect(() => {
    messages.forEach(message => {
      // Track new messages for analytics
      const messageKey = `tracked_${message.id}`;
      if (!sessionStorage.getItem(messageKey)) {
        const senderType = message.sender === 'ai' || (message.sender as any) === 'ad' ? 'ai' : 'user';
        analyticsTracker.trackMessage(
          message.id,
          senderType,
          message.text || '',
          !!(message.aiImageUrl || message.userImageUrl)
        );

        // Mark as tracked in session storage
        sessionStorage.setItem(messageKey, 'true');
      }
    });
  }, [messages]);

  // Limit rendered messages on low-end devices
  const isLowEnd = typeof window !== 'undefined' && (performance as any).memory?.jsHeapSizeLimit < 1073741824;
  const maxMessages = isLowEnd ? 30 : 100;
  const filteredMessages = messages.slice(-maxMessages);


  return (
    <div 
      className="p-3 space-y-2 bg-chat-bg-default custom-scrollbar"
      data-chat-container="true"
      style={{ minHeight: '100%', paddingBottom: '1rem' }}
    >
      {filteredMessages.map((msg) => (
        <MessageBubble 
            key={msg.id} 
            message={msg} 
            aiAvatarUrl={aiAvatarUrl} 
            aiName={aiName} 
            onTriggerAd={onTriggerAd}
            onQuickReply={onQuickReply}
            onLikeMessage={onLikeMessage}
            onReactToMessage={onReactToMessage}
            currentlySwipingMessageId={currentlySwipingMessageId}
            onSwipeStart={handleSwipeStart}
            onSwipeEnd={handleSwipeEnd}
            onAvatarClick={onAvatarClick}
        />
      ))}
      {isAiTyping && <TypingIndicator avatarUrl={aiAvatarUrl} />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatView;