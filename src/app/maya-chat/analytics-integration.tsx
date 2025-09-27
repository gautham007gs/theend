// Analytics Integration for Maya Chat
import { useEffect } from 'react';
import { analyticsTracker } from '@/lib/analytics-tracker';

// Hook to integrate analytics into chat components
export const useAnalyticsTracking = () => {
  useEffect(() => {
    // Track page view
    analyticsTracker.trackPageView('chat');

    // Set up message tracking observer
    const messageObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && (node as Element).classList.contains('message')) {
              const messageElement = node as HTMLElement;
              const isUserMessage = messageElement.classList.contains('user-message');
              const hasImage = messageElement.querySelector('img') !== null;
              const messageId = messageElement.getAttribute('data-message-id') || `msg_${Date.now()}`;
              const content = messageElement.textContent || '';

              analyticsTracker.trackMessage(
                messageId,
                isUserMessage ? 'user' : 'ai',
                content,
                hasImage
              );

              if (hasImage) {
                analyticsTracker.trackImageShare(messageElement.querySelector('img')?.src || '');
              }
            }
          });
        }
      });
    });

    // Observe chat container for new messages
    const chatContainer = document.querySelector('.chat-container, [data-chat-container], .messages-container');
    if (chatContainer) {
      messageObserver.observe(chatContainer, {
        childList: true,
        subtree: true
      });
    }

    // Track ad interactions
    const setupAdTracking = () => {
      const adElements = document.querySelectorAll('[data-ad-type]');
      adElements.forEach(adElement => {
        const adType = adElement.getAttribute('data-ad-type') || 'unknown';
        
        // Track ad view
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              analyticsTracker.trackAdInteractionPublic(adType, 'view');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.5 });

        observer.observe(adElement);

        // Track ad clicks
        adElement.addEventListener('click', () => {
          analyticsTracker.trackAdInteractionPublic(adType, 'click');
        });
      });
    };

    // Set up ad tracking after a delay to ensure ads are loaded
    setTimeout(setupAdTracking, 2000);

    return () => {
      messageObserver.disconnect();
    };
  }, []);

  return {
    trackMessage: analyticsTracker.trackMessage.bind(analyticsTracker),
    trackImageShare: analyticsTracker.trackImageShare.bind(analyticsTracker),
    trackAdInteraction: analyticsTracker.trackAdInteractionPublic.bind(analyticsTracker)
  };
};

// Component to add analytics to existing chat
export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useAnalyticsTracking();
  return <>{children}</>;
};