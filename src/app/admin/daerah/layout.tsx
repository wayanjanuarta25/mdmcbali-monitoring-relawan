import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/shell/dashboard-shell";
import { requireAuth } from "@/lib/auth/current-user";

export const metadata: Metadata = {
  title: "MDMC Daerah Bali - Volunteer Management System",
};

export default async function DaerahLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce ADMIN_DAERAH or ADMIN_WILAYAH_BALI role at layout level
  const profile = await requireAuth(["ADMIN_DAERAH", "ADMIN_WILAYAH_BALI"]);

  return <DashboardShell profile={profile}>{children}</DashboardShell>;
}
