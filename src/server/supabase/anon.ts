import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase para operaciones públicas/anónimas en el server.
 * NO usa cookies ni sesiones — opera siempre con el rol "anon".
 * Usar para: insertar respondents, responses, comments de forma pública.
 */
export function createAnonSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
