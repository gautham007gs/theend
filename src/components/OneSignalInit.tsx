'use client';

import { useEffect } from 'react';
import { initOneSignal } from '@/lib/onesignal';

export default function OneSignalInit() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initOneSignal();
    }
  }, []);

  return null;
}
