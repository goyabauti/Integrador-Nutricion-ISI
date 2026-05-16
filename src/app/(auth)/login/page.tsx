"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Email o contraseña incorrectos.");
      setLoading(false);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.emoji}>🍞</span>
        <h1 style={styles.title}>Budín Nutritivo</h1>
        <p style={styles.subtitle}>Sistema de evaluación sensorial</p>
      </div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="tu@email.com" required style={styles.input} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Contraseña</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" required style={styles.input} />
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
      <p style={styles.footer}>
        ¿No tenés cuenta?{" "}
        <Link href="/register" style={styles.link}>Registrarse</Link>
      </p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: { background: "var(--bg-card)", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", padding: "2.5rem", width: "100%", maxWidth: "420px" },
  header: { textAlign: "center", marginBottom: "2rem" },
  emoji: { fontSize: "2.5rem" },
  title: { fontSize: "1.5rem", fontWeight: 700, marginTop: "0.5rem" },
  subtitle: { color: "var(--text-muted)", marginTop: "0.25rem", fontSize: "0.9rem" },
  form: { display: "flex", flexDirection: "column", gap: "1.25rem" },
  field: { display: "flex", flexDirection: "column", gap: "0.4rem" },
  label: { fontWeight: 600, fontSize: "0.875rem" },
  input: { padding: "0.75rem 1rem", border: "1.5px solid var(--border)", borderRadius: "8px", fontSize: "1rem", outline: "none" },
  error: { color: "var(--danger)", fontSize: "0.875rem", background: "#fef2f2", padding: "0.75rem", borderRadius: "8px" },
  button: { background: "var(--primary)", color: "#fff", border: "none", borderRadius: "8px", padding: "0.875rem", fontSize: "1rem", fontWeight: 600, marginTop: "0.5rem", cursor: "pointer" },
  footer: { textAlign: "center", marginTop: "1.5rem", color: "var(--text-muted)", fontSize: "0.9rem" },
  link: { color: "var(--primary)", fontWeight: 600 },
};