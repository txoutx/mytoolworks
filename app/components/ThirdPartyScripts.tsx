"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const storageKey = "mytoolworks-cookie-choice";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function ThirdPartyScripts() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    function syncConsent() {
      setEnabled(window.localStorage.getItem(storageKey) === "accepted");
    }

    syncConsent();
    window.addEventListener("mytoolworks-cookie-choice", syncConsent);
    window.addEventListener("storage", syncConsent);

    return () => {
      window.removeEventListener("mytoolworks-cookie-choice", syncConsent);
      window.removeEventListener("storage", syncConsent);
    };
  }, []);

  if (!enabled) return null;

  return (
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
  );
}
