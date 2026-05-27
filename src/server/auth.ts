import { createServerSupabaseClient } from "@/server/supabase/server";
import type { UserRole } from "@/types";

/**
 * Obtiene el rol de admin del usuario actual a partir de la sesión.
 * Retorna null si no hay sesión o no es admin.
 */
export async function getCurrentAdmin(): Promise<UserRole | null> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userRole } = await supabase
    .from("user_roles")
    .select("*")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .single();

  if (!userRole) return null;

  return userRole as UserRole;
}

/**
 * Verifica que el usuario actual sea admin.
 * Retorna el UserRole si es admin, o null si no lo es / no hay sesión.
 */
export async function requireAdmin(): Promise<UserRole | null> {
  return getCurrentAdmin();
}
