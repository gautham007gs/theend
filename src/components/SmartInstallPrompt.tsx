
"use client";

import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function SmartInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Check if user dismissed before
    if (localStorage.getItem('pwa_install_dismissed')) {
      return;
    }

    // Show after 3 messages (user is engaged)
    const messageCount = parseInt(localStorage.getItem('total_messages') || '0');
    if (messageCount < 3) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installed');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa_install_dismissed', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-4">
      <Card className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-pink-500/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-pink-500/20 rounded-full">
            <Smartphone className="h-5 w-5 text-pink-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">
              Install Kruthika App
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Get instant access, offline chat, and never miss a message!
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleInstall}
                className="bg-pink-500 hover:bg-pink-600"
              >
                <Download className="h-4 w-4 mr-2" />
                Install Now
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
              >
                Later
              </Button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </Card>
    </div>
  );
}
