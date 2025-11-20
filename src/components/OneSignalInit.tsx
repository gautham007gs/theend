
'use client';

import { useEffect, useRef } from 'react';
import { initOneSignal } from '@/lib/onesignal';

export default function OneSignalInit() {
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (hasInitialized.current) {
      return;
    }

    if (typeof window !== 'undefined') {
      hasInitialized.current = true;
      initOneSignal();
    }
  }, []);

  return null;
}
