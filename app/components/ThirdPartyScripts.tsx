"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    Cookiebot?: {
      consent?: {
        statistics?: boolean;
        marketing?: boolean;
      };
    };
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function ThirdPartyScripts() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    function syncConsent() {
      const consent = window.Cookiebot?.consent;
      setEnabled(Boolean(consent?.statistics || consent?.marketing));
    }

    syncConsent();
    window.addEventListener("CookiebotOnConsentReady", syncConsent);
    window.addEventListener("CookiebotOnAccept", syncConsent);
    window.addEventListener("CookiebotOnDecline", syncConsent);

    return () => {
      window.removeEventListener("CookiebotOnConsentReady", syncConsent);
      window.removeEventListener("CookiebotOnAccept", syncConsent);
      window.removeEventListener("CookiebotOnDecline", syncConsent);
    };
  }, []);

  return (
    <>
      <Script
        id="Cookiebot"
        src="https://consent.cookiebot.com/uc.js"
        data-cbid="d4c7dab5-5b5d-4327-98fc-047ac5f022ea"
        strategy="afterInteractive"
      />
      {enabled && (
        <>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-4ZTWW5XPZ1" strategy="lazyOnload" />
      <Script id="google-analytics" strategy="lazyOnload">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-4ZTWW5XPZ1');`}
      </Script>
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5516465526702669"
        crossOrigin="anonymous"
        strategy="lazyOnload"
      />
        </>
      )}
    </>
  );
}
