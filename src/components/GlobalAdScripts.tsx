"use client";

import React, { useEffect, useRef } from 'react';
import type { AdSettings } from '@/types';
import { useAdSettings } from '@/contexts/AdSettingsContext'; // Import useAdSettings
import Script from 'next/script'; // Import next/script

const GlobalAdScripts: React.FC = () => {
  const { adSettings, isLoadingAdSettings } = useAdSettings(); // Consume context
  const adsterraPopunderInjected = useRef(false);
  const monetagPopunderInjected = useRef(false);

  useEffect(() => {
    if (isLoadingAdSettings || !adSettings || typeof document === 'undefined') {
      return;
    }

    const injectScript = (scriptCode: string, networkName: string, injectedRef: React.MutableRefObject<boolean>) => {
      if (injectedRef.current || !scriptCode || !scriptCode.trim() || scriptCode.toLowerCase().includes('placeholder')) {
        return;
      }

      try {
        const scriptContainer = document.createElement('div');
        scriptContainer.innerHTML = scriptCode;

        let hasValidScriptTag = false;
        Array.from(scriptContainer.childNodes).forEach(node => {
          if (node.nodeName === "SCRIPT") {
            const scriptTag = document.createElement('script');
            const originalScript = node as HTMLScriptElement;

            for (let i = 0; i < originalScript.attributes.length; i++) {
              const attr = originalScript.attributes[i];
              scriptTag.setAttribute(attr.name, attr.value);
            }
            scriptTag.innerHTML = originalScript.innerHTML;

            if (scriptTag.src || scriptTag.innerHTML.trim()) {
              hasValidScriptTag = true;
              document.body.appendChild(scriptTag);
            } else {
              // console.warn(`Skipping potentially empty/malformed ${networkName} pop-under script part (no src or innerHTML).`);
            }
          } else {
            // Append other nodes like comments, noscript tags, etc.
            // Check if it's not just whitespace text node
            if (node.nodeType !== Node.TEXT_NODE || node.textContent?.trim()) {
                document.body.appendChild(node.cloneNode(true));
            }
          }
        });

        if(hasValidScriptTag){
            injectedRef.current = true;
            console.log(`${networkName} pop-under script injected.`);
        } else {
            // console.warn(`No valid script tags found in ${networkName} pop-under code.`);
        }

      } catch (e) {
        console.error(`Error injecting ${networkName} pop-under script:`, e);
      }
    };

    if (adSettings.adsEnabledGlobally) {
      // Adsterra Pop-under
      if (adSettings.adsterraPopunderEnabled && !adsterraPopunderInjected.current) {
        injectScript(adSettings.adsterraPopunderCode, "Adsterra", adsterraPopunderInjected);
      }

      // Monetag Pop-under
      if (adSettings.monetagPopunderEnabled && !monetagPopunderInjected.current) {
        injectScript(adSettings.monetagPopunderCode, "Monetag", monetagPopunderInjected);
      }
    }
    // Clean up: Potentially remove scripts if settings change to disabled during session?
    // For simplicity, current approach injects if enabled on load and doesn't remove.
    // True dynamic removal is complex as scripts might have already executed.
  }, [adSettings, isLoadingAdSettings]);

  // Placeholder for Adsterra Script with afterInteractive strategy
  // The actual injection logic is handled by the useEffect hook above.
  // This component is intended to render other ad scripts if needed,
  // but the primary pop-under logic is imperative.
  // If Adsterra popunder code is provided and enabled, it will be injected.
  // The following Script tag is a placeholder if you were to use declarative Next.js Script component for other ads.
  // For popunders, imperative injection is often more reliable due to their nature.
  return (
    <>
      {/* Adsterra Scripts - Load after interactive */}
      {adSettings?.adsterraPopunderEnabled && adSettings?.adsterraPopunderCode && (
        <Script
          strategy="afterInteractive"
          data-cfasync="false"
          src="//pl25396331.profitablecpmgate.com/58/4a/5f/584a5f7ec7fef38ec3a0b1eac9e8d87c.js"
          // Note: The actual injection of the popunder code is handled imperatively in the useEffect hook.
          // This Script tag might be redundant if only relying on the imperative injection.
          // It's kept here for demonstration or if you intend to use it for other types of Adsterra scripts.
        />
      )}

      {/* Add similar logic for Monetag if you prefer declarative Next/script component */}
    </>
  );
};

export default GlobalAdScripts;