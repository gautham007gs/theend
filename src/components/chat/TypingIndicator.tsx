import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TypingIndicatorProps {
  avatarUrl: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ avatarUrl }) => {
  return (
    <div className="flex items-end space-x-2">
      <Avatar className="h-8 w-8 mb-0.5">
        <AvatarImage src={avatarUrl} alt="AI Avatar" data-ai-hint="profile woman" />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
      <div className="flex items-center justify-center gap-1 bg-white dark:bg-gray-800 text-gray-500 rounded-tl-lg rounded-tr-lg rounded-br-lg px-4 py-2.5 shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] min-w-[60px]">
        <span className="typing-dot animate-bounce [animation-delay:-0.3s]"></span>
        <span className="typing-dot animate-bounce [animation-delay:-0.15s]"></span>
        <span className="typing-dot animate-bounce"></span>
      </div>
      <style jsx>{`
        .typing-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          background-color: #9CA3AF;
          border-radius: 50%;
        }
        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-8px);
          }
        }
        .typing-dot {
          animation: bounce 1.4s infinite;
        }
      `}</style>
    </div>
  );
};

export default TypingIndicator;
