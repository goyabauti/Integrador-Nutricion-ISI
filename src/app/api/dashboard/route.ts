import { createServerSupabaseClient } from "@/server/supabase/server";
import { successResponse, errorResponse, serverErrorResponse } from "@/server/api-response";
import { requireAuth } from "@/server/auth";
import { getFriendlyAnonymousName } from "@/server/utils";
import type {
  CategoryAverage,
  QuestionAverage,
  TimelinePoint,
  RecentComment,
  RecentEvaluation,
} from "@/types";

const CATEGORY_LABELS: Record<string, string> = {
  hedonica: "Escala Hedónica",
  positivos: "Atributos Positivos",
  generales: "Atributos Generales",
  defectos: "Defectos",
};

/**
 * GET /api/dashboard
 * Devuelve todas las métricas y datos agregados para el dashboard.
 * Acceso: admin o nutri.
 */
export async function GET() {
  console.log("[API/Dashboard] GET request received");
  try {
    const user = await requireAuth();
    console.log("[API/Dashboard] requireAuth result:", user ? `User ID: ${user.user_id}, Role: ${user.role}` : "No user");
    if (!user) {
      return errorResponse("No autorizado", 401);
    }

    const supabase = await createServerSupabaseClient();

    // 1. Total de respondents que realmente respondieron (al menos 1 pregunta)
    console.log("[API/Dashboard] Querying respondents count...");
    const { count: totalEvaluaciones, error: countError } = await supabase
      .from("respondents")
      .select("id, responses!inner(respondent_id)", { count: "exact", head: true });

    if (countError) {
      console.error("[API/Dashboard] Error querying respondents count:", countError);
      return serverErrorResponse(countError.message);
    }
    console.log("[API/Dashboard] Respondents with responses count:", totalEvaluaciones);

    // 2. Todas las responses con info de la question
    const { data: allResponses, error: responsesError } = await supabase
      .from("responses")
      .select("score, question_id, created_at, respondent_id, questions(text, category)")
      .limit(10000); // Supabase default cap is 1000 — necesitamos todas las filas

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

    let totalScore = 0;
    let totalCount = 0;

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
      totalScore += r.score;
      totalCount += 1;
    }

    // 3b. Distribución: query directo sobre todos los respondents con sus scores
    // Así sum(distribucion) == totalEvaluaciones (no depende de la tabla responses)
    const { data: allRespondentsWithScores, error: distError } = await supabase
      .from("respondents")
      .select("id, responses(score)")
      .limit(10000);

    if (distError) {
      return serverErrorResponse(distError.message);
    }

    const distribucion: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const respondent of allRespondentsWithScores || []) {
      const scores = respondent.responses as unknown as { score: number }[] || [];
      // Si no respondió ninguna pregunta, se omite (no distorsiona el promedio)
      if (scores.length === 0) continue;
      const avg = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
      const bucket = Math.min(5, Math.max(1, Math.round(avg))) as 1 | 2 | 3 | 4 | 5;
      distribucion[bucket] = (distribucion[bucket] || 0) + 1;
    }

    // Promedios por pregunta
    const promediosPorPregunta: QuestionAverage[] = Array.from(questionMap.entries())
      .map(([question_id, entry]) => ({
        question_id,
        text: entry.text,
        category: entry.category,
        promedio: entry.count > 0 ? Math.round((entry.totalScore / entry.count) * 100) / 100 : 0,
        totalResponses: entry.count,
      }))
      .sort((a, b) => b.promedio - a.promedio);

    // Promedios por categoría (para gráfico de araña)
    const categoryMap = new Map<string, { totalScore: number; count: number }>();
    for (const entry of questionMap.values()) {
      const cat = entry.category || "general";
      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, { totalScore: 0, count: 0 });
      }
      const catEntry = categoryMap.get(cat)!;
      catEntry.totalScore += entry.totalScore;
      catEntry.count += entry.count;
    }

    const promediosPorCategoria: CategoryAverage[] = Array.from(categoryMap.entries())
      .map(([category, entry]) => ({
        category,
        label: CATEGORY_LABELS[category] || category,
        promedio: entry.count > 0 ? Math.round((entry.totalScore / entry.count) * 100) / 100 : 0,
        totalResponses: entry.count,
      }));

    // Score más alto y más bajo
    const scoreMasAlto = promediosPorPregunta.length > 0 ? promediosPorPregunta[0] : null;
    const scoreMasBajo = promediosPorPregunta.length > 0 ? promediosPorPregunta[promediosPorPregunta.length - 1] : null;

    // Promedio general
    const promedioGeneral = totalCount > 0 ? Math.round((totalScore / totalCount) * 100) / 100 : 0;

    // 4. Timeline: respuestas agrupadas por fecha
    const dateMap = new Map<string, { count: number; totalScore: number; respondentIds: Set<string> }>();
    for (const r of allResponses || []) {
      const date = new Date(r.created_at).toISOString().split("T")[0];
      if (!dateMap.has(date)) {
        dateMap.set(date, { count: 0, totalScore: 0, respondentIds: new Set() });
      }
      const dateEntry = dateMap.get(date)!;
      dateEntry.totalScore += r.score;
      dateEntry.count += 1;
      dateEntry.respondentIds.add(r.respondent_id);
    }

    const timeline: TimelinePoint[] = Array.from(dateMap.entries())
      .map(([date, entry]) => ({
        date,
        count: entry.respondentIds.size,
        promedio: entry.count > 0 ? Math.round((entry.totalScore / entry.count) * 100) / 100 : 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // 5. Comentarios recientes (anonimizados — no se exponen datos personales)
    const { data: commentsData } = await supabase
      .from("comments")
      .select("id, content, is_visible, created_at, respondent_id")
      .order("created_at", { ascending: false })
      .limit(10);

    const comentariosRecientes: RecentComment[] = (commentsData || []).map((c, i) => ({
      id: c.id,
      content: c.content,
      is_visible: c.is_visible,
      created_at: c.created_at,
      respondent_label: getFriendlyAnonymousName(c.respondent_id),
    }));

    // 6. Evaluaciones recientes (anonimizadas — sin nombre ni email)
    const { data: respondentsData } = await supabase
      .from("respondents")
      .select("id, created_at, responses(score, question_id, questions(text, category, order_index))")
      .order("created_at", { ascending: false })
      .limit(10);

    const evaluacionesRecientes: RecentEvaluation[] = (respondentsData || []).map((r) => {
      const rawResponses = r.responses as unknown as {
        score: number;
        question_id: number;
        questions: { text: string; category: string | null; order_index: number } | null;
      }[] || [];

      const avg = rawResponses.length > 0
        ? Math.round((rawResponses.reduce((sum, resp) => sum + resp.score, 0) / rawResponses.length) * 100) / 100
        : 0;

      const responses = rawResponses
        .sort((a, b) => (a.questions?.order_index ?? 0) - (b.questions?.order_index ?? 0))
        .map((resp) => ({
          question_id: resp.question_id,
          text: resp.questions?.text || `Pregunta ${resp.question_id}`,
          category: resp.questions?.category || null,
          score: resp.score,
        }));

      return {
        id: r.id,
        // Label anónimo determinista y amigable
        label: getFriendlyAnonymousName(r.id),
        created_at: r.created_at,
        promedio: avg,
        totalResponses: rawResponses.length,
        responses,
      };
    });

    console.log("[API/Dashboard] GET completed successfully. Returning data.");
    return successResponse({
      totalEvaluaciones: totalEvaluaciones || 0,
      promedioGeneral,
      scoreMasAlto,
      scoreMasBajo,
      promediosPorCategoria,
      promediosPorPregunta,
      distribucion,
      timeline,
      comentariosRecientes,
      evaluacionesRecientes,
    });
  } catch (error) {
    console.error("[API/Dashboard] Unexpected error in GET:", error);
    return serverErrorResponse();
  }
}
