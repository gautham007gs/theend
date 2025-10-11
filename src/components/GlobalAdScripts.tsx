
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
        console.log(`${networkName}: Starting script injection...`);
        const scriptContainer = document.createElement('div');
        scriptContainer.innerHTML = scriptCode; 
        
        let hasValidScriptTag = false;
        Array.from(scriptContainer.childNodes).forEach(node => {
          if (node.nodeName === "SCRIPT") {
            const scriptTag = document.createElement('script');
            const originalScript = node as HTMLScriptElement;
            
            // Copy all attributes
            for (let i = 0; i < originalScript.attributes.length; i++) {
              const attr = originalScript.attributes[i];
              scriptTag.setAttribute(attr.name, attr.value);
            }
            
            // Copy inline script content
            if (originalScript.innerHTML.trim()) {
              scriptTag.innerHTML = originalScript.innerHTML;
            }
            
            if (scriptTag.src || scriptTag.innerHTML.trim()) {
              hasValidScriptTag = true;
              document.body.appendChild(scriptTag);
              console.log(`${networkName}: Script tag appended to body (src: ${scriptTag.src || 'inline'})`);
            } else {
              console.warn(`${networkName}: Skipping empty script tag`);
            }
          } else if (node.nodeType !== Node.TEXT_NODE || node.textContent?.trim()) {
            // Append other nodes like comments, noscript tags
            document.body.appendChild(node.cloneNode(true));
          }
        });

        if (hasValidScriptTag) {
          injectedRef.current = true;
          console.log(`${networkName}: Script successfully injected and marked as complete`);
        } else {
          console.warn(`${networkName}: No valid script tags found in provided code`);
        }

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
