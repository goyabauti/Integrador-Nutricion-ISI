import { createServerSupabaseClient } from "@/server/supabase/server";
import { successResponse, errorResponse, serverErrorResponse } from "@/server/api-response";
import { requireAdmin } from "@/server/auth";

/**
 * GET /api/resultados
 * Devuelve estadísticas y resultados agregados de las evaluaciones.
 * Acceso: solo admin.
 *
 * Respuesta:
 * {
 *   totalRespondents: number,
 *   promediosPorQuestion: [{ question_id, text, category, promedio, totalResponses }],
 *   distribucion: Record<number, number>  (score → cantidad)
 * }
 */
export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return errorResponse("No autorizado", 401);
    }

    const supabase = await createServerSupabaseClient();

    // 1. Total de respondents
    const { count: totalRespondents, error: countError } = await supabase
      .from("respondents")
      .select("*", { count: "exact", head: true });

    if (countError) {
      return serverErrorResponse(countError.message);
    }

    // 2. Todas las responses con info de la question
    const { data: allResponses, error: responsesError } = await supabase
      .from("responses")
      .select("score, question_id, questions(text, category)");

    if (responsesError) {
      return serverErrorResponse(responsesError.message);
    }

    // 3. Calcular promedios por question
    const questionMap = new Map<number, {
      text: string;
      category: string | null;
      totalScore: number;
      count: number;
    }>();

    const distribucion: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    for (const r of allResponses || []) {
      const qId = r.question_id;
      const q = r.questions as unknown as { text: string; category: string | null } | null;

      if (!questionMap.has(qId)) {
        questionMap.set(qId, {
          text: q?.text || "",
          category: q?.category || null,
          totalScore: 0,
          count: 0,
        });
      }

      const entry = questionMap.get(qId)!;
      entry.totalScore += r.score;
      entry.count += 1;

      // Distribución global de scores
      if (r.score >= 1 && r.score <= 5) {
        distribucion[r.score] = (distribucion[r.score] || 0) + 1;
      }
    }

    const promediosPorQuestion = Array.from(questionMap.entries()).map(
      ([question_id, entry]) => ({
        question_id,
        text: entry.text,
        category: entry.category,
        promedio: entry.count > 0 ? Math.round((entry.totalScore / entry.count) * 100) / 100 : 0,
        totalResponses: entry.count,
      })
    );

    return successResponse({
      totalRespondents: totalRespondents || 0,
      promediosPorQuestion,
      distribucion,
    });
  } catch {
    return serverErrorResponse();
  }
}
