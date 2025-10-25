
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
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // FIXED: Cleanup only AD elements, NOT React timers
  const performAdCleanup = () => {
    // Defensive check: don't run if document is not available
    if (typeof document === 'undefined' || !document.querySelector) {
      console.warn('⚠️ Ad Cleanup: Document not available, skipping cleanup');
      return;
    }

    console.log('🧹 Ad Cleanup: Cleaning ONLY ad-related elements (NOT React timers)...');
    
    // Remove ONLY ad-related DOM elements
    const adSelectors = [
      'script[data-ad-network]',
      'div[data-ad-network]',
      'iframe[src*="adsterra"]',
      'iframe[src*="monetag"]',
      'iframe[src*="popads"]',
      '[id*="adsterra"]',
      '[id*="monetag"]',
      '[class*="adsterra"]',
      '[class*="monetag"]'
    ];
    
    adSelectors.forEach(selector => {
      try {
        document.querySelectorAll(selector).forEach(el => {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });
      } catch (e) {
        // Ignore errors - element might have been removed already
      }
    });
    
    console.log('✅ Ad Cleanup: Completed (React timers preserved)');
  };

  // CRITICAL: Handle page visibility to detect return from ad with IMMEDIATE cleanup
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('👁️ Page Visibility: User returned to page');
        
        // Clean up ad DOM elements when user returns
        const wasHidden = sessionStorage.getItem('page_was_hidden');
        if (wasHidden === 'true') {
          console.log('🔄 Ad Return: Cleaning up ad elements...');
          
          // Clear any pending cleanup timeout first
          if (cleanupTimeoutRef.current) {
            clearTimeout(cleanupTimeoutRef.current);
          }
          
          // Wait a tiny bit for ad scripts to finish, then cleanup
          cleanupTimeoutRef.current = setTimeout(() => {
            performAdCleanup();
            sessionStorage.removeItem('page_was_hidden');
            cleanupTimeoutRef.current = null;
          }, 100);
        }
      } else if (document.visibilityState === 'hidden') {
        console.log('👁️ Page Visibility: Page hidden (possibly ad)');
        sessionStorage.setItem('page_was_hidden', 'true');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    visibilityHandlerRef.current = handleVisibilityChange;

    return () => {
      // Clear pending cleanup timeout on unmount
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
        cleanupTimeoutRef.current = null;
      }
      
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
              setTimeout(delayAdsterraPopunder, 5000);
            }, { timeout: 6000 });
          } else {
            setTimeout(delayAdsterraPopunder, 5000);
          }
        }

        // Monetag Pop-under - delayed by 3 seconds
        if (adSettings.monetagPopunderEnabled && !monetagPopunderInjected.current) {
          const delayMonetagPopunder = () => {
            injectScript(adSettings.monetagPopunderCode, "Monetag Pop-under", monetagPopunderInjected);
          };
          
          if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
              setTimeout(delayMonetagPopunder, 7000);
            }, { timeout: 8000 });
          } else {
            setTimeout(delayMonetagPopunder, 7000);
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
      // Don't call performAdCleanup on unmount - it can interfere with React
    };
  }, [adSettings, isLoadingAdSettings]);

  return null; 
};

export default GlobalAdScripts;
