"use client";

import React, { useState, useEffect } from "react";

type Comment = {
  id: string;
  content: string;
  created_at: string;
  name: string;
};

/* ── Decorative quote icon ── */
function QuoteIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      opacity={0.15}
    >
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );
}

/* ── Skeleton loader ── */
function MuralSkeleton() {
  return (
    <div className="mural-grid">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="mural-card-skeleton">
          <div className="skeleton" style={{ height: "16px", width: "60%", marginBottom: "0.75rem" }} />
          <div className="skeleton" style={{ height: "12px", width: "100%", marginBottom: "0.4rem" }} />
          <div className="skeleton" style={{ height: "12px", width: "85%", marginBottom: "0.4rem" }} />
          <div className="skeleton" style={{ height: "12px", width: "40%", marginBottom: "1rem" }} />
          <div className="skeleton" style={{ height: "10px", width: "30%", marginTop: "auto" }} />
        </div>
      ))}
    </div>
  );
}

/* ── Empty state ── */
function EmptyMural() {
  return (
    <div className="mural-empty animate-fade-in">
      <div className="mural-empty-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--coco-caramel)" strokeWidth="1.5">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      </div>
      <h3 className="mural-empty-title">Aún no hay opiniones</h3>
      <p className="mural-empty-subtitle">
        Sé el primero en probar nuestro budín y dejarnos tu comentario.
        ¡Tu opinión nos ayuda a mejorar!
      </p>
    </div>
  );
}

/* ── Time ago helper ── */
function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMins < 1) return "Justo ahora";
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? "s" : ""}`;
  if (diffWeeks < 5) return `Hace ${diffWeeks} semana${diffWeeks > 1 ? "s" : ""}`;
  return `Hace ${diffMonths} mes${diffMonths > 1 ? "es" : ""}`;
}

/* ── Generate avatar initials ── */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/* ── Avatar color from name (deterministic) ── */
function getAvatarColor(name: string): string {
  const colors = [
    "linear-gradient(135deg, #D4A574, #8B6F47)",
    "linear-gradient(135deg, #A0C4B8, #5A8F7B)",
    "linear-gradient(135deg, #C4A0B8, #8F5A7B)",
    "linear-gradient(135deg, #B8C4A0, #7B8F5A)",
    "linear-gradient(135deg, #A0B8C4, #5A7B8F)",
    "linear-gradient(135deg, #C4B8A0, #8F7B5A)",
    "linear-gradient(135deg, #D4A0A0, #8B5F5F)",
    "linear-gradient(135deg, #A0D4C4, #5F8B7B)",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/* ── Main Page ── */
export default function OpinionesPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch("/api/comentarios");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setComments(json.data);
        } else {
          setError("No se pudieron cargar las opiniones.");
        }
      } catch {
        setError("Error al conectar. Intentá recargar la página.");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: "100%" }}>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-badge">Mural de Opiniones</div>
        <h1 className="hero-title">
          Lo que dicen<br />nuestros catadores
        </h1>
        <p className="hero-subtitle">
          Cada opinión nos inspira a mejorar. Leé lo que dicen quienes ya probaron nuestro budín nutritivo.
        </p>
      </div>

      {/* Stats bar */}
      {!loading && comments.length > 0 && (
        <div className="mural-stats animate-fade-in">
          <div className="mural-stat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--coco-caramel)" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            <span>{comments.length} opinión{comments.length !== 1 ? "es" : ""}</span>
          </div>
          <div className="mural-stat-divider" />
          <div className="mural-stat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--coco-caramel)" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            <span>Gracias a todos</span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="alert-error" style={{ marginBottom: "1.5rem" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <MuralSkeleton />
      ) : comments.length === 0 && !error ? (
        <EmptyMural />
      ) : (
        <div className="mural-grid stagger-children">
          {comments.map((comment) => (
            <div key={comment.id} className="mural-card">
              {/* Quote decoration */}
              <div className="mural-card-quote">
                <QuoteIcon size={32} />
              </div>

              {/* Comment content */}
              <p className="mural-card-content">
                {comment.content}
              </p>

              {/* Author info */}
              <div className="mural-card-author">
                <div
                  className="mural-card-avatar"
                  style={{ background: getAvatarColor(comment.name) }}
                >
                  {getInitials(comment.name)}
                </div>
                <div className="mural-card-author-info">
                  <span className="mural-card-name">{comment.name}</span>
                  <span className="mural-card-date">{timeAgo(comment.created_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
