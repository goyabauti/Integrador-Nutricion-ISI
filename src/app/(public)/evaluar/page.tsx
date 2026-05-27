"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { RatingSlider } from "@/components/ui/RatingSlider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { ThankYou } from "@/components/ThankYou";

// Tipo basado en la tabla questions del schema
type Question = { id: number; text: string; order_index: number; category: string | null };

export default function EvaluarPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Estado del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
    // Limpiar error de ese campo si lo había
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
    if (!name.trim()) newErrors.name = "Requerido";
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Email inválido";

    // Validar que todas las questions hayan sido evaluadas
    questions.forEach(q => {
      if (!scores[q.id]) {
        newErrors[`q_${q.id}`] = "Por favor, evaluá este atributo";
      }
    });

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      setError("Por favor, completá todos los campos requeridos y evaluá todos los atributos.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoadingSubmit(true);

    try {
      const payload = {
        name,
        email,
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
        setError(json.error || "Ocurrió un error al enviar tu evaluación. Intentá nuevamente.");
        return;
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch {
      setError("Ocurrió un error al enviar tu evaluación. Intentá nuevamente.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingQuestions) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
        <p>Cargando encuesta...</p>
      </div>
    );
  }

  if (submitted) {
    return <ThankYou />;
  }

  return (
    <div className="animate-fade-in-up">
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <span style={{ 
          fontSize: "0.85rem", 
          fontWeight: 600, 
          letterSpacing: "0.15em", 
          color: "var(--coco-caramel)", 
          textTransform: "uppercase",
          display: "block",
          marginBottom: "0.5rem"
        }}>
          Paso 2
        </span>
        <h1 style={{ 
          fontSize: "3.2rem", 
          fontFamily: "var(--font-serif)", 
          fontWeight: 800, 
          lineHeight: "1.1", 
          color: "var(--coco-dark)",
          marginBottom: "0.75rem" 
        }}>
          Evalúa la muestra
        </h1>
        <p style={{ 
          color: "var(--coco-brown)", 
          fontSize: "1.15rem",
          fontWeight: 400
        }}>
          Probá el budín y deslizá cada barra según tu impresión.
        </p>
      </div>

      {error && (
        <div style={{ 
          background: "#fef2f2", 
          color: "var(--coco-danger)", 
          padding: "1rem", 
          borderRadius: "8px", 
          marginBottom: "1.5rem",
          fontWeight: 500,
          border: "1px solid #fecaca"
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        
        {/* Datos Personales */}
        <Card>
          <CardHeader>
            <CardTitle>Tus datos</CardTitle>
            <CardDescription>Para saber quién nos ayuda a mejorar</CardDescription>
          </CardHeader>
          <CardContent style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input 
              label="Nombre" 
              placeholder="Ej: María García" 
              value={name} 
              onChange={e => setName(e.target.value)}
              error={fieldErrors.name}
            />
            <Input 
              label="Email" 
              type="email" 
              placeholder="tu@email.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              error={fieldErrors.email}
            />
          </CardContent>
        </Card>

        {/* Encuesta (Sliders) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          
          {questions.map(q => (
            <RatingSlider
              key={q.id}
              label={q.text}
              value={scores[q.id] || 0}
              onChange={(val) => handleRatingChange(q.id, val)}
              error={fieldErrors[`q_${q.id}`]}
            />
          ))}
        </div>

        {/* Comentarios */}
        <Card>
          <CardHeader>
            <CardTitle>Comentarios adicionales</CardTitle>
            <CardDescription>Opcional</CardDescription>
          </CardHeader>
          <CardContent>
            <Input 
              label="Notas optativas" 
              multiline 
              placeholder="¿Qué te pareció? ¿Algo que destacarías o mejorarías?" 
              value={comment} 
              onChange={e => setComment(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <Button size="lg" type="submit" loading={loadingSubmit}>
          Enviar evaluación
        </Button>
      </form>
    </div>
  );
}
