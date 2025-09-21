
import React, { useEffect, useRef, useState } from 'react';
import type { Message, MessageReaction } from '@/types';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

interface ChatViewProps {
  messages: Message[];
  aiAvatarUrl: string;
  aiName: string;
  isAiTyping: boolean;
  onTriggerAd?: () => void; // New prop for handling ad clicks from bubbles
  onQuickReply?: (replyText: string, originalMessage: Message) => void;
  onLikeMessage?: (messageId: string) => void;
  onReactToMessage?: (messageId: string, reaction: MessageReaction) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ messages, aiAvatarUrl, aiName, isAiTyping, onTriggerAd, onQuickReply, onLikeMessage, onReactToMessage }) => {
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

  return (
    <div 
      className="flex-grow overflow-y-auto p-4 space-y-4 bg-chat-bg-default custom-scrollbar"
    >
      {messages.map((msg) => (
        <MessageBubble 
            key={msg.id} 
            message={msg} 
            aiAvatarUrl={aiAvatarUrl} 
            aiName={aiName} 
            onTriggerAd={onTriggerAd} // Pass down the callback
            onQuickReply={onQuickReply} // Pass down quick reply callback
            onLikeMessage={onLikeMessage} // Pass down like callback
            onReactToMessage={onReactToMessage} // Pass down reaction callback
            currentlySwipingMessageId={currentlySwipingMessageId} // Pass swipe state
            onSwipeStart={handleSwipeStart} // Handle swipe start
            onSwipeEnd={handleSwipeEnd} // Handle swipe end
        />
      ))}
      {isAiTyping && <TypingIndicator avatarUrl={aiAvatarUrl} />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatView;
    
