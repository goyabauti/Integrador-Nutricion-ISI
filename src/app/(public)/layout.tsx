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
            gap: "0.5rem",
            textDecoration: "none",
            color: "var(--coco-dark)",
            fontWeight: 700,
            fontSize: "1.25rem",
            fontFamily: "Outfit"
          }}>
            <span>🥥</span>
            <span>NutriBudín</span>
          </Link>

          <nav style={{ display: "flex", gap: "1.5rem" }}>
            <Link href="/evaluar" style={navLinkStyle}>
              Evaluar
            </Link>
            <Link href="/producto" style={navLinkStyle}>
              Sobre el producto
            </Link>
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
  color: "var(--coco-brown)",
  fontWeight: 500,
  fontSize: "0.95rem",
  transition: "color 0.2s"
};
