"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/server/supabase/client";

interface NoRoleAccessProps {
  userEmail: string;
}

export function NoRoleAccess({ userEmail }: NoRoleAccessProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card} className="animate-fade-in-up">
        <div style={styles.header}>
          <span style={styles.emoji}>⚠️</span>
          <h1 style={styles.title}>Acceso Restringido</h1>
          <p style={styles.subtitle}>Tu usuario no está autorizado</p>
        </div>
        
        <div style={styles.content}>
          <p style={styles.text}>
            La cuenta con la que iniciaste sesión <strong>({userEmail})</strong> está autenticada, pero no tiene asignado un rol de <strong>Administrador (admin)</strong> o <strong>Nutricionista (nutri)</strong> en el sistema.
          </p>
          <div style={styles.stepsCard}>
            <h4 style={styles.stepsTitle}>¿Cómo solucionar esto?</h4>
            <ol style={styles.stepsList}>
              <li>Ve a la consola de Supabase.</li>
              <li>Asegúrate de agregar un registro en la tabla <code>user_roles</code> con el <code>user_id</code> de esta cuenta y el rol correspondiente.</li>
              <li>Por ejemplo: <code>role: &quot;admin&quot;</code> o <code>role: &quot;nutri&quot;</code>.</li>
            </ol>
          </div>
        </div>

        <button onClick={handleLogout} disabled={loading} style={styles.button}>
          {loading ? "Cerrando sesión..." : "Cerrar Sesión"}
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "var(--coco-cream)",
    padding: "2rem",
  },
  card: {
    background: "var(--coco-white)",
    borderRadius: "var(--radius)",
    boxShadow: "var(--shadow-lg)",
    padding: "3rem 2.5rem",
    width: "100%",
    maxWidth: "520px",
    textAlign: "center",
    border: "1.5px solid var(--border)",
  },
  header: {
    marginBottom: "2rem",
  },
  emoji: {
    fontSize: "3rem",
    display: "block",
    marginBottom: "1rem",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "var(--coco-dark)",
  },
  subtitle: {
    color: "var(--coco-danger)",
    fontWeight: 600,
    marginTop: "0.25rem",
    fontSize: "1rem",
  },
  content: {
    textAlign: "left",
    marginBottom: "2.5rem",
    color: "var(--coco-dark)",
  },
  text: {
    fontSize: "0.95rem",
    lineHeight: "1.6",
    marginBottom: "1.5rem",
  },
  stepsCard: {
    background: "var(--coco-light)",
    padding: "1.25rem 1.5rem",
    borderRadius: "12px",
    border: "1px solid var(--border)",
  },
  stepsTitle: {
    fontSize: "0.95rem",
    fontWeight: 600,
    marginBottom: "0.5rem",
    color: "var(--coco-dark)",
  },
  stepsList: {
    fontSize: "0.875rem",
    paddingLeft: "1.25rem",
    lineHeight: "1.5",
    color: "var(--text-muted)",
  },
  button: {
    width: "100%",
    background: "var(--coco-dark)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "0.875rem",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s",
  },
};
