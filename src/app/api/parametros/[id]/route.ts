import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/server/supabase/server";

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/parametros/:id
 * Devuelve un parámetro por su ID.
 */
export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  // TODO: implementar obtener parámetro por id

  return NextResponse.json({ message: `GET /api/parametros/${id} — pendiente` });
}

/**
 * PATCH /api/parametros/:id
 * Actualiza un parámetro existente.
 * Acceso: solo admin.
 */
export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  // TODO: verificar admin, validar body, actualizar parámetro

  return NextResponse.json({ message: `PATCH /api/parametros/${id} — pendiente` });
}

/**
 * DELETE /api/parametros/:id
 * Desactiva (soft delete) un parámetro.
 * Acceso: solo admin.
 */
export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  // TODO: verificar admin, desactivar parámetro (activo = false)

  return NextResponse.json({ message: `DELETE /api/parametros/${id} — pendiente` });
}
