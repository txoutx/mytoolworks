"use client";

import { useEffect, useState } from "react";
import type { Locale } from "../../lib/i18n";

declare global {
  interface Window {
    Cookiebot?: {
      renew?: () => void;
      hide?: () => void;
      consent?: {
        necessary?: boolean;
        preferences?: boolean;
        statistics?: boolean;
        marketing?: boolean;
      };
    };
  }
}

const storageKey = "mytoolworks-cookie-choice";

const text = {
  es: {
    title: "Cookies",
    body: "Usamos cookies tecnicas y, con tu permiso, analiticas y publicitarias para mejorar MyToolWorks y mostrar anuncios.",
    accept: "Aceptar",
    reject: "Rechazar",
    manage: "Gestionar cookies",
    policy: "Politica de cookies"
  },
  en: {
    title: "Cookies",
    body: "We use technical cookies and, with your permission, analytics and advertising cookies to improve MyToolWorks and show ads.",
    accept: "Accept",
    reject: "Reject",
    manage: "Manage cookies",
    policy: "Cookie policy"
  }
} as const;

export function CookieConsent({ locale }: { locale: Locale }) {
  const t = text[locale];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const localChoice = window.localStorage.getItem(storageKey);
      const cookiebotConsent = window.Cookiebot?.consent;
      if (!localChoice && !cookiebotConsent) setVisible(true);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, []);

  function saveChoice(choice: "accepted" | "rejected") {
    window.localStorage.setItem(storageKey, choice);
    setVisible(false);
    window.Cookiebot?.hide?.();
  }

  function openPreferences() {
    if (window.Cookiebot?.renew) {
      window.Cookiebot.renew();
      setVisible(false);
      return;
    }
    setVisible(true);
  }

  return (
    <>
      {visible && (
        <section className="cookie-consent" aria-label={t.title}>
          <div>
            <strong>{t.title}</strong>
            <p>{t.body}</p>
            <a href={locale === "en" ? "/en/cookies" : "/cookies"}>{t.policy}</a>
          </div>
          <div className="cookie-actions">
            <button type="button" className="secondary" onClick={() => saveChoice("rejected")}>
              {t.reject}
            </button>
            <button type="button" onClick={() => saveChoice("accepted")}>
              {t.accept}
            </button>
          </div>
        </section>
      )}
      <button type="button" className="cookie-manage" onClick={openPreferences}>
        {t.manage}
      </button>
    </>
  );
}
