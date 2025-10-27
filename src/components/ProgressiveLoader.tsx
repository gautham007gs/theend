
'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ProgressiveLoaderProps {
  children: React.ReactNode;
  delay?: number;
  fallback?: React.ReactNode;
}

export const ProgressiveLoader: React.FC<ProgressiveLoaderProps> = ({
  children,
  delay = 300,
  fallback,
}) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!isReady) {
    return fallback || (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
};
