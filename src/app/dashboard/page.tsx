import { redirect } from "next/navigation";

import { getCurrentUser, getUserProfile } from "@/lib/supabase/auth";
import { ROLE_HOME } from "@/types/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const profile = await getUserProfile();

  if (!profile) redirect("/login?error=profile");

  redirect(ROLE_HOME[profile.role]);
}
