
'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function RateLimitWarning() {
  const [isRateLimited, setIsRateLimited] = useState(false);

  useEffect(() => {
    const checkRateLimit = () => {
      const messagesCount = parseInt(sessionStorage.getItem('messages_sent_count') || '0');
      const messagesLimit = 100; // Messages per hour
      
      if (messagesCount > messagesLimit * 0.8) {
        setIsRateLimited(true);
      }
    };

    checkRateLimit();
    const interval = setInterval(checkRateLimit, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!isRateLimited) return null;

  return (
    <Alert className="fixed bottom-20 left-4 right-4 z-40 bg-yellow-50 border-yellow-200">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800 text-sm">
        You're approaching the message limit. Slow down to avoid temporary restrictions.
      </AlertDescription>
    </Alert>
  );
}
