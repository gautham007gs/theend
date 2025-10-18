
"use client";

import React, { useEffect, useRef } from 'react';
import type { AdSettings } from '@/types';
import { useAdSettings } from '@/contexts/AdSettingsContext'; // Import useAdSettings

const GlobalAdScripts: React.FC = () => {
  const { adSettings, isLoadingAdSettings } = useAdSettings(); // Consume context
  const adsterraPopunderInjected = useRef(false);
  const monetagPopunderInjected = useRef(false);
  const cleanupFunctionsRef = useRef<(() => void)[]>([]);
  const visibilityHandlerRef = useRef<(() => void) | null>(null);

  // CRITICAL: Cleanup function to prevent freezing after ads
  const performAdCleanup = () => {
    console.log('🧹 Ad Cleanup: Performing aggressive cleanup after ad interaction...');
    
    // Clear all ad-related timers
    const highestTimeoutId = setTimeout(() => {}, 0);
    for (let i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }
    
    // Clear all intervals
    const highestIntervalId = setInterval(() => {}, 99999);
    for (let i = 0; i < highestIntervalId; i++) {
      clearInterval(i);
    }
    
    // Remove ad network event listeners
    const adNetworkEvents = ['click', 'mousedown', 'touchstart', 'beforeunload', 'popstate'];
    adNetworkEvents.forEach(eventType => {
      const oldHandler = (window as any)[`on${eventType}`];
      if (oldHandler && typeof oldHandler === 'function') {
        (window as any)[`on${eventType}`] = null;
      }
    });
    
    // Force garbage collection hint
    if ((window as any).gc) {
      (window as any).gc();
    }
    
    console.log('✅ Ad Cleanup: Completed aggressive cleanup');
  };

  // CRITICAL: Handle page visibility to detect return from ad
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('👁️ Page Visibility: User returned to chat page');
        
        // Detect if we're returning from an ad (tab was hidden)
        const wasHidden = sessionStorage.getItem('page_was_hidden');
        if (wasHidden === 'true') {
          console.log('🔄 Ad Return Detected: Performing recovery cleanup...');
          
          // Perform aggressive cleanup
          performAdCleanup();
          
          // Clear service worker cache to prevent corruption
          if ('caches' in window) {
            caches.keys().then(names => {
              names.forEach(name => {
                if (name.includes('maya-chat') || name.includes('next')) {
                  caches.delete(name);
                  console.log(`🗑️ Cleared cache: ${name}`);
                }
              });
            });
          }
          
          // Reset React rendering by forcing a clean state
          setTimeout(() => {
            sessionStorage.removeItem('page_was_hidden');
            console.log('✅ Recovery complete - page should be responsive now');
          }, 100);
        }
      } else if (document.visibilityState === 'hidden') {
        console.log('👁️ Page Visibility: User left chat page (possibly ad)');
        sessionStorage.setItem('page_was_hidden', 'true');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    visibilityHandlerRef.current = handleVisibilityChange;

    return () => {
      if (visibilityHandlerRef.current) {
        document.removeEventListener('visibilitychange', visibilityHandlerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isLoadingAdSettings || !adSettings || typeof document === 'undefined') {
      return;
    }

    // Reset injection flags if ad codes change or ads are disabled
    if (!adSettings.adsEnabledGlobally) {
      adsterraPopunderInjected.current = false;
      monetagPopunderInjected.current = false;
      
      // Clean up any existing ad scripts
      cleanupFunctionsRef.current.forEach(cleanup => cleanup());
      cleanupFunctionsRef.current = [];
      return;
    }

    const injectAdScripts = () => {
      if (adSettings.adsEnabledGlobally) {
        // Adsterra Pop-under - delayed by 3 seconds
        if (adSettings.adsterraPopunderEnabled && !adsterraPopunderInjected.current) {
          const delayAdsterraPopunder = () => {
            injectScript(adSettings.adsterraPopunderCode, "Adsterra Pop-under", adsterraPopunderInjected);
          };
          
          if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
              setTimeout(delayAdsterraPopunder, 3000);
            });
          } else {
            setTimeout(delayAdsterraPopunder, 3000);
          }
        }

        // Monetag Pop-under - delayed by 3 seconds
        if (adSettings.monetagPopunderEnabled && !monetagPopunderInjected.current) {
          const delayMonetagPopunder = () => {
            injectScript(adSettings.monetagPopunderCode, "Monetag Pop-under", monetagPopunderInjected);
          };
          
          if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
              setTimeout(delayMonetagPopunder, 3000);
            });
          } else {
            setTimeout(delayMonetagPopunder, 3000);
          }
        }
      }
    };

    const injectScript = (scriptCode: string, networkName: string, injectedRef: React.MutableRefObject<boolean>) => {
      if (injectedRef.current || !scriptCode || !scriptCode.trim()) {
        console.log(`${networkName}: Script injection skipped - already injected or empty code`);
        return; 
      }

      try {
        console.log(`${networkName}: Starting ISOLATED script injection...`);
        const scriptContainer = document.createElement('div');
        scriptContainer.innerHTML = scriptCode;
        scriptContainer.setAttribute('data-ad-network', networkName);
        
        const injectedElements: (HTMLElement | HTMLScriptElement)[] = [];
        let hasValidScriptTag = false;
        
        Array.from(scriptContainer.childNodes).forEach(node => {
          if (node.nodeName === "SCRIPT") {
            const scriptTag = document.createElement('script');
            const originalScript = node as HTMLScriptElement;
            
            // Add isolation markers
            scriptTag.setAttribute('data-ad-network', networkName);
            scriptTag.setAttribute('data-ad-type', 'popunder');
            
            // Copy all attributes
            for (let i = 0; i < originalScript.attributes.length; i++) {
              const attr = originalScript.attributes[i];
              scriptTag.setAttribute(attr.name, attr.value);
            }
            
            // Copy inline script content with error handling wrapper
            if (originalScript.innerHTML.trim()) {
              const wrappedCode = `
                try {
                  ${originalScript.innerHTML}
                } catch (e) {
                  console.warn('${networkName} Ad Script Error:', e);
                }
              `;
              scriptTag.innerHTML = wrappedCode;
            }
            
            if (scriptTag.src || scriptTag.innerHTML.trim()) {
              hasValidScriptTag = true;
              document.body.appendChild(scriptTag);
              injectedElements.push(scriptTag);
              console.log(`${networkName}: Script tag appended (isolated, src: ${scriptTag.src || 'inline'})`);
            }
          } else if (node.nodeType !== Node.TEXT_NODE || node.textContent?.trim()) {
            const clonedNode = node.cloneNode(true) as HTMLElement;
            if (clonedNode.setAttribute) {
              clonedNode.setAttribute('data-ad-network', networkName);
            }
            document.body.appendChild(clonedNode);
            injectedElements.push(clonedNode);
          }
        });

        if (hasValidScriptTag) {
          injectedRef.current = true;
          console.log(`${networkName}: Script successfully injected (isolated with ${injectedElements.length} elements)`);
          
          // Store cleanup function
          const cleanup = () => {
            console.log(`${networkName}: Cleaning up ${injectedElements.length} ad elements...`);
            injectedElements.forEach(el => {
              if (el.parentNode) {
                el.parentNode.removeChild(el);
              }
            });
            injectedRef.current = false;
          };
          cleanupFunctionsRef.current.push(cleanup);
        } else {
          console.warn(`${networkName}: No valid script tags found in provided code`);
        }

      } catch (e) {
        console.error(`${networkName}: Error during script injection:`, e);
      }
    };

    // Inject ad scripts immediately
    injectAdScripts();
    
    // Cleanup on unmount
    return () => {
      console.log('🧹 GlobalAdScripts: Component unmounting, cleaning up...');
      cleanupFunctionsRef.current.forEach(cleanup => cleanup());
      cleanupFunctionsRef.current = [];
      performAdCleanup();
    };
  }, [adSettings, isLoadingAdSettings]);

  return null; 
};

export default GlobalAdScripts;
