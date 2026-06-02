"use client";

import React, { useEffect, useState } from "react";
import type { DashboardData } from "@/types";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { RadarChart } from "@/components/dashboard/RadarChart";
import { DoughnutChart } from "@/components/dashboard/DoughnutChart";
import { BarChart } from "@/components/dashboard/BarChart";
import { LineChart } from "@/components/dashboard/LineChart";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ScoreIndicator({ score }: { score: number }) {
  let color = "#E57373";
  if (score >= 4) color = "#81C784";
  else if (score >= 3) color = "#FFD54F";
  else if (score >= 2) color = "#FFB74D";

  return (
    <span className="score-indicator" style={{ background: `${color}20`, color }}>
      {score.toFixed(1)}
    </span>
  );
}

const CATEGORY_LABELS: Record<string, string> = {
  hedonica: "Hedónica",
  positivos: "Positivos",
  generales: "Generales",
  defectos: "Defectos",
};

function ScoreBadge({ score }: { score: number }) {
  let bg = "#E5737320";
  let color = "#E57373";
  if (score >= 4) { bg = "#81C78420"; color = "#81C784"; }
  else if (score >= 3) { bg = "#FFD54F20"; color = "#b8960c"; }
  else if (score >= 2) { bg = "#FFB74D20"; color = "#FFB74D"; }
  return (
    <span style={{
      background: bg, color, fontWeight: 700, fontSize: "0.78rem",
      borderRadius: "6px", padding: "2px 8px", minWidth: "2rem", textAlign: "center",
    }}>{score}</span>
  );
}

function EvaluationItem({ ev }: { ev: import("@/types").RecentEvaluation }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="evaluation-item" style={{ flexDirection: "column", alignItems: "stretch", gap: 0, padding: 0 }}>
      {/* Fila principal — clickeable */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", background: "none", border: "none", cursor: "pointer",
          padding: "0.75rem 1rem", textAlign: "left", gap: "0.5rem",
        }}
        aria-expanded={open}
      >
        <div className="evaluation-info" style={{ flex: 1, minWidth: 0 }}>
          <span className="evaluation-name">{ev.label}</span>
        </div>
        <div className="evaluation-meta">
          <ScoreIndicator score={ev.promedio} />
          <span className="evaluation-date">{formatDate(ev.created_at)}</span>
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="var(--coco-caramel)" strokeWidth="2.5"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Panel expandible */}
      {open && ev.responses.length > 0 && (
        <div style={{
          borderTop: "1px solid var(--coco-cream-dark, #e8ddd4)",
          padding: "0.75rem 1rem 1rem",
          display: "flex", flexDirection: "column", gap: "0.5rem",
          background: "rgba(0,0,0,0.015)",
        }}>
          {ev.responses.map((resp) => {
            const pct = (resp.score / 5) * 100;
            let barColor = "#E57373";
            if (resp.score >= 4) barColor = "#81C784";
            else if (resp.score >= 3) barColor = "#FFD54F";
            else if (resp.score >= 2) barColor = "#FFB74D";
            const catLabel = resp.category ? CATEGORY_LABELS[resp.category] ?? resp.category : null;
            return (
              <div key={resp.question_id} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "3px" }}>
                    {catLabel && (
                      <span style={{
                        fontSize: "0.65rem", fontWeight: 600, background: "var(--coco-caramel, #8B5E3C)20",
                        color: "var(--coco-caramel, #8B5E3C)", borderRadius: "4px", padding: "1px 5px",
                        whiteSpace: "nowrap",
                      }}>{catLabel}</span>
                    )}
                    <span style={{ fontSize: "0.78rem", color: "#5a4a3a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {resp.text}
                    </span>
                  </div>
                  <div style={{ height: "5px", borderRadius: "3px", background: "#e8ddd4", overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: "3px", transition: "width 0.4s ease" }} />
                  </div>
                </div>
                <ScoreBadge score={resp.score} />
              </div>
            );
          })}
        </div>
      )}
      {open && ev.responses.length === 0 && (
        <div style={{ padding: "0.5rem 1rem", fontSize: "0.8rem", color: "#999" }}>Sin respuestas registradas</div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="dashboard-loading">
      <div className="kpi-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton" style={{ height: "120px", borderRadius: "16px" }} />
        ))}
      </div>
      <div className="charts-grid" style={{ marginTop: "2rem" }}>
        <div className="skeleton" style={{ height: "400px", borderRadius: "16px" }} />
        <div className="skeleton" style={{ height: "400px", borderRadius: "16px" }} />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="dashboard-empty">
      <div className="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--coco-caramel)" strokeWidth="1.5">
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
          <path d="M22 12A10 10 0 0 0 12 2v10z" />
        </svg>
      </div>
      <h2 className="empty-title">Sin datos aún</h2>
      <p className="empty-subtitle">
        Todavía no hay evaluaciones registradas. Cuando los evaluadores completen el formulario, los resultados aparecerán aquí.
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log("[DashboardPage] Render. Loading:", loading, "Error:", error, "HasData:", !!data);

  useEffect(() => {
    const fetchData = async () => {
      console.log("[DashboardPage] Fetching /api/dashboard...");
      try {
        const res = await fetch("/api/dashboard");
        console.log("[DashboardPage] Response status:", res.status);
        const json = await res.json();
        console.log("[DashboardPage] Response json:", json);
        if (json.success) {
          setData(json.data);
        } else {
          setError(json.error || "Error al cargar datos");
        }
      } catch (err) {
        console.error("[DashboardPage] Fetch error:", err);
        setError("Error de conexión");
      } finally {
        console.log("[DashboardPage] Setting loading to false");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) {
    return (
      <div className="alert-error" style={{ margin: "2rem 0" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        {error}
      </div>
    );
  }
  if (!data || data.totalEvaluaciones === 0) return <EmptyState />;

  return (
    <div className="dashboard-page animate-fade-in-up">
      {/* Page Header */}
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">Dashboard</h1>
          <p className="dashboard-page-subtitle">
            Resumen de evaluaciones sensoriales del budín nutritivo
          </p>
        </div>
        <div className="dashboard-page-meta">
          <span className="meta-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Actualizado ahora
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid stagger-children">
        <KpiCard
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          }
          label="Total Evaluaciones"
          value={data.totalEvaluaciones}
          subtitle="personas evaluaron"
        />
        <KpiCard
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          }
          label="Promedio General"
          value={`${data.promedioGeneral} / 5`}
          subtitle="en todas las preguntas"
          accentColor="#FFD54F"
        />
        <KpiCard
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          }
          label="Mejor Evaluado"
          value={data.scoreMasAlto ? `${data.scoreMasAlto.promedio}` : "—"}
          subtitle={data.scoreMasAlto?.text || ""}
          accentColor="#81C784"
        />
        <KpiCard
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
              <polyline points="17 18 23 18 23 12" />
            </svg>
          }
          label="Peor Evaluado"
          value={data.scoreMasBajo ? `${data.scoreMasBajo.promedio}` : "—"}
          subtitle={data.scoreMasBajo?.text || ""}
          accentColor="#E57373"
        />
      </div>

      {/* Charts Row 1: Radar + Doughnut */}
      <div className="charts-grid">
        <RadarChart data={data.promediosPorCategoria} />
        <DoughnutChart distribucion={data.distribucion} />
      </div>

      {/* Timeline */}
      {data.timeline.length > 1 && (
        <div style={{ marginTop: "1.5rem" }}>
          <LineChart data={data.timeline} />
        </div>
      )}

      {/* Bar Chart */}
      <div style={{ marginTop: "1.5rem" }}>
        <BarChart data={data.promediosPorPregunta} />
      </div>

      {/* Bottom section: Comments + Recent Evaluations */}
      <div className="dashboard-bottom-grid">
        {/* Comentarios Recientes */}
        <div className="dashboard-chart-card">
          <div className="chart-header">
            <h3 className="chart-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--coco-caramel)" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              Comentarios Recientes
            </h3>
            <p className="chart-subtitle">{data.comentariosRecientes.length} últimos comentarios</p>
          </div>
          <div className="comments-list">
            {data.comentariosRecientes.length === 0 ? (
              <p className="comments-empty">Sin comentarios aún</p>
            ) : (
              data.comentariosRecientes.map((c) => (
                <div key={c.id} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-author">{c.respondent_label}</span>
                    <span className="comment-date">{formatDate(c.created_at)}</span>
                  </div>
                  <p className="comment-content">{c.content}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Evaluaciones Recientes */}
        <div className="dashboard-chart-card">
          <div className="chart-header">
            <h3 className="chart-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--coco-caramel)" strokeWidth="2">
                <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              </svg>
              Últimas Evaluaciones
            </h3>
            <p className="chart-subtitle">{data.evaluacionesRecientes.length} más recientes</p>
          </div>
          <div className="evaluations-list" style={{ padding: 0 }}>
            {data.evaluacionesRecientes.length === 0 ? (
              <p className="comments-empty">Sin evaluaciones aún</p>
            ) : (
              data.evaluacionesRecientes.map((ev) => (
                <EvaluationItem key={ev.id} ev={ev} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
