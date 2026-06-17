import type { SurveySubmission, ResponseInput } from "@/types";

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
 * Valida que un score de escala hedónica sea válido (1-5).
 */
export function isValidScore(valor: unknown): valor is number {
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
 * Valida la estructura de una response individual.
 */
export function isValidResponseInput(r: unknown): r is ResponseInput {
  if (typeof r !== "object" || r === null) return false;
  const obj = r as Record<string, unknown>;
  return isPositiveInt(obj.question_id) && isValidScore(obj.score);
}

/**
 * Valida el body completo de un nuevo survey submission (evaluador anónimo).
 */
export function validateSurveySubmission(body: unknown): {
  valid: boolean;
  error?: string;
  data?: SurveySubmission;
} {
  if (typeof body !== "object" || body === null) {
    return { valid: false, error: "Body inválido" };
  }

  const b = body as Record<string, unknown>;

  // name y email son opcionales (evaluación anónima)
  const name = isNonEmptyString(b.name) ? (b.name as string).trim() : "Anónimo";
  const email = isValidEmail(b.email) ? (b.email as string).trim().toLowerCase() : null;

  // Validar responses
  if (!Array.isArray(b.responses) || b.responses.length === 0) {
    return { valid: false, error: "Se requiere al menos una respuesta" };
  }

  for (const r of b.responses) {
    if (!isValidResponseInput(r)) {
      return {
        valid: false,
        error: "Respuesta inválida: cada una necesita question_id (entero) y score (1-5)",
      };
    }
  }

  return {
    valid: true,
    data: {
      name,
      email,
      comment: typeof b.comment === "string" && b.comment.trim() ? b.comment.trim() : undefined,
      responses: b.responses.map((r: Record<string, unknown>) => ({
        question_id: r.question_id as number,
        score: r.score as number,
      })),
    },
  };
}
