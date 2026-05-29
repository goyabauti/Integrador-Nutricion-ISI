import Link from "next/link";
import React from "react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="public-layout">
      {/* Header */}
      <header className="public-header">
        <div className="public-header-inner">
          <Link href="/evaluar" className="public-logo-link">
            <div className="public-logo-icon">B</div>
            <span className="public-logo-text">Budín Nutritivo</span>
          </Link>

          <nav className="public-nav">
            <Link href="/evaluar" className="public-nav-link">Inicio</Link>
            <Link href="/producto" className="public-nav-link">Producto</Link>
            <Link href="/opiniones" className="public-nav-link">Opiniones</Link>
            <Link href="/login" className="public-nav-link public-nav-admin">Acceso Admin</Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="public-main">
        <div className="public-content">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="public-footer">
        <p className="public-footer-brand">Budín Nutritivo</p>
        <p className="public-footer-tagline">
          Gracias por ayudarnos a mejorar nuestro budín saludable.
        </p>
        <div className="public-footer-divider" />
        <p className="public-footer-copy">
          &copy; {new Date().getFullYear()} Grupo de Nutricionistas — ISI
        </p>
      </footer>
    </div>
  );
}
