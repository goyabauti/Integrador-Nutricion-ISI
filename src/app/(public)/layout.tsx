import Link from "next/link";
import React from "react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ 
        background: "rgba(255,255,255,0.85)", 
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "0.85rem 1.25rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <Link href="/evaluar" style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.65rem",
            textDecoration: "none",
            color: "var(--coco-dark)"
          }}>
            <div style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "var(--coco-dark)",
              color: "var(--coco-white)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "1.1rem",
              fontFamily: "var(--font-serif)",
              boxShadow: "0 2px 8px rgba(62,39,35,0.15)"
            }}>
              B
            </div>
            <span style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 700,
              fontSize: "1.2rem",
              letterSpacing: "-0.02em"
            }}>
              Budín Nutritivo
            </span>
          </Link>

          <nav style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
            <Link href="/evaluar" style={navLinkStyle}>
              Inicio
            </Link>
            <Link href="/producto" style={navLinkStyle}>
              Producto
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main style={{ flex: 1, padding: "0 1.25rem 3rem" }}>
        <div style={{ maxWidth: "580px", margin: "0 auto" }}>
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: "var(--coco-dark)",
        color: "var(--coco-cream)",
        padding: "2.5rem 1.25rem",
        textAlign: "center",
      }}>
        <p style={{ 
          fontFamily: "var(--font-serif)",
          fontSize: "1.05rem", 
          fontWeight: 600,
          marginBottom: "0.5rem" 
        }}>
          Budín Nutritivo
        </p>
        <p style={{ fontSize: "0.85rem", opacity: 0.6 }}>
          Gracias por ayudarnos a mejorar nuestro budín saludable.
        </p>
        <div style={{ 
          width: "32px", 
          height: "2px", 
          background: "var(--coco-caramel)", 
          margin: "1rem auto", 
          borderRadius: "1px",
          opacity: 0.5
        }} />
        <p style={{ fontSize: "0.8rem", opacity: 0.4 }}>
          &copy; {new Date().getFullYear()} Grupo de Nutricionistas — ISI
        </p>
      </footer>
    </div>
  );
}

const navLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "var(--coco-dark)",
  fontWeight: 500,
  fontSize: "0.9rem",
  opacity: 0.7,
  transition: "opacity 0.2s ease",
};
