import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para uso en el browser (Client Components).
 * Usa @supabase/ssr para manejar cookies correctamente,
 * permitiendo que el middleware y Server Components lean la sesión.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}