"use client";

import { ReactNode } from 'react';

interface MediaProtectionProps {
  children: ReactNode;
  className?: string;
}

export function MediaProtection({ children, className = '' }: MediaProtectionProps) {
  const protectionStyles = {
    userSelect: 'none' as const,
    WebkitUserSelect: 'none' as const,
    MozUserSelect: 'none' as const,
    msUserSelect: 'none' as const,
    WebkitTouchCallout: 'none' as const,
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    return false;
  };

  return (
    <div
      className={`screenshot-protected ${className}`}
      style={protectionStyles}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      draggable={false}
    >
      {children}
    </div>
  );
}
