import { createServerSupabaseClient } from "@/server/supabase/server";
import type { Profile } from "@/types";

/**
 * Obtiene el perfil de admin del usuario actual a partir de la sesión.
 * Retorna null si no hay sesión o no es admin.
 */
export async function getCurrentAdmin(): Promise<Profile | null> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.rol !== "admin") return null;

  return profile as Profile;
}

/**
 * Verifica que el usuario actual sea admin.
 * Retorna el perfil si es admin, o null si no lo es / no hay sesión.
 */
export async function requireAdmin(): Promise<Profile | null> {
  return getCurrentAdmin();
}
