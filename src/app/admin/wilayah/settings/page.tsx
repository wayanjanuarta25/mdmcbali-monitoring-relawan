import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/current-user";
import { AdminWilayahSettingsView } from "@/components/dashboard/settings/admin-wilayah-settings-view";
import { getUserSettingsAction } from "@/app/admin/wilayah/settings/actions";

export const metadata: Metadata = {
  title: "Settings - MDMC Bali Volunteer Management System",
  description: "Pengaturan keamanan akun dan preferensi notifikasi Admin Wilayah Bali.",
};

export default async function AdminWilayahSettingsPage() {
  // 1. Enforce authentication and ADMIN_WILAYAH_BALI role
  const profile = await requireAuth(["ADMIN_WILAYAH_BALI"]);

  // 2. Fetch current notification preferences from user_settings
  const initialSettings = await getUserSettingsAction();

  return (
    <AdminWilayahSettingsView
      profile={profile}
      initialSettings={initialSettings}
    />
  );
}
