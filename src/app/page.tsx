import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/server/supabase/server";

export default async function Home() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Si es admin logueado, ir al panel admin
  if (user) {
    const { data: userRole } = await supabase
      .from("user_roles").select("role").eq("user_id", user.id).single();
    if (userRole?.role === "admin" || userRole?.role === "nutri") redirect("/dashboard");
  }

  // Si no está logueado (evaluador anónimo), ir al formulario de evaluación
  redirect("/evaluar");
}
