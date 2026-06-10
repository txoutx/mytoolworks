import Link from "next/link";

export function Header() {
  return (
    <header className="site-header">
      <nav className="container nav" aria-label="Navegacion principal">
        <Link href="/" className="brand" aria-label="MyToolWorks inicio">
          <span className="brand-mark">M</span>
          <span>MyToolWorks</span>
        </Link>
        <div className="nav-links">
          <Link href="/pdf">PDF</Link>
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
        <span>Herramientas PDF online rapidas y limpias.</span>
      </div>
    </footer>
  );
}

export function AdSlot({ label = "Espacio reservado para anuncio" }: { label?: string }) {
  return <aside className="ad-slot" aria-label={label}>{label}</aside>;
}
