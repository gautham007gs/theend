"use client";

import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DirectLinkAdProps {
  isVisible: boolean;
  directLinkUrl: string | null;
  onClose: () => void;
}

const DirectLinkAd: React.FC<DirectLinkAdProps> = ({ isVisible, directLinkUrl, onClose }) => {
  if (!isVisible || !directLinkUrl) {
    return null;
  }

  const handleAdClick = () => {
    window.open(directLinkUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div
      className={cn(
        "fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50",
        "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
        "rounded-full shadow-2xl px-6 py-3",
        "flex items-center gap-3 animate-bounce-slow",
        "max-w-sm"
      )}
    >
      <button
        onClick={handleAdClick}
        className="flex-grow text-left font-semibold hover:underline"
      >
        ✨ Special Offer - Click Here! ✨
      </button>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="h-6 w-6 rounded-full bg-white/20 hover:bg-white/30 text-white flex-shrink-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DirectLinkAd;
