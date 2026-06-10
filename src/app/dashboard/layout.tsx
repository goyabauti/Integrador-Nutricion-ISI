import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/server/supabase/server";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { NoRoleAccess } from "@/components/dashboard/NoRoleAccess";

export const metadata = {
  title: "Dashboard — Nutridín",
  description: "Panel de métricas y resultados de evaluaciones sensoriales",
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!userRole) {
    return <NoRoleAccess userEmail={user.email || ""} />;
  }

  return (
    <DashboardShell
      userEmail={user.email || ""}
      userRole={userRole.role}
    >
      {children}
    </DashboardShell>
  );
}
