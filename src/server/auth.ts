import { createServerSupabaseClient } from "@/server/supabase/server";
import type { UserRole } from "@/types";

/**
 * Obtiene el usuario actual con su rol (admin o nutri).
 * Retorna null si no hay sesión o no tiene un rol asignado.
 */
export async function getCurrentUser(): Promise<UserRole | null> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userRole } = await supabase
    .from("user_roles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!userRole) return null;

  return userRole as UserRole;
}

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
 * Verifica que el usuario actual tenga un rol válido (admin o nutri).
 * Usado para proteger el dashboard (ambos roles tienen acceso).
 */
export async function requireAuth(): Promise<UserRole | null> {
  return getCurrentUser();
}

/**
 * Verifica que el usuario actual sea admin.
 * Retorna el UserRole si es admin, o null si no lo es / no hay sesión.
 */
export async function requireAdmin(): Promise<UserRole | null> {
  return getCurrentAdmin();
}
