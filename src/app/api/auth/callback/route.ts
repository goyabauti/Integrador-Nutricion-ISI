import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/server/supabase/server";

/**
 * GET /api/auth/callback
 * Callback de Supabase Auth.
 * Intercambia el code por una sesión y redirige al usuario.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Si no hay code o hubo error, redirigir al login
  return NextResponse.redirect(`${origin}/login`);
}
