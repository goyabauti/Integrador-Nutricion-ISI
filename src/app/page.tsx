import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/server/supabase/server";

export default async function Home() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Si es admin logueado, ir al panel admin
  if (user) {
    const { data: profile } = await supabase
      .from("profiles").select("rol").eq("id", user.id).single();
    if (profile?.rol === "admin") redirect("/admin");
  }

  // Si no está logueado (evaluador anónimo), ir al formulario de evaluación
  redirect("/evaluar");
}
