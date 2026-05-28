import { createAnonSupabaseClient } from "@/server/supabase/anon";
import { successResponse, serverErrorResponse } from "@/server/api-response";

/**
 * GET /api/comentarios
 * Devuelve los comentarios visibles para el mural público.
 * Acceso: PÚBLICO (no requiere autenticación).
 *
 * IMPORTANTE: Para que este endpoint funcione, necesitás agregar
 * esta policy en Supabase (SQL Editor):
 *
 *   CREATE POLICY "Lectura pública de comments visibles" ON public.comments
 *     FOR SELECT USING (is_visible = true);
 *
 *   GRANT SELECT ON public.comments TO anon;
 *
 * También necesitás que el anon pueda leer los respondents asociados:
 *
 *   CREATE POLICY "Lectura pública de respondents para mural" ON public.respondents
 *     FOR SELECT USING (
 *       EXISTS (SELECT 1 FROM public.comments c WHERE c.respondent_id = id AND c.is_visible = true)
 *     );
 */
export async function GET() {
  try {
    const supabase = createAnonSupabaseClient();

    const { data, error } = await supabase
      .from("comments")
      .select("id, content, created_at, respondent:respondents(name)")
      .eq("is_visible", true)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching public comments:", error.message);
      return serverErrorResponse(error.message);
    }

    // Formatear para el frontend
    const comments = (data || []).map((c: Record<string, unknown>) => {
      const respondent = c.respondent as { name: string } | null;
      return {
        id: c.id,
        content: c.content,
        created_at: c.created_at,
        name: respondent?.name || "Anónimo",
      };
    });

    return successResponse(comments);
  } catch {
    return serverErrorResponse();
  }
}
