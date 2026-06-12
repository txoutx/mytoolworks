import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="site-header">
      <nav className="container nav" aria-label="Navegacion principal">
        <Link href="/" className="brand" aria-label="MyToolWorks inicio">
          <Image src="/icono.png" alt="" width={34} height={34} className="brand-logo" priority />
          <span>MyToolWorks</span>
        </Link>
        <div className="nav-links">
          <Link href="/pdf">PDF</Link>
          <Link href="/img">Imagen</Link>
        </div>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>MyToolWorks.com</span>
        <span>Herramientas online rapidas y limpias. Hecho por txoutx.</span>
        <nav className="footer-links" aria-label="Enlaces legales">
          <Link href="/politica-privacidad">Privacidad</Link>
          <Link href="/cookies">Cookies</Link>
          <Link href="/terminos">Terminos</Link>
          <Link href="/contacto">Contacto</Link>
        </nav>
      </div>
    </footer>
  );
}

export function AdSlot({ label = "Espacio reservado para anuncio" }: { label?: string }) {
  return (
    <aside className="ad-slot" aria-label={label}>
      <span>Publicidad</span>
    </aside>
  );
}
