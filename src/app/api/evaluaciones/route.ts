import { createServerSupabaseClient } from "@/server/supabase/server";
import { createAnonSupabaseClient } from "@/server/supabase/anon";
import { successResponse, errorResponse, serverErrorResponse } from "@/server/api-response";
import { requireAdmin } from "@/server/auth";
import { validateSurveySubmission } from "@/server/validations";

/**
 * GET /api/evaluaciones
 * Lista todos los respondents con sus responses y comments.
 * Acceso: solo admin.
 */
export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return errorResponse("No autorizado", 401);
    }

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("respondents")
      .select("*, responses(*, questions(text, category)), comments(*)")
      .order("created_at", { ascending: false });

    if (error) {
      return serverErrorResponse(error.message);
    }

    return successResponse(data);
  } catch {
    return serverErrorResponse();
  }
}

/**
 * POST /api/evaluaciones
 * Crea un nuevo respondent con sus responses y comment opcional.
 * Acceso: PÚBLICO (evaluador anónimo, sin cuenta).
 *
 * Body esperado:
 * {
 *   name: string,
 *   email: string,
 *   comment?: string,
 *   responses: [{ question_id: number, score: number }]
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateSurveySubmission(body);

    if (!validation.valid || !validation.data) {
      return errorResponse(validation.error || "Datos inválidos");
    }

    const { name, email, comment, responses } = validation.data;
    // Usar cliente anónimo (sin cookies/sesión) para operaciones públicas
    const supabase = createAnonSupabaseClient();

    // 1. Validar que hayan respondido TODAS las preguntas activas
    const { count: activeQuestionsCount, error: countError } = await supabase
      .from("questions")
      .select("*", { count: "exact", head: true })
      .eq("active", true);

    if (countError) {
      return serverErrorResponse(countError.message);
    }

    if (responses.length !== activeQuestionsCount) {
      return errorResponse(`Faltan respuestas. Debes responder las ${activeQuestionsCount} preguntas obligatorias.`);
    }

    const respondentId = crypto.randomUUID();

    // 2. Insertar respondent
    const { error: respondentError } = await supabase
      .from("respondents")
      .insert({ id: respondentId, name, email });

    if (respondentError) {
      return serverErrorResponse(respondentError.message);
    }

    // 3. Insertar responses
    const responsesPayload = responses.map((r) => ({
      respondent_id: respondentId,
      question_id: r.question_id,
      score: r.score,
    }));

    const { error: responsesError } = await supabase
      .from("responses")
      .insert(responsesPayload);

    if (responsesError) {
      return serverErrorResponse(responsesError.message);
    }

    // 4. Insertar comment (si existe)
    if (comment) {
      const { error: commentError } = await supabase
        .from("comments")
        .insert({
          respondent_id: respondentId,
          content: comment,
          is_visible: true,
        });

      if (commentError) {
        // No es crítico, logueamos pero no fallamos
        console.error("Error al insertar comment:", commentError.message);
      }
    }

    return successResponse({ respondent_id: respondentId }, 201);
  } catch {
    return serverErrorResponse();
  }
}
