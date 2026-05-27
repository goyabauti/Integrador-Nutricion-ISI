import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/server/supabase/server";

/**
 * GET /api/parametros
 * Devuelve todos los parámetros activos, ordenados.
 * Acceso: PÚBLICO (necesario para que el evaluador anónimo vea el formulario).
 */
export async function GET() {
  const supabase = await createServerSupabaseClient();

  // TODO: implementar lógica de listado de parámetros
  // const { data, error } = await supabase
  //   .from("parametros")
  //   .select("*")
  //   .eq("activo", true)
  //   .order("ficha")
  //   .order("orden");

  return NextResponse.json({ message: "GET /api/parametros — pendiente" });
}

/**
 * POST /api/parametros
 * Crea un nuevo parámetro.
 * Acceso: solo admin.
 */
export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

  // TODO: verificar que es admin con requireAdmin()
  // TODO: validar body y crear parámetro

  return NextResponse.json({ message: "POST /api/parametros — pendiente" }, { status: 201 });
}
