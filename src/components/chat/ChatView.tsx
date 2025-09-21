import React, { useEffect, useRef, useState } from 'react';
import type { Message, MessageReaction } from '@/types';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

// Assuming ChatHeader is defined elsewhere and imported.
// For the sake of completeness, let's include a placeholder if it's not provided.
// If ChatHeader is in another file, ensure it's correctly imported.
// For example: import ChatHeader from './ChatHeader';

// Placeholder for ChatHeader if not provided in the original context
const ChatHeader: React.FC<{ profile: any }> = ({ profile }) => (
  <div className="p-4 border-b border-gray-200 bg-white flex items-center space-x-4">
    {profile?.avatarUrl && (
      <img src={profile.avatarUrl} alt="AI Avatar" className="w-10 h-10 rounded-full" />
    )}
    <h2 className="text-lg font-semibold">{profile?.name || 'AI Assistant'}</h2>
  </div>
);


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

// Mock aiProfile for the ChatHeader, assuming it's passed implicitly or derived
const aiProfile = {
  name: 'AI Assistant', // Default name if not explicitly passed
  avatarUrl: '/path/to/default/ai-avatar.png' // Default avatar if not explicitly passed
};


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

  // Ensure aiAvatarUrl and aiName are used if provided, otherwise use defaults from aiProfile
  const effectiveAiAvatarUrl = aiAvatarUrl || aiProfile.avatarUrl;
  const effectiveAiName = aiName || aiProfile.name;

  useEffect(scrollToBottom, [messages, isAiTyping]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <ChatHeader profile={{ name: effectiveAiName, avatarUrl: effectiveAiAvatarUrl }} />

      <div 
        ref={messagesEndRef}
        data-chat-container
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{
          backgroundImage: `url('/chat-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          contain: 'layout style',
          willChange: 'scroll-position'
        }}
      >
        {messages.map((msg) => (
          <MessageBubble 
              key={msg.id} 
              message={msg} 
              aiAvatarUrl={effectiveAiAvatarUrl} 
              aiName={effectiveAiName} 
              onTriggerAd={onTriggerAd} // Pass down the callback
              onQuickReply={onQuickReply} // Pass down quick reply callback
              onLikeMessage={onLikeMessage} // Pass down like callback
              onReactToMessage={onReactToMessage} // Pass down reaction callback
              currentlySwipingMessageId={currentlySwipingMessageId} // Pass swipe state
              onSwipeStart={handleSwipeStart} // Handle swipe start
              onSwipeEnd={handleSwipeEnd} // Handle swipe end
          />
        ))}
        {isAiTyping && <TypingIndicator avatarUrl={effectiveAiAvatarUrl} />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatView;