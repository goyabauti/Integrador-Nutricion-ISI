import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase
    .from("profiles").select("rol").eq("id", user.id).single();
  if (profile?.rol === "admin") redirect("/admin");
  redirect("/evaluar");
}
