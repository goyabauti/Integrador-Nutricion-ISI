import { createServerSupabaseClient } from "@/server/supabase/server";
import { successResponse, errorResponse, notFoundResponse, serverErrorResponse } from "@/server/api-response";
import { requireAdmin } from "@/server/auth";

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/parametros/:id
 * Devuelve una question por su ID.
 */
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("id", Number(id))
      .single();

    if (error || !data) {
      return notFoundResponse("Pregunta no encontrada");
    }

    return successResponse(data);
  } catch {
    return serverErrorResponse();
  }
}

/**
 * PATCH /api/parametros/:id
 * Actualiza una question existente.
 * Acceso: solo admin.
 */
export async function PATCH(request: Request, { params }: Params) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return errorResponse("No autorizado", 401);
    }

    const { id } = await params;
    const body = await request.json();
    const supabase = await createServerSupabaseClient();

    // Solo permitir actualizar campos válidos
    const updates: Record<string, unknown> = {};
    if (body.text !== undefined) updates.text = body.text;
    if (body.category !== undefined) updates.category = body.category;
    if (body.order_index !== undefined) updates.order_index = body.order_index;
    if (body.active !== undefined) updates.active = body.active;

    const { data, error } = await supabase
      .from("questions")
      .update(updates)
      .eq("id", Number(id))
      .select()
      .single();

    if (error) {
      return serverErrorResponse(error.message);
    }

    if (!data) {
      return notFoundResponse("Pregunta no encontrada");
    }

    return successResponse(data);
  } catch {
    return serverErrorResponse();
  }
}

/**
 * DELETE /api/parametros/:id
 * Desactiva (soft delete) una question.
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

    const { data, error } = await supabase
      .from("questions")
      .update({ active: false })
      .eq("id", Number(id))
      .select()
      .single();

    if (error) {
      return serverErrorResponse(error.message);
    }

    if (!data) {
      return notFoundResponse("Pregunta no encontrada");
    }

    return successResponse({ message: "Pregunta desactivada" });
  } catch {
    return serverErrorResponse();
  }
}
