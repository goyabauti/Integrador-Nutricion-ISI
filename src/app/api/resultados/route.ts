import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/server/supabase/server";

/**
 * GET /api/resultados
 * Devuelve estadísticas y resultados agregados de las evaluaciones.
 * Acceso: solo admin.
 *
 * Respuesta esperada:
 * {
 *   totalEvaluaciones: number,
 *   totalEvaluadores: number,
 *   promediosPorParametro: [{ parametro_id, nombre, ficha, promedio }],
 *   distribucionHedonica: Record<number, number>
 * }
 */
export async function GET() {
  const supabase = await createServerSupabaseClient();

  // TODO: verificar que es admin
  // TODO: calcular estadísticas agregadas

  return NextResponse.json({ message: "GET /api/resultados — pendiente" });
}
