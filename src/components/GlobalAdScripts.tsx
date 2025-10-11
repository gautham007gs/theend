
"use client";

import React, { useEffect, useRef } from 'react';
import type { AdSettings } from '@/types';
import { useAdSettings } from '@/contexts/AdSettingsContext'; // Import useAdSettings

const GlobalAdScripts: React.FC = () => {
  const { adSettings, isLoadingAdSettings } = useAdSettings(); // Consume context
  const adsterraPopunderInjected = useRef(false);
  const monetagPopunderInjected = useRef(false);

  useEffect(() => {
    if (isLoadingAdSettings || !adSettings || typeof document === 'undefined') {
      return;
    }

    // Reset injection flags if ad codes change or ads are disabled
    if (!adSettings.adsEnabledGlobally) {
      adsterraPopunderInjected.current = false;
      monetagPopunderInjected.current = false;
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
        console.log(`${networkName}: Starting script injection...`, scriptCode.substring(0, 100));
        
        // Create a temporary container to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = scriptCode.trim();
        
        // Find all script tags in the parsed HTML
        const scripts = tempDiv.querySelectorAll('script');
        
        if (scripts.length === 0) {
          console.warn(`${networkName}: No script tags found in provided code`);
          return;
        }

        scripts.forEach((oldScript) => {
          const newScript = document.createElement('script');
          
          // Copy all attributes (type, src, async, defer, etc.)
          Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
          });
          
          // Copy inline script content if any
          if (oldScript.innerHTML.trim()) {
            newScript.innerHTML = oldScript.innerHTML;
          }
          
          // Append to body
          document.body.appendChild(newScript);
          console.log(`${networkName}: Script injected - src: ${newScript.src || 'inline code'}`);
        });

        injectedRef.current = true;
        console.log(`${networkName}: All scripts successfully injected`);

      } catch (e) {
        console.error(`${networkName}: Error during script injection:`, e);
      }
    };

    // Inject ad scripts immediately
    injectAdScripts();
  }, [adSettings, isLoadingAdSettings]);

  return null; 
};

export default GlobalAdScripts;
