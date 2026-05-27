import type { EvaluacionInput, CalificacionInput } from "@/types";

/**
 * Validaciones reutilizables para los datos de entrada de las API routes.
 */

/**
 * Valida que un valor sea un número entero positivo.
 */
export function isPositiveInt(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

/**
 * Valida que un valor de escala hedónica sea válido (1-5).
 */
export function isValidEscalaHedonica(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isInteger(valor) && valor >= 1 && valor <= 5;
}

/**
 * Valida que un string no esté vacío después de trim.
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Valida un email con formato básico.
 */
export function isValidEmail(value: unknown): value is string {
  if (typeof value !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Valida la estructura de una calificación individual.
 */
export function isValidCalificacion(cal: unknown): cal is CalificacionInput {
  if (typeof cal !== "object" || cal === null) return false;
  const c = cal as Record<string, unknown>;
  return isPositiveInt(c.parametro_id) && isValidEscalaHedonica(c.valor);
}

/**
 * Valida el body completo de una nueva evaluación (evaluador anónimo).
 */
export function validateEvaluacionBody(body: unknown): {
  valid: boolean;
  error?: string;
  data?: EvaluacionInput;
} {
  if (typeof body !== "object" || body === null) {
    return { valid: false, error: "Body inválido" };
  }

  const b = body as Record<string, unknown>;

  // Validar datos personales del evaluador
  if (!isNonEmptyString(b.nombre)) {
    return { valid: false, error: "El nombre es obligatorio" };
  }
  if (!isNonEmptyString(b.apellido)) {
    return { valid: false, error: "El apellido es obligatorio" };
  }
  if (!isValidEmail(b.email)) {
    return { valid: false, error: "El email no es válido" };
  }

  // Validar calificaciones
  if (!Array.isArray(b.calificaciones) || b.calificaciones.length === 0) {
    return { valid: false, error: "Se requiere al menos una calificación" };
  }

  for (const cal of b.calificaciones) {
    if (!isValidCalificacion(cal)) {
      return {
        valid: false,
        error: "Calificación inválida: cada una necesita parametro_id (entero) y valor (1-5)",
      };
    }
  }

  return {
    valid: true,
    data: {
      nombre: (b.nombre as string).trim(),
      apellido: (b.apellido as string).trim(),
      email: (b.email as string).trim().toLowerCase(),
      comentario: typeof b.comentario === "string" ? b.comentario.trim() : undefined,
      calificaciones: b.calificaciones.map((c: Record<string, unknown>) => ({
        parametro_id: c.parametro_id as number,
        valor: c.valor as number,
        observacion: typeof c.observacion === "string" ? c.observacion : undefined,
      })),
    },
  };
}
