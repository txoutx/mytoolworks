"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { isAdsEligiblePath } from "../../lib/ads";

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
  const pathname = usePathname();
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [adsEnabled, setAdsEnabled] = useState(false);

  useEffect(() => {
    function syncConsent() {
      const consent = window.Cookiebot?.consent;
      setAnalyticsEnabled(Boolean(consent?.statistics || consent?.marketing));
      setAdsEnabled(Boolean(consent?.marketing) && isAdsEligiblePath(pathname));
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
  }, [pathname]);

  return (
    <>
      <Script
        id="Cookiebot"
        src="https://consent.cookiebot.com/uc.js"
        data-cbid="d4c7dab5-5b5d-4327-98fc-047ac5f022ea"
        strategy="afterInteractive"
      />
      {analyticsEnabled && (
        <>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-4ZTWW5XPZ1" strategy="lazyOnload" />
      <Script id="google-analytics" strategy="lazyOnload">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-4ZTWW5XPZ1');`}
      </Script>
        </>
      )}
      {adsEnabled && (
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5516465526702669"
        crossOrigin="anonymous"
        strategy="lazyOnload"
      />
      )}
    </>
  );
}
