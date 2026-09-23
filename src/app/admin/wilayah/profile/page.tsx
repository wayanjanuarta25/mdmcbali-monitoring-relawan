import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";
import { AdminWilayahProfileView } from "@/components/dashboard/profile/admin-wilayah-profile-view";
import type { UserProfile } from "@/types/auth";

export const metadata: Metadata = {
  title: "Profile Admin Wilayah - MDMC Bali Volunteer Management System",
  description: "Manajemen profil dan identitas akun Admin Wilayah MDMC Bali.",
};

export default async function AdminWilayahProfilePage() {
  // 1. Enforce authentication and ADMIN_WILAYAH_BALI role
  const authProfile = await requireAuth(["ADMIN_WILAYAH_BALI"]);
  const supabase = await createClient();

  // 2. Fetch fresh profile data directly from public.profiles
  const { data: dbProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authProfile.id)
    .single();

  const profile: UserProfile = dbProfile
    ? {
        id: dbProfile.id,
        email: dbProfile.email,
        full_name: dbProfile.full_name,
        username:
          ((dbProfile as { username?: string | null }).username) ||
          authProfile.username ||
          "admin_bali",
        role: dbProfile.role,
        district_id: dbProfile.district_id,
        phone: dbProfile.phone,
        avatar_url: dbProfile.avatar_url,
        province: ((dbProfile as { province?: string | null }).province) || "Bali",
        is_active: dbProfile.is_active,
        last_login_at: dbProfile.last_login_at,
        created_at: dbProfile.created_at,
        updated_at: dbProfile.updated_at,
      }
    : authProfile;

  return <AdminWilayahProfileView profile={profile} />;
}
