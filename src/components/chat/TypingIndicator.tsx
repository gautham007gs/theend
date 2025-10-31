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
        <span className="typing-dot typing-dot-1"></span>
        <span className="typing-dot typing-dot-2"></span>
        <span className="typing-dot typing-dot-3"></span>
      </div>
      <style jsx>{`
        .typing-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          background-color: #9CA3AF;
          border-radius: 50%;
          animation: whatsapp-typing 1.4s infinite;
        }
        
        .typing-dot-1 {
          animation-delay: 0s;
        }
        
        .typing-dot-2 {
          animation-delay: 0.2s;
        }
        
        .typing-dot-3 {
          animation-delay: 0.4s;
        }
        
        @keyframes whatsapp-typing {
          0% {
            transform: translateY(0px);
            opacity: 0.4;
          }
          28% {
            transform: translateY(-7px);
            opacity: 1;
          }
          44% {
            transform: translateY(0px);
            opacity: 0.4;
          }
          100% {
            transform: translateY(0px);
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
};

export default TypingIndicator;
