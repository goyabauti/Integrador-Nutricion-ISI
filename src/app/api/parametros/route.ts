import { createServerSupabaseClient } from "@/server/supabase/server";
import { successResponse, errorResponse, serverErrorResponse } from "@/server/api-response";
import { requireAdmin } from "@/server/auth";

/**
 * GET /api/parametros
 * Devuelve todas las questions activas, ordenadas por order_index.
 * Acceso: PÚBLICO (necesario para que el evaluador anónimo vea el formulario).
 */
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("active", true)
      .order("order_index");

    if (error) {
      return serverErrorResponse(error.message);
    }

    return successResponse(data);
  } catch {
    return serverErrorResponse();
  }
}

/**
 * POST /api/parametros
 * Crea una nueva question.
 * Acceso: solo admin.
 */
export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return errorResponse("No autorizado", 401);
    }

    const body = await request.json();
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("questions")
      .insert({
        text: body.text,
        category: body.category || null,
        order_index: body.order_index || 0,
        active: body.active ?? true,
      })
      .select()
      .single();

    if (error) {
      return serverErrorResponse(error.message);
    }

    return successResponse(data, 201);
  } catch {
    return serverErrorResponse();
  }
}
