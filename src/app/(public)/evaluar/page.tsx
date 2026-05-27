"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { RatingSlider } from "@/components/ui/RatingSlider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { ThankYou } from "@/components/ThankYou";

// Tipos locales basados en tu schema
type Parametro = { id: number; nombre: string; ficha: string; categoria: string | null };

export default function EvaluarPage() {
  const [parametros, setParametros] = useState<Parametro[]>([]);
  const [loadingParametros, setLoadingParametros] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Estado del formulario
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [comentario, setComentario] = useState("");
  const [calificaciones, setCalificaciones] = useState<Record<number, number>>({});
  const [erroresCampos, setErroresCampos] = useState<Record<string, string>>({});

  useEffect(() => {
    // Cargar parámetros de la API (por ahora usamos una lista mock hasta que la API esté lista)
    // Cuando la API de GET /api/parametros devuelva los datos reales, se reemplaza esto.
    const fetchParametros = async () => {
      try {
        // Simulación: los parámetros hedónicos del schema
        const mockParametros = [
          { id: 1, nombre: "Sabor", ficha: "hedonica", categoria: null },
          { id: 2, nombre: "Olor / Aroma", ficha: "hedonica", categoria: null },
          { id: 3, nombre: "Color", ficha: "hedonica", categoria: null },
          { id: 4, nombre: "Textura", ficha: "hedonica", categoria: null },
          { id: 5, nombre: "Humedad", ficha: "hedonica", categoria: null },
          { id: 6, nombre: "Aceptación general", ficha: "hedonica", categoria: null },
        ];
        setParametros(mockParametros);
      } catch (err) {
        setError("Error al cargar la encuesta. Por favor, recarga la página.");
      } finally {
        setLoadingParametros(false);
      }
    };

    fetchParametros();
  }, []);

  const handleRatingChange = (paramId: number, value: number) => {
    setCalificaciones(prev => ({ ...prev, [paramId]: value }));
    // Limpiar error de ese campo si lo había
    if (erroresCampos[`param_${paramId}`]) {
      setErroresCampos(prev => {
        const next = { ...prev };
        delete next[`param_${paramId}`];
        return next;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!nombre.trim()) newErrors.nombre = "Requerido";
    if (!apellido.trim()) newErrors.apellido = "Requerido";
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Email inválido";

    // Validar que todos los parámetros hayan sido evaluados
    parametros.forEach(p => {
      if (!calificaciones[p.id]) {
        newErrors[`param_${p.id}`] = "Por favor, evaluá este atributo";
      }
    });

    setErroresCampos(newErrors);
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
      // Formatear payload para la API
      const payload = {
        nombre,
        apellido,
        email,
        comentario: comentario.trim() || undefined,
        calificaciones: Object.entries(calificaciones).map(([paramId, valor]) => ({
          parametro_id: Number(paramId),
          valor
        }))
      };

      // TODO: Llamar a la API real POST /api/evaluaciones
      // Por ahora simulamos delay de red
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Enviado:", payload);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      setError("Ocurrió un error al enviar tu evaluación. Intentá nuevamente.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingParametros) {
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
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Evaluación Sensorial</h1>
        <p style={{ color: "var(--coco-brown)", fontSize: "1.1rem" }}>
          Probá la muestra que tenés ante vos y evaluá las siguientes propiedades.
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
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 200px" }}>
                <Input 
                  label="Nombre" 
                  placeholder="Ej: María" 
                  value={nombre} 
                  onChange={e => setNombre(e.target.value)}
                  error={erroresCampos.nombre}
                />
              </div>
              <div style={{ flex: "1 1 200px" }}>
                <Input 
                  label="Apellido" 
                  placeholder="Ej: García" 
                  value={apellido} 
                  onChange={e => setApellido(e.target.value)}
                  error={erroresCampos.apellido}
                />
              </div>
            </div>
            <Input 
              label="Email" 
              type="email" 
              placeholder="tu@email.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              error={erroresCampos.email}
            />
          </CardContent>
        </Card>

        {/* Encuesta (Sliders) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Propiedades de la muestra</h2>
          
          {parametros.map(param => (
            <RatingSlider
              key={param.id}
              label={param.nombre}
              value={calificaciones[param.id] || 0}
              onChange={(val) => handleRatingChange(param.id, val)}
              error={erroresCampos[`param_${param.id}`]}
            />
          ))}
        </div>

        {/* Notas Optativas */}
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
              value={comentario} 
              onChange={e => setComentario(e.target.value)}
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
