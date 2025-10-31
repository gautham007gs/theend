
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useAdSettings } from '@/contexts/AdSettingsContext';

const GlobalAdScripts: React.FC = () => {
  const { adSettings, isLoadingAdSettings } = useAdSettings();
  const adsterraPopunderInjected = useRef(false);
  const monetagPopunderInjected = useRef(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || isLoadingAdSettings || !adSettings || typeof document === 'undefined') {
      return;
    }

    if (!adSettings.adsEnabledGlobally) {
      return;
    }

    const injectScript = (scriptCode: string, networkName: string, injectedRef: React.MutableRefObject<boolean>) => {
      if (injectedRef.current || !scriptCode || !scriptCode.trim()) {
        return;
      }

      try {
        const scriptContainer = document.createElement('div');
        scriptContainer.innerHTML = scriptCode;

        Array.from(scriptContainer.childNodes).forEach(node => {
          if (node.nodeName === "SCRIPT") {
            const scriptTag = document.createElement('script');
            const originalScript = node as HTMLScriptElement;

            for (let i = 0; i < originalScript.attributes.length; i++) {
              const attr = originalScript.attributes[i];
              scriptTag.setAttribute(attr.name, attr.value);
            }

            if (originalScript.innerHTML.trim()) {
              scriptTag.innerHTML = originalScript.innerHTML;
            }

            if (scriptTag.src || scriptTag.innerHTML.trim()) {
              document.body.appendChild(scriptTag);
            }
          }
        });

        injectedRef.current = true;
        console.log(`${networkName}: Script injected`);
      } catch (e) {
        console.error(`${networkName}: Error during script injection:`, e);
      }
    };

    if (adSettings.adsterraPopunderEnabled && !adsterraPopunderInjected.current) {
      injectScript(adSettings.adsterraPopunderCode, "Adsterra Popunder", adsterraPopunderInjected);
    }

    if (adSettings.monetagPopunderEnabled && !monetagPopunderInjected.current) {
      injectScript(adSettings.monetagPopunderCode, "Monetag Popunder", monetagPopunderInjected);
    }
  }, [adSettings, isLoadingAdSettings, isClient]);

  return null;
};

export default GlobalAdScripts;
