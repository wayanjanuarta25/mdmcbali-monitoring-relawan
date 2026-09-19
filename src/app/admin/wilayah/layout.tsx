import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/shell/dashboard-shell";
import { requireAuth } from "@/lib/auth/current-user";

export const metadata: Metadata = {
  title: "MDMC Wilayah Bali - Volunteer Management System",
};

export default async function WilayahLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce ADMIN_WILAYAH_BALI role at layout level
  const profile = await requireAuth(["ADMIN_WILAYAH_BALI"]);

  return <DashboardShell profile={profile}>{children}</DashboardShell>;
}
