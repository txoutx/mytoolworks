import Link from "next/link";
import Image from "next/image";
import type { Locale } from "../../lib/i18n";
import { ui, withLocalePath } from "../../lib/i18n";

export function Header({ locale = "es" }: { locale?: Locale }) {
  const t = ui[locale];
  return (
    <header className="site-header">
      <nav className="container nav" aria-label="Navegacion principal">
        <Link href={withLocalePath("/", locale)} className="brand" aria-label="MyToolWorks inicio">
          <Image src="/favicon-48x48.png" alt="" width={34} height={34} className="brand-logo" priority />
          <span>MyToolWorks</span>
        </Link>
        <div className="nav-links">
          <Link href={withLocalePath("/pdf", locale)}>{t.navPdf}</Link>
          <Link href={withLocalePath("/img", locale)}>{t.navImage}</Link>
          <Link href={withLocalePath("/conversor", locale)}>{t.navConverter}</Link>
          <Link href={withLocalePath("/youtube", locale)}>{t.navYouTube}</Link>
        </div>
      </nav>
    </header>
  );
}

export function Footer({ locale = "es" }: { locale?: Locale }) {
  const t = ui[locale];
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>MyToolWorks.com</span>
        <span>{t.footerTagline}</span>
        <nav className="footer-links" aria-label="Enlaces legales">
          <Link href={withLocalePath("/politica-privacidad", locale)}>{t.privacy}</Link>
          <Link href={withLocalePath("/cookies", locale)}>{t.cookies}</Link>
          <Link href={withLocalePath("/terminos", locale)}>{t.terms}</Link>
          <Link href={withLocalePath("/contacto", locale)}>{t.contact}</Link>
        </nav>
      </div>
    </footer>
  );
}

export function AdSlot({ label = "Espacio reservado para anuncio", locale = "es" }: { label?: string; locale?: Locale }) {
  return (
    <aside className="ad-slot" aria-label={label}>
      <span>{ui[locale].ad}</span>
    </aside>
  );
}
