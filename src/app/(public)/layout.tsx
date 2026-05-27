import Link from "next/link";
import React from "react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navbar simplificado */}
      <header style={{ 
        background: "var(--coco-white)", 
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 10
      }}>
        <div style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <Link href="/evaluar" style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.65rem",
            textDecoration: "none",
            color: "var(--coco-dark)",
            fontWeight: 800,
            fontSize: "1.3rem",
            fontFamily: "var(--font-serif)"
          }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "var(--coco-dark)",
              color: "var(--coco-white)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "1.1rem",
              fontFamily: "var(--font-serif)",
              boxShadow: "0 2px 5px rgba(62,39,35,0.15)"
            }}>
              B
            </div>
            <span>Budín Nutritivo</span>
          </Link>

          <nav style={{ display: "flex", gap: "1.5rem" }}>
            <Link href="/evaluar" style={navLinkStyle}>
              Inicio
            </Link>
            <Link href="/producto" style={navLinkStyle}>
              Sobre el producto
            </Link>
            <a href="#" style={navLinkStyle}>
              Foro
            </a>
          </nav>
        </div>
      </header>

      {/* Contenido principal */}
      <main style={{ flex: 1, padding: "2rem 1rem" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: "var(--coco-dark)",
        color: "var(--coco-cream)",
        padding: "2rem 1rem",
        textAlign: "center",
        fontSize: "0.875rem"
      }}>
        <p>Gracias por ayudarnos a mejorar nuestro budín saludable.</p>
        <p style={{ marginTop: "0.5rem", opacity: 0.7 }}>&copy; {new Date().getFullYear()} Grupo de Nutricionistas</p>
      </footer>
    </div>
  );
}

const navLinkStyle = {
  textDecoration: "none",
  color: "var(--coco-dark)",
  opacity: 0.75,
  fontWeight: 500,
  fontSize: "0.95rem",
  transition: "opacity 0.2s"
};
