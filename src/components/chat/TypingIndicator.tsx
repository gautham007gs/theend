
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TypingIndicatorProps {
  avatarUrl: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ avatarUrl }) => {
  return (
    <div className="flex items-end space-x-2 mb-2">
      <Avatar className="h-8 w-8 mb-0.5 flex-shrink-0">
        <AvatarImage src={avatarUrl} alt="AI Avatar" data-ai-hint="profile woman" />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
      <div className="flex items-center justify-center gap-1.5 bg-white dark:bg-gray-800 rounded-tl-lg rounded-tr-lg rounded-br-lg px-4 py-3 shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] min-w-[65px]">
        <span className="typing-dot"></span>
        <span className="typing-dot typing-dot-delay-1"></span>
        <span className="typing-dot typing-dot-delay-2"></span>
      </div>
      <style jsx>{`
        .typing-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          background-color: #90949c;
          border-radius: 50%;
          animation: whatsapp-bounce 1.4s infinite ease-in-out both;
        }
        
        .typing-dot-delay-1 {
          animation-delay: -0.32s;
        }
        
        .typing-dot-delay-2 {
          animation-delay: -0.16s;
        }
        
        @keyframes whatsapp-bounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @media (prefers-color-scheme: dark) {
          .typing-dot {
            background-color: #8696a0;
          }
        }
      `}</style>
    </div>
  );
};

export default TypingIndicator;
