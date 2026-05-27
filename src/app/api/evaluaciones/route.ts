import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/server/supabase/server";

/**
 * GET /api/evaluaciones
 * Lista todas las evaluaciones.
 * Acceso: solo admin.
 */
export async function GET() {
  const supabase = await createServerSupabaseClient();

  // TODO: verificar que es admin con requireAdmin()
  // TODO: listar evaluaciones con paginación
  // const { data, error } = await supabase
  //   .from("evaluaciones")
  //   .select("*, calificaciones(*)")
  //   .order("created_at", { ascending: false });

  return NextResponse.json({ message: "GET /api/evaluaciones — pendiente" });
}

/**
 * POST /api/evaluaciones
 * Crea una nueva evaluación con sus calificaciones.
 * Acceso: PÚBLICO (evaluador anónimo, sin cuenta).
 *
 * Body esperado:
 * {
 *   nombre: string,
 *   apellido: string,
 *   email: string,
 *   comentario?: string,
 *   calificaciones: [{ parametro_id: number, valor: number, observacion?: string }]
 * }
 */
export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

  // TODO: parsear body con request.json()
  // TODO: validar con validateEvaluacionBody(body)
  // TODO: insertar evaluación → obtener id → insertar calificaciones

  return NextResponse.json({ message: "POST /api/evaluaciones — pendiente" }, { status: 201 });
}
