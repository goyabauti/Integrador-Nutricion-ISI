import { createServerSupabaseClient } from "@/server/supabase/server";
import { successResponse, errorResponse, notFoundResponse, serverErrorResponse } from "@/server/api-response";
import { requireAdmin } from "@/server/auth";

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/evaluaciones/:id
 * Devuelve un respondent con sus responses (incluyendo info de la question) y comments.
 * Acceso: solo admin.
 */
export async function GET(request: Request, { params }: Params) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return errorResponse("No autorizado", 401);
    }

    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("respondents")
      .select("*, responses(*, questions(text, category)), comments(*)")
      .eq("id", id)
      .single();

    if (error || !data) {
      return notFoundResponse("Evaluación no encontrada");
    }

    return successResponse(data);
  } catch {
    return serverErrorResponse();
  }
}

/**
 * DELETE /api/evaluaciones/:id
 * Elimina un respondent y sus responses/comments (CASCADE).
 * Acceso: solo admin.
 */
export async function DELETE(request: Request, { params }: Params) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return errorResponse("No autorizado", 401);
    }

    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("respondents")
      .delete()
      .eq("id", id);

    if (error) {
      return serverErrorResponse(error.message);
    }

    return successResponse({ message: "Evaluación eliminada" });
  } catch {
    return serverErrorResponse();
  }
}
