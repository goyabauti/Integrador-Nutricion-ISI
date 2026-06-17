"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";  // still used for comment
import { Button } from "@/components/ui/Button";
import { RatingSlider } from "@/components/ui/RatingSlider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { ThankYou } from "@/components/ThankYou";

type Question = { id: number; text: string; order_index: number; category: string | null };

/* ── Category display helpers ── */
const CATEGORY_LABELS: Record<string, string> = {
  hedonica: "Escala Hedónica",
  positivos: "Atributos Positivos",
  generales: "Atributos Generales",
  defectos: "Defectos",
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  hedonica: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" /></svg>
  ),
  positivos: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>
  ),
  generales: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
  ),
  defectos: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
  ),
};

/* ── Progress step component ── */
function ProgressSteps({ currentStep }: { currentStep: number }) {
  const steps = [
    { num: 1, label: "Evaluar" },
    { num: 2, label: "Enviar" },
  ];

  return (
    <div className="progress-steps">
      {steps.map((step, i) => (
        <React.Fragment key={step.num}>
          <div className="step-item">
            <div className={`step-circle ${currentStep > step.num ? 'completed' : currentStep === step.num ? 'active' : 'inactive'}`}>
              {currentStep > step.num ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
              ) : (
                step.num
              )}
            </div>
            <span className={`step-label ${currentStep >= step.num ? 'active' : ''}`}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`step-connector ${currentStep > step.num ? 'completed' : 'inactive'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ── Loading skeleton ── */
function LoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", padding: "3rem 0" }}>
      <div className="skeleton" style={{ height: "28px", width: "140px", margin: "0 auto" }} />
      <div className="skeleton" style={{ height: "48px", width: "320px", margin: "0 auto" }} />
      <div className="skeleton" style={{ height: "20px", width: "260px", margin: "0 auto" }} />
      <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton" style={{ height: "140px", width: "100%" }} />
        ))}
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function EvaluarPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [comment, setComment] = useState("");
  const [scores, setScores] = useState<Record<number, number>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/parametros");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setQuestions(json.data);
        } else {
          setError("Error al cargar la encuesta. Por favor, recarga la página.");
        }
      } catch {
        setError("Error al cargar la encuesta. Por favor, recarga la página.");
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleRatingChange = (questionId: number, value: number) => {
    setScores(prev => ({ ...prev, [questionId]: value }));
    if (fieldErrors[`q_${questionId}`]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[`q_${questionId}`];
        return next;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    questions.forEach(q => {
      if (!scores[q.id]) newErrors[`q_${q.id}`] = "Evaluá este atributo";
    });
    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) {
      setError("Evaluá todos los atributos antes de enviar.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setLoadingSubmit(true);
    try {
      const payload = {
        comment: comment.trim() || undefined,
        responses: Object.entries(scores).map(([questionId, score]) => ({
          question_id: Number(questionId),
          score
        }))
      };
      const res = await fetch("/api/evaluaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Error al enviar. Intentá nuevamente.");
        return;
      }
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError("Error al enviar. Intentá nuevamente.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  /* ── Compute current progress step ── */
  const answeredCount = Object.keys(scores).length;
  const totalQuestions = questions.length;
  const currentStep = answeredCount === totalQuestions && totalQuestions > 0 ? 2 : 1;

  /* ── Group questions by category ── */
  const groupedQuestions = questions.reduce<Record<string, Question[]>>((acc, q) => {
    const cat = q.category || "general";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(q);
    return acc;
  }, {});

  if (loadingQuestions) {
    return <LoadingSkeleton />;
  }

  if (submitted) {
    return <ThankYou />;
  }

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto" }}>
      <div className="animate-fade-in-up">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-badge">Evaluación Sensorial</div>
          <h1 className="hero-title">
            Evalúa la muestra
          </h1>
          <p className="hero-subtitle">
            Probá el budín y deslizá cada barra según tu impresión. Tu opinión nos ayuda a mejorar.
          </p>
        </div>

        {/* Progress Steps */}
        <ProgressSteps currentStep={currentStep} />

        {error && (
          <div className="alert-error" style={{ marginBottom: "1.5rem" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>


          {/* Questions grouped by category */}
          {Object.entries(groupedQuestions).map(([category, qs]) => (
            <div key={category}>
              {/* Section header with lines */}
              <div className="section-header">
                <div className="section-line" />
                <div className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  {CATEGORY_ICONS[category]}
                  {CATEGORY_LABELS[category] || category}
                </div>
                <div className="section-line" />
              </div>

              {/* Sliders for this category */}
              <div className="stagger-children" style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {qs.map(q => (
                  <RatingSlider
                    key={q.id}
                    label={q.text}
                    value={scores[q.id] || 0}
                    onChange={(val) => handleRatingChange(q.id, val)}
                    error={fieldErrors[`q_${q.id}`]}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Comentarios */}
          <Card>
            <CardHeader>
              <CardTitle style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--coco-caramel)" strokeWidth="2">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
                Comentarios
              </CardTitle>
              <CardDescription>Opcional — contanos qué te pareció</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                label="Notas"
                multiline
                placeholder="¿Qué destacarías? ¿Qué mejorarías?"
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Progress indicator */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 0.25rem",
            fontSize: "0.85rem",
            color: "var(--coco-brown)"
          }}>
            <span>{answeredCount} de {totalQuestions} atributos evaluados</span>
            <div style={{
              width: "120px",
              height: "4px",
              background: "var(--coco-beige)",
              borderRadius: "2px",
              overflow: "hidden"
            }}>
              <div style={{
                height: "100%",
                width: totalQuestions > 0 ? `${(answeredCount / totalQuestions) * 100}%` : "0%",
                background: answeredCount === totalQuestions ? "var(--coco-caramel)" : "var(--coco-dark)",
                borderRadius: "2px",
                transition: "width 0.3s ease"
              }} />
            </div>
          </div>

          {/* Submit */}
          <Button size="lg" type="submit" loading={loadingSubmit}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            Enviar evaluación
          </Button>
        </form>
      </div>
    </div>
  );
}
