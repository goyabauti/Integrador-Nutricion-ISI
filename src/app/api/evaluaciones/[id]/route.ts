import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/server/supabase/server";

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/evaluaciones/:id
 * Devuelve una evaluación con sus calificaciones.
 * Acceso: solo admin.
 */
export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  // TODO: verificar que es admin con requireAdmin()
  // TODO: obtener evaluación + calificaciones + nombre del parámetro
  // const { data, error } = await supabase
  //   .from("evaluaciones")
  //   .select("*, calificaciones(*, parametros(nombre, ficha, categoria))")
  //   .eq("id", id)
  //   .single();

  return NextResponse.json({ message: `GET /api/evaluaciones/${id} — pendiente` });
}

/**
 * DELETE /api/evaluaciones/:id
 * Elimina una evaluación y sus calificaciones.
 * Acceso: solo admin.
 */
export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  // TODO: verificar que es admin con requireAdmin()
  // TODO: eliminar evaluación (CASCADE borra calificaciones)

  return NextResponse.json({ message: `DELETE /api/evaluaciones/${id} — pendiente` });
}
